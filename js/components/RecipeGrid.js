const RecipeGrid = ({
    recipes,
    recipeStatus,
    recipeChefNames,
    orderCounts,
    setSelectedRecipe,
    filterText,
    setFilterText,
    selectedCategory,
    setSelectedCategory,
    selectedDish,
    setSelectedDish,
    selectedIngredient,
    setSelectedIngredient,
    selectedComponent,
    setSelectedComponent,
    categories,
    dishes,
    ingredients,
    components,
    handleResetFilters
}) => {
    const { useMemo } = React;
    const DEFAULT_CHEF_COLOR = window.DEFAULT_CHEF_COLOR || '#a855f7';
    const resolveChefColor = window.resolveChefColor || ((color) => color);
    const slugToDisplayName = window.slugToDisplayName;
    const getIngredientName = window.getIngredientName || ((ing) => typeof ing === 'string' ? ing : ing.ingredient);

    // Helper functions for badge styling with vibrant colors
    const getStatusBadgeStyle = (status) => {
        const colors = {
            gathered: { bg: '#3b82f6', text: '#ffffff' },  // Blue
            complete: { bg: '#10b981', text: '#ffffff' },  // Green
            plated: { bg: '#f59e0b', text: '#000000' },    // Orange
            packed: { bg: '#8b5cf6', text: '#ffffff' }     // Purple
        };

        const color = colors[status] || { bg: '#6b7280', text: '#ffffff' };

        return {
            backgroundColor: color.bg,
            color: color.text,
            border: 'none'
        };
    };

    const getChefBadgeStyle = (color) => ({
        backgroundColor: resolveChefColor(color),
        color: '#ffffff',
        border: 'none'
    });

    const getOrderBadgeStyle = () => ({
        '--pico-code-background-color': 'var(--pico-primary-background)',
        '--pico-code-color': 'var(--pico-primary-inverse)'
    });

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

    return React.createElement('div', { className: 'recipe-grid-wrapper container-fluid' }, [
        // Recipe Grid - using semantic section
        React.createElement('section', { key: 'recipes-section', className: 'recipes-section container' }, [
            React.createElement('div', {
                key: 'grid',
                className: 'grid',
                style: {
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    '--pico-grid-gap': 'calc(var(--pico-spacing) * 1.25)',
                    marginBlock: 'var(--pico-spacing)'
                }
            }, sortedRecipes.length > 0 ? sortedRecipes.map(([slug, recipe]) => {
            const status = recipeStatus[slug];
            const chefData = recipeChefNames[slug];
            const chefName = chefData?.name || '';
            const chefColor = chefData?.color || '';
            const orderCount = orderCounts[slug] || 1;
            const displayName = recipe.name || slugToDisplayName(slug);

            return React.createElement('article', {
                key: slug,
                onClick: () => setSelectedRecipe(slug),
                tabIndex: 0
            }, [
                recipe.images?.[0] && React.createElement('img', {
                    key: 'image',
                    src: recipe.images[0],
                    alt: displayName,
                    loading: 'lazy'
                }),
                React.createElement('div', { key: 'body' }, [
                    React.createElement('hgroup', { key: 'title' }, [
                        React.createElement('h4', { key: 'name' }, displayName),
                        recipe.category && React.createElement('p', { key: 'category' }, recipe.category)
                    ]),
                    (status || chefName || orderCount > 1) && React.createElement('p', {
                        key: 'badges',
                        style: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }
                    }, [
                        status && React.createElement('mark', {
                            key: 'status',
                            style: getStatusBadgeStyle(status)
                        }, status.toUpperCase()),
                        chefName && React.createElement('kbd', {
                            key: 'chef',
                            style: getChefBadgeStyle(chefColor)
                        }, chefName),
                        orderCount > 1 && React.createElement('kbd', {
                            key: 'order',
                            style: getOrderBadgeStyle()
                        }, `×${orderCount}`)
                    ].filter(Boolean))
                ])
            ]);
        }) : [
            React.createElement('p', { key: 'no-results' }, 'No recipes match your filters.')
        ])
        ])
    ]);
};

window.RecipeGrid = RecipeGrid;
