const ChefPrepModal = ({ chefAssignments, chefName, onClose }) => {
    const { useState } = React;
    const assignment = chefAssignments?.[chefName];
    const [notes, setNotes] = useState('');
    const [completedIngredients, setCompletedIngredients] = useState({});
    const [completedSteps, setCompletedSteps] = useState({});
    const [activeTab, setActiveTab] = useState({});  // Track which tab is active per dish (default: 'ingredients')

    if (!assignment) return null;

    const dishes = assignment.recipes || [];
    const consolidatedIngredients = assignment.ingredients || {};

    // Calculate kitchen-wide progress
    const totalIngredients = Object.keys(consolidatedIngredients).length;
    const completedIngredientsCount = Object.values(completedIngredients).filter(Boolean).length;

    const totalSteps = dishes.reduce((sum, { recipe }) => sum + (recipe.instructions?.length || 0), 0);
    const completedStepsCount = Object.values(completedSteps).filter(Boolean).length;

    const totalProgress = totalIngredients + totalSteps;
    const completedProgress = completedIngredientsCount + completedStepsCount;
    const overallPercentage = totalProgress > 0 ? Math.round((completedProgress / totalProgress) * 100) : 0;

    // Count completed dishes
    const dishCompletedCount = dishes.filter(({ slug, recipe }) => {
        const dishSteps = recipe.instructions || [];
        let dishIngredients = recipe.recipeIngredients || [];
        if (dishIngredients.length === 0) {
            dishIngredients = Object.values(consolidatedIngredients);
        }
        const stepsCompleted = dishSteps.length > 0 && dishSteps.every((_, idx) => completedSteps[`${slug}-step-${idx}`]);
        const ingredientsCompleted = dishIngredients.length > 0 && dishIngredients.every((_, idx) => completedIngredients[`${slug}-ingredient-${idx}`]);
        return stepsCompleted && ingredientsCompleted;
    }).length;

    const handleToggleIngredient = (key) => {
        setCompletedIngredients(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleToggleStep = (stepKey) => {
        setCompletedSteps(prev => ({ ...prev, [stepKey]: !prev[stepKey] }));
    };

    const handleTabChange = (slug, tab) => {
        setActiveTab(prev => ({ ...prev, [slug]: tab }));
    };

    const handleMarkDishComplete = (slug, recipe) => {
        const allSteps = {};
        (recipe.instructions || []).forEach((step, idx) => {
            allSteps[`${slug}-step-${idx}`] = true;
        });
        setCompletedSteps(prev => ({ ...prev, ...allSteps }));
    };

    // Render kitchen-wide dashboard (total progress)
    const kitchenDashboard = React.createElement('div', { key: 'kitchen-dashboard', className: 'prep-total-dashboard' }, [
        React.createElement('div', { key: 'total-progress', className: 'prep-progress-item' }, [
            React.createElement('div', { key: 'label' }, [
                React.createElement('span', { key: 'text' }, 'Kitchen Overall Progress'),
                React.createElement('span', { key: 'count', className: 'prep-progress-count' }, 
                    `${completedProgress}/${totalProgress}`
                )
            ]),
            React.createElement('progress', { 
                key: 'bar', 
                value: completedProgress, 
                max: totalProgress 
            })
        ]),
        React.createElement('div', { key: 'metrics', className: 'prep-metrics-row' }, [
            React.createElement('div', { key: 'dishes', className: 'prep-metric-card' }, [
                React.createElement('span', { key: 'label' }, 'Dishes'),
                React.createElement('span', { key: 'value', className: 'prep-metric-value' }, `${dishCompletedCount}/${dishes.length}`)
            ]),
            React.createElement('div', { key: 'ingredients', className: 'prep-metric-card' }, [
                React.createElement('span', { key: 'label' }, 'Ingredients'),
                React.createElement('span', { key: 'value', className: 'prep-metric-value' }, `${completedIngredientsCount}/${totalIngredients}`)
            ]),
            React.createElement('div', { key: 'steps', className: 'prep-metric-card' }, [
                React.createElement('span', { key: 'label' }, 'Steps'),
                React.createElement('span', { key: 'value', className: 'prep-metric-value' }, `${completedStepsCount}/${totalSteps}`)
            ])
        ])
    ]);

    // Render dish cards grid (all dishes)
    const dishCards = dishes.map(({ slug, recipe }, dishIndex) => {
        const dishSteps = recipe.instructions || [];
        const dishStepsCompleted = dishSteps.filter((_, idx) => completedSteps[`${slug}-step-${idx}`]).length;
        
        // Get ingredients for this specific dish
        // Try recipe.recipeIngredients first, then fall back to all consolidated ingredients
        let dishIngredients = recipe.recipeIngredients || [];
        
        // If no recipe ingredients, use consolidated ingredients (fallback for backward compatibility)
        if (dishIngredients.length === 0) {
            // Convert consolidated ingredients to array format for all dishes
            dishIngredients = Object.values(consolidatedIngredients);
        }
        
        // Calculate total progress (ingredients + steps)
        const dishIngredientsCompleted = dishIngredients.filter((_, idx) => completedIngredients[`${slug}-ingredient-${idx}`]).length;
        const totalItems = dishIngredients.length + dishSteps.length;
        const itemsCompleted = dishIngredientsCompleted + dishStepsCompleted;
        
        // Get active tab for this dish (default: 'ingredients')
        const currentTab = activeTab[slug] || 'ingredients';
        
        return React.createElement('div', { 
            key: `dish-${slug}`, 
            className: 'prep-dish-card'
        }, [
            // Image
            recipe.images?.[0] && React.createElement('img', {
                key: 'image',
                src: recipe.images[0],
                alt: recipe.name,
                className: 'prep-dish-card-image'
            }),
            
            // Title
            React.createElement('h3', { key: 'title' }, recipe.name),
            
            // Progress bar (always visible)
            React.createElement('div', { key: 'progress', className: 'prep-dish-progress-section' }, [
                React.createElement('div', { key: 'progress-label' }, [
                    React.createElement('span', { key: 'text' }, 'Progress:'),
                    React.createElement('span', { key: 'count', className: 'prep-progress-count' }, `${itemsCompleted}/${totalItems}`)
                ]),
                React.createElement('progress', { key: 'bar', value: itemsCompleted, max: totalItems })
            ]),
            
            // Tab buttons
            React.createElement('div', { key: 'tabs', className: 'prep-dish-tabs' }, [
                React.createElement('button', {
                    key: 'tab-ingredients',
                    className: `prep-tab-button ${currentTab === 'ingredients' ? 'active' : ''}`,
                    onClick: () => handleTabChange(slug, 'ingredients')
                }, '🥘 Ingredients'),
                React.createElement('button', {
                    key: 'tab-methods',
                    className: `prep-tab-button ${currentTab === 'methods' ? 'active' : ''}`,
                    onClick: () => handleTabChange(slug, 'methods')
                }, '👨‍🍳 Methods')
            ]),
            
            // Tab content: Ingredients
            currentTab === 'ingredients' && dishIngredients.length > 0 && React.createElement('div', { key: 'ingredients-panel', className: 'prep-tab-content' },
                React.createElement('div', { key: 'ingredients-list', className: 'prep-ingredients-columns' },
                    dishIngredients.map((ingredient, idx) => {
                        const ingredientKey = `${slug}-ingredient-${idx}`;
                        const isCompleted = completedIngredients[ingredientKey];
                        return React.createElement('label', {
                            key: ingredientKey,
                            className: `prep-ingredient-item-compact ${isCompleted ? 'checked' : ''}`
                        }, [
                            React.createElement('input', {
                                key: 'checkbox',
                                type: 'checkbox',
                                checked: isCompleted,
                                onChange: () => handleToggleIngredient(ingredientKey),
                                className: 'prep-ingredient-checkbox'
                            }),
                            React.createElement('span', { key: 'text' }, `${ingredient.name} ${ingredient.amount}${ingredient.unit ? ingredient.unit : ''}`)
                        ]);
                    })
                )
            ),
            
            // Tab content: Methods (Steps)
            currentTab === 'methods' && React.createElement('div', { key: 'methods-panel', className: 'prep-tab-content' },
                dishSteps.length === 0 ? React.createElement('p', { key: 'no-steps', className: 'muted' }, 'No steps.') : React.createElement('ol', {
                    key: 'steps',
                    className: 'prep-steps-list'
                },
                    dishSteps.map((step, idx) => {
                        const stepKey = `${slug}-step-${idx}`;
                        const isCompleted = completedSteps[stepKey];
                        return React.createElement('li', {
                            key: stepKey,
                            className: `prep-step-item ${isCompleted ? 'checked' : ''}`
                        }, [
                            React.createElement('label', { key: 'label', className: 'prep-step-label' }, [
                                React.createElement('input', {
                                    key: 'checkbox',
                                    type: 'checkbox',
                                    checked: isCompleted,
                                    onChange: () => handleToggleStep(stepKey),
                                    className: 'prep-step-checkbox'
                                }),
                                React.createElement('span', { key: 'text', className: 'prep-step-text' }, step)
                            ])
                        ]);
                    })
                )
            ),
            
            // Action button
            React.createElement('button', {
                key: 'mark-complete',
                type: 'button',
                className: 'primary',
                onClick: () => handleMarkDishComplete(slug, recipe),
                style: { width: '100%', marginTop: '0.75em' }
            }, `Mark Complete`)
        ]);
    });

    // Dish cards grid container
    const dashboardContent = React.createElement('div', { key: 'dish-grid', className: 'prep-dish-grid' }, 
        dishCards
    );

    return React.createElement('dialog', {
        open: true,
        className: 'prep-modal',
        onClose: onClose,
        onClick: (e) => { if (e.target.tagName === 'DIALOG') onClose?.(); }
    }, [
        // Header
        React.createElement('header', { key: 'header', className: 'prep-modal-header' }, [
            React.createElement('div', { key: 'title-section' }, [
                React.createElement('h2', { key: 'title' }, `${chefName}'s Prep`),
                React.createElement('p', { key: 'subtitle', className: 'muted' },
                    `${dishes.length} dish${dishes.length === 1 ? '' : 'es'} • ${totalIngredients} ingredient${totalIngredients === 1 ? '' : 's'} • ${totalSteps} step${totalSteps === 1 ? '' : 's'}`
                )
            ]),
            React.createElement('a', {
                key: 'close',
                href: '#close',
                className: 'close',
                onClick: (event) => {
                    event.preventDefault();
                    onClose?.();
                }
            })
        ]),

        // Kitchen-wide dashboard with total progress
        kitchenDashboard,

        // Main content: all dish cards in grid
        React.createElement('div', { key: 'content', className: 'prep-modal-content' },
            dashboardContent
        ),

        // Notes section
        React.createElement('div', { key: 'notes', className: 'prep-modal-notes' }, [
            React.createElement('label', { key: 'label' }, 'Notes'),
            React.createElement('textarea', {
                key: 'textarea',
                value: notes,
                onChange: (e) => setNotes(e.target.value),
                placeholder: 'Jot down reminders, observations, or notes...',
                className: 'prep-notes-input'
            })
        ]),

        // Footer with close button
        React.createElement('footer', { key: 'footer', className: 'prep-modal-footer' }, [
            React.createElement('button', {
                key: 'close-btn',
                type: 'button',
                className: 'secondary',
                onClick: onClose
            }, 'Done')
        ])
    ]);
};

window.ChefPrepModal = ChefPrepModal;
