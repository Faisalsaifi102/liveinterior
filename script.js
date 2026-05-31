/* ============ Live Interior — interactions ============ */
(function () {
  'use strict';

  /* ---- Preloader ---- */
  window.addEventListener('load', () => {
    setTimeout(() => document.getElementById('preloader').classList.add('done'), 900);
  });

  /* ---- Year ---- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---- Navbar scroll state + progress ---- */
  const navbar = document.getElementById('navbar');
  const progress = document.getElementById('scrollProgress');
  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile nav ---- */
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => {
      toggle.classList.remove('open');
      links.classList.remove('open');
    })
  );

  /* ---- Reveal on scroll ---- */
  const io = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---- Animated counters ---- */
  const counters = document.querySelectorAll('.num[data-count]');
  const cio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const dur = 1600; const start = performance.now();
      const tick = now => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => cio.observe(c));

  /* ---- Hero parallax ---- */
  const heroBg = document.querySelector('[data-parallax]');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      heroBg.style.transform = `translateY(${window.scrollY * 0.18}px)`;
    }, { passive: true });
  }

  /* ---- Custom cursor ---- */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (window.matchMedia('(hover:hover)').matches) {
    let rx = 0, ry = 0, dx = 0, dy = 0;
    document.addEventListener('mousemove', e => {
      dx = e.clientX; dy = e.clientY;
      dot.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
    });
    const follow = () => {
      rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(follow);
    };
    follow();
    document.querySelectorAll('a,button,.gallery-item,.service-card,input,textarea,select').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  /* ---- Gallery filters ---- */
  const filters = document.querySelectorAll('.filter');
  const items = document.querySelectorAll('.gallery-item');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      items.forEach(it => {
        const show = f === 'all' || it.dataset.cat === f;
        it.classList.toggle('hide', !show);
      });
    });
  });

  /* ---- Lightbox ---- */
  const gImages = [
    'images/IMG_1414.JPG.jpeg', 'images/IMG_1400.JPG.jpeg',
    'images/IMG_2804.JPG.jpeg', 'images/IMG_3291.JPG.jpeg',
    'images/IMG_3293.JPG.jpeg', 'images/IMG_1402.JPG.jpeg',
    'images/IMG_2086.JPG.jpeg', 'images/IMG_2941.JPG.jpeg'
  ];
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  let current = 0;
  const setImg = i => {
    current = (i + gImages.length) % gImages.length;
    lbImg.style.backgroundImage = `url('${gImages[current]}')`;
  };
  items.forEach((it, i) => it.addEventListener('click', () => {
    setImg(i); lb.classList.add('open'); document.body.style.overflow = 'hidden';
  }));
  const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbNext').addEventListener('click', () => setImg(current + 1));
  document.getElementById('lbPrev').addEventListener('click', () => setImg(current - 1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') setImg(current + 1);
    if (e.key === 'ArrowLeft') setImg(current - 1);
  });

  /* ---- Testimonials slider ---- */
  const track = document.getElementById('testiTrack');
  const slides = track.children.length;
  const dotsWrap = document.getElementById('testiDots');
  let idx = 0;
  for (let i = 0; i < slides; i++) {
    const b = document.createElement('button');
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
  }
  const dots = dotsWrap.children;
  const goTo = i => {
    idx = (i + slides) % slides;
    track.style.transform = `translateX(-${idx * 100}%)`;
    [...dots].forEach((d, k) => d.classList.toggle('active', k === idx));
  };
  goTo(0);
  let auto = setInterval(() => goTo(idx + 1), 5500);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
  track.parentElement.addEventListener('mouseleave', () => auto = setInterval(() => goTo(idx + 1), 5500));

  /* ---- Contact form ---- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const service = form.service.value;
    const message = form.message.value.trim();
    if (!name || !phone || !service) {
      note.textContent = 'Please fill in your name, phone and service.';
      note.className = 'form-note err';
      return;
    }
    if (!/^[0-9+\-\s]{8,15}$/.test(phone)) {
      note.textContent = 'Please enter a valid phone number.';
      note.className = 'form-note err';
      return;
    }
    // Compose a WhatsApp message as the delivery channel (no backend needed)
    const text =
      `Hi Live Interior!%0A%0A*Name:* ${encodeURIComponent(name)}` +
      `%0A*Phone:* ${encodeURIComponent(phone)}` +
      (form.email.value.trim() ? `%0A*Email:* ${encodeURIComponent(form.email.value.trim())}` : '') +
      `%0A*Service:* ${encodeURIComponent(service)}` +
      (message ? `%0A*Details:* ${encodeURIComponent(message)}` : '');
    note.textContent = 'Thank you! Opening WhatsApp to send your enquiry…';
    note.className = 'form-note ok';
    setTimeout(() => {
      window.open(`https://wa.me/919910965110?text=${text}`, '_blank');
      form.reset();
    }, 700);
  });
})();
