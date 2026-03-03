"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";
import { GithubEvent } from "@/types/event.types";

export function useGithubEvents() {
    const [events, setEvents] = useState<GithubEvent[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socket.connect();

        socket.on("connect", () => {
            setIsConnected(true);
            console.log("Connected to WebSocket server");
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
            console.log("Disconnected from WebSocket server");
        });

        //listen to new_github_event event from backend
        socket.on("new_github_event", (newEvent: GithubEvent) => {
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
        });

        //cleanup on unmount
        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("new_github_event");
            socket.disconnect();
        };
    }, []);

    return { events, isConnected };
}
