const ChefPrepSummary = ({ chefSummaries = [], chefAssignments = {}, onSelectChef }) => {

    const { useMemo, useState } = React;
    const resolveChefColor = window.resolveChefColor || ((color) => color);

    // Example priorities logic: flag dishes with >8 steps or >12 ingredients
    const priorities = chefSummaries
        .filter(s => s.outstandingSteps > 8 || s.uniqueIngredients > 12)
        .map(s => `${s.name}: ${s.outstandingSteps} steps, ${s.uniqueIngredients} ingredients`);

    // Track expanded chef cards
    const [expandedChef, setExpandedChef] = useState(null);

    // Track prep modal
    const [prepChef, setPrepChef] = useState(null);

    // Expandable chef cards
    const cards = useMemo(() => {
        return chefSummaries.map((summary) => {
            const borderColor = resolveChefColor(summary.color || '') || '#6c63ff';
            const headerStyle = {
                borderTop: `4px solid ${borderColor}`
            };
            const isExpanded = expandedChef === summary.name;

            return React.createElement('article', { key: summary.name, className: 'chef-summary-article', style: headerStyle }, [
                React.createElement('header', { key: 'header', style: { cursor: 'pointer' }, onClick: () => setExpandedChef(isExpanded ? null : summary.name) }, [
                    React.createElement('h3', { key: 'title', style: { marginBottom: '0.25rem' } }, summary.name),
                    React.createElement('small', { key: 'subtitle', style: { color: 'var(--muted-color)' } },
                        `${summary.totalDishes} dish${summary.totalDishes === 1 ? '' : 'es'} • ${summary.totalOrders} order${summary.totalOrders === 1 ? '' : 's'}`
                    ),
                    React.createElement('span', { key: 'expand', style: { float: 'right', fontSize: '1.2em', color: '#ff9800' } }, isExpanded ? '▲' : '▼')
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
                isExpanded && React.createElement('div', { key: 'details', style: { marginBottom: '0.75rem' } }, [
                    React.createElement('p', { key: 'breakdown', className: 'muted' }, 'Dish breakdown and ingredient checklist coming soon.'),
                    React.createElement('textarea', {
                        key: 'notes',
                        placeholder: 'Quick notes for this chef...',
                        style: { width: '100%', minHeight: '2.5em', marginBottom: '0.5em', background: 'rgba(30,30,50,0.7)', color: '#fff', border: '1px solid #ff9800', borderRadius: '6px', padding: '0.5em' }
                    }),
                ]),
                React.createElement('footer', { key: 'footer', style: { display: 'flex', gap: '0.5em' } }, [
                    React.createElement('button', {
                        type: 'button',
                        className: 'secondary',
                        onClick: () => onSelectChef && onSelectChef(summary.name)
                    }, 'View Ingredients'),
                    React.createElement('button', {
                        type: 'button',
                        className: 'contrast',
                        onClick: () => setPrepChef(summary.name)
                    }, 'Start Prep')
                ])
            ]);
        });
    }, [chefSummaries, expandedChef, onSelectChef]);

    // Prep modal (full workflow)
    const prepModal = prepChef && window.ChefPrepModal && React.createElement(window.ChefPrepModal, {
        chefAssignments,
        chefName: prepChef,
        onClose: () => setPrepChef(null)
    });

    if (!cards.length) return null;

    return React.createElement('section', {
        className: 'container-fluid',
        style: { marginBottom: '1rem' }
    }, [
        // Today’s Priorities section
        React.createElement('header', { key: 'header', style: { marginBottom: '0.75rem' } }, [
            React.createElement('h2', { key: 'title', style: { marginBottom: '0.25rem' } }, 'Today’s Prep Summary'),
            React.createElement('p', { key: 'subtitle', className: 'muted' },
                'Quick view of each chef’s dishes, ingredients, and outstanding steps.'
            ),
            priorities.length > 0 && React.createElement('div', { key: 'priorities', style: { marginTop: '0.5em', background: 'rgba(255,152,0,0.08)', border: '1px solid #ff9800', borderRadius: '6px', padding: '0.5em' } }, [
                React.createElement('strong', { key: 'label', style: { color: '#ff9800' } }, 'Today’s Priorities:'),
                React.createElement('ul', { key: 'list', style: { margin: '0.5em 0 0 0', padding: 0, listStyle: 'none' } },
                    priorities.map((p, i) => React.createElement('li', { key: i, style: { color: '#ff9800', marginBottom: '0.25em' } }, p))
                )
            ])
        ]),
        React.createElement('div', {
            key: 'grid',
            className: 'grid',
            style: {
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1rem'
            }
        }, cards),
        prepModal
    ]);
};

window.ChefPrepSummary = ChefPrepSummary;
