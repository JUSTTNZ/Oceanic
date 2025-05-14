import { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';

let io: Server;

export const initSocket = (server: HTTPServer) => {
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


export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized. Call initSocket(server) first.");
  }
  return io;
};

export { io };