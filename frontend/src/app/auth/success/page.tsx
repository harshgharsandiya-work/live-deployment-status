"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

function AuthSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            login(token);
            router.push("/dashboard");
        } else {
            router.push("/");
        }
    }, [searchParams, login, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h2 className="text-xl font-semibold text-gray-700">
                    Authenticating...
                </h2>
            </div>
        </div>
    );
}

export default function AuthSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthSuccessContent />
        </Suspense>
    );
}
