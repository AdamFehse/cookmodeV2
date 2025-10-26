/**
 * ChefCard - Simple single chef card component
 * Displays one chef's summary with expandable recipe list
 * Completely independent - doesn't affect other cards
 */

const ChefCard = ({ summary = {}, assignment = {}, isExpanded, onToggle, recipes = {}, recipeData = {}, onSelectRecipe }) => {
    const { useState } = React;
    const resolveChefColor = window.resolveChefColor || ((color) => color);
    const slugToDisplayName = window.slugToDisplayName || ((slug) => slug);
    const calculateDishStatus = window.calculateDishStatus || (() => ({}));

    const chefName = summary.name || '';
    const borderColor = resolveChefColor(summary.color || '') || '#6c63ff';
    const assignedRecipes = assignment?.recipes || [];

    // Helper to get badge info
    const getDishBadgeInfo = (slug) => {
        const explicitStatus = recipeData.recipeStatus?.[slug];
        if (explicitStatus) {
            const statusMap = {
                'in-progress': { label: 'In Progress', color: '#eab308' },
                'complete': { label: 'Complete', color: '#10b981' },
                'plated': { label: 'Plated', color: '#f59e0b' },
                'packed': { label: 'Packed', color: '#8b5cf6' }
            };
            return statusMap[explicitStatus] || { label: 'Unknown', color: '#6b7280' };
        }

        const recipe = recipes[slug];
        const dishStatus = calculateDishStatus(slug, recipe, recipeData.completedIngredients || {}, recipeData.completedSteps || {});
        return {
            label: dishStatus.label,
            color: dishStatus.color
        };
    };

    // Build the children array
    const articleChildren = [
        // Header - clickable to expand/collapse
        React.createElement('header', {
            key: 'header',
            style: {
                cursor: 'pointer',
                borderBottom: '1px solid rgba(255, 152, 0, 0.2)',
                paddingBottom: '0.75rem',
                marginBottom: '0.75rem'
            },
            onClick: onToggle
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
                    }, chefName),
                    React.createElement('small', {
                        key: 'stats',
                        style: { color: 'var(--muted-color)' }
                    }, `${summary.totalDishes || 0} dish${summary.totalDishes === 1 ? '' : 'es'} • ${summary.totalOrders || 0} order${summary.totalOrders === 1 ? '' : 's'}`)
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
                }, React.createElement('div', {
                    style: {
                        width: '100%',
                        height: '5px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                        marginTop: '0.5rem'
                    }
                }, React.createElement('div', {
                    style: {
                        width: `${summary.progressPercentage || 0}%`,
                        height: '100%',
                        backgroundColor: borderColor,
                        transition: 'width 0.3s ease',
                        borderRadius: '3px'
                    }
                }))),
                React.createElement('span', {
                    key: 'percentage',
                    style: {
                        fontWeight: 600,
                        color: borderColor,
                        fontSize: '0.8rem',
                        minWidth: '35px'
                    }
                }, `${summary.progressPercentage || 0}%`)
            ])
        ])
    ];

    // Add expanded content only if expanded and has recipes
    if (isExpanded && assignedRecipes.length > 0) {
        articleChildren.push(
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
                    const badgeInfo = getDishBadgeInfo(slug);

                    return React.createElement('button', {
                        key: slug,
                        type: 'button',
                        style: {
                            padding: '0.6rem 0.8rem',
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            border: `2px solid ${badgeInfo.color}`,
                            borderRadius: '6px',
                            backgroundColor: 'transparent',
                            color: '#ffffff',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '0.5rem'
                        },
                        onClick: () => onSelectRecipe && onSelectRecipe(slug),
                        onMouseEnter: (e) => {
                            e.target.style.backgroundColor = `${badgeInfo.color}20`;
                        },
                        onMouseLeave: (e) => {
                            e.target.style.backgroundColor = 'transparent';
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
        className: 'chef-summary-article',
        style: {
            borderTop: `4px solid ${borderColor}`,
            transition: 'all 0.2s ease',
            background: isExpanded
                ? 'rgba(255, 152, 0, 0.08)'
                : 'rgba(255, 255, 255, 0.08)',
            boxShadow: isExpanded
                ? `0 0 12px rgba(255, 152, 0, 0.2)`
                : 'none'
        }
    }, articleChildren);
};

window.ChefCard = ChefCard;
