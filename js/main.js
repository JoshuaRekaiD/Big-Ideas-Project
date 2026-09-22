/* =========================================================
   BIRP — MAIN JAVASCRIPT
   ========================================================= */

'use strict';

/* ─────────────────────────────────────────────
   0. PWA — Register service worker
───────────────────────────────────────────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/Big-Ideas-Project/sw.js')
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
    } else {
      // Keep scrolled on inner pages that force it
      if (!navbar.classList.contains('scrolled-forced')) {
        navbar.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Mobile hamburger
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // Close nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
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
   4. AUTH MODAL
───────────────────────────────────────────── */
(function initAuthModal() {
  const overlay = document.getElementById('authModal');
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

  // Tab switches inside the form
  overlay.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // "Switch" links inside form text
  overlay.querySelectorAll('[data-switch]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(link.dataset.switch);
    });
  });

  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Handle form submissions (demo)
  const loginForm  = overlay.querySelector('#tab-login form');
  const signupForm = overlay.querySelector('#tab-signup form');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Welcome back! 👋', 'success');
      closeModal();
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Account created! Welcome to Birp 🌿', 'success');
      closeModal();
    });
  }
})();


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
    font-family: 'Plus Jakarta Sans', sans-serif;
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
   12. CONTACT FORM (home page — demo)
───────────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.reset();
    showToast("Thanks! We'll be in touch soon 💚", 'success');
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
