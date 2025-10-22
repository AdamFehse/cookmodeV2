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

const CHEF_COLOR_SEQUENCE = [
    'var(--chef-purple)',
    'var(--chef-blue)',
    'var(--chef-teal)',
    'var(--chef-orange)',
    'var(--chef-red)',
    'var(--chef-yellow)',
    'var(--chef-pink)'
];

const CHEF_COLOR_LABELS = {
    'var(--chef-purple)': 'Purple',
    'var(--chef-blue)': 'Blue',
    'var(--chef-teal)': 'Teal',
    'var(--chef-orange)': 'Orange',
    'var(--chef-red)': 'Red',
    'var(--chef-yellow)': 'Yellow',
    'var(--chef-pink)': 'Pink'
};

const chefColorAssignments = {};
const colorAssignments = {};
const colorLabels = { ...CHEF_COLOR_LABELS };
const generatedColors = [];
let generatedColorCounter = 0;

// Helper to resolve CSS variable to actual color
const resolveChefColor = (color) => {
    if (!color) return DEFAULT_CHEF_COLOR;
    // If it's already a hex color, return it
    if (color.startsWith('#')) return color;
    // If it's a CSS variable, resolve it
    return CHEF_COLORS[color] || DEFAULT_CHEF_COLOR;
};

const normalizeChefName = (name) => (name || '').trim().toLowerCase();

const normalizeColorToken = (color) => {
    if (!color) return null;
    const trimmed = color.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('#')) {
        return trimmed.toLowerCase();
    }
    return trimmed;
};

const hslToHex = (h, s, l) => {
    const toRgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };

    const sat = s / 100;
    const light = l / 100;

    if (sat === 0) {
        const value = Math.round(light * 255)
            .toString(16)
            .padStart(2, '0');
        return `#${value}${value}${value}`;
    }

    const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
    const p = 2 * light - q;
    const r = Math.round(toRgb(p, q, h / 360 + 1 / 3) * 255)
        .toString(16)
        .padStart(2, '0');
    const g = Math.round(toRgb(p, q, h / 360) * 255)
        .toString(16)
        .padStart(2, '0');
    const b = Math.round(toRgb(p, q, h / 360 - 1 / 3) * 255)
        .toString(16)
        .padStart(2, '0');

    return `#${r}${g}${b}`;
};

const ensureColorLabel = (color) => {
    if (colorLabels[color]) return;
    if (CHEF_COLOR_LABELS[color]) {
        colorLabels[color] = CHEF_COLOR_LABELS[color];
        return;
    }
    generatedColorCounter += 1;
    colorLabels[color] = `Chef Color ${generatedColorCounter}`;
};

const getColorForIndex = (index) => {
    if (index < CHEF_COLOR_SEQUENCE.length) {
        const token = CHEF_COLOR_SEQUENCE[index];
        ensureColorLabel(token);
        return token;
    }
    const generatedIndex = index - CHEF_COLOR_SEQUENCE.length;
    if (!generatedColors[generatedIndex]) {
        const hue = Math.floor((generatedIndex * 137.508) % 360);
        generatedColors[generatedIndex] = hslToHex(hue, 70, 45);
    }
    const color = generatedColors[generatedIndex];
    ensureColorLabel(color);
    return color;
};

const findAvailableColor = () => {
    let index = 0;
    while (true) {
        const candidate = getColorForIndex(index);
        if (!colorAssignments[candidate]) {
            return candidate;
        }
        index += 1;
    }
};

const getAssignedChefColor = (name) => {
    const normalized = normalizeChefName(name);
    if (!normalized) return null;
    return chefColorAssignments[normalized] || null;
};

const suggestChefColor = (name) => {
    const assigned = getAssignedChefColor(name);
    if (assigned) return assigned;
    return findAvailableColor();
};

const registerChefColor = (name, preferredColor) => {
    const normalized = normalizeChefName(name);
    if (!normalized) return null;

    const existing = chefColorAssignments[normalized];
    if (existing) {
        if (preferredColor) {
            const normalizedColor = normalizeColorToken(preferredColor);
            if (
                normalizedColor &&
                normalizedColor !== existing &&
                (!colorAssignments[normalizedColor] ||
                    colorAssignments[normalizedColor] === normalized)
            ) {
                delete colorAssignments[existing];
                colorAssignments[normalizedColor] = normalized;
                chefColorAssignments[normalized] = normalizedColor;
                ensureColorLabel(normalizedColor);
                return normalizedColor;
            }
        }
        return existing;
    }

    let candidate = null;
    if (preferredColor) {
        const normalizedColor = normalizeColorToken(preferredColor);
        if (
            normalizedColor &&
            (!colorAssignments[normalizedColor] ||
                colorAssignments[normalizedColor] === normalized)
        ) {
            candidate = normalizedColor;
        }
    }

    if (!candidate) {
        candidate = findAvailableColor();
    }

    chefColorAssignments[normalized] = candidate;
    colorAssignments[candidate] = normalized;
    ensureColorLabel(candidate);
    return candidate;
};

const getChefColorOptions = (name, currentColor) => {
    const normalized = normalizeChefName(name);
    const options = [];

    options.push({
        value: '',
        label: 'Auto-select next available',
        disabled: false
    });

    const normalizedCurrent = normalizeColorToken(currentColor);
    if (
        normalizedCurrent &&
        !CHEF_COLOR_SEQUENCE.includes(normalizedCurrent) &&
        !options.some(option => option.value === normalizedCurrent)
    ) {
        ensureColorLabel(normalizedCurrent);
        options.push({
            value: normalizedCurrent,
            label: colorLabels[normalizedCurrent],
            disabled: false
        });
    }

    CHEF_COLOR_SEQUENCE.forEach(token => {
        ensureColorLabel(token);
        options.push({
            value: token,
            label: colorLabels[token],
            disabled:
                Boolean(colorAssignments[token]) &&
                colorAssignments[token] !== normalized
        });
    });

    return options;
};

window.DEFAULT_CHEF_COLOR = DEFAULT_CHEF_COLOR;
window.CHEF_COLORS = CHEF_COLORS;
window.resolveChefColor = resolveChefColor;
window.getAssignedChefColor = getAssignedChefColor;
window.suggestChefColor = suggestChefColor;
window.registerChefColor = registerChefColor;
window.getChefColorLabel = (color) => colorLabels[color] || 'Custom';
window.getChefColorOptions = getChefColorOptions;
