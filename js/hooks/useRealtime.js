// Custom hook for real-time Supabase subscriptions
const useRealtime = (supabase, isSupabaseConnected, setCompletedIngredients, setCompletedSteps, setRecipeStatus, setOrderCounts, setRecipeChefNames) => {
    const channelRef = React.useRef(null);

    React.useEffect(() => {
        if (!supabase || !isSupabaseConnected) return;

        const DEFAULT_CHEF_COLOR = window.DEFAULT_CHEF_COLOR || '#9333ea';
        const registerChefColor = window.registerChefColor || (() => null);
        const suggestChefColor = window.suggestChefColor || (() => 'var(--chef-purple)');
        const generateIngredientKeyFromItem = window.generateIngredientKeyFromItem;
        const generateStepKeyFromItem = window.generateStepKeyFromItem;

        // Create a channel for all real-time updates
        const channel = supabase.channel('kitchen-updates');

        // Listen to ingredient_checks changes
        channel.on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'ingredient_checks' },
            (payload) => {
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                    const item = payload.new;
                    const key = generateIngredientKeyFromItem(item);
                    setCompletedIngredients(prev => ({
                        ...prev,
                        [key]: item.is_checked
                    }));
                } else if (payload.eventType === 'DELETE') {
                    const item = payload.old;
                    const key = generateIngredientKeyFromItem(item);
                    setCompletedIngredients(prev => {
                        const updated = { ...prev };
                        delete updated[key];
                        return updated;
                    });
                }
            }
        );

        // Listen to step_completions changes
        channel.on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'step_completions' },
            (payload) => {
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                    const item = payload.new;
                    const key = generateStepKeyFromItem(item);
                    setCompletedSteps(prev => ({ ...prev, [key]: item.is_completed }));
                }
            }
        );

        // Listen to recipe_status changes
        channel.on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'recipe_status' },
            (payload) => {
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                    const item = payload.new;
                    setRecipeStatus(prev => ({ ...prev, [item.recipe_slug]: item.status }));
                } else if (payload.eventType === 'DELETE') {
                    const item = payload.old;
                    setRecipeStatus(prev => {
                        const newState = { ...prev };
                        delete newState[item.recipe_slug];
                        return newState;
                    });
                }
            }
        );

        // Listen to order_counts changes
        channel.on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'order_counts' },
            (payload) => {
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                    const item = payload.new;
                    setOrderCounts(prev => ({ ...prev, [item.recipe_slug]: item.count }));
                }
            }
        );

        // Listen to recipe_chef_names changes
        channel.on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'recipe_chef_names' },
            (payload) => {
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                    const item = payload.new;
                    if (!item.chef_name) {
                        setRecipeChefNames(prev => ({
                            ...prev,
                            [item.recipe_slug]: { name: '', color: '' }
                        }));
                        return;
                    }

                    const assignedColor =
                        registerChefColor(item.chef_name, item.chef_color) ||
                        suggestChefColor(item.chef_name) ||
                        DEFAULT_CHEF_COLOR;

                    setRecipeChefNames(prev => ({
                        ...prev,
                        [item.recipe_slug]: {
                            name: item.chef_name,
                            color: assignedColor
                        }
                    }));
                } else if (payload.eventType === 'DELETE') {
                    const item = payload.old;
                    setRecipeChefNames(prev => {
                        const newState = { ...prev };
                        delete newState[item.recipe_slug];
                        return newState;
                    });
                }
            }
        );

        channel.subscribe();
        channelRef.current = channel;

        // Cleanup on unmount
        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
            }
        };
    }, [isSupabaseConnected, supabase]);
    // Note: React setters are stable and don't need to be in dependency array
};

// Export to global scope
window.useRealtime = useRealtime;
