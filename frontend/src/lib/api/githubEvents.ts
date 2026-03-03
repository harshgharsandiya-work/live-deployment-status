import { GithubEvent } from "@/types/event.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

export async function fetchGithubEvents() {
    const res = await fetch(`${API_URL}/events`);

    if (!res.ok) {
        throw new Error("Failed to fetch Github Events");
    }

    return res.json();
}
