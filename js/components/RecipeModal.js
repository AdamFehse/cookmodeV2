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
    updateChefName,
    openLightbox
}) => 
    {
    if (!selectedRecipe) return null;

    const recipe = recipes[selectedRecipe];
    if (!recipe) return null;

    const STATUS_BUTTON_STYLES = window.STATUS_BUTTON_STYLES || {};
    const scaleAmount = window.scaleAmount || ((ingredient) => ingredient);
    const slugToDisplayName = window.slugToDisplayName || ((slug) => slug);

    const displayName = recipe.name || slugToDisplayName(selectedRecipe);
    const currentChefData = recipeChefNames[selectedRecipe] || { name: '', color: '#9333ea' };
    const currentChefName = currentChefData.name || '';
    const currentChefColor = currentChefData.color || '#00fed0ff';
    const orderCount = orderCounts[selectedRecipe] ?? 1;
    const sliderId = `${selectedRecipe}-orders-slider`;

    const handleOrderChange = (event) => {
        const nextValue = parseInt(event.target.value, 10);
        const safeValue = Number.isNaN(nextValue) ? 1 : Math.min(Math.max(nextValue, 1), 50);
        if (updateOrderCount) {
            updateOrderCount(selectedRecipe, safeValue);
        }
    };

    const getStatusButtonClass = (status) => {
        const isActive = recipeStatus[selectedRecipe] === status;
        const statusStyles = STATUS_BUTTON_STYLES[status] || {};
        const stateClass = statusStyles[isActive ? 'active' : 'inactive'] || '';
        return `status-button ${stateClass}`.trim();
    };

    return React.createElement('div', {
        className: 'modal-overlay',
        onClick: () => setSelectedRecipe(null)
    },
        React.createElement('dialog', {
            open: true,
            className: 'modal',
            onClick: (event) => event.stopPropagation()
        },
            React.createElement('article', { className: 'container recipe-modal' }, [
                // Header
                React.createElement('header', { key: 'header', className: 'modal-header' }, [
                    React.createElement('h2', { key: 'title' }, displayName),
                    React.createElement('button', {
                        key: 'close',
                        type: 'button',
                        className: 'secondary outline',
                        onClick: () => setSelectedRecipe(null)
                    }, 'Close')
                ]),

                // Controls
                React.createElement('div', { key: 'controls', className: 'grid modal-controls' }, [
                    // Chef fieldset
                    React.createElement('fieldset', { key: 'chef' }, [
                        React.createElement('legend', { key: 'legend' }, 'Chef'),
                        React.createElement('div', { key: 'inputs', className: 'grid chef-inputs' }, [
                            React.createElement('input', {
                                key: 'name',
                                type: 'text',
                                placeholder: 'Chef name',
                                value: currentChefName,
                                onChange: (event) => updateChefName && updateChefName(selectedRecipe, event.target.value, currentChefColor)
                            }),
                            React.createElement('input', {
                                key: 'color',
                                type: 'color',
                                value: currentChefColor,
                                onChange: (event) => currentChefName && updateChefName && updateChefName(selectedRecipe, currentChefName, event.target.value),
                                title: 'Badge color',
                                style: { width: '48px', height: '48px', padding: 0 }
                            })
                        ])
                    ]),

                    // Photos section
                    recipe.images && recipe.images.length > 0 && React.createElement('section', { key: 'photos' }, [
                        React.createElement('h4', { key: 'title', style: { marginBottom: '0.5rem' } }, 'Photos'),
                        React.createElement('div', { key: 'grid', className: 'grid thumbnail-grid' },
                            recipe.images.map((img, index) =>
                                React.createElement('button', {
                                    key: index,
                                    type: 'button',
                                    className: 'thumbnail-button',
                                    onClick: () => openLightbox && openLightbox(recipe.images, index)
                                },
                                    React.createElement('img', {
                                        src: img,
                                        alt: `${displayName} photo ${index + 1}`
                                    })
                                )
                            )
                        )
                    ])
                ].filter(Boolean)),

                // Main layout
                React.createElement('div', { key: 'layout', className: 'grid modal-layout' }, [
                    // Ingredients column
                    React.createElement('section', { key: 'ingredients', className: 'modal-column ingredients-column' }, [
                        React.createElement('div', { key: 'header', style: { display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' } }, [
                            React.createElement('h3', { key: 'title', style: { margin: 0 } }, 'Ingredients'),
                            React.createElement('label', { key: 'label', htmlFor: sliderId, style: { display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '0 0 auto' } }, [
                                React.createElement('input', {
                                    key: 'slider',
                                    id: sliderId,
                                    type: 'range',
                                    min: 1,
                                    max: 50,
                                    value: orderCount,
                                    onChange: handleOrderChange,
                                    style: { width: '120px' }
                                }),
                                React.createElement('span', { key: 'count' }, `${orderCount}x`)
                            ])
                        ]),
                        recipe.components && Object.entries(recipe.components).map(([component, ingredients]) =>
                            React.createElement('details', {
                                key: component,
                                open: true
                            }, [
                                React.createElement('summary', { key: 'header' }, React.createElement('strong', null, component)),
                                React.createElement('ul', { key: 'list' },
                                    ingredients.map((ingredient, index) => {
                                        const ingredientKey = `${selectedRecipe}-ing-${component}-${index}`;
                                        const isCompleted = completedIngredients[ingredientKey];

                                        return React.createElement('li', {
                                            key: index,
                                            className: isCompleted ? 'checked' : ''
                                        },
                                            React.createElement('label', null, [
                                                React.createElement('input', {
                                                    key: 'checkbox',
                                                    type: 'checkbox',
                                                    checked: isCompleted || false,
                                                    onChange: () => toggleIngredient && toggleIngredient(selectedRecipe, ingredientKey, component, index, ingredient)
                                                }),
                                                scaleAmount(ingredient, orderCount)
                                            ])
                                        );
                                    })
                                )
                            ])
                        )
                    ]),

                    // Instructions column
                    React.createElement('section', { key: 'instructions', className: 'modal-column instructions-column' }, [
                        React.createElement('h3', { key: 'title' }, 'Instructions'),
                        React.createElement('div', { key: 'status', className: 'status-actions', role: 'group' },
                            ['gathered', 'complete', 'plated', 'packed'].map((status) =>
                                React.createElement('button', {
                                    key: status,
                                    type: 'button',
                                    onClick: () => updateRecipeStatus && updateRecipeStatus(selectedRecipe, recipeStatus[selectedRecipe] === status ? null : status),
                                    className: getStatusButtonClass(status)
                                }, status.charAt(0).toUpperCase() + status.slice(1))
                            )
                        ),
                        React.createElement('ol', { key: 'steps' },
                            (recipe.instructions || []).map((step, index) => {
                                const stepKey = `${selectedRecipe}-step-${index}`;
                                const isCompleted = completedSteps[stepKey];

                                return React.createElement('li', {
                                    key: index,
                                    className: isCompleted ? 'checked' : ''
                                },
                                    React.createElement('label', null, [
                                        React.createElement('input', {
                                            key: 'checkbox',
                                            type: 'checkbox',
                                            checked: isCompleted || false,
                                            onChange: () => toggleStep && toggleStep(selectedRecipe, stepKey, index, step)
                                        }),
                                        step
                                    ])
                                );
                            })
                        ),
                        recipe.notes && React.createElement('blockquote', { key: 'notes', className: 'modal-notes' }, [
                            React.createElement('strong', { key: 'title' }, 'Notes'),
                            typeof recipe.notes === 'string'
                                ? React.createElement('p', { key: 'text' }, recipe.notes)
                                : Array.isArray(recipe.notes)
                                    ? React.createElement('div', { key: 'list' }, recipe.notes.map((note, idx) =>
                                        React.createElement('p', { key: idx }, note)
                                    ))
                                    : null
                        ])
                    ])
                ])
            ])
        )
    );
};

window.RecipeModal = RecipeModal;
