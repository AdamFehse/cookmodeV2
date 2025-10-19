const RecipeGridWithFilters = ({ recipes, recipeStatus, recipeChefNames, orderCounts, setSelectedRecipe }) => {
    const { useState, useMemo } = React;
    const getIngredientName = window.getIngredientName || ((ing) => typeof ing === 'string' ? ing : ing.ingredient);

    // State for filters
    const [filterText, setFilterText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDish, setSelectedDish] = useState('all');
    const [selectedIngredient, setSelectedIngredient] = useState('all');
    const [selectedComponent, setSelectedComponent] = useState('all');

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

    // Return RecipeGrid with all filter props
    return React.createElement(window.RecipeGrid, {
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
    });
};

window.RecipeGridWithFilters = RecipeGridWithFilters;
