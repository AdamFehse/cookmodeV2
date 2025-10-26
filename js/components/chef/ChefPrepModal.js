/**
 * ChefPrepModal - Per-chef preparation interface
 *
 * Houses:
 * - Chef summary card with stats
 * - Recipe cards for assigned dishes
 * - Recipe modals for detailed work
 * - Ingredient consolidation
 *
 * Replaces the separate Overview and 3-Day Cycle buttons
 */

const ChefPrepModal = ({ chefSummaries = [], chefAssignments = {}, recipes = {}, recipeData = {} }) => {
    const { useState, useMemo, useRef, useEffect } = React;
    const resolveChefColor = window.resolveChefColor || ((color) => color);
    const slugToDisplayName = window.slugToDisplayName || ((slug) => slug);

    // Expanded chef selection
    const [selectedChef, setSelectedChef] = useState(null);
    const [selectedRecipeSlug, setSelectedRecipeSlug] = useState(null);

    if (!chefSummaries.length) {
        return null;
    }

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
                style: { marginBottom: '0.25rem' }
            }, 'Chef Prep Stations'),
            React.createElement('p', {
                key: 'subtitle',
                className: 'muted',
                style: { marginBottom: 0 }
            }, 'Click a chef to expand their prep station and access recipe work areas.')
        ]),

        // Chef cards grid
        React.createElement('div', {
            key: 'chef-grid',
            className: 'grid',
            style: {
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }
        }, chefSummaries.map((summary) => {
            const borderColor = resolveChefColor(summary.color || '') || '#6c63ff';
            const isSelected = selectedChef === summary.name;
            const assignment = chefAssignments?.[summary.name];
            const assignedRecipes = assignment?.recipes || [];

            return React.createElement('article', {
                key: summary.name,
                className: 'chef-summary-article',
                style: {
                    borderTop: `4px solid ${borderColor}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: isSelected
                        ? 'rgba(255, 152, 0, 0.08)'
                        : 'rgba(255, 255, 255, 0.08)',
                    borderColor: isSelected
                        ? `${borderColor}`
                        : 'rgba(255, 152, 0, 0.3)'
                }
            }, [
                React.createElement('header', {
                    key: 'header',
                    style: {
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(255, 152, 0, 0.2)'
                    },
                    onClick: () => setSelectedChef(isSelected ? null : summary.name)
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
                    }, `${summary.totalDishes} dish${summary.totalDishes === 1 ? '' : 'es'} • ${summary.totalOrders} order${summary.totalOrders === 1 ? '' : 's'}`),
                    React.createElement('span', {
                        key: 'expand',
                        style: {
                            float: 'right',
                            fontSize: '1.2em',
                            color: '#ff9800'
                        }
                    }, isSelected ? '▲' : '▼')
                ]),

                React.createElement('ul', {
                    key: 'stats-list',
                    style: {
                        listStyle: 'none',
                        padding: 0,
                        margin: '0.75rem 0',
                        color: '#e0e0e0'
                    }
                }, [
                    React.createElement('li', {
                        key: 'ingredients'
                    }, `${summary.uniqueIngredients} ingredient${summary.uniqueIngredients === 1 ? '' : 's'}`),
                    React.createElement('li', {
                        key: 'steps'
                    }, `${summary.outstandingSteps} step${summary.outstandingSteps === 1 ? '' : 's'} remaining`)
                ]),

                isSelected && assignedRecipes.length > 0 && React.createElement('div', {
                    key: 'recipes',
                    style: { marginTop: '0.75rem' }
                }, [
                    React.createElement('p', {
                        key: 'label',
                        className: 'muted',
                        style: {
                            marginBottom: '0.5rem',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }
                    }, 'Quick Access'),
                    React.createElement('div', {
                        key: 'recipe-buttons',
                        style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem'
                        }
                    }, assignedRecipes.map(({ slug, recipe }) =>
                        React.createElement('button', {
                            key: slug,
                            type: 'button',
                            className: 'outline secondary',
                            style: { padding: '0.4rem 0.6rem', fontSize: '0.9rem' },
                            onClick: () => setSelectedRecipeSlug(slug)
                        }, recipe?.name || slugToDisplayName(slug))
                    ))
                ])
            ]);
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
