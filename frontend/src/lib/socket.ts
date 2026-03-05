import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/authStore";

const SOCKET_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";

// Ensure we get the latest token when connecting
export const socket: Socket = io(SOCKET_URL, {
    autoConnect: false,
    auth: (cb) => {
        const token = useAuthStore.getState().token;
        cb({ token });
    },
});
