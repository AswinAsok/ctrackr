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
                
                const accessToken = response.data.session.access_token;
                const refreshToken = response.data.session.refresh_token;
                const id = response.data.user.id;
                const email = response.data.user.email;
                const phone =
                    response.data.user.phone || "No phone number provided";

                // Create a single object to store
                const userObject = {
                    accessToken,
                    refreshToken,
                    id,
                    email,
                    phone,
                };

                // Convert the object to a string and store it in local storage
                localStorage.setItem("userObject", JSON.stringify(userObject));
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
