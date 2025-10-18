const RecipeGrid = ({ recipes, recipeStatus, recipeChefNames, orderCounts, setSelectedRecipe }) => {
    const { useState, useMemo } = React;
    const STATUS_BADGE_COLORS = window.STATUS_BADGE_COLORS;
    const slugToDisplayName = window.slugToDisplayName;

    // State for filters
    const [filterText, setFilterText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDish, setSelectedDish] = useState('all');
    const [selectedIngredient, setSelectedIngredient] = useState('all');
    const [selectedComponent, setSelectedComponent] = useState('all');

    if (Object.keys(recipes).length === 0) {
        return React.createElement('div', {
            className: 'empty-state'
        }, 'No recipes loaded. Edit recipes.js to add recipes.');
    }

    // Define category order
    const categoryOrder = ['Entree', 'Side', 'Soup', 'Dessert'];

    // Extract unique values for dropdowns
    const { categories, dishes, ingredients, components } = useMemo(() => {
        const categoriesSet = new Set();
        const dishesSet = new Set();
        const ingredientsSet = new Set();
        const componentsSet = new Set();

        Object.values(recipes).forEach(recipe => {
            if (recipe.category) categoriesSet.add(recipe.category);
            if (recipe.name) dishesSet.add(recipe.name);

            if (recipe.components) {
                Object.keys(recipe.components).forEach(comp => componentsSet.add(comp));
                Object.values(recipe.components).flat().forEach(ingredient => {
                    const cleanIngredient = ingredient.replace(/^[\d.\/\s]+/, '').trim();
                    if (cleanIngredient) ingredientsSet.add(cleanIngredient);
                });
            }
        });

        return {
            categories: Array.from(categoriesSet).sort((a, b) => {
                const indexA = categoryOrder.indexOf(a);
                const indexB = categoryOrder.indexOf(b);
                return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
            }),
            dishes: Array.from(dishesSet).sort(),
            ingredients: Array.from(ingredientsSet).sort(),
            components: Array.from(componentsSet).sort()
        };
    }, [recipes]);

    // Filter recipes based on all filters
    const filteredRecipes = Object.entries(recipes).filter(([, recipe]) => {
        if (selectedCategory !== 'all' && recipe.category !== selectedCategory) return false;
        if (selectedDish !== 'all' && recipe.name !== selectedDish) return false;

        if (selectedComponent !== 'all') {
            const recipeComponents = Object.keys(recipe.components || {});
            if (!recipeComponents.includes(selectedComponent)) return false;
        }

        if (selectedIngredient !== 'all') {
            const recipeIngredients = Object.values(recipe.components || {}).flat().join(' ').toLowerCase();
            if (!recipeIngredients.includes(selectedIngredient.toLowerCase())) return false;
        }

        if (filterText) {
            const searchText = filterText.toLowerCase();
            const name = (recipe.name || '').toLowerCase();
            const category = (recipe.category || '').toLowerCase();
            const recipeIngredients = Object.values(recipe.components || {}).flat().join(' ').toLowerCase();
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

    return React.createElement('div', null, [
        // Filter Bar - using Pico grid
        React.createElement('section', { key: 'filters' }, [
            React.createElement('h2', { key: 'filter-title' }, 'Filter Recipes'),
            React.createElement('div', { key: 'filter-grid', className: 'grid', style: { gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--pico-spacing)' } }, [
            React.createElement('select', {
                key: 'category',
                value: selectedCategory,
                onChange: (e) => setSelectedCategory(e.target.value)
            }, [
                React.createElement('option', { key: 'all', value: 'all' }, 'All Categories'),
                ...categories.map(cat => React.createElement('option', { key: cat, value: cat }, cat))
            ]),

            React.createElement('select', {
                key: 'dish',
                value: selectedDish,
                onChange: (e) => setSelectedDish(e.target.value)
            }, [
                React.createElement('option', { key: 'all', value: 'all' }, 'All Dishes'),
                ...dishes.map(dish => React.createElement('option', { key: dish, value: dish }, dish))
            ]),

            React.createElement('select', {
                key: 'component',
                value: selectedComponent,
                onChange: (e) => setSelectedComponent(e.target.value)
            }, [
                React.createElement('option', { key: 'all', value: 'all' }, 'All Components'),
                ...components.map(comp => React.createElement('option', { key: comp, value: comp }, comp))
            ]),

            React.createElement('select', {
                key: 'ingredient',
                value: selectedIngredient,
                onChange: (e) => setSelectedIngredient(e.target.value)
            }, [
                React.createElement('option', { key: 'all', value: 'all' }, 'All Ingredients'),
                ...ingredients.map(ing => React.createElement('option', { key: ing, value: ing }, ing))
            ]),

            React.createElement('input', {
                key: 'search',
                type: 'text',
                placeholder: 'Search',
                value: filterText,
                onChange: (e) => setFilterText(e.target.value)
            }),

            React.createElement('button', {
                key: 'clear',
                type: 'button',
                className: 'secondary',
                onClick: () => {
                    setFilterText('');
                    setSelectedCategory('all');
                    setSelectedDish('all');
                    setSelectedIngredient('all');
                    setSelectedComponent('all');
                }
            }, 'Clear Filters')
        ])
        ]),

        // Recipe Grid - using semantic section
        React.createElement('section', { key: 'recipes-section' }, [
            React.createElement('h2', { key: 'recipes-title' }, 'Recipes'),
            React.createElement('div', {
                key: 'grid',
                className: 'recipe-grid'
            }, sortedRecipes.length > 0 ? sortedRecipes.map(([slug, recipe]) => {
            const status = recipeStatus[slug];
            const chefData = recipeChefNames[slug];
            const chefName = chefData?.name || '';
            const chefColor = chefData?.color || '#362500ff';
            const orderCount = orderCounts[slug] || 1;
            const displayName = recipe.name || slugToDisplayName(slug);

            return React.createElement('article', {
                key: slug,
                className: 'recipe-card',
                onClick: () => setSelectedRecipe(slug)
            }, [
                status && React.createElement('span', {
                    key: 'status',
                    className: `status-badge ${STATUS_BADGE_COLORS[status]}`
                }, status.toUpperCase()),

                chefName && React.createElement('span', {
                    key: 'chef',
                    className: 'chef-badge',
                    style: { backgroundColor: chefColor }
                }, `${chefName}`),

                orderCount > 1 && React.createElement('span', {
                    key: 'order',
                    className: 'order-badge'
                }, `×${orderCount}`),

                recipe.images?.[0] && React.createElement('img', {
                    key: 'image',
                    src: recipe.images[0],
                    alt: displayName,
                    className: 'recipe-image'
                }),

                React.createElement('h3', { key: 'name' }, displayName),
                recipe.category && React.createElement('small', { key: 'category' }, recipe.category)
            ]);
        }) : [
            React.createElement('p', { key: 'no-results' }, 'No recipes match your filters.')
        ])
        ])
    ]);
};

window.RecipeGrid = RecipeGrid;
