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

    const recipes = window.RECIPES || {};
    const DEFAULT_CHEF_COLOR = window.DEFAULT_CHEF_COLOR || '#9333ea';
    const getAssignedChefColor = window.getAssignedChefColor || (() => null);
    const suggestChefColor = window.suggestChefColor || (() => 'var(--chef-purple)');
    const registerChefColor = window.registerChefColor || (() => null);
    const generateIngredientKeyFromItem = window.generateIngredientKeyFromItem;
    const generateStepKeyFromItem = window.generateStepKeyFromItem;
    const generateIngredientKey = window.generateIngredientKey;
    const generateStepKey = window.generateStepKey;
    const slugToDisplayName = window.slugToDisplayName;
    const resolveChefColor = window.resolveChefColor || ((color) => color);

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
                        if (!item.chef_name) {
                            chefMap[item.recipe_slug] = { name: '', color: '' };
                            return;
                        }

                        const assignedColor =
                            registerChefColor(item.chef_name, item.chef_color) ||
                            suggestChefColor(item.chef_name);

                        chefMap[item.recipe_slug] = {
                            name: item.chef_name,
                            color: assignedColor || ''
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

    const serializeIngredient = (ingredient) => {
        if (!ingredient) return '';
        if (typeof ingredient === 'string') return ingredient;
        if (typeof window.scaleAmount === 'function') {
            return window.scaleAmount(ingredient, 1);
        }
        const { ingredient: name = '', unit = '', prep, amount } = ingredient;
        const pieces = [];
        if (amount !== null && amount !== undefined && amount !== '') {
            pieces.push(String(amount));
        }
        if (unit) pieces.push(unit);
        if (name) pieces.push(name);
        let result = pieces.join(' ').trim();
        if (prep) {
            result = `${result}${result ? ', ' : ''}${prep}`;
        }
        return result;
    };

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
                        ingredient_text: serializeIngredient(ingredientText),
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

    const updateChefName = async (slug, chefName, chefColor) => {
        const trimmedName = (chefName || '').trim();
        console.log('👨‍🍳 Updating chef name:', slug, trimmedName, chefColor);

        if (!trimmedName) {
            setRecipeChefNames(prev => {
                const newState = { ...prev };
                delete newState[slug];
                return newState;
            });
            await deleteFromSupabase('recipe_chef_names', slug);
            return;
        }

        const explicitColor =
            chefColor === null
                ? null
                : (typeof chefColor === 'string' && chefColor.trim() !== '' ? chefColor : null);

        const resolvedColor = registerChefColor(trimmedName, explicitColor);

        const colorForState = resolvedColor || '';

        setRecipeChefNames(prev => ({
            ...prev,
            [slug]: { name: trimmedName, color: colorForState }
        }));

        await upsertToSupabase('recipe_chef_names', {
            recipe_slug: slug,
            chef_name: trimmedName,
            chef_color: resolvedColor,
            updated_at: new Date().toISOString()
        }, 'recipe_slug');
    };

    const recipesByChef = React.useMemo(() => {
        const map = {};

        Object.entries(recipes).forEach(([slug, recipe]) => {
            const chefMeta = recipeChefNames[slug];
            const chefName = chefMeta?.name || 'Unassigned';
            if (!map[chefName]) {
                map[chefName] = {
                    chef: chefName,
                    color: resolveChefColor(chefMeta?.color || ''),
                    recipes: [],
                    totalOrders: 0
                };
            }

            const orderCount = orderCounts[slug] || 1;
            map[chefName].recipes.push({
                slug,
                name: recipe.name || slugToDisplayName?.(slug) || slug,
                orderCount,
                status: recipeStatus[slug] || null
            });
            map[chefName].totalOrders += orderCount;
        });

        return map;
    }, [recipes, recipeChefNames, orderCounts, recipeStatus]);

    const ordersByStatus = React.useMemo(() => {
        const map = {};

        Object.entries(recipes).forEach(([slug, recipe]) => {
            const status = recipeStatus[slug] || 'unassigned';
            if (!map[status]) {
                map[status] = {
                    status,
                    recipes: [],
                    totalOrders: 0
                };
            }

            const orderCount = orderCounts[slug] || 1;
            map[status].recipes.push({
                slug,
                name: recipe.name || slugToDisplayName?.(slug) || slug,
                orderCount,
                chefName: recipeChefNames[slug]?.name || 'Unassigned'
            });
            map[status].totalOrders += orderCount;
        });

        return map;
    }, [recipes, recipeStatus, orderCounts, recipeChefNames]);

    const threeDayPrep = React.useMemo(() => {
        const dayConfig = [
            { key: 'prep', label: 'Sunday Prep' },
            { key: 'cook', label: 'Monday Cook' },
            { key: 'delivery', label: 'Tuesday Delivery' }
        ];

        const buckets = dayConfig.reduce((acc, day) => {
            acc[day.key] = {
                key: day.key,
                label: day.label,
                totalOrders: 0,
                recipes: [],
                chefBreakdown: {}
            };
            return acc;
        }, {});

        const categorize = (status) => {
            switch (status) {
                case 'packed':
                case 'plated':
                    return 'delivery';
                case 'complete':
                    return 'cook';
                case 'gathered':
                default:
                    return 'prep';
            }
        };

        Object.entries(recipes).forEach(([slug, recipe]) => {
            const status = recipeStatus[slug] || null;
            const bucketKey = categorize(status);
            const bucket = buckets[bucketKey] || buckets.prep;
            const orderCount = orderCounts[slug] || 1;
            const chefMeta = recipeChefNames[slug];
            const chefName = chefMeta?.name || 'Unassigned';

            bucket.totalOrders += orderCount;
            bucket.recipes.push({
                slug,
                name: recipe.name || slugToDisplayName?.(slug) || slug,
                status,
                orderCount,
                chefName,
                chefColor: resolveChefColor(chefMeta?.color || '')
            });

            if (!bucket.chefBreakdown[chefName]) {
                bucket.chefBreakdown[chefName] = {
                    chef: chefName,
                    color: resolveChefColor(chefMeta?.color || ''),
                    totalOrders: 0,
                    recipes: 0
                };
            }
            bucket.chefBreakdown[chefName].totalOrders += orderCount;
            bucket.chefBreakdown[chefName].recipes += 1;
        });

        return dayConfig.map(({ key }) => {
            const bucket = buckets[key];
            return {
                ...bucket,
                chefBreakdown: Object.values(bucket.chefBreakdown).sort((a, b) => {
                    if (a.chef === 'Unassigned') return 1;
                    if (b.chef === 'Unassigned') return -1;
                    return a.chef.localeCompare(b.chef);
                })
            };
        });
    }, [recipes, recipeStatus, recipeChefNames, orderCounts]);

    return {
        // State (read-only for components)
        orderCounts,
        completedIngredients,
        completedSteps,
        recipeStatus,
        recipeChefNames,
        isLoading,
        loadError,
        recipesByChef,
        ordersByStatus,
        threeDayPrep,

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
