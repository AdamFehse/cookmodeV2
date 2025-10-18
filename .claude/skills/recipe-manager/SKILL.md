---
name: Recipe Manager
description: Helps add, edit, validate, and manage recipe data in recipes.js. Use this when the user wants to create new recipes, modify existing ones, fix recipe formatting, or validate recipe structure.
---

# Recipe Manager Skill

## Your Role

You specialize in managing recipe data for CookMode V2. You help users create, edit, and maintain recipe entries in the `recipes.js` file following the established schema and patterns.

## When to Use This Skill

Invoke this skill when the user wants to:
- Add a new recipe
- Edit an existing recipe
- Fix recipe formatting or structure
- Validate recipe data
- Convert recipe formats
- Bulk update recipe properties

## Recipe Data Schema

### Standard Recipe Structure

```javascript
'recipe-slug': {
    name: 'Display Name',
    category: 'Entree' | 'Side' | 'Soup' | 'Dessert',
    components: {
        'Component Name': [
            '2 cups ingredient name',
            '1/4 tsp another ingredient'
        ]
    },
    instructions: [
        'Step 1 instructions',
        'Step 2 instructions'
    ],
    notes: 'Single string' | ['Array', 'of', 'strings'],
    images: ['url1.jpg', 'url2.jpg'] // optional
}
```

### Required Fields
- `name` (string): Display name of the recipe
- `category` (string): One of: Entree, Side, Soup, Dessert
- `components` (object): Ingredient lists grouped by component
- `instructions` (array): Step-by-step cooking instructions

### Optional Fields
- `notes` (string or array): Additional tips or information
- `images` (array): URLs to recipe photos

## Ingredient Format Rules

### Quantity Patterns
Ingredients MUST start with a number for scaling to work:

✅ **Correct**:
```javascript
'2 cups all-purpose flour'
'1/4 tsp salt'
'0.5 lb butter, softened'
'1 medium onion, diced'
```

❌ **Incorrect**:
```javascript
'Salt to taste'           // No number
'Pinch of cinnamon'       // No number
'Some olive oil'          // No number
```

### Scaling Logic
The `scaleAmount()` function in `/js/utils/scaling.js`:
- Extracts the number at the start: `/^([\d.\/]+)\s+(.+)$/`
- Handles fractions: `1/4` → `0.25`
- Multiplies by order count
- Returns: `{scaledAmount} {restOfIngredient}`

Example: `"1 cup flour"` with 3x scaling → `"3.00 cup flour"`

## Category Order

Recipes display in this category order:
1. Entree
2. Side
3. Soup
4. Dessert

Defined in `/js/components/RecipeGrid.js:20`

## Notes Field Handling

The `RecipeModal.js` component handles notes in two formats:

1. **String**: Renders as single paragraph
2. **Array**: Renders each item as separate paragraph

```javascript
// Single note
notes: "Use a hand mixer for whipped texture."

// Multiple notes
notes: [
    "Use a hand mixer for whipped texture.",
    "Pairs well with mushroom bourguignon."
]
```

## Component Groups

Common component patterns:
- **Simple recipes**: Single component (e.g., 'Ingredients')
- **Complex recipes**: Multiple components (e.g., 'Dough', 'Filling', 'Topping')
- **Sauces**: Often separate component (e.g., 'Base', 'Sauce')

## Validation Checklist

When adding/editing recipes, verify:

- [ ] Slug is kebab-case (lowercase, hyphens)
- [ ] Name is human-readable
- [ ] Category is one of: Entree, Side, Soup, Dessert
- [ ] All ingredients start with a number
- [ ] Components object has at least one entry
- [ ] Instructions array has at least one step
- [ ] Notes field is string OR array (not object)
- [ ] Images are valid URLs (if provided)
- [ ] No trailing commas in arrays/objects
- [ ] Proper JavaScript syntax

## Common Tasks

### Adding a New Recipe

1. Create kebab-case slug
2. Follow schema structure
3. Ensure all ingredients have quantities
4. Add to appropriate category
5. Validate syntax

### Fixing Scaling Issues

If ingredients don't scale properly:
1. Check ingredient starts with number
2. Verify number format (decimal or fraction)
3. Test with `scaleAmount()` function

### Converting Recipes

When importing from external sources:
1. Extract name, category, ingredients, instructions
2. Group ingredients into components
3. Format ingredients with quantities first
4. Convert steps to array
5. Add to recipes.js

## File Location

**recipes.js**: `/Users/adamfehse/Documents/gitrepos/cookmodeV2/recipes.js`

This file is loaded as a global `window.RECIPES` object and accessed by:
- `App.js` - Passes to RecipeGrid and RecipeModal
- `RecipeGrid.js` - Displays cards and filters
- `RecipeModal.js` - Shows full recipe details

## Best Practices

1. **Keep it simple**: Pico CSS philosophy applies to data too
2. **Consistent formatting**: Follow existing patterns
3. **Clear component names**: 'Sauce', 'Dough', 'Filling' not 'Component 1'
4. **Precise quantities**: Include unit of measure
5. **Actionable instructions**: Each step should be clear

## Example: Adding a New Recipe

```javascript
'chocolate-chip-cookies': {
    name: 'Chocolate Chip Cookies',
    category: 'Dessert',
    components: {
        'Dough': [
            '2 cups all-purpose flour',
            '1 tsp baking soda',
            '1/2 tsp salt',
            '1 cup butter, softened',
            '3/4 cup granulated sugar',
            '3/4 cup brown sugar',
            '2 large eggs',
            '2 tsp vanilla extract'
        ],
        'Mix-ins': [
            '2 cups chocolate chips'
        ]
    },
    instructions: [
        'Preheat oven to 375°F.',
        'Mix flour, baking soda, and salt in a bowl.',
        'Cream butter and sugars until fluffy.',
        'Beat in eggs and vanilla.',
        'Gradually blend in flour mixture.',
        'Stir in chocolate chips.',
        'Drop rounded tablespoons onto ungreased cookie sheets.',
        'Bake 9-11 minutes or until golden brown.'
    ],
    notes: 'For chewier cookies, slightly underbake and let cool on baking sheet.'
}
```

Remember: Keep recipes cook-friendly and maintainable!
