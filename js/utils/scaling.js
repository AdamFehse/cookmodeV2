// Utility functions for ingredient scaling and text manipulation

/**
 * Parse amount from number or fraction string
 * @param {number|string} amount - Number (2, 0.5) or fraction string ('1/2', '1/4')
 * @returns {number} Parsed numeric amount
 */
const parseAmount = (amount) => {
    if (typeof amount === 'number') return amount;
    if (typeof amount === 'string' && amount.includes('/')) {
        const [num, den] = amount.split('/').map(Number);
        return num / den;
    }
    return parseFloat(amount);
};

/**
 * Scale ingredient object and format for display
 * @param {object} ingredientObj - Ingredient object with amount, unit, ingredient, prep (optional)
 * @param {number} multiplier - Scale factor (orderCount)
 * @returns {string} Formatted ingredient string
 */
const scaleAmount = (ingredientObj, multiplier) => {
    const scaledAmount = parseAmount(ingredientObj.amount) * multiplier;
    const prep = ingredientObj.prep ? `, ${ingredientObj.prep}` : '';
    return `${scaledAmount.toFixed(2)} ${ingredientObj.unit} ${ingredientObj.ingredient}${prep}`;
};

/**
 * Extract ingredient name from ingredient object
 * @param {object} ingredientObj - Ingredient object
 * @returns {string} Clean ingredient name
 */
const getIngredientName = (ingredientObj) => {
    return ingredientObj.ingredient || '';
};

const slugToDisplayName = (slug) => {
    // Convert slug to display name
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Export to global scope for other files
window.parseAmount = parseAmount;
window.scaleAmount = scaleAmount;
window.getIngredientName = getIngredientName;
window.slugToDisplayName = slugToDisplayName;