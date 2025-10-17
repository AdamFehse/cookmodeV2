// Ingredient aggregation utility for calculating total shopping list
// Handles mixed units (lbs, cups, whole items, etc.)

const UNIT_CATEGORIES = {
    weight: ['lb', 'lbs', 'pound', 'pounds', 'oz', 'ounce', 'ounces', 'g', 'gram', 'grams', 'kg'],
    volume: ['cup', 'cups', 'tbsp', 'tablespoon', 'tablespoons', 'tsp', 'teaspoon', 'teaspoons',
             'ml', 'milliliter', 'milliliters', 'l', 'liter', 'liters', 'qt', 'quart', 'quarts',
             'pint', 'pints', 'gallon', 'gallons', 'fl oz'],
    count: ['whole', 'head', 'heads', 'clove', 'cloves', 'medium', 'small', 'large', 'can', 'cans'],
    descriptive: ['to taste', 'as needed', 'pinch', 'handful', 'bunch']
};

const WEIGHT_CONVERSIONS = {
    'oz': 1,
    'ounce': 1,
    'ounces': 1,
    'lb': 16,
    'lbs': 16,
    'pound': 16,
    'pounds': 16,
    'g': 0.035274,
    'gram': 0.035274,
    'grams': 0.035274,
    'kg': 35.274
};

const VOLUME_CONVERSIONS = {
    'tsp': 1,
    'teaspoon': 1,
    'teaspoons': 1,
    'tbsp': 3,
    'tablespoon': 3,
    'tablespoons': 3,
    'cup': 48,
    'cups': 48,
    'fl oz': 6,
    'ml': 0.202884,
    'milliliter': 0.202884,
    'milliliters': 0.202884,
    'l': 202.884,
    'liter': 202.884,
    'liters': 202.884
};

/**
 * Parse an ingredient string to extract amount, unit, and description
 * Example: "0.5 lb ground beef" -> { amount: 0.5, unit: 'lb', description: 'ground beef' }
 */
const parseIngredient = (ingredientText) => {
    // Handle fractions and decimals
    const fractionRegex = /^([\d.]+)\s*\/\s*([\d.]+)\s+([a-zA-Z\s]+?)\s+(.+)$/;
    const decimalRegex = /^([\d.]+)\s+([a-zA-Z\s]+?)\s+(.+)$/;
    const simpleRegex = /^([\d.]+)\s+(.+)$/;

    let match = ingredientText.match(fractionRegex);
    if (match) {
        const [_, num, den, unit, description] = match;
        return {
            amount: parseFloat(num) / parseFloat(den),
            unit: unit.trim().toLowerCase(),
            description: description.trim(),
            originalText: ingredientText
        };
    }

    match = ingredientText.match(decimalRegex);
    if (match) {
        const [_, amount, unit, description] = match;
        return {
            amount: parseFloat(amount),
            unit: unit.trim().toLowerCase(),
            description: description.trim(),
            originalText: ingredientText
        };
    }

    match = ingredientText.match(simpleRegex);
    if (match) {
        const [_, amount, description] = match;
        return {
            amount: parseFloat(amount),
            unit: 'whole',
            description: description.trim(),
            originalText: ingredientText
        };
    }

    // No amount found - treat as descriptive (e.g., "salt to taste")
    return {
        amount: null,
        unit: 'descriptive',
        description: ingredientText.trim(),
        originalText: ingredientText
    };
};

/**
 * Determine the category of a unit (weight, volume, count, descriptive)
 */
const getUnitCategory = (unit) => {
    for (const [category, units] of Object.entries(UNIT_CATEGORIES)) {
        if (units.some(u => unit.includes(u))) {
            return category;
        }
    }
    return 'count'; // Default to count if unknown
};

/**
 * Normalize similar ingredient descriptions
 * Example: "onion, diced" and "onions" both become "onion"
 */
const normalizeDescription = (description) => {
    let normalized = description.toLowerCase();

    // Remove common suffixes/preparation methods
    normalized = normalized
        .replace(/,.*$/, '') // Remove everything after comma
        .replace(/\(.*?\)/g, '') // Remove parentheses
        .replace(/\s+(diced|chopped|sliced|minced|grated|fresh|frozen|canned|whole|halved|quartered).*$/i, '')
        .trim();

    // Singularize common plurals
    normalized = normalized.replace(/ies$/, 'y').replace(/s$/, '');

    return normalized;
};

/**
 * Convert amount to base unit within category
 */
const convertToBaseUnit = (amount, unit, category) => {
    if (category === 'weight' && WEIGHT_CONVERSIONS[unit]) {
        return amount * WEIGHT_CONVERSIONS[unit]; // Convert to oz
    }
    if (category === 'volume' && VOLUME_CONVERSIONS[unit]) {
        return amount * VOLUME_CONVERSIONS[unit]; // Convert to tsp
    }
    return amount; // For count and descriptive, keep as-is
};

/**
 * Convert base unit back to preferred display unit
 */
const formatFromBaseUnit = (baseAmount, category) => {
    if (category === 'weight') {
        // Convert oz to lbs if >= 1 lb
        if (baseAmount >= 16) {
            return `${(baseAmount / 16).toFixed(2)} lbs`;
        }
        return `${baseAmount.toFixed(2)} oz`;
    }
    if (category === 'volume') {
        // Convert tsp to cups, tbsp, or keep as tsp
        if (baseAmount >= 48) {
            return `${(baseAmount / 48).toFixed(2)} cups`;
        }
        if (baseAmount >= 3) {
            return `${(baseAmount / 3).toFixed(2)} tbsp`;
        }
        return `${baseAmount.toFixed(2)} tsp`;
    }
    return baseAmount.toFixed(2);
};

/**
 * Aggregate ingredients across multiple recipes with order counts
 * @param {Object} recipes - The RECIPES object
 * @param {Object} orderCounts - { recipeSlug: count } mapping
 * @returns {Object} Aggregated ingredients grouped by category
 */
const aggregateIngredients = (recipes, orderCounts) => {
    const aggregated = {
        weight: {},
        volume: {},
        count: {},
        descriptive: []
    };

    // Process each recipe
    Object.entries(recipes).forEach(([slug, recipe]) => {
        const multiplier = orderCounts[slug] || 0;
        if (multiplier === 0) return; // Skip if no orders

        // Process all components
        Object.entries(recipe.components || {}).forEach(([componentName, ingredients]) => {
            ingredients.forEach(ingredientText => {
                const parsed = parseIngredient(ingredientText);
                const category = getUnitCategory(parsed.unit);

                if (category === 'descriptive' || parsed.amount === null) {
                    // Just list unique descriptive ingredients
                    const normalized = normalizeDescription(parsed.description);
                    if (!aggregated.descriptive.some(d => normalizeDescription(d) === normalized)) {
                        aggregated.descriptive.push(parsed.description);
                    }
                    return;
                }

                // Aggregate by normalized description
                const normalizedDesc = normalizeDescription(parsed.description);
                const scaledAmount = parsed.amount * multiplier;
                const baseAmount = convertToBaseUnit(scaledAmount, parsed.unit, category);

                // Create key for this ingredient
                const key = normalizedDesc;

                if (!aggregated[category][key]) {
                    aggregated[category][key] = {
                        description: parsed.description, // Keep original description
                        normalizedDesc,
                        baseAmount: 0,
                        category,
                        examples: []
                    };
                }

                aggregated[category][key].baseAmount += baseAmount;
                aggregated[category][key].examples.push({
                    recipe: recipe.name,
                    original: ingredientText,
                    count: multiplier
                });
            });
        });
    });

    return aggregated;
};

/**
 * Format aggregated ingredients for display
 */
const formatShoppingList = (aggregated) => {
    const sections = [];

    // Weight-based ingredients
    if (Object.keys(aggregated.weight).length > 0) {
        sections.push({
            title: 'Weight-Based Ingredients',
            items: Object.values(aggregated.weight)
                .map(item => ({
                    display: `${formatFromBaseUnit(item.baseAmount, 'weight')} ${item.description}`,
                    ...item
                }))
                .sort((a, b) => a.normalizedDesc.localeCompare(b.normalizedDesc))
        });
    }

    // Volume-based ingredients
    if (Object.keys(aggregated.volume).length > 0) {
        sections.push({
            title: 'Volume-Based Ingredients',
            items: Object.values(aggregated.volume)
                .map(item => ({
                    display: `${formatFromBaseUnit(item.baseAmount, 'volume')} ${item.description}`,
                    ...item
                }))
                .sort((a, b) => a.normalizedDesc.localeCompare(b.normalizedDesc))
        });
    }

    // Count-based ingredients
    if (Object.keys(aggregated.count).length > 0) {
        sections.push({
            title: 'Whole/Count Items',
            items: Object.values(aggregated.count)
                .map(item => ({
                    display: `${item.baseAmount.toFixed(1)} ${item.description}`,
                    ...item
                }))
                .sort((a, b) => a.normalizedDesc.localeCompare(b.normalizedDesc))
        });
    }

    // Descriptive ingredients
    if (aggregated.descriptive.length > 0) {
        sections.push({
            title: 'As Needed',
            items: aggregated.descriptive
                .sort()
                .map(desc => ({
                    display: desc,
                    description: desc,
                    category: 'descriptive'
                }))
        });
    }

    return sections;
};

// Export to global scope
window.aggregateIngredients = aggregateIngredients;
window.formatShoppingList = formatShoppingList;
window.parseIngredient = parseIngredient;
