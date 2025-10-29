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
            className: 'kitchen-progress-container'
        }, [
            // Kitchen header
            React.createElement('div', {
                key: 'header',
                className: 'kitchen-progress-header'
            }, [
                React.createElement('h3', {
                    key: 'title',
                    className: 'kitchen-progress-title'
                }, 'Kitchen Progress'),
                React.createElement('span', {
                    key: 'percentage',
                    'data-kitchen-percentage': true,
                    className: 'kitchen-progress-percentage'
                }, `${kitchenProgress.percentage}%`)
            ]),
            // Progress bar
            React.createElement('div', {
                key: 'bar-container',
                className: 'kitchen-progress-bar-container'
            }, React.createElement('div', {
                key: 'fill',
                'data-kitchen-progress-fill': true,
                className: 'kitchen-progress-bar-fill',
                style: {
                    width: `${kitchenProgress.percentage}%`
                }
            })),
            // Details
            React.createElement('small', {
                key: 'details',
                className: 'kitchen-progress-details'
            }, `${kitchenProgress.completedItems} of ${kitchenProgress.totalItems} recipes 100% complete`)
        ]),

        // Title
        React.createElement('h2', {
            key: 'title',
            className: 'chef-stations-title'
        }, `Chef Stations (${chefSummaries.length})`),

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
                    boxShadow: `0 0 20px ${borderColor}40`
                }
            }, [
                // Chef name header (clickable)
                React.createElement('div', {
                    key: 'header',
                    className: 'chef-card-header',
                    onClick: toggleChef
                }, [
                    React.createElement('h3', {
                        key: 'name',
                        className: 'chef-card-name',
                        style: {
                            color: borderColor,
                            textShadow: `0 0 8px ${borderColor}40`
                        }
                    }, chefName),
                    React.createElement('span', {
                        key: 'toggle',
                        className: 'chef-card-toggle',
                        style: {
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
