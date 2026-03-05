import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";

export interface Repository {
    id?: string;
    githubRepoId: string;
    name: string;
    fullname: string;
    owner: string;
}

export function useRepositories() {
    const [repositories, setRepositories] = useState<Repository[]>([]);
    const [githubRepos, setGithubRepos] = useState<Repository[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadRepositories = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [dbRes, ghRes] = await Promise.all([
                api.get<Repository[]>("/repos"),
                api.get<Repository[]>("/repos/github"),
            ]);
            setRepositories(dbRes.data);
            setGithubRepos(ghRes.data);
        } catch (err: any) {
            setError(
                err.response?.data?.error || "Failed to fetch repositories.",
            );
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadRepositories();
    }, [loadRepositories]);

    const registerRepository = async (repoDetails: {
        githubRepoId: string;
    }) => {
        try {
            const res = await api.post("/repos", repoDetails);
            // Reload the list to include the newly verified details stored in the DB
            await loadRepositories();
            return { success: true, message: res.data.message };
        } catch (err: any) {
            return {
                success: false,
                error:
                    err.response?.data?.error ||
                    "Failed to register repository.",
            };
        }
    };

    return {
        repositories,
        githubRepos,
        isLoading,
        error,
        loadRepositories,
        registerRepository,
    };
}
