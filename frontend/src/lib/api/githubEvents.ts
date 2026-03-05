import { GithubEvent } from "@/types/event.types";
import { api } from "@/lib/api";

export async function fetchGithubEvents() {
    const res = await api.get<GithubEvent[]>("/events");
    return res.data;
}
