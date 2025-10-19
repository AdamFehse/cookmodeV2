# CookMode V2 - Project Documentation

**Last Updated**: 2025-10-18

## Project Overview

CookMode V2 is a real-time collaborative recipe management system designed for professional kitchens. It allows multiple cooks to track recipe preparation progress, scale ingredients, assign chefs, and coordinate workflow statuses.

### Core Philosophy
- **Cook-friendly**: Fast, simple, intuitive interface
- **Pico CSS**: Minimal styling, semantic HTML
- **Real-time sync**: Live updates across all clients
- **No build step**: Vanilla JavaScript, direct browser loading

## Tech Stack

### Frontend
- **React 18.2.0** (production build, no JSX)
- **Pico CSS v2** (~10kb, classless CSS framework)
- **Vanilla JavaScript** (ES6+)

### Backend
- **Supabase** (PostgreSQL + Real-time subscriptions)
- **Row Level Security** (permissive policies for kitchen environment)

### Development
- **No build tools** (direct browser loading)
- **No TypeScript/JSX** (pure JavaScript)
- **Git** for version control

## Project Structure

```
cookmodeV2/
├── index.html                          # Main entry point
├── recipes.js                          # Recipe data (global window.RECIPES)
├── supabase-schema.sql                 # Database schema
├── supabase-migration-*.sql            # Database migrations
├── styles/
│   └── main.css                        # Custom Pico CSS overrides (~330 lines, uses Pico variables)
├── js/
│   ├── components/                     # React components
│   │   ├── App.js                     # Root component
│   │   ├── Header.js                  # App header with connection status
│   │   ├── RecipeGrid.js              # Recipe cards with filtering
│   │   ├── RecipeModal.js             # Recipe detail modal
│   │   └── Lightbox.js                # Image viewer
│   ├── hooks/                          # Custom React hooks
│   │   ├── useSupabase.js             # Supabase client initialization
│   │   ├── useRecipeData.js           # Recipe state management
│   │   └── useRealtime.js             # Real-time subscriptions
│   ├── utils/                          # Utility functions
│   │   ├── scaling.js                 # Ingredient scaling logic
│   │   └── keys.js                    # State key generation utilities
│   └── constants/
│       └── index.js                   # Status constants (DEFAULT_CHEF_COLOR, etc.)
└── .claude/                            # Claude Code configuration
    ├── SKILLS_GUIDE.md                # How to use skills
    └── skills/                        # Specialized AI agents
        ├── source-of-truth/           # Codebase documentation
        ├── recipe-manager/            # Recipe data management
        └── database-manager/          # Database operations
```

## Key Features

### 1. Recipe Display & Filtering
- Grid layout of recipe cards
- Filter by category, dish, ingredient, component
- Text search across all recipe fields
- Responsive design (desktop → tablet → mobile)

### 2. Recipe Details Modal
- Chef assignment with color badges
- Order count slider (1-50x) for scaling
- Ingredient lists grouped by component
- Step-by-step instructions with checkboxes
- Photo gallery with lightbox viewer
- Workflow status buttons (gathered, complete, plated, packed)

### 3. Real-Time Collaboration
- Ingredient check synchronization
- Step completion tracking
- Recipe status updates
- Order count changes
- Chef assignments

### 4. Ingredient Scaling
- Automatic quantity calculation based on order count
- Supports fractions (1/2, 1/4) and decimals (0.5, 2.5)
- Preserves ingredient descriptions
- Real-time update on slider change

## Data Flow

### Application Lifecycle

1. **Initialization** (`index.html` loads)
   ```
   React → ReactDOM → App.js
   ```

2. **Supabase Setup** (`useSupabase`)
   ```
   Create client → Test connection → Set isSupabaseConnected
   ```

3. **Data Loading** (`useRecipeData`)
   ```
   Fetch from Supabase:
   - ingredient_checks
   - step_checks
   - recipe_status
   - recipe_order_counts
   - recipe_chef_names
   ```

4. **Real-Time Subscriptions** (`useRealtime`)
   ```
   Subscribe to table changes → Update local state → UI re-renders
   ```

### User Interaction Flow

```
User clicks recipe card
    ↓
RecipeModal opens with recipe data
    ↓
User checks ingredient
    ↓
Optimistic UI update (immediate)
    ↓
Supabase upsert (async)
    ↓
Real-time broadcast to other clients
    ↓
Other clients update their UI
```

## Database Schema

### Tables

#### ingredient_checks
Tracks which ingredients have been gathered.

```sql
PRIMARY KEY (recipe_slug, ingredient_index, component_name)
- recipe_slug: TEXT
- ingredient_index: INTEGER
- component_name: TEXT
- ingredient_text: TEXT
- is_checked: BOOLEAN
- updated_at: TIMESTAMP
```

#### step_checks
Tracks which instruction steps have been completed.

```sql
PRIMARY KEY (recipe_slug, step_index)
- recipe_slug: TEXT
- step_index: INTEGER
- step_text: TEXT
- is_checked: BOOLEAN
- updated_at: TIMESTAMP
```

#### recipe_status
Current workflow status of each recipe.

```sql
PRIMARY KEY (recipe_slug)
- recipe_slug: TEXT
- status: TEXT (gathered | complete | plated | packed)
- updated_at: TIMESTAMP
```

#### recipe_order_counts
Number of orders being prepared.

```sql
PRIMARY KEY (recipe_slug)
- recipe_slug: TEXT
- order_count: INTEGER (1-50)
- updated_at: TIMESTAMP
```

#### recipe_chef_names
Chef assignments with badge colors.

```sql
PRIMARY KEY (recipe_slug)
- recipe_slug: TEXT
- name: TEXT
- color: TEXT (hex color)
- updated_at: TIMESTAMP
```

### Real-Time Configuration

All tables have real-time enabled via Supabase publication:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE table_name;
```

Subscriptions managed in `useRealtime.js:15-80`

## Component Architecture

### App.js
Root component that:
- Initializes Supabase connection
- Manages cook name (localStorage)
- Renders Header, RecipeGrid, RecipeModal, Lightbox
- Handles loading and error states

**Key Props Flow**:
```javascript
App
├── Header (cookName, setCookName, supabase, isSupabaseConnected)
├── RecipeGrid (recipes, recipeStatus, recipeChefNames, orderCounts)
├── RecipeModal (selectedRecipe, ...recipeData operations)
└── Lightbox (lightboxImage, lightboxIndex, setters)
```

### RecipeGrid.js
Displays recipe cards with filtering.

**Features**:
- 5 filter types (category, dish, component, ingredient, search)
- Dynamic filter options from recipe data
- Category-ordered display (Entree → Side → Soup → Dessert)
- Responsive grid layout

**State**:
- `filterText`, `selectedCategory`, `selectedDish`, `selectedIngredient`, `selectedComponent`

### RecipeModal.js
Full recipe details in a dialog overlay.

**Layout**:
```
┌─────────────────────────────────────┐
│ Title                  [Close]      │
├─────────────────────────────────────┤
│ Chef: [Name] [Color]   Photos       │
├──────────────────┬──────────────────┤
│ Ingredients      │ Instructions     │
│ [Slider] 6x      │ Status: [Btns]   │
│                  │                  │
│ □ Component      │ 1. □ Step        │
│   □ Ingredient   │ 2. □ Step        │
│                  │                  │
│                  │ Notes            │
└──────────────────┴──────────────────┘
```

**Key Functions**:
- `handleOrderChange()` - Validates and updates order count
- `getStatusButtonClass()` - Applies active/inactive status styles

### Hooks

#### useSupabase.js
Creates and manages Supabase client.

```javascript
const { supabase, isSupabaseConnected, setIsSupabaseConnected } = useSupabase();
```

#### useRecipeData.js
Central state management for all recipe data.

**State**:
- `orderCounts`, `completedIngredients`, `completedSteps`
- `recipeStatus`, `recipeChefNames`

**Operations**:
- `updateOrderCount()`, `toggleIngredient()`, `toggleStep()`
- `updateRecipeStatus()`, `updateChefName()`

**Helper Functions** (eliminates duplication):
- `upsertToSupabase(table, data, conflictKey)` - Centralized upsert with error handling
- `deleteFromSupabase(table, slug)` - Centralized delete with error handling

**Pattern**: Optimistic updates + async Supabase sync via helpers

#### useRealtime.js
Establishes real-time subscriptions for collaborative features.

```javascript
useRealtime(
    supabase,
    isSupabaseConnected,
    setCompletedIngredients,
    setCompletedSteps,
    setRecipeStatus,
    setOrderCounts,
    setRecipeChefNames
);
```

Listens to `INSERT`, `UPDATE`, `DELETE` on all tables.

**Uses key generation utilities** from `/js/utils/keys.js` to maintain consistency.

### Utilities

#### keys.js
Centralized key generation for state tracking.

**Functions**:
- `generateIngredientKey(recipeSlug, componentName, ingredientIndex)` - Creates ingredient state key
- `generateIngredientKeyFromItem(item)` - Creates key from database item
- `generateStepKey(recipeSlug, stepIndex)` - Creates step state key
- `generateStepKeyFromItem(item)` - Creates key from database item

**Format**: `${recipeSlug}-ing-${componentName}-${ingredientIndex}` for ingredients, `${recipeSlug}-step-${stepIndex}` for steps

**Purpose**: Single source of truth for key formatting prevents inconsistencies across hooks.

#### scaling.js
Ingredient amount scaling and formatting.

**Functions**:
- `parseAmount(amount)` - Converts strings/fractions to numbers
- `scaleAmount(ingredientObj, multiplier)` - Scales ingredient by order count
- `getIngredientName(ingredientObj)` - Extracts ingredient name from object

**Works exclusively with object format** - no backward compatibility for string format.

## Styling Architecture

### Pico CSS Approach

**Philosophy**: ZERO custom CSS if possible - rely entirely on Pico's semantic HTML styling

**Core Principle**: If you need custom CSS, you're probably using the wrong HTML element.

**Base Styles** (from Pico - use these, not custom CSS):
- Typography (headings, paragraphs, blockquote)
- Forms (inputs, selects, buttons, fieldset, legend, label)
- Components (article, dialog, nav, mark)
- Grid system (native CSS grid via className="grid")
- Semantic elements (header, section, details, summary)
- Dark mode (automatic via @media prefers-color-scheme)

### Custom CSS Strategy

**Current State**: ~330 lines in `styles/main.css`

**Goal**: Minimize to absolute essentials only:
- Application-specific layouts that Pico doesn't provide
- Functional requirements (positioning, sizing) not semantic styling
- Zero color overrides (use Pico's CSS variables)
- Zero typography changes (use Pico's defaults)

**When Custom CSS is Acceptable**:
1. Layout-only (grid, flex positioning)
2. Functional (hover effects for interactions)
3. Cannot be achieved with semantic HTML + Pico

**When Custom CSS is NOT Acceptable**:
1. Colors (use Pico variables like `--pico-primary`)
2. Typography (use semantic elements like `<mark>`, `<strong>`)
3. Spacing (use Pico's spacing variables)
4. Component styling (use correct semantic element)

### Color Scheme

**Status Colors** (using Pico CSS variables):
- Gathered: `var(--pico-ins-color)` ✅
- Complete: `var(--pico-valid-color)` ✅
- Plated: `var(--pico-primary-background)` ✅
- Packed: `var(--pico-secondary-background)` ✅

**Chef Badges**:
- Default: `DEFAULT_CHEF_COLOR` constant (`#9333ea` purple)
- User-defined: Hex colors from database (inline styles only)

### Pico CSS Elements Reference

**Use these before writing custom CSS**:

#### Semantic Structure
- `<header>` - Page/section header with automatic styling
- `<nav>` - Navigation with horizontal layout
- `<main>` - Main content area
- `<section>` - Content sections with spacing
- `<article>` - Card-like containers with borders/shadows
- `<aside>` - Sidebar content
- `<footer>` - Footer with muted styling

#### Typography
- `<h1>` through `<h6>` - Headings with appropriate sizing
- `<p>` - Paragraphs with proper spacing
- `<blockquote>` - Quoted content with left border
- `<mark>` - Highlighted text (use for badges!)
- `<strong>`, `<em>` - Bold and italic
- `<small>` - Smaller text

#### Forms
- `<input>` - All types styled consistently
- `<select>` - Dropdown menus
- `<button>` - Primary, secondary, contrast variants
- `<fieldset>` + `<legend>` - Form grouping
- `<label>` - Form labels with proper spacing

#### Interactive
- `<details>` + `<summary>` - Collapsible sections
- `<dialog>` - Modal overlays
- `<a>` - Links with hover states
- `<button>` - Interactive buttons

#### Layout
- `className="grid"` - CSS Grid layout
- `className="container"` - Centered content
- `className="container-fluid"` - Full-width content

#### Pico CSS Variables (use these for colors/spacing)
```css
--pico-primary               /* Primary color */
--pico-primary-background    /* Primary button bg */
--pico-secondary             /* Secondary color */
--pico-contrast              /* High contrast text */
--pico-muted-color           /* Muted/disabled text */
--pico-spacing               /* Standard spacing unit */
--pico-border-radius         /* Border radius */
--pico-font-family           /* Base font */
```

**Example**: Instead of custom `.badge { background: #3b82f6 }`, use `<mark>` which automatically uses Pico's styling.

## Recipe Data Format

### Schema (New Structured Format)

```javascript
'recipe-slug': {
    name: 'Display Name',                    // Required
    category: 'Entree|Side|Soup|Dessert',    // Required
    components: {                            // Required
        'Component Name': [
            {
                amount: number | string,     // 2, 0.5, '1/3', '1/2'
                unit: string,               // 'cup', 'tbsp', 'oz', 'lb', 'cloves', etc.
                ingredient: string,         // 'carrots', 'olive oil', 'garlic'
                prep: string                // Optional: 'diced', 'minced', 'divided'
            }
        ]
    },
    instructions: [                          // Required
        'Step 1...',
        'Step 2...'
    ],
    notes: 'string' | ['array', 'of', 'strings'],  // Optional
    images: ['url1', 'url2']                 // Optional
}
```

### Example Recipe

```javascript
'mushroom-bourguignon': {
    name: 'Mushroom Bourguignon',
    category: 'Entree',
    components: {
        'Mushroom Bourguignon': [
            { amount: 2, unit: 'tbsp', ingredient: 'olive oil', prep: 'divided' },
            { amount: 16, unit: 'oz', ingredient: 'cremini mushrooms', prep: 'sliced' },
            { amount: 5, unit: 'large', ingredient: 'carrots', prep: 'peeled and sliced' },
            { amount: 1, unit: 'large', ingredient: 'sweet onion', prep: 'diced' },
            { amount: 4, unit: 'cloves', ingredient: 'garlic', prep: 'minced' },
            { amount: 1.5, unit: 'cups', ingredient: 'red wine', prep: 'Pinot Noir' },
            { amount: 2, unit: 'cups', ingredient: 'vegetable broth' }
        ],
        'Serving Suggestion': [
            { amount: 1, unit: 'recipe', ingredient: 'mashed potatoes', prep: 'or rice/pasta' }
        ]
    },
    instructions: [
        'Heat 1 tbsp olive oil in large pot over medium-high heat...',
        'Add carrots and onions, cook until softened...'
    ],
    notes: 'Pairs well with truffle mashed potatoes.'
}
```

### Ingredient Object Structure

**Required Fields**:
- `amount`: Number or fraction string (2, 0.5, '1/4', '1/3')
- `unit`: Unit of measurement ('cup', 'tbsp', 'tsp', 'oz', 'lb', 'cloves', 'large', 'medium', etc.)
- `ingredient`: The ingredient name ('carrots', 'garlic', 'olive oil')

**Optional Fields**:
- `prep`: Preparation notes ('diced', 'minced', 'divided', 'plus more to taste')

### Amount Format

**Numbers** (preferred):
```javascript
{ amount: 2, unit: 'cups', ingredient: 'flour' }           // 2 cups
{ amount: 0.5, unit: 'lb', ingredient: 'butter' }          // 0.5 lb
{ amount: 0.25, unit: 'tsp', ingredient: 'salt' }          // 0.25 tsp
```

**Fractions** (as strings):
```javascript
{ amount: '1/2', unit: 'cup', ingredient: 'milk' }         // 1/2 cup
{ amount: '1/4', unit: 'tsp', ingredient: 'pepper' }       // 1/4 tsp
{ amount: '1/3', unit: 'cup', ingredient: 'water' }        // 1/3 cup
```

### Scaling Logic (New)

```javascript
// Object format - much simpler!
const scaled = {
    ...ingredientObj,
    amount: parseAmount(ingredientObj.amount) * orderCount
};

function parseAmount(amount) {
    if (typeof amount === 'number') return amount;
    // Handle fractions: '1/2' → 0.5
    if (amount.includes('/')) {
        const [num, den] = amount.split('/').map(Number);
        return num / den;
    }
    return parseFloat(amount);
}

// Display: "6.00 cups flour, diced"
```

Implementation: `/js/utils/scaling.js`

### Display Format

```javascript
// Format for display in RecipeModal
function formatIngredient(obj, orderCount) {
    const scaledAmount = parseAmount(obj.amount) * orderCount;
    const prep = obj.prep ? `, ${obj.prep}` : '';
    return `${scaledAmount.toFixed(2)} ${obj.unit} ${obj.ingredient}${prep}`;
}

// Output: "6.00 cups flour, sifted"
```

### Migration from Old Format

**Old (string format)**:
```javascript
'2 cups all-purpose flour'
'1/4 tsp salt'
'1 large onion, diced'
```

**New (object format)**:
```javascript
{ amount: 2, unit: 'cups', ingredient: 'all-purpose flour' }
{ amount: 0.25, unit: 'tsp', ingredient: 'salt' }
{ amount: 1, unit: 'large', ingredient: 'onion', prep: 'diced' }
```

**Conversion Tool**: Use ChatGPT/Claude to convert existing recipes:
> "Convert this recipe to the structured format with amount, unit, ingredient, prep fields"

## Development Workflow

### Local Development

1. **Start local server**:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```

2. **Open browser**: `http://localhost:8000`

3. **Configure Supabase**:
   - Update connection details in `useSupabase.js`
   - Or use environment variables

### Making Changes

#### Adding a Recipe
1. Edit `recipes.js`
2. Follow schema format
3. Ensure ingredients start with numbers
4. Use Recipe Manager skill for validation

#### Modifying Components
1. Edit component file in `js/components/`
2. Use `React.createElement()` (no JSX)
3. Test in browser (no build needed)
4. Check console for errors

#### Database Changes
1. Write migration in `supabase-migration-*.sql`
2. Apply via Supabase dashboard or CLI
3. Update hooks if schema changed
4. Test real-time sync

#### Styling Changes
1. **First**: Try to solve with semantic HTML (right element = right style)
2. **Second**: Use Pico CSS variables (no custom colors/fonts)
3. **Third**: Inline styles for one-off positioning/sizing
4. **Last Resort**: Custom CSS in main.css (layout/functional only)
5. **Never**: Custom colors, typography, or component styling

**Decision Tree**:
```
Need styling?
  → Try different HTML element (article, mark, dialog, etc.)
    → Still need styling?
      → Use Pico variable (--pico-primary, --pico-spacing, etc.)
        → Still need styling?
          → Inline style for positioning/sizing
            → Still need styling?
              → Document why in main.css comment
```

### Git Workflow

```bash
# Check status
git status

# Stage changes
git add .

# Commit
git commit -m "Brief description"

# Push
git push origin main
```

## Common Tasks

### Add New Recipe

**Use**: Recipe Manager skill

1. Create slug (kebab-case)
2. Fill required fields
3. Format ingredients with quantities
4. Add to recipes.js

### Update Database Schema

**Use**: Database Manager skill

1. Write migration file
2. Test locally
3. Apply to Supabase
4. Update hooks if needed

### Debug Real-Time Issues

**Use**: Source of Truth skill

1. Check browser console for errors
2. Verify Supabase connection status
3. Test table subscriptions
4. Check RLS policies

### Add New Component

1. Create file in `js/components/`
2. Use React.createElement pattern
3. Export to window global
4. Import in index.html
5. Use in parent component

## Troubleshooting

### Recipes Not Loading
- Check `window.RECIPES` in console
- Verify recipes.js syntax (no trailing commas)
- Check browser console for errors

### Supabase Connection Failed
- Verify URL and anon key in useSupabase.js
- Check network tab for 401/403 errors
- Confirm RLS policies allow access

### Ingredients Not Scaling
- Ensure ingredient starts with number
- Check scaleAmount() function
- Verify orderCount is passed correctly

### Real-Time Not Syncing
- Check Supabase dashboard for active connections
- Verify table has RLS policy
- Check useRealtime subscriptions
- Look for WebSocket errors in console

### Checkboxes Look Weird
- Remove custom label styling (use Pico only)
- Check label contains checkbox + text directly
- Verify no extra span wrappers

## Skills System

CookMode V2 uses Claude Code Skills for specialized assistance.

### Available Skills

1. **Source of Truth** (`.claude/skills/source-of-truth/`)
   - Documents codebase without suggesting changes
   - Use for "how does X work?" questions

2. **Recipe Manager** (`.claude/skills/recipe-manager/`)
   - Manages recipe data in recipes.js
   - Use for adding/editing recipes

3. **Database Manager** (`.claude/skills/database-manager/`)
   - Handles Supabase schema and migrations
   - Use for database changes

### Using Skills

Skills activate automatically when relevant, or invoke explicitly:
```
"Use the Recipe Manager skill to add a chocolate cake recipe"
```

See `.claude/SKILLS_GUIDE.md` for detailed usage and creation instructions.

## Maintenance

### Regular Updates

**This Document** (CLAUDE.md):
- Update after major features
- Document breaking changes
- Add new patterns
- Remove deprecated info

**Skills**:
- Keep schemas current
- Update file paths
- Add new examples
- Remove outdated guidance

### Best Practices

1. **Zero Custom CSS**: Exhaust semantic HTML and Pico variables first
2. **Semantic HTML First**: `<mark>` not `.highlight`, `<dialog>` not `.modal`
3. **Pico Variables Only**: `--pico-primary` not `#3b82f6`
4. **Optimistic UI**: Update locally, sync async
5. **No Build Tools**: Stay vanilla JavaScript
6. **DRY Principles**: Use helper functions and utilities to eliminate duplication
7. **Centralize Constants**: Single source of truth (DEFAULT_CHEF_COLOR, key formats, etc.)
8. **Key Generation**: Always use utilities from `/js/utils/keys.js` for state keys
9. **Document Changes**: Update CLAUDE.md after major features

### CSS Refactoring Opportunities

**Goal**: Reduce `styles/main.css` from ~330 lines toward zero.

**Completed** (2025-10-18):
- ✅ Status button colors now use Pico CSS variables (`--pico-ins-color`, `--pico-valid-color`)
- ✅ DEFAULT_CHEF_COLOR centralized as constant

**Remaining Candidates**:
- Custom badge styling → Use `<mark>` element
- Typography overrides → Use correct semantic elements
- Spacing adjustments → Use Pico spacing variables
- Layout-specific CSS → Evaluate if achievable with grid/flex + Pico

**Process**:
1. Identify custom CSS rule
2. Find equivalent Pico element/variable
3. Update component to use semantic HTML
4. Remove custom CSS
5. Test thoroughly

## Project History

### Recent Major Changes

**2025-10-18**: Codebase Refactoring (Phases 1-3)
- **Phase 1: Quick Wins** (~17 lines removed)
  - Removed backward compatibility for old string-based recipe format
  - Centralized DEFAULT_CHEF_COLOR constant in `/js/constants/index.js`
  - Replaced hardcoded hex colors with Pico CSS variables (`--pico-ins-color`, `--pico-valid-color`)
  - Updated all components/hooks to use centralized constant
- **Phase 2: Dead Code Removal** (~32 lines removed)
  - Completed metadata removal (ingredientMetadata, stepMetadata states)
  - Aligned codebase with documented 2024-12 metadata removal
  - Removed unused checked_by tracking from hooks
- **Phase 3: Hooks Refactoring** (~125 lines removed)
  - Created `/js/utils/keys.js` with centralized key generation utilities
  - Added helper functions in useRecipeData.js (upsertToSupabase, deleteFromSupabase)
  - Refactored updateOrderCount, updateRecipeStatus, updateChefName (55% code reduction)
  - Updated useRealtime.js and useRecipeData.js to use key utilities
  - **Total reduction**: ~174 lines (~19% of hooks code)
- **Benefits**: Improved maintainability, DRY principles, single source of truth for constants and key formats

**2025-01-18**: Skills system + Zero CSS philosophy + Structured recipe format
- Created source-of-truth, recipe-manager, database-manager skills
- Added SKILLS_GUIDE.md
- Created this CLAUDE.md documentation
- **New philosophy**: ZERO custom CSS - semantic HTML + Pico only
- Goal: Reduce main.css from 330 lines toward zero
- **BREAKING**: New structured recipe format (objects instead of strings)
  - Old: `'2 cups flour'`
  - New: `{ amount: 2, unit: 'cups', ingredient: 'flour' }`
  - **Requires**: Update `scaling.js`, `RecipeModal.js`, `RecipeGrid.js`
  - **Benefit**: No regex parsing, better filtering, cleaner scaling

**2025-01**: Pico CSS Migration
- Removed Tailwind CSS (~1030 lines of utilities)
- Adopted Pico CSS v2 (classless, semantic)
- Reduced custom CSS from 1030 → 330 lines
- Used semantic HTML throughout (dialog, article, fieldset, etc.)

**2024-12**: Metadata Removal
- Removed ingredient/step checked_by tracking
- Simplified database writes
- Improved performance (no lag on checkbox clicks)

## Future Considerations

**Not Planned** (keep simple):
- Build tools (webpack, vite)
- TypeScript
- State management libraries (Redux, Zustand)
- CSS-in-JS
- Component libraries

**Maybe Later**:
- Recipe ratings
- Print mode
- Offline support
- Recipe import/export
- Recipe categories customization

## Resources

### Documentation
- **This file**: Project overview and reference
- **SKILLS_GUIDE.md**: How to use and create skills
- **Individual skills**: Specialized context

### External Docs
- [Pico CSS](https://picocss.com/)
- [React](https://react.dev/)
- [Supabase](https://supabase.com/docs)

### Project Files
- `recipes.js`: Recipe data
- `supabase-schema.sql`: Database structure
- `styles/main.css`: Custom styles

---

**Remember**: This document should be updated regularly. After major features or changes, update this file to keep context fresh for future Claude sessions.

Last updated: 2025-10-18 by Claude Code
