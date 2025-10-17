const RecipeModal = ({
    selectedRecipe,
    setSelectedRecipe,
    recipes,
    cookName,
    setCookName,
    orderCounts,
    updateOrderCount,
    completedIngredients,
    toggleIngredient,
    ingredientMetadata,
    completedSteps,
    toggleStep,
    recipeStatus,
    updateRecipeStatus,
    recipeChefNames,
    updateChefName,
    openLightbox
}) => {
    if (!selectedRecipe) return null;

    const recipe = recipes[selectedRecipe];
    const STATUS_BUTTON_STYLES = window.STATUS_BUTTON_STYLES;
    const scaleAmount = window.scaleAmount;
    const removeAmount = window.removeAmount;
    const slugToDisplayName = window.slugToDisplayName;

    const displayName = recipe.name || slugToDisplayName(selectedRecipe);
    const currentChefData = recipeChefNames[selectedRecipe] || { name: '', color: '#9333ea' };
    const currentChefName = currentChefData.name || '';
    const currentChefColor = currentChefData.color || '#9333ea';

    return React.createElement('div', {
        className: 'fixed inset-0 bg-black/70 flex items-center justify-center z-[1000] p-5',
        onClick: () => setSelectedRecipe(null)
    }, [
        React.createElement('div', {
            key: 'modal',
            className: 'bg-white rounded-xl max-w-[1400px] w-[95vw] h-[90vh] flex flex-col overflow-hidden',
            onClick: (e) => e.stopPropagation()
        }, [
            // Header
            React.createElement('div', {
                key: 'header',
                className: 'bg-white border-b-2 border-gray-200 p-4 flex-shrink-0 flex justify-between items-center'
            }, [
                // Close button
                React.createElement('button', {
                    key: 'close',
                    className: 'absolute top-4 right-5 bg-gray-100 hover:bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center text-2xl z-10',
                    onClick: () => setSelectedRecipe(null)
                }, '×'),

                // Recipe info
                React.createElement('div', {
                    key: 'info',
                    className: 'flex-1'
                }, [
                    React.createElement('div', {
                        key: 'title-section',
                        className: 'flex items-center gap-3 mb-2'
                    }, [
                        React.createElement('div', {
                            key: 'title',
                            className: 'text-2xl font-bold'
                        }, displayName),
                        React.createElement('div', {
                            key: 'cook-input',
                            className: 'flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg'
                        }, [
                            React.createElement('label', {
                                key: 'label',
                                className: 'text-xs font-semibold text-gray-600'
                            }, 'Chef:'),
                            React.createElement('input', {
                                key: 'input',
                                type: 'text',
                                placeholder: 'Chef name',
                                value: currentChefName,
                                onChange: (e) => updateChefName(selectedRecipe, e.target.value, currentChefColor),
                                className: 'bg-white px-2 py-1 border border-gray-300 rounded text-sm w-32 focus:border-blue-500 focus:outline-none',
                                onClick: (e) => e.stopPropagation()
                            }),
                            React.createElement('input', {
                                key: 'color',
                                type: 'color',
                                value: currentChefColor,
                                onChange: (e) => {
                                    if (currentChefName) {
                                        updateChefName(selectedRecipe, currentChefName, e.target.value);
                                    }
                                },
                                className: 'w-8 h-8 border-2 border-gray-300 rounded cursor-pointer',
                                onClick: (e) => e.stopPropagation(),
                                title: 'Choose badge color'
                            }),
                            currentChefName && React.createElement('button', {
                                key: 'clear',
                                onClick: (e) => {
                                    e.stopPropagation();
                                    updateChefName(selectedRecipe, '');
                                },
                                className: 'text-gray-500 hover:text-red-600 text-lg font-bold leading-none',
                                title: 'Clear chef name'
                            }, '×')
                        ])
                    ]),
                    recipe.description && React.createElement('div', {
                        key: 'description',
                        className: 'text-gray-600 text-sm leading-snug'
                    }, recipe.description)
                ]),

                // Images
                recipe.images?.length > 0 && React.createElement('div', {
                    key: 'images',
                    className: 'flex gap-2 overflow-x-auto max-w-[400px]'
                }, recipe.images.map((img, i) => 
                    React.createElement('img', {
                        key: i,
                        src: img,
                        alt: `${displayName} ${i + 1}`,
                        className: 'h-24 w-auto rounded-lg object-cover cursor-pointer transition-transform hover:scale-105',
                        onClick: (e) => {
                            e.stopPropagation();
                            openLightbox(recipe.images, i);
                        }
                    })
                ))
            ]),

            // Body
            React.createElement('div', {
                key: 'body',
                className: 'p-8 flex-1 flex gap-10 min-h-0'
            }, [
                // Left - Ingredients
                React.createElement('div', {
                    key: 'ingredients',
                    className: 'flex-1 border-r-2 border-gray-200 pr-6 flex flex-col min-h-0'
                }, [
                    // Order count slider
                    React.createElement('div', {
                        key: 'slider',
                        className: 'bg-blue-50 p-2 rounded mb-3 flex-shrink-0'
                    }, [
                        React.createElement('label', {
                            key: 'label',
                            className: 'block font-semibold text-blue-700 mb-1 text-xs'
                        }, [
                            'Orders: ',
                            React.createElement('span', {
                                key: 'count',
                                className: 'text-lg'
                            }, orderCounts[selectedRecipe])
                        ]),
                        React.createElement('input', {
                            key: 'range',
                            type: 'range',
                            min: '1',
                            max: '50',
                            value: orderCounts[selectedRecipe],
                            onChange: (e) => updateOrderCount(selectedRecipe, Number(e.target.value)),
                            className: 'w-full h-1 cursor-pointer'
                        })
                    ]),

                    // Ingredients header
                    React.createElement('div', {
                        key: 'header',
                        className: 'mb-2 pb-1 border-b border-gray-400 flex-shrink-0'
                    }, [
                        React.createElement('h3', {
                            key: 'title',
                            className: 'font-bold text-base'
                        }, `Ingredients (${orderCounts[selectedRecipe]}x)`)
                    ]),

                    // Scrollable ingredients
                    React.createElement('div', {
                        key: 'ingredients-list',
                        className: 'overflow-y-auto pr-2 flex-1 min-h-0'
                    }, recipe.components && Object.entries(recipe.components).map(([component, ingredients]) =>
                        React.createElement('div', {
                            key: component,
                            className: 'mb-4'
                        }, [
                            React.createElement('div', {
                                key: 'component-header',
                                className: 'bg-blue-600 text-white font-bold text-xs uppercase tracking-wide py-1.5 px-2 rounded-t'
                            }, component),
                            React.createElement('ul', {
                                key: 'ingredient-list',
                                className: 'bg-gray-50 border border-gray-300 border-t-0 rounded-b'
                            }, ingredients.map((ing, i) => {
                                const ingKey = `${selectedRecipe}-ing-${component}-${i}`;
                                const isCompleted = completedIngredients[ingKey];
                                const metadata = ingredientMetadata[ingKey];

                                return React.createElement('li', {
                                    key: i,
                                    onClick: () => toggleIngredient(selectedRecipe, ingKey, component, i, ing),
                                    className: `grid grid-cols-[1fr_auto] gap-2 items-center py-2 px-2 border-b border-gray-200 last:border-b-0 cursor-pointer transition-all ${
                                        isCompleted
                                            ? 'bg-green-100 border-green-300'
                                            : 'hover:bg-blue-50'
                                    }`
                                }, [
                                    React.createElement('div', {
                                        key: 'text',
                                        className: 'flex flex-col gap-1'
                                    }, [
                                        React.createElement('div', {
                                            key: 'ingredient',
                                            className: `text-sm leading-tight transition-all ${isCompleted ? 'text-green-800 font-medium' : 'text-gray-800'}`
                                        }, [
                                            isCompleted && React.createElement('span', {
                                                key: 'check',
                                                className: 'mr-1'
                                            }, '✓'),
                                            removeAmount(ing)
                                        ]),
                                        isCompleted && metadata && React.createElement('div', {
                                            key: 'metadata',
                                            className: 'text-xs text-green-600'
                                        }, `by ${metadata.checked_by}`)
                                    ]),
                                    React.createElement('div', {
                                        key: 'amount',
                                        className: 'flex flex-col items-end'
                                    }, [
                                        React.createElement('div', {
                                            key: 'scaled',
                                            className: `font-bold text-base whitespace-nowrap transition-all ${isCompleted ? 'text-green-700' : 'text-blue-600'}`
                                        }, scaleAmount(ing, orderCounts[selectedRecipe]))
                                    ])
                                ]);
                            }))
                        ])
                    ))
                ]),

                // Right - Instructions
                React.createElement('div', {
                    key: 'instructions',
                    className: 'flex-1 flex flex-col min-h-0'
                }, [
                    // Instructions header with status buttons
                    React.createElement('div', {
                        key: 'header',
                        className: 'flex items-center justify-between mb-4 pb-1 border-b-2 border-gray-800 flex-shrink-0'
                    }, [
                        React.createElement('h3', {
                            key: 'title',
                            className: 'font-bold text-xl'
                        }, 'Instructions'),
                        React.createElement('div', {
                            key: 'status-buttons',
                            className: 'flex gap-2'
                        }, ['gathered', 'complete', 'plated', 'packed'].map(status => 
                            React.createElement('button', {
                                key: status,
                                onClick: () => updateRecipeStatus(selectedRecipe, recipeStatus[selectedRecipe] === status ? null : status),
                                className: `text-xs px-3 py-2 rounded border-2 transition-all ${
                                    recipeStatus[selectedRecipe] === status
                                        ? STATUS_BUTTON_STYLES[status].active
                                        : STATUS_BUTTON_STYLES[status].inactive
                                }`
                            }, status.charAt(0).toUpperCase() + status.slice(1))
                        ))
                    ]),

                    // Scrollable instructions
                    React.createElement('div', {
                        key: 'instructions-list',
                        className: 'overflow-y-auto flex-1 min-h-0'
                    }, [
                        React.createElement('ol', {
                            key: 'steps',
                            className: 'space-y-4'
                        }, recipe.instructions.map((step, i) => {
                            const stepKey = `${selectedRecipe}-step-${i}`;
                            const isCompleted = completedSteps[stepKey];

                            return React.createElement('li', {
                                key: i,
                                onClick: () => toggleStep(selectedRecipe, stepKey, i, step),
                                className: `flex gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                    isCompleted
                                        ? 'bg-green-100 border-2 border-green-300'
                                        : 'hover:bg-gray-50 border-2 border-transparent'
                                }`
                            }, [
                                React.createElement('div', {
                                    key: 'step-text',
                                    className: `leading-relaxed transition-all ${isCompleted ? 'text-green-800 font-medium' : 'text-gray-800'}`
                                }, [
                                    React.createElement('span', {
                                        key: 'number',
                                        className: 'font-bold mr-2'
                                    }, isCompleted ? '✓' : `${i + 1}.`),
                                    step
                                ])
                            ]);
                        })),

                        // Notes section
                        recipe.notes && React.createElement('div', {
                            key: 'notes',
                            className: 'bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-6 rounded'
                        }, [
                            React.createElement('strong', { key: 'label' }, '📝 Notes: '),
                            recipe.notes
                        ])
                    ])
                ])
            ])
        ])
    ]);
};

// Export to global scope
window.RecipeModal = RecipeModal;