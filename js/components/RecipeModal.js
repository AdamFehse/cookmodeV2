const RecipeModal = ({
    selectedRecipe,
    setSelectedRecipe,
    recipes,
    cookName,
    orderCounts,
    updateOrderCount,
    completedIngredients,
    toggleIngredient,
    completedSteps,
    toggleStep,
    recipeStatus,
    updateRecipeStatus,
    recipeChefNames,
    updateChefName,
    openLightbox
}) => {
    if (!selectedRecipe) return null;

    const recipe = recipes[selectedRecipe];
    const STATUS_BUTTON_STYLES = window.STATUS_BUTTON_STYLES;
    const scaleAmount = window.scaleAmount;
    const slugToDisplayName = window.slugToDisplayName;

    const displayName = recipe.name || slugToDisplayName(selectedRecipe);
    const currentChefData = recipeChefNames[selectedRecipe] || { name: '', color: '#9333ea' };
    const currentChefName = currentChefData.name || '';
    const currentChefColor = currentChefData.color || '#00fed0ff';
    const orderCount = orderCounts[selectedRecipe] || 1;
    const sliderId = `${selectedRecipe}-orders-slider`;

    return React.createElement('div', {
        className: 'modal-overlay',
        onClick: () => setSelectedRecipe(null)
    },
        React.createElement('dialog', {
            open: true,
            className: 'modal',
            onClick: (e) => e.stopPropagation()
        }, [
            React.createElement('article', { key: 'content', className: 'container recipe-modal' }, [
                React.createElement('header', { key: 'header', className: 'modal-header' }, [
                    React.createElement('h2', { key: 'title' }, displayName),
                    React.createElement('button', {
                        key: 'close',
                        type: 'button',
                        className: 'secondary outline',
                        onClick: () => setSelectedRecipe(null)
                    }, 'Close')
                ]),

                React.createElement('div', { key: 'controls', className: 'grid modal-controls' }, [
                    React.createElement('fieldset', { key: 'chef' }, [
                        React.createElement('legend', { key: 'legend' }, 'Chef'),
                        React.createElement('div', { key: 'inputs', className: 'grid chef-inputs' }, [
                            React.createElement('input', {
                                key: 'name',
                                type: 'text',
                                placeholder: 'Chef name',
                                value: currentChefName,
                                onChange: (e) => updateChefName(selectedRecipe, e.target.value, currentChefColor)
                            }),
                            React.createElement('input', {
                                key: 'color',
                                type: 'color',
                                value: currentChefColor,
                                onChange: (e) => currentChefName && updateChefName(selectedRecipe, currentChefName, e.target.value),
                                title: 'Badge color',
                                style: { width: '48px', height: '48px', padding: 0 }
                            })
                        ])
                    ]),
                    React.createElement('fieldset', { key: 'orders' }, [
                        React.createElement('legend', { key: 'legend' }, 'Orders'),
                        React.createElement('label', { key: 'label', htmlFor: sliderId }, `Orders: ${orderCount}x`),
                        React.createElement('input', {
                            key: 'slider',
                            id: sliderId,
                            type: 'range',
                            min: 1,
                            max: 50,
                            value: orderCount,
                            onChange: (e) => updateOrderCount(selectedRecipe, parseInt(e.target.value))
                        })
                    ]),
                    recipe.images && recipe.images.length > 0 && React.createElement('section', { key: 'photos' }, [
                        React.createElement('h4', { key: 'title', style: { marginBottom: '0.5rem' } }, 'Photos'),
                        React.createElement('div', { key: 'grid', className: 'grid thumbnail-grid' },
                            recipe.images.map((img, idx) =>
                                React.createElement('button', {
                                    key: idx,
                                    type: 'button',
                                    className: 'thumbnail-button',
                                    onClick: () => openLightbox(recipe.images, idx)
                                },
                                    React.createElement('img', {
                                        key: 'img',
                                        src: img,
                                        alt: `${displayName} photo ${idx + 1}`
                                    })
                                )
                            )
                        )
                    ])
                ].filter(Boolean)),

                React.createElement('div', { key: 'layout', className: 'grid modal-layout' }, [
                    React.createElement('section', { key: 'ingredients', className: 'modal-column ingredients-column' }, [
                        React.createElement('h3', { key: 'title' }, 'Ingredients'),
                        React.createElement('p', { key: 'count', className: 'ingredients-count' }, `Scaled for ${orderCount} order${orderCount > 1 ? 's' : ''}`),
                        recipe.components && Object.entries(recipe.components).map(([component, ingredients]) =>
                            React.createElement('details', {
                                key: component,
                                open: true
                            }, [
                                React.createElement('summary', { key: 'header' }, React.createElement('strong', null, component)),
                                React.createElement('ul', { key: 'list' },
                                    ingredients.map((ing, i) => {
                                        const ingKey = `${selectedRecipe}-ing-${component}-${i}`;
                                        const isCompleted = completedIngredients[ingKey];

                                        return React.createElement('li', {
                                            key: i,
                                            className: isCompleted ? 'checked' : ''
                                        }, [
                                            React.createElement('label', {
                                                key: 'label',
                                                onClick: () => toggleIngredient(selectedRecipe, ingKey, component, i, ing)
                                            }, [
                                                React.createElement('input', {
                                                    key: 'checkbox',
                                                    type: 'checkbox',
                                                    checked: isCompleted || false,
                                                    onChange: () => {}
                                                }),
                                                React.createElement('span', { key: 'text' },
                                                    scaleAmount(ing, orderCount)
                                                )
                                            ])
                                        ]);
                                    })
                                )
                            ])
                        )
                    ]),
                    React.createElement('section', { key: 'instructions', className: 'modal-column instructions-column' }, [
                        React.createElement('h3', { key: 'title' }, 'Instructions'),
                        React.createElement('div', { key: 'status', className: 'status-actions', role: 'group' },
                            ['gathered', 'complete', 'plated', 'packed'].map(status =>
                                React.createElement('button', {
                                    key: status,
                                    onClick: () => updateRecipeStatus(selectedRecipe, recipeStatus[selectedRecipe] === status ? null : status),
                                    className: `status-button ${STATUS_BUTTON_STYLES[status][recipeStatus[selectedRecipe] === status ? 'active' : 'inactive']}`
                                }, status.charAt(0).toUpperCase() + status.slice(1))
                            )
                        ),
                        React.createElement('ol', { key: 'steps' },
                            recipe.instructions.map((step, i) => {
                                const stepKey = `${selectedRecipe}-step-${i}`;
                                const isCompleted = completedSteps[stepKey];

                                return React.createElement('li', {
                                    key: i,
                                    className: isCompleted ? 'checked' : ''
                                }, [
                                    React.createElement('label', {
                                        key: 'label',
                                        onClick: () => toggleStep(selectedRecipe, stepKey, i, step)
                                    }, [
                                        React.createElement('input', {
                                            key: 'checkbox',
                                            type: 'checkbox',
                                            checked: isCompleted || false,
                                            onChange: () => {}
                                        }),
                                        React.createElement('span', { key: 'text' }, step)
                                    ])
                                ]);
                            })
                        ),
                        recipe.notes && React.createElement('blockquote', { key: 'notes', className: 'modal-notes' }, [
                            React.createElement('strong', { key: 'title' }, 'Notes'),
                            React.createElement('p', { key: 'text' }, recipe.notes)
                        ])
                    ])
                ])
            ])
        ])
    );
};

window.RecipeModal = RecipeModal;
