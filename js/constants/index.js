// Global constants for CookMode
export const DEFAULT_CHEF_COLOR = '#a855f7';

// Chef color mappings - simplified
export const CHEF_COLORS = {
    'var(--chef-purple)': '#a855f7',
    'var(--chef-blue)': '#3b82f6',
    'var(--chef-red)': '#ef4444',
    'var(--chef-teal)': '#14b8a6',
    'var(--chef-orange)': '#f97316',
    'var(--chef-yellow)': '#eab308',
    'var(--chef-pink)': '#ec4899'
};

export const CHEF_COLOR_SEQUENCE = [
    'var(--chef-purple)',
    'var(--chef-blue)',
    'var(--chef-teal)',
    'var(--chef-orange)',
    'var(--chef-red)',
    'var(--chef-yellow)',
    'var(--chef-pink)'
];

// Resolve CSS variable to hex color
export const resolveChefColor = (color) => {
    if (!color) return DEFAULT_CHEF_COLOR;
    if (color.startsWith('#')) return color;
    return CHEF_COLORS[color] || DEFAULT_CHEF_COLOR;
};

const normalizeChefName = (name) => (name || '').trim().toLowerCase();

// Chef color tracking
const chefColorAssignments = {};

export const getAssignedChefColor = (name) => {
    const normalized = normalizeChefName(name);
    return normalized ? (chefColorAssignments[normalized] || null) : null;
};

export const suggestChefColor = (name) => {
    const assigned = getAssignedChefColor(name);
    if (assigned) return assigned;
    // Find first unassigned color from sequence
    for (const color of CHEF_COLOR_SEQUENCE) {
        const isUsed = Object.values(chefColorAssignments).includes(color);
        if (!isUsed) return color;
    }
    return DEFAULT_CHEF_COLOR;
};

export const registerChefColor = (name, preferredColor) => {
    const normalized = normalizeChefName(name);
    if (!normalized) return null;

    const assigned = getAssignedChefColor(name);
    if (assigned && !preferredColor) return assigned;

    const color = preferredColor || suggestChefColor(name);
    chefColorAssignments[normalized] = color;
    return color;
};
