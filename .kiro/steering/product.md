# Birp — Product Overview

**Birp** is a food redistribution website. The slogan is **"Giving food a new birpose."**

## What it does
Birp connects users with discounted surplus food from local businesses before it goes to waste. It is inspired by Refreshi, Too Good To Go, and Food Forward SA, adapted for a South African audience.

Two kinds of participants:
- **Users** — browse and reserve discounted food bundles ("surprise bags") from nearby businesses.
- **Stores** — restaurants, cafés, bakeries, delis, grocery stores (and potentially farms) that list surplus food bundles at up to ~70% off.

**Charity focus:** Birp is not-for-profit. 100% of its proceeds go to charities fighting food insecurity in South Africa. This is a core part of the message and should be prominent.

**App-oriented:** Birp is presented as a mobile app. The home page pitches "Download the App" (placeholder only — the app does not exist yet, so download buttons/badges link nowhere / are marked "coming soon"). Store sign-ups happen by **contacting Birp**, not through a self-serve form.

> **Note:** The **farm surplus feature was dropped** (was a `farms.html` page + organic-waste/compost programme). Farms may still be a type of participating store, but there is no dedicated farm programme, page, or nav link anymore.

## Who built it
A group of Grade 9 students at **Bishops (Diocesan College)** in Cape Town, as part of the school's **Big Ideas** philanthropy and outreach programme. This is a student project, not a commercial product.

## Current state
This is a **static, front-end-only website** — HTML, CSS, and vanilla JavaScript. There is no backend, database, or real authentication. Login/signup and "reserve" actions are demo interactions that show toast messages; they do not persist data or talk to a server.

## The three pages
- `index.html` — home (app-oriented, Refreshi-inspired): hero with a **prominent search bar at the top**, then the slogan "Giving food a new birpose", a short blurb, and a **Download the App** button (placeholder). Below: How It Works (4 steps), the charity promise band, participating stores/partners (static grid — no marquee), customer/store benefits, an app-download banner, and a Contact Us section.
- `deals.html` — the "surprise bags near you" page: browse/filter/search available food bundles (deal cards). This is what the home search bar / "Order Online" link leads to.
- `about.html` — the story, mission/values, and founders.

(There is no `farms.html` — the farm feature was removed.)

## Tone & audience
Warm, optimistic, community-minded, and clearly student-made. Copy should feel approachable and South-African-local (uses Rand `R` pricing, references SA food waste stats). Keep it genuine — this is a school philanthropy project, not a corporate pitch.
