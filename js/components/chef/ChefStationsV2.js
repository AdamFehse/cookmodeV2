import { calculateKitchenProgress } from '../../utils/statusCalculation.js';
import { resolveChefColor } from '../../constants/index.js';
import { RecipeCard } from '../RecipeCard.js';

/**
 * ChefStationsV2 - Simple chef cards with assigned recipes (individually collapsible)
 */
export const ChefStationsV2 = ({ chefSummaries = [], chefAssignments = {}, recipes = {}, recipeData = {} }) => {
    const { useState, useMemo } = React;
    const [collapsedChefs, setCollapsedChefs] = useState({});

    const kitchenProgress = useMemo(() =>
        calculateKitchenProgress(recipes, recipeData.completedSteps || {}),
        [recipes, recipeData.completedSteps]
    );

    return React.createElement('section', {
        className: 'chef-stations-v2'
    }, [
        React.createElement('div', {
            key: 'kitchen-progress',
            'data-kitchen-progress': true,
            className: 'kitchen-progress-container'
        }, [
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
            React.createElement('small', {
                key: 'details',
                className: 'kitchen-progress-details'
            }, `${kitchenProgress.completedItems} of ${kitchenProgress.totalItems} recipes 100% complete`)
        ]),

        React.createElement('h2', {
            key: 'title',
            className: 'chef-stations-title'
        }, `Chef Stations (${chefSummaries.length})`),

        React.createElement('div', {
            key: 'chefs-grid',
            className: 'chefs-grid'
        }, chefSummaries.map((chef) => {
            const chefName = chef.name;
            const assignment = chefAssignments?.[chefName];
            const assignedRecipes = assignment?.recipes || [];
            const borderColor = resolveChefColor(chef.color || '');
            const sanitizedChefId = (chefName || 'unassigned').toLowerCase().replace(/[^a-z0-9]+/g, '-');
            const panelId = `chef-panel-${sanitizedChefId}`;

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
                React.createElement('button', {
                    key: 'header',
                    type: 'button',
                    className: 'chef-card-header',
                    onClick: toggleChef,
                    'aria-expanded': String(!isChefCollapsed),
                    'aria-controls': panelId
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
                        'aria-hidden': 'true'
                    }, isChefCollapsed ? '>' : 'v')
                ]),

                !isChefCollapsed && assignedRecipes.length > 0 && React.createElement('div', {
                    key: 'recipes',
                    className: 'chef-recipes-grid',
                    id: panelId
                }, assignedRecipes.map(({ slug, recipe }) => {
                    const status = recipeData.recipeStatus?.[slug];
                    const orderCount = recipeData.orderCounts?.[slug] || 1;

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
                    }, React.createElement(RecipeCard, {
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
