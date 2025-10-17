// Recipe status styles
const STATUS_STYLES = {
    'gathered': 'border-yellow-400 bg-yellow-50',
    'complete': 'border-green-400 bg-green-50',
    'plated': 'border-blue-400 bg-blue-50',
    'packed': 'border-purple-400 bg-purple-50'
};

// Status button styles
const STATUS_BUTTON_STYLES = {
    'gathered': {
        active: 'bg-yellow-500 border-yellow-500 text-white',
        inactive: 'border-yellow-500 text-yellow-600 hover:bg-yellow-50'
    },
    'complete': {
        active: 'bg-green-500 border-green-500 text-white',
        inactive: 'border-green-500 text-green-600 hover:bg-green-50'
    },
    'plated': {
        active: 'bg-blue-500 border-blue-500 text-white',
        inactive: 'border-blue-500 text-blue-600 hover:bg-blue-50'
    },
    'packed': {
        active: 'bg-purple-500 border-purple-500 text-white',
        inactive: 'border-purple-500 text-purple-600 hover:bg-purple-50'
    }
};

// Status badge background colors
const STATUS_BADGE_COLORS = {
    'gathered': 'bg-yellow-500',
    'complete': 'bg-green-500',
    'plated': 'bg-blue-500',
    'packed': 'bg-purple-500'
};

// Export to global scope for other files
window.STATUS_STYLES = STATUS_STYLES;
window.STATUS_BUTTON_STYLES = STATUS_BUTTON_STYLES;
window.STATUS_BADGE_COLORS = STATUS_BADGE_COLORS;