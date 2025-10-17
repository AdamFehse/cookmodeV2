const Header = ({ cookName, setCookName, supabase, isSupabaseConnected }) => {
    return React.createElement('div', {
        className: 'flex items-center justify-between mb-8 gap-4 flex-wrap'
    }, [
        React.createElement('h1', {
            key: 'title',
            className: 'text-4xl font-bold'
        }, 'CookMode V2'),

        React.createElement('div', {
            key: 'controls',
            className: 'flex items-center gap-3'
        }, [
            // Connection Status
            supabase && React.createElement('div', {
                key: 'status',
                className: `flex items-center gap-2 px-3 py-2 rounded-full text-xs font-semibold ${
                    isSupabaseConnected
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                }`
            }, [
                React.createElement('div', {
                    key: 'dot',
                    className: `w-2 h-2 rounded-full ${
                        isSupabaseConnected ? 'bg-green-500' : 'bg-gray-400'
                    }`
                }),
                React.createElement('span', {
                    key: 'text'
                }, isSupabaseConnected ? 'Live' : 'Connecting...')
            ])
        ].filter(Boolean))
    ]);
};

// Export to global scope
window.Header = Header;