/**
 * ChefStations - Simple vanilla JS accordions for each chef
 * Each chef gets their own independent accordion for assigned dishes
 */

const ChefStations = ({ chefSummaries = [], chefAssignments = {}, recipes = {}, recipeData = {} }) => {
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

            let stationHTML = `
                <div class="chef-station" style="padding: 1.5rem; background: rgba(255, 255, 255, 0.05); border: 2px solid ${borderColor}; border-radius: 12px;">
                    <h3 style="margin-top: 0; color: ${borderColor}; margin-bottom: 0.5rem;">${chefName}</h3>
                    <p style="margin: 0 0 1.5rem 0; font-size: 0.9rem; color: var(--muted-color);">${chef.totalDishes || 0} dishes • ${chef.totalOrders || 0} orders</p>

                    <div class="dishes-accordion">
                        ${assignedRecipes.map(({ slug, recipe }, index) => `
                            <div class="dish-item" style="margin-bottom: 0.75rem; border: 1px solid rgba(255, 152, 0, 0.3); border-radius: 6px; overflow: hidden;">
                                <div class="dish-header" data-slug="${slug}" style="padding: 0.75rem; background: rgba(255, 152, 0, 0.08); cursor: pointer; user-select: none; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s ease;">
                                    <span style="font-weight: 500; color: #ffffff;">${recipe?.name || slug}</span>
                                    <span class="dish-arrow" style="color: #ff9800; transition: transform 0.2s ease;">▼</span>
                                </div>
                                <div class="dish-content" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease; background: rgba(255, 255, 255, 0.02); padding: 0 0.75rem;">
                                    <div style="padding: 0.75rem 0;">
                                        <button type="button" class="start-dish-btn" data-slug="${slug}" style="width: 100%; padding: 0.6rem; background: rgba(255, 152, 0, 0.3); border: 1px solid rgba(255, 152, 0, 0.5); border-radius: 4px; color: #ffffff; cursor: pointer; font-weight: 500; transition: all 0.2s ease;">
                                            Start Prep
                                        </button>
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
                const headers = wrapper.querySelectorAll('.dish-header');
                headers.forEach(header => {
                    header.addEventListener('click', function() {
                        const content = this.nextElementSibling;
                        const arrow = this.querySelector('.dish-arrow');
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

                const startButtons = wrapper.querySelectorAll('.start-dish-btn');
                startButtons.forEach(btn => {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        // Recipe modal handler would go here
                    });
                    btn.addEventListener('mouseenter', function() {
                        this.style.background = 'rgba(255, 152, 0, 0.5)';
                    });
                    btn.addEventListener('mouseleave', function() {
                        this.style.background = 'rgba(255, 152, 0, 0.3)';
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
