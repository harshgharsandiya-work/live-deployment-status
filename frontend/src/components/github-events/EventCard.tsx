import { GithubEvent } from "@/types/event.types";

interface Props {
    event: GithubEvent;
}

export function EventCard({ event }: Props) {
    const statusColor =
        event.status === "success" || event.status === "completed"
            ? "bg-green-100 text-green-700"
            : event.status === "failure"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700";

    return (
        <div className="p-4 border border-gray-100 rounded-md shadow-sm flex justify-between bg-gray-50">
            <div>
                <h3 className="font-semibold text-lg">{event.repoName}</h3>
                <p className="text-sm text-gray-600">
                    {event.eventType} by {event.author} on{" "}
                    <span className="font-mono bg-gray-200 px-1 rounded">
                        {event.branch}
                    </span>
                </p>
                <p className="text-sm text-gray-700 mt-1">{event.message}</p>
            </div>

            <div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusColor}`}
                >
                    {" "}
                    {event.status}
                </span>
                <span className="text-xs text-gray-400 mt-2">
                    {new Date(event.updatedAt).toLocaleTimeString()}
                </span>
            </div>
        </div>
    );
}
