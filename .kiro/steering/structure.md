# Birp — Page Structure & Shared Patterns

This doc describes the repeating building blocks so edits stay consistent across all four pages.

## Shared navbar (top of every page)
Every page starts with the same `<nav class="navbar">`. The **correct** structure (as in `deals.html`) is:

```html
<nav class="navbar scrolled" id="navbar">
  <div class="nav-inner">
    <a href="index.html" class="logo">
      <span class="logo-leaf">🌿</span>
      <span class="logo-text">Birp</span>
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html">Home</a></li>
      <li><a href="deals.html">Find Deals</a></li>
      <li><a href="farms.html">Farm Surplus</a></li>
      <li><a href="about.html">Our Story</a></li>
      <li>
        <div class="nav-search">
          <span class="nav-search-icon">🔍</span>
          <input type="text" placeholder="Search deals…" id="navSearchInput" autocomplete="off" />
        </div>
      </li>
      <li><a href="#" class="btn-nav" id="openLogin">Log In</a></li>
      <li><a href="#" class="btn-nav btn-nav-filled" id="openSignup">Sign Up</a></li>
    </ul>
    <button class="hamburger" id="hamburger" aria-label="Toggle menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
```

Rules for the navbar:
- The current page's link gets `class="active"`.
- The `<a class="logo">` MUST be closed with `</a>` before the `<ul class="nav-links">` begins.
- The nav `<li>` items live **inside** `<ul class="nav-links">`, never inside the logo anchor.

> **KNOWN ISSUE — fix when touching these files:** `index.html` and `about.html` currently have a broken navbar — the logo `<a>` is not closed, the nav `<li>`s are nested inside it, there's a stray `</ul>` and no `.nav-links` wrapper or search bar. `deals.html` (shown above) is the correct reference. When editing those pages, repair the nav to match this structure so all four pages have an identical, working navbar.

## Shared footer (bottom of every page)
`<footer class="footer">` with a `.footer-grid` containing `.footer-brand` (logo + tagline) and `.footer-col` link columns, then a `.footer-bottom` copyright row. Keep it consistent across pages.

## Shared auth modal
Every page includes the same `#authModal` overlay with Login / Sign Up tabs. `js/main.js` wires `#openLogin`, `#openSignup`, and `#ctaSignup` to open it. If you add a button that should open signup, give it `id="ctaSignup"` or wire a new handler in the auth-modal IIFE.

## Common section pattern
Most content sections follow:
```html
<section class="SOME-section">
  <div class="container">
    <div class="section-header reveal">
      <span class="section-tag">EYEBROW LABEL</span>
      <h2>Section Heading</h2>
      <p>Optional intro paragraph.</p>
    </div>
    <!-- grid of cards -->
  </div>
</section>
```
- `.container` centres content and sets max-width + horizontal padding. Wrap section content in it.
- `.section-tag` is the small pill "eyebrow" label above headings.

## Animations / scroll reveal
- Add `class="reveal"` (fades/slides up) or `class="reveal-right"` (slides in from right) to any element you want animated on scroll. `js/main.js` uses an IntersectionObserver to add `.visible` when it enters the viewport. No JS wiring needed — just add the class.
- Animated counters: give a number element `class="stat-number" data-target="1234"` and it counts up when scrolled into view.

## Toasts
Call `showToast('message', 'success' | 'error' | 'info')` from anywhere in JS to show a temporary notification. Used by the demo login/signup/reserve flows.

## Pricing convention
Prices are in South African Rand, formatted like `R 45` with the old price struck through, e.g. `R 45 <s>R 130</s>`.
