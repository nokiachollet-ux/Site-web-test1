/* =========================================================
   MasterIA — animations (GSAP + ScrollTrigger)
   ========================================================= */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  var loader = document.querySelector('.loader');

  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Menu mobile ---------- */
  var gnav = document.querySelector('.gnav');
  var burger = document.querySelector('.gnav__burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = gnav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    gnav.querySelectorAll('.gnav__mobile a').forEach(function (a) {
      a.addEventListener('click', function () { gnav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); });
    });
  }

  /* ---------- Sphère de particules (Hero) ---------- */
  var orb = { spread: 1, scale: 1, rotSpeed: 1, alpha: 1 };
  var canvas = document.querySelector('.hero__canvas');
  if (canvas && canvas.getContext) initOrb(canvas);

  function initOrb(cv) {
    var ctx = cv.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = 0, H = 0, R = 0;
    var N = window.innerWidth < 700 ? 900 : 1600;
    var pts = [];
    var golden = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < N; i++) {
      var y = 1 - (i / (N - 1)) * 2;
      var r = Math.sqrt(1 - y * y);
      var th = golden * i;
      pts.push({
        x: Math.cos(th) * r, y: y, z: Math.sin(th) * r,
        // position de départ dispersée pour l'entrée
        sx: (Math.random() - 0.5) * 6, sy: (Math.random() - 0.5) * 6, sz: (Math.random() - 0.5) * 6,
        s: Math.random()
      });
    }
    var rotY = 0, rotX = 0.35, tX = 0, tY = 0, mX = 0, mY = 0;
    var visible = true;

    function resize() {
      var rect = cv.getBoundingClientRect();
      W = rect.width; H = rect.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      R = Math.min(W * 0.34, H * 0.25, 300);
    }
    resize();
    window.addEventListener('resize', resize);

    window.addEventListener('pointermove', function (e) {
      tX = (e.clientX / window.innerWidth - 0.5);
      tY = (e.clientY / window.innerHeight - 0.5);
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(cv);
    }

    function frame() {
      requestAnimationFrame(frame);
      if (!visible) return;
      mX += (tX - mX) * 0.05; mY += (tY - mY) * 0.05;
      rotY += (reduceMotion ? 0 : 0.0022) * orb.rotSpeed;
      var ry = rotY + mX * 0.6, rx = rotX + mY * 0.4;
      var cy = Math.cos(ry), sy = Math.sin(ry), cx = Math.cos(rx), sx = Math.sin(rx);
      var cxp = W / 2, cyp = H * (W < 700 ? 0.33 : 0.36);
      var rad = R * orb.scale;
      var k = orb.spread; // 0 = sphère, 1 = dispersé

      ctx.clearRect(0, 0, W, H);
      if (orb.alpha <= 0.01) return;

      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        var x = p.x + (p.sx - p.x) * k, y = p.y + (p.sy - p.y) * k, z = p.z + (p.sz - p.z) * k;
        // rotation Y puis X
        var x1 = x * cy - z * sy, z1 = x * sy + z * cy;
        var y1 = y * cx - z1 * sx, z2 = y * sx + z1 * cx;
        var persp = 2.6 / (2.6 + z2);
        var px = cxp + x1 * rad * persp, py = cyp + y1 * rad * persp;
        var depth = (1 - z2) / 2; // 0 (loin) → 1 (proche)
        var a = (0.08 + depth * 0.85) * orb.alpha;
        var size = (0.5 + depth * 1.3 + p.s * 0.4) * persp;
        // teinte : bleu au fond, porcelaine devant
        var rC = Math.round(41 + (245 - 41) * depth), gC = Math.round(151 + (245 - 151) * depth), bC = Math.round(255 - 8 * depth);
        ctx.fillStyle = 'rgba(' + rC + ',' + gC + ',' + bC + ',' + a.toFixed(3) + ')';
        ctx.fillRect(px, py, size, size);
      }
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Repli sans GSAP ou mouvement réduit ---------- */
  if (!hasGsap || reduceMotion) {
    orb.spread = 0;
    if (loader) loader.classList.add('is-done');
    document.body.classList.remove('is-loading');
    document.querySelectorAll('.typing').forEach(function (el) { el.textContent = el.dataset.text; });
    document.querySelectorAll('.manifesto__text').forEach(function (el) { el.style.opacity = 1; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  document.body.classList.add('is-loading');

  /* ---------- Découpe du manifeste en mots ---------- */
  document.querySelectorAll('[data-split]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
  });

  /* ---------- Broches de la puce ---------- */
  var pinsG = document.querySelector('.chip__pins');
  if (pinsG) {
    var ns = 'http://www.w3.org/2000/svg', html = '';
    for (var i = 0; i < 8; i++) {
      var o = 88 + i * 17.7;
      html += '<line x1="' + o + '" y1="70" x2="' + o + '" y2="44"/><line x1="' + o + '" y1="230" x2="' + o + '" y2="256"/>' +
              '<line x1="70" y1="' + o + '" x2="44" y2="' + o + '"/><line x1="230" y1="' + o + '" x2="256" y2="' + o + '"/>';
    }
    pinsG.innerHTML = html;
  }

  /* ---------- Introduction ---------- */
  var intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
  gsap.set('.hero__content .mask > span', { yPercent: 115 });
  gsap.set('.hero__cta > *', { y: 24, opacity: 0 });
  gsap.set('.hero__halo', { scale: 0.4, opacity: 0 });
  gsap.set('.lnav, .strip, .gnav__inner', { opacity: 0 });
  gsap.set('.hero__scroll', { opacity: 0 });

  intro
    .from('.loader__word span', { yPercent: 110, duration: 0.9, stagger: 0.04 })
    .to('.loader__bar i', { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, '-=0.6')
    .to('.loader__word span', { yPercent: -110, duration: 0.6, stagger: 0.025, ease: 'expo.in' }, '+=0.1')
    .to('.loader__bar', { opacity: 0, duration: 0.3 }, '<')
    .to('.loader', { opacity: 0, duration: 0.5, ease: 'power2.out', onComplete: function () {
        loader.classList.add('is-done'); document.body.classList.remove('is-loading');
      } })
    .addLabel('stage', '-=0.3')
    .to(orb, { spread: 0, duration: 2.6, ease: 'expo.inOut' }, 'stage-=0.6')
    .fromTo(orb, { rotSpeed: 12 }, { rotSpeed: 1, duration: 3, ease: 'power3.out' }, 'stage-=0.6')
    .to('.hero__halo', { scale: 1, opacity: 1, duration: 2.4 }, 'stage+=0.6')
    .to('.hero__label .mask > span', { yPercent: 0, duration: 1.2 }, 'stage+=1.0')
    .to('.hero__title .mask > span', { yPercent: 0, duration: 1.4, stagger: 0.12 }, 'stage+=1.1')
    .to('.hero__sub .mask > span', { yPercent: 0, duration: 1.2 }, 'stage+=1.4')
    .to('.hero__cta > *', { y: 0, opacity: 1, duration: 1, stagger: 0.1 }, 'stage+=1.6')
    .to('.gnav__inner, .strip, .lnav', { opacity: 1, duration: 1, stagger: 0.1 }, 'stage+=1.6')
    .to('.hero__scroll', { opacity: 1, duration: 1 }, 'stage+=2.2');

  // sécurité : ne jamais rester bloqué derrière le préchargeur
  setTimeout(function () { if (!loader.classList.contains('is-done')) intro.progress(1); }, 7000);

  /* ---------- Hero au défilement ---------- */
  gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  })
    .to(orb, { scale: 2.1, alpha: 0.15, ease: 'none' }, 0)
    .to('.hero__content', { yPercent: -30, opacity: 0, ease: 'none' }, 0)
    .to('.hero__halo', { scale: 1.8, opacity: 0, ease: 'none' }, 0)
    .to('.hero__scroll', { opacity: 0, duration: 0.15 }, 0);

  /* ---------- Manifeste : mots révélés ---------- */
  gsap.to('.manifesto__text .w', {
    opacity: 1, stagger: 0.08, ease: 'none',
    scrollTrigger: { trigger: '.manifesto__text', start: 'top 80%', end: 'bottom 45%', scrub: true }
  });
  gsap.from('.manifesto .eyebrow, .manifesto .link', {
    y: 24, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.1,
    scrollTrigger: { trigger: '.manifesto', start: 'top 75%' }
  });

  /* ---------- Révélations génériques ---------- */
  gsap.utils.toArray('.reveal').forEach(function (el) {
    gsap.from(el.children, {
      y: 48, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 82%' }
    });
  });

  gsap.utils.toArray('.reveal-frame').forEach(function (el, i) {
    gsap.from(el, {
      clipPath: 'inset(18% 8% 0% 8% round 28px)', y: 80, duration: 1.6, ease: 'expo.out', delay: i * 0.12,
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
    gsap.from(el.querySelectorAll('.frame__copy > *'), {
      y: 30, opacity: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.3 + i * 0.12,
      scrollTrigger: { trigger: el, start: 'top 75%' }
    });
  });

  gsap.utils.toArray('.parallax').forEach(function (el) {
    var speed = parseFloat(el.dataset.speed) || -0.1;
    gsap.fromTo(el, { yPercent: -speed * 100 }, {
      yPercent: speed * 100, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* Écran : rotation 3D au défilement + texte tapé */
  gsap.fromTo('.screen', { rotateX: 24, scale: 0.9 }, {
    rotateX: 0, scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.frame--learn', start: 'top bottom', end: 'center center', scrub: true }
  });
  var typing = document.querySelector('.typing');
  if (typing) {
    var txt = typing.dataset.text, typed = { n: 0 };
    gsap.to(typed, {
      n: txt.length, duration: 3.2, ease: 'none', delay: 0.6,
      scrollTrigger: { trigger: '.frame--learn', start: 'top 60%' },
      onUpdate: function () { typing.textContent = txt.slice(0, Math.round(typed.n)); }
    });
  }

  /* Puce : broches qui s'allument, rotation au défilement */
  gsap.fromTo('.chip', { rotate: -18, scale: 0.85 }, {
    rotate: 0, scale: 1, ease: 'none',
    scrollTrigger: { trigger: '.frame--manage', start: 'top bottom', end: 'center center', scrub: true }
  });
  gsap.fromTo('.chip__pins line', { stroke: '#333336' }, {
    stroke: '#2997ff', duration: 0.4, stagger: { each: 0.02, from: 'random', repeat: -1, yoyo: true, repeatDelay: 1.2 },
    scrollTrigger: { trigger: '.frame--manage', start: 'top 70%', toggleActions: 'play pause resume pause' }
  });
  gsap.to('.chip__glow', { scale: 1.25, opacity: 0.6, transformOrigin: '50% 50%', duration: 1.8, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  /* ---------- Programme : défilement horizontal épinglé ---------- */
  var track = document.querySelector('.program__track');
  function trackDistance() { return Math.max(0, track.scrollWidth - window.innerWidth + 32); }
  var hScroll = gsap.to(track, {
    x: function () { return -trackDistance(); },
    ease: 'none',
    scrollTrigger: {
      trigger: '.program', pin: '.program__pin', start: 'top top',
      end: function () { return '+=' + trackDistance(); },
      scrub: 0.8, invalidateOnRefresh: true,
      onUpdate: function (self) { gsap.set('.program__progress i', { scaleX: self.progress }); }
    }
  });
  gsap.utils.toArray('.course').forEach(function (c) {
    gsap.from(c, {
      opacity: 0.25, scale: 0.92, ease: 'none',
      scrollTrigger: { trigger: c, containerAnimation: hScroll, start: 'left 100%', end: 'left 65%', scrub: true }
    });
  });
  gsap.from('.program__head > *', {
    y: 48, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1,
    scrollTrigger: { trigger: '.program', start: 'top 75%' }
  });

  /* ---------- Panneau gestion ---------- */
  gsap.from('.panel', {
    scale: 0.94, borderRadius: 56, ease: 'none',
    scrollTrigger: { trigger: '.panel', start: 'top bottom', end: 'top 35%', scrub: true }
  });
  gsap.from('.tile', {
    y: 60, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: { each: 0.08, grid: 'auto', from: 'start' },
    scrollTrigger: { trigger: '.tiles', start: 'top 82%' }
  });
  gsap.from('.tile__icon', {
    scale: 0.4, rotate: -45, opacity: 0, duration: 1.2, ease: 'back.out(1.6)', stagger: 0.08,
    scrollTrigger: { trigger: '.tiles', start: 'top 75%' }
  });
  document.querySelectorAll('.tile').forEach(function (t) {
    t.addEventListener('pointermove', function (e) {
      var r = t.getBoundingClientRect();
      t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Méthode ---------- */
  gsap.to('.method__line i', {
    scaleY: 1, ease: 'none',
    scrollTrigger: { trigger: '.method__steps', start: 'top 60%', end: 'bottom 60%', scrub: true }
  });
  gsap.utils.toArray('.step').forEach(function (s) {
    gsap.from(s, {
      y: 60, opacity: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: s, start: 'top 85%' }
    });
    ScrollTrigger.create({
      trigger: s, start: 'top 60%', end: 'bottom 40%',
      onToggle: function (self) {
        gsap.to(s, { boxShadow: self.isActive ? 'rgb(41,151,255) 0 0 0 1px' : 'rgb(40,40,40) 0 0 0 1px', duration: 0.5 });
        gsap.to(s.querySelector('.step__num'), { color: self.isActive ? '#2997ff' : '#86868b', duration: 0.5 });
      }
    });
  });
  gsap.from('.method__sticky > *', {
    y: 48, opacity: 0, duration: 1.2, ease: 'expo.out', stagger: 0.1,
    scrollTrigger: { trigger: '.method', start: 'top 70%' }
  });

  /* ---------- Pour qui ---------- */
  gsap.from('.audience', {
    clipPath: 'inset(6% 4% 0% 4% round 28px)', ease: 'none',
    scrollTrigger: { trigger: '.audience', start: 'top bottom', end: 'top 30%', scrub: true }
  });
  gsap.utils.toArray('.reveal-card').forEach(function (c, i) {
    gsap.from(c, {
      y: 100, rotate: i ? 2 : -2, opacity: 0, duration: 1.4, ease: 'expo.out', delay: i * 0.12,
      scrollTrigger: { trigger: '.audience__grid', start: 'top 85%' }
    });
  });

  /* ---------- CTA : remplissage du titre ---------- */
  gsap.to('[data-fill]', {
    backgroundPosition: '0% 0', ease: 'none',
    scrollTrigger: { trigger: '.cta', start: 'top 70%', end: 'top 15%', scrub: true }
  });
  gsap.from('.cta__glow', {
    scale: 0.3, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.cta', start: 'top bottom', end: 'center center', scrub: true }
  });
  gsap.from('.cta__sub, .cta__actions, .contact-grid > div', {
    y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08,
    scrollTrigger: { trigger: '.cta__sub', start: 'top 85%' }
  });

  /* ---------- Navigation locale : lien actif ---------- */
  document.querySelectorAll('.lnav__link').forEach(function (link) {
    var target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    ScrollTrigger.create({
      trigger: target, start: 'top 50%', end: 'bottom 50%',
      onToggle: function (self) { link.classList.toggle('is-active', self.isActive); }
    });
  });

  /* ---------- Boutons magnétiques ---------- */
  if (window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      var xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
      var yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3);
        yTo((e.clientY - r.top - r.height / 2) * 0.4);
      });
      btn.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
    });
  }

  /* ---------- Ancres : défilement doux ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      var el = id === '#top' ? document.body : document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var y = id === '#top' ? 0 : el.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
