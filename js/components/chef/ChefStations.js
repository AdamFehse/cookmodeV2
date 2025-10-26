/**
 * ChefStations - Simple vanilla JS accordions for each chef
 * Accordions grouped by category (Entree, Side, etc)
 * Each accordion shows mini recipe cards with image and name
 */

const ChefStations = ({ chefSummaries = [], chefAssignments = {}, recipes = {}, recipeData = {} }) => {
    const { useRef, useEffect } = React;
    const slugToDisplayName = window.slugToDisplayName || ((slug) => slug);
    const calculateKitchenProgress = window.calculateKitchenProgress || (() => ({ percentage: 0, completedItems: 0, totalItems: 0 }));

    if (!chefSummaries.length) {
        return null;
    }

    // Calculate kitchen-wide progress
    const kitchenProgress = calculateKitchenProgress(
        chefAssignments,
        recipeData.completedIngredients || {},
        recipeData.completedSteps || {}
    );

    // Calculate progress per chef
    const getChefProgress = (chefName) => {
        const assignment = chefAssignments[chefName];
        const recipeList = assignment?.recipes || [];
        let totalSteps = 0;
        let completedSteps = 0;

        recipeList.forEach(({ slug }) => {
            const recipe = assignment.recipes.find(r => r.slug === slug)?.recipe;
            if (recipe?.instructions) {
                const instructions = recipe.instructions || [];
                totalSteps += instructions.length;

                instructions.forEach((_, index) => {
                    const generateStepKey = window.generateStepKey || (() => `${slug}-${index}`);
                    const key = generateStepKey(slug, index);
                    if (recipeData.completedSteps?.[key]) {
                        completedSteps += 1;
                    }
                });
            }
        });

        const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
        return { percentage, completedSteps, totalSteps };
    };

    // Update progress bars and mini recipe cards when data changes
    const containerRef = useRef(null);
    useEffect(() => {
        if (!containerRef.current) return;

        // Update kitchen progress
        const kitchenBar = containerRef.current.querySelector('[data-kitchen-progress]');
        if (kitchenBar) {
            const fillBar = kitchenBar.querySelector('div[style*="background: #ff9800"]');
            if (fillBar) {
                fillBar.style.width = `${kitchenProgress.percentage}%`;
            }
            const percentage = kitchenBar.querySelector('[data-kitchen-percentage]');
            if (percentage) {
                percentage.textContent = `${kitchenProgress.percentage}%`;
            }
        }

        // Update chef progress bars
        chefSummaries.forEach(chef => {
            const chefName = chef.name;
            const progress = getChefProgress(chefName);
            const chefCard = containerRef.current.querySelector(`[data-chef="${chefName}"]`);
            if (chefCard) {
                const fillBar = chefCard.querySelector('[data-chef-progress-fill]');
                if (fillBar) {
                    fillBar.style.width = `${progress.percentage}%`;
                }
                const percentage = chefCard.querySelector('[data-chef-percentage]');
                if (percentage) {
                    percentage.textContent = `${progress.percentage}%`;
                }
                const details = chefCard.querySelector('[data-chef-details]');
                if (details) {
                    details.textContent = `${progress.completedSteps} of ${progress.totalSteps} steps complete`;
                }

                // Update mini recipe cards in this chef's accordions
                const miniCards = chefCard.querySelectorAll('.mini-recipe-card');
                miniCards.forEach(card => {
                    const slug = card.getAttribute('data-slug');
                    if (!slug) return;

                    const recipe = Object.values(chefAssignments).flatMap(a => a.recipes || []).find(r => r.slug === slug)?.recipe;
                    if (!recipe) return;

                    // Calculate completion
                    let totalSteps = 0;
                    let completedSteps = 0;
                    if (recipe.instructions) {
                        totalSteps = recipe.instructions.length;
                        recipe.instructions.forEach((_, index) => {
                            const generateStepKey = window.generateStepKey || (() => slug + '-' + index);
                            const key = generateStepKey(slug, index);
                            if (recipeData.completedSteps?.[key]) {
                                completedSteps += 1;
                            }
                        });
                    }
                    const completion = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
                    const status = recipeData.recipeStatus?.[slug];

                    // Update card background
                    const statusColors = {
                        'in-progress': { bg: 'var(--status-in-progress)', text: '#000' },
                        'complete': { bg: 'var(--status-complete)', text: '#fff' },
                        'plated': { bg: 'var(--status-plated)', text: '#000' },
                        'packed': { bg: 'var(--status-packed)', text: '#fff' }
                    };
                    const statusColor = statusColors[status] || { bg: '#6b7280', text: '#fff' };
                    const overlayColor = status ? 'var(--status-' + status + '-bg)' : completion > 0 ? 'var(--status-complete-bg)' : 'var(--surface-card)';
                    card.style.background = overlayColor;

                    // Update badge
                    const badgeContainer = card.querySelector('div[style*="display: flex; gap: 0.25rem"]');
                    if (badgeContainer) {
                        const statusBadge = badgeContainer.querySelector('span');
                        if (status && statusBadge) {
                            statusBadge.textContent = status;
                            statusBadge.style.background = statusColor.bg;
                            statusBadge.style.color = statusColor.text;
                        }
                    }

                    // Update completion text
                    const completionDiv = card.querySelector('div[style*="font-size: 0.65rem; color: rgba(76, 175, 80"]');
                    if (completionDiv) {
                        if (completion > 0 && !status) {
                            completionDiv.textContent = completion + '% done';
                            completionDiv.style.display = 'block';
                        } else {
                            completionDiv.style.display = 'none';
                        }
                    }
                });
            }
        });
    }, [recipeData.completedSteps, recipeData.completedIngredients, recipeData.recipeStatus, chefAssignments]);

    const container = React.createElement('section', {
        className: 'container-fluid',
        style: { marginBottom: '2rem' },
        ref: containerRef
    }, [
        React.createElement('h2', {
            key: 'title',
            style: { marginBottom: '1rem' }
        }, 'Chef Stations'),

        // Kitchen progress bar
        React.createElement('div', {
            key: 'kitchen-progress',
            'data-kitchen-progress': true,
            style: {
                marginBottom: '1.5rem',
                padding: '1rem',
                background: 'rgba(255, 152, 0, 0.08)',
                border: '1px solid rgba(255, 152, 0, 0.3)',
                borderRadius: '8px'
            }
        }, [
            React.createElement('div', {
                key: 'header',
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.75rem'
                }
            }, [
                React.createElement('h3', {
                    key: 'title',
                    style: { margin: 0, color: '#ffffff', fontSize: '1rem' }
                }, 'Kitchen Progress'),
                React.createElement('span', {
                    key: 'percentage',
                    'data-kitchen-percentage': true,
                    style: { color: '#ff9800', fontWeight: 600, fontSize: '0.9rem' }
                }, `${kitchenProgress.percentage}%`)
            ]),
            React.createElement('div', {
                key: 'bar',
                style: {
                    width: '100%',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '4px',
                    overflow: 'hidden'
                }
            }, React.createElement('div', {
                style: {
                    width: `${kitchenProgress.percentage}%`,
                    height: '100%',
                    background: '#ff9800',
                    transition: 'width 0.3s ease',
                    borderRadius: '4px'
                }
            })),
            React.createElement('small', {
                key: 'details',
                style: { color: 'var(--muted-color)', marginTop: '0.5rem', display: 'block' }
            }, `${kitchenProgress.completedItems} of ${kitchenProgress.totalItems} items complete`)
        ]),

        React.createElement('div', {
            key: 'stations',
            style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))',
                gap: '1.5rem'
            }
        }, chefSummaries.map((chef) => {
            const chefName = chef.name;
            const assignment = chefAssignments?.[chefName];
            const assignedRecipes = assignment?.recipes || [];
            const borderColor = window.resolveChefColor?.(chef.color || '') || '#6c63ff';

            // Group recipes by category
            const groupedByCategory = {};
            assignedRecipes.forEach(({ slug, recipe }) => {
                const category = recipe?.category || 'Other';
                if (!groupedByCategory[category]) {
                    groupedByCategory[category] = [];
                }
                groupedByCategory[category].push({ slug, recipe });
            });

            const chefProgress = getChefProgress(chefName);

            let stationHTML = `
                <div class="chef-station" data-chef="${chefName}" style="padding: 1.5rem; background: rgba(255, 255, 255, 0.05); border: 2px solid ${borderColor}; border-radius: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                        <div>
                            <h3 style="margin: 0; color: ${borderColor};">${chefName}</h3>
                            <p style="margin: 0.25rem 0 0 0; font-size: 0.9rem; color: var(--muted-color);">${chef.totalDishes || 0} dishes • ${chef.totalOrders || 0} orders</p>
                        </div>
                        <span data-chef-percentage style="font-size: 0.85rem; font-weight: 600; color: ${borderColor};">${chefProgress.percentage}%</span>
                    </div>
                    <div style="width: 100%; height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; overflow: hidden; margin-bottom: 0.75rem;">
                        <div data-chef-progress-fill style="width: ${chefProgress.percentage}%; height: 100%; background: ${borderColor}; transition: width 0.3s ease; border-radius: 3px;"></div>
                    </div>
                    <small data-chef-details style="color: var(--muted-color); font-size: 0.8rem;">${chefProgress.completedSteps} of ${chefProgress.totalSteps} steps complete</small>

                    <div class="category-accordions">
                        ${Object.entries(groupedByCategory).map(([category, categoryRecipes]) => `
                            <div class="category-item" style="margin-bottom: 1rem; border: 1px solid rgba(255, 152, 0, 0.3); border-radius: 6px; overflow: hidden;">
                                <div class="category-header" style="padding: 0.75rem; background: rgba(255, 152, 0, 0.12); cursor: pointer; user-select: none; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s ease;">
                                    <span style="font-weight: 600; color: #ffffff;">${category}</span>
                                    <span class="category-arrow" style="color: #ff9800; transition: transform 0.2s ease;">▼</span>
                                </div>
                                <div class="category-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; background: rgba(255, 255, 255, 0.02); padding: 0;">
                                    <div style="padding: 0.75rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(min(100%, 100px), 1fr)); gap: 0.75rem;">
                                        ${categoryRecipes.map(({ slug, recipe }) => {
                                            const displayName = recipe?.name || slugToDisplayName(slug);
                                            const imageUrl = recipe?.images?.[0] || '';
                                            const recipeStatus = recipeData.recipeStatus?.[slug];
                                            const orderCount = recipeData.orderCounts?.[slug] || 1;

                                            // Calculate recipe completion percentage based on instructions
                                            let recipeSteps = 0;
                                            let recipeCompletedSteps = 0;
                                            if (recipe?.instructions) {
                                                recipeSteps = recipe.instructions.length;
                                                recipe.instructions.forEach((_, index) => {
                                                    const generateStepKey = window.generateStepKey || (() => slug + '-' + index);
                                                    const key = generateStepKey(slug, index);
                                                    if (recipeData.completedSteps?.[key]) {
                                                        recipeCompletedSteps += 1;
                                                    }
                                                });
                                            }
                                            const recipeCompletion = recipeSteps > 0 ? Math.round((recipeCompletedSteps / recipeSteps) * 100) : 0;

                                            // Status color mapping
                                            const statusColors = {
                                                'in-progress': { bg: 'var(--status-in-progress)', text: '#000' },
                                                'complete': { bg: 'var(--status-complete)', text: '#fff' },
                                                'plated': { bg: 'var(--status-plated)', text: '#000' },
                                                'packed': { bg: 'var(--status-packed)', text: '#fff' }
                                            };
                                            const statusColor = statusColors[recipeStatus] || { bg: '#6b7280', text: '#fff' };
                                            const overlayColor = recipeStatus ? 'var(--status-' + recipeStatus + '-bg)' : recipeCompletion > 0 ? 'var(--status-complete-bg)' : 'var(--surface-card)';

                                            return `
                                                <div class="mini-recipe-card" data-slug="${slug}" style="cursor: pointer; border-radius: 6px; overflow: hidden; transition: all 0.2s ease; border: 1px solid rgba(255, 152, 0, 0.3); background: ${overlayColor}; position: relative;">
                                                    ${imageUrl ? `<img src="${imageUrl}" alt="${displayName}" style="width: 100%; height: 100px; object-fit: cover; display: block; opacity: ${recipeStatus ? '0.7' : '1'};">` : `<div style="width: 100%; height: 100px; background: rgba(255, 152, 0, 0.1); display: flex; align-items: center; justify-content: center; color: var(--muted-color);">No Image</div>`}
                                                    <div style="padding: 0.5rem; text-align: center; position: relative;">
                                                        <p style="margin: 0 0 0.25rem 0; font-size: 0.75rem; color: var(--text-primary); line-height: 1.2; word-break: break-word;">${displayName}</p>
                                                        <div style="display: flex; gap: 0.25rem; flex-wrap: wrap; justify-content: center; margin-bottom: 0.25rem;">
                                                            ${recipeStatus ? `<span style="display: inline-block; font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.4rem; background: ${statusColor.bg}; color: ${statusColor.text}; border-radius: 2px; text-transform: capitalize;">${recipeStatus}</span>` : ''}
                                                            ${orderCount > 1 ? `<span style="display: inline-block; font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.4rem; background: var(--color-primary); color: var(--text-inverse); border-radius: 2px;">×${orderCount}</span>` : ''}
                                                        </div>
                                                        ${recipeCompletion > 0 && !recipeStatus ? `<div style="font-size: 0.65rem; color: var(--status-complete); font-weight: 600;">${recipeCompletion}% done</div>` : ''}
                                                    </div>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;

            const wrapper = document.createElement('div');
            wrapper.innerHTML = stationHTML;

            // Setup event listeners
            setTimeout(() => {
                const categoryHeaders = wrapper.querySelectorAll('.category-header');
                categoryHeaders.forEach(header => {
                    header.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const content = this.nextElementSibling;
                        const arrow = this.querySelector('.category-arrow');
                        const isOpen = content.style.maxHeight && content.style.maxHeight !== '0px';

                        if (isOpen) {
                            content.style.maxHeight = '0px';
                            arrow.style.transform = 'rotate(0deg)';
                        } else {
                            content.style.maxHeight = content.scrollHeight + 'px';
                            arrow.style.transform = 'rotate(180deg)';
                        }
                    });
                });

                const recipeCards = wrapper.querySelectorAll('.mini-recipe-card');
                recipeCards.forEach(card => {
                    card.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const slug = this.getAttribute('data-slug');
                        if (recipeData.setSelectedRecipe) {
                            recipeData.setSelectedRecipe(slug);
                        }
                    });
                    card.addEventListener('mouseenter', function() {
                        this.style.background = 'rgba(255, 152, 0, 0.2)';
                        this.style.borderColor = 'rgba(255, 152, 0, 0.6)';
                    });
                    card.addEventListener('mouseleave', function() {
                        this.style.background = 'rgba(255, 255, 255, 0.04)';
                        this.style.borderColor = 'rgba(255, 152, 0, 0.3)';
                    });
                });
            }, 0);

            return React.createElement('div', {
                key: chefName,
                ref: (el) => {
                    if (el && el.childNodes.length === 0 && wrapper) {
                        el.appendChild(wrapper);
                    }
                }
            });
        }))
    ]);

    return container;
};

window.ChefStations = ChefStations;
