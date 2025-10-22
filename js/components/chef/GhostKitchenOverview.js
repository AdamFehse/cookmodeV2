const getLoadLevel = (summary) => {
    const orders = summary.totalOrders || 0;
    const outstanding = summary.outstandingSteps || 0;
    const loadScore = orders * 2 + outstanding;

    if (loadScore >= 12) return 'high';
    if (loadScore >= 6) return 'medium';
    return 'low';
};

const loadStyles = {
    low: {
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), transparent)',
        borderColor: 'rgba(16, 185, 129, 0.35)'
    },
    medium: {
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.18), transparent)',
        borderColor: 'rgba(245, 158, 11, 0.35)'
    },
    high: {
        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), transparent)',
        borderColor: 'rgba(239, 68, 68, 0.45)'
    }
};

const laneConfig = [
    { key: 'prep', title: 'Prep', description: 'Ingredients checked, not yet cooking.' },
    { key: 'cooking', title: 'Cooking', description: 'Actively on the burners or in ovens.' },
    { key: 'plating', title: 'Plating', description: 'Assemblies happening now.' },
    { key: 'ready', title: 'Ready', description: 'Boxed and waiting for pickup.' }
];

const statusToLane = (status) => {
    if (!status) return 'prep';

    switch (status) {
        case 'gathered':
            return 'cooking';
        case 'complete':
            return 'cooking';
        case 'plated':
            return 'plating';
        case 'packed':
            return 'ready';
        default:
            return 'prep';
    }
};

const buildLaneAssignments = (recipes, recipeStatus, recipeChefNames, orderCounts) => {
    const slugToDisplayName = window.slugToDisplayName;
    const resolveChefColor = window.resolveChefColor || ((color) => color);

    return Object.entries(recipes || {}).reduce((acc, [slug, recipe]) => {
        const status = recipeStatus?.[slug];
        const laneKey = statusToLane(status);
        const chefMeta = recipeChefNames?.[slug] || {};
        const orderCount = orderCounts?.[slug] || 1;
        const displayName = recipe.name || slugToDisplayName(slug);

        if (!acc[laneKey]) {
            acc[laneKey] = [];
        }

        acc[laneKey].push({
            slug,
            name: displayName,
            status,
            orderCount,
            chefName: chefMeta.name || '',
            chefColor: resolveChefColor(chefMeta.color || ''),
            category: recipe.category || ''
        });

        return acc;
    }, {});
};

const LaneColumn = ({ lane, assignments, onSelectRecipe }) => {
    return React.createElement('article', {
        key: lane.key,
        className: 'lane-column',
        style: {
            minHeight: '280px',
            borderTop: '4px solid var(--pico-muted-border-color)'
        }
    }, [
        React.createElement('header', { key: 'header' }, [
            React.createElement('h3', { key: 'title' }, lane.title),
            React.createElement('small', { key: 'desc', className: 'muted' }, lane.description)
        ]),
        assignments.length === 0
            ? React.createElement('p', { key: 'empty', className: 'muted' }, 'No dishes here right now.')
            : React.createElement('ul', {
                key: 'list',
                style: {
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'grid',
                    gap: '0.5rem'
                }
            }, assignments.map((item) => React.createElement('li', {
                key: item.slug
            }, React.createElement('button', {
                type: 'button',
                className: 'secondary',
                style: {
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.25rem',
                    backgroundColor: 'var(--pico-card-background-color)',
                    borderColor: 'var(--pico-muted-border-color)'
                },
                onClick: () => onSelectRecipe?.(item.slug)
            }, [
                React.createElement('strong', { key: 'name' }, item.name),
                React.createElement('span', { key: 'meta', style: { fontSize: '0.85rem', color: 'var(--muted-color)' } },
                    [
                        item.chefName && `Chef ${item.chefName}`,
                        item.orderCount > 1 && `${item.orderCount}x`
                    ].filter(Boolean).join(' • ') || 'Unassigned'
                )
            ]))))
    ]);
};

const ChefWorkloadRow = ({ summary, onSelectChef }) => {
    const loadLevel = getLoadLevel(summary);
    const styles = loadStyles[loadLevel] || loadStyles.low;

    return React.createElement('article', {
        key: summary.name,
        style: {
            borderTop: `4px solid ${summary.color || '#6c63ff'}`,
            backgroundImage: styles.background,
            borderColor: styles.borderColor
        }
    }, [
        React.createElement('header', { key: 'header', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } }, [
            React.createElement('h3', { key: 'title' }, summary.name),
            React.createElement('span', {
                key: 'load',
                className: `tag ${loadLevel === 'high' ? 'contrast' : loadLevel === 'medium' ? 'warning' : 'secondary'}`
            }, loadLevel.toUpperCase())
        ]),
        React.createElement('ul', {
            key: 'stats',
            style: {
                listStyle: 'none',
                padding: 0,
                margin: '0 0 0.5rem 0',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '0.25rem'
            }
        }, [
            React.createElement('li', { key: 'orders' }, `${summary.totalOrders} order${summary.totalOrders === 1 ? '' : 's'}`),
            React.createElement('li', { key: 'dishes' }, `${summary.totalDishes} dish${summary.totalDishes === 1 ? '' : 'es'}`),
            React.createElement('li', { key: 'ingredients' }, `${summary.uniqueIngredients} ingredient${summary.uniqueIngredients === 1 ? '' : 's'}`),
            React.createElement('li', { key: 'steps' }, `${summary.outstandingSteps} step${summary.outstandingSteps === 1 ? '' : 's'} left`)
        ]),
        onSelectChef && React.createElement('footer', { key: 'footer' }, [
            React.createElement('button', {
                type: 'button',
                className: 'outline',
                onClick: () => onSelectChef(summary.name)
            }, 'Open ingredient rollup')
        ])
    ]);
};

const GhostKitchenOverview = ({
    recipes,
    recipeStatus,
    recipeChefNames,
    orderCounts,
    chefSummaries = [],
    onSelectRecipe,
    onSelectChef
}) => {
    const { useMemo } = React;

    const lanes = useMemo(() => {
        const assignments = buildLaneAssignments(recipes, recipeStatus, recipeChefNames, orderCounts);
        return laneConfig.map((lane) => ({
            ...lane,
            items: (assignments[lane.key] || []).sort((a, b) => a.name.localeCompare(b.name))
        }));
    }, [recipes, recipeStatus, recipeChefNames, orderCounts]);

    return React.createElement('section', {
        className: 'container-fluid',
        style: { marginTop: '1rem' }
    }, [
        React.createElement('header', { key: 'header', style: { marginBottom: '1rem' } }, [
            React.createElement('h2', { key: 'title' }, 'Kitchen Overview'),
            React.createElement('p', { key: 'subtitle', className: 'muted' },
                'Snapshot of chef workloads and where dishes sit in the pipeline.'
            )
        ]),
        chefSummaries.length > 0 && React.createElement('div', {
            key: 'chefs',
            className: 'grid',
            style: {
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
            }
        }, chefSummaries.map((summary) =>
            React.createElement(ChefWorkloadRow, { key: summary.name, summary, onSelectChef })
        )),
        React.createElement('div', {
            key: 'lanes',
            className: 'grid',
            style: {
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem'
            }
        }, lanes.map((lane) =>
            React.createElement(LaneColumn, {
                key: lane.key,
                lane,
                assignments: lane.items,
                onSelectRecipe
            })
        ))
    ]);
};

window.GhostKitchenOverview = GhostKitchenOverview;
