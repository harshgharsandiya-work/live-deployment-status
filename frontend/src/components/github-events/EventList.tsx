import { GithubEvent } from "@/types/event.types";
import { EventCard } from "@/components/github-events/EventCard";

interface Props {
    events: GithubEvent[];
}

export function EventList({ events }: Props) {
    if (!events.length) {
        return (
            <p className="text-gray-500 text-center py-10">
                Waiting for Github Events...
            </p>
        );
    }

    return (
        <div className="space-y-4">
            {events.map((event) => (
                <EventCard key={event.githubEventId} event={event} />
            ))}
        </div>
    );
}
