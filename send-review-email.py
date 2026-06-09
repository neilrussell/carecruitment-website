#!/usr/bin/env python3
"""
Send Monette's "new CA blog live — please review" email via Postmark.

Reuses the exact email format/sender that was used on 8 June 2026
(From: neil@madscopemarketing.com — confirmed Postmark sender signature).

The post URL is BUILT FROM THE SLUG so it can never drift to the wrong
domain or a truncated slug again:  https://carecruitment.com/blog/<slug>/

Usage:
  set -a && source /Users/neilrussell/neil_claude_work/.env && set +a
  python3 send-review-email.py --slug staff-shortage-ireland-hiring-overseas-workers \
                               --title "Staff Shortage Ireland: Your Options for Hiring Overseas Workers" \
                               --to monette@carecruitment.com \
                               [--preview]   # adds the "[PREVIEW ...]" banner + subject prefix

Wired into the carecruitment-content skill Phase 8 (called on every publish).
"""
import argparse, json, os, sys, urllib.request

BASE = "https://carecruitment.com"          # production domain — .ie does NOT resolve, never use it
FROM = "neil@madscopemarketing.com"          # Postmark confirmed sender signature

def send(slug, title, to, preview):
    token = os.environ.get("POSTMARK_SERVER_TOKEN")
    if not token:
        sys.exit("POSTMARK_SERVER_TOKEN not set — run: set -a && source .env && set +a")

    url = f"{BASE}/blog/{slug.strip('/')}/"
    banner = ('<p style="color:#b00"><b>This is a PREVIEW of what Monette will '
              'receive after each CA post goes live.</b></p>') if preview else ""
    subject = ("[PREVIEW of Monette review email] " if preview else "") + \
              f"Review: new CA blog live — {title}"

    html = (
        '<div style="font-family:-apple-system,Segoe UI,sans-serif;max-width:620px">'
        f'{banner}'
        '<h2 style="margin:0 0 4px">New CA blog post published — for your review</h2>'
        '<p style="color:#555">Neil approved the topic this morning; it has been written, '
        'three-way fact-checked, and is now live. Please read it and reply with any corrections.</p>'
        f'<p style="font-size:17px"><b>{title}</b></p>'
        f'<p><a href="{url}" style="background:#1a73e8;color:#fff;padding:10px 18px;'
        f'border-radius:6px;text-decoration:none">Read the live post &rarr;</a></p>'
        f'<p style="color:#888;font-size:13px">{url}</p>'
        '</div>'
    )

    payload = json.dumps({
        "From": FROM, "To": to, "Subject": subject,
        "HtmlBody": html, "MessageStream": "outbound",
    }).encode()

    req = urllib.request.Request(
        "https://api.postmarkapp.com/email", data=payload, method="POST",
        headers={"Accept": "application/json", "Content-Type": "application/json",
                 "X-Postmark-Server-Token": token},
    )
    try:
        with urllib.request.urlopen(req) as r:
            res = json.load(r)
        print(f"Sent OK → {to}  |  link: {url}  |  MessageID: {res.get('MessageID')}")
    except urllib.error.HTTPError as e:
        sys.exit(f"Postmark error {e.code}: {e.read().decode()}")

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--slug", required=True)
    p.add_argument("--title", required=True)
    p.add_argument("--to", required=True)
    p.add_argument("--preview", action="store_true")
    a = p.parse_args()
    send(a.slug, a.title, a.to, a.preview)
