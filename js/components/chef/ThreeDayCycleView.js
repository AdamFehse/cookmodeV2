const ChefChip = ({ chef, color, totalOrders, onSelectChef }) => {
    const label = chef === 'Unassigned' ? 'Unassigned' : `Chef ${chef}`;

    return React.createElement('button', {
        type: 'button',
        className: 'secondary outline',
        style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.5rem',
            width: '100%',
            backgroundColor: 'transparent',
            borderColor: color ? color : 'var(--pico-muted-border-color)',
            color: 'var(--pico-color)'
        },
        onClick: () => onSelectChef?.(chef),
        disabled: chef === 'Unassigned'
    }, [
        React.createElement('span', {
            key: 'dot',
            style: {
                width: '0.75rem',
                height: '0.75rem',
                borderRadius: '999px',
                backgroundColor: color || 'var(--pico-muted-border-color)'
            }
        }),
        React.createElement('span', { key: 'label', style: { flex: 1, textAlign: 'left' } }, label),
        React.createElement('span', { key: 'count', className: 'muted' }, `${totalOrders}×`)
    ]);
};

const ThreeDayColumn = ({ bucket, onSelectRecipe, onSelectChef }) => {
    return React.createElement('article', {
        key: bucket.key,
        style: {
            borderTop: '4px solid var(--pico-muted-border-color)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
        }
    }, [
        React.createElement('header', { key: 'header' }, [
            React.createElement('h3', { key: 'title' }, bucket.label),
            React.createElement('small', { key: 'count', className: 'muted' },
                `${bucket.totalOrders} order${bucket.totalOrders === 1 ? '' : 's'} scheduled`
            )
        ]),
        bucket.chefBreakdown.length > 0 && React.createElement('div', {
            key: 'chefs',
            style: {
                display: 'grid',
                gap: '0.5rem'
            }
        }, bucket.chefBreakdown.map((entry) =>
            React.createElement(ChefChip, {
                key: entry.chef,
                chef: entry.chef,
                color: entry.color,
                totalOrders: entry.totalOrders,
                onSelectChef
            })
        )),
        React.createElement('div', { key: 'recipes', style: { display: 'grid', gap: '0.5rem' } },
            bucket.recipes.length === 0
                ? React.createElement('p', { key: 'empty', className: 'muted' }, 'Nothing queued here yet.')
                : bucket.recipes.map((recipe) =>
                    React.createElement('button', {
                        key: recipe.slug,
                        type: 'button',
                        className: 'secondary',
                        style: {
                            textAlign: 'left',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            gap: '0.25rem'
                        },
                        onClick: () => onSelectRecipe?.(recipe.slug)
                    }, [
                        React.createElement('strong', { key: 'name' }, recipe.name),
                        React.createElement('span', { key: 'meta', className: 'muted' },
                            [
                                recipe.chefName && `Chef ${recipe.chefName}`,
                                recipe.orderCount > 1 && `${recipe.orderCount}×`,
                                recipe.status && recipe.status.toUpperCase()
                            ].filter(Boolean).join(' • ')
                        )
                    ])
                )
        )
    ]);
};

const ThreeDayCycleView = ({ cycleData = [], onSelectRecipe, onSelectChef }) => {
    if (!cycleData.length) return null;

    return React.createElement('section', {
        className: 'container-fluid',
        style: { marginTop: '1.5rem' }
    }, [
        React.createElement('header', { key: 'header', style: { marginBottom: '1rem' } }, [
            React.createElement('h2', { key: 'title' }, 'Three-Day Production Cycle'),
            React.createElement('p', { key: 'subtitle', className: 'muted' },
                'Assign on Sunday, prep on Monday, and deliver Tuesday — track each stage here.'
            )
        ]),
        React.createElement('div', {
            key: 'grid',
            className: 'grid',
            style: {
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '1rem'
            }
        }, cycleData.map((bucket) =>
            React.createElement(ThreeDayColumn, {
                key: bucket.key,
                bucket,
                onSelectRecipe,
                onSelectChef
            })
        ))
    ]);
};

window.ThreeDayCycleView = ThreeDayCycleView;
