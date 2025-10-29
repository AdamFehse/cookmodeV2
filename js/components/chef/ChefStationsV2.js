/**
 * ChefStationsV2 - Simple chef cards with assigned recipes (individually collapsible)
 */
const ChefStationsV2 = ({ chefSummaries = [], chefAssignments = {}, recipes = {}, recipeData = {} }) => {
    const { useState, useMemo } = React;
    const [collapsedChefs, setCollapsedChefs] = useState({});
    const calculateKitchenProgress = window.calculateKitchenProgress || (() => ({ percentage: 0, completedItems: 0, totalItems: 0 }));

    // Calculate kitchen progress
    const kitchenProgress = useMemo(() =>
        calculateKitchenProgress(recipes, recipeData.completedSteps || {}),
        [recipes, recipeData.completedSteps]
    );

    return React.createElement('section', {
        className: 'chef-stations-v2'
    }, [
        // Kitchen Progress Bar
        React.createElement('div', {
            key: 'kitchen-progress',
            'data-kitchen-progress': true,
            className: 'kitchen-progress-container',
            style: {
                marginBottom: '1.5rem',
                padding: '1rem',
                background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.08), rgba(255, 0, 110, 0.05))',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                borderRadius: 'var(--radius-lg)'
            }
        }, [
            // Kitchen header
            React.createElement('div', {
                key: 'header',
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem'
                }
            }, [
                React.createElement('h3', {
                    key: 'title',
                    style: {
                        margin: 0,
                        fontSize: '1rem',
                        fontWeight: '700',
                        background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }
                }, '🍳 Kitchen Progress'),
                React.createElement('span', {
                    key: 'percentage',
                    'data-kitchen-percentage': true,
                    style: {
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: 'var(--color-primary)',
                        textShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
                    }
                }, `${kitchenProgress.percentage}%`)
            ]),
            // Progress bar
            React.createElement('div', {
                key: 'bar-container',
                style: {
                    width: '100%',
                    height: '10px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    marginBottom: '0.5rem',
                    border: '1px solid rgba(0, 217, 255, 0.2)'
                }
            }, React.createElement('div', {
                key: 'fill',
                'data-kitchen-progress-fill': true,
                style: {
                    width: `${kitchenProgress.percentage}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                    transition: 'width 0.3s ease',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 0 15px rgba(0, 217, 255, 0.6)'
                }
            })),
            // Details
            React.createElement('small', {
                key: 'details',
                style: {
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem'
                }
            }, `${kitchenProgress.completedItems} of ${kitchenProgress.totalItems} recipes 100% complete`)
        ]),

        // Title
        React.createElement('h2', {
            key: 'title',
            style: {
                marginBottom: '1rem',
                fontSize: '1.25rem',
                fontWeight: '700'
            }
        }, `👨‍🍳 Chef Stations (${chefSummaries.length})`),

        // Chef Cards
        React.createElement('div', {
            key: 'chefs-grid',
            className: 'chefs-grid'
        }, chefSummaries.map((chef) => {
            const chefName = chef.name;
            const assignment = chefAssignments?.[chefName];
            const assignedRecipes = assignment?.recipes || [];
            const borderColor = window.resolveChefColor?.(chef.color || '') || '#6c63ff';

            const isChefCollapsed = collapsedChefs[chefName];
            const toggleChef = () => {
                setCollapsedChefs(prev => ({
                    ...prev,
                    [chefName]: !prev[chefName]
                }));
            };

            return React.createElement('article', {
                key: chefName,
                'data-chef': chefName,
                className: 'chef-card',
                style: {
                    borderColor: borderColor,
                    boxShadow: `0 0 20px ${borderColor}40`,
                    background: 'rgba(255, 255, 255, 0.04)'
                }
            }, [
                // Chef name header (clickable)
                React.createElement('div', {
                    key: 'header',
                    className: 'chef-card-header',
                    onClick: toggleChef,
                    style: { cursor: 'pointer' }
                }, [
                    React.createElement('h3', {
                        key: 'name',
                        className: 'chef-card-name',
                        style: {
                            color: borderColor,
                            textShadow: `0 0 8px ${borderColor}40`,
                            margin: 0,
                            flex: 1
                        }
                    }, chefName),
                    React.createElement('span', {
                        key: 'toggle',
                        style: {
                            fontSize: '1.2rem',
                            transition: 'transform 0.3s ease',
                            transform: isChefCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)'
                        }
                    }, '▼')
                ]),

                // Recipe cards (hidden when collapsed)
                !isChefCollapsed && assignedRecipes.length > 0 && React.createElement('div', {
                    key: 'recipes',
                    className: 'chef-recipes-grid'
                }, assignedRecipes.map(({ slug, recipe }) => {
                    const status = recipeData.recipeStatus?.[slug];
                    const orderCount = recipeData.orderCounts?.[slug] || 1;

                    // Calculate recipe progress
                    let totalSteps = 0;
                    let completedStepsCount = 0;
                    if (recipe?.instructions) {
                        totalSteps = recipe.instructions.length;
                        recipe.instructions.forEach((_, index) => {
                            const key = `${slug}-step-${index}`;
                            if (recipeData.completedSteps?.[key]) {
                                completedStepsCount += 1;
                            }
                        });
                    }
                    const progress = totalSteps > 0 ? Math.round((completedStepsCount / totalSteps) * 100) : 0;

                    return React.createElement('div', {
                        key: slug,
                        'data-recipe-card': true,
                        'data-slug': slug,
                        className: 'chef-recipe-card-wrapper',
                        onClick: () => recipeData.setSelectedRecipe?.(slug)
                    }, React.createElement(window.RecipeCard, {
                        key: 'card',
                        slug,
                        recipe,
                        size: 'compact',
                        status,
                        chefName: null,
                        orderCount,
                        progress,
                        onClick: () => recipeData.setSelectedRecipe?.(slug),
                        clickable: true,
                        showBadges: true,
                        showImage: true
                    }));
                }))
            ]);
        }))
    ]);
};

window.ChefStationsV2 = ChefStationsV2;
