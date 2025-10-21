const ChefIngredientsList = ({ recipes, orderCounts, recipeChefNames, selectedChef, onClose }) => {
    const { useMemo } = React;
    const parseAmount = window.parseAmount || ((amount) => parseFloat(amount) || 0);
    const getIngredientName = window.getIngredientName || ((ing) => typeof ing === 'string' ? ing : ing.ingredient);

    // Find all recipes assigned to this chef
    const chefRecipes = useMemo(() => {
        const assigned = [];
        Object.entries(recipeChefNames).forEach(([slug, chefData]) => {
            if (chefData.name === selectedChef && recipes[slug]) {
                assigned.push({
                    slug,
                    recipe: recipes[slug],
                    orderCount: orderCounts[slug] || 1
                });
            }
        });
        return assigned;
    }, [selectedChef, recipeChefNames, recipes, orderCounts]);

    // Consolidate all ingredients across chef's recipes
    const consolidatedIngredients = useMemo(() => {
        const ingredientMap = {};

        chefRecipes.forEach(({ recipe, orderCount }) => {
            if (!recipe?.components) return;

            Object.values(recipe.components).forEach(ingredients => {
                ingredients.forEach(ingredient => {
                    const name = getIngredientName(ingredient);
                    const amount = parseAmount(ingredient.amount) * orderCount;
                    const unit = ingredient.unit || '';

                    // Group by ingredient name and unit
                    const key = `${name}-${unit}`;

                    if (!ingredientMap[key]) {
                        ingredientMap[key] = {
                            name: name,
                            unit: unit,
                            totalAmount: 0
                        };
                    }

                    ingredientMap[key].totalAmount += amount;
                });
            });
        });

        return Object.values(ingredientMap).sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }, [chefRecipes]);

    if (!selectedChef) return null;

    return React.createElement('dialog', {
        ref: (el) => el && el.showModal(),
        onClick: (e) => e.target.tagName === 'DIALOG' && onClose(),
        onClose: onClose
    },
        React.createElement('article', { style: { maxWidth: '600px' } }, [
            React.createElement('header', { key: 'header' }, [
                React.createElement('a', {
                    key: 'close',
                    href: '#close',
                    className: 'close',
                    onClick: (e) => {
                        e.preventDefault();
                        onClose();
                    }
                }),
                React.createElement('h3', { key: 'title' }, `${selectedChef}'s Total Ingredients`)
            ]),

            React.createElement('p', { key: 'subtitle' },
                `${chefRecipes.length} recipe(s) assigned • ${consolidatedIngredients.length} unique ingredients`
            ),

            React.createElement('ul', { key: 'list' },
                consolidatedIngredients.map((item, index) =>
                    React.createElement('li', { key: index }, [
                        React.createElement('strong', { key: 'amount' },
                            `${item.totalAmount.toFixed(2)} ${item.unit}`
                        ),
                        React.createElement('span', { key: 'name' },
                            ` ${item.name}`
                        )
                    ])
                )
            )
        ])
    );
};

window.ChefIngredientsList = ChefIngredientsList;
