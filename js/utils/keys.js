// Utility functions for generating consistent state keys

/**
 * Generate key for ingredient state tracking
 * @param {string} recipeSlug - Recipe identifier
 * @param {string} componentName - Component name (e.g., 'Dough', 'Sauce')
 * @param {number} ingredientIndex - Index of ingredient in component
 * @returns {string} Formatted key
 */
const generateIngredientKey = (recipeSlug, componentName, ingredientIndex) => {
    return `${recipeSlug}-ing-${componentName}-${ingredientIndex}`;
};

/**
 * Generate key from ingredient database item
 * @param {object} item - Database item with recipe_slug, component_name, ingredient_index
 * @returns {string} Formatted key
 */
const generateIngredientKeyFromItem = (item) => {
    return generateIngredientKey(item.recipe_slug, item.component_name, item.ingredient_index);
};

/**
 * Generate key for step state tracking
 * @param {string} recipeSlug - Recipe identifier
 * @param {number} stepIndex - Index of step
 * @returns {string} Formatted key
 */
const generateStepKey = (recipeSlug, stepIndex) => {
    return `${recipeSlug}-step-${stepIndex}`;
};

/**
 * Generate key from step database item
 * @param {object} item - Database item with recipe_slug, step_index
 * @returns {string} Formatted key
 */
const generateStepKeyFromItem = (item) => {
    return generateStepKey(item.recipe_slug, item.step_index);
};

// Export to global scope for other files
window.generateIngredientKey = generateIngredientKey;
window.generateIngredientKeyFromItem = generateIngredientKeyFromItem;
window.generateStepKey = generateStepKey;
window.generateStepKeyFromItem = generateStepKeyFromItem;
