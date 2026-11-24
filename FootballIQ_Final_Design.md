# FootballIQ — Final Design System

## 1. Purpose

FootballIQ is a European football player market-value prediction SaaS.

This document is the **visual source of truth** for the frontend implementation.

The design combines:

1. The FootballIQ/Ventriloc-inspired visual system from `DESIGN (2).md`.
2. The editorial/broadsheet qualities from `DESIGN (3).md`.
3. FootballIQ-specific product requirements.
4. A deliberately restrained motion system for scroll and interaction.

Important: `DESIGN (3).md` does not explicitly document animation, scroll-trigger, GSAP, Lenis, Framer Motion, parallax, reveal, or transition specifications. Therefore, the motion rules in this document are **implementation recommendations**, not claims about the source file.

---

# 2. Core Design Direction

FootballIQ should feel like:

> An editorial football market observatory — precise, quiet, monochrome, data-led, with one orange ember.

The interface should feel closer to a premium annual report or football analytics publication than a conventional SaaS dashboard.

The visual hierarchy must come from:

- typography
- whitespace
- composition
- thin rules
- monochrome photography
- data visualizations
- restrained orange accents

Avoid visual noise.

---

# 3. Non-Negotiable Visual Rules

## Do

- Keep the page approximately 95% achromatic.
- Use warm white rather than a cold blue-white.
- Use Graphite for major typography.
- Use Ember Orange only as an accent.
- Use large editorial headlines.
- Keep display typography at weight 400.
- Use generous whitespace.
- Use thin-stroke icons.
- Use football/player imagery as editorial photography.
- Use charts and valuation data as visual content.
- Keep buttons square.
- Keep cards restrained.
- Let the player image remain unobstructed.
- Keep the hero minimal.
- Never place charts, metric popups, floating cards, or valuation overlays over the player's face/body.

## Do not

- Use blue or green as brand colors.
- Use gradients.
- Use generic glassmorphism.
- Use excessive shadows.
- Use giant collections of floating cards.
- Use stock-photo collage layouts.
- Cover the hero player with charts.
- Put a large market-value number such as `€180M` in the hero.
- Put explanatory paragraphs below the hero headline.
- Add a row of feature cards immediately below the hero headline.
- Overload the first viewport.
- Use bold display typography.
- Turn orange into the primary CTA background.

---

# 4. Color System

```css
:root {
  --color-graphite: #202020;
  --color-canvas-white: #ffffff;
  --color-ash: #efefef;
  --color-fog: #f5f5f5;
  --color-ivory: #ebe6dd;
  --color-steel: #4d4d4d;
  --color-slate: #828282;
  --color-mist: #e8e8e8;
  --color-ember-orange: #ff682c;
  --color-brass: #816729;
}
```

### Usage

- Graphite: headings, navigation, primary text, icons, buttons.
- Canvas White: page background.
- Ash: section surfaces and restrained containers.
- Fog: nested surfaces.
- Ivory: occasional warm editorial block.
- Steel: body copy.
- Slate: muted metadata.
- Mist: hairlines and subtle borders.
- Ember Orange: active state, small highlights, underline, tiny data accents.
- Brass: secondary chart/data accent.

The original reference explicitly limits orange to functional punctuation rather than a dominant UI color. fileciteturn14file0L14-L23

---

# 5. Typography

## Primary display face

Preferred:

`PolySans`

Fallback:

`Inter Tight`, then `Space Grotesk`, then system sans.

Display:

- Weight: 400
- Size: 66px desktop
- Line height: 0.91
- Letter spacing: -1.32px

The reference defines PolySans as a restrained weight-400 display face. fileciteturn14file0L27-L32

## Body/UI

Preferred:

`Inter`

Weights:

- 400 body
- 500/600 only where needed for UI metadata

Body:

- 18px hero supporting text
- 14–16px normal UI
- 12–13px metadata

Do not make the main display headline bold.

---

# 6. Spacing

Base unit:

`4px`

Preferred scale:

- 8
- 12
- 16
- 20
- 36
- 40
- 60
- 80
- 140

Global:

- Max content width: 1200px
- Section gap: 80px
- Element gap: 20px
- Card padding: 40px

These values follow the original design reference. fileciteturn14file0L52-L85

---

# 7. Shape Language

| Element | Radius |
|---|---:|
| Buttons | 0px |
| Standard cards | 8px |
| Data cards | 20px |
| Tags | 20px |
| Navigation pill | 200px |
| Featured asymmetric card | `6px 0 0 0` |

No generic rounded-everything UI.

The radius system is part of the editorial identity. fileciteturn14file0L71-L79

---

# 8. Navigation

Desktop header:

```text
FootballIQ                         Home   How it works   Player Database   Methodology   Pricing      Sign in   Get started
```

Visual treatment:

- white/warm-white canvas
- thin bottom hairline
- restrained navigation
- no heavy navbar shadow
- Graphite text
- active item may use a tiny Ember Orange underline
- `Get started` is Graphite with white text
- square CTA

The navigation should never compete with the hero.

---

# 9. Hero

## Hero objective

Immediately communicate:

> FootballIQ tells you what a football player is worth.

## Required content

Small label:

`AI-POWERED PLAYER VALUATION`

Main headline:

`Know what a player is worth.`

Supporting paragraph:

Do not use the longer explanatory paragraph from the previous concept.

The hero should remain minimal.

Primary interaction:

`Search for a player...` → `Get valuation →`

Right side:

- large grayscale footballer image
- subtle warm halo
- optional tiny editorial annotation such as `AGE 22`
- very subtle dotted data texture

### Critical composition rule

The footballer must remain visually unobstructed.

Do not place:

- charts
- valuation cards
- popups
- metric cards
- graphs
- large numbers
- floating dashboard cards

over the player.

This is a deliberate product-specific adaptation of the reference.

---

# 10. Hero Composition

Desktop:

```text
┌──────────────────────────────────────────────────────────────┐
│ FootballIQ       navigation                         CTA      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  AI-POWERED PLAYER VALUATION       AGE 22                    │
│                                                              │
│  Know what a                    [ unobstructed player        │
│  player is worth.                portrait ]                  │
│                                                              │
│  [ Search for a player... ][ Get valuation → ]              │
│                                                              │
│                                  player image / halo          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

The hero should breathe.

---

# 11. Player Image Treatment

The player image should be:

- grayscale or near-monochrome
- high contrast
- editorial
- large
- vertically dominant
- isolated against the warm canvas

The `DESIGN (3).md` reference treats photography as monochrome editorial imagery rather than colorful marketing photography. fileciteturn14file1L135-L138

However, FootballIQ should **not** copy its green color treatment. FootballIQ remains orange/graphite.

---

# 12. Editorial Influence From DESIGN (3)

Use the following qualities from `DESIGN (3).md`:

- editorial broadsheet feeling
- oversized typography
- generous vertical rhythm
- monochrome imagery
- restrained micro-labels
- strong typographic hierarchy
- large visual pauses
- magazine-like section composition

Do NOT import:

- neon green
- green shadows
- dark green footer
- green accent bands
- serif-first typography
- giant 295px headlines
- green duotone photography

Those belong to the source's separate visual identity.

The source describes a 1400px editorial canvas and very large display typography; these should be treated as inspiration for rhythm, not copied literally into FootballIQ. fileciteturn14file1L206-L208

---

# 13. Motion System

## Important source note

`DESIGN (3).md` contains no explicit animation/scroll implementation specification.

Therefore the following motion system is a FootballIQ implementation recommendation designed to achieve the editorial scrolling feel requested by the product owner.

## Motion philosophy

Motion should feel:

- slow
- editorial
- deliberate
- physical
- quiet

Never:

- flashy
- game-like
- bouncy
- excessive
- constantly moving

---

# 14. Scroll Reveal

Sections should enter progressively as the user scrolls.

Recommended behavior:

```text
initial:
opacity: 0
transform: translateY(32px)

visible:
opacity: 1
transform: translateY(0)
```

Recommended duration:

`700–900ms`

Recommended easing:

`cubic-bezier(0.22, 1, 0.36, 1)`

Use Intersection Observer or a lightweight animation library.

Avoid animating every tiny child separately.

---

# 15. Hero Motion

On first load:

1. Navigation fades in.
2. Hero label appears.
3. Headline rises subtly.
4. Search bar follows.
5. Player image fades upward/slightly inward.

Recommended stagger:

```text
nav:      0ms
label:   100ms
headline: 180ms
search:   300ms
player:   150ms
```

The animation must finish quickly enough that the page feels responsive.

---

# 16. Player Parallax

On desktop only:

The player may move slightly slower than the page during scroll.

Recommended range:

`translateY: 0 → -40px`

Keep movement extremely subtle.

No aggressive mouse-follow effect.

No 3D rotation.

No floating/bouncing player.

---

# 17. Headline Scroll Treatment

The hero headline can subtly move upward as the hero leaves the viewport.

Example:

```text
scroll progress 0%:
translateY(0)
opacity 1

scroll progress 70%:
translateY(-30px)
opacity 0.92

scroll progress 100%:
translateY(-60px)
opacity 0
```

This should be subtle and must not make text difficult to read.

---

# 18. Section Transitions

Use large whitespace as the primary transition.

Preferred:

```text
white
↓
80px+ breathing space
↓
Ash section
↓
80px+ breathing space
↓
white
```

Avoid animated separators.

The original reference specifically uses whitespace and alternating white/Ash surfaces instead of visible section dividers. fileciteturn14file0L140-L143

---

# 19. Data Visualization Motion

Charts can animate when entering the viewport.

Recommended:

- line draws from left to right
- bars rise vertically
- values count up once
- duration 900–1400ms
- animation occurs once

Do not continuously animate charts.

Do not animate data that changes the actual prediction.

---

# 20. Prediction Result Animation

When a prediction returns:

1. Loading state.
2. Result container appears.
3. Estimated market value fades upward.
4. Supporting metrics appear.
5. Chart draws.
6. Small orange accent appears last.

The numerical result should be immediately readable.

Never delay the actual value behind a long animation.

---

# 21. Reduced Motion

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

The app must remain fully usable without animation.

---

# 22. Landing Page Structure

```text
Home
│
├── Header
│
├── Hero
│   ├── AI valuation label
│   ├── Editorial headline
│   ├── Player portrait
│   ├── Player search
│   └── Get valuation CTA
│
├── Market Value Explanation
│
├── How FootballIQ Works
│
├── Example Valuation
│
├── Data / Methodology
│
├── CTA
│
└── Footer
```

The hero should remain the visually dominant section.

---

# 23. Prediction Page

Route:

`/predict`

Structure:

```text
Player profile inputs
        ↓
Performance inputs
        ↓
League / position context
        ↓
Predict
        ↓
Loading
        ↓
Prediction result
```

Keep the form visually editorial rather than dashboard-heavy.

---

# 24. Prediction Result

The result should contain:

```text
Estimated Market Value
€77.3M

League
Premier League

Position
Forward

Performance
18 goals
7 assists
2,640 minutes
7.5 rating
```

Use restrained cards.

No visual clutter.

The large number is appropriate on the result page, but not in the hero.

---

# 25. Players Page

Route:

`/players`

Use:

- searchable player list
- compact table
- market value
- league
- position
- rating
- selected performance metrics

Table styling:

- white background
- hairline rules
- Graphite text
- Ember Orange only for active/selected states

---

# 26. Methodology Page

Route:

`/methodology`

Explain:

- data source
- preprocessing
- feature engineering
- model
- target transformation
- evaluation
- limitations
- interpretation

Important product language:

FootballIQ estimates a player's **current market value from a data snapshot**.

It should not be presented as a guaranteed future transfer fee.

---

# 27. Responsive Design

## Desktop

Two-column hero.

## Tablet

Reduce hero image width and headline size.

## Mobile

Single column:

```text
Header
↓
Label
↓
Headline
↓
Player image
↓
Search
↓
CTA
```

The player must remain unobstructed on mobile too.

Do not layer charts over the player.

---

# 28. Accessibility

- semantic HTML
- keyboard navigation
- visible focus states
- sufficient text contrast
- descriptive image alt text
- accessible form labels
- reduced-motion support
- no information conveyed through color alone

---

# 29. Performance

- lazy-load below-the-fold imagery
- optimize player images
- avoid large animation libraries if CSS/IntersectionObserver is sufficient
- avoid continuous scroll handlers where possible
- use `requestAnimationFrame` for custom scroll effects
- animate only transform and opacity when possible
- keep charts lightweight

---

# 30. Final Visual Rule

If a design decision conflicts with visual complexity and whitespace, choose whitespace.

FootballIQ should look expensive because it is restrained.

The interface should feel:

**quiet → precise → editorial → analytical → football-native**

not:

**busy → colorful → gamified → generic SaaS**.
