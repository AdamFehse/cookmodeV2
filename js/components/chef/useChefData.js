const DEFAULT_CHEF_COLOR = window.DEFAULT_CHEF_COLOR || '#9333ea';
const getAssignedChefColor = window.getAssignedChefColor || (() => null);
const suggestChefColor = window.suggestChefColor || (() => 'var(--chef-purple)');

const normalizeChefMeta = (meta = {}) => {
    const name = (meta.name || '').trim();
    let color = (meta.color || '').trim();

    if (name) {
        color = getAssignedChefColor(name) || color || suggestChefColor(name);
    }

    if (!color) {
        color = DEFAULT_CHEF_COLOR;
    }

    return {
        name,
        color
    };
};

const buildIngredientKey = (ingredientName, unit) => {
    return `${ingredientName}__${unit || ''}`;
};

const sumChefAssignments = (assignments, completedSteps) => {
    const generateStepKey = window.generateStepKey || (() => '');
    return Object.values(assignments).map((assignment) => {
        let totalOrders = 0;
        let totalIngredients = 0;
        let outstandingSteps = 0;

        assignment.recipes.forEach(({ slug, recipe, orderCount }) => {
            totalOrders += orderCount;

            if (recipe?.components) {
                const ingredientLines = Object.values(recipe.components).flat();
                totalIngredients += ingredientLines.length * orderCount;
            }

            const instructions = recipe?.instructions || [];
            if (instructions.length) {
                let completedCount = 0;
                instructions.forEach((_, index) => {
                    const key = generateStepKey(slug, index);
                    if (completedSteps[key]) {
                        completedCount += 1;
                    }
                });
                outstandingSteps += Math.max(instructions.length - completedCount, 0);
            }
        });

        return {
            name: assignment.name,
            color: assignment.color,
            totalOrders,
            totalDishes: assignment.recipes.length,
            uniqueIngredients: Object.keys(assignment.ingredients).length,
            outstandingSteps
        };
    }).sort((a, b) => a.name.localeCompare(b.name));
};

const useChefData = (recipes, orderCounts, recipeChefNames, completedSteps) => {
    const { useMemo } = React;
    const parseAmount = window.parseAmount || ((value) => parseFloat(value) || 0);
    const getIngredientName = window.getIngredientName || ((ing) => typeof ing === 'string' ? ing : ing.ingredient);

    const assignments = useMemo(() => {
        const map = {};

        Object.entries(recipeChefNames || {}).forEach(([slug, meta]) => {
            const { name, color } = normalizeChefMeta(meta);
            if (!name || !recipes?.[slug]) return;

            if (!map[name]) {
                map[name] = {
                    name,
                    color,
                    recipes: [],
                    ingredients: {}
                };
            }

            const recipe = recipes[slug];
            const orderCount = orderCounts?.[slug] || 1;

            map[name].recipes.push({
                slug,
                recipe,
                orderCount
            });

            if (recipe?.components) {
                Object.values(recipe.components).forEach((ingredients) => {
                    ingredients.forEach((ingredient) => {
                        const ingredientName = getIngredientName(ingredient);
                        if (!ingredientName) return;

                        const unit = ingredient.unit || '';
                        const key = buildIngredientKey(ingredientName, unit);

                        if (!map[name].ingredients[key]) {
                            map[name].ingredients[key] = {
                                name: ingredientName,
                                unit,
                                totalAmount: 0
                            };
                        }

                        const amount = parseAmount(ingredient.amount);
                        map[name].ingredients[key].totalAmount += amount * orderCount;
                    });
                });
            }
        });

        return map;
    }, [recipes, orderCounts, recipeChefNames]);

    const chefSummaries = useMemo(() => {
        return sumChefAssignments(assignments, completedSteps || {});
    }, [assignments, completedSteps]);

    return {
        chefAssignments: assignments,
        chefSummaries
    };
};

const useChefModalData = (chefAssignments, selectedChef) => {
    const { useMemo } = React;

    return useMemo(() => {
        if (!selectedChef) {
            return {
                chefName: '',
                color: '',
                recipes: [],
                consolidatedIngredients: [],
                uniqueIngredientCount: 0
            };
        }

        const assignment = chefAssignments?.[selectedChef];
        if (!assignment) {
            return {
                chefName: selectedChef,
                color: '',
                recipes: [],
                consolidatedIngredients: [],
                uniqueIngredientCount: 0
            };
        }

        const consolidatedIngredients = Object.values(assignment.ingredients || {}).sort((a, b) =>
            a.name.localeCompare(b.name)
        );

        return {
            chefName: assignment.name,
            color: assignment.color,
            recipes: assignment.recipes,
            consolidatedIngredients,
            uniqueIngredientCount: consolidatedIngredients.length
        };
    }, [chefAssignments, selectedChef]);
};

window.normalizeChefMeta = normalizeChefMeta;
window.useChefData = useChefData;
window.useChefModalData = useChefModalData;
