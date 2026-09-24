// Mobile navigation toggle
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!toggle || !nav) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
    nav.classList.toggle('is-open', open);
  }

  toggle.addEventListener('click', function () {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // Close the menu after following an in-page link
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
})();

// Photo strip – auto-scrolling marquee (left as a manual scroller when the
// visitor prefers reduced motion)
(function () {
  var strip = document.querySelector('[data-marquee]');
  if (!strip) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var track = strip.querySelector('.photo-strip__track');
  var pause = strip.querySelector('.photo-strip__pause');

  // Second copy of the images so the loop is seamless; hidden from assistive tech
  Array.prototype.slice.call(track.children).forEach(function (img) {
    var clone = img.cloneNode(true);
    clone.alt = '';
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  track.removeAttribute('tabindex');
  strip.classList.add('is-animated');
  pause.hidden = false;

  pause.addEventListener('click', function () {
    var paused = pause.getAttribute('aria-pressed') !== 'true';
    pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute('aria-label', paused ? 'Bildlauf fortsetzen' : 'Bildlauf anhalten');
    strip.classList.toggle('is-paused', paused);
  });
})();

// FAQ accordion – one answer open at a time
(function () {
  var toggles = document.querySelectorAll('.faq__toggle');

  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var wasOpen = btn.getAttribute('aria-expanded') === 'true';

      toggles.forEach(function (other) {
        other.setAttribute('aria-expanded', 'false');
        document.getElementById(other.getAttribute('aria-controls')).hidden = true;
        other.querySelector('.faq__icon').textContent = '+';
      });

      if (!wasOpen) {
        btn.setAttribute('aria-expanded', 'true');
        document.getElementById(btn.getAttribute('aria-controls')).hidden = false;
        btn.querySelector('.faq__icon').textContent = '−';
      }
    });
  });
})();
