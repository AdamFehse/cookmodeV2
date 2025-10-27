/**
 * ChefStationsV2 - Refactored chef stations with compact cards
 * Kitchen progress bar + individual chef progress bars
 * Uses RecipeCard component for consistency
 */
const ChefStationsV2 = ({ chefSummaries = [], chefAssignments = {}, recipes = {}, recipeData = {} }) => {
    const { useRef, useEffect } = React;
    const slugToDisplayName = window.slugToDisplayName || ((slug) => slug);
    const calculateKitchenProgress = window.calculateKitchenProgress || (() => ({ percentage: 0, completedItems: 0, totalItems: 0 }));

    // Calculate kitchen-wide progress
    const kitchenProgress = calculateKitchenProgress(
        recipes,
        recipeData.completedSteps || {}
    );

    // Calculate progress per chef
    const getChefProgress = (chefName) => {
        const assignment = chefAssignments[chefName];
        const recipeList = assignment?.recipes || [];
        let totalSteps = 0;
        let completedSteps = 0;

        recipeList.forEach(({ slug }) => {
            const recipe = assignment.recipes.find(r => r.slug === slug)?.recipe;
            if (recipe?.instructions) {
                const instructions = recipe.instructions || [];
                totalSteps += instructions.length;

                instructions.forEach((_, index) => {
                    const generateStepKey = window.generateStepKey || (() => `${slug}-step-${index}`);
                    const key = generateStepKey(slug, index);
                    if (recipeData.completedSteps?.[key]) {
                        completedSteps += 1;
                    }
                });
            }
        });

        const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
        return { percentage, completedSteps, totalSteps };
    };

    const containerRef = useRef(null);
    useEffect(() => {
        if (!containerRef.current) return;

        // Update kitchen progress bar
        const kitchenBar = containerRef.current.querySelector('[data-kitchen-progress]');
        if (kitchenBar) {
            const fillBar = kitchenBar.querySelector('[data-fill]');
            if (fillBar) {
                fillBar.style.width = `${kitchenProgress.percentage}%`;
            }
            const percentage = kitchenBar.querySelector('[data-kitchen-percentage]');
            if (percentage) {
                percentage.textContent = `${kitchenProgress.percentage}%`;
            }
        }

        // Update chef progress bars and cards
        chefSummaries.forEach(chef => {
            const chefName = chef.name;
            const progress = getChefProgress(chefName);
            const chefCard = containerRef.current.querySelector(`[data-chef="${chefName}"]`);
            if (chefCard) {
                const fillBar = chefCard.querySelector('[data-chef-progress-fill]');
                if (fillBar) {
                    fillBar.style.width = `${progress.percentage}%`;
                }
                const percentage = chefCard.querySelector('[data-chef-percentage]');
                if (percentage) {
                    percentage.textContent = `${progress.percentage}%`;
                }
                const details = chefCard.querySelector('[data-chef-details]');
                if (details) {
                    details.textContent = `${progress.completedSteps} of ${progress.totalSteps} steps`;
                }

                // Update recipe cards in this chef's section
                const recipeCards = chefCard.querySelectorAll('[data-recipe-card]');
                recipeCards.forEach(card => {
                    const slug = card.getAttribute('data-slug');
                    if (!slug) return;

                    const recipe = Object.values(chefAssignments).flatMap(a => a.recipes || []).find(r => r.slug === slug)?.recipe;
                    if (!recipe) return;

                    // Calculate recipe completion
                    let totalSteps = 0;
                    let completedStepsCount = 0;
                    if (recipe.instructions) {
                        totalSteps = recipe.instructions.length;
                        recipe.instructions.forEach((_, index) => {
                            const generateStepKey = window.generateStepKey || (() => `${slug}-step-${index}`);
                            const key = generateStepKey(slug, index);
                            if (recipeData.completedSteps?.[key]) {
                                completedStepsCount += 1;
                            }
                        });
                    }
                    const completion = totalSteps > 0 ? Math.round((completedStepsCount / totalSteps) * 100) : 0;

                    // Update card progress display
                    const progressText = card.querySelector('[data-progress-text]');
                    if (progressText) {
                        if (completion > 0) {
                            progressText.textContent = `${completion}% done`;
                            progressText.style.display = 'block';
                        } else {
                            progressText.style.display = 'none';
                        }
                    }
                });
            }
        });
    }, [recipeData.completedSteps, recipeData.recipeStatus, chefAssignments]);

    return React.createElement('section', {
        className: 'chef-stations-v2',
        ref: containerRef
    }, [
        // Kitchen Progress Bar
        React.createElement('div', {
            key: 'kitchen-progress',
            'data-kitchen-progress': true,
            className: 'kitchen-progress-bar',
            style: {
                marginBottom: '2rem',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, rgba(0, 217, 255, 0.08), rgba(255, 0, 110, 0.05))',
                border: '1px solid rgba(0, 217, 255, 0.3)',
                borderRadius: 'var(--radius-lg)'
            }
        }, [
            React.createElement('div', {
                key: 'header',
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                }
            }, [
                React.createElement('h3', {
                    key: 'title',
                    style: {
                        margin: 0,
                        fontSize: '1.25rem',
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
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: 'var(--color-primary)',
                        textShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
                    }
                }, `${kitchenProgress.percentage}%`)
            ]),
            React.createElement('div', {
                key: 'bar-container',
                style: {
                    width: '100%',
                    height: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    marginBottom: '0.75rem',
                    border: '1px solid rgba(0, 217, 255, 0.2)'
                }
            }, React.createElement('div', {
                'data-fill': true,
                style: {
                    width: `${kitchenProgress.percentage}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                    transition: 'width 0.3s ease',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 0 15px rgba(0, 217, 255, 0.6)'
                }
            })),
            React.createElement('small', {
                key: 'details',
                style: { color: 'var(--text-muted)', fontSize: '0.85rem' }
            }, `${kitchenProgress.completedItems} of ${kitchenProgress.totalItems} items 100% complete`)
        ]),

        // Chef Summary Title
        React.createElement('h2', {
            key: 'chefs-title',
            style: {
                marginBottom: '1.5rem',
                fontSize: '1.25rem',
                fontWeight: '700'
            }
        }, `👨‍🍳 Chef Stations (${chefSummaries.length})`),

        // Chef Cards Grid
        React.createElement('div', {
            key: 'chefs-grid',
            className: 'chefs-grid',
            style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 400px), 1fr))',
                gap: '1.5rem'
            }
        }, chefSummaries.map((chef) => {
            const chefName = chef.name;
            const assignment = chefAssignments?.[chefName];
            const assignedRecipes = assignment?.recipes || [];
            const chefProgress = getChefProgress(chefName);
            const borderColor = window.resolveChefColor?.(chef.color || '') || '#6c63ff';

            return React.createElement('article', {
                key: chefName,
                'data-chef': chefName,
                className: 'chef-card',
                style: {
                    padding: '1.5rem',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: `2px solid ${borderColor}`,
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: `0 0 20px ${borderColor}40`
                }
            }, [
                // Chef header
                React.createElement('div', {
                    key: 'header',
                    style: {
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '1rem'
                    }
                }, [
                    React.createElement('div', {
                        key: 'info',
                    }, [
                        React.createElement('h3', {
                            key: 'name',
                            style: {
                                margin: 0,
                                color: borderColor,
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                textShadow: `0 0 8px ${borderColor}40`
                            }
                        }, chefName),
                        React.createElement('p', {
                            key: 'stats',
                            style: {
                                margin: '0.5rem 0 0 0',
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)'
                            }
                        }, `${chef.totalDishes || 0} dishes • ${chef.totalOrders || 0} orders`)
                    ]),
                    React.createElement('span', {
                        key: 'percentage',
                        'data-chef-percentage': true,
                        style: {
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: borderColor,
                            textShadow: `0 0 8px ${borderColor}60`
                        }
                    }, `${chefProgress.percentage}%`)
                ]),

                // Chef progress bar
                React.createElement('div', {
                    key: 'progress',
                    style: {
                        width: '100%',
                        height: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        marginBottom: '0.75rem',
                        border: `1px solid ${borderColor}40`
                    }
                }, React.createElement('div', {
                    'data-chef-progress-fill': true,
                    style: {
                        width: `${chefProgress.percentage}%`,
                        height: '100%',
                        background: borderColor,
                        transition: 'width 0.3s ease',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: `0 0 10px ${borderColor}`
                    }
                })),

                React.createElement('small', {
                    key: 'details',
                    'data-chef-details': true,
                    style: { color: 'var(--text-muted)', fontSize: '0.8rem', display: 'block', marginBottom: '1rem' }
                }, `${chefProgress.completedSteps} of ${chefProgress.totalSteps} steps`),

                // Recipe cards for this chef
                assignedRecipes.length > 0 && React.createElement('div', {
                    key: 'recipes',
                    className: 'chef-recipes-grid',
                    style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 150px), 1fr))',
                        gap: '0.75rem'
                    }
                }, assignedRecipes.map(({ slug, recipe }) => {
                    const status = recipeData.recipeStatus?.[slug];
                    const orderCount = recipeData.orderCounts?.[slug] || 1;

                    // Calculate recipe progress
                    let totalSteps = 0;
                    let completedStepsCount = 0;
                    if (recipe?.instructions) {
                        totalSteps = recipe.instructions.length;
                        recipe.instructions.forEach((_, index) => {
                            const generateStepKey = window.generateStepKey || (() => `${slug}-step-${index}`);
                            const key = generateStepKey(slug, index);
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
                        onClick: () => recipeData.setSelectedRecipe?.(slug),
                        style: { cursor: 'pointer' }
                    }, [
                        React.createElement(window.RecipeCard, {
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
                        }),
                        React.createElement('div', {
                            key: 'progress-text',
                            'data-progress-text': true,
                            style: {
                                fontSize: '0.65rem',
                                color: 'var(--status-complete)',
                                fontWeight: '600',
                                paddingTop: '0.4rem'
                            }
                        }, progress > 0 ? `${progress}% done` : '')
                    ]);
                }))
            ]);
        }))
    ]);
};

window.ChefStationsV2 = ChefStationsV2;
