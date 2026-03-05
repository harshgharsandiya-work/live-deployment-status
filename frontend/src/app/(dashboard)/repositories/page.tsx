"use client";

import { useState, useEffect } from "react";
import { useRepositories } from "@/hooks/useRepositories";
import { api } from "@/lib/api";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FolderGit2, Loader2, Plus, Github } from "lucide-react";
import Link from "next/link";

export default function RepositoriesPage() {
    const { repositories, githubRepos, isLoading, error, registerRepository } =
        useRepositories();
    const [repoIdInput, setRepoIdInput] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    const [installUrl, setInstallUrl] = useState("");

    useEffect(() => {
        api.get("/auth/github/app-name")
            .then((res) => {
                const appName = res.data.appName;
                setInstallUrl(
                    `https://github.com/apps/${appName}/installations/new`,
                );
            })
            .catch((err) => console.error("Could not fetch app name", err));
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!repoIdInput.trim()) return;

        setFeedback(null);
        setIsRegistering(true);

        const result = await registerRepository({
            githubRepoId: repoIdInput.trim(),
        });

        if (result.success) {
            setFeedback({ type: "success", message: result.message! });
            setRepoIdInput(""); // Clear input on success
        } else {
            setFeedback({ type: "error", message: result.error! });
        }

        setIsRegistering(false);
    };

    return (
        <div className="space-y-8">
            <header className="border-b pb-4">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                    <FolderGit2 className="w-6 h-6 text-indigo-600" />
                    Connected Repositories
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    Manage the GitHub repositories being monitored by your
                    dashboard webhook.
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Add Repository Form */}
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Add New Repository
                            </CardTitle>
                            <CardDescription>
                                Register a repository to automatically create a
                                tracking Webhook on GitHub.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleRegister}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="repoId">
                                        Select GitHub Repository
                                    </Label>
                                    <select
                                        id="repoId"
                                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={repoIdInput}
                                        onChange={(e) =>
                                            setRepoIdInput(e.target.value)
                                        }
                                        disabled={isRegistering || isLoading}
                                    >
                                        <option value="" disabled>
                                            Choose a repository...
                                        </option>
                                        {githubRepos.map((repo) => {
                                            const isConnected =
                                                repositories.some(
                                                    (r) =>
                                                        r.githubRepoId ===
                                                        repo.githubRepoId,
                                                );
                                            return (
                                                <option
                                                    key={repo.githubRepoId}
                                                    value={repo.githubRepoId}
                                                    disabled={isConnected}
                                                >
                                                    {repo.fullname}{" "}
                                                    {isConnected
                                                        ? "(Already Connected)"
                                                        : ""}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <p className="text-xs text-gray-400">
                                        You must have admin access to the
                                        repository to register webhooks.
                                    </p>
                                </div>

                                {feedback && (
                                    <div
                                        className={`p-3 text-sm rounded-md space-y-2 ${
                                            feedback.type === "error"
                                                ? "bg-red-50 text-red-600 border border-red-200"
                                                : "bg-green-50 text-green-700 border border-green-200"
                                        }`}
                                    >
                                        <p>{feedback.message}</p>
                                        {feedback.type === "error" &&
                                            installUrl && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="w-full mt-2 bg-white"
                                                    asChild
                                                >
                                                    <a
                                                        href={installUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        Install GitHub App First
                                                    </a>
                                                </Button>
                                            )}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={
                                        isRegistering || !repoIdInput.trim()
                                    }
                                >
                                    {isRegistering ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Registering...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Connect Repository
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Repositories List */}
                <div className="md:col-span-2 space-y-4">
                    {isLoading ? (
                        <div className="flex h-40 items-center justify-center bg-white rounded-xl border border-gray-100">
                            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
                            {error}
                        </div>
                    ) : repositories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300 text-center">
                            <Github className="w-12 h-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900">
                                No Repositories Connected
                            </h3>
                            <p className="text-gray-500 max-w-sm mt-2">
                                Add a GitHub repository ID on the left to start
                                receiving real-time webhook deployments.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {repositories.map((repo) => (
                                <Link
                                    key={repo.githubRepoId}
                                    href={`/dashboard?repo=${repo.id}`}
                                >
                                    <Card className="hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer h-full">
                                        <CardContent className="p-5 flex items-start justify-between">
                                            <div className="space-y-1 overflow-hidden">
                                                <div className="flex items-center gap-2">
                                                    <FolderGit2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <span className="font-medium text-gray-900 truncate">
                                                        {repo.name}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-500 font-mono truncate">
                                                    {repo.fullname}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
