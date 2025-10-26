/**
 * ChecklistItem.js - Reusable checklist item component
 *
 * Renders a single checkbox item with label. Used for:
 * - Ingredient and step lists within the RecipeModal
 *
 * Handles different sizes and layouts.
 */

const ChecklistItem = ({
    id = '',
    label = '',
    checked = false,
    onChange = () => {},
    variant = 'default', // 'default', 'compact', 'step'
    disabled = false,
    className = ''
}) => {
    const variantClasses = {
        default: 'checklist-item',
        compact: 'checklist-item checklist-item-compact',
        step: 'checklist-item checklist-item-step'
    };

    const itemClass = `${variantClasses[variant] || variantClasses.default} ${checked ? 'checked' : ''} ${className}`;

    return React.createElement('label', {
        className: itemClass,
        htmlFor: id
    }, [
        React.createElement('input', {
            key: 'checkbox',
            id: id,
            type: 'checkbox',
            checked: checked,
            onChange: (e) => onChange(e.target.checked),
            disabled: disabled,
            className: 'checklist-checkbox'
        }),
        React.createElement('span', {
            key: 'text',
            className: 'checklist-text'
        }, label)
    ]);
};

window.ChecklistItem = ChecklistItem;
