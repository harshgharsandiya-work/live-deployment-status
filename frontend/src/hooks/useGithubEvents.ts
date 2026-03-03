"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { GithubEvent } from "@/types/event.types";
import { fetchGithubEvents } from "@/lib/api/githubEvents";

export function useGithubEvents() {
    const [events, setEvents] = useState<GithubEvent[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadInitialEvents();
        initSocket();

        //cleanup on unmount
        return cleanup;
    }, []);

    //fetch inital events
    async function loadInitialEvents() {
        try {
            const [data] = await Promise.all([
                fetchGithubEvents(),
                new Promise((resolve) => setTimeout(resolve, 2200)),
            ]);
            setEvents(data);
        } catch (error) {
            console.error("Error fetching events: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    function initSocket() {
        socket.connect();

        socket.on("connect", () => {
            setTimeout(() => {
                setIsConnected(true);
            }, 2100);
            console.log("Connected to WebSocket server");
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
            console.log("Disconnected from WebSocket server");
        });

        socket.on("new_github_event", handleIncomingEvent);
    }

    //listen to new_github_event event from backend
    function handleIncomingEvent(newEvent: GithubEvent) {
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
