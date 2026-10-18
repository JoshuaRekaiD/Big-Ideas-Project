/* =========================================================
   BIRP — MAIN JAVASCRIPT
   ========================================================= */

'use strict';

/* ─────────────────────────────────────────────
   0. PWA — Register service worker
───────────────────────────────────────────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .catch(() => { /* silently fail in local file:// context */ });
  });
}

/* ─────────────────────────────────────────────
   1. NAVBAR — scroll behaviour & mobile toggle
───────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  if (!navbar) return;

  // Add scrolled class when not at top
  function onScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
      navbar.classList.add('scrolled-compact');
    } else {
      if (!navbar.classList.contains('scrolled-forced')) {
        navbar.classList.remove('scrolled');
      }
      navbar.classList.remove('scrolled-compact');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Mobile hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }
})();


/* ─────────────────────────────────────────────
   2. SCROLL REVEAL — IntersectionObserver
───────────────────────────────────────────── */
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — keep visible once shown
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-right').forEach(el => {
    observer.observe(el);
  });
})();


/* ─────────────────────────────────────────────
   3. COUNTER ANIMATION
───────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const formatNum = (n) => {
    if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
    return n.toString();
  };

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = formatNum(current);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────────
   4. AUTH MODAL — real Supabase auth
───────────────────────────────────────────── */
(function initAuthModal() {
  const overlay  = document.getElementById('authModal');
  if (!overlay) return;

  const openLogin  = document.getElementById('openLogin');
  const openSignup = document.getElementById('openSignup');
  const ctaSignup  = document.getElementById('ctaSignup');
  const closeBtn   = document.getElementById('closeModal');

  function openModal(tab) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (tab) switchTab(tab);
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function switchTab(tabName) {
    overlay.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    overlay.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `tab-${tabName}`);
    });
  }

  if (openLogin)  openLogin.addEventListener('click',  (e) => { e.preventDefault(); openModal('login'); });
  if (openSignup) openSignup.addEventListener('click', (e) => { e.preventDefault(); openModal('signup'); });
  if (ctaSignup)  ctaSignup.addEventListener('click',  (e) => { e.preventDefault(); openModal('signup'); });
  if (closeBtn)   closeBtn.addEventListener('click', closeModal);

  overlay.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  overlay.querySelectorAll('[data-switch]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(link.dataset.switch);
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // ── LOGIN ──
  const loginForm = overlay.querySelector('#loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email    = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;
      const btn      = loginForm.querySelector('button[type="submit"]');

      btn.textContent = 'Logging in…';
      btn.disabled = true;

      const { data, error } = await _supabase.auth.signInWithPassword({ email, password });

      btn.textContent = 'Log In';
      btn.disabled = false;

      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Welcome back! 👋', 'success');
        closeModal();
        updateNavForUser(data.user);
      }
    });
  }

  // ── SIGN UP ──
  const signupForm = overlay.querySelector('#signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name     = signupForm.querySelector('input[type="text"]').value;
      const email    = signupForm.querySelector('input[type="email"]').value;
      const password = signupForm.querySelector('input[type="password"]').value;
      const btn      = signupForm.querySelector('button[type="submit"]');

      btn.textContent = 'Creating account…';
      btn.disabled = true;

      const { error } = await _supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });

      btn.textContent = 'Create Account';
      btn.disabled = false;

      if (error) {
        showToast(error.message, 'error');
      } else {
        showToast('Check your email to confirm your account 📧', 'info');
        closeModal();
      }
    });
  }

  // ── CHECK SESSION ON LOAD ──
  _supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) updateNavForUser(session.user);
  });

  // ── LISTEN FOR AUTH CHANGES ──
  _supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      updateNavForUser(session.user);
    }
    // Don't call resetNav/reload here — causes infinite loop
  });
})();


/* ─────────────────────────────────────────────
   4b. NAV — update for logged-in user
───────────────────────────────────────────── */
function updateNavForUser(user) {
  const loginBtn  = document.getElementById('openLogin');
  const signupBtn = document.getElementById('openSignup');
  if (!loginBtn || !signupBtn) return;

  const name = user.user_metadata?.full_name || user.email.split('@')[0];

  loginBtn.style.display  = 'none';
  signupBtn.textContent   = name;
  signupBtn.classList.remove('btn-nav-filled');
  signupBtn.removeAttribute('id'); // prevent re-triggering signup

  // Add logout button
  if (!document.getElementById('logoutBtn')) {
    const li  = document.createElement('li');
    const btn = document.createElement('a');
    btn.href        = '#';
    btn.className   = 'btn-nav';
    btn.id          = 'logoutBtn';
    btn.textContent = 'Log Out';
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      await _supabase.auth.signOut();
      showToast('Logged out', 'info');
      location.reload();
    });
    li.appendChild(btn);
    signupBtn.closest('ul')?.appendChild(li);
  }
}

function resetNav() {
  // Called after logout — page reloads handled by the logout button directly
}


/* ─────────────────────────────────────────────
   5. RESERVE MODAL (deals & farms pages)
───────────────────────────────────────────── */
function openReserveModal(btn) {
  const modal = document.getElementById('reserveModal');
  if (!modal) return;

  const storeName  = btn.dataset.store  || 'Store';
  const itemName   = btn.dataset.item   || 'Bundle';
  const price      = btn.dataset.price  || 'R--';

  modal.querySelector('#reserveStoreName').textContent  = storeName;
  modal.querySelector('#reserveItemName').textContent   = itemName;
  modal.querySelector('#reservePriceDisplay').textContent = price;

  const successEl = modal.querySelector('#reserveSuccess');
  const confirmBtn = modal.querySelector('#confirmReserve');
  if (successEl) successEl.classList.add('hidden');
  if (confirmBtn) confirmBtn.classList.remove('hidden');

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

(function initReserveModal() {
  const modal = document.getElementById('reserveModal');
  if (!modal) return;

  const closeBtn  = document.getElementById('closeReserveModal');
  const confirmBtn = document.getElementById('confirmReserve');

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const code = 'FF-' + Math.floor(1000 + Math.random() * 9000);
      const successEl = document.getElementById('reserveSuccess');
      const codeEl    = document.getElementById('reserveCode');

      if (codeEl) codeEl.textContent = code;
      if (successEl) successEl.classList.remove('hidden');
      confirmBtn.classList.add('hidden');

      showToast(`Reserved! Your code is ${code} 🎉`, 'success');
    });
  }
})();


/* ─────────────────────────────────────────────
   6. DEALS FILTER (deals.html)
───────────────────────────────────────────── */
(function initFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const dealCards  = document.querySelectorAll('.deal-card[data-category]');
  const countEl    = document.getElementById('resultsCount');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide cards
      let visible = 0;
      dealCards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
        if (match) visible++;
      });

      // Update count
      if (countEl) {
        countEl.innerHTML = `Showing <strong>${visible}</strong> deal${visible !== 1 ? 's' : ''}`;
      }
    });
  });
})();


/* ─────────────────────────────────────────────
   7. SEARCH BAR (deals.html)
───────────────────────────────────────────── */
(function initSearch() {
  const input    = document.getElementById('searchInput');
  const dealCards = document.querySelectorAll('.deal-card');
  const countEl  = document.getElementById('resultsCount');

  if (!input) return;

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();
    let visible = 0;

    dealCards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const match = !query || text.includes(query);
      card.classList.toggle('hidden', !match);
      if (match) visible++;
    });

    if (countEl) {
      countEl.innerHTML = `Showing <strong>${visible}</strong> deal${visible !== 1 ? 's' : ''}`;
    }
  });

  // Search button (just trigger the input event)
  const searchBtn = input.closest('.search-bar')?.querySelector('button');
  if (searchBtn) {
    searchBtn.addEventListener('click', () => input.dispatchEvent(new Event('input')));
  }
})();


/* ─────────────────────────────────────────────
   8. TOAST NOTIFICATIONS
───────────────────────────────────────────── */
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  const colors = {
    success: { bg: '#22c55e', text: '#fff' },
    error:   { bg: '#ef4444', text: '#fff' },
    info:    { bg: '#3b82f6', text: '#fff' },
  };
  const c = colors[type] || colors.info;

  toast.style.cssText = `
    background: ${c.bg};
    color: ${c.text};
    padding: 14px 20px;
    border-radius: 12px;
    font-family: 'Nunito', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    pointer-events: none;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    max-width: 340px;
  `;
  toast.textContent = message;
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });
  });

  // Animate out
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}


/* ─────────────────────────────────────────────
   9. KEYBOARD ACCESSIBILITY — close modals on Esc
───────────────────────────────────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(modal => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
});


/* ─────────────────────────────────────────────
   10. SMOOTH SCROLL for anchor links
───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ─────────────────────────────────────────────
   11. TYPE-OPTION radio buttons (signup form)
───────────────────────────────────────────── */
(function initTypeOptions() {
  document.querySelectorAll('.type-option input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.type-option span').forEach(span => {
        span.style.borderColor = '';
        span.style.background = '';
        span.style.color = '';
      });
    });
  });
})();


/* ─────────────────────────────────────────────
   12. CONTACT FORM — sends via Formspree
       Replace YOUR_FORM_ID with your Formspree
       endpoint ID from formspree.io
───────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const FORMSPREE_URL = 'https://formspree.io/f/xljgayzj';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.reset();
        showToast("Message sent! We'll be in touch soon.", 'success');
      } else {
        showToast('Something went wrong. Email us directly at birp@bishops.org.za', 'error');
      }
    } catch {
      showToast('Something went wrong. Email us directly.', 'error');
    }

    btn.textContent = 'Send Message';
    btn.disabled = false;
  });
})();


/* ─────────────────────────────────────────────
   13. ACTIVE NAV LINK highlight based on page
───────────────────────────────────────────── */
(function highlightNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href !== '#' && page.includes(href.replace('.html', ''))) {
      link.classList.add('active');
    }
  });
})();


/* ─────────────────────────────────────────────
   14. AREA FILTER (deals.html)
───────────────────────────────────────────── */
(function initAreaFilter() {
  const areaBtns = document.querySelectorAll('.area-btn');
  if (!areaBtns.length) return;

  areaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      areaBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyDealFilters();
    });
  });
})();


/* ─────────────────────────────────────────────
   15. COMBINED FILTER + SEARCH + EMPTY STATE
       Overrides the basic filter/search IIFEs
       on pages that have both category + area.
───────────────────────────────────────────── */
(function initDealsPage() {
  const grid       = document.getElementById('dealsGrid');
  const emptyState = document.getElementById('dealsEmpty');
  const countEl    = document.getElementById('resultsCount');
  const searchInput = document.getElementById('searchInput');
  const clearBtn   = document.getElementById('clearSearch');
  const resetBtn   = document.getElementById('resetFilters');

  if (!grid) return;

  // Expose so area filter IIFE can call it
  window.applyDealFilters = function() {
    const activeCat  = (document.querySelector('.filter-btn.active') || {}).dataset?.filter || 'all';
    const activeArea = (document.querySelector('.area-btn.active') || {}).dataset?.area  || 'all';
    const query      = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const cards = grid.querySelectorAll('.deal-card');
    let visible = 0;

    cards.forEach(card => {
      const catMatch  = activeCat  === 'all' || card.dataset.category === activeCat;
      const areaMatch = activeArea === 'all' || card.dataset.area     === activeArea;
      const text      = card.textContent.toLowerCase();
      const txtMatch  = !query || text.includes(query);
      const show = catMatch && areaMatch && txtMatch;
      card.classList.toggle('hidden', !show);
      if (show) visible++;
    });

    if (countEl) {
      countEl.innerHTML = `Showing <strong>${visible}</strong> deal${visible !== 1 ? 's' : ''}`;
    }

    if (emptyState) {
      emptyState.classList.toggle('hidden', visible > 0);
      grid.classList.toggle('hidden', visible === 0);
    }

    if (clearBtn) {
      clearBtn.style.display = query ? 'block' : 'none';
    }
  };

  // Patch category filter buttons to use combined filter
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      window.applyDealFilters();
    });
  });

  // Search input
  if (searchInput) {
    searchInput.addEventListener('input', () => window.applyDealFilters());
  }

  // Clear search
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) { searchInput.value = ''; }
      window.applyDealFilters();
    });
  }

  // Reset all filters button (in empty state)
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
      document.querySelectorAll('.area-btn').forEach((b, i)  => b.classList.toggle('active', i === 0));
      if (searchInput) { searchInput.value = ''; }
      window.applyDealFilters();
    });
  }
})();


/* ─────────────────────────────────────────────
   16. DEAL DETAIL MODAL
───────────────────────────────────────────── */
function openDealDetail(btn) {
  const card = btn.closest('.deal-card');
  if (!card) return;

  const modal = document.getElementById('dealDetailModal');
  if (!modal) return;

  // Pull data from card
  const store     = card.querySelector('h3')?.textContent || '';
  const cat       = card.querySelector('.deal-cat-tag')?.textContent || '';
  const suburb    = card.querySelector('.deal-suburb')?.textContent || '';
  const desc      = card.querySelector('.deal-desc')?.textContent || '';
  const priceNow  = card.querySelector('.price-now')?.textContent || '';
  const priceWas  = card.querySelector('.price-was')?.textContent || '';
  const timeEl    = card.querySelector('.deal-time')?.textContent?.replace('Pick up:', 'Pick up:').trim() || '';
  const address   = card.dataset.address  || 'Address not listed';
  const allergens = card.dataset.allergens || 'Not specified';
  const contents  = card.dataset.contents || 'Surprise selection of surplus food';
  const bags      = parseInt(card.dataset.bags ?? '1', 10);
  const imgClass  = card.querySelector('.deal-img')?.className?.replace('deal-img', '').trim() || '';
  const badge     = card.querySelector('.deal-badge')?.textContent || '';

  // Populate modal
  const detailImg = document.getElementById('detailImg');
  if (detailImg) {
    detailImg.className = 'detail-img ' + imgClass;
  }

  const detailBadges = document.getElementById('detailBadges');
  if (detailBadges) {
    detailBadges.innerHTML = badge
      ? `<span class="detail-badge">${badge}</span>`
      : '';
  }

  document.getElementById('detailCat').textContent       = cat;
  document.getElementById('detailSuburb').textContent    = suburb;
  document.getElementById('detailStoreName').textContent = store;
  document.getElementById('detailContents').textContent  = contents;
  document.getElementById('detailAllergens').textContent = allergens;
  document.getElementById('detailTime').textContent      = timeEl.replace(/.*Pick up:/, 'Pick up:');
  document.getElementById('detailAddress').textContent   = address;
  document.getElementById('detailPriceNow').textContent  = priceNow;
  document.getElementById('detailPriceWas').textContent  = priceWas;

  const bagsEl = document.getElementById('detailBagsCount');
  if (bagsEl) {
    if (bags === 0) {
      bagsEl.textContent = 'Sold out today';
      bagsEl.className   = 'detail-bags-count detail-bags-none';
    } else {
      bagsEl.textContent = `${bags} bag${bags !== 1 ? 's' : ''} left`;
      bagsEl.className   = bags <= 3 ? 'detail-bags-count detail-bags-urgent' : 'detail-bags-count';
    }
  }

  // Wire the Reserve button inside the detail modal
  const reserveBtn = document.getElementById('detailReserveBtn');
  if (reserveBtn) {
    const reserveBtnOnCard = card.querySelector('.btn-reserve');
    if (bags === 0) {
      reserveBtn.textContent = 'Sold Out';
      reserveBtn.disabled    = true;
    } else {
      reserveBtn.textContent = 'Reserve This Bag';
      reserveBtn.disabled    = false;
      reserveBtn.onclick = () => {
        closeModal('dealDetailModal');
        if (reserveBtnOnCard) {
          openReserveModal(reserveBtnOnCard);
        }
      };
    }
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

(function initDealDetailModal() {
  const modal    = document.getElementById('dealDetailModal');
  const closeBtn = document.getElementById('closeDealDetail');
  if (!modal) return;

  function closeModal(id) {
    const m = document.getElementById(id || 'dealDetailModal');
    if (m) { m.classList.remove('active'); document.body.style.overflow = ''; }
  }
  // Expose so Reserve btn inside detail can close it
  window.closeModal = closeModal;

  if (closeBtn) closeBtn.addEventListener('click', () => closeModal());
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
})();


/* ─────────────────────────────────────────────
   17. UPGRADED RESERVE MODAL
       Populates time + address, shows full
       confirmation screen with pickup code.
───────────────────────────────────────────── */
(function initUpgradedReserve() {
  // Patch openReserveModal to also pull time + address from the card
  const originalOpen = window.openReserveModal;
  window.openReserveModal = function(btn) {
    const card = btn?.closest?.('.deal-card');
    const modal = document.getElementById('reserveModal');
    if (!modal) return;

    // Store active bag for IIFE 20
    if (typeof window._setActiveBag === 'function') {
      window._setActiveBag(btn.dataset.bagId || null, btn.dataset.storeId || null);
    }

    // Show step 1, hide success
    const step1   = document.getElementById('reserveStep1');
    const success = document.getElementById('reserveSuccess');
    if (step1)   step1.classList.remove('hidden');
    if (success) success.classList.add('hidden');

    // Populate
    const store   = btn.dataset.store  || 'Store';
    const item    = btn.dataset.item   || 'Bundle';
    const price   = btn.dataset.price  || 'R--';
    const timeEl  = card?.querySelector('.deal-time')?.textContent?.replace(/Pick up:/, 'Pick up:').trim() || '';
    const address = card?.dataset.address || '';

    const storeEl   = document.getElementById('reserveStoreName');
    const itemEl    = document.getElementById('reserveItemName');
    const priceEl   = document.getElementById('reservePriceDisplay');
    const timeField = document.getElementById('reserveTime');
    const addrField = document.getElementById('reserveAddress');

    if (storeEl)   storeEl.textContent = store;
    if (itemEl)    itemEl.textContent  = item;
    if (priceEl)   priceEl.textContent = price;
    if (timeField) timeField.textContent = timeEl.replace(/.*Pick up:/, 'Pick up:') || 'See store for details';
    if (addrField) addrField.textContent = address || 'See store for details';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Confirm button → show success screen
  const confirmBtn = document.getElementById('confirmReserve');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const code   = 'BIRP-' + Math.floor(1000 + Math.random() * 9000);
      const store  = document.getElementById('reserveStoreName')?.textContent || '';
      const time   = document.getElementById('reserveTime')?.textContent || '';
      const addr   = document.getElementById('reserveAddress')?.textContent || '';

      const codeEl    = document.getElementById('reserveCode');
      const storeEl   = document.getElementById('successStoreName');
      const timeEl2   = document.getElementById('successTime');
      const addrEl2   = document.getElementById('successAddress');
      const step1     = document.getElementById('reserveStep1');
      const success   = document.getElementById('reserveSuccess');

      if (codeEl)  codeEl.textContent  = code;
      if (storeEl) storeEl.textContent = store;
      if (timeEl2) timeEl2.textContent = time;
      if (addrEl2) addrEl2.textContent = addr;

      if (step1)   step1.classList.add('hidden');
      if (success) success.classList.remove('hidden');

      showToast(`Reserved! Your code is ${code}`, 'success');
    });
  }

  // Done button closes modal
  const doneBtn = document.getElementById('closeAfterReserve');
  if (doneBtn) {
    doneBtn.addEventListener('click', () => {
      const modal = document.getElementById('reserveModal');
      if (modal) { modal.classList.remove('active'); document.body.style.overflow = ''; }
    });
  }
})();


/* ─────────────────────────────────────────────
   18. FAQ ACCORDION (index.html)
───────────────────────────────────────────── */
(function initFaqAccordion() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const trigger = item.querySelector('.faq-question');
    if (!trigger) return;
    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      // open clicked if it was closed
      if (!isOpen) item.classList.add('open');
    });
  });
})();


/* ─────────────────────────────────────────────
   19. DEALS PAGE — load bags from Supabase
       Replaces hardcoded HTML cards with live
       data. Falls back to a "no deals" state
       when no bags exist for today.
───────────────────────────────────────────── */
(function initSupabaseDeals() {
  const grid    = document.getElementById('dealsGrid');
  const countEl = document.getElementById('resultsCount');
  if (!grid || typeof _supabase === 'undefined') return;

  async function loadBags() {
    const today = new Date().toISOString().split('T')[0];

    const { data: bags, error } = await _supabase
      .from('bags')
      .select(`
        *,
        stores (name, area, address, category)
      `)
      .eq('is_active', true)
      .eq('available_date', today)
      .gt('quantity_remaining', 0);

    if (error) {
      console.error('Error loading bags:', error.message);
      return;
    }

    // Clear existing hardcoded cards
    grid.innerHTML = '';

    if (!bags || bags.length === 0) {
      // Show empty state
      const empty = document.getElementById('dealsEmpty');
      if (empty) empty.classList.remove('hidden');
      if (countEl) countEl.innerHTML = 'Showing <strong>0</strong> deals';
      return;
    }

    // Render each bag as a card
    bags.forEach(bag => {
      const store = bag.stores || {};
      const urgentClass = bag.quantity_remaining <= 3 ? 'deal-bags-urgent' : '';
      const soldOut     = bag.quantity_remaining === 0;

      const card = document.createElement('div');
      card.className = `deal-card reveal${soldOut ? ' deal-card-soldout' : ''}`;
      card.dataset.category = store.category || 'other';
      card.dataset.area      = (store.area || '').toLowerCase().replace(/\s+/g, '');
      card.dataset.address   = store.address || '';
      card.dataset.allergens = bag.allergens || 'Not specified';
      card.dataset.contents  = bag.description || 'Surprise selection of surplus food';
      card.dataset.bags      = bag.quantity_remaining;
      card.dataset.bagId     = bag.id;
      card.dataset.storeId   = bag.store_id;

      card.innerHTML = `
        <div class="deal-img deal-img-${store.category || 'bakery'}"></div>
        <div class="deal-body">
          <div class="deal-meta-top">
            <span class="deal-cat-tag">${capitalise(store.category || 'Store')}</span>
            <span class="deal-suburb">${store.area || ''}</span>
          </div>
          <h3>${store.name || 'Local Store'}</h3>
          <p class="deal-desc">${bag.name}</p>
          <div class="deal-time">
            <svg class="deal-time-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.8"/>
              <path d="M12 7.5V12l3 2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            Pick up: ${bag.pickup_start || ''} – ${bag.pickup_end || ''}
          </div>
          <div class="deal-footer">
            <div class="deal-price-block">
              <span class="price-now">R ${bag.price}</span>
              ${bag.original_price ? `<span class="price-was">R ${bag.original_price}</span>` : ''}
              <span class="deal-bags-left ${urgentClass}">
                ${soldOut ? 'Sold out' : `${bag.quantity_remaining} bag${bag.quantity_remaining !== 1 ? 's' : ''} left`}
              </span>
            </div>
            <div class="deal-actions">
              <button class="btn-detail" onclick="openDealDetail(this)">Details</button>
              <button class="btn-reserve"
                onclick="openReserveModal(this)"
                data-store="${store.name || ''}"
                data-item="${bag.name}"
                data-price="R${bag.price}"
                data-bag-id="${bag.id}"
                data-store-id="${bag.store_id}"
                ${soldOut ? 'disabled' : ''}>
                ${soldOut ? 'Sold Out' : 'Reserve'}
              </button>
            </div>
          </div>
        </div>`;

      grid.appendChild(card);
    });

    if (countEl) {
      countEl.innerHTML = `Showing <strong>${bags.length}</strong> deal${bags.length !== 1 ? 's' : ''}`;
    }

    // Show grid, hide empty state, re-run filters
    const emptyEl = document.getElementById('dealsEmpty');
    if (emptyEl) emptyEl.classList.add('hidden');
    grid.classList.remove('hidden');

    // Re-run scroll reveal on new cards
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });
  }

  function capitalise(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  loadBags();
})();


/* ─────────────────────────────────────────────
   20. RESERVE — gate behind login + write to
       Supabase reservations table
───────────────────────────────────────────── */
(function initRealReserve() {
  // Store which bag was clicked — set by IIFE 17's patched openReserveModal
  let _activeBagId   = null;
  let _activeStoreId = null;

  // Expose setters so IIFE 17 can store the active bag
  window._setActiveBag = function(bagId, storeId) {
    _activeBagId   = bagId;
    _activeStoreId = storeId;
  };

  const confirmBtn = document.getElementById('confirmReserve');
  if (!confirmBtn) return;

  // Always clone to strip any stale demo handlers
  const newBtn = confirmBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

  if (typeof _supabase === 'undefined') return;

  newBtn.addEventListener('click', async () => {
    // Check login
    const { data: { session } } = await _supabase.auth.getSession();
    if (!session) {
      const reserveModal = document.getElementById('reserveModal');
      if (reserveModal) { reserveModal.classList.remove('active'); document.body.style.overflow = ''; }
      showToast('Please log in to reserve a bag', 'info');
      const authModal = document.getElementById('authModal');
      if (authModal) { authModal.classList.add('active'); document.body.style.overflow = 'hidden'; }
      return;
    }

    if (!_activeBagId || !_activeStoreId) {
      showDemoReserveSuccess();
      return;
    }

    newBtn.textContent = 'Reserving…';
    newBtn.disabled    = true;

    const { data: bag } = await _supabase
      .from('bags')
      .select('quantity_remaining')
      .eq('id', _activeBagId)
      .single();

    if (!bag || bag.quantity_remaining <= 0) {
      showToast('Sorry — this bag just sold out', 'error');
      newBtn.textContent = 'Confirm Reservation';
      newBtn.disabled    = false;
      return;
    }

    const { data: reservation, error } = await _supabase
      .from('reservations')
      .insert({
        bag_id:      _activeBagId,
        store_id:    _activeStoreId,
        customer_id: session.user.id,
        status:      'reserved'
      })
      .select()
      .single();

    if (error) {
      showToast('Something went wrong. Please try again.', 'error');
      console.error(error);
      newBtn.textContent = 'Confirm Reservation';
      newBtn.disabled    = false;
      return;
    }

    await _supabase.rpc('decrement_bag_quantity', { bag_id: _activeBagId });

    const code = reservation.pickup_code;
    showReserveSuccess(code);
    newBtn.textContent = 'Confirm Reservation';
    newBtn.disabled    = false;
  });

  function showReserveSuccess(code) {
    const step1   = document.getElementById('reserveStep1');
    const success = document.getElementById('reserveSuccess');
    const codeEl  = document.getElementById('reserveCode');
    const storeEl = document.getElementById('successStoreName');
    const store   = document.getElementById('reserveStoreName')?.textContent || '';

    if (codeEl)  codeEl.textContent  = code;
    if (storeEl) storeEl.textContent = store;
    if (step1)   step1.classList.add('hidden');
    if (success) success.classList.remove('hidden');
    showToast(`Reserved! Your code is ${code}`, 'success');
  }

  function showDemoReserveSuccess() {
    const code = 'BIRP-' + Math.floor(1000 + Math.random() * 9000);
    showReserveSuccess(code);
  }
})();


/* ─────────────────────────────────────────────
   21. RESERVE BUTTON — gate behind login
       If user not logged in, show login modal
───────────────────────────────────────────── */
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.btn-reserve');
  if (!btn || btn.disabled) return;

  // Check if logged in
  const { data: { session } } = await _supabase.auth.getSession().catch(() => ({ data: { session: null } }));

  if (!session) {
    e.preventDefault();
    e.stopImmediatePropagation();
    showToast('Please log in to reserve a bag', 'info');
    const authModal = document.getElementById('authModal');
    if (authModal) {
      authModal.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Switch to login tab
      authModal.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === 'login'));
      authModal.querySelectorAll('.tab-content').forEach(c => c.classList.toggle('active', c.id === 'tab-login'));
    }
  }
}, true); // capture phase so this fires before onclick


/* ─────────────────────────────────────────────
   22. FORGOT PASSWORD
───────────────────────────────────────────── */
(function initForgotPassword() {
  // "Forgot your password?" uses data-switch="forgot" which is handled
  // by the existing switchTab mechanism in IIFE 4.
  // We only need to handle the form submission here.

  document.addEventListener('submit', async (e) => {
    if (e.target.id !== 'forgotForm') return;
    e.preventDefault();

    const email = document.getElementById('forgotEmail')?.value;
    const btn   = e.target.querySelector('button[type="submit"]');
    if (!email) return;

    btn.textContent = 'Sending…';
    btn.disabled    = true;

    const redirectTo = 'https://birp.co.za/reset-password.html';

    const { error } = await _supabase.auth.resetPasswordForEmail(email, { redirectTo });

    btn.textContent = 'Send Reset Link';
    btn.disabled    = false;

    if (error) {
      showToast(error.message, 'error');
    } else {
      showToast('Reset link sent! Check your email.', 'success');
      // Go back to login view
      document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
      const login = document.getElementById('tab-login');
      if (login) login.classList.add('active');
      document.querySelectorAll('.tab-btn').forEach((b, i) => b.classList.toggle('active', i === 0));
    }
  });
})();
