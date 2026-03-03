interface Props {
    isConnected: boolean;
}

export function ConnectionStatus({ isConnected }: Props) {
    return (
        <div className="flex items-center gap-2">
            <span
                className={`h-3 w-3 rounded-full ${
                    isConnected ? "bg-green-500" : "bg-red-500"
                }`}
            ></span>

            <span className="text-sm font-medium text-gray-600">
                {isConnected ? "Live" : "Disconnected"}
            </span>
        </div>
    );
}
