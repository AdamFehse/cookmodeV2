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
    // Note: setIsSupabaseConnected is a stable setter, doesn't need to be in deps

    // Setup real-time subscriptions
    window.useRealtime(
        supabase,
        isSupabaseConnected,
        recipeData.setCompletedIngredients,
        recipeData.setIngredientMetadata,
        recipeData.setCompletedSteps,
        recipeData.setStepMetadata,
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
        return React.createElement('div', {
            className: 'max-w-[1600px] mx-auto p-5'
        }, [
            React.createElement(window.Header, {
                key: 'header',
                cookName,
                setCookName,
                supabase,
                isSupabaseConnected
            }),
            React.createElement('div', {
                key: 'loading',
                className: 'flex items-center justify-center min-h-[400px]'
            }, [
                React.createElement('div', {
                    key: 'spinner',
                    className: 'text-center'
                }, [
                    React.createElement('div', {
                        key: 'spinner-icon',
                        className: 'inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4'
                    }),
                    React.createElement('div', {
                        key: 'text',
                        className: 'text-gray-600'
                    }, 'Loading kitchen data...')
                ])
            ])
        ]);
    }

    // Show error state
    if (recipeData.loadError) {
        return React.createElement('div', {
            className: 'max-w-[1600px] mx-auto p-5'
        }, [
            React.createElement(window.Header, {
                key: 'header',
                cookName,
                setCookName,
                supabase,
                isSupabaseConnected
            }),
            React.createElement('div', {
                key: 'error',
                className: 'bg-red-50 border-2 border-red-200 rounded-lg p-6 max-w-2xl mx-auto mt-8'
            }, [
                React.createElement('div', {
                    key: 'title',
                    className: 'text-red-800 font-bold text-lg mb-2'
                }, '❌ Error Loading Data'),
                React.createElement('div', {
                    key: 'message',
                    className: 'text-red-700 mb-4'
                }, recipeData.loadError),
                React.createElement('button', {
                    key: 'retry',
                    className: 'bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700',
                    onClick: () => window.location.reload()
                }, 'Reload Page')
            ])
        ]);
    }

    return React.createElement('div', {
        className: 'max-w-[1600px] mx-auto p-5'
    }, [
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
            ingredientMetadata: recipeData.ingredientMetadata,
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

// Export to global scope
window.App = App;