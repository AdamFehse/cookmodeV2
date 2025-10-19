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
    const [recipeStatus, setRecipeStatus] = React.useState({});
    const [recipeChefNames, setRecipeChefNames] = React.useState({});
    const [isLoading, setIsLoading] = React.useState(true);
    const [loadError, setLoadError] = React.useState(null);

    const DEFAULT_CHEF_COLOR = window.DEFAULT_CHEF_COLOR || '#9333ea';
    const generateIngredientKeyFromItem = window.generateIngredientKeyFromItem;
    const generateStepKeyFromItem = window.generateStepKeyFromItem;
    const generateIngredientKey = window.generateIngredientKey;
    const generateStepKey = window.generateStepKey;

    // Helper: Upsert data to Supabase
    const upsertToSupabase = async (table, data, conflictKey) => {
        if (!supabase || !isSupabaseConnected) {
            console.warn(`Supabase not connected - ${table} change only local`);
            return null;
        }

        try {
            const { data: result, error } = await supabase
                .from(table)
                .upsert(data, { onConflict: conflictKey });

            if (error) {
                console.error(`Error updating ${table}:`, error);
                return null;
            }
            return result;
        } catch (error) {
            console.error(`Exception updating ${table}:`, error);
            return null;
        }
    };

    // Helper: Delete from Supabase
    const deleteFromSupabase = async (table, slug) => {
        if (!supabase || !isSupabaseConnected) {
            console.warn(`Supabase not connected - ${table} delete only local`);
            return;
        }

        try {
            const { error } = await supabase
                .from(table)
                .delete()
                .eq('recipe_slug', slug);

            if (error) console.error(`Error deleting from ${table}:`, error);
        } catch (error) {
            console.error(`Exception deleting from ${table}:`, error);
        }
    };

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
                    ingredientData.forEach(item => {
                        const key = generateIngredientKeyFromItem(item);
                        ingredientMap[key] = item.is_checked;
                    });
                    setCompletedIngredients(ingredientMap);
                }

                // Load step completions
                const { data: stepData, error: stepError } = await supabase
                    .from('step_completions')
                    .select('*');

                if (stepError) throw stepError;

                if (stepData) {
                    const stepMap = {};
                    stepData.forEach(item => {
                        const key = generateStepKeyFromItem(item);
                        stepMap[key] = item.is_completed;
                    });
                    setCompletedSteps(stepMap);
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
                    console.warn(' Error loading chef names (table may not exist yet):', chefError);
                } else if (chefData) {
                    const chefMap = {};
                    chefData.forEach(item => {
                        chefMap[item.recipe_slug] = {
                            name: item.chef_name,
                            color: item.chef_color || DEFAULT_CHEF_COLOR
                        };
                    });
                    setRecipeChefNames(chefMap);
                }

                setIsLoading(false);
                console.log('Supabase connected! Real-time sync active.');
            } catch (error) {
                console.error(' Error loading data from Supabase:', error);
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
        await upsertToSupabase('order_counts', {
            recipe_slug: slug,
            count: count,
            updated_by: cookName || 'Unknown',
            updated_at: new Date().toISOString()
        }, 'recipe_slug');
    };

    const toggleIngredient = async (recipeSlug, ingredientKey, componentName, ingredientIndex, ingredientText) => {
        const newCheckedState = !completedIngredients[ingredientKey];

        // Optimistically update UI
        setCompletedIngredients(prev => ({ ...prev, [ingredientKey]: newCheckedState }));

        // Sync to Supabase (simplified - no metadata)
        if (supabase && isSupabaseConnected) {
            try {
                const { error } = await supabase
                    .from('ingredient_checks')
                    .upsert({
                        recipe_slug: recipeSlug,
                        ingredient_index: ingredientIndex,
                        component_name: componentName,
                        ingredient_text: ingredientText,
                        is_checked: newCheckedState
                    }, {
                        onConflict: 'recipe_slug,ingredient_index,component_name'
                    });

                if (error) {
                    console.error('Error saving ingredient:', error);
                }
            } catch (error) {
                console.error('Error updating ingredient:', error);
            }
        }
    };

    const toggleStep = async (recipeSlug, stepKey, stepIndex, stepText) => {
        const newCompletedState = !completedSteps[stepKey];

        // Optimistically update UI
        setCompletedSteps(prev => ({ ...prev, [stepKey]: newCompletedState }));

        // Sync to Supabase (simplified - no metadata)
        if (supabase && isSupabaseConnected) {
            try {
                const { error } = await supabase
                    .from('step_completions')
                    .upsert({
                        recipe_slug: recipeSlug,
                        step_index: stepIndex,
                        step_text: stepText,
                        is_completed: newCompletedState
                    }, {
                        onConflict: 'recipe_slug,step_index'
                    });

                if (error) {
                    console.error('Error updating step:', error);
                }
            } catch (error) {
                console.error('Error updating step:', error);
            }
        }
    };

    const updateRecipeStatus = async (slug, status) => {
        console.log('🏷️ Updating recipe status:', slug, status);

        // Optimistically update UI
        setRecipeStatus(prev => ({ ...prev, [slug]: status }));

        // Sync to Supabase
        if (status === null) {
            await deleteFromSupabase('recipe_status', slug);
        } else {
            await upsertToSupabase('recipe_status', {
                recipe_slug: slug,
                status: status,
                updated_by: cookName || 'Unknown',
                updated_at: new Date().toISOString()
            }, 'recipe_slug');
        }
    };

    const updateChefName = async (slug, chefName, chefColor = DEFAULT_CHEF_COLOR) => {
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
        if (!chefName) {
            await deleteFromSupabase('recipe_chef_names', slug);
        } else {
            await upsertToSupabase('recipe_chef_names', {
                recipe_slug: slug,
                chef_name: chefName,
                chef_color: chefColor,
                updated_at: new Date().toISOString()
            }, 'recipe_slug');
        }
    };

    return {
        // State (read-only for components)
        orderCounts,
        completedIngredients,
        completedSteps,
        recipeStatus,
        recipeChefNames,
        isLoading,
        loadError,

        // Setters (only for useRealtime hook)
        setOrderCounts,
        setCompletedIngredients,
        setCompletedSteps,
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