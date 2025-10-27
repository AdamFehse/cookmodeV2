/**
 * RecipeModalV2 - Simplified, streamlined recipe modal
 * Single column layout with collapsible sections
 * Focus on simplicity and usability for kitchen use
 */
const RecipeModalV2 = ({
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
}) => {
    const { useRef, useEffect, useState, useMemo } = React;
    const dialogRef = useRef(null);
    const chefNameTimeoutRef = useRef(null);

    const scaleAmount = window.scaleAmount || ((ingredient) => ingredient);
    const slugToDisplayName = window.slugToDisplayName || ((slug) => slug);
    const resolveChefColor = window.resolveChefColor || ((color) => color);
    const getAssignedChefColor = window.getAssignedChefColor || (() => null);
    const suggestChefColor = window.suggestChefColor || (() => 'var(--chef-purple)');
    const getChefColorLabel = window.getChefColorLabel || (() => 'Custom');
    const getChefColorOptions = window.getChefColorOptions || (() => []);

    const recipe = selectedRecipe ? recipes[selectedRecipe] : null;
    const currentChefData = selectedRecipe ? (recipeChefNames[selectedRecipe] || { name: '', color: '' }) : { name: '', color: '' };

    const [localChefName, setLocalChefName] = useState(currentChefData.name || '');
    const [localChefColor, setLocalChefColor] = useState(currentChefData.color || '');
    const [expandedSections, setExpandedSections] = useState({
        details: true,
        ingredients: false,
        instructions: false,
        notes: false
    });

    useEffect(() => {
        if (selectedRecipe && dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, [selectedRecipe]);

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

    if (!selectedRecipe || !recipe) return null;

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

    const handleOrderChange = (newValue) => {
        const safeValue = Math.min(Math.max(newValue, 1), 50);
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

    const handleDialogClick = (e) => {
        if (e.target === dialogRef.current) {
            handleClose();
        }
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getStatusBadgeStyle = (status) => {
        const colors = {
            'in-progress': { bg: 'var(--status-in-progress)', text: '#000000' },
            'complete': { bg: 'var(--status-complete)', text: '#000000' },
            'plated': { bg: 'var(--status-plated)', text: '#000000' },
            'packed': { bg: 'var(--status-packed)', text: '#ffffff' }
        };
        return colors[status] || { bg: '#6b7280', text: '#ffffff' };
    };

    const displayName = recipe.name || slugToDisplayName(selectedRecipe);
    const trimmedChefName = (localChefName || '').trim();
    const colorOptions = getChefColorOptions(trimmedChefName, localChefColor || '');
    const orderCount = orderCounts[selectedRecipe] ?? 1;

    // Calculate ingredient and step completion
    const ingredientStats = useMemo(() => {
        let total = 0, completed = 0;
        if (recipe.components) {
            Object.entries(recipe.components).forEach(([component, ingredients]) => {
                ingredients.forEach((_, index) => {
                    const ingredientKey = `${selectedRecipe}-ing-${component}-${index}`;
                    total++;
                    if (completedIngredients[ingredientKey]) completed++;
                });
            });
        }
        return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
    }, [recipe.components, completedIngredients]);

    const stepStats = useMemo(() => {
        const total = recipe.instructions?.length || 0;
        let completed = 0;
        (recipe.instructions || []).forEach((_, index) => {
            const stepKey = `${selectedRecipe}-step-${index}`;
            if (completedSteps[stepKey]) completed++;
        });
        return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
    }, [recipe.instructions, completedSteps]);

    return React.createElement('dialog', {
        ref: dialogRef,
        onClick: handleDialogClick,
        onClose: handleClose,
        className: 'recipe-modal-v2'
    },
        React.createElement('article', { className: 'recipe-modal-content' }, [
            // Header with close button
            React.createElement('header', { key: 'header', className: 'modal-header' }, [
                React.createElement('h2', { key: 'title', style: { margin: 0 } }, displayName),
                React.createElement('button', {
                    key: 'close',
                    type: 'button',
                    className: 'modal-close',
                    'aria-label': 'Close recipe',
                    onClick: handleClose
                }, '✕')
            ]),

            // DETAILS SECTION (Always open)
            React.createElement('section', { key: 'details', className: 'modal-section modal-section--details' }, [
                React.createElement('div', { key: 'details-content', style: { display: 'flex', flexDirection: 'column', gap: '1rem' } }, [
                    // Recipe image (if available)
                    recipe.images?.[0] && React.createElement('img', {
                        key: 'image',
                        src: recipe.images[0],
                        alt: displayName,
                        onClick: () => recipe.images && openLightbox?.(recipe.images, 0),
                        style: {
                            width: '100%',
                            maxHeight: '200px',
                            objectFit: 'cover',
                            borderRadius: 'var(--radius-lg)',
                            cursor: 'pointer',
                            border: '1px solid rgba(0, 217, 255, 0.2)'
                        }
                    }),

                    // Chef assignment
                    React.createElement('div', { key: 'chef-section', className: 'chef-assignment' }, [
                        React.createElement('label', {
                            key: 'label',
                            style: { display: 'block', fontWeight: '600', marginBottom: '0.5rem' }
                        }, 'Assigned Chef'),
                        React.createElement('input', {
                            key: 'name',
                            type: 'text',
                            placeholder: 'Enter chef name',
                            value: localChefName,
                            onChange: (event) => handleChefNameChange(event.target.value),
                            style: {
                                width: '100%',
                                padding: '0.75rem',
                                marginBottom: '0.5rem'
                            }
                        }),
                        React.createElement('div', {
                            key: 'color-display',
                            style: { display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '2rem' }
                        }, [
                            React.createElement('span', {
                                key: 'swatch',
                                style: {
                                    width: '1.5rem',
                                    height: '1.5rem',
                                    borderRadius: '50%',
                                    border: '2px solid rgba(0, 217, 255, 0.4)',
                                    backgroundColor: resolveChefColor(localChefColor || ''),
                                    boxShadow: localChefColor ? `0 0 10px ${resolveChefColor(localChefColor)}` : 'none'
                                }
                            }),
                            React.createElement('select', {
                                key: 'color-select',
                                value: (localChefColor || ''),
                                onChange: (event) => handleChefColorChange(event.target.value),
                                disabled: !trimmedChefName,
                                style: { flex: 1 }
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
                        !trimmedChefName && React.createElement('small', {
                            key: 'hint',
                            style: { color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }
                        }, 'Enter chef name to auto-assign color')
                    ]),

                    // Order count with accessible slider
                    React.createElement('div', { key: 'orders-section' },
                        React.createElement(window.AccessibleSlider, {
                            value: orderCount,
                            min: 1,
                            max: 50,
                            onChange: handleOrderChange,
                            label: 'Order Scale'
                        })
                    ),

                    // Status buttons
                    React.createElement('div', { key: 'status-section', className: 'status-control-v2' }, [
                        React.createElement('label', {
                            key: 'label',
                            style: { display: 'block', fontWeight: '600', marginBottom: '0.5rem' }
                        }, 'Workflow Status'),
                        React.createElement('div', {
                            key: 'status-buttons',
                            role: 'group',
                            style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }
                        },
                            ['in-progress', 'complete', 'plated', 'packed'].map((stat) => {
                                const isActive = recipeStatus[selectedRecipe] === stat;
                                const displayLabel = stat === 'in-progress' ? 'In Progress' : stat.charAt(0).toUpperCase() + stat.slice(1);
                                const colors = getStatusBadgeStyle(stat);

                                return React.createElement('button', {
                                    key: stat,
                                    type: 'button',
                                    className: 'status-button-v2',
                                    'data-active': isActive,
                                    'data-status': stat,
                                    style: {
                                        padding: '0.75rem',
                                        background: isActive ? colors.bg : 'rgba(255, 255, 255, 0.05)',
                                        color: isActive ? colors.text : 'var(--text-primary)',
                                        border: `2px solid ${colors.bg}`,
                                        borderRadius: 'var(--radius-lg)',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        fontSize: '0.9rem',
                                        transition: 'all var(--transition-fast)',
                                        textTransform: isActive ? 'none' : 'none'
                                    },
                                    'aria-pressed': isActive,
                                    onClick: () => updateRecipeStatus?.(selectedRecipe, isActive ? null : stat)
                                }, displayLabel);
                            })
                        )
                    ])
                ])
            ]),

            // INGREDIENTS SECTION (Collapsible)
            recipe.components && React.createElement('section', { key: 'ingredients', className: 'modal-section' }, [
                React.createElement('button', {
                    key: 'header',
                    type: 'button',
                    className: 'section-header-button',
                    onClick: () => toggleSection('ingredients'),
                    style: {
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: 'rgba(0, 217, 255, 0.08)',
                        border: '1px solid rgba(0, 217, 255, 0.2)',
                        borderRadius: 'var(--radius-lg)',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        transition: 'all var(--transition-fast)'
                    }
                }, [
                    React.createElement('span', { key: 'title' }, `Ingredients (${ingredientStats.completed}/${ingredientStats.total})`),
                    React.createElement('span', {
                        key: 'arrow',
                        style: {
                            transform: expandedSections.ingredients ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform var(--transition-fast)',
                            fontSize: '1.2rem'
                        }
                    }, '▼')
                ]),

                expandedSections.ingredients && React.createElement('div', { key: 'content', className: 'section-content', style: { padding: '1rem 0' } }, [
                    React.createElement('div', {
                        key: 'controls',
                        style: { display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }
                    }, [
                        React.createElement('button', {
                            key: 'check-all',
                            type: 'button',
                            className: 'outline',
                            onClick: () => {
                                const allCompleted = ingredientStats.completed === ingredientStats.total;
                                if (recipe.components) {
                                    Object.entries(recipe.components).forEach(([component, ingredients]) => {
                                        ingredients.forEach((ingredient, index) => {
                                            const ingredientKey = `${selectedRecipe}-ing-${component}-${index}`;
                                            const isCompleted = completedIngredients[ingredientKey];
                                            if (allCompleted && isCompleted) {
                                                toggleIngredient?.(selectedRecipe, ingredientKey, component, index, ingredient);
                                            } else if (!allCompleted && !isCompleted) {
                                                toggleIngredient?.(selectedRecipe, ingredientKey, component, index, ingredient);
                                            }
                                        });
                                    });
                                }
                            },
                            style: { padding: '0.5rem 0.75rem', fontSize: '0.85rem' }
                        }, ingredientStats.completed === ingredientStats.total ? 'Uncheck All' : 'Check All')
                    ]),

                    Object.entries(recipe.components).map(([component, ingredients]) =>
                        React.createElement('div', { key: component, className: 'ingredient-group' }, [
                            React.createElement('h4', {
                                key: 'title',
                                style: { margin: '0.75rem 0 0.5rem 0', fontSize: '0.95rem', fontWeight: '600', color: 'var(--color-primary)' }
                            }, component),
                            React.createElement('ul', {
                                key: 'list',
                                style: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }
                            },
                                ingredients.map((ingredient, index) => {
                                    const ingredientKey = `${selectedRecipe}-ing-${component}-${index}`;
                                    const isCompleted = completedIngredients[ingredientKey];

                                    return React.createElement('li', { key: index },
                                        React.createElement(window.ChecklistItem, {
                                            id: ingredientKey,
                                            label: scaleAmount(ingredient, orderCount),
                                            checked: isCompleted || false,
                                            onChange: () => toggleIngredient?.(selectedRecipe, ingredientKey, component, index, ingredient),
                                            variant: 'default',
                                            className: isCompleted ? 'checked' : ''
                                        })
                                    );
                                })
                            )
                        ])
                    )
                ])
            ]),

            // INSTRUCTIONS SECTION (Collapsible)
            recipe.instructions && recipe.instructions.length > 0 && React.createElement('section', { key: 'instructions', className: 'modal-section' }, [
                React.createElement('button', {
                    key: 'header',
                    type: 'button',
                    className: 'section-header-button',
                    onClick: () => toggleSection('instructions'),
                    style: {
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: 'rgba(255, 0, 110, 0.08)',
                        border: '1px solid rgba(255, 0, 110, 0.2)',
                        borderRadius: 'var(--radius-lg)',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        transition: 'all var(--transition-fast)'
                    }
                }, [
                    React.createElement('span', { key: 'title' }, `Instructions (${stepStats.completed}/${stepStats.total})`),
                    React.createElement('span', {
                        key: 'arrow',
                        style: {
                            transform: expandedSections.instructions ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform var(--transition-fast)',
                            fontSize: '1.2rem'
                        }
                    }, '▼')
                ]),

                expandedSections.instructions && React.createElement('div', { key: 'content', className: 'section-content', style: { padding: '1rem 0' } }, [
                    React.createElement('div', {
                        key: 'controls',
                        style: { marginBottom: '1rem' }
                    }, [
                        React.createElement('button', {
                            key: 'check-all',
                            type: 'button',
                            className: 'outline',
                            onClick: () => {
                                const allCompleted = stepStats.completed === stepStats.total;
                                (recipe.instructions || []).forEach((step, index) => {
                                    const stepKey = `${selectedRecipe}-step-${index}`;
                                    const isCompleted = completedSteps[stepKey];
                                    if (allCompleted && isCompleted) {
                                        toggleStep?.(selectedRecipe, stepKey, index, step);
                                    } else if (!allCompleted && !isCompleted) {
                                        toggleStep?.(selectedRecipe, stepKey, index, step);
                                    }
                                });
                            },
                            style: { padding: '0.5rem 0.75rem', fontSize: '0.85rem' }
                        }, stepStats.completed === stepStats.total ? 'Uncheck All' : 'Check All')
                    ]),

                    React.createElement('ol', {
                        key: 'steps',
                        style: { listStyle: 'decimal', paddingLeft: '1.5rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }
                    },
                        (recipe.instructions || []).map((step, index) => {
                            const stepKey = `${selectedRecipe}-step-${index}`;
                            const isCompleted = completedSteps[stepKey];

                            return React.createElement('li', { key: index },
                                React.createElement(window.ChecklistItem, {
                                    id: stepKey,
                                    label: step,
                                    checked: isCompleted || false,
                                    onChange: () => toggleStep?.(selectedRecipe, stepKey, index, step),
                                    variant: 'step',
                                    className: isCompleted ? 'checked' : ''
                                })
                            );
                        })
                    )
                ])
            ]),

            // NOTES SECTION (Collapsible)
            recipe.notes && React.createElement('section', { key: 'notes', className: 'modal-section' }, [
                React.createElement('button', {
                    key: 'header',
                    type: 'button',
                    className: 'section-header-button',
                    onClick: () => toggleSection('notes'),
                    style: {
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1rem',
                        background: 'rgba(255, 174, 0, 0.08)',
                        border: '1px solid rgba(255, 174, 0, 0.2)',
                        borderRadius: 'var(--radius-lg)',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        fontWeight: '600',
                        transition: 'all var(--transition-fast)'
                    }
                }, [
                    React.createElement('span', { key: 'title' }, 'Notes'),
                    React.createElement('span', {
                        key: 'arrow',
                        style: {
                            transform: expandedSections.notes ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform var(--transition-fast)',
                            fontSize: '1.2rem'
                        }
                    }, '▼')
                ]),

                expandedSections.notes && React.createElement('div', { key: 'content', className: 'section-content', style: { padding: '1rem 0' } }, [
                    typeof recipe.notes === 'string'
                        ? React.createElement('p', { key: 'notes-text', style: { margin: 0, lineHeight: 1.6 } }, recipe.notes)
                        : Array.isArray(recipe.notes)
                            ? React.createElement('ul', { key: 'notes-list', style: { margin: 0, paddingLeft: '1.5rem' } },
                                recipe.notes.map((note, idx) =>
                                    React.createElement('li', { key: idx, style: { marginBottom: '0.5rem', lineHeight: 1.6 } }, note)
                                )
                            )
                            : null
                ])
            ])
        ])
    );
};

window.RecipeModalV2 = RecipeModalV2;
