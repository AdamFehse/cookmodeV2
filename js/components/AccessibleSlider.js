/**
 * AccessibleSlider - Touch-friendly, accessible order scaling
 * Works great with gloves, wet hands, on mobile
 * Keyboard support (arrow keys), large touch targets
 */
const AccessibleSlider = ({ value = 1, min = 1, max = 50, onChange, label = 'Orders' }) => {
    const { useRef, useCallback } = React;
    const inputRef = useRef(null);
    const sliderId = `slider-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = useCallback((e) => {
        const newValue = parseInt(e.target.value, 10);
        if (onChange && !isNaN(newValue)) {
            onChange(newValue);
        }
    }, [onChange]);

    // Keyboard support
    const handleKeyDown = useCallback((e) => {
        if (!inputRef.current) return;

        let newValue = parseInt(inputRef.current.value, 10);

        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
            e.preventDefault();
            newValue = Math.min(newValue + 1, max);
            if (onChange) onChange(newValue);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
            e.preventDefault();
            newValue = Math.max(newValue - 1, min);
            if (onChange) onChange(newValue);
        } else if (e.key === 'Home') {
            e.preventDefault();
            if (onChange) onChange(min);
        } else if (e.key === 'End') {
            e.preventDefault();
            if (onChange) onChange(max);
        }
    }, [min, max, onChange]);

    // Calculate slider fill percentage
    const fillPercent = ((value - min) / (max - min)) * 100;

    return React.createElement('div', {
        className: 'accessible-slider-wrapper',
        style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            width: '100%'
        }
    }, [
        React.createElement('div', {
            key: 'label-row',
            style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }
        }, [
            React.createElement('label', {
                key: 'label',
                htmlFor: sliderId,
                style: {
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    color: 'var(--text-primary)'
                }
            }, label),
            React.createElement('span', {
                key: 'value',
                className: 'slider-value-display',
                style: {
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--color-primary)',
                    textShadow: '0 0 10px rgba(0, 217, 255, 0.5)',
                    minWidth: '3rem',
                    textAlign: 'right'
                }
            }, `${value}×`)
        ]),

        // Slider with visual fill background
        React.createElement('div', {
            key: 'slider-container',
            style: {
                position: 'relative',
                width: '100%'
            }
        }, [
            // Background fill (visual feedback)
            React.createElement('div', {
                key: 'fill-background',
                style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '100%',
                    width: `${fillPercent}%`,
                    background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                    borderRadius: '12px',
                    opacity: 0.15,
                    pointerEvents: 'none',
                    zIndex: 0,
                    transition: 'width 0.1s ease'
                }
            }),

            // Actual input slider
            React.createElement('input', {
                key: 'slider-input',
                ref: inputRef,
                id: sliderId,
                type: 'range',
                min: min,
                max: max,
                value: value,
                onChange: handleChange,
                onKeyDown: handleKeyDown,
                className: 'order-slider-accessible',
                style: {
                    position: 'relative',
                    zIndex: 1,
                    width: '100%',
                    height: '3rem', // Large touch target for gloved hands
                    appearance: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '0.75rem 0', // Vertical padding for better touch
                    margin: 0
                }
                // Browser-specific slider styling via CSS
            }),
        ]),

        // Quick preset buttons for common values
        React.createElement('div', {
            key: 'presets',
            style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.5rem',
                marginTop: '0.5rem'
            }
        }, [1, 2, 5, 10].map(preset =>
            React.createElement('button', {
                key: `preset-${preset}`,
                type: 'button',
                onClick: () => onChange?.(preset),
                style: {
                    padding: '0.5rem',
                    background: value === preset ? 'var(--color-primary)' : 'rgba(0, 217, 255, 0.1)',
                    border: `2px solid ${value === preset ? 'var(--color-primary)' : 'rgba(0, 217, 255, 0.3)'}`,
                    color: value === preset ? '#000000' : 'var(--text-primary)',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                    boxShadow: value === preset ? '0 0 12px rgba(0, 217, 255, 0.4)' : 'none'
                }
            }, `${preset}×`)
        ))
    ]);
};

window.AccessibleSlider = AccessibleSlider;
