import { SupabaseClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";

export const login = async (
    username: string,
    password: string,
    supabase: SupabaseClient<any, "public", any>
) => {
    await supabase.auth
        .signInWithPassword({
            email: username,
            password: password,
        })
        .then((response: any) => {
            if (response.error) {
                toast.error(response.error.message);
            } else {
                toast.success("Logged in successfully!");
            }
        })
        .catch((error: any) => {
            toast.error(error.error_description || error.message);
        });
};

export const signup = async (
    email: string,
    password: string,
    supabase: SupabaseClient<any, "public", any>
) => {
    await supabase.auth
        .signUp({
            email: email,
            password: password,
        })
        .then((response: any) => {
            if (response.error) {
                toast.error(response.error.message);
            } else {
                toast.success("Signed up successfully!");
            }
        })
        .catch((error: any) => {
            toast.error(error.error_description || error.message);
        });
};
