import { SupabaseClient } from "@supabase/supabase-js";
import toast from "react-hot-toast";
import { NavigateFunction } from "react-router-dom";

export const login = async (
    username: string,
    password: string,
    supabase: SupabaseClient<any, "public", any>,
    navigate: NavigateFunction,
    setLoading: (loading: boolean) => void
) => {
    setLoading(true);
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
                const phone = response.data.user.phone || "No phone number provided";

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
                navigate("/rooms");
            }
        })
        .catch((error: any) => {
            toast.error(error.error_description || error.message);
        })
        .finally(() => {
            setLoading(false);
        });
};

export const signup = async (
    email: string,
    password: string,
    fullName: string,
    phoneNumber: string,
    admissionNumber: string,
    supabase: SupabaseClient<any, "public", any>,
    navigate: NavigateFunction
) => {
    await supabase.auth
        .signUp({
            email: email,
            password: password,
        })
        .then(async (response: any) => {
            if (response.error) {
                toast.error(response.error.message);
            } else {
                const { error } = await supabase.auth.updateUser({
                    data: {
                        full_name: fullName,
                        phone_number: phoneNumber,
                        admission_number: admissionNumber,
                    },
                });

                if (error) {
                    toast.error(error.message);
                    console.log("Iavdae ann Error ayae");
                } else {
                    toast.success("Signed up successfully!");
                    navigate("/");
                }
            }
        })
        .catch((error: any) => {
            toast.error(error.error_description || error.message);
        });
};
