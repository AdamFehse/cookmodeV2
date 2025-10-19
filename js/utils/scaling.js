// Utility functions for ingredient scaling and text manipulation

/**
 * Parse amount from number or fraction string
 * @param {number|string} amount - Number (2, 0.5) or fraction string ('1/2', '1/4')
 * @returns {number} Parsed numeric amount
 */
const parseAmount = (amount) => {
    if (typeof amount === 'number' && Number.isFinite(amount)) {
        return amount;
    }
    if (typeof amount === 'string') {
        const trimmed = amount.trim();
        if (!trimmed) return NaN;
        if (trimmed.includes('/')) {
            const [num, den] = trimmed.split('/').map(Number);
            if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) {
                return NaN;
            }
            return num / den;
        }
        const parsed = Number(trimmed);
        return Number.isFinite(parsed) ? parsed : NaN;
    }
    return NaN;
};

/**
 * Scale ingredient object and format for display
 * @param {object} ingredientObj - Ingredient object with amount, unit, ingredient, prep (optional)
 * @param {number} multiplier - Scale factor (orderCount)
 * @returns {string} Formatted ingredient string
 */
const scaleAmount = (ingredientObj, multiplier) => {
    if (!ingredientObj) return '';
    if (typeof ingredientObj === 'string') return ingredientObj;

    const { amount, unit = '', ingredient = '', prep } = ingredientObj;
    const parsedAmount = parseAmount(amount);
    let parts = [];

    if (Number.isFinite(parsedAmount) && Number.isFinite(multiplier)) {
        const scaledAmount = parsedAmount * multiplier;
        const displayAmount = Number.isInteger(scaledAmount)
            ? scaledAmount.toString()
            : scaledAmount.toFixed(2).replace(/\.?0+$/, '');
        parts.push(displayAmount);
    }

    if (unit) {
        parts.push(unit);
    }

    if (ingredient) {
        parts.push(ingredient);
    }

    let result = parts.join(' ').trim();

    if (!result && ingredient) {
        result = ingredient;
    }

    if (prep) {
        result = `${result}${result ? ', ' : ''}${prep}`;
    }

    return result;
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
