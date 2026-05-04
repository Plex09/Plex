/* ── Config ── */
const PASSWORD    = 'Batman##20';
const SESSION_KEY = 'pvt_ex_auth';
const IDLE_MS     = 5 * 60 * 1000;
const IDLE_WARN   = 30;
const EASTER_WORD = 'plex';
const MAX_ATTEMPTS= 3;

/* ── Elements ── */
const splash    = document.getElementById('splash');
const gate      = document.getElementById('gate');
const gallery   = document.getElementById('gallery');
const gateForm  = document.getElementById('gateForm');
const pwInput   = document.getElementById('passwordInput');
const gateError = document.getElementById('gateError');
const inputWrap = pwInput.closest('.gate-input-wrap');
const lockBtn   = document.getElementById('lockBtn');
const curtain   = document.getElementById('curtain');

/* ══════════════════════════════════════════
   LOADING SPLASH
══════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    splash.classList.add('done');
    gate.classList.remove('hidden');
    setTimeout(() => pwInput.focus(), 100);
  }, 1600);
});

/* ══════════════════════════════════════════
   GATE CLOCK
══════════════════════════════════════════ */
(function initClock() {
  const el = document.getElementById('gateClock');
  if (!el) return;
  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    const s = String(now.getSeconds()).padStart(2,'0');
    el.textContent = `${h} : ${m} : ${s}`;
  }
  tick();
  setInterval(tick, 1000);
})();

/* ══════════════════════════════════════════
   WRONG PASSWORD ATTEMPTS
══════════════════════════════════════════ */
let attempts = 0;

/* ── Custom Cursor ── */
// Cursor is now a heart emoji via CSS — no JS needed

/* ══════════════════════════════════════════
   MAGNETIC BUTTONS
══════════════════════════════════════════ */
function initMagnetic() {
  document.querySelectorAll('.header-btn, .header-lock').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width  / 2;
      const my = e.clientY - r.top  - r.height / 2;
      btn.style.transform = `translate(${mx * 0.25}px, ${my * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ══════════════════════════════════════════
   GATE
══════════════════════════════════════════ */
gateForm.addEventListener('submit', e => {
  e.preventDefault();
  const val = pwInput.value.trim();
  if (val === PASSWORD) {
    attempts = 0;
    document.getElementById('gateAttempts').textContent = '';
    gateError.classList.remove('visible');
    curtainTransition(() => {
      gate.classList.add('hidden');
      showGallery(true);
    });
  } else {
    attempts++;
    const left = MAX_ATTEMPTS - attempts;
    gateError.classList.add('visible');
    const attEl = document.getElementById('gateAttempts');
    attEl.textContent = left > 0 ? `${left} attempt${left !== 1 ? 's' : ''} remaining` : 'No attempts remaining.';
    inputWrap.classList.remove('shake');
    void inputWrap.offsetWidth;
    inputWrap.classList.add('shake');
    pwInput.value = '';
    pwInput.focus();
    if (attempts >= MAX_ATTEMPTS) {
      pwInput.disabled = true;
      document.querySelector('.gate-btn').disabled = true;
      setTimeout(() => {
        attempts = 0;
        pwInput.disabled = false;
        document.querySelector('.gate-btn').disabled = false;
        attEl.textContent = '';
        gateError.classList.remove('visible');
        pwInput.focus();
      }, 30000);
    }
  }
});

/* ══════════════════════════════════════════
   CURTAIN TRANSITION
══════════════════════════════════════════ */
function curtainTransition(callback) {
  curtain.classList.add('in');
  setTimeout(() => {
    callback();
    curtain.classList.remove('in');
    curtain.classList.add('out');
    setTimeout(() => curtain.classList.remove('out'), 450);
  }, 450);
}

/* ══════════════════════════════════════════
   LOCK
══════════════════════════════════════════ */
function lockGallery() {
  stopSlideshow();
  clearIdleTimers();
  curtainTransition(() => {
    gallery.classList.add('hidden');
    gate.classList.remove('hidden', 'fade-out');
    gate.style.opacity = '';
    gate.style.visibility = '';
    pwInput.value = '';
    gateError.classList.remove('visible');
    document.getElementById('gateAttempts').textContent = '';
    sessionStorage.removeItem(SESSION_KEY);
  });
  setTimeout(() => pwInput.focus(), 950);
}
lockBtn.addEventListener('click', lockGallery);

/* ══════════════════════════════════════════
   SHOW GALLERY
══════════════════════════════════════════ */
function showGallery(animate) {
  gallery.classList.remove('hidden');
  if (!animate) gallery.style.animation = 'none';
  // Start background music
  const bgMusic = document.getElementById('bgMusic');
  if (bgMusic) { bgMusic.volume = 0.15; bgMusic.play().catch(() => {}); }
  initScrollReveal();
  initLightbox();
  initHeader();
  initScrollTop();
  initTheme();
  initLayout();
  initParallax();
  initIdleLock();
  initViewCounter();
  setLastUpdated();
  initSearch();
  initGapSlider();
  initShuffle();
  initMirror();
  initPalette();
  initRipple();
  initEasterEgg();
  initMagnetic();
  initPullToRefresh();
  fetchLocation();
  initFavorites();
  initSort();
}

/* ══════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════ */
function initScrollReveal() {
  const items = document.querySelectorAll('.photo-item');
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  items.forEach(item => io.observe(item));
}

/* ══════════════════════════════════════════
   HEADER SOLID
══════════════════════════════════════════ */
function initHeader() {
  const header = document.getElementById('galleryHeader');
  window.addEventListener('scroll', () => {
    header.classList.toggle('solid', window.scrollY > 60);
  }, { passive: true });
}

/* ══════════════════════════════════════════
   SCROLL TO TOP
══════════════════════════════════════════ */
function initScrollTop() {
  const btn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ══════════════════════════════════════════
   THEME SWITCHER
══════════════════════════════════════════ */
function initTheme() {
  const btns  = document.querySelectorAll('.theme-btn');
  const saved = localStorage.getItem('plex_theme') || 'dark';
  applyTheme(saved);
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
      localStorage.setItem('plex_theme', btn.dataset.theme);
    });
  });
}
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  document.querySelectorAll('.theme-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === theme);
  });
}

/* ══════════════════════════════════════════
   LAYOUT TOGGLE
══════════════════════════════════════════ */
const layouts     = ['masonry', 'grid', 'single'];
const layoutNames = { masonry: 'Masonry', grid: 'Grid', single: 'Single' };
let layoutIndex   = 0;

function initLayout() {
  const btn   = document.getElementById('layoutBtn');
  const label = document.getElementById('layoutLabel');
  const grid  = document.getElementById('masonryGrid');
  btn.addEventListener('click', () => {
    layoutIndex = (layoutIndex + 1) % layouts.length;
    const l = layouts[layoutIndex];
    grid.className = l === 'masonry' ? 'masonry' : (l === 'grid' ? 'layout-grid' : 'layout-single');
    label.textContent = layoutNames[l];
  });
}

/* ══════════════════════════════════════════
   PARALLAX
══════════════════════════════════════════ */
function initParallax() {
  const items = document.querySelectorAll('.photo-inner img');
  window.addEventListener('mousemove', e => {
    const mx = (e.clientX / window.innerWidth  - 0.5) * 10;
    const my = (e.clientY / window.innerHeight - 0.5) * 10;
    items.forEach(img => {
      img.style.transform = `translate(${mx * 0.4}px, ${my * 0.4}px) scale(1.04)`;
    });
  }, { passive: true });
  document.addEventListener('mouseleave', () => {
    items.forEach(img => { img.style.transform = ''; });
  });
}

/* ══════════════════════════════════════════
   VIEW COUNTER
══════════════════════════════════════════ */
function initViewCounter() {
  const key   = 'plex_views';
  const count = (parseInt(localStorage.getItem(key)) || 0) + 1;
  localStorage.setItem(key, count);
  const el = document.getElementById('footerViews');
  if (el) el.textContent = `Viewed ${count} time${count !== 1 ? 's' : ''}`;
}

/* ══════════════════════════════════════════
   LAST UPDATED
══════════════════════════════════════════ */
function setLastUpdated() {
  const el = document.getElementById('footerUpdated');
  if (el) el.textContent = 'Last updated Apr 2026';
}

/* ══════════════════════════════════════════
   SEARCH / JUMP TO PHOTO
══════════════════════════════════════════ */
function initSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.addEventListener('input', () => {
    const val = input.value.trim();
    if (!val) return;
    const target = document.querySelector(`.photo-item .photo-num`);
    const all = Array.from(document.querySelectorAll('.photo-item'));
    const match = all.find(item => {
      const num = item.querySelector('.photo-num');
      return num && num.textContent.trim() === val.padStart(3, '0');
    });
    if (match) {
      match.scrollIntoView({ behavior: 'smooth', block: 'center' });
      match.style.outline = `1px solid var(--accent)`;
      setTimeout(() => { match.style.outline = ''; }, 1500);
    }
  });
}

/* ══════════════════════════════════════════
   GAP SLIDER
══════════════════════════════════════════ */
function initGapSlider() {
  const slider = document.getElementById('gapSlider');
  if (!slider) return;
  slider.addEventListener('input', () => {
    const v = slider.value + 'px';
    const grid = document.getElementById('masonryGrid');
    grid.style.columnGap = v;
    grid.style.gap = v;
    document.querySelectorAll('.photo-item').forEach(item => {
      item.style.marginBottom = v;
    });
  });
}

/* ══════════════════════════════════════════
   SHUFFLE
══════════════════════════════════════════ */
function initShuffle() {
  const btn  = document.getElementById('shuffleBtn');
  const grid = document.getElementById('masonryGrid');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const items = Array.from(grid.children);
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      grid.appendChild(items[j]);
      items.splice(j, 1);
    }
    // Re-trigger reveal
    grid.querySelectorAll('.photo-item').forEach(item => {
      item.classList.remove('visible');
      setTimeout(() => item.classList.add('visible'), 50);
    });
  });
}

/* ══════════════════════════════════════════
   MIRROR MODE
══════════════════════════════════════════ */
function initMirror() {
  const btn = document.getElementById('mirrorBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    gallery.classList.toggle('mirrored');
    btn.classList.toggle('active', gallery.classList.contains('mirrored'));
  });
}


/* ══════════════════════════════════════════
   COLOR PALETTE EXTRACTOR
══════════════════════════════════════════ */
function initPalette() {
  const strip = document.getElementById('paletteStrip');
  if (!strip) return;
  const img = document.querySelector('.photo-item img');
  if (!img) return;

  const colors = ['#c8a96e','#8b6f47','#d4b896','#6b4c2a','#e8d5b7','#4a3520','#f0e6d0','#2d1f0e'];
  strip.innerHTML = '';
  colors.forEach(c => {
    const span = document.createElement('span');
    span.style.background = c;
    strip.appendChild(span);
  });
}

/* ══════════════════════════════════════════
   CLICK RIPPLE
══════════════════════════════════════════ */
function initRipple() {
  const container = document.getElementById('rippleContainer');
  document.querySelectorAll('.photo-item').forEach(item => {
    item.addEventListener('click', e => {
      const r = document.createElement('div');
      r.className = 'ripple';
      r.style.left = e.clientX + 'px';
      r.style.top  = e.clientY + 'px';
      container.appendChild(r);
      setTimeout(() => r.remove(), 700);
    });
  });
}

/* ══════════════════════════════════════════
   SHUTTER SOUND
══════════════════════════════════════════ */
function playShutter() {
  const audio = document.getElementById('shutterSound');
  if (!audio) return;
  audio.currentTime = 0;
  audio.volume = 0.3;
  audio.play().catch(() => {});
}

/* ══════════════════════════════════════════
   EASTER EGG
══════════════════════════════════════════ */
function initEasterEgg() {
  const overlay = document.getElementById('easterEgg');
  let typed = '';
  document.addEventListener('keydown', e => {
    if (gallery.classList.contains('hidden')) return;
    typed += e.key.toLowerCase();
    if (typed.length > EASTER_WORD.length) typed = typed.slice(-EASTER_WORD.length);
    if (typed === EASTER_WORD) {
      overlay.classList.add('show');
      setTimeout(() => overlay.classList.remove('show'), 3000);
      typed = '';
    }
  });
  overlay.addEventListener('click', () => overlay.classList.remove('show'));
}

/* ══════════════════════════════════════════
   PULL TO REFRESH (mobile lock)
══════════════════════════════════════════ */
function initPullToRefresh() {
  const indicator = document.getElementById('pullIndicator');
  let startY = 0, pulling = false;

  document.addEventListener('touchstart', e => {
    if (window.scrollY === 0) { startY = e.touches[0].clientY; pulling = true; }
  }, { passive: true });

  document.addEventListener('touchmove', e => {
    if (!pulling) return;
    const dy = e.touches[0].clientY - startY;
    if (dy > 60) { indicator.classList.add('show'); }
  }, { passive: true });

  document.addEventListener('touchend', e => {
    if (!pulling) return;
    const dy = e.changedTouches[0].clientY - startY;
    indicator.classList.remove('show');
    pulling = false;
    if (dy > 80) lockGallery();
  }, { passive: true });
}

/* ══════════════════════════════════════════
   VISITOR LOCATION
══════════════════════════════════════════ */
function fetchLocation() {
  fetch('https://ipapi.co/json/')
    .then(r => r.json())
    .then(data => {
      const city = data.city || data.country_name || '';
      if (!city) return;
      const el = document.getElementById('footerUpdated');
      if (el) el.textContent += `  ·  ${city}`;
    })
    .catch(() => {});
}

/* ══════════════════════════════════════════
   FAVORITES
══════════════════════════════════════════ */
function initFavorites() {
  const FAV_KEY   = 'plex_favs';
  const grid      = document.getElementById('masonryGrid');
  const filterBtn = document.getElementById('favFilterBtn');
  let favs        = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
  let filterOn    = false;

  // Restore saved favorites
  function applyFavState() {
    document.querySelectorAll('.heart-btn').forEach(btn => {
      const isFav = favs.includes(btn.dataset.id);
      btn.classList.toggle('favorited', isFav);
      btn.closest('.photo-item').classList.toggle('favorited', isFav);
    });
  }
  applyFavState();

  // Heart click — stop propagation so it doesn't open lightbox
  document.querySelectorAll('.heart-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id  = btn.dataset.id;
      const idx = favs.indexOf(id);
      if (idx === -1) favs.push(id);
      else favs.splice(idx, 1);
      localStorage.setItem(FAV_KEY, JSON.stringify(favs));
      applyFavState();
      // Bounce animation
      btn.style.transform = 'scale(1.4)';
      setTimeout(() => { btn.style.transform = ''; }, 300);
    });
  });

  // Filter toggle
  filterBtn.addEventListener('click', () => {
    filterOn = !filterOn;
    grid.classList.toggle('fav-mode', filterOn);
    filterBtn.classList.toggle('active', filterOn);
  });
}

/* ══════════════════════════════════════════
   SORT BY DATE
══════════════════════════════════════════ */
function initSort() {
  const btn   = document.getElementById('sortBtn');
  const label = document.getElementById('sortLabel');
  const grid  = document.getElementById('masonryGrid');
  if (!btn) return;
  let newestFirst = true;

  btn.addEventListener('click', () => {
    newestFirst = !newestFirst;
    label.textContent = newestFirst ? 'Newest' : 'Oldest';
    btn.classList.toggle('active', !newestFirst);

    const items = Array.from(grid.querySelectorAll('.photo-item'));
    items.sort((a, b) => {
      const da = parseInt(a.dataset.date) || 0;
      const db = parseInt(b.dataset.date) || 0;
      return newestFirst ? db - da : da - db;
    });
    items.forEach(item => {
      item.classList.remove('visible');
      grid.appendChild(item);
      setTimeout(() => item.classList.add('visible'), 60);
    });
  });
}


/* ══════════════════════════════════════════
   IDLE LOCK + WARNING TOAST
══════════════════════════════════════════ */
let warnTimer = null, countdownInterval = null;

function clearIdleTimers() {
  clearTimeout(warnTimer);
  clearInterval(countdownInterval);
  const toast = document.getElementById('idleToast');
  if (toast) toast.classList.remove('show');
}

function initIdleLock() {
  const toast     = document.getElementById('idleToast');
  const stayBtn   = document.getElementById('idleStay');
  const countdown = document.getElementById('idleCountdown');

  function resetIdle() {
    clearIdleTimers();
    warnTimer = setTimeout(() => {
      let secs = IDLE_WARN;
      countdown.textContent = secs;
      toast.classList.add('show');
      countdownInterval = setInterval(() => {
        secs--;
        countdown.textContent = secs;
        if (secs <= 0) { clearInterval(countdownInterval); lockGallery(); }
      }, 1000);
    }, IDLE_MS - IDLE_WARN * 1000);
  }

  stayBtn.addEventListener('click', resetIdle);
  ['mousemove','keydown','scroll','click','touchstart'].forEach(ev =>
    window.addEventListener(ev, resetIdle, { passive: true })
  );
  resetIdle();
}

/* ══════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════ */
let slideshowTimer = null;

function stopSlideshow() {
  clearInterval(slideshowTimer);
  slideshowTimer = null;
  const btn = document.getElementById('lbSlideshow');
  if (btn) btn.classList.remove('active');
}

function initLightbox() {
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lbImg');
  const lbClose      = document.getElementById('lbClose');
  const lbPrev       = document.getElementById('lbPrev');
  const lbNext       = document.getElementById('lbNext');
  const lbCounter    = document.getElementById('lbCounter');
  const lbStage      = document.getElementById('lbStage');
  const backdrop     = document.getElementById('lbBackdrop');
  const lbFullscreen = document.getElementById('lbFullscreen');
  const lbSlideshow  = document.getElementById('lbSlideshow');
  const lbZoomBtn    = document.getElementById('lbZoomBtn');
  const lbCaptionDate= document.getElementById('lbCaptionDate');
  const filmstrip    = document.getElementById('lbFilmstrip');

  const lbDownload  = document.getElementById('lbDownload');

  function hdDownload() {
    const src = getSrc(items[current]);
    const hdSrc = src.replace(/w_\d+,q_auto,f_auto\//, '');
    const filename = `plex-${String(current + 1).padStart(3, '0')}.png`;
    fetch(hdSrc)
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      })
      .catch(() => window.open(hdSrc, '_blank'));
  }

  const items = Array.from(document.querySelectorAll('.photo-item'));
  let current = 0, zoomed = false;

  function getSrc(item) { return item.querySelector('img').src; }

  // Build filmstrip thumbnails
  filmstrip.innerHTML = '';
  items.forEach((item, i) => {
    const thumb = document.createElement('img');
    thumb.src = getSrc(item);
    thumb.className = 'lb-thumb';
    thumb.addEventListener('click', () => navigate(i - current));
    filmstrip.appendChild(thumb);
  });

  function updateFilmstrip() {
    filmstrip.querySelectorAll('.lb-thumb').forEach((t, i) => {
      t.classList.toggle('active', i === current);
    });
    const active = filmstrip.children[current];
    if (active) active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  function updateInfo(item) {
    lbCaptionDate.textContent = item.dataset.date || '';
  }

  function setZoom(on) {
    zoomed = on;
    lbStage.classList.toggle('zoomed', on);
    lbZoomBtn.classList.toggle('active', on);
    document.body.classList.toggle('cursor-zoom', on);
  }

  function open(index) {
    current = index;
    lbImg.src = getSrc(items[current]);
    lbCounter.textContent = `${current + 1} / ${items.length}`;
    updateInfo(items[current]);
    updateFilmstrip();
    setZoom(false);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    playShutter();
    const hints = document.getElementById('lbHints');
    hints.style.animation = 'none';
    void hints.offsetWidth;
    hints.style.animation = '';
  }

  function close() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    setZoom(false);
    stopSlideshow();
    setTimeout(() => { lbImg.src = ''; }, 400);
  }

  function navigate(dir) {
    if (zoomed) setZoom(false);
    lbStage.classList.add('switching');
    setTimeout(() => {
      current = (current + dir + items.length) % items.length;
      lbImg.src = getSrc(items[current]);
      lbCounter.textContent = `${current + 1} / ${items.length}`;
      updateInfo(items[current]);
      updateFilmstrip();
      lbStage.classList.remove('switching');
      playShutter();
    }, 200);
  }

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));

  if (lbDownload) lbDownload.addEventListener('click', hdDownload);

  lbClose.addEventListener('click', close);
  backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
  lbPrev.addEventListener('click', () => navigate(-1));
  lbNext.addEventListener('click', () => navigate(1));

  lbZoomBtn.addEventListener('click', () => setZoom(!zoomed));
  lbImg.addEventListener('click', () => setZoom(!zoomed));

  lbFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      lightbox.requestFullscreen().catch(() => {});
      lbFullscreen.classList.add('active');
    } else {
      document.exitFullscreen();
      lbFullscreen.classList.remove('active');
    }
  });
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) lbFullscreen.classList.remove('active');
  });

  lbSlideshow.addEventListener('click', () => {
    if (slideshowTimer) { stopSlideshow(); }
    else {
      lbSlideshow.classList.add('active');
      slideshowTimer = setInterval(() => navigate(1), 3000);
    }
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')             close();
    if (e.key === 'ArrowLeft')          navigate(-1);
    if (e.key === 'ArrowRight')         navigate(1);
    if (e.key === 'f' || e.key === 'F') lbFullscreen.click();
    if (e.key === 'z' || e.key === 'Z') setZoom(!zoomed);
    if (e.key === 's' || e.key === 'S') lbSlideshow.click();
  });

  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) navigate(dx < 0 ? 1 : -1);
  });
}
