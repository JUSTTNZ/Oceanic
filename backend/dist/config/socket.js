import { Server } from 'socket.io';
let io;
export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ['http://localhost:3000', 'https://oceanic-charts.vercel.app'],
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);
        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
};
export const getIO = () => {
    if (!io) {
        if (process.env.NODE_ENV === 'production')
            return {}; // Dummy fallback
        throw new Error("Socket.IO has not been initialized. Call initSocket(server) first.");
    }
    return io;
};
export { io };
//# sourceMappingURL=socket.js.map