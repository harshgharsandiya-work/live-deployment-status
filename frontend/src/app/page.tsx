"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Github } from "lucide-react";

export default function LandingPage() {
    const router = useRouter();
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        if (token) {
            router.push("/dashboard");
        }
    }, [token, router]);

    const handleLogin = () => {
        window.location.href = "http://localhost:4000/api/auth/github";
    };

    // If we have a token, we render nothing while it redirects.
    if (token) return null;

    return (
        <main className="min-h-screen flex flex-col justify-center items-center bg-gray-50 text-gray-900 p-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center space-y-8 transition-all hover:shadow-2xl hover:-translate-y-1 duration-300">
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                    <Github className="w-10 h-10" />
                </div>

                <div className="space-y-3">
                    <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                        DeployWatch
                    </h1>
                    <p className="text-gray-500 font-medium">
                        Real-time CI/CD Deployment Dashboard. Connect your
                        repositories and track GitHub webhook events instantly.
                    </p>
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleLogin}
                        className="w-full relative group overflow-hidden rounded-xl bg-indigo-600 px-6 py-4 font-semibold text-white shadow-lg transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            <Github className="w-5 h-5" />
                            Continue with GitHub
                        </span>
                        <div className="absolute inset-0 h-full w-full bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                    </button>
                    <p className="mt-4 text-xs text-gray-400">
                        You'll be redirected to authorize the app.
                    </p>
                </div>
            </div>
        </main>
    );
}
