# CookMode V2 - CSS Color System & Unified Architecture Guide

## Quick Reference: Color Management

### Status Colors (Primary Use Case)
All status colors are **centralized in `theme.css`** and should NEVER be hardcoded elsewhere.

```css
/* In theme.css */
--status-in-progress: #fbbf24;      /* Yellow (text: dark) */
--status-complete: #10b981;          /* Green (text: white) */
--status-plated: #f59e0b;            /* Amber (text: dark) */
--status-packed: #8b5cf6;            /* Purple (text: white) */
```

**Use in JavaScript:** Dynamic status buttons should use CSS variables, NOT hardcoded hex values:

```javascript
// ✅ CORRECT - Use CSS variables
const statusColor = {
  'in-progress': { bg: 'var(--status-in-progress)', text: 'var(--status-in-progress-text)' },
  'complete': { bg: 'var(--status-complete)', text: 'var(--status-complete-text)' },
  'plated': { bg: 'var(--status-plated)', text: 'var(--status-plated-text)' },
  'packed': { bg: 'var(--status-packed)', text: 'var(--status-packed-text)' }
};

// ❌ WRONG - Never hardcode hex values
const statusColor = {
  'in-progress': { bg: '#fbbf24', text: '#000000' },
};
```

---

## CSS Architecture Overview

### 1. **theme.css** - Central Design Token Library
The **single source of truth** for all colors, spacing, typography, and sizing.

**Location:** `styles/theme.css`

**Contains:**
- Primary brand colors (orange)
- Status colors (in-progress, complete, plated, packed)
- Semantic colors (success, error, warning)
- Surface/background colors (dark mode, light mode)
- Text colors (primary, secondary, muted, inverse)
- Border colors
- Typography scales
- Spacing scales (8px base)
- Shadow definitions
- Border radius values
- Z-index scale
- Breakpoints

**How to add new colors:**
```css
:root {
  --my-new-color: #hexvalue;
  --my-new-color-bg: rgba(hex, opacity);
  --my-new-color-text: #inverse-for-readability;
}
```

---

### 2. **pico-overrides.css** - Framework Customizations
Overrides Pico CSS framework defaults with your theme.

**Location:** `styles/pico-overrides.css`

**Contains:**
- Button styles (primary, secondary, outline, contrast)
- Form input styling
- Dialog/modal customizations
- Article/card styling
- Select dropdown styling
- Links and focus states

**Rules:**
- All color references should use `var(--color-*)` from theme.css
- No hardcoded hex values
- Use `!important` sparingly (only where Pico CSS specificity requires)

---

### 3. **components/status-badge.css** - Status Components
Unified styling for all status-related UI (badges, buttons, indicators).

**Location:** `styles/components/status-badge.css`

**Contains:**
- `.status-badge` - Static badge display
- `.status-button` - Interactive status buttons
- `.status-indicator` - Visual indicator circles
- Hover, active, and disabled states
- All uses CSS variables from theme.css

**Key Classes:**
```css
/* Static badges */
<span class="status-badge complete">complete</span>

/* Interactive buttons */
<button class="status-button" style="--status-bg: var(--status-complete); --status-text: var(--status-complete-text);">
  Complete
</button>

/* Color-specific buttons */
<button class="status-button in-progress">In Progress</button>
```

---

### 4. **utilities.css** - Single-Purpose Helper Classes
Reusable utility classes for spacing, text, backgrounds, and status colors.

**Location:** `styles/utilities.css`

**Status-specific utilities:**
```css
/* Text colors */
.text-status-in-progress { color: var(--status-in-progress); }
.text-status-complete { color: var(--status-complete); }

/* Background colors */
.bg-status-in-progress { background-color: var(--status-in-progress-bg); }
.bg-status-complete { background-color: var(--status-complete-bg); }

/* Border colors */
.border-status-in-progress { border-color: var(--status-in-progress); }
.border-status-complete { border-color: var(--status-complete); }
```

---

### 5. **Other Component Files**
- `recipe-grid.css` - Recipe card grid styling
- `recipe-modal.css` - Modal and recipe details
- `chef-cards.css` - Chef station and summary cards
- `layout.css` - Page layout patterns
- `background.css` - Vanta.js background
- `responsive.css` - Media queries

---

## JavaScript Color Usage Rules

### ✅ DO's:

1. **Use CSS Variable Names** (not resolved values):
```javascript
const statusColor = {
  'complete': { bg: 'var(--status-complete)', text: 'var(--status-complete-text)' }
};

// Use with inline styles:
style={{ '--status-bg': 'var(--status-complete)', '--status-text': 'var(--status-complete-text)' }}
```

2. **Store color maps once** at the top of files:
```javascript
const STATUS_COLORS = {
  'in-progress': { bg: 'var(--status-in-progress)', text: 'var(--status-in-progress-text)' },
  'complete': { bg: 'var(--status-complete)', text: 'var(--status-complete-text)' },
  // ...
};

// Reuse throughout file
const color = STATUS_COLORS[status] || STATUS_COLORS['in-progress'];
```

3. **Use theme colors for dynamic styling**:
```javascript
// For chef colors, etc.
borderColor: resolveChefColor(chef.color) // Converts CSS var to hex if needed
```

### ❌ DON'Ts:

1. **Never hardcode hex values:**
```javascript
// ❌ BAD
const colors = {
  'complete': { bg: '#10b981', text: '#ffffff' }
};
```

2. **Never define colors inline** unless absolutely necessary:
```javascript
// ❌ BAD
style={{ background: '#10b981', color: '#ffffff' }}

// ✅ GOOD
style={{ background: 'var(--status-complete)', color: 'var(--status-complete-text)' }}
```

3. **Never duplicate color definitions** across files:
```javascript
// ❌ BAD - color in RecipeModal.js
const statusColor = { 'complete': {...} };

// ❌ BAD - same color duplicated in ChefStations.js
const statusColors = { 'complete': {...} };

// ✅ GOOD - Define once, import as needed
import { STATUS_COLORS } from './constants';
```

---

## Status Button Hover Bug (FIXED)

### The Problem:
Status buttons weren't filling with color on hover because the CSS was trying to read the CSS variable NAME (`var(--status-complete)`) as a color value instead of resolving it.

### The Solution:
1. **Added text color variables** in theme.css for each status
2. **Created dedicated status-badge.css** with proper variable usage
3. **Fixed hover state** to correctly apply background and text colors
4. **Removed broken CSS** from pico-overrides.css

### Result:
Status buttons now properly fill with their color on hover AND display correct text color when active.

---

## Mini Cards Progress Text (FIXED)

The progress text "% done" now shows alongside status badges instead of hiding them.

**Fixed in:** `js/components/chef/ChefStations.js`
- Line 310: Removed `!recipeStatus` condition
- Line 145: Removed `&& !status` condition

---

## Color Decision Tree

When you need to add a color or style something:

```
Is it a status (in-progress, complete, plated, packed)?
├─ YES → Use variables from theme.css --status-*
└─ NO → Continue...

Is it a semantic color (success, error, warning)?
├─ YES → Use variables from theme.css --color-*
└─ NO → Continue...

Is it a surface/background color?
├─ YES → Use variables from theme.css --surface-*
└─ NO → Continue...

Is it a text color?
├─ YES → Use variables from theme.css --text-*
└─ NO → Continue...

Is it chef-specific (assigned colors)?
├─ YES → Use resolveChefColor() function
└─ NO → Add to theme.css as new --custom-* variable
```

---

## Adding New Status Types

If you need a new status (e.g., "archived"):

1. **Add to theme.css:**
```css
--status-archived: #6b7280;
--status-archived-bg: rgba(107, 114, 128, 0.15);
--status-archived-text: #ffffff;
```

2. **Add to status-badge.css:**
```css
.status-badge.archived {
  background-color: var(--status-archived-bg);
  color: var(--status-archived);
}
```

3. **Add to utilities.css:**
```css
.text-status-archived { color: var(--status-archived); }
.bg-status-archived { background-color: var(--status-archived-bg); }
```

4. **Update JavaScript STATUS_COLORS map:**
```javascript
const STATUS_COLORS = {
  // ... existing
  'archived': { bg: 'var(--status-archived)', text: 'var(--status-archived-text)' }
};
```

---

## Folder Structure

```
styles/
├── theme.css                    ← CSS variables (colors, spacing, typography)
├── pico-overrides.css           ← Framework customization
├── main.css                     ← Import orchestration
├── utilities.css                ← Helper classes
├── layout.css                   ← Layout patterns
├── background.css               ← Background styling
├── responsive.css               ← Media queries
└── components/
    ├── status-badge.css         ← Status components (NEW!)
    ├── recipe-grid.css
    ├── recipe-modal.css
    └── chef-cards.css
```

---

## Maintenance Checklist

When modifying colors:

- [ ] Update theme.css first
- [ ] Check if component file needs updates
- [ ] Verify JavaScript isn't hardcoding the value
- [ ] Test in both dark and light modes
- [ ] Test high contrast mode
- [ ] Verify all status buttons work on hover
- [ ] Check badge displays in modal and prep cards

---

## Common Status Color Reference

| Status | Color | Hex | Text Color | Use Case |
|--------|-------|-----|------------|----------|
| in-progress | Amber | #fbbf24 | Dark (#000) | Currently being worked on |
| complete | Green | #10b981 | White (#fff) | All steps done, ready for plating |
| plated | Orange | #f59e0b | Dark (#000) | Dish has been plated |
| packed | Purple | #8b5cf6 | White (#fff) | Dish has been packed |

---

## Questions?

Refer to the specific file for detailed implementation:
- **Colors:** `styles/theme.css`
- **Status Buttons:** `styles/components/status-badge.css`
- **Status in Modal:** `js/components/RecipeModal.js`
- **Status in Prep Cards:** `js/components/chef/ChefStations.js`
