const formatIngredientAmount = (amount) => {
    const numeric = Number(amount);
    if (!Number.isFinite(numeric)) {
        return '';
    }
    const rounded = Math.round((numeric + Number.EPSILON) * 100) / 100;
    const stringValue = rounded.toString();
    return stringValue.replace(/\.0+$/, '').replace(/(\.\d*[1-9])0$/, '$1');
};

const ChefIngredientList = ({ consolidatedIngredients }) => {
    if (!consolidatedIngredients.length) {
        return React.createElement('p', { className: 'chef-ingredients-modal__empty muted' }, 'No ingredients assigned yet.');
    }

    return React.createElement('ul', {
        className: 'chef-ingredients-modal__ingredients'
    }, consolidatedIngredients.map((item, index) =>
        React.createElement('li', {
            key: `${item.name}-${item.unit}-${index}`,
            className: 'chef-ingredients-modal__ingredient'
        }, [
            React.createElement('span', { key: 'name', className: 'chef-ingredients-modal__ingredient-name' }, item.name),
            React.createElement('span', { key: 'amount', className: 'chef-ingredients-modal__ingredient-amount' }, [
                formatIngredientAmount(item.totalAmount),
                item.unit ? React.createElement('span', { key: 'unit', className: 'chef-ingredients-modal__ingredient-unit' }, ` ${item.unit}`) : null
            ])
        ])
    ));
};

const ChefIngredientsModal = ({ chefAssignments, selectedChef, onClose }) => {
    const { useMemo, useEffect, useRef } = React;
    const slugToDisplayName = window.slugToDisplayName || ((slug) => slug);
    const { chefName, color, recipes, consolidatedIngredients, uniqueIngredientCount } =
        window.useChefModalData(chefAssignments, selectedChef);

    const dialogRef = useRef(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (dialog && !dialog.open && selectedChef) {
            dialog.showModal();
        }
        return () => {
            const dialogEl = dialogRef.current;
            if (dialogEl?.open) {
                dialogEl.close();
            }
        };
    }, [selectedChef]);

    const subtitle = useMemo(() => {
        const recipeCount = recipes.length;
        return `${recipeCount} recipe${recipeCount === 1 ? '' : 's'} • ${uniqueIngredientCount} unique ingredient${uniqueIngredientCount === 1 ? '' : 's'}`;
    }, [recipes, uniqueIngredientCount]);

    const stats = useMemo(() => {
        const totalOrders = recipes.reduce((sum, entry) => {
            const rawCount = typeof entry?.orderCount === 'number' ? entry.orderCount : undefined;
            const normalized = rawCount === undefined ? 1 : Math.max(rawCount, 0);
            return sum + normalized;
        }, 0);
        return [
            { key: 'ingredients', label: 'Unique ingredients', value: uniqueIngredientCount },
            { key: 'dishes', label: 'Assigned dishes', value: recipes.length },
            { key: 'orders', label: 'Total orders', value: totalOrders }
        ];
    }, [recipes, uniqueIngredientCount]);

    const recipeBadges = useMemo(() => {
        return recipes
            .map(({ slug, recipe, orderCount }) => {
                const rawCount = typeof orderCount === 'number' ? orderCount : undefined;
                const normalized = rawCount === undefined ? 1 : Math.max(rawCount, 0);
                return {
                    slug,
                    name: recipe?.name || slugToDisplayName(slug),
                    orderCount: normalized
                };
            })
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [recipes, slugToDisplayName]);

    if (!selectedChef) return null;

    return React.createElement('dialog', {
        ref: dialogRef,
        onClose: onClose,
        onClick: (event) => {
            if (event.target.tagName === 'DIALOG') {
                onClose?.();
            }
        },
        className: 'chef-ingredients-modal'
    }, React.createElement('article', {
        className: 'chef-ingredients-modal__card',
        style: {
            borderTop: `5px solid ${color || '#6c63ff'}`
        }
    }, [
        React.createElement('header', { key: 'header', className: 'chef-ingredients-modal__header' }, [
            React.createElement('div', { key: 'meta', className: 'chef-ingredients-modal__meta' }, [
                React.createElement('span', {
                    key: 'badge',
                    className: 'chef-ingredients-modal__chef-badge',
                    style: { color: color || '#6c63ff', borderColor: color || '#6c63ff' }
                }, chefName || selectedChef),
                React.createElement('h3', { key: 'title' },
                    'Ingredient Rollup'
                ),
                React.createElement('p', { key: 'subtitle', className: 'muted' }, subtitle)
            ]),
            React.createElement('a', {
                key: 'close',
                href: '#close',
                className: 'close',
                'aria-label': 'Close modal',
                onClick: (event) => {
                    event.preventDefault();
                    onClose?.();
                }
            }),
        ]),
        React.createElement('div', { key: 'body', className: 'chef-ingredients-modal__body' }, [
            React.createElement('aside', { key: 'summary', className: 'chef-ingredients-modal__summary' }, [
                React.createElement('ul', {
                    key: 'stats',
                    className: 'chef-ingredients-modal__stats'
                }, stats.map((item) =>
                    React.createElement('li', { key: item.key }, [
                        React.createElement('span', { key: 'value', className: 'chef-ingredients-modal__stat-value' }, item.value),
                        React.createElement('span', { key: 'label', className: 'muted' }, item.label)
                    ])
                )),
                recipeBadges.length > 0 && React.createElement('div', { key: 'recipes', className: 'chef-ingredients-modal__recipes' }, [
                    React.createElement('h4', { key: 'recipes-title' }, 'Assigned dishes'),
                    React.createElement('ul', { key: 'recipes-list' }, recipeBadges.map(({ slug, name, orderCount }) =>
                        React.createElement('li', { key: slug }, [
                            React.createElement('span', { key: 'name' }, name),
                            orderCount > 1 && React.createElement('span', { key: 'orders', className: 'chef-ingredients-modal__recipe-orders' }, `×${orderCount}`)
                        ])
                    ))
                ])
            ]),
            React.createElement('section', { key: 'ingredients', className: 'chef-ingredients-modal__list' }, [
                React.createElement('h4', { key: 'heading' }, 'Ingredient checklist'),
                React.createElement(ChefIngredientList, { key: 'list', consolidatedIngredients })
            ])
        )
    ]));
};

window.ChefIngredientsModal = ChefIngredientsModal;
