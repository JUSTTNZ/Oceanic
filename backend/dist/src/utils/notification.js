import { getIO } from '../config/socket.js';
export const sendUserNotification = async (userId, message) => {
    console.log(`[NOTIFY] User(${userId}): ${message}`);
    const io = getIO();
    io.emit(`user:${userId}`, { message });
};
export const sendAdminNotification = async (message) => {
    console.log(`[NOTIFY] Admin: ${message}`);
    const io = getIO();
    io.emit('admin', { message });
};
//# sourceMappingURL=notification.js.map