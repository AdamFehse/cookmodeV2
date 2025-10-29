export const CollapsibleSection = ({ title, children, defaultOpen = true, className = '' }) => {
    return React.createElement('details', {
        className: `collapsible-section ${className}`,
        open: defaultOpen
    }, [
        React.createElement('summary', {
            key: 'summary',
            className: 'collapsible-section-header'
        }, title),
        React.createElement('div', {
            key: 'content',
            className: 'collapsible-section-content'
        }, children)
    ]);
};
