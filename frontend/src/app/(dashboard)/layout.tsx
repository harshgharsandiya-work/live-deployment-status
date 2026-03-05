"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";
import { Activity, FolderGit2, LogOut, Loader2 } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { token, user, logout } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!token) {
            router.push("/");
        }
    }, [token, router]);

    // Prevent hydration mismatch & unauthorized flashing
    if (!mounted || !token) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const navigation = [
        { name: "Live Deployments", href: "/dashboard", icon: Activity },
        { name: "Repositories", href: "/repositories", icon: FolderGit2 },
    ];

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
                <div className="p-6">
                    <h2 className="text-2xl font-bold tracking-tighter text-indigo-600 flex items-center gap-2">
                        <Activity className="w-6 h-6" />
                        DeployWatch
                    </h2>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
                                    isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                            {user?.username?.[0]?.toUpperCase() || "U"}
                        </div>
                        <span className="text-sm font-medium text-gray-700 truncate">
                            {user?.username}
                        </span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="p-8 max-w-6xl mx-auto">{children}</div>
            </main>
        </div>
    );
}
