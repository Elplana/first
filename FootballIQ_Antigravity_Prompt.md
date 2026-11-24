# Antigravity IDE Build Prompt — FootballIQ

You are the primary frontend engineering agent responsible for building the FootballIQ web application.

Read and follow these files as the project specification:

1. `FootballIQ_Final_Design.md` — visual/design source of truth.
2. `FootballIQ_Flow.md` — frontend application flow and interaction specification.
3. Existing FastAPI backend and ML artifact — source of truth for prediction behavior.

Do not invent a different visual identity.

---

## PRODUCT

Build:

**FootballIQ — European Player Market Value Predictor**

FootballIQ is a football analytics SaaS that estimates a player's current market value from performance, league, position, and player-profile data.

The product is not a generic dashboard.

It should feel like a premium editorial football data publication.

---

## TECH STACK

Frontend:

- React
- Vite
- React Router
- modern CSS
- optional lightweight animation utility if genuinely useful

Backend:

- FastAPI
- existing prediction endpoint:

`POST /api/v1/predict`

Environment:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Do not load the ML model in the browser.

Do not duplicate model calculations in React.

---

# VISUAL SOURCE OF TRUTH

Use the FootballIQ design system:

```text
Graphite      #202020
Canvas White  #ffffff
Ash           #efefef
Fog           #f5f5f5
Ivory         #ebe6dd
Steel         #4d4d4d
Slate         #828282
Mist          #e8e8e8
Ember Orange  #ff682c
Brass         #816729
```

Typography:

```text
Display: PolySans / Inter Tight / Space Grotesk
Weight: 400
Display size: 66px
Line height: 0.91
Tracking: -1.32px

Body: Inter
Hero body: 18px
```

Do not bold the main display headline.

Buttons:

- Graphite fill
- white text
- 0px radius
- no shadow

Do not use orange as the filled CTA.

---

# HERO

Build this hero:

Label:

`AI-POWERED PLAYER VALUATION`

Headline:

`Know what a player is worth.`

Do NOT add the previous explanatory paragraph underneath.

Do NOT add the previous:

- Data-driven
- Trusted insights
- For clubs, analysts & fans

feature row.

The hero must be minimal.

Primary interaction:

```text
[ Search for a player... ] [ Get valuation → ]
```

Right side:

- large grayscale football player portrait
- subtle warm halo
- optional tiny age annotation
- very subtle editorial/dotted texture

CRITICAL:

The player portrait must remain completely unobstructed.

Never place:

- graph
- chart
- valuation popup
- €180M / €200M style large valuation card
- statistics card
- dashboard card
- modal
- floating UI panel

over the player's face or body.

---

# EDITORIAL INFLUENCE

Use the editorial/broadsheet qualities of the secondary design reference:

- oversized typography
- generous whitespace
- monochrome photography
- strong vertical rhythm
- restrained micro-labels
- magazine-like composition

Do NOT import its green brand system.

Do not use:

- neon green
- green shadows
- green footer bands
- green duotone
- serif-first branding
- 295px display typography

FootballIQ remains graphite/warm-white/orange.

---

# ANIMATION

The supplied secondary design file does not explicitly define animation or scroll behavior.

Therefore implement a restrained editorial motion system rather than attempting to reproduce undocumented animations.

## Page load

Stagger:

```text
nav:       0ms
hero tag: 100ms
headline: 180ms
player:   150ms
search:   300ms
```

Animation:

```text
opacity: 0 → 1
translateY: 24–32px → 0
```

Duration:

```text
700–900ms
```

Easing:

```text
cubic-bezier(0.22, 1, 0.36, 1)
```

## Scroll reveals

Use IntersectionObserver.

Sections begin:

```css
opacity: 0;
transform: translateY(32px);
```

and resolve to:

```css
opacity: 1;
transform: translateY(0);
```

## Player parallax

Desktop only:

```text
0 → -40px
```

Keep this subtle.

No 3D rotations.

No aggressive mouse tracking.

## Hero headline

As the hero leaves the viewport, move the headline slightly upward and reduce opacity.

## Charts

Charts should animate once when entering the viewport.

## Prediction result

On successful prediction:

1. result container appears
2. market value appears
3. supporting metrics appear
4. chart draws
5. small orange accent finishes the sequence

Do not delay the actual market value excessively.

## Reduced motion

Respect:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

# ROUTES

Implement:

```text
/
 /predict
 /result
 /players
 /methodology
```

---

# COMPONENTS

Create:

```text
Navbar
Hero
PlayerPortrait
SearchBar
PredictionForm
PredictionResult
MetricCard
ValuationChart
SectionReveal
Footer
```

Pages:

```text
Home
Predict
Result
Players
Methodology
```

Services:

```text
api.js
```

---

# API

Call:

```text
POST ${VITE_API_BASE_URL}/api/v1/predict
```

Handle:

```text
idle
editing
submitting
success
error
```

Display validation errors inline.

Display API errors in a compact editorial error block.

Never expose backend implementation details to the user.

---

# RESPONSIVE

Desktop:

- two-column hero
- large player portrait

Tablet:

- reduce headline
- reduce portrait width

Mobile:

```text
Header
↓
Label
↓
Headline
↓
Player
↓
Search
↓
CTA
```

Never overlay UI over the player.

---

# ENGINEERING RULES

1. Inspect the existing project before modifying files.
2. Do not destroy working backend code.
3. Reuse existing API contract.
4. Keep ML logic server-side.
5. Keep components reusable.
6. Keep CSS organized.
7. Avoid unnecessary dependencies.
8. Avoid excessive animation libraries.
9. Do not introduce blue, green, gradients, glassmorphism, or generic SaaS shadows.
10. Do not add features that are not required for the MVP.
11. Test every route.
12. Test the prediction flow against the existing FastAPI server.
13. Check desktop, tablet, and mobile.
14. Check reduced-motion mode.
15. Fix console errors before finishing.

---

# ACCEPTANCE TEST

The build is acceptable only if:

- `npm run dev` works.
- Backend connection works.
- prediction request succeeds.
- validation errors display correctly.
- prediction result renders correctly.
- `/players` works as a usable page.
- `/methodology` explains the model.
- hero matches the intended FootballIQ design.
- hero is visually minimal.
- player portrait is never covered.
- no giant valuation popup exists in the hero.
- scroll reveals work.
- player parallax is subtle.
- reduced motion works.
- mobile layout works.
- no horizontal overflow exists.
- no console errors remain.

---

# FINAL DESIGN PRINCIPLE

When uncertain, choose:

**less UI + more typography + more whitespace + clearer data**

The result should feel:

**editorial, analytical, premium, quiet, precise, football-native.**

Do not turn FootballIQ into a generic AI SaaS dashboard.
