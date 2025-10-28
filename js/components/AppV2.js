/**
 * AppV2 - Refactored root component with 50/50 split layout
 * Left: Recipe Grid + Filters
 * Right: Chef Stations + Kitchen Progress
 */
const AppV2 = () => {
    const { useState, useEffect, useMemo } = React;

    const recipes = window.RECIPES || {};
    const getIngredientName = window.getIngredientName || ((ing) => typeof ing === 'string' ? ing : ing.ingredient);

    // Supabase setup
    const { supabase, isSupabaseConnected, setIsSupabaseConnected } = window.useSupabase();

    // UI state
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [lightboxImage, setLightboxImage] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Filter state
    const [filterText, setFilterText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDish, setSelectedDish] = useState('all');
    const [selectedIngredient, setSelectedIngredient] = useState('all');
    const [selectedComponent, setSelectedComponent] = useState('all');

    // Recipe data and operations
    const recipeData = window.useRecipeData(supabase, isSupabaseConnected, '');

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
                    const ingredientName = getIngredientName(ingredient);
                    if (ingredientName) ingredientsSet.add(ingredientName);
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

    const handleResetFilters = () => {
        setFilterText('');
        setSelectedCategory('all');
        setSelectedDish('all');
        setSelectedIngredient('all');
        setSelectedComponent('all');
    };

    // Initialize Supabase connection
    useEffect(() => {
        if (supabase) {
            setIsSupabaseConnected(true);
        }
    }, [supabase]);

    // Setup real-time subscriptions
    window.useRealtime(
        supabase,
        isSupabaseConnected,
        recipeData.setCompletedIngredients,
        recipeData.setCompletedSteps,
        recipeData.setRecipeStatus,
        recipeData.setOrderCounts,
        recipeData.setRecipeChefNames
    );

    // Lightbox functions
    const openLightbox = (images, index) => {
        setLightboxImage(images);
        setLightboxIndex(index);
    };

    const { chefAssignments, chefSummaries } = window.useChefData(
        recipes,
        recipeData.orderCounts,
        recipeData.recipeChefNames,
        recipeData.completedSteps
    );

    // Show loading state
    if (recipeData.isLoading) {
        return React.createElement('main', { className: 'container-fluid' }, [
            React.createElement(window.Header, {
                key: 'header',
                supabase,
                isSupabaseConnected
            }),
            React.createElement('section', { key: 'loading' }, [
                React.createElement('article', { key: 'article' }, [
                    React.createElement('p', { key: 'text' }, 'Loading kitchen data...')
                ])
            ])
        ]);
    }

    // Show error state
    if (recipeData.loadError) {
        return React.createElement('main', { className: 'container-fluid' }, [
            React.createElement(window.Header, {
                key: 'header',
                supabase,
                isSupabaseConnected
            }),
            React.createElement('section', { key: 'error' }, [
                React.createElement('article', { key: 'article' }, [
                    React.createElement('h2', { key: 'title' }, 'Error Loading Data'),
                    React.createElement('p', { key: 'message' }, recipeData.loadError),
                    React.createElement('button', {
                        key: 'retry',
                        onClick: () => window.location.reload()
                    }, 'Reload Page')
                ])
            ])
        ]);
    }

    return React.createElement('main', { className: 'app-v2' }, [
        // Header
        React.createElement(window.Header, {
            key: 'header',
            supabase,
            isSupabaseConnected
        }),

        // 50/50 Split Layout Container
        React.createElement('div', {
            key: 'split-layout',
            className: 'split-layout'
        }, [
            // LEFT SIDE: Recipe Grid + Filters
            React.createElement('div', {
                key: 'left-panel',
                className: 'split-panel split-panel--left'
            }, [
                // Filters
                React.createElement(window.RecipeFilters, {
                    key: 'filters',
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
                }),

                // Recipe Grid
                React.createElement('div', { key: 'grid-section', className: 'recipes-section' }, [
                    React.createElement(window.RecipeGridV2, {
                        key: 'grid',
                        recipes,
                        recipeStatus: recipeData.recipeStatus,
                        recipeChefNames: recipeData.recipeChefNames,
                        orderCounts: recipeData.orderCounts,
                        completedSteps: recipeData.completedSteps,
                        setSelectedRecipe,
                        filterText,
                        selectedCategory,
                        selectedDish,
                        selectedIngredient,
                        selectedComponent
                    })
                ])
            ]),

            // RIGHT SIDE: Chef Stations + Kitchen Progress
            React.createElement('div', {
                key: 'right-panel',
                className: 'split-panel split-panel--right'
            }, [
                React.createElement(window.ChefStationsV2, {
                    key: 'chef-stations',
                    chefSummaries,
                    chefAssignments,
                    recipes,
                    recipeData: { ...recipeData, setSelectedRecipe }
                })
            ])
        ]),

        // Recipe Modal
        React.createElement(window.RecipeModalV2, {
            key: 'modal',
            selectedRecipe,
            setSelectedRecipe,
            recipes,
            orderCounts: recipeData.orderCounts,
            updateOrderCount: recipeData.updateOrderCount,
            completedIngredients: recipeData.completedIngredients,
            toggleIngredient: recipeData.toggleIngredient,
            completedSteps: recipeData.completedSteps,
            toggleStep: recipeData.toggleStep,
            recipeStatus: recipeData.recipeStatus,
            updateRecipeStatus: recipeData.updateRecipeStatus,
            recipeChefNames: recipeData.recipeChefNames,
            updateChefName: recipeData.updateChefName,
            openLightbox
        }),

        // Lightbox
        React.createElement(window.Lightbox, {
            key: 'lightbox',
            lightboxImage,
            lightboxIndex,
            setLightboxImage,
            setLightboxIndex
        })
    ]);
};

window.AppV2 = AppV2;
