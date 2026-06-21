/* =========================================================
   RAKA.EDITS — interactions
========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) document.documentElement.classList.add('reduced-motion');

  var isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------------- Loading screen ---------------- */
  (function loaderInit() {
    var loader = document.getElementById('loader');
    var fill = document.getElementById('loaderFill');
    var percent = document.getElementById('loaderPercent');
    var progress = 0;
    var target = 0;

    var tick = setInterval(function () {
      target = Math.min(100, target + Math.random() * 18 + 6);
      progress += (target - progress) * 0.4;
      var shown = Math.min(100, Math.round(progress));
      fill.style.width = shown + '%';
      percent.textContent = (shown < 10 ? '0' : '') + shown + '%';
      if (shown >= 100) clearInterval(tick);
    }, 140);

    window.addEventListener('load', function () {
      setTimeout(function () {
        fill.style.width = '100%';
        percent.textContent = '100%';
        setTimeout(function () {
          loader.classList.add('is-hidden');
          document.body.classList.add('loaded');
        }, 280);
      }, 500);
    });

    // Safety net in case 'load' is slow/blocked
    setTimeout(function () {
      loader.classList.add('is-hidden');
    }, 4500);
  })();

  /* ---------------- Custom cursor ---------------- */
  if (!isTouch) {
    var dot = document.getElementById('cursorDot');
    var ring = document.getElementById('cursorRing');
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    window.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
    });

    function raf() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px) translate(-50%,-50%)';
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    var hoverables = 'a, button, .work-card, input, textarea, .carousel-arrow, .id-card';
    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(hoverables)) ring.classList.add('hovering');
    });
    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(hoverables)) ring.classList.remove('hovering');
    });
  }

  /* ---------------- Floating particles ---------------- */
  (function particles() {
    var canvas = document.getElementById('particles');
    var ctx = canvas.getContext('2d');
    var w, h, dots = [];
    var COUNT = window.innerWidth < 640 ? 26 : 54;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function makeDot() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.6,
        vy: -(Math.random() * 0.25 + 0.06),
        vx: (Math.random() - 0.5) * 0.12,
        a: Math.random() * 0.5 + 0.15
      };
    }
    for (var i = 0; i < COUNT; i++) dots.push(makeDot());

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(196,165,255,1)';
      dots.forEach(function (d) {
        ctx.globalAlpha = d.a;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
        d.y += d.vy;
        d.x += d.vx;
        if (d.y < -10) { d.y = h + 10; d.x = Math.random() * w; }
        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;
      });
      ctx.globalAlpha = 1;
      if (!reduceMotion) requestAnimationFrame(draw);
    }
    draw();
  })();

  /* ---------------- Hero preview canvas (waveform) ---------------- */
  (function previewWaveform() {
    var canvas = document.getElementById('previewCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w, h;

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      w = rect.width; h = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);

    var bars = 46;
    var seeds = [];
    for (var i = 0; i < bars; i++) seeds.push(Math.random());

    var t = 0;
    function draw() {
      t += 0.025;
      ctx.clearRect(0, 0, w, h);
      var gap = w / bars;
      for (var i = 0; i < bars; i++) {
        var n = Math.sin(t + seeds[i] * 8) * 0.5 + 0.5;
        var bh = (0.12 + n * 0.65) * h * 0.5;
        var x = i * gap + gap * 0.25;
        var grad = ctx.createLinearGradient(0, h / 2 - bh, 0, h / 2 + bh);
        grad.addColorStop(0, 'rgba(196,165,255,0.85)');
        grad.addColorStop(1, 'rgba(124,58,237,0.35)');
        ctx.fillStyle = grad;
        ctx.fillRect(x, h / 2 - bh, gap * 0.5, bh * 2);
      }
      if (!reduceMotion) requestAnimationFrame(draw);
    }
    draw();

    /* Playhead + timecode driven by a single timer */
    var playhead = document.getElementById('playhead');
    var timecodeEl = document.getElementById('heroTimecode');
    var cycleMs = 24000; // 24 "seconds" of footage per loop
    var start = performance.now();

    function pad(n) { return (n < 10 ? '0' : '') + n; }

    function loop(now) {
      var elapsed = (now - start) % cycleMs;
      var progress = elapsed / cycleMs;
      if (playhead) playhead.style.left = (progress * 100) + '%';
      if (timecodeEl) {
        var totalFrames = Math.floor((elapsed / 1000) * 24);
        var sec = Math.floor(totalFrames / 24);
        var frame = totalFrames % 24;
        var mm = Math.floor(sec / 60);
        var ss = sec % 60;
        timecodeEl.textContent = '00:' + pad(mm) + ':' + pad(ss) + ':' + pad(frame);
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);

    var playBtn = document.getElementById('playBtn');
    if (playBtn) {
      playBtn.addEventListener('click', function () {
        playBtn.style.transform = 'translate(-50%,-50%) scale(.85)';
        setTimeout(function () { playBtn.style.transform = ''; }, 180);
      });
    }
  })();

  /* ---------------- Header scroll state + active nav ---------------- */
  (function headerScroll() {
    var header = document.getElementById('siteHeader');
    var sections = document.querySelectorAll('main section[id]');
    var navLinks = document.querySelectorAll('[data-nav]');
    var backToTop = document.getElementById('backToTop');

    function onScroll() {
      var y = window.scrollY;
      header.classList.toggle('scrolled', y > 40);
      if (backToTop) backToTop.style.opacity = y > 600 ? '1' : '0';

      var current = '';
      sections.forEach(function (sec) {
        var top = sec.offsetTop - 140;
        if (y >= top) current = sec.id;
      });
      navLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTop) {
      backToTop.style.transition = 'opacity .3s ease, transform .3s ease';
      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
  })();

  /* ---------------- Mobile menu ---------------- */
  (function mobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var menu = document.getElementById('mobileMenu');
    if (!hamburger || !menu) return;

    function close() {
      hamburger.classList.remove('is-open');
      menu.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    hamburger.addEventListener('click', function () {
      var open = hamburger.classList.toggle('is-open');
      menu.classList.toggle('is-open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('[data-nav-mobile]').forEach(function (a) {
      a.addEventListener('click', close);
    });
  })();

  /* ---------------- Smooth scroll for in-page anchors ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------------- Scroll reveal ---------------- */
  (function revealInit() {
    var items = document.querySelectorAll('[data-reveal]');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = el.getAttribute('data-reveal-delay');
          setTimeout(function () {
            el.classList.add('in-view');
          }, delay ? parseInt(delay, 10) : 0);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------- Animated counters (Statistics) ---------------- */
  (function counters() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseFloat(el.getAttribute('data-count'));
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 1700;
        var startTime = null;

        function step(ts) {
          if (!startTime) startTime = ts;
          var p = Math.min(1, (ts - startTime) / duration);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = Math.floor(eased * target);
          el.textContent = val.toLocaleString('id-ID') + suffix;
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target.toLocaleString('id-ID') + suffix;
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });

    nums.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------- Skill bars reveal ---------------- */
  (function skillBars() {
    var cards = document.querySelectorAll('.skill-card');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    cards.forEach(function (c) { io.observe(c); });
  })();

  /* ---------------- Parallax (light) ---------------- */
  if (!isTouch && !reduceMotion) {
    var glowA = document.querySelector('.hero-glow-a');
    var glowB = document.querySelector('.hero-glow-b');
    window.addEventListener('mousemove', function (e) {
      var px = (e.clientX / window.innerWidth - 0.5);
      var py = (e.clientY / window.innerHeight - 0.5);
      if (glowA) glowA.style.transform = 'translate(' + px * 30 + 'px,' + py * 30 + 'px)';
      if (glowB) glowB.style.transform = 'translate(' + px * -26 + 'px,' + py * -26 + 'px)';
    });
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (glowA) glowA.style.marginTop = (y * 0.08) + 'px';
      if (glowB) glowB.style.marginTop = (y * 0.05) + 'px';
    }, { passive: true });
  }

  /* ---------------- Work cards -> Modal ---------------- */
  (function workModal() {
    var cards = document.querySelectorAll('.work-card');
    var overlay = document.getElementById('workModal');
    var closeBtn = document.getElementById('modalClose');
    if (!overlay) return;

    var thumb = document.getElementById('modalThumb');
    var titleEl = document.getElementById('modalTitle');
    var categoryEl = document.getElementById('modalCategory');
    var descEl = document.getElementById('modalDesc');
    var durationEl = document.getElementById('modalDuration');
    var tagsEl = document.getElementById('modalTags');
    var lastFocused = null;

    function openModal(card) {
      var thumbEl = card.querySelector('.work-thumb');
      var c1 = getComputedStyle(thumbEl).getPropertyValue('--c1').trim();
      var c2 = getComputedStyle(thumbEl).getPropertyValue('--c2').trim();
      thumb.style.background = 'radial-gradient(circle at 30% 20%,' + c1 + ',' + c2 + ' 75%)';

      titleEl.textContent = card.getAttribute('data-title') || '';
      categoryEl.textContent = card.getAttribute('data-category') || '';
      descEl.textContent = card.getAttribute('data-desc') || '';
      durationEl.textContent = card.getAttribute('data-duration') || '';

      var tags = (card.getAttribute('data-tags') || '').split(',').map(function (t) { return t.trim(); }).filter(Boolean);
      tagsEl.innerHTML = '';
      tags.forEach(function (t) {
        var span = document.createElement('span');
        span.textContent = t;
        tagsEl.appendChild(span);
      });

      lastFocused = document.activeElement;
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      closeBtn.focus();
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    cards.forEach(function (card) {
      card.addEventListener('click', function () { openModal(card); });
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); }
      });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeModal();
    });
  })();

  /* ---------------- Testimonials carousel ---------------- */
  (function carousel() {
    var track = document.getElementById('carouselTrack');
    if (!track) return;
    var slides = track.children;
    var dotsWrap = document.getElementById('carouselDots');
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');
    var index = 0;
    var timer = null;
    var AUTOPLAY_MS = 5500;

    for (var i = 0; i < slides.length; i++) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      (function (idx) {
        dot.addEventListener('click', function () { goTo(idx); restart(); });
      })(i);
      dotsWrap.appendChild(dot);
    }

    function render() {
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      var dots = dotsWrap.children;
      for (var d = 0; d < dots.length; d++) dots[d].classList.toggle('active', d === index);
    }

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function start() {
      if (reduceMotion) return;
      timer = setInterval(next, AUTOPLAY_MS);
    }
    function stop() { clearInterval(timer); }
    function restart() { stop(); start(); }

    nextBtn.addEventListener('click', function () { next(); restart(); });
    prevBtn.addEventListener('click', function () { prev(); restart(); });

    var carouselEl = track.closest('.carousel');
    carouselEl.addEventListener('mouseenter', stop);
    carouselEl.addEventListener('mouseleave', start);
    carouselEl.addEventListener('focusin', stop);
    carouselEl.addEventListener('focusout', start);

    render();
    start();
  })();

  /* ---------------- Contact form (front-end only) ---------------- */
  (function contactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    var submitBtn = document.getElementById('formSubmit');
    var status = document.getElementById('formStatus');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      submitBtn.classList.add('is-loading');
      status.textContent = '';

      setTimeout(function () {
        submitBtn.classList.remove('is-loading');
        status.textContent = 'Pesan terkirim! Saya akan balas secepatnya ✓';
        form.reset();
      }, 1200);
    });
  })();

})();
