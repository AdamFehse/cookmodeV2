import { resolveChefColor } from '../constants/index.js';
import { slugToDisplayName as defaultSlugToDisplayName } from '../utils/scaling.js';

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
            style: { backgroundColor: 'var(--color-primary)', color: 'var(--text-inverse)', ...sizeStyles, fontWeight: '700' },
            'aria-label': `${orderCount} active orders`
        }, size === 'full' ? `${orderCount} orders` : `x${orderCount}`)
    ];
};

export const RecipeCard = React.memo(({
    slug,
    recipe = {},
    size = 'grid',
    status,
    chefName,
    chefColor,
    orderCount = 1,
    progress = 0,
    onClick,
    clickable = true,
    showBadges = true,
    showImage = true,
    slugToDisplayName = defaultSlugToDisplayName
}) => {
    const displayName = recipe.name || slugToDisplayName(slug);
    const handleCardKeyDown = (event) => {
        if (!clickable) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            if (typeof onClick === 'function') {
                onClick(event);
            }
        }
    };

    if (size === 'grid') {
        return React.createElement('article', {
            className: 'recipe-card recipe-card--grid' + (clickable ? ' cursor-pointer' : ''),
            onClick: clickable ? onClick : undefined,
            onKeyDown: handleCardKeyDown,
            tabIndex: clickable ? 0 : -1,
            role: clickable ? 'button' : undefined
        }, [
            showImage && recipe.images?.[0] && React.createElement('img', {
                key: 'image',
                src: recipe.images[0],
                alt: displayName,
                loading: 'lazy'
            }),
            React.createElement('div', { key: 'body' }, [
                React.createElement('hgroup', { key: 'title' }, [
                    React.createElement('h4', { key: 'name' }, displayName),
                    recipe.category && React.createElement('p', {
                        key: 'category'
                    }, recipe.category)
                ]),
                showBadges && (status || chefName || orderCount > 1) && React.createElement('div', {
                    key: 'badges',
                    className: 'recipe-badges'
                }, renderBadges('grid', { status, chefName, chefColor, orderCount }))
            ])
        ]);
    }

    if (size === 'full') {
        return React.createElement('div', { className: 'recipe-card recipe-card--full' }, [
            showImage && recipe.images?.[0] && React.createElement('img', {
                key: 'image',
                src: recipe.images[0],
                alt: displayName
            }),
            React.createElement('div', { key: 'info' }, [
                React.createElement('h3', { key: 'name' }, displayName),
                recipe.category && React.createElement('p', {
                    key: 'category'
                }, recipe.category),
                showBadges && (status || chefName || orderCount > 1) && React.createElement('div', {
                    key: 'badges',
                    className: 'recipe-badges'
                }, renderBadges('full', { status, chefName, chefColor, orderCount }))
            ])
        ]);
    }

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
            className: 'recipe-card recipe-card--compact' + (clickable ? ' cursor-pointer' : ''),
            onClick: clickable ? onClick : undefined,
            onKeyDown: handleCardKeyDown,
            tabIndex: clickable ? 0 : -1,
            role: clickable ? 'button' : undefined,
            style: {
                background: backgroundColor
            }
        }, [
            showImage && recipe.images?.[0] && React.createElement('img', {
                key: 'image',
                src: recipe.images[0],
                alt: displayName,
                style: {
                    opacity: status ? 0.7 : 1
                }
            }),
            React.createElement('div', { key: 'content' }, [
                React.createElement('p', {
                    key: 'name'
                }, displayName),
                showBadges && (status || orderCount > 1) && React.createElement('div', {
                    key: 'badges',
                    className: 'recipe-badges'
                }, renderBadges('compact', { status, chefName, chefColor, orderCount })),
                progress > 0 && React.createElement('div', {
                    key: 'progress',
                    className: 'recipe-progress'
                }, `${Math.round(progress)}% done`)
            ])
        ]);
    }

    return null;
});

RecipeCard.displayName = 'RecipeCard';
