# CookMode V2 – Ghost Kitchen Upgrade Checklist

## Goals
- Keep day-to-day planning simple for a 4–5 cook team.
- Surface who owns which dishes, what prep is needed today vs next two days, and highlight overload quickly.
- Stay within Pico CSS styling for fast implementation.
- Align tooling with the Sunday assignment → Monday prep → Tuesday delivery cadence.

## Phase 1 – Quick Wins
- [x] Extract chef tooling into `js/components/chef/` directory.
- [x] Break existing chef modal into data hook + presentational pieces.
- [x] Create a reusable helper to format chef name/color data.
- [x] Add a compact “Today’s Prep Summary” card (per chef: dishes, ingredient totals, outstanding steps).

## Phase 2 – Overview Board (Forest View)
- [x] Build `GhostKitchenOverview` container with Pico card grid.
- [x] Show per-chef workload cards (orders today, prep minutes, alert if > threshold).
- [x] Add simple order flow lanes (`Prep`, `Cooking`, `Plating`, `Ready`).
- [x] Integrate a lightweight heat-map bar (color intensity = workload) and document threshold defaults.

## Phase 3 – 3-Day Cycle Planning
- [x] Extend data hook utilities to compute `recipesByChef`, `ordersByStatus`, and 3-day prep counts.
- [x] Add a 3-column schedule view (Today / Tomorrow / Prep Day) summarizing tasks and ingredients.
- [ ] Include quick notes/flags section for low stock or supplier reminders.

## Phase 4 – Polish & Reliability
- [ ] Add filters for chef or dish category to the overview.
- [ ] Provide graceful fallback when Supabase is offline (show cached data / manual input note).
- [ ] Test layouts on tablet and laptop breakpoints.
- [ ] Update README with overview instructions and heat-map guidance.
- [ ] Prepare release notes / deployment checklist.

> Keep Pico CSS defaults; layer chef colors and heat-map accents with inline styles or minimal custom classes.
