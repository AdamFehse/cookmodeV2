/**
 * ChefPrepModal - Per-chef preparation interface with progress tracking
 *
 * Houses:
 * - Kitchen-wide progress bar
 * - Chef summary cards with individual progress bars
 * - Recipe cards with status indicators and badges
 * - Recipe modals for detailed work
 * - Integrated progress tracking
 *
 * Replaces the separate Overview and 3-Day Cycle buttons
 */

/**
 * Helper to determine badge color and label based on recipe status and progress
 * Prioritizes recipe status (set via modal) over calculated progress
 */
const getDishBadgeInfo = (slug, recipeStatus, calculateDishStatus, completedIngredients, completedSteps, recipe) => {
    // If recipe has explicit status set in modal, use that
    const explicitStatus = recipeStatus?.[slug];
    if (explicitStatus) {
        const statusMap = {
            'in-progress': { label: 'In Progress', color: '#eab308' },  // Yellow
            'complete': { label: 'Complete', color: '#10b981' },        // Green
            'plated': { label: 'Plated', color: '#f59e0b' },            // Orange
            'packed': { label: 'Packed', color: '#8b5cf6' }             // Purple
        };
        return statusMap[explicitStatus] || { label: 'Unknown', color: '#6b7280' };
    }

    // Otherwise calculate from progress
    const dishStatus = calculateDishStatus(slug, recipe, completedIngredients, completedSteps);
    return {
        label: dishStatus.label,
        color: dishStatus.color
    };
};

const ChefPrepModal = ({ chefSummaries = [], chefAssignments = {}, recipes = {}, recipeData = {} }) => {
    const { useState, useMemo } = React;
    const resolveChefColor = window.resolveChefColor || ((color) => color);
    const slugToDisplayName = window.slugToDisplayName || ((slug) => slug);
    const calculateDishStatus = window.calculateDishStatus || (() => ({}));
    const calculateChefProgress = window.calculateChefProgress || (() => ({}));
    const calculateKitchenProgress = window.calculateKitchenProgress || (() => ({}));

    // Expanded chef selection - only one chef can be open at a time
    const [expandedChefName, setExpandedChefName] = useState(null);
    const [selectedRecipeSlug, setSelectedRecipeSlug] = useState(null);

    if (!chefSummaries.length) {
        return null;
    }

    // Calculate kitchen-wide progress
    const kitchenProgress = useMemo(() => {
        return calculateKitchenProgress(
            chefAssignments,
            recipeData.completedIngredients || {},
            recipeData.completedSteps || {}
        );
    }, [chefAssignments, recipeData.completedIngredients, recipeData.completedSteps]);

    // Progress bar component
    const ProgressBar = ({ percentage, color = '#ff9800', height = '6px' }) => {
        return React.createElement('div', {
            style: {
                width: '100%',
                height,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '3px',
                overflow: 'hidden',
                marginTop: '0.5rem'
            }
        }, React.createElement('div', {
            style: {
                width: `${percentage}%`,
                height: '100%',
                backgroundColor: color,
                transition: 'width 0.3s ease',
                borderRadius: '3px'
            }
        }));
    };

    // Render the prep modal section
    return React.createElement('section', {
        className: 'container-fluid',
        style: { marginBottom: '2rem' }
    }, [
        React.createElement('header', {
            key: 'header',
            style: { marginBottom: '1.5rem' }
        }, [
            React.createElement('h2', {
                key: 'title',
                style: { marginBottom: '0.5rem' }
            }, 'Chef Prep Stations'),
            React.createElement('p', {
                key: 'subtitle',
                className: 'muted',
                style: { marginBottom: '1rem' }
            }, 'Click a chef to expand their prep station and access recipe work areas.')
        ]),

        // Kitchen-wide progress
        React.createElement('article', {
            key: 'kitchen-progress',
            style: {
                background: 'rgba(255, 152, 0, 0.06)',
                border: '1px solid rgba(255, 152, 0, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
                marginBottom: '1.5rem'
            }
        }, [
            React.createElement('header', {
                key: 'header',
                style: { borderBottom: '1px solid rgba(255, 152, 0, 0.2)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }
            }, [
                React.createElement('h3', {
                    key: 'title',
                    style: { margin: 0, color: '#ffffff', marginBottom: '0.25rem' }
                }, 'Kitchen Progress'),
                React.createElement('small', {
                    key: 'details',
                    style: { color: 'var(--muted-color)' }
                }, `${kitchenProgress.completedItems} of ${kitchenProgress.totalItems} items complete`)
            ]),
            React.createElement('div', {
                key: 'bar',
                style: { display: 'flex', alignItems: 'center', gap: '0.75rem' }
            }, [
                React.createElement('div', {
                    key: 'progress',
                    style: { flex: 1 }
                }, React.createElement(ProgressBar, {
                    percentage: kitchenProgress.percentage,
                    color: '#ff9800',
                    height: '8px'
                })),
                React.createElement('span', {
                    key: 'percentage',
                    style: {
                        fontWeight: 600,
                        color: '#ff9800',
                        fontSize: '0.9rem',
                        minWidth: '45px'
                    }
                }, `${kitchenProgress.percentage}%`)
            ])
        ]),

        // Chef cards grid
        React.createElement('div', {
            key: 'chef-grid',
            className: 'grid',
            style: {
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }
        }, chefSummaries.map((summary) => {
            const chefName = summary.name;
            const borderColor = resolveChefColor(summary.color || '') || '#6c63ff';
            const isExpanded = expandedChefName && expandedChefName === chefName;
            const assignment = chefAssignments?.[chefName];
            const assignedRecipes = assignment?.recipes || [];

            // Calculate this chef's progress
            const chefProgress = useMemo(() => {
                return calculateChefProgress(
                    assignedRecipes,
                    recipeData.completedIngredients || {},
                    recipeData.completedSteps || {}
                );
            }, [assignedRecipes, recipeData.completedIngredients, recipeData.completedSteps]);

            const cardChildren = [];

            // Always add header
            cardChildren.push(
                React.createElement('header', {
                    key: 'header',
                    style: {
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(255, 152, 0, 0.2)',
                        paddingBottom: '0.75rem',
                        marginBottom: '0.75rem'
                    },
                    onClick: () => setExpandedChefName(isExpanded ? null : chefName),
                    onMouseDown: (e) => e.stopPropagation()
                }, [
                    React.createElement('div', {
                        key: 'title-row',
                        style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }
                    }, [
                        React.createElement('div', {
                            key: 'text',
                            style: { flex: 1 }
                        }, [
                            React.createElement('h3', {
                                key: 'name',
                                style: {
                                    marginBottom: '0.25rem',
                                    marginTop: 0,
                                    color: '#ffffff'
                                }
                            }, summary.name),
                            React.createElement('small', {
                                key: 'stats',
                                style: { color: 'var(--muted-color)' }
                            }, `${summary.totalDishes} dish${summary.totalDishes === 1 ? '' : 'es'} • ${summary.totalOrders} order${summary.totalOrders === 1 ? '' : 's'}`)
                        ]),
                        React.createElement('span', {
                            key: 'expand',
                            style: {
                                fontSize: '1.2em',
                                color: '#ff9800',
                                transition: 'transform 0.2s ease',
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                            }
                        }, '▼')
                    ]),
                    React.createElement('div', {
                        key: 'progress-section',
                        style: { display: 'flex', alignItems: 'center', gap: '0.5rem' }
                    }, [
                        React.createElement('div', {
                            key: 'progress',
                            style: { flex: 1 }
                        }, React.createElement(ProgressBar, {
                            percentage: chefProgress.percentage,
                            color: borderColor,
                            height: '5px'
                        })),
                        React.createElement('span', {
                            key: 'percentage',
                            style: {
                                fontWeight: 600,
                                color: borderColor,
                                fontSize: '0.8rem',
                                minWidth: '35px'
                            }
                        }, `${chefProgress.percentage}%`)
                    ])
                ])
            );

            // Only add recipes section if this chef is expanded
            if (isExpanded && assignedRecipes.length > 0) {
                cardChildren.push(
                    React.createElement('div', {
                        key: 'recipes',
                        style: { marginTop: '0.75rem' }
                    }, [
                        React.createElement('p', {
                            key: 'label',
                            className: 'muted',
                            style: {
                                marginBottom: '0.75rem',
                                fontSize: '0.9rem',
                                fontWeight: 600
                            }
                        }, 'Assigned Dishes'),
                        React.createElement('div', {
                            key: 'recipe-buttons',
                            style: {
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem'
                            }
                        }, assignedRecipes.map(({ slug, recipe }) => {
                            const badgeInfo = getDishBadgeInfo(
                                slug,
                                recipeData.recipeStatus || {},
                                calculateDishStatus,
                                recipeData.completedIngredients || {},
                                recipeData.completedSteps || {},
                                recipe
                            );
                            const isRecipeOpen = selectedRecipeSlug === slug;

                            return React.createElement('button', {
                                key: slug,
                                type: 'button',
                                style: {
                                    padding: '0.6rem 0.8rem',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    border: `2px solid ${badgeInfo.color}`,
                                    borderRadius: '6px',
                                    backgroundColor: isRecipeOpen
                                        ? `${badgeInfo.color}20`
                                        : 'transparent',
                                    color: '#ffffff',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                },
                                onClick: () => setSelectedRecipeSlug(slug),
                                onMouseEnter: (e) => {
                                    e.target.style.backgroundColor = `${badgeInfo.color}30`;
                                },
                                onMouseLeave: (e) => {
                                    e.target.style.backgroundColor = isRecipeOpen
                                        ? `${badgeInfo.color}20`
                                        : 'transparent';
                                }
                            }, [
                                React.createElement('span', {
                                    key: 'name',
                                    style: { flex: 1, textAlign: 'left' }
                                }, recipe?.name || slugToDisplayName(slug)),
                                React.createElement('span', {
                                    key: 'badge',
                                    style: {
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        padding: '0.25rem 0.5rem',
                                        backgroundColor: badgeInfo.color,
                                        color: badgeInfo.color === '#10b981' || badgeInfo.color === '#f59e0b' ? '#000' : '#fff',
                                        borderRadius: '3px',
                                        whiteSpace: 'nowrap'
                                    }
                                }, badgeInfo.label)
                            ]);
                        }))
                    ])
                );
            }

            return React.createElement('article', {
                key: chefName,
                className: 'chef-summary-article',
                style: {
                    borderTop: `4px solid ${borderColor}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: isExpanded
                        ? 'rgba(255, 152, 0, 0.08)'
                        : 'rgba(255, 255, 255, 0.08)',
                    borderColor: isExpanded
                        ? borderColor
                        : 'rgba(255, 152, 0, 0.3)',
                    boxShadow: isExpanded
                        ? `0 0 12px rgba(255, 152, 0, 0.2)`
                        : 'none'
                }
            }, cardChildren);
        })),

        // When a recipe is selected, show the recipe modal
        selectedRecipeSlug && React.createElement(window.RecipeModal, {
            key: 'recipe-modal',
            selectedRecipe: selectedRecipeSlug,
            setSelectedRecipe: () => setSelectedRecipeSlug(null),
            recipes,
            orderCounts: recipeData.orderCounts || {},
            updateOrderCount: recipeData.updateOrderCount || (() => {}),
            completedIngredients: recipeData.completedIngredients || {},
            toggleIngredient: recipeData.toggleIngredient || (() => {}),
            completedSteps: recipeData.completedSteps || {},
            toggleStep: recipeData.toggleStep || (() => {}),
            recipeStatus: recipeData.recipeStatus || {},
            updateRecipeStatus: recipeData.updateRecipeStatus || (() => {}),
            recipeChefNames: recipeData.recipeChefNames || {},
            updateChefName: recipeData.updateChefName || (() => {}),
            openLightbox: recipeData.openLightbox || (() => {})
        })
    ]);
};

window.ChefPrepModal = ChefPrepModal;
