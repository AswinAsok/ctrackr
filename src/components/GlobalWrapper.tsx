import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import AppContext from "../contexts/appContext";
import { createClient } from "@supabase/supabase-js";

const GlobalWrapper = () => {
  return (
    <AppContext.Provider
      value={{
        supabase: createClient(
          import.meta.env.VITE_SUPABASE_URL,
          import.meta.env.VITE_SUPABASE_ANON_KEY
        ),
      }}
    >
      <Suspense fallback={<p>Loading...</p>}>
        <Outlet />
      </Suspense>
    </AppContext.Provider>
  );
};

export default GlobalWrapper;
