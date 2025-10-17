// Utility functions for ingredient scaling and text manipulation

const scaleAmount = (ingredient, multiplier) => {
    const match = ingredient.match(/^([\d.\/]+)\s+([a-zA-Z]+)/);
    if (!match) return `${multiplier}x`;

    let amount = match[1];
    const unit = match[2]; // Just the unit (lb, cup, tbsp, etc)

    if (amount.includes('/')) {
        const [num, den] = amount.split('/').map(Number);
        amount = num / den;
    } else {
        amount = parseFloat(amount);
    }

    const scaled = amount * multiplier;

    return `${scaled.toFixed(2)} ${unit}`;
};

const removeAmount = (ingredient) => {
    // Remove the leading number from ingredient text
    const match = ingredient.match(/^[\d.\/]+\s+(.+)$/);
    return match ? match[1] : ingredient;
};

const slugToDisplayName = (slug) => {
    // Convert slug to display name
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Export to global scope for other files
window.scaleAmount = scaleAmount;
window.removeAmount = removeAmount;
window.slugToDisplayName = slugToDisplayName;