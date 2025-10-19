const Header = ({
    supabase,
    isSupabaseConnected,
    filterText,
    setFilterText,
    selectedCategory,
    setSelectedCategory,
    selectedDish,
    setSelectedDish,
    selectedIngredient,
    setSelectedIngredient,
    selectedComponent,
    setSelectedComponent,
    categories,
    dishes,
    ingredients,
    components,
    handleResetFilters
}) => {
    const connectionState = supabase
        ? isSupabaseConnected
            ? 'Live'
            : 'Connecting'
        : 'Offline';
    const connectionClass = (() => {
        if (!supabase) return 'tag secondary';
        return isSupabaseConnected ? 'tag contrast' : 'tag outline';
    })();

    return React.createElement('header', { className: 'page-header' },
        React.createElement('div', { className: 'container-fluid' }, [
            // Top row: Brand + Status
            React.createElement('nav', {
                key: 'nav',
                'aria-label': 'Primary navigation',
                style: { marginBottom: '0.5rem' }
            }, [
                React.createElement('ul', { key: 'brand' }, [
                    React.createElement('li', { key: 'title' }, React.createElement('strong', null, 'CookMode V2'))
                ]),
                React.createElement('ul', { key: 'status' }, [
                    React.createElement('li', { key: 'badge' },
                        React.createElement('span', {
                            className: connectionClass,
                            role: 'status'
                        }, connectionState)
                    )
                ])
            ]),

            // Filter row
            React.createElement('form', {
                key: 'filters',
                className: 'grid',
                style: {
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    alignItems: 'end',
                    gap: '0.5rem',
                    marginBottom: 0
                },
                onSubmit: (e) => e.preventDefault(),
                onReset: (e) => {
                    e.preventDefault();
                    handleResetFilters();
                }
            }, [
                React.createElement('select', {
                    key: 'category',
                    'aria-label': 'Filter by category',
                    value: selectedCategory,
                    onChange: (e) => setSelectedCategory(e.target.value)
                }, [
                    React.createElement('option', { key: 'all', value: 'all' }, 'All Categories'),
                    ...categories.map(cat => React.createElement('option', { key: cat, value: cat }, cat))
                ]),

                React.createElement('select', {
                    key: 'dish',
                    'aria-label': 'Filter by dish',
                    value: selectedDish,
                    onChange: (e) => setSelectedDish(e.target.value)
                }, [
                    React.createElement('option', { key: 'all', value: 'all' }, 'All Dishes'),
                    ...dishes.map(dish => React.createElement('option', { key: dish, value: dish }, dish))
                ]),

                React.createElement('select', {
                    key: 'component',
                    'aria-label': 'Filter by component',
                    value: selectedComponent,
                    onChange: (e) => setSelectedComponent(e.target.value)
                }, [
                    React.createElement('option', { key: 'all', value: 'all' }, 'All Components'),
                    ...components.map(comp => React.createElement('option', { key: comp, value: comp }, comp))
                ]),

                React.createElement('select', {
                    key: 'ingredient',
                    'aria-label': 'Filter by ingredient',
                    value: selectedIngredient,
                    onChange: (e) => setSelectedIngredient(e.target.value)
                }, [
                    React.createElement('option', { key: 'all', value: 'all' }, 'All Ingredients'),
                    ...ingredients.map(ing => React.createElement('option', { key: ing, value: ing }, ing))
                ]),

                React.createElement('input', {
                    key: 'search',
                    type: 'search',
                    placeholder: 'Search...',
                    'aria-label': 'Search recipes',
                    value: filterText,
                    onChange: (e) => setFilterText(e.target.value)
                }),

                React.createElement('button', {
                    key: 'clear',
                    type: 'reset',
                    className: 'secondary outline'
                }, 'Clear')
            ])
        ])
    );
};

window.Header = Header;
