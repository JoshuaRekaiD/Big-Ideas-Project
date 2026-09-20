---
name: add-deal-card
description: Add a new food deal card to the Birp deals page (deals.html). Use when the user wants to add, create, or list a new deal, bundle, store, or surplus food offer on the deals grid.
---

# Add a Deal Card to Birp

Use this skill to add a new food-deal card to the grid in `deals.html`. Follow it exactly so the new card matches the existing cards and works with the filters, search, and reserve modal.

## Steps

1. **Open `deals.html`** and find the deals grid: `<div class="deals-grid" id="dealsGrid">`. The cards live inside it, each starting with `<!-- Deal Card N -->`.

2. **Pick the category.** It must be one of the existing filter values so the filter buttons work:
   `restaurant`, `bakery`, `cafe`, `grocery`, or `deli`.
   (If the user wants a brand-new category, you must also add a matching `<button class="filter-btn" data-filter="NEW">` in the `.filters-row` near the top of the file.)

3. **Copy the card template below**, paste it as the next card inside `deals-grid`, and fill in the values. Insert it after the last existing deal card.

4. **Update the results count.** The `<p class="results-count" id="resultsCount">Showing <strong>12</strong> deals</p>` number is a static starting value — bump it to match the new total number of cards.

5. **Bump the CSS cache-buster** only if you changed CSS (usually not needed for adding a card). Adding a card is HTML-only.

## Card template

```html
<!-- Deal Card N -->
<div class="deal-card reveal" data-category="CATEGORY">
  <div class="deal-badge">🔥 Almost Gone</div> <!-- OPTIONAL: remove this line if no badge -->
  <div class="deal-img deal-img-CATEGORY"></div>
  <div class="deal-body">
    <div class="deal-cat-tag">EMOJI Category Name</div>
    <h3>STORE NAME</h3>
    <p class="deal-desc">Short appetising description of what's in the bundle.</p>
    <div class="deal-time">⏰ Pick up: 4:00 PM – 5:30 PM</div>
    <div class="deal-footer">
      <div class="deal-price">
        <span class="price-now">R 30</span>
        <span class="price-was">R 90</span>
      </div>
      <button class="btn-reserve" onclick="openReserveModal(this)"
              data-store="STORE NAME" data-item="BUNDLE NAME" data-price="R30">Reserve</button>
    </div>
  </div>
</div>
```

## Filling in the fields

- `data-category` — one of `restaurant | bakery | cafe | grocery | deli`. Controls filtering.
- `deal-badge` — optional highlight pill. Common values: `🔥 Almost Gone`, `⚡ New`, `🔥 Popular`. Delete the whole `<div class="deal-badge">` line if not needed.
- `deal-img deal-img-CATEGORY` — the second class is meant to set the card photo via a CSS background image.
  > **KNOWN ISSUE:** the `deal-img-*` background rules (e.g. `deal-img-bakery`, `deal-img-restaurant2`) and the farm `farm-img-*` rules are referenced in the HTML but are **not currently defined in `css/main.css`**, so deal/farm cards show no photo. When adding a card, also add the matching rule in `css/main.css`, for example:
  > ```css
  > .deal-img-bakery { background: url('https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80') center/cover; }
  > ```
  > and make sure `.deal-img` itself has a height (e.g. `height: 200px;`). After editing CSS, bump the `?v=` cache-buster in all four HTML pages. If you'd rather not touch CSS, you can instead put an inline style directly on the div: `<div class="deal-img" style="background:url('https://images.unsplash.com/PHOTO?w=800&q=80') center/cover;height:200px;"></div>`.
- `deal-cat-tag` — emoji + category label shown on the card, e.g. `🍞 Bakery`, `🍽️ Restaurant`, `☕ Café`, `🛒 Grocery`, `🥩 Deli`.
- `<h3>` — the store/business name.
- `deal-desc` — one appetising sentence. Use `&amp;` for `&`.
- `deal-time` — the pickup window.
- `price-now` / `price-was` — Rand pricing, e.g. `R 30` and struck-through original `R 90`. Keep the discount realistic (roughly 50–70% off).
- **Reserve button data attributes** — `data-store`, `data-item`, and `data-price` feed the reserve popup. Keep them consistent with the card's store name and price. Note `data-price` has no space (e.g. `R30`).

## Verify
- The card appears in the grid and matches the others visually.
- Clicking its filter button shows/hides it correctly (category matches a filter).
- Clicking **Reserve** opens the modal with the right store name and price.
- The `resultsCount` number reflects the new total.

## Notes
- No JavaScript changes are needed — `js/main.js` handles new cards automatically via the shared filter, search, and reserve logic.
- Keep the tone warm and local (South African Rand pricing). See the `product` steering doc for voice.
