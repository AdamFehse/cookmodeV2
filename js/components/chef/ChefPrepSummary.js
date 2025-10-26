const ChefPrepSummary = ({ chefSummaries = [], chefAssignments = {}, onSelectChef, onSelectRecipe }) => {
    const { useMemo, useState } = React;
    const resolveChefColor = window.resolveChefColor || ((color) => color);
    const slugToDisplayName = window.slugToDisplayName || ((slug) => slug);

    // Example priorities logic: flag dishes with >8 steps or >12 ingredients
    const priorities = chefSummaries
        .filter(s => s.outstandingSteps > 8 || s.uniqueIngredients > 12)
        .map(s => `${s.name}: ${s.outstandingSteps} steps, ${s.uniqueIngredients} ingredients`);

    // Track expanded chef cards
    const [expandedChef, setExpandedChef] = useState(null);

    const handleStartPrep = (chefName) => {
        if (!onSelectRecipe) return;
        const assignment = chefAssignments?.[chefName];
        const nextRecipe = assignment?.recipes?.[0];
        if (nextRecipe?.slug) {
            onSelectRecipe(nextRecipe.slug);
        }
    };

    // Expandable chef cards
    const cards = useMemo(() => {
        return chefSummaries.map((summary) => {
            const borderColor = resolveChefColor(summary.color || '') || '#6c63ff';
            const headerStyle = {
                borderTop: `4px solid ${borderColor}`
            };
            const isExpanded = expandedChef === summary.name;
            const assignment = chefAssignments?.[summary.name];
            const assignedRecipes = assignment?.recipes || [];

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
                isExpanded && assignedRecipes.length > 0 && React.createElement('div', { key: 'details', style: { marginBottom: '0.75rem' } }, [
                    React.createElement('p', { key: 'label', className: 'muted', style: { marginBottom: '0.5rem' } }, 'Assigned dishes'),
                    React.createElement('div', {
                        key: 'dish-buttons',
                        style: { display: 'flex', flexDirection: 'column', gap: '0.35rem' }
                    }, assignedRecipes.map(({ slug, recipe }) =>
                        React.createElement('button', {
                            key: slug,
                            type: 'button',
                            className: 'outline secondary',
                            onClick: () => onSelectRecipe && onSelectRecipe(slug)
                        }, recipe?.name || slugToDisplayName(slug))
                    ))
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
                        disabled: assignedRecipes.length === 0,
                        onClick: () => handleStartPrep(summary.name)
                    }, 'Start Prep')
                ])
            ]);
        });
    }, [chefSummaries, expandedChef, chefAssignments, onSelectChef, onSelectRecipe]);

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
        }, cards)
    ]);
};

window.ChefPrepSummary = ChefPrepSummary;
