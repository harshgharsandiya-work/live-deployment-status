"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { GithubEvent } from "@/types/event.types";
import { fetchGithubEvents } from "@/lib/api/githubEvents";
import { api } from "@/lib/api";

export function useGithubEvents(filterRepositoryId?: string) {
    const [events, setEvents] = useState<GithubEvent[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function initialize() {
            if (!isMounted) return;
            await loadInitialEvents();
            initSocket();
        }

        initialize();

        return () => {
            isMounted = false;
            cleanup();
        };
    }, [filterRepositoryId]);

    //fetch inital events
    async function loadInitialEvents() {
        try {
            const data = await fetchGithubEvents();
            // Filter initially if a repository is specified
            if (filterRepositoryId) {
                setEvents(
                    data.filter((e) => e.repositoryId === filterRepositoryId),
                );
            } else {
                setEvents(data);
            }
        } catch (error) {
            console.error("Error fetching events: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function initSocket() {
        socket.connect();

        socket.on("connect", async () => {
            setIsConnected(true);
            console.log("Connected to WebSocket server");

            // Fetch connected repos and join rooms
            try {
                const res = await api.get("/repos");
                const connectedRepos = res.data;
                connectedRepos.forEach((repo: any) => {
                    if (!filterRepositoryId || repo.id === filterRepositoryId) {
                        socket.emit("join-room", `repo_${repo.id}`);
                    }
                });
            } catch (err) {
                console.error("Failed to load repos for socket rooms", err);
            }
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
            console.log("Disconnected from WebSocket server");
        });

        socket.on("new_github_event", handleIncomingEvent);
    }

    //listen to new_github_event event from backend
    function handleIncomingEvent(newEvent: GithubEvent) {
        // Drop the event if we are filtering by a different repository
        if (
            filterRepositoryId &&
            newEvent.repositoryId !== filterRepositoryId
        ) {
            return;
        }

        setEvents((prevEvents) => {
            //if event aldready exist, update it
            const exists = prevEvents.findIndex(
                (e) => e.githubEventId === newEvent.githubEventId,
            );

            if (exists !== -1) {
                const updatedEvents = [...prevEvents];
                updatedEvents[exists] = newEvent;
                return updatedEvents;
            }

            //else add top of list
            return [newEvent, ...prevEvents];
        });
    }

    function cleanup() {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("new_github_event", handleIncomingEvent);
        socket.disconnect();
    }

    return { events, isConnected, isLoading };
}
