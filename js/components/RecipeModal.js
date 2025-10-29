/**
 * RecipeModal - Clean React component for recipe details
 * Side-by-side ingredients/methods, check all buttons, Supabase persistence
 */
const RecipeModal = ({
    selectedRecipe,
    setSelectedRecipe,
    recipes = {},
    orderCounts = {},
    updateOrderCount,
    completedIngredients = {},
    toggleIngredient,
    completedSteps = {},
    toggleStep,
    recipeStatus = {},
    updateRecipeStatus,
    recipeChefNames = {},
    updateChefName
}) => {
    const { useState, useMemo, useEffect, useRef } = React;
    const dialogRef = useRef(null);
    const chefNameTimeoutRef = useRef(null);

    // Global utilities
    const scaleAmount = window.scaleAmount || ((ing) => ing);
    const slugToDisplayName = window.slugToDisplayName || ((slug) => slug);
    const getAssignedChefColor = window.getAssignedChefColor || (() => null);
    const suggestChefColor = window.suggestChefColor || (() => 'var(--chef-purple)');

    // Get recipe data
    const recipe = selectedRecipe ? recipes[selectedRecipe] : null;
    const currentChefData = selectedRecipe ? (recipeChefNames[selectedRecipe] || { name: '', color: '' }) : { name: '', color: '' };

    // Local state
    const [localChefName, setLocalChefName] = useState(currentChefData.name || '');
    const [orderInput, setOrderInput] = useState(orderCounts[selectedRecipe] ?? 1);

    // Sync dialog visibility
    useEffect(() => {
        if (selectedRecipe && recipe && dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, [selectedRecipe, recipe]);

    // Sync local state when recipe changes
    useEffect(() => {
        setLocalChefName(currentChefData.name || '');
        setOrderInput(orderCounts[selectedRecipe] ?? 1);
    }, [selectedRecipe]);

    if (!selectedRecipe || !recipe) return null;

    const displayName = recipe.name || slugToDisplayName(selectedRecipe);
    const currentStatus = recipeStatus[selectedRecipe];

    // Calculate stats
    const stats = useMemo(() => {
        let ingredientTotal = 0, ingredientCompleted = 0;
        let stepTotal = recipe?.instructions?.length || 0, stepCompleted = 0;

        if (recipe?.components) {
            Object.entries(recipe.components).forEach(([comp, ings]) => {
                ings.forEach((_, idx) => {
                    const key = `${selectedRecipe}-ing-${comp}-${idx}`;
                    ingredientTotal++;
                    if (completedIngredients[key]) ingredientCompleted++;
                });
            });
        }

        (recipe?.instructions || []).forEach((_, idx) => {
            const key = `${selectedRecipe}-step-${idx}`;
            if (completedSteps[key]) stepCompleted++;
        });

        return { ingredientTotal, ingredientCompleted, stepTotal, stepCompleted };
    }, [selectedRecipe, recipe, completedIngredients, completedSteps]);

    // Handlers
    const handleChefNameChange = (newName) => {
        const trimmed = newName.trim();
        const nextColor = trimmed ? (getAssignedChefColor(trimmed) || suggestChefColor(trimmed)) : '';
        setLocalChefName(newName);

        if (chefNameTimeoutRef.current) clearTimeout(chefNameTimeoutRef.current);
        chefNameTimeoutRef.current = setTimeout(() => {
            updateChefName?.(selectedRecipe, trimmed, nextColor);
        }, 500);
    };

    const handleOrderChange = (val) => {
        const safe = Math.min(Math.max(parseInt(val) || 1, 1), 50);
        setOrderInput(safe);
        updateOrderCount?.(selectedRecipe, safe);
    };

    const handleCheckAllIngredients = () => {
        if (!recipe.components) return;
        const allDone = stats.ingredientCompleted === stats.ingredientTotal;
        Object.entries(recipe.components).forEach(([comp, ings]) => {
            ings.forEach((ing, idx) => {
                const key = `${selectedRecipe}-ing-${comp}-${idx}`;
                const isDone = completedIngredients[key];
                if ((allDone && isDone) || (!allDone && !isDone)) {
                    toggleIngredient?.(selectedRecipe, key, comp, idx, ing);
                }
            });
        });
    };

    const handleCheckAllSteps = () => {
        const allDone = stats.stepCompleted === stats.stepTotal;
        (recipe.instructions || []).forEach((step, idx) => {
            const key = `${selectedRecipe}-step-${idx}`;
            const isDone = completedSteps[key];
            if ((allDone && isDone) || (!allDone && !isDone)) {
                toggleStep?.(selectedRecipe, key, idx, step);
            }
        });
    };

    const handleClose = () => {
        if (chefNameTimeoutRef.current) clearTimeout(chefNameTimeoutRef.current);
        if (dialogRef.current) dialogRef.current.close();
        setSelectedRecipe(null);
    };

    // Render
    return React.createElement('dialog', {
        ref: dialogRef,
        className: 'recipe-modal-v5',
        onClick: (e) => e.target === dialogRef.current && handleClose(),
        onClose: handleClose
    }, [
        // Header
        React.createElement('div', { key: 'header', className: 'modal-v5-header' }, [
            React.createElement('h2', { key: 'title', style: { margin: 0, flex: 1, fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, displayName),
            React.createElement('button', { key: 'close', className: 'modal-v5-close', onClick: handleClose, type: 'button' }, '✕')
        ]),

        // Controls: Chef, Status, Dish, Scale
        React.createElement('div', { key: 'controls', className: 'modal-v5-controls', style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 100px', gap: '0.75rem', alignItems: 'flex-end' } }, [
            React.createElement('div', { key: 'chef' }, [
                React.createElement('label', { style: { fontSize: '0.85rem', fontWeight: 600, color: '#00d9ff', display: 'block', marginBottom: '0.5rem' } }, 'Chef'),
                React.createElement('input', { type: 'text', placeholder: 'Chef name', value: localChefName, onChange: (e) => handleChefNameChange(e.target.value), className: 'control-v5' })
            ]),
            React.createElement('div', { key: 'status' }, [
                React.createElement('label', { style: { fontSize: '0.85rem', fontWeight: 600, color: '#00d9ff', display: 'block', marginBottom: '0.5rem' } }, 'Status'),
                React.createElement('select', { value: currentStatus || '', onChange: (e) => updateRecipeStatus?.(selectedRecipe, e.target.value || null), className: 'control-v5' }, [
                    React.createElement('option', { key: 'empty', value: '' }, 'Status'),
                    React.createElement('option', { key: 'in-progress', value: 'in-progress' }, 'In Progress'),
                    React.createElement('option', { key: 'complete', value: 'complete' }, 'Complete'),
                    React.createElement('option', { key: 'plated', value: 'plated' }, 'Plated'),
                    React.createElement('option', { key: 'packed', value: 'packed' }, 'Packed')
                ])
            ]),
            React.createElement('div', { key: 'dish' }, [
                React.createElement('label', { style: { fontSize: '0.85rem', fontWeight: 600, color: '#00d9ff', display: 'block', marginBottom: '0.5rem' } }, 'Dish'),
                React.createElement('div', { className: 'control-v5-dish' }, displayName)
            ]),
            React.createElement('div', { key: 'scale' }, [
                React.createElement('label', { style: { fontSize: '0.85rem', fontWeight: 600, color: '#00d9ff', display: 'block', marginBottom: '0.5rem' } }, 'Scale'),
                React.createElement('input', { type: 'number', min: 1, max: 50, value: orderInput, onChange: (e) => handleOrderChange(e.target.value), className: 'control-v5 control-v5-scale' })
            ])
        ]),

        // Two-column content: Ingredients and Steps
        React.createElement('div', { key: 'content', className: 'modal-v5-content' }, [
            // Ingredients
            React.createElement('div', { key: 'ing-panel', className: 'modal-v5-panel' }, [
                React.createElement('h3', { key: 'ing-title', className: 'panel-v5-title' }, `Ingredients (${stats.ingredientCompleted}/${stats.ingredientTotal})`),
                React.createElement('button', { key: 'ing-check-all', className: 'btn-v5-check-all', onClick: handleCheckAllIngredients, style: { width: '100%' } }, stats.ingredientCompleted === stats.ingredientTotal ? 'Uncheck All' : 'Check All'),
                React.createElement('ul', { key: 'ing-list', className: 'ingredients-v5-list' },
                    recipe.components ? Object.entries(recipe.components).flatMap(([comp, ings]) => [
                        React.createElement('li', { key: `group-${comp}` }, [
                            React.createElement('h4', { key: 'title', className: 'group-v5-title' }, comp),
                            React.createElement('ul', { key: 'items' }, ings.map((ing, idx) => {
                                const key = `${selectedRecipe}-ing-${comp}-${idx}`;
                                const done = completedIngredients[key];
                                return React.createElement('li', { key }, [
                                    React.createElement('input', { key: 'cb', type: 'checkbox', checked: done || false, onChange: () => toggleIngredient?.(selectedRecipe, key, comp, idx, ing), style: { marginRight: '0.5rem' } }),
                                    React.createElement('span', { key: 'text', style: { textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1 } }, scaleAmount(ing, orderInput))
                                ]);
                            }))
                        ])
                    ]) : [React.createElement('li', { key: 'empty' }, 'No ingredients')]
                )
            ]),

            // Steps
            React.createElement('div', { key: 'steps-panel', className: 'modal-v5-panel' }, [
                React.createElement('h3', { key: 'steps-title', className: 'panel-v5-title' }, `Method (${stats.stepCompleted}/${stats.stepTotal})`),
                React.createElement('button', { key: 'steps-check-all', className: 'btn-v5-check-all', onClick: handleCheckAllSteps, style: { width: '100%' } }, stats.stepCompleted === stats.stepTotal ? 'Uncheck All' : 'Check All'),
                React.createElement('ol', { key: 'steps-list', className: 'steps-v5-list' },
                    (recipe.instructions || []).map((step, idx) => {
                        const key = `${selectedRecipe}-step-${idx}`;
                        const done = completedSteps[key];
                        return React.createElement('li', { key }, [
                            React.createElement('input', { key: 'cb', type: 'checkbox', checked: done || false, onChange: () => toggleStep?.(selectedRecipe, key, idx, step), style: { marginRight: '0.5rem' } }),
                            React.createElement('span', { key: 'text', style: { textDecoration: done ? 'line-through' : 'none', opacity: done ? 0.6 : 1 } }, step)
                        ]);
                    })
                )
            ])
        ])
    ]);
};

window.RecipeModal = RecipeModal;
