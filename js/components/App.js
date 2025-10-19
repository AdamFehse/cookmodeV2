const App = () => {
    const { useState, useEffect } = React;

    const recipes = window.RECIPES || {};

    // Supabase setup
    const { supabase, isSupabaseConnected, setIsSupabaseConnected } = window.useSupabase();

    // Cook name state
    const [cookName, setCookName] = useState(() => {
        return localStorage.getItem('cookName') || '';
    });

    // UI state
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [lightboxImage, setLightboxImage] = useState(null);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    // Recipe data and operations
    const recipeData = window.useRecipeData(supabase, isSupabaseConnected, cookName);

    // Save cook name to localStorage when it changes
    useEffect(() => {
        if (cookName) {
            localStorage.setItem('cookName', cookName);
        }
    }, [cookName]);

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

    // Show loading state
    if (recipeData.isLoading) {
        return React.createElement('main', { className: 'container' }, [
            React.createElement(window.Header, {
                key: 'header',
                cookName,
                setCookName,
                supabase,
                isSupabaseConnected
            }),
            React.createElement('article', { key: 'loading' }, [
                React.createElement('p', { key: 'text' }, 'Loading kitchen data...')
            ])
        ]);
    }

    // Show error state
    if (recipeData.loadError) {
        return React.createElement('main', { className: 'container' }, [
            React.createElement(window.Header, {
                key: 'header',
                cookName,
                setCookName,
                supabase,
                isSupabaseConnected
            }),
            React.createElement('article', { key: 'error' }, [
                React.createElement('h2', { key: 'title' }, 'Error Loading Data'),
                React.createElement('p', { key: 'message' }, recipeData.loadError),
                React.createElement('button', {
                    key: 'retry',
                    onClick: () => window.location.reload()
                }, 'Reload Page')
            ])
        ]);
    }

    return React.createElement('main', { className: 'container-fluid' }, [
        // Header
        React.createElement(window.Header, {
            key: 'header',
            cookName,
            setCookName,
            supabase,
            isSupabaseConnected
        }),

        // Recipe Grid
        React.createElement(window.RecipeGrid, {
            key: 'grid',
            recipes,
            recipeStatus: recipeData.recipeStatus,
            recipeChefNames: recipeData.recipeChefNames,
            orderCounts: recipeData.orderCounts,
            setSelectedRecipe
        }),

        // Recipe Modal
        React.createElement(window.RecipeModal, {
            key: 'modal',
            selectedRecipe,
            setSelectedRecipe,
            recipes,
            cookName,
            setCookName,
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

window.App = App;
