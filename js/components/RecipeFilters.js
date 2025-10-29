const RecipeFilters = ({
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
    categories = [],
    dishes = [],
    ingredients = [],
    components = [],
    handleResetFilters
}) => {
    return React.createElement('section', {
        className: 'container-fluid recipe-filters'
    }, React.createElement('form', {
        className: 'grid recipe-filters-form',
        onSubmit: (event) => event.preventDefault(),
        onReset: (event) => {
            event.preventDefault();
            handleResetFilters?.();
        }
    }, [
        React.createElement('select', {
            key: 'category',
            'aria-label': 'Filter by category',
            value: selectedCategory,
            onChange: (event) => setSelectedCategory(event.target.value)
        }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'All Categories'),
            ...categories.map((category) =>
                React.createElement('option', { key: category, value: category }, category)
            )
        ]),

        React.createElement('select', {
            key: 'dish',
            'aria-label': 'Filter by dish',
            value: selectedDish,
            onChange: (event) => setSelectedDish(event.target.value)
        }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'All Dishes'),
            ...dishes.map((dish) =>
                React.createElement('option', { key: dish, value: dish }, dish)
            )
        ]),

        React.createElement('select', {
            key: 'component',
            'aria-label': 'Filter by component',
            value: selectedComponent,
            onChange: (event) => setSelectedComponent(event.target.value)
        }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'All Components'),
            ...components.map((component) =>
                React.createElement('option', { key: component, value: component }, component)
            )
        ]),

        React.createElement('select', {
            key: 'ingredient',
            'aria-label': 'Filter by ingredient',
            value: selectedIngredient,
            onChange: (event) => setSelectedIngredient(event.target.value)
        }, [
            React.createElement('option', { key: 'all', value: 'all' }, 'All Ingredients'),
            ...ingredients.map((ingredient) =>
                React.createElement('option', { key: ingredient, value: ingredient }, ingredient)
            )
        ]),

        React.createElement('input', {
            key: 'search',
            type: 'search',
            placeholder: 'Search...',
            'aria-label': 'Search recipes',
            value: filterText,
            onChange: (event) => setFilterText(event.target.value)
        }),

        React.createElement('button', {
            key: 'clear',
            type: 'reset',
            className: 'secondary outline'
        }, 'Clear')
    ]));
};

window.RecipeFilters = RecipeFilters;
