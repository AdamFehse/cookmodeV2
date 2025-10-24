const MethodsModal = ({ recipeName, steps, completedSteps, onToggleStep, onClose, onMarkComplete }) => {
    const { useState } = React;

    if (!steps || steps.length === 0) {
        return React.createElement('dialog', {
            open: true,
            className: 'methods-modal',
            onClose: onClose,
            onClick: (e) => { if (e.target.tagName === 'DIALOG') onClose?.(); }
        }, [
            React.createElement('header', { key: 'header', className: 'methods-modal-header' }, [
                React.createElement('h2', { key: 'title' }, `${recipeName} - Methods`),
                React.createElement('a', {
                    key: 'close',
                    href: '#close',
                    className: 'close',
                    onClick: (event) => {
                        event.preventDefault();
                        onClose?.();
                    }
                })
            ]),
            React.createElement('div', { key: 'content', className: 'methods-modal-content' },
                React.createElement('p', { className: 'muted' }, 'No steps available.')
            ),
            React.createElement('footer', { key: 'footer', className: 'methods-modal-footer' }, [
                React.createElement('button', {
                    key: 'close-btn',
                    type: 'button',
                    className: 'secondary',
                    onClick: onClose
                }, 'Close')
            ])
        ]);
    }

    // Calculate progress
    const stepsCompleted = steps.filter((_, idx) => completedSteps[idx]).length;
    const totalSteps = steps.length;

    return React.createElement('dialog', {
        open: true,
        className: 'methods-modal',
        onClose: onClose,
        onClick: (e) => { if (e.target.tagName === 'DIALOG') onClose?.(); }
    }, [
        // Header
        React.createElement('header', { key: 'header', className: 'methods-modal-header' }, [
            React.createElement('div', { key: 'title-section' }, [
                React.createElement('h2', { key: 'title' }, `${recipeName}`),
                React.createElement('p', { key: 'subtitle', className: 'muted' }, 'Preparation Methods')
            ]),
            React.createElement('a', {
                key: 'close',
                href: '#close',
                className: 'close',
                onClick: (event) => {
                    event.preventDefault();
                    onClose?.();
                }
            })
        ]),

        // Progress section
        React.createElement('div', { key: 'progress-section', className: 'methods-progress-section' }, [
            React.createElement('div', { key: 'progress-label' }, [
                React.createElement('span', { key: 'text' }, 'Progress:'),
                React.createElement('span', { key: 'count', className: 'methods-progress-count' }, `${stepsCompleted}/${totalSteps}`)
            ]),
            React.createElement('progress', { key: 'bar', value: stepsCompleted, max: totalSteps })
        ]),

        // Main content: Steps list
        React.createElement('div', { key: 'content', className: 'methods-modal-content' },
            React.createElement('ol', { className: 'methods-steps-list' },
                steps.map((step, idx) => {
                    const isCompleted = completedSteps[idx];
                    return React.createElement('li', {
                        key: `step-${idx}`,
                        className: `methods-step-item ${isCompleted ? 'checked' : ''}`
                    }, [
                        React.createElement('label', { key: 'label', className: 'methods-step-label' }, [
                            React.createElement('input', {
                                key: 'checkbox',
                                type: 'checkbox',
                                checked: isCompleted,
                                onChange: () => onToggleStep(idx),
                                className: 'methods-step-checkbox'
                            }),
                            React.createElement('span', { key: 'text', className: 'methods-step-text' }, step)
                        ])
                    ]);
                })
            )
        ),

        // Footer with action buttons
        React.createElement('footer', { key: 'footer', className: 'methods-modal-footer' }, [
            React.createElement('button', {
                key: 'mark-complete',
                type: 'button',
                className: 'primary',
                onClick: onMarkComplete
            }, 'Mark All Steps Complete'),
            React.createElement('button', {
                key: 'close-btn',
                type: 'button',
                className: 'secondary',
                onClick: onClose
            }, 'Close')
        ])
    ]);
};

window.MethodsModal = MethodsModal;
