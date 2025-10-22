const ChefPrepSummary = ({ chefSummaries = [], onSelectChef }) => {
    const { useMemo } = React;

    const resolveChefColor = window.resolveChefColor || ((color) => color);

    const cards = useMemo(() => {
        return chefSummaries.map((summary) => {
            const borderColor = resolveChefColor(summary.color || '') || '#6c63ff';
            const headerStyle = {
                borderTop: `4px solid ${borderColor}`
            };

            return React.createElement('article', { key: summary.name, style: headerStyle }, [
                React.createElement('header', { key: 'header' }, [
                    React.createElement('h3', { key: 'title', style: { marginBottom: '0.25rem' } }, summary.name),
                    React.createElement('small', { key: 'subtitle', style: { color: 'var(--muted-color)' } },
                        `${summary.totalDishes} dish${summary.totalDishes === 1 ? '' : 'es'} • ${summary.totalOrders} order${summary.totalOrders === 1 ? '' : 's'}`
                    )
                ]),
                React.createElement('ul', {
                    key: 'stats',
                    className: 'chef-summary-stats',
                    style: {
                        listStyle: 'none',
                        padding: 0,
                        margin: '0 0 0.75rem 0'
                    }
                }, [
                    React.createElement('li', { key: 'ingredients' },
                        `${summary.uniqueIngredients} ingredient${summary.uniqueIngredients === 1 ? '' : 's'}`
                    ),
                    React.createElement('li', { key: 'steps' },
                        `${summary.outstandingSteps} step${summary.outstandingSteps === 1 ? '' : 's'} remaining`
                    )
                ]),
                onSelectChef && React.createElement('footer', { key: 'footer' }, [
                    React.createElement('button', {
                        type: 'button',
                        className: 'secondary',
                        onClick: () => onSelectChef(summary.name)
                    }, 'View Ingredients')
                ])
            ]);
        });
    }, [chefSummaries, onSelectChef]);

    if (!cards.length) return null;

    return React.createElement('section', {
        className: 'container-fluid',
        style: { marginBottom: '1rem' }
    }, [
        React.createElement('header', { key: 'header', style: { marginBottom: '0.75rem' } }, [
            React.createElement('h2', { key: 'title', style: { marginBottom: '0.25rem' } }, 'Today’s Prep Summary'),
            React.createElement('p', { key: 'subtitle', className: 'muted' },
                'Quick view of each chef’s dishes, ingredients, and outstanding steps.'
            )
        ]),
        React.createElement('div', {
            key: 'grid',
            className: 'grid',
            style: {
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem'
            }
        }, cards)
    ]);
};

window.ChefPrepSummary = ChefPrepSummary;
