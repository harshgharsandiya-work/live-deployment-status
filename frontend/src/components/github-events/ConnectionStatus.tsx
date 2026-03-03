interface Props {
    isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: Props) {
    return (
        <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
                {/* Animated ring */}
                <span
                    className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        isConnected
                            ? "bg-green-400 animate-ping"
                            : "bg-red-400 animate-ping"
                    }`}
                ></span>

                {/* Solid center dot */}
                <span
                    className={`relative inline-flex h-3 w-3 rounded-full ${
                        isConnected ? "bg-green-500" : "bg-red-500"
                    }`}
                ></span>
            </span>

            <span className="text-sm font-medium text-gray-600 w-24">
                {isConnected ? "Live" : "Disconnected"}
            </span>
        </div>
    );
}
