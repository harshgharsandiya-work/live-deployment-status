import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
    userId: string;
    username: string;
}

interface AuthState {
    token: string | null;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            token: null,
            user: null,

            login: (token: string) => {
                try {
                    // Extract payload from JWT (naive split for demo, typically use jwt-decode)
                    const base64Url = token.split(".")[1];
                    const base64 = base64Url
                        .replace(/-/g, "+")
                        .replace(/_/g, "/");
                    const jsonPayload = decodeURIComponent(
                        atob(base64)
                            .split("")
                            .map(function (c) {
                                return (
                                    "%" +
                                    ("00" + c.charCodeAt(0).toString(16)).slice(
                                        -2,
                                    )
                                );
                            })
                            .join(""),
                    );

                    const decodedUser = JSON.parse(jsonPayload) as User;
                    set({ token, user: decodedUser });
                } catch (error) {
                    console.error("Invalid token during login", error);
                    set({ token: null, user: null });
                }
            },

            logout: () => set({ token: null, user: null }),
        }),
        {
            name: "github-ci-auth-storage", // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
        },
    ),
);
