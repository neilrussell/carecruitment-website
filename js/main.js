// Nav mobile toggle
(function () {
  var btn = document.getElementById('nav-hamburger');
  var menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', function () {
    var isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

// FAQ accordion
function toggleFaq(btn) {
  var item = btn.closest('.faq-item');
  var isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item.open').forEach(function (el) {
    el.classList.remove('open');
  });

  // Open clicked if it was closed
  if (!isOpen) {
    item.classList.add('open');
  }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Sticky nav shadow on scroll
(function () {
  var nav = document.querySelector('.site-nav');
  if (!nav) return;
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
})();

// Mobile sticky CTA bar
(function () {
  var bar = document.createElement('div');
  bar.className = 'mobile-sticky-cta';
  bar.setAttribute('role', 'navigation');
  bar.setAttribute('aria-label', 'Quick contact');
  bar.innerHTML =
    '<a href="tel:+353894166124" class="mobile-sticky-btn mobile-sticky-btn-call" aria-label="Call CA Recruitment">' +
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>' +
    'Call Now</a>' +
    '<a href="https://wa.me/353894166124?text=Hi%2C%20I%27m%20looking%20to%20hire%20Filipino%20workers%20for%20my%20business.%20Can%20you%20help%3F" target="_blank" rel="noopener" class="mobile-sticky-btn mobile-sticky-btn-wa" aria-label="WhatsApp CA Recruitment">' +
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.012.527 3.903 1.438 5.543L0 24l6.644-1.398A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.66-.49-5.196-1.347l-.372-.214-3.846.81.818-3.755-.234-.387A9.974 9.974 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>' +
    'WhatsApp Us</a>';
  document.body.appendChild(bar);
})();

// Contact form submission
(function () {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (form.querySelector('[name="bot-field"]').value) return;

    var btn = document.getElementById('contact-submit');
    var feedback = document.getElementById('form-feedback');

    var name = form.querySelector('[name="full-name"]').value.trim();
    var email = form.querySelector('[name="email"]').value.trim();
    var message = form.querySelector('[name="message"]').value.trim();
    var consent = form.querySelector('[name="consent"]').checked;

    if (!name || !email || !message || !consent) {
      feedback.textContent = 'Please fill in all required fields and accept the consent checkbox.';
      feedback.style.color = '#c0392b';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';
    feedback.textContent = '';

    // Submit to Netlify Forms (handles email notifications + spam filtering)
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(new FormData(form)).toString(),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Network error');
        form.innerHTML =
          '<div style="text-align:center;padding:32px 0;">' +
          '<div style="font-size:42px;margin-bottom:12px;color:#32d583;">&#10003;</div>' +
          '<h3 style="margin:0 0 10px;color:#1a2744;">Message sent!</h3>' +
          '<p style="color:#555;margin:0;">Thanks ' + name.split(' ')[0] + ', we will be in touch shortly.</p>' +
          '</div>';
      })
      .catch(function () {
        feedback.textContent =
          'Something went wrong — please call us on +353 89 416 6124 or WhatsApp.';
        feedback.style.color = '#c0392b';
        btn.disabled = false;
        btn.textContent = 'Send Message';
      });
  });
})();

// Cookie consent banner
(function () {
  var CONSENT_KEY = 'ca_cookie_consent';
  var consent = localStorage.getItem(CONSENT_KEY);
  if (consent) return; // already decided

  var banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.innerHTML =
    '<p>We use cookies and Google Analytics to understand how our site is used and improve your experience. ' +
    'See our <a href="/privacy/">Privacy Policy</a>.</p>' +
    '<div class="cookie-btns">' +
    '<button class="cookie-btn-accept" id="cookie-accept">Accept</button>' +
    '<button class="cookie-btn-decline" id="cookie-decline">Decline</button>' +
    '</div>';
  document.body.appendChild(banner);

  function dismiss(accepted) {
    localStorage.setItem(CONSENT_KEY, accepted ? 'accepted' : 'declined');
    banner.classList.add('hidden');
    setTimeout(function () { banner.remove(); }, 350);
  }

  document.getElementById('cookie-accept').addEventListener('click', function () { dismiss(true); });
  document.getElementById('cookie-decline').addEventListener('click', function () { dismiss(false); });
})();
