/**
 * ChefStations - Simple vanilla JS accordions for each chef
 * Accordions grouped by category (Entree, Side, etc)
 * Each accordion shows mini recipe cards with image and name
 */

const ChefStations = ({ chefSummaries = [], chefAssignments = {}, recipes = {}, recipeData = {} }) => {
    const slugToDisplayName = window.slugToDisplayName || ((slug) => slug);

    if (!chefSummaries.length) {
        return null;
    }

    const container = React.createElement('section', {
        className: 'container-fluid',
        style: { marginBottom: '2rem' }
    }, [
        React.createElement('h2', {
            key: 'title',
            style: { marginBottom: '1rem' }
        }, 'Chef Stations'),

        React.createElement('div', {
            key: 'stations',
            style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
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

            let stationHTML = `
                <div class="chef-station" style="padding: 1.5rem; background: rgba(255, 255, 255, 0.05); border: 2px solid ${borderColor}; border-radius: 12px;">
                    <h3 style="margin-top: 0; color: ${borderColor}; margin-bottom: 0.5rem;">${chefName}</h3>
                    <p style="margin: 0 0 1.5rem 0; font-size: 0.9rem; color: var(--muted-color);">${chef.totalDishes || 0} dishes • ${chef.totalOrders || 0} orders</p>

                    <div class="category-accordions">
                        ${Object.entries(groupedByCategory).map(([category, categoryRecipes]) => `
                            <div class="category-item" style="margin-bottom: 1rem; border: 1px solid rgba(255, 152, 0, 0.3); border-radius: 6px; overflow: hidden;">
                                <div class="category-header" style="padding: 0.75rem; background: rgba(255, 152, 0, 0.12); cursor: pointer; user-select: none; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s ease;">
                                    <span style="font-weight: 600; color: #ffffff;">${category}</span>
                                    <span class="category-arrow" style="color: #ff9800; transition: transform 0.2s ease;">▼</span>
                                </div>
                                <div class="category-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; background: rgba(255, 255, 255, 0.02); padding: 0;">
                                    <div style="padding: 0.75rem; display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.75rem;">
                                        ${categoryRecipes.map(({ slug, recipe }) => {
                                            const displayName = recipe?.name || slugToDisplayName(slug);
                                            const imageUrl = recipe?.images?.[0] || '';

                                            return `
                                                <div class="mini-recipe-card" data-slug="${slug}" style="cursor: pointer; border-radius: 6px; overflow: hidden; transition: all 0.2s ease; border: 1px solid rgba(255, 152, 0, 0.3); background: rgba(255, 255, 255, 0.04);">
                                                    ${imageUrl ? `<img src="${imageUrl}" alt="${displayName}" style="width: 100%; height: 100px; object-fit: cover; display: block;">` : `<div style="width: 100%; height: 100px; background: rgba(255, 152, 0, 0.1); display: flex; align-items: center; justify-content: center; color: var(--muted-color);">No Image</div>`}
                                                    <div style="padding: 0.5rem; text-align: center;">
                                                        <p style="margin: 0; font-size: 0.75rem; color: #ffffff; line-height: 1.2; word-break: break-word;">${displayName}</p>
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
