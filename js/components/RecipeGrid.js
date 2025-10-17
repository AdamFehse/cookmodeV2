const RecipeGrid = ({ recipes, recipeStatus, recipeChefNames, orderCounts, setSelectedRecipe }) => {
    const { useState, useMemo } = React;
    const STATUS_STYLES = window.STATUS_STYLES;
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
            className: 'text-center text-gray-500 py-12'
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
                    // Extract just the ingredient name without measurements
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
        // Category filter
        if (selectedCategory !== 'all' && recipe.category !== selectedCategory) {
            return false;
        }

        // Dish filter
        if (selectedDish !== 'all' && recipe.name !== selectedDish) {
            return false;
        }

        // Component filter
        if (selectedComponent !== 'all') {
            const recipeComponents = Object.keys(recipe.components || {});
            if (!recipeComponents.includes(selectedComponent)) {
                return false;
            }
        }

        // Ingredient filter
        if (selectedIngredient !== 'all') {
            const recipeIngredients = Object.values(recipe.components || {})
                .flat()
                .join(' ')
                .toLowerCase();
            if (!recipeIngredients.includes(selectedIngredient.toLowerCase())) {
                return false;
            }
        }

        // Search text filter
        if (filterText) {
            const searchText = filterText.toLowerCase();
            const name = (recipe.name || '').toLowerCase();
            const category = (recipe.category || '').toLowerCase();
            const recipeIngredients = Object.values(recipe.components || {})
                .flat()
                .join(' ')
                .toLowerCase();
            const componentNames = Object.keys(recipe.components || {})
                .join(' ')
                .toLowerCase();

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
        // Filter and Sort Controls
        React.createElement('div', {
            key: 'controls',
            className: 'mb-6 flex flex-wrap gap-2 items-center'
        }, [
            // Category Dropdown
            React.createElement('select', {
                key: 'category',
                value: selectedCategory,
                onChange: (e) => setSelectedCategory(e.target.value),
                className: 'px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white cursor-pointer text-sm'
            }, [
                React.createElement('option', { key: 'all', value: 'all' }, 'All Categories'),
                ...categories.map(cat =>
                    React.createElement('option', { key: cat, value: cat }, cat)
                )
            ]),

            // Dish Dropdown
            React.createElement('select', {
                key: 'dish',
                value: selectedDish,
                onChange: (e) => setSelectedDish(e.target.value),
                className: 'px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white cursor-pointer text-sm'
            }, [
                React.createElement('option', { key: 'all', value: 'all' }, 'All Dishes'),
                ...dishes.map(dish =>
                    React.createElement('option', { key: dish, value: dish }, dish)
                )
            ]),

            // Component Dropdown
            React.createElement('select', {
                key: 'component',
                value: selectedComponent,
                onChange: (e) => setSelectedComponent(e.target.value),
                className: 'px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white cursor-pointer text-sm'
            }, [
                React.createElement('option', { key: 'all', value: 'all' }, 'All Components'),
                ...components.map(comp =>
                    React.createElement('option', { key: comp, value: comp }, comp)
                )
            ]),

            // Ingredient Dropdown
            React.createElement('select', {
                key: 'ingredient',
                value: selectedIngredient,
                onChange: (e) => setSelectedIngredient(e.target.value),
                className: 'px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white cursor-pointer text-sm'
            }, [
                React.createElement('option', { key: 'all', value: 'all' }, 'All Ingredients'),
                ...ingredients.map(ing =>
                    React.createElement('option', { key: ing, value: ing }, ing)
                )
            ]),

            // Search Input
            React.createElement('input', {
                key: 'search',
                type: 'text',
                placeholder: 'Search...',
                value: filterText,
                onChange: (e) => setFilterText(e.target.value),
                className: 'flex-1 min-w-[150px] px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-sm'
            }),

            // Clear Filters Button
            React.createElement('button', {
                key: 'clear',
                onClick: () => {
                    setFilterText('');
                    setSelectedCategory('all');
                    setSelectedDish('all');
                    setSelectedIngredient('all');
                    setSelectedComponent('all');
                },
                className: 'px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors text-sm font-medium'
            }, 'Clear')
        ]),

        // Recipe Grid
        React.createElement('div', {
            key: 'grid',
            className: 'grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5'
        }, sortedRecipes.length > 0 ? sortedRecipes.map(([slug, recipe]) => {
            const status = recipeStatus[slug];
            const chefName = recipeChefNames[slug];
            const orderCount = orderCounts[slug] || 1;
            const displayName = recipe.name || slugToDisplayName(slug);

            return React.createElement('div', {
                key: slug,
                className: `rounded-xl overflow-hidden shadow-md cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg relative border-2 ${
                    status ? STATUS_STYLES[status] : 'bg-white border-gray-200'
                }`
            }, [
                // Status badge (top right)
                status && React.createElement('div', {
                    key: 'status-badge',
                    className: `absolute top-2 right-2 ${STATUS_BADGE_COLORS[status]} text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg`
                }, status.toUpperCase()),

                // Chef name badge (top left)
                chefName && React.createElement('div', {
                    key: 'chef-badge',
                    className: 'absolute top-2 left-2 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg'
                }, `👨‍🍳 ${chefName}`),

                // Order count badge (bottom left, on image)
                orderCount > 1 && React.createElement('div', {
                    key: 'order-badge',
                    className: 'absolute top-[140px] left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 shadow-lg'
                }, `×${orderCount}`),

                // Recipe content
                React.createElement('div', {
                    key: 'content',
                    onClick: () => setSelectedRecipe(slug)
                }, [
                    // Recipe image
                    recipe.images?.[0] && React.createElement('img', {
                        key: 'image',
                        src: recipe.images[0],
                        alt: displayName,
                        className: 'w-full h-44 object-cover'
                    }),

                    // Recipe details
                    React.createElement('div', {
                        key: 'details',
                        className: 'p-4'
                    }, [
                        React.createElement('div', {
                            key: 'name',
                            className: 'font-bold text-lg mb-2'
                        }, displayName)
                    ])
                ])
            ].filter(Boolean));
        }) : React.createElement('div', {
            className: 'col-span-full text-center text-gray-500 py-12'
        }, 'No recipes match your search.'))
    ]);
};

// Export to global scope
window.RecipeGrid = RecipeGrid;