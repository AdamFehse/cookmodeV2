import { RecipeCard } from './RecipeCard.js';
import { getIngredientName as defaultGetIngredientName, slugToDisplayName } from '../utils/scaling.js';

/**
 * RecipeGridV2 - Recipe grid using unified RecipeCard component
 * Uses single source of truth card design
 */
const fallbackGetIngredientName = defaultGetIngredientName;

export const RecipeGridV2 = ({
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
    const getIngredientName = fallbackGetIngredientName;
    const searchIndex = React.useMemo(() => {
        const index = {};
        Object.entries(recipes || {}).forEach(([slug, recipe = {}]) => {
            const componentNames = Object.keys(recipe.components || {}).map((component) => (component || '').toLowerCase());
            const ingredientNames = Object.values(recipe.components || {})
                .flat()
                .map((ingredient) => {
                    const name = getIngredientName(ingredient);
                    return (name || '').toLowerCase();
                })
                .filter(Boolean);

            index[slug] = {
                name: (recipe.name || '').toLowerCase(),
                category: (recipe.category || '').toLowerCase(),
                components: new Set(componentNames),
                componentText: componentNames.join(' '),
                ingredients: new Set(ingredientNames),
                ingredientText: ingredientNames.join(' ')
            };
        });
        return index;
    }, [recipes]);
    const filterTextLower = filterText ? filterText.trim().toLowerCase() : '';
    const selectedIngredientLower = selectedIngredient !== 'all' ? selectedIngredient.toLowerCase() : '';
    const selectedComponentLower = selectedComponent !== 'all' ? selectedComponent.toLowerCase() : '';

    if (Object.keys(recipes).length === 0) {
        return React.createElement('div', {
            className: 'empty-state'
        }, 'No recipes loaded. Edit recipes.js to add recipes.');
    }

    const categoryOrder = ['Entree', 'Side', 'Soup', 'Dessert'];

    const filteredRecipes = Object.entries(recipes).filter(([slug, recipe]) => {
        const searchData = searchIndex[slug] || {
            name: '',
            category: '',
            components: new Set(),
            componentText: '',
            ingredients: new Set(),
            ingredientText: ''
        };

        if (selectedCategory !== 'all' && recipe.category !== selectedCategory) return false;
        if (selectedDish !== 'all' && recipe.name !== selectedDish) return false;

        if (selectedComponentLower) {
            if (!searchData.components.has(selectedComponentLower)) return false;
        }

        if (selectedIngredientLower) {
            if (!searchData.ingredients.has(selectedIngredientLower)) return false;
        }

        if (filterTextLower) {
            return searchData.name.includes(filterTextLower) ||
                searchData.category.includes(filterTextLower) ||
                searchData.ingredientText.includes(filterTextLower) ||
                searchData.componentText.includes(filterTextLower);
        }

        return true;
    });

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

            return React.createElement(RecipeCard, {
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
                showImage: true,
                slugToDisplayName
            });
        }) : [
            React.createElement('p', {
                key: 'no-results'
            }, 'No recipes match your filters.')
        ])
    ]);
};
