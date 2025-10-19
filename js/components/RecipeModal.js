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
    const { useRef, useEffect, useState } = React;
    const dialogRef = useRef(null);
    const chefNameTimeoutRef = useRef(null);

    // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
    const scaleAmount = window.scaleAmount || ((ingredient) => ingredient);
    const slugToDisplayName = window.slugToDisplayName || ((slug) => slug);
    const DEFAULT_CHEF_COLOR = window.DEFAULT_CHEF_COLOR || '#a855f7';
    const resolveChefColor = window.resolveChefColor || ((color) => color);

    // Get current recipe data (with fallbacks for when selectedRecipe is null)
    const recipe = selectedRecipe ? recipes[selectedRecipe] : null;
    const currentChefData = selectedRecipe ? (recipeChefNames[selectedRecipe] || { name: '', color: DEFAULT_CHEF_COLOR }) : { name: '', color: DEFAULT_CHEF_COLOR };

    // Local state for chef name and color (debounced) - MUST be before early returns
    const [localChefName, setLocalChefName] = useState(currentChefData.name || '');
    const [localChefColor, setLocalChefColor] = useState(currentChefData.color || '');

    // Use native dialog.showModal() API
    useEffect(() => {
        if (selectedRecipe && dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, [selectedRecipe]);

    // Update local state when recipe changes
    useEffect(() => {
        setLocalChefName(currentChefData.name || '');
        setLocalChefColor(currentChefData.color || '');
    }, [selectedRecipe, currentChefData.name, currentChefData.color]);

    // NOW we can do early returns
    if (!selectedRecipe) return null;
    if (!recipe) return null;

    // Helper functions for status styling with vibrant colors
    const getStatusBadgeStyle = (status) => {
        const colors = {
            gathered: { bg: '#3b82f6', text: '#ffffff' },  // Blue
            complete: { bg: '#10b981', text: '#ffffff' },  // Green
            plated: { bg: '#f59e0b', text: '#000000' },    // Orange
            packed: { bg: '#8b5cf6', text: '#ffffff' }     // Purple
        };

        const color = colors[status] || { bg: '#6b7280', text: '#ffffff' };

        return {
            backgroundColor: color.bg,
            color: color.text,
            border: 'none',
            padding: '0.25rem 0.5rem',
            borderRadius: 'var(--pico-border-radius)'
        };
    };

    const getStatusButtonStyle = (status, isActive) => {
        if (!isActive) return {};

        const colors = {
            gathered: '#3b82f6',  // Blue
            complete: '#10b981',  // Green
            plated: '#f59e0b',    // Orange
            packed: '#8b5cf6'     // Purple
        };

        return {
            backgroundColor: colors[status],
            borderColor: colors[status],
            color: '#ffffff'
        };
    };

    const displayName = recipe.name || slugToDisplayName(selectedRecipe);
    const orderCount = orderCounts[selectedRecipe] ?? 1;
    const sliderId = `${selectedRecipe}-orders-slider`;

    // Debounced chef name update
    const handleChefNameChange = (newName) => {
        setLocalChefName(newName);

        // Clear existing timeout
        if (chefNameTimeoutRef.current) {
            clearTimeout(chefNameTimeoutRef.current);
        }

        // Set new timeout to update database after 500ms of no typing
        chefNameTimeoutRef.current = setTimeout(() => {
            if (updateChefName) {
                updateChefName(selectedRecipe, newName, localChefColor || DEFAULT_CHEF_COLOR);
            }
        }, 500);
    };

    // Handle color change
    const handleChefColorChange = (newColor) => {
        setLocalChefColor(newColor);
        if (updateChefName && localChefName) {
            updateChefName(selectedRecipe, localChefName, newColor || DEFAULT_CHEF_COLOR);
        }
    };

    const handleOrderChange = (event) => {
        const nextValue = parseInt(event.target.value, 10);
        const safeValue = Number.isNaN(nextValue) ? 1 : Math.min(Math.max(nextValue, 1), 50);
        if (updateOrderCount) {
            updateOrderCount(selectedRecipe, safeValue);
        }
    };

    const handleClose = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
        setSelectedRecipe(null);
    };

    // Handle ESC key and backdrop click (native dialog features)
    const handleDialogClick = (e) => {
        // Close on backdrop click
        if (e.target === dialogRef.current) {
            handleClose();
        }
    };

    return React.createElement('dialog', {
            ref: dialogRef,
            onClick: handleDialogClick,
            onClose: handleClose
        },
            React.createElement('article', { className: 'recipe-modal' }, [
                // Header
                React.createElement('header', { key: 'header' }, [
                    React.createElement('a', {
                        key: 'close',
                        href: '#close',
                        className: 'close',
                        'aria-label': 'Close recipe modal',
                        onClick: (event) => {
                            event.preventDefault();
                            handleClose();
                        }
                    }),
                    React.createElement('h2', { key: 'title' }, displayName)
                ]),

                // Control section - Chef name & Status buttons
                React.createElement('section', { key: 'controls', className: 'modal-controls' }, [
                    // Chef name input
                    React.createElement('div', { key: 'chef', className: 'chef-control' }, [
                        React.createElement('input', {
                            key: 'name',
                            type: 'text',
                            placeholder: 'Chef name',
                            value: localChefName,
                            onChange: (event) => handleChefNameChange(event.target.value),
                            style: { marginBottom: '0.5rem' }
                        }),
                        React.createElement('select', {
                            key: 'color',
                            value: localChefColor || '',
                            onChange: (event) => handleChefColorChange(event.target.value),
                            disabled: !localChefName
                        }, [
                            React.createElement('option', { key: 'none', value: '' }, 'Badge color...'),
                            React.createElement('option', { key: 'purple', value: 'var(--chef-purple)' }, 'Purple'),
                            React.createElement('option', { key: 'blue', value: 'var(--chef-blue)' }, 'Blue'),
                            React.createElement('option', { key: 'red', value: 'var(--chef-red)' }, 'Red'),
                            React.createElement('option', { key: 'teal', value: 'var(--chef-teal)' }, 'Teal'),
                            React.createElement('option', { key: 'orange', value: 'var(--chef-orange)' }, 'Orange'),
                            React.createElement('option', { key: 'yellow', value: 'var(--chef-yellow)' }, 'Yellow'),
                            React.createElement('option', { key: 'pink', value: 'var(--chef-pink)' }, 'Pink')
                        ]),
                        localChefName && localChefColor && React.createElement('kbd', {
                            key: 'preview',
                            style: {
                                backgroundColor: resolveChefColor(localChefColor),
                                color: '#ffffff',
                                marginTop: '0.5rem',
                                display: 'inline-block'
                            }
                        }, localChefName)
                    ]),

                    // Status section
                    React.createElement('div', { key: 'status', className: 'status-control' }, [
                        React.createElement('div', { key: 'status-info', style: { marginBottom: '0.5rem' } }, [
                            'Status: ',
                            React.createElement('mark', {
                                key: 'badge',
                                style: getStatusBadgeStyle(recipeStatus[selectedRecipe])
                            }, recipeStatus[selectedRecipe] ? recipeStatus[selectedRecipe].toUpperCase() : 'NONE')
                        ]),
                        React.createElement('div', {
                            key: 'status-buttons',
                            role: 'group',
                            style: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }
                        },
                            ['gathered', 'complete', 'plated', 'packed'].map((status) => {
                                const isActive = recipeStatus[selectedRecipe] === status;
                                const buttonClass = isActive ? '' : 'outline secondary';
                                return React.createElement('button', {
                                    key: status,
                                    type: 'button',
                                    className: buttonClass,
                                    style: getStatusButtonStyle(status, isActive),
                                    'aria-pressed': isActive,
                                    onClick: () => updateRecipeStatus && updateRecipeStatus(selectedRecipe, isActive ? null : status)
                                }, status.charAt(0).toUpperCase() + status.slice(1));
                            })
                        )
                    ])
                ]),

                // Main layout with photos sidebar
                React.createElement('div', { key: 'layout', className: 'modal-layout' }, [
                    // Photos sidebar (if available)
                    recipe.images && recipe.images.length > 0 && React.createElement('aside', { key: 'photos', className: 'photos-sidebar' },
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
                    ),

                    // Main content (ingredients + instructions)
                    React.createElement('div', { key: 'main-content', className: 'modal-main' }, [
                        // Ingredients section
                        React.createElement('section', { key: 'ingredients' }, [
                        React.createElement('hgroup', { key: 'header' }, [
                            React.createElement('h3', { key: 'title' }, 'Ingredients'),
                            React.createElement('p', { key: 'label' }, [
                                React.createElement('label', { htmlFor: sliderId }, [
                                    `Orders: ${orderCount}x`,
                                    React.createElement('input', {
                                        key: 'slider',
                                        id: sliderId,
                                        type: 'range',
                                        min: 1,
                                        max: 50,
                                        value: orderCount,
                                        onChange: handleOrderChange
                                    })
                                ])
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
                    React.createElement('section', { key: 'instructions' }, [
                        React.createElement('h3', { key: 'title' }, 'Instructions'),
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
                ].filter(Boolean))
            ])
    );
};

window.RecipeModal = RecipeModal;
