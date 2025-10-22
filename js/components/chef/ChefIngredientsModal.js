const ChefIngredientList = ({ consolidatedIngredients }) => {
    if (!consolidatedIngredients.length) {
        return React.createElement('p', null, 'No ingredients assigned yet.');
    }

    return React.createElement('ul', {
        style: {
            listStyle: 'none',
            padding: 0,
            margin: 0,
            maxHeight: '320px',
            overflowY: 'auto'
        }
    }, consolidatedIngredients.map((item, index) =>
        React.createElement('li', {
            key: `${item.name}-${item.unit}-${index}`,
            style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: '0.25rem 0',
                borderBottom: '1px solid var(--muted-border-color)'
            }
        }, [
            React.createElement('span', { key: 'name', style: { fontWeight: 500 } }, item.name),
            React.createElement('span', { key: 'amount', style: { color: 'var(--muted-color)' } },
                `${item.totalAmount.toFixed(2)}${item.unit ? ` ${item.unit}` : ''}`
            )
        ])
    ));
};

const ChefIngredientsModal = ({ chefAssignments, selectedChef, onClose }) => {
    const { useMemo, useEffect, useRef } = React;
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

    if (!selectedChef) return null;

    return React.createElement('dialog', {
        ref: dialogRef,
        onClose: onClose,
        onClick: (event) => {
            if (event.target.tagName === 'DIALOG') {
                onClose?.();
            }
        }
    }, React.createElement('article', {
        style: {
            maxWidth: '620px',
            borderTop: `5px solid ${color || '#6c63ff'}`
        }
    }, [
        React.createElement('header', { key: 'header' }, [
            React.createElement('a', {
                key: 'close',
                href: '#close',
                className: 'close',
                onClick: (event) => {
                    event.preventDefault();
                    onClose?.();
                }
            }),
            React.createElement('h3', { key: 'title', style: { marginBottom: '0.25rem' } },
                `${chefName || selectedChef} – Ingredient Rollup`
            ),
            React.createElement('p', { key: 'subtitle', className: 'muted', style: { marginBottom: '0.5rem' } }, subtitle)
        ]),
        React.createElement('section', { key: 'list' },
            React.createElement(ChefIngredientList, { consolidatedIngredients })
        )
    ]));
};

window.ChefIngredientsModal = ChefIngredientsModal;
