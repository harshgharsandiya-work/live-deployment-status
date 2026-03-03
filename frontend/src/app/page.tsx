"use client";

import { ConnectionStatus, EventList } from "@/components/github-events";
import { useGithubEvents } from "@/hooks/useGithubEvents";

export default function Home() {
    const { events, isConnected } = useGithubEvents();

    return (
        <main className="min-h-screen bg-gray-50 p-8 text-gray-900">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between mb-8">
                    <h1 className="text-3xl font-bold">
                        CI/CD Deployment Dashboard
                    </h1>
                    <ConnectionStatus isConnected={isConnected} />
                </header>
                <div className="bg-white rounded-lg shadow border p-6">
                    <EventList events={events} />
                </div>
            </div>
        </main>
    );
}
