// Custom hook for real-time Supabase subscriptions
const useRealtime = (supabase, isSupabaseConnected, setCompletedIngredients, setIngredientMetadata, setCompletedSteps, setStepMetadata, setRecipeStatus, setOrderCounts, setRecipeChefNames) => {
    const channelRef = React.useRef(null);

    React.useEffect(() => {
        if (!supabase || !isSupabaseConnected) return;

        // Create a channel for all real-time updates
        const channel = supabase.channel('kitchen-updates');

        // Listen to ingredient_checks changes
        channel.on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'ingredient_checks' },
            (payload) => {
                console.log('Ingredient update from Supabase:', payload);
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                    const item = payload.new;
                    // Generate the same key format as the UI
                    const key = `${item.recipe_slug}-ing-${item.component_name}-${item.ingredient_index}`;
                    console.log('Updating key:', key, 'to', item.is_checked);
                    setCompletedIngredients(prev => {
                        const updated = { ...prev, [key]: item.is_checked };
                        console.log('New ingredient state:', updated);
                        return updated;
                    });
                    setIngredientMetadata(prev => ({
                        ...prev,
                        [key]: {
                            checked_by: item.checked_by,
                            checked_at: item.checked_at
                        }
                    }));
                } else if (payload.eventType === 'DELETE') {
                    const item = payload.old;
                    const key = `${item.recipe_slug}-ing-${item.component_name}-${item.ingredient_index}`;
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
                console.log('Step update:', payload);
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                    const item = payload.new;
                    const key = `${item.recipe_slug}-step-${item.step_index}`;
                    setCompletedSteps(prev => ({ ...prev, [key]: item.is_completed }));
                    setStepMetadata(prev => ({
                        ...prev,
                        [key]: {
                            completed_by: item.completed_by,
                            completed_at: item.completed_at
                        }
                    }));
                }
            }
        );

        // Listen to recipe_status changes
        channel.on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'recipe_status' },
            (payload) => {
                console.log('Recipe status update:', payload);
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
                console.log('Order count update:', payload);
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
                console.log('Chef name update:', payload);
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                    const item = payload.new;
                    setRecipeChefNames(prev => ({
                        ...prev,
                        [item.recipe_slug]: {
                            name: item.chef_name,
                            color: item.chef_color || '#9333ea'
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

        console.log('Listening for real-time updates...');

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