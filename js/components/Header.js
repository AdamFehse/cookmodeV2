const Header = ({
    supabase,
    isSupabaseConnected,
}) => {
    const connectionState = supabase
        ? isSupabaseConnected
            ? 'Live'
            : 'Connecting'
        : 'Offline';
    const connectionClass = (() => {
        if (!supabase) return 'tag';
        return isSupabaseConnected ? 'tag contrast' : 'tag';
    })();

    return React.createElement('header', { className: 'page-header' },
        React.createElement('div', { className: 'container-fluid' }, [
            // Top row: Brand + Status
            React.createElement('nav', {
                key: 'nav',
                'aria-label': 'Primary navigation',
                style: { marginBottom: '0.5rem' }
            }, [
                React.createElement('ul', { key: 'brand' }, [
                    React.createElement('li', { key: 'title' }, React.createElement('strong', null, 'CookMode V2'))
                ]),
                React.createElement('ul', { key: 'actions' }, [
                    React.createElement('li', { key: 'status' },
                        React.createElement('span', {
                            className: connectionClass,
                            role: 'status'
                        }, connectionState)
                    )
                ].filter(Boolean))
            ])
        ])
    );
};

window.Header = Header;
