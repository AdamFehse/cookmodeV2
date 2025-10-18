# CookMode V2 - Project Documentation

**Last Updated**: 2025-01-18

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
│   └── main.css                        # Custom Pico CSS overrides (~330 lines)
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
│   │   └── scaling.js                 # Ingredient scaling logic
│   └── constants/
│       └── index.js                   # Status constants and styles
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

**Pattern**: Optimistic updates + async Supabase sync

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

## Styling Architecture

### Pico CSS Approach

**Philosophy**: Semantic HTML + minimal overrides

**Base Styles** (from Pico):
- Typography (headings, paragraphs)
- Forms (inputs, selects, buttons)
- Components (cards, modals, navigation)
- Grid system
- Dark mode support

**Custom Overrides** (`styles/main.css`):
- Recipe grid layout
- Status badges and buttons
- Modal dimensions
- Lightbox controls
- Checkbox styling (li.checked)

**Total Custom CSS**: ~330 lines (down from 1030 Tailwind utilities)

### Color Scheme

**Status Colors**:
- Gathered: `#fbbf24` (amber)
- Complete: `#10b981` (green)
- Plated: Pico primary (blue)
- Packed: Pico secondary (gray)

**Chef Badges**: User-defined hex colors (default `#9333ea`)

## Recipe Data Format

### Schema

```javascript
'recipe-slug': {
    name: 'Display Name',                    // Required
    category: 'Entree|Side|Soup|Dessert',    // Required
    components: {                            // Required
        'Component Name': [
            'number unit ingredient description'
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

### Ingredient Format Rules

**MUST start with number for scaling**:
```javascript
✅ '2 cups flour'
✅ '1/4 tsp salt'
✅ '0.5 lb butter'

❌ 'Salt to taste'     // No number
❌ 'Pinch of cinnamon' // No number
```

Regex pattern: `/^([\d.\/]+)\s+(.+)$/`

### Scaling Logic

```javascript
// Input: "2 cups flour", orderCount: 3
// Process:
1. Extract: amount = "2", rest = "cups flour"
2. Parse: 2 (or handle fraction 1/2 → 0.5)
3. Multiply: 2 * 3 = 6
4. Format: "6.00 cups flour"
```

Implementation: `/js/utils/scaling.js:3-20`

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
1. Check if Pico CSS provides what you need
2. Only add custom CSS if necessary
3. Use Pico variables for consistency
4. Keep overrides minimal

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

1. **Keep It Simple**: Follow Pico CSS philosophy
2. **Semantic HTML**: Use proper elements
3. **Optimistic UI**: Update locally, sync async
4. **No Build Tools**: Stay vanilla
5. **Document Changes**: Update CLAUDE.md

## Project History

### Recent Major Changes

**2025-01-18**: Skills system implementation
- Created source-of-truth, recipe-manager, database-manager skills
- Added SKILLS_GUIDE.md
- Created this CLAUDE.md documentation

**2025-01**: Pico CSS Migration
- Removed Tailwind CSS
- Adopted Pico CSS v2
- Reduced custom CSS from 1030 → 330 lines
- Used semantic HTML throughout

**2024-12**: Metadata Removal
- Removed ingredient/step checked_by tracking
- Simplified database writes
- Improved performance

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

Last updated: 2025-01-18 by Claude Code
