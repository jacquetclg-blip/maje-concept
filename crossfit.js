// NAV scroll
const nav = document.getElementById('nav');
const ticker = document.querySelector('.ticker');
window.addEventListener('scroll', () => {
  const s = window.scrollY > 40;
  nav.classList.toggle('scrolled', s);
  ticker.classList.toggle('visible', s);
});

// Burger
const burger = document.getElementById('burger');
const mobile = document.getElementById('mobile-menu');
burger.addEventListener('click', () => mobile.classList.toggle('open'));
mobile.querySelectorAll('a').forEach(l => l.addEventListener('click', () => mobile.classList.remove('open')));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

// Reveal on scroll
const io = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
  { threshold: 0.08 }
);
document.querySelectorAll(
  '.bento, .client-card, .why__item, .pstep, .gm-item, .stats-band__item'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 4) * 0.07}s`;
  io.observe(el);
});
document.querySelectorAll('.hero__left-content > *').forEach((el, i) => {
  el.classList.add('reveal-l');
  el.style.transitionDelay = `${i * 0.1}s`;
  io.observe(el);
});
document.querySelectorAll('.hero__img-stack > *').forEach((el, i) => {
  el.classList.add('reveal-r');
  el.style.transitionDelay = `${i * 0.12}s`;
  io.observe(el);
});

// Animated counters
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target;
      const target = +el.dataset.target;
      let start = 0;
      const step = target / 40;
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { el.textContent = target; clearInterval(timer); }
        else { el.textContent = Math.floor(start); }
      }, 30);
      counterObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stats-band__num[data-target]').forEach(el => counterObs.observe(el));

// Gallery filter
const gfs = document.querySelectorAll('.gf');
const gmItems = document.querySelectorAll('.gm-item');
gfs.forEach(btn => {
  btn.addEventListener('click', () => {
    gfs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    gmItems.forEach(item => {
      item.classList.toggle('hidden', f !== 'all' && item.dataset.cat !== f);
    });
  });
});

// Lightbox
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCap = document.getElementById('lb-cap');
const imgs = [];
gmItems.forEach((item, i) => {
  const img = item.querySelector('img');
  const cap = item.querySelector('.gm-item__info p');
  imgs.push({ src: img.src, cap: cap ? cap.textContent : '' });
  item.addEventListener('click', () => openLb(i));
});
let cur = 0;
function openLb(i) {
  cur = i; lbImg.src = imgs[i].src; lbCap.textContent = imgs[i].cap;
  lb.classList.add('open'); document.body.style.overflow = 'hidden';
}
function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }
document.getElementById('lb-close').addEventListener('click', closeLb);
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
document.getElementById('lb-prev').addEventListener('click', () => openLb((cur - 1 + imgs.length) % imgs.length));
document.getElementById('lb-next').addEventListener('click', () => openLb((cur + 1) % imgs.length));
document.addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb();
  if (e.key === 'ArrowLeft') openLb((cur - 1 + imgs.length) % imgs.length);
  if (e.key === 'ArrowRight') openLb((cur + 1) % imgs.length);
});

// Chips (service selector)
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chip.classList.toggle('selected');
    const selected = [...document.querySelectorAll('.chip.selected')].map(c => c.dataset.val).join(',');
    document.getElementById('service-hidden').value = selected;
  });
});

// Form
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  const orig = btn.innerHTML;
  btn.innerHTML = 'Demande envoyée ✓';
  btn.style.background = 'linear-gradient(135deg,#4caf50,#2e7d32)';
  btn.disabled = true;
  setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; btn.disabled = false; this.reset(); document.querySelectorAll('.chip').forEach(c => c.classList.remove('selected')); }, 4000);
});
