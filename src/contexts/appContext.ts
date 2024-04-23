import { SupabaseClient } from "@supabase/supabase-js";
import { createContext } from "react";

const AppContext = createContext({
    supabase: null as SupabaseClient | null,
});

export default AppContext;
