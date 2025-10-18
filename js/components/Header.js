const Header = ({ cookName, setCookName, supabase, isSupabaseConnected }) => {
    return React.createElement('header', { className: 'container' }, [
        React.createElement('nav', { key: 'nav' }, [
            React.createElement('h1', { key: 'title' }, 'CookModeV2'),
            React.createElement('ul', { key: 'nav-items' }, [
                React.createElement('li', { key: 'status' }, 
                    supabase ? React.createElement('mark', null, 
                        isSupabaseConnected ? 'Live' : 'Connecting'
                    ) : React.createElement('mark', null, 'Offline')
                )
            ])
        ])
    ]);
};

window.Header = Header;
