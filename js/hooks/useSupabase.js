// Custom hook for Supabase initialization and connection
const useSupabase = () => {
    const [supabase, setSupabase] = React.useState(null);
    const [isSupabaseConnected, setIsSupabaseConnected] = React.useState(false);

    React.useEffect(() => {
        const supabaseConfig = window.SUPABASE_CONFIG;
        if (supabaseConfig && window.supabase) {
            const client = window.supabase.createClient(
                supabaseConfig.url,
                supabaseConfig.anonKey
            );
            setSupabase(client);
        } else {
            console.warn('⚠️ Supabase not configured. Update supabase-config.js with your credentials.');
        }
    }, []);

    return { supabase, isSupabaseConnected, setIsSupabaseConnected };
};

// Export to global scope
window.useSupabase = useSupabase;