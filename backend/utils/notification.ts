import { getIO } from '../config/socket.js';

export const sendUserNotification = async (userId: string, message: string) => {
  console.log(`[NOTIFY] User(${userId}): ${message}`);
  const io = getIO();
  io.emit(`user:${userId}`, { message });
};

export const sendAdminNotification = async (message: string) => {
  console.log(`[NOTIFY] Admin: ${message}`);
  const io = getIO();
  io.emit('admin', { message });
};
