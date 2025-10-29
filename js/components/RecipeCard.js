/**
 * RecipeCard - Single source of truth recipe card
 * Size prop controls layout: "grid" (default), "full", "compact"
 * Used in RecipeGrid, modals, and chef prep areas
 */

// Helper to get status badge style
const getStatusBadgeStyle = (stat) => {
    const colors = {
        'in-progress': { bg: 'var(--status-in-progress)', text: '#000000' },
        'complete': { bg: 'var(--status-complete)', text: '#000000' },
        'plated': { bg: 'var(--status-plated)', text: '#000000' },
        'packed': { bg: 'var(--status-packed)', text: '#ffffff' }
    };
    return colors[stat] || { bg: '#6b7280', text: '#ffffff' };
};

// Render badges with size-specific styling
const renderBadges = (size, { status, chefName, chefColor, orderCount = 1 }) => {
    const resolveChefColor = window.resolveChefColor || ((color) => color);
    const sizeStyles = size === 'grid' ? {
        padding: '0.25rem 0.5rem',
        borderRadius: 'var(--radius-sm)',
        fontSize: '0.75rem'
    } : size === 'full' ? {
        padding: '0.4rem 0.75rem',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.8rem'
    } : {
        fontSize: '0.65rem',
        padding: '0.2rem 0.4rem',
        borderRadius: 'var(--radius-xs)'
    };

    return [
        status && React.createElement('span', {
            key: 'status',
            style: { ...getStatusBadgeStyle(status), ...sizeStyles, fontWeight: '600', textTransform: 'uppercase' }
        }, status),
        chefName && React.createElement('span', {
            key: 'chef',
            style: { backgroundColor: resolveChefColor(chefColor), color: '#ffffff', ...sizeStyles, fontWeight: '600' }
        }, chefName),
        orderCount > 1 && React.createElement('span', {
            key: 'orders',
            style: { backgroundColor: 'var(--color-primary)', color: 'var(--text-inverse)', ...sizeStyles, fontWeight: '700' }
        }, size === 'full' ? `${orderCount}× orders` : `×${orderCount}`)
    ];
};

const RecipeCard = React.memo(({
    slug,
    recipe = {},
    size = 'grid',
    status,
    chefName,
    chefColor,
    orderCount = 1,
    progress = 0, // 0-100 percentage
    onClick,
    clickable = true,
    showBadges = true,
    showImage = true
}) => {
    const slugToDisplayName = window.slugToDisplayName || ((s) => s);
    const displayName = recipe.name || slugToDisplayName(slug);

    // Grid size (used in recipe list)
    if (size === 'grid') {
        return React.createElement('article', {
            className: 'recipe-card recipe-card--grid',
            onClick: clickable ? onClick : undefined,
            style: clickable ? { cursor: 'pointer' } : {},
            tabIndex: clickable ? 0 : -1
        }, [
            showImage && recipe.images?.[0] && React.createElement('img', {
                key: 'image',
                src: recipe.images[0],
                alt: displayName,
                loading: 'lazy',
                style: { width: '100%', height: '180px', objectFit: 'cover', display: 'block' }
            }),
            React.createElement('div', { key: 'body', style: { padding: '1rem' } }, [
                React.createElement('hgroup', { key: 'title' }, [
                    React.createElement('h4', { key: 'name', style: { margin: 0, marginBottom: '0.25rem' } }, displayName),
                    recipe.category && React.createElement('p', {
                        key: 'category',
                        style: { margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }
                    }, recipe.category)
                ]),
                showBadges && (status || chefName || orderCount > 1) && React.createElement('div', {
                    key: 'badges',
                    style: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }
                }, renderBadges('grid', { status, chefName, chefColor, orderCount }))
            ])
        ]);
    }

    // Full size (used in modals)
    if (size === 'full') {
        return React.createElement('div', { className: 'recipe-card recipe-card--full' }, [
            showImage && recipe.images?.[0] && React.createElement('img', {
                key: 'image',
                src: recipe.images[0],
                alt: displayName,
                style: { width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: 'var(--radius-lg)' }
            }),
            React.createElement('div', { key: 'info', style: { marginTop: '1rem' } }, [
                React.createElement('h3', { key: 'name', style: { margin: 0, marginBottom: '0.5rem' } }, displayName),
                recipe.category && React.createElement('p', {
                    key: 'category',
                    style: { margin: 0, color: 'var(--text-secondary)', marginBottom: '0.75rem' }
                }, recipe.category),
                showBadges && (status || chefName || orderCount > 1) && React.createElement('div', {
                    key: 'badges',
                    style: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }
                }, renderBadges('full', { status, chefName, chefColor, orderCount }))
            ])
        ]);
    }

    // Compact size (used in chef prep areas)
    if (size === 'compact') {
        const rgbMap = {
            'in-progress': '0, 217, 255',
            'complete': '0, 255, 136',
            'plated': '255, 0, 110',
            'packed': '255, 85, 255'
        };
        const rgb = status ? (rgbMap[status] || '100, 100, 100') : null;
        const backgroundColor = status ? `rgba(${rgb}, 0.1)` : (progress > 0 ? 'rgba(0, 255, 136, 0.08)' : 'rgba(255, 255, 255, 0.04)');

        return React.createElement('div', {
            className: 'recipe-card recipe-card--compact',
            onClick: clickable ? onClick : undefined,
            style: {
                cursor: clickable ? 'pointer' : 'default',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                border: '1px solid rgba(0, 217, 255, 0.2)',
                background: backgroundColor,
                transition: 'all var(--transition-fast)',
                display: 'flex',
                flexDirection: 'column'
            }
        }, [
            showImage && recipe.images?.[0] && React.createElement('img', {
                key: 'image',
                src: recipe.images[0],
                alt: displayName,
                style: {
                    width: '100%',
                    height: '100px',
                    objectFit: 'cover',
                    opacity: status ? 0.7 : 1
                }
            }),
            React.createElement('div', { key: 'content', style: { padding: '0.75rem', flex: 1 } }, [
                React.createElement('p', {
                    key: 'name',
                    style: {
                        margin: 0,
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        color: 'var(--text-primary)',
                        lineHeight: '1.3'
                    }
                }, displayName),
                showBadges && (status || orderCount > 1) && React.createElement('div', {
                    key: 'badges',
                    style: { display: 'flex', gap: '0.25rem', marginTop: '0.5rem', flexWrap: 'wrap' }
                }, renderBadges('compact', { status, chefName, chefColor, orderCount })),
                progress > 0 && React.createElement('div', {
                    key: 'progress',
                    style: {
                        fontSize: '0.65rem',
                        color: 'var(--status-complete)',
                        fontWeight: '600',
                        marginTop: '0.4rem'
                    }
                }, `${Math.round(progress)}% done`)
            ])
        ]);
    }

    return null; // Unknown size
});

RecipeCard.displayName = 'RecipeCard';
window.RecipeCard = RecipeCard;
