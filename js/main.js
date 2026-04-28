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
