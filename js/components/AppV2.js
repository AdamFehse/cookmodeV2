import { useSupabase } from '../hooks/useSupabase.js';
import { useRealtime } from '../hooks/useRealtime.js';
import { useRecipeData } from '../hooks/useRecipeData.js';
import { useChefData } from './chef/useChefData.js';
import { RecipeFilters } from './RecipeFilters.js';
import { RecipeGridV2 } from './RecipeGridV2.js';
import { RecipeModal } from './RecipeModal.js';
import { ChefStationsV2 } from './chef/ChefStationsV2.js';
import { Header } from './Header.js';
import { getIngredientName as defaultGetIngredientName } from '../utils/scaling.js';

// Helper to extract filter options from recipes
const extractFilterOptions = (recipes, getIngredientName) => {
    const categoryOrder = ['Entree', 'Side', 'Soup', 'Dessert'];
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
};

export const AppV2 = ({ recipes = {} }) => {
    const { useState, useEffect, useMemo } = React;
    const getIngredientName = defaultGetIngredientName;

    const { supabase, isSupabaseConnected, setIsSupabaseConnected } = useSupabase();

    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [filterText, setFilterText] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDish, setSelectedDish] = useState('all');
    const [selectedIngredient, setSelectedIngredient] = useState('all');
    const [selectedComponent, setSelectedComponent] = useState('all');

    const recipeData = useRecipeData(supabase, isSupabaseConnected, recipes);

    const { categories, dishes, ingredients, components } = useMemo(() =>
        extractFilterOptions(recipes, getIngredientName),
        [recipes]
    );

    const handleResetFilters = () => {
        setFilterText('');
        setSelectedCategory('all');
        setSelectedDish('all');
        setSelectedIngredient('all');
        setSelectedComponent('all');
    };

    useEffect(() => {
        if (supabase) {
            setIsSupabaseConnected(true);
        }
    }, [supabase, setIsSupabaseConnected]);

    useRealtime(
        supabase,
        isSupabaseConnected,
        recipeData.setCompletedIngredients,
        recipeData.setCompletedSteps,
        recipeData.setRecipeStatus,
        recipeData.setOrderCounts,
        recipeData.setRecipeChefNames
    );

    const { chefAssignments, chefSummaries } = useChefData(
        recipes,
        recipeData.orderCounts,
        recipeData.recipeChefNames,
        recipeData.completedSteps
    );

    if (recipeData.isLoading) {
        return React.createElement('main', { className: 'container-fluid' }, [
            React.createElement(Header, {
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

    if (recipeData.loadError) {
        return React.createElement('main', { className: 'container-fluid' }, [
            React.createElement(Header, {
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
        React.createElement(Header, {
            key: 'header',
            supabase,
            isSupabaseConnected
        }),
        React.createElement('div', {
            key: 'split-layout',
            className: 'split-layout'
        }, [
            React.createElement('div', {
                key: 'left-panel',
                className: 'split-panel split-panel--left'
            }, [
                React.createElement(RecipeFilters, {
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
                React.createElement('div', { key: 'grid-section', className: 'recipes-section' }, [
                    React.createElement(RecipeGridV2, {
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
            React.createElement('div', {
                key: 'right-panel',
                className: 'split-panel split-panel--right'
            }, [
                React.createElement(ChefStationsV2, {
                    key: 'chef-stations',
                    chefSummaries,
                    chefAssignments,
                    recipes,
                    recipeData: { ...recipeData, setSelectedRecipe }
                })
            ])
        ]),
        React.createElement(RecipeModal, {
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
            updateChefName: recipeData.updateChefName
        })
    ]);
};
