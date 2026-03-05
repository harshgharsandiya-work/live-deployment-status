"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ConnectionStatus, EventList } from "@/components/github-events";
import { useGithubEvents } from "@/hooks/useGithubEvents";
import { useRepositories } from "@/hooks/useRepositories";

function DashboardContent() {
    const searchParams = useSearchParams();
    const [selectedRepoFilter, setSelectedRepoFilter] = useState<string>("");

    useEffect(() => {
        const repoFromUrl = searchParams.get("repo");
        if (repoFromUrl) {
            setSelectedRepoFilter(repoFromUrl);
        }
    }, [searchParams]);
    const {
        events,
        isConnected,
        isLoading: eventsLoading,
    } = useGithubEvents(selectedRepoFilter || undefined);
    const { repositories, isLoading: reposLoading } = useRepositories();

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Live Deployments
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Real-time feed of CI/CD events across your connected
                        repositories.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* Repository Filter Dropdown */}
                    <div className="flex items-center gap-2">
                        <select
                            className="h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 disabled:opacity-50"
                            value={selectedRepoFilter}
                            onChange={(e) =>
                                setSelectedRepoFilter(e.target.value)
                            }
                            disabled={reposLoading}
                        >
                            <option value="">All Repositories</option>
                            {repositories.map((repo) => (
                                <option
                                    key={repo.id || repo.githubRepoId}
                                    value={repo.id}
                                >
                                    {repo.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <ConnectionStatus isConnected={isConnected} />
                </div>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                {eventsLoading || (reposLoading && !events.length) ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <EventList events={events} />
                )}
            </div>
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<div>Loading dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
