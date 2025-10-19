// Global constants for CookMode
const DEFAULT_CHEF_COLOR = '#a855f7';

// Chef color mappings (CSS var -> hex)
const CHEF_COLORS = {
    'var(--chef-purple)': '#a855f7',
    'var(--chef-blue)': '#3b82f6',
    'var(--chef-red)': '#ef4444',
    'var(--chef-teal)': '#14b8a6',
    'var(--chef-orange)': '#f97316',
    'var(--chef-yellow)': '#eab308',
    'var(--chef-pink)': '#ec4899'
};

// Helper to resolve CSS variable to actual color
const resolveChefColor = (color) => {
    if (!color) return DEFAULT_CHEF_COLOR;
    // If it's already a hex color, return it
    if (color.startsWith('#')) return color;
    // If it's a CSS variable, resolve it
    return CHEF_COLORS[color] || DEFAULT_CHEF_COLOR;
};

window.DEFAULT_CHEF_COLOR = DEFAULT_CHEF_COLOR;
window.CHEF_COLORS = CHEF_COLORS;
window.resolveChefColor = resolveChefColor;
