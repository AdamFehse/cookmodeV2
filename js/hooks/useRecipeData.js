// Custom hook for managing recipe-related data and operations
const useRecipeData = (supabase, isSupabaseConnected, cookName) => {
    const [orderCounts, setOrderCounts] = React.useState(() => {
        const recipes = window.RECIPES || {};
        return Object.keys(recipes).reduce((acc, slug) => {
            acc[slug] = 1;
            return acc;
        }, {});
    });
    const [completedIngredients, setCompletedIngredients] = React.useState({});
    const [completedSteps, setCompletedSteps] = React.useState({});
    const [ingredientMetadata, setIngredientMetadata] = React.useState({});
    const [stepMetadata, setStepMetadata] = React.useState({});
    const [recipeStatus, setRecipeStatus] = React.useState({});
    const [recipeChefNames, setRecipeChefNames] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);
    const [loadError, setLoadError] = React.useState(null);

    // Load initial data from Supabase
    React.useEffect(() => {
        if (!supabase) {
            setIsLoading(false);
            return;
        }

        async function loadInitialData() {
            try {
                setIsLoading(true);
                setLoadError(null);

                // Load ingredient checks
                const { data: ingredientData, error: ingredientError } = await supabase
                    .from('ingredient_checks')
                    .select('*');

                if (ingredientError) throw ingredientError;

                if (ingredientData) {
                    const ingredientMap = {};
                    const metadataMap = {};
                    ingredientData.forEach(item => {
                        const key = `${item.recipe_slug}-ing-${item.component_name}-${item.ingredient_index}`;
                        ingredientMap[key] = item.is_checked;
                        metadataMap[key] = {
                            checked_by: item.checked_by,
                            checked_at: item.checked_at
                        };
                    });
                    setCompletedIngredients(ingredientMap);
                    setIngredientMetadata(metadataMap);
                }

                // Load step completions
                const { data: stepData, error: stepError } = await supabase
                    .from('step_completions')
                    .select('*');

                if (stepError) throw stepError;

                if (stepData) {
                    const stepMap = {};
                    const stepMetaMap = {};
                    stepData.forEach(item => {
                        const key = `${item.recipe_slug}-step-${item.step_index}`;
                        stepMap[key] = item.is_completed;
                        stepMetaMap[key] = {
                            completed_by: item.completed_by,
                            completed_at: item.completed_at
                        };
                    });
                    setCompletedSteps(stepMap);
                    setStepMetadata(stepMetaMap);
                }

                // Load recipe status
                const { data: statusData, error: statusError } = await supabase
                    .from('recipe_status')
                    .select('*');

                if (statusError) throw statusError;

                if (statusData) {
                    const statusMap = {};
                    statusData.forEach(item => {
                        statusMap[item.recipe_slug] = item.status;
                    });
                    setRecipeStatus(statusMap);
                }

                // Load order counts
                const { data: orderData, error: orderError } = await supabase
                    .from('order_counts')
                    .select('*');

                if (orderError) throw orderError;

                if (orderData) {
                    const orderMap = {};
                    orderData.forEach(item => {
                        orderMap[item.recipe_slug] = item.count;
                    });
                    setOrderCounts(prev => ({ ...prev, ...orderMap }));
                }

                // Load chef names
                const { data: chefData, error: chefError } = await supabase
                    .from('recipe_chef_names')
                    .select('*');

                if (chefError && chefError.code !== 'PGRST116') {
                    console.warn('⚠️ Error loading chef names (table may not exist yet):', chefError);
                } else if (chefData) {
                    const chefMap = {};
                    chefData.forEach(item => {
                        chefMap[item.recipe_slug] = {
                            name: item.chef_name,
                            color: item.chef_color || '#9333ea'
                        };
                    });
                    setRecipeChefNames(chefMap);
                }

                setIsLoading(false);
                console.log('✅ Supabase connected! Real-time sync active.');
            } catch (error) {
                console.error('❌ Error loading data from Supabase:', error);
                setLoadError(error.message);
                setIsLoading(false);
            }
        }

        loadInitialData();
    }, [supabase]);

    const updateOrderCount = async (slug, count) => {
        console.log('🔢 Updating order count:', slug, count);

        // Optimistically update UI
        setOrderCounts(prev => ({ ...prev, [slug]: count }));

        // Sync to Supabase
        if (supabase && isSupabaseConnected) {
            try {
                const { data, error } = await supabase
                    .from('order_counts')
                    .upsert({
                        recipe_slug: slug,
                        count: count,
                        updated_by: cookName || 'Unknown',
                        updated_at: new Date().toISOString()
                    }, {
                        onConflict: 'recipe_slug'
                    });

                if (error) {
                    console.error('❌ Error updating order count:', error);
                } else {
                    console.log('✅ Order count saved:', data);
                }
            } catch (error) {
                console.error('❌ Exception updating order count:', error);
            }
        } else {
            console.warn('⚠️ Supabase not connected, order count only local');
        }
    };

    const toggleIngredient = async (recipeSlug, ingredientKey, componentName, ingredientIndex, ingredientText) => {
        const newCheckedState = !completedIngredients[ingredientKey];

        console.log('🖱️ Clicked ingredient:', {
            ingredientKey,
            newCheckedState,
            recipeSlug,
            componentName,
            ingredientIndex
        });

        // Optimistically update UI
        setCompletedIngredients(prev => ({ ...prev, [ingredientKey]: newCheckedState }));

        // Sync to Supabase
        if (supabase && isSupabaseConnected) {
            try {
                const { data, error } = await supabase
                    .from('ingredient_checks')
                    .upsert({
                        recipe_slug: recipeSlug,
                        ingredient_index: ingredientIndex,
                        component_name: componentName,
                        ingredient_text: ingredientText,
                        is_checked: newCheckedState,
                        checked_by: cookName || 'Unknown',
                        checked_at: new Date().toISOString()
                    }, {
                        onConflict: 'recipe_slug,ingredient_index,component_name'
                    });

                if (error) {
                    console.error('❌ Supabase error:', error);
                } else {
                    console.log('✅ Saved to Supabase:', data);
                }
            } catch (error) {
                console.error('❌ Error updating ingredient:', error);
            }
        } else {
            console.warn('⚠️ Supabase not connected, change only local');
        }
    };

    const toggleStep = async (recipeSlug, stepKey, stepIndex, stepText) => {
        const newCompletedState = !completedSteps[stepKey];

        console.log('🔄 Toggling step:', stepKey, newCompletedState);

        // Optimistically update UI
        setCompletedSteps(prev => ({ ...prev, [stepKey]: newCompletedState }));

        // Sync to Supabase
        if (supabase && isSupabaseConnected) {
            try {
                const { data, error } = await supabase
                    .from('step_completions')
                    .upsert({
                        recipe_slug: recipeSlug,
                        step_index: stepIndex,
                        step_text: stepText,
                        is_completed: newCompletedState,
                        completed_by: cookName || 'Unknown',
                        completed_at: new Date().toISOString()
                    }, {
                        onConflict: 'recipe_slug,step_index'
                    });

                if (error) {
                    console.error('❌ Error updating step:', error);
                } else {
                    console.log('✅ Step saved to Supabase:', data);
                }
            } catch (error) {
                console.error('❌ Exception updating step:', error);
            }
        } else {
            console.warn('⚠️ Supabase not connected, step change only local');
        }
    };

    const updateRecipeStatus = async (slug, status) => {
        console.log('🏷️ Updating recipe status:', slug, status);

        // Optimistically update UI
        setRecipeStatus(prev => ({ ...prev, [slug]: status }));

        // Sync to Supabase
        if (supabase && isSupabaseConnected) {
            try {
                if (status === null) {
                    // Delete status
                    const { error } = await supabase
                        .from('recipe_status')
                        .delete()
                        .eq('recipe_slug', slug);

                    if (error) {
                        console.error('❌ Error deleting recipe status:', error);
                    } else {
                        console.log('✅ Recipe status cleared');
                    }
                } else {
                    // Upsert status
                    const { data, error } = await supabase
                        .from('recipe_status')
                        .upsert({
                            recipe_slug: slug,
                            status: status,
                            updated_by: cookName || 'Unknown',
                            updated_at: new Date().toISOString()
                        }, {
                            onConflict: 'recipe_slug'
                        });

                    if (error) {
                        console.error('❌ Error updating recipe status:', error);
                    } else {
                        console.log('✅ Recipe status saved:', data);
                    }
                }
            } catch (error) {
                console.error('❌ Exception updating recipe status:', error);
            }
        } else {
            console.warn('⚠️ Supabase not connected, status change only local');
        }
    };

    const updateChefName = async (slug, chefName, chefColor = '#9333ea') => {
        console.log('👨‍🍳 Updating chef name:', slug, chefName, chefColor);

        // Optimistically update UI
        if (chefName) {
            setRecipeChefNames(prev => ({
                ...prev,
                [slug]: { name: chefName, color: chefColor }
            }));
        } else {
            setRecipeChefNames(prev => {
                const newState = { ...prev };
                delete newState[slug];
                return newState;
            });
        }

        // Sync to Supabase
        if (supabase && isSupabaseConnected) {
            try {
                if (!chefName) {
                    // Delete chef name
                    const { error } = await supabase
                        .from('recipe_chef_names')
                        .delete()
                        .eq('recipe_slug', slug);

                    if (error) {
                        console.error('❌ Error deleting chef name:', error);
                    } else {
                        console.log('✅ Chef name cleared');
                    }
                } else {
                    // Upsert chef name with color
                    const { data, error } = await supabase
                        .from('recipe_chef_names')
                        .upsert({
                            recipe_slug: slug,
                            chef_name: chefName,
                            chef_color: chefColor,
                            updated_at: new Date().toISOString()
                        }, {
                            onConflict: 'recipe_slug'
                        });

                    if (error) {
                        console.error('❌ Error updating chef name:', error);
                    } else {
                        console.log('✅ Chef name saved:', data);
                    }
                }
            } catch (error) {
                console.error('❌ Exception updating chef name:', error);
            }
        } else {
            console.warn('⚠️ Supabase not connected, chef name change only local');
        }
    };

    return {
        // State (read-only for components)
        orderCounts,
        completedIngredients,
        completedSteps,
        ingredientMetadata,
        stepMetadata,
        recipeStatus,
        recipeChefNames,
        isLoading,
        loadError,

        // Setters (only for useRealtime hook)
        setOrderCounts,
        setCompletedIngredients,
        setCompletedSteps,
        setIngredientMetadata,
        setStepMetadata,
        setRecipeStatus,
        setRecipeChefNames,

        // Operations (for components)
        updateOrderCount,
        toggleIngredient,
        toggleStep,
        updateRecipeStatus,
        updateChefName
    };
};

// Export to global scope
window.useRecipeData = useRecipeData;