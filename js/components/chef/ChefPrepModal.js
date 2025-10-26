/**
 * ChefPrepModal - Per-chef preparation interface with progress tracking
 *
 * Houses:
 * - Kitchen-wide progress bar
 * - Individual chef cards
 * - Recipe cards with status indicators and badges
 * - Recipe modals for detailed work
 * - Integrated progress tracking
 *
 * Replaces the separate Overview and 3-Day Cycle buttons
 */

const ChefPrepModal = ({ chefSummaries = [], chefAssignments = {}, recipes = {}, recipeData = {} }) => {
    const { useState, useMemo } = React;
    const calculateKitchenProgress = window.calculateKitchenProgress || (() => ({}));

    // Track which chef is expanded
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

    // Build the children array with conditional recipe modal
    const children = [
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

        // Chef cards grid - using individual ChefCard component
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
            const isExpanded = expandedChefName === chefName;
            const assignment = chefAssignments?.[chefName];

            return React.createElement(window.ChefCard, {
                key: chefName,
                summary,
                assignment,
                isExpanded,
                onToggle: () => setExpandedChefName(isExpanded ? null : chefName),
                recipes,
                recipeData,
                onSelectRecipe: setSelectedRecipeSlug
            });
        }))
    ];

    // Add recipe modal if a recipe is selected
    if (selectedRecipeSlug) {
        children.push(React.createElement(window.RecipeModal, {
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
        }));
    }

    // Render the prep modal section
    return React.createElement('section', {
        className: 'container-fluid',
        style: { marginBottom: '2rem' }
    }, children);
};

window.ChefPrepModal = ChefPrepModal;
