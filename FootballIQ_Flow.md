# FootballIQ — Frontend Flow & Interaction Specification

## 1. Product Flow

```text
Landing Page
   │
   ├── Predict Market Value
   │       │
   │       ├── Player / performance form
   │       ├── Client validation
   │       ├── POST /api/v1/predict
   │       │
   │       ├── Success
   │       │     └── Prediction Result
   │       │
   │       └── Error
   │             └── Inline error state
   │
   ├── Explore Players
   │
   └── Methodology
```

---

# 2. Application Routes

| Route | Purpose |
|---|---|
| `/` | Editorial landing page |
| `/predict` | Prediction form |
| `/result` | Prediction result |
| `/players` | Player database |
| `/methodology` | Model/data explanation |

---

# 3. Header Flow

```text
FootballIQ
   ├── Home
   ├── How it works
   ├── Player Database
   ├── Methodology
   ├── Pricing
   ├── Sign in
   └── Get started
```

Mobile:

```text
FootballIQ                  Menu
                              ↓
                       navigation drawer
```

Keep mobile navigation minimal.

---

# 4. Hero Flow

```text
Page load
   ↓
Hero animation
   ↓
Player image remains unobstructed
   ↓
User enters/searches player
   ↓
Get valuation
   ↓
Navigate to /predict
```

If player search is not connected to a player database yet, the input can act as an entry point to the prediction form.

---

# 5. Prediction Form

Required conceptual fields:

- league
- position
- age
- appearances
- minutes
- goals
- assists
- rating
- other model-required inputs

The backend should remain the source of truth for the model feature construction.

Do not duplicate ML logic in React.

---

# 6. API Flow

Frontend:

```text
POST ${VITE_API_BASE_URL}/api/v1/predict
```

Backend:

```text
request
  ↓
Pydantic validation
  ↓
feature construction
  ↓
saved sklearn pipeline
  ↓
log prediction
  ↓
exp(prediction) - 1
  ↓
JSON response
```

---

# 7. Prediction State Machine

```text
IDLE
 │
 ├── edit
 ↓
EDITING
 │
 ├── submit
 ↓
SUBMITTING
 │
 ├── API success
 │       ↓
 │    SUCCESS
 │       ↓
 │    RESULT
 │
 └── API / validation error
         ↓
       ERROR
         │
         └── edit
              ↓
           EDITING
```

---

# 8. Loading State

Loading should be minimal.

Use:

- small progress indicator
- short text such as `Calculating valuation`
- no giant spinner
- no blocking full-screen animation

The UI must not feel slower than the model actually is.

---

# 9. Prediction Result Flow

```text
Prediction received
        ↓
Result container enters
        ↓
Market value appears
        ↓
Supporting metrics appear
        ↓
Chart draws
        ↓
User can:
   ├── Predict another player
   ├── Explore player data
   └── Read methodology
```

---

# 10. Scroll Flow

## Landing page

```text
LOAD
 ↓
Hero reveal
 ↓
Hero scroll/parallax
 ↓
How it works reveal
 ↓
Data section reveal
 ↓
Example valuation reveal
 ↓
Methodology reveal
 ↓
CTA reveal
 ↓
Footer
```

Motion is intentionally restrained.

---

# 11. Scroll Animation Rules

### Section reveal

Initial:

```css
opacity: 0;
transform: translateY(32px);
```

Visible:

```css
opacity: 1;
transform: translateY(0);
```

Use:

```text
700–900ms
cubic-bezier(0.22, 1, 0.36, 1)
```

### Player parallax

Desktop only:

```text
0px → -40px
```

### Hero headline

Very subtle upward movement as hero leaves viewport.

### Charts

Animate once on entering viewport.

### Result value

Fade/translate into place, then supporting data.

---

# 12. Scroll Implementation

Preferred approach:

1. CSS transitions for simple entrance effects.
2. IntersectionObserver for viewport reveals.
3. CSS `transform` and `opacity`.
4. `requestAnimationFrame` only for custom parallax.
5. Use a motion library only if it materially simplifies implementation.

Do not introduce GSAP solely for basic reveals.

---

# 13. Reduced Motion

All non-essential movement must disappear or become effectively instant when:

```css
prefers-reduced-motion: reduce
```

Never make core information dependent on animation.

---

# 14. Error Flow

## Validation error

Display next to the relevant field.

Example:

```text
Rating
[ 15 ]

Rating must be between 1.0 and 10.0.
```

## API error

Display a compact editorial error block:

```text
Unable to calculate valuation.
Please try again.
```

Provide a retry action.

---

# 15. API Configuration

Frontend environment:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Production should replace this with the deployed FastAPI URL.

Never hardcode production URLs throughout components.

---

# 16. React Structure

```text
src/
├── components/
│   ├── Navbar
│   ├── Hero
│   ├── PlayerPortrait
│   ├── PredictionForm
│   ├── PredictionResult
│   ├── MetricCard
│   ├── ValuationChart
│   ├── SectionReveal
│   └── Footer
│
├── pages/
│   ├── Home
│   ├── Predict
│   ├── Result
│   ├── Players
│   └── Methodology
│
├── services/
│   └── api.js
│
├── hooks/
│   └── useScrollReveal.js
│
├── styles/
│   └── tokens.css
│
└── App.jsx
```

---

# 17. Design Guardrails

Before accepting a frontend change, verify:

- Is the player still unobstructed?
- Did a new card make the hero busier?
- Did orange become too dominant?
- Did someone introduce blue/green?
- Did someone bold the main headline?
- Did someone add a shadow?
- Did a new animation make the page feel like a gaming site?
- Is the page still readable with animations disabled?

If any answer is undesirable, simplify.

---

# 18. Definition of Done

The frontend is complete when:

- React/Vite app runs.
- FastAPI connection works.
- `/api/v1/predict` is connected.
- Form validation works.
- Loading/error/success states work.
- Result page works.
- Hero matches the design system.
- Player image is never covered by UI.
- Scroll reveals work.
- Reduced motion works.
- Responsive layouts work.
- No horizontal overflow exists.
- Lighthouse/performance is reasonable.
- No console errors remain.
