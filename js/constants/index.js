// Recipe status styles
const STATUS_STYLES = {
    'gathered': 'recipe-status-gathered',
    'complete': 'recipe-status-complete',
    'plated': 'recipe-status-plated',
    'packed': 'recipe-status-packed'
};

// Status button styles
const STATUS_BUTTON_STYLES = {
    'gathered': {
        active: 'status-button-gathered-active',
        inactive: 'status-button-gathered-inactive'
    },
    'complete': {
        active: 'status-button-complete-active',
        inactive: 'status-button-complete-inactive'
    },
    'plated': {
        active: 'status-button-plated-active',
        inactive: 'status-button-plated-inactive'
    },
    'packed': {
        active: 'status-button-packed-active',
        inactive: 'status-button-packed-inactive'
    }
};

// Status badge background colors
const STATUS_BADGE_COLORS = {
    'gathered': 'status-badge-gathered',
    'complete': 'status-badge-complete',
    'plated': 'status-badge-plated',
    'packed': 'status-badge-packed'
};

// Default colors
const DEFAULT_CHEF_COLOR = '#9333ea'; // Purple - matches database default

// Export to global scope for other files
window.STATUS_STYLES = STATUS_STYLES;
window.STATUS_BUTTON_STYLES = STATUS_BUTTON_STYLES;
window.STATUS_BADGE_COLORS = STATUS_BADGE_COLORS;
window.DEFAULT_CHEF_COLOR = DEFAULT_CHEF_COLOR;