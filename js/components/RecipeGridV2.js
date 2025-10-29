/**
 * RecipeGridV2 - Recipe grid using unified RecipeCard component
 * Uses single source of truth card design
 */
const RecipeGridV2 = ({
    recipes,
    recipeStatus,
    recipeChefNames,
    orderCounts,
    completedSteps = {},
    setSelectedRecipe,
    filterText,
    selectedCategory,
    selectedDish,
    selectedIngredient,
    selectedComponent,
}) => {
    const slugToDisplayName = window.slugToDisplayName;
    const getIngredientName = window.getIngredientName || ((ing) => typeof ing === 'string' ? ing : ing.ingredient);

    if (Object.keys(recipes).length === 0) {
        return React.createElement('div', {
            className: 'empty-state'
        }, 'No recipes loaded. Edit recipes.js to add recipes.');
    }

    // Define category order
    const categoryOrder = ['Entree', 'Side', 'Soup', 'Dessert'];

    // Filter recipes based on all filters
    const filteredRecipes = Object.entries(recipes).filter(([, recipe]) => {
        if (selectedCategory !== 'all' && recipe.category !== selectedCategory) return false;
        if (selectedDish !== 'all' && recipe.name !== selectedDish) return false;

        if (selectedComponent !== 'all') {
            const recipeComponents = Object.keys(recipe.components || {});
            if (!recipeComponents.includes(selectedComponent)) return false;
        }

        if (selectedIngredient !== 'all') {
            const recipeIngredients = Object.values(recipe.components || {})
                .flat()
                .map(ing => getIngredientName(ing))
                .join(' ')
                .toLowerCase();
            if (!recipeIngredients.includes(selectedIngredient.toLowerCase())) return false;
        }

        if (filterText) {
            const searchText = filterText.toLowerCase();
            const name = (recipe.name || '').toLowerCase();
            const category = (recipe.category || '').toLowerCase();
            const recipeIngredients = Object.values(recipe.components || {})
                .flat()
                .map(ing => getIngredientName(ing))
                .join(' ')
                .toLowerCase();
            const componentNames = Object.keys(recipe.components || {}).join(' ').toLowerCase();

            return name.includes(searchText) ||
                   category.includes(searchText) ||
                   recipeIngredients.includes(searchText) ||
                   componentNames.includes(searchText);
        }

        return true;
    });

    // Sort recipes by category order
    const sortedRecipes = [...filteredRecipes].sort(([, recipeA], [, recipeB]) => {
        const categoryA = recipeA.category || '';
        const categoryB = recipeB.category || '';
        const indexA = categoryOrder.indexOf(categoryA);
        const indexB = categoryOrder.indexOf(categoryB);
        const orderA = indexA === -1 ? categoryOrder.length : indexA;
        const orderB = indexB === -1 ? categoryOrder.length : indexB;
        return orderA - orderB;
    });

    return React.createElement('div', { className: 'recipe-grid-wrapper' }, [
        React.createElement('div', {
            key: 'grid',
            className: 'recipe-grid'
        }, sortedRecipes.length > 0 ? sortedRecipes.map(([slug, recipe]) => {
            const status = recipeStatus[slug];
            const chefData = recipeChefNames[slug];
            const orderCount = orderCounts[slug] || 1;

            // Calculate recipe progress based on steps
            let totalSteps = 0;
            let completedStepsCount = 0;
            if (recipe.instructions) {
                totalSteps = recipe.instructions.length;
                recipe.instructions.forEach((_, index) => {
                    const stepKey = `${slug}-step-${index}`;
                    if (completedSteps[stepKey]) {
                        completedStepsCount++;
                    }
                });
            }
            const progress = totalSteps > 0 ? Math.round((completedStepsCount / totalSteps) * 100) : 0;

            return React.createElement(window.RecipeCard, {
                key: slug,
                slug,
                recipe,
                size: 'grid',
                status,
                chefName: chefData?.name,
                chefColor: chefData?.color,
                orderCount,
                progress,
                onClick: () => setSelectedRecipe(slug),
                clickable: true,
                showBadges: true,
                showImage: true
            });
        }) : [
            React.createElement('p', {
                key: 'no-results'
            }, 'No recipes match your filters.')
        ])
    ]);
};

window.RecipeGridV2 = RecipeGridV2;
