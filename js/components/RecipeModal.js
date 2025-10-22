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
    const resolveChefColor = window.resolveChefColor || ((color) => color);
    const getAssignedChefColor = window.getAssignedChefColor || (() => null);
    const suggestChefColor = window.suggestChefColor || (() => 'var(--chef-purple)');
    const getChefColorLabel = window.getChefColorLabel || (() => 'Custom');
    const getChefColorOptions = window.getChefColorOptions || (() => []);

    // Get current recipe data (with fallbacks for when selectedRecipe is null)
    const recipe = selectedRecipe ? recipes[selectedRecipe] : null;
    const currentChefData = selectedRecipe ? (recipeChefNames[selectedRecipe] || { name: '', color: '' }) : { name: '', color: '' };

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
        const nextName = currentChefData.name || '';
        setLocalChefName(nextName);
        if (nextName) {
            const trimmed = nextName.trim();
            const assignedColor = getAssignedChefColor(trimmed);
            const nextColor = assignedColor || currentChefData.color || suggestChefColor(trimmed);
            setLocalChefColor(nextColor);
        } else {
            setLocalChefColor('');
        }
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
    const trimmedChefName = (localChefName || '').trim();
    const colorOptions = getChefColorOptions(trimmedChefName, localChefColor || '');
    const orderCount = orderCounts[selectedRecipe] ?? 1;
    const sliderId = `${selectedRecipe}-orders-slider`;

    // Debounced chef name update
    const handleChefNameChange = (newName) => {
        const trimmedName = newName.trim();
        const nextColor = trimmedName
            ? (getAssignedChefColor(trimmedName) || suggestChefColor(trimmedName))
            : '';

        setLocalChefName(newName);
        setLocalChefColor(nextColor);

        if (chefNameTimeoutRef.current) {
            clearTimeout(chefNameTimeoutRef.current);
        }

        chefNameTimeoutRef.current = setTimeout(() => {
            if (!updateChefName) return;

            if (!trimmedName) {
                updateChefName(selectedRecipe, '', '');
                return;
            }

            updateChefName(selectedRecipe, trimmedName, nextColor);
        }, 500);
    };

    const handleChefColorChange = (newColor) => {
        const trimmedName = (localChefName || '').trim();
        if (!trimmedName) return;

        if (chefNameTimeoutRef.current) {
            clearTimeout(chefNameTimeoutRef.current);
            chefNameTimeoutRef.current = null;
        }

        if (!updateChefName) return;

        if (!newColor) {
            const nextColor = suggestChefColor(trimmedName);
            setLocalChefColor(nextColor);
            updateChefName(selectedRecipe, trimmedName, null);
            return;
        }

        setLocalChefColor(newColor);
        updateChefName(selectedRecipe, trimmedName, newColor);
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
                        React.createElement('div', {
                            key: 'color-display',
                            style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                minHeight: '2rem'
                            }
                        }, [
                            React.createElement('span', {
                                key: 'swatch',
                                style: {
                                    width: '1.25rem',
                                    height: '1.25rem',
                                    borderRadius: '999px',
                                    border: '1px solid var(--pico-muted-border-color)',
                                    backgroundColor: resolveChefColor(localChefColor || '')
                                }
                            }),
                            React.createElement('span', {
                                key: 'label',
                                className: 'muted'
                            }, trimmedChefName
                                ? `${getChefColorLabel(localChefColor || '')} badge`
                                : 'Enter a chef name to auto-assign color')
                        ]),
                        React.createElement('select', {
                            key: 'color-select',
                            value: (localChefColor || ''),
                            onChange: (event) => handleChefColorChange(event.target.value),
                            disabled: !trimmedChefName
                        },
                            colorOptions.map((option) =>
                                React.createElement('option', {
                                    key: option.value || '__auto__',
                                    value: option.value,
                                    disabled: option.disabled
                                }, option.label)
                            )
                        )
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
