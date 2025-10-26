/**
 * Status Calculation Utilities
 *
 * Calculate dish and kitchen progress for visual indicators
 */

/**
 * Calculate the status of a single dish
 * @param {string} slug - Recipe slug
 * @param {object} recipe - Recipe object
 * @param {object} completedIngredients - Completed ingredients map
 * @param {object} completedSteps - Completed steps map
 * @param {number} orderCount - Order count for this recipe
 * @returns {object} { status, percentage, label, color }
 */
const calculateDishStatus = (slug, recipe, completedIngredients, completedSteps, orderCount = 1) => {
    const generateStepKey = window.generateStepKey || (() => '');

    if (!recipe) {
        return {
            status: 'not-started',
            percentage: 0,
            label: 'Not Started',
            color: '#ef4444' // red
        };
    }

    // Count total items (steps only, not ingredients)
    let totalItems = 0;
    let completedItems = 0;

    // Count steps
    const instructions = recipe.instructions || [];
    instructions.forEach((_, idx) => {
        totalItems++;
        const stepKey = generateStepKey(slug, idx);
        if (completedSteps?.[stepKey]) {
            completedItems++;
        }
    });

    // Calculate percentage
    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    // Determine status
    let status = 'not-started';
    let label = 'Not Started';
    let color = '#ef4444'; // red

    if (percentage > 0 && percentage < 100) {
        status = 'in-progress';
        label = 'In Progress';
        color = '#eab308'; // yellow
    } else if (percentage === 100) {
        status = 'complete';
        label = 'Complete';
        color = '#10b981'; // green
    }

    return {
        status,
        percentage,
        label,
        color,
        completedItems,
        totalItems
    };
};

/**
 * Calculate progress for a single chef
 * @param {array} recipes - Array of chef's recipe assignments
 * @param {object} completedIngredients - Completed ingredients map
 * @param {object} completedSteps - Completed steps map
 * @returns {object} { percentage, completedItems, totalItems }
 */
const calculateChefProgress = (recipes, completedIngredients, completedSteps) => {
    let totalItems = 0;
    let completedItems = 0;

    recipes.forEach(({ slug, recipe, orderCount }) => {
        const dishStatus = calculateDishStatus(slug, recipe, completedIngredients, completedSteps, orderCount);
        totalItems += dishStatus.totalItems;
        completedItems += dishStatus.completedItems;
    });

    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return {
        percentage,
        completedItems,
        totalItems
    };
};

/**
 * Calculate kitchen-wide progress
 * @param {array} chefSummaries - Array of chef summaries from useChefData
 * @param {object} chefAssignments - Chef assignments map
 * @param {object} completedIngredients - Completed ingredients map
 * @param {object} completedSteps - Completed steps map
 * @returns {object} { percentage, completedItems, totalItems }
 */
const calculateKitchenProgress = (chefAssignments, completedIngredients, completedSteps) => {
    let totalItems = 0;
    let completedItems = 0;

    Object.values(chefAssignments).forEach(assignment => {
        const chefProgress = calculateChefProgress(
            assignment.recipes,
            completedIngredients,
            completedSteps
        );
        totalItems += chefProgress.totalItems;
        completedItems += chefProgress.completedItems;
    });

    const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    return {
        percentage,
        completedItems,
        totalItems
    };
};

// Export to window
window.calculateDishStatus = calculateDishStatus;
window.calculateChefProgress = calculateChefProgress;
window.calculateKitchenProgress = calculateKitchenProgress;
