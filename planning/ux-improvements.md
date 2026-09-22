# Birp — UX Improvements & Missing Features

_Discussed during development session. Organised by priority._

---

## For Customers

### High Priority

**1. Area / suburb labels on deal cards**
Customers can't tell if a store is near them. Every deal currently looks equally relevant.
Add a suburb label to each card (e.g. "Claremont", "Sea Point", "Woodstock").
- Quick win, high impact.

**2. Pickup availability / stock status**
No indication of how many bags are left or whether a store is open today.
- Add "X bags left" to create urgency.
- Add a "Sold out" state to cards when applicable.

**3. Filter by area**
Current filters are by food type (Bakery, Café, etc.) only — not by location.
A Cape Town user needs to know if a store is 5 minutes away or 20.

**4. Reserve confirmation clarity**
After the demo reserve flow, the toast disappears and nothing persists.
- Show a proper confirmation screen with the pickup code more clearly.
- Eventually: a confirmation email.

**5. Store detail / individual store page**
Tapping a deal card goes nowhere. Users can't see:
- Store address
- Opening/collection hours
- Other available bags from the same store

This is the biggest missing piece on `deals.html`.

**6. "How it works" context on the deals page**
The How It Works section only exists on the home page. A user landing directly on `deals.html` has no context for what a "surprise bag" is or how pickup works.
- Add a small explainer banner or tooltip.

**7. Empty state for search / filter**
If a search returns no results, the grid goes blank with no message.
- Add a friendly "No deals found — try a different filter or search term" message.

---

## For Participating Stores

**1. Store onboarding / information page**
Currently the only path for a store is "contact us." There's no page that explains:
- What the process looks like
- What the commitment is
- Whether it costs anything (it doesn't)
- What a "surprise bag" means operationally

A store owner landing on the site can't self-assess whether Birp is right for them.

**2. FAQ page or section**
Both customers and stores will have the same questions repeatedly:
- "Is it free for stores?"
- "What if no one picks up my bag?"
- "How does payment work?"
- "What counts as a surprise bag?"
- "What areas do you cover?"

A short FAQ reduces friction and builds trust for both audiences.

**3. Coverage area indicator**
Stores want to know: is Birp operating in my area?
Customers want to know the same.
Even a simple list ("Currently serving: Claremont, Woodstock, Observatory, Sea Point") sets expectations.

**4. Social proof for stores**
Customers have testimonials on the home page. Stores have nothing.
- Add impact numbers ("X kg rescued", "X new customers reached per store")
- Add a quote from a participating store once you have one

---

## Cross-Cutting (affects both)

**1. Custom 404 page**
GitHub Pages shows a generic error on broken links. A custom `404.html` with a friendly message ("Lost your bag?") and links back home takes under 30 minutes and looks far more polished.

**2. Placeholder footer links**
Several footer links (`FAQ`, `Partner With Us`, `WhatsApp Community`) point to `#` and look broken.
- Remove them, or link to the relevant section/page.

**3. Accessibility audit**
- SVG icons should have `aria-hidden="true"` or an `aria-label` on their wrappers (most do, but audit all).
- Form inputs should have proper `<label>` associations.
- Colour contrast on chartreuse + white is borderline — check with a contrast checker.

**4. Mobile testing on a real device**
The site has been built and tested in a browser window. Test on an actual phone to catch layout issues (card cramping, tap target sizes, sticky search bar behaviour).

---

## Suggested Priority Order

| # | Task | Effort | Impact |
|---|------|--------|--------|
| 1 | Area/suburb labels on deal cards | Low | High |
| 2 | Empty state for search/filter | Low | Medium |
| 3 | FAQ section (home page or own page) | Low | High |
| 4 | Store onboarding/information section | Medium | High |
| 5 | Custom `404.html` | Low | Medium |
| 6 | Fix/remove placeholder footer links | Low | Low |
| 7 | Store detail / deal card page | High | High |
| 8 | Availability / stock status on cards | Medium | High |
| 9 | Area filter on deals page | Medium | Medium |
| 10 | Full accessibility audit | Medium | Medium |

---

## App / PWA Roadmap (discussed separately)

- Current site is static HTML/CSS/JS — no backend, no real auth.
- Login/signup and reserve flows are demo interactions (toast messages only).
- **Next step agreed:** Build as a **Progressive Web App (PWA)** first — free, installable on phones via "Add to Home Screen", no App Store fees.
  - Requires: `manifest.json`, app icon, service worker, wiring the Download button to the install prompt.
- **After PWA:** Add a real backend (recommended: Supabase or Firebase) for live store listings, user accounts, and real reservations.
- **App Store listing:** Google Play = $25 one-time. Apple App Store = $99/year. Not needed until the project is more established.

---

## Store Outreach

A prompt template for generating partner outreach emails was shared (suitable for ChatGPT/Claude):

> Write a professional but warm cold outreach email from Grade 9 students at Bishops (Diocesan College), Cape Town, pitching **Birp** to a local [restaurant / bakery / café / grocery store / deli].
> Birp connects local businesses with customers buying surplus food at up to 70% off as "surprise bags." 100% of proceeds go to food-security charities. No cost to stores.
> Tone: genuine, enthusiastic, community-minded. Under 250 words. End with a low-pressure call to action (short call or coffee meeting).
> Format: subject line + email body. Use placeholders [Store Name], [Your Name], [Contact Detail].

**Tips:**
- Personalise the opening line for each store before sending.
- Send from `birp@bishops.org.za` (or set up a dedicated Gmail until the school address is live).
- Keep a simple tracking sheet: store name, date sent, response (yes / no / follow up).

---

_Last updated: session with Kiro, September 2026._
