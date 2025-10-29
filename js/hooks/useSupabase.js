import { SUPABASE_CONFIG } from '../../supabase-config.js';

// Custom hook for Supabase initialization and connection
export const useSupabase = () => {
    const [supabase, setSupabase] = React.useState(null);
    const [isSupabaseConnected, setIsSupabaseConnected] = React.useState(false);

    React.useEffect(() => {
        if (SUPABASE_CONFIG && window.supabase) {
            const client = window.supabase.createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey
            );
            setSupabase(client);
        } else {
            console.warn('Supabase not configured. Update supabase-config.js with your credentials.');
        }
    }, []);

    return { supabase, isSupabaseConnected, setIsSupabaseConnected };
};
