const http = require('http');

const app = require('./src/app');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
   cors: {
      origin: 'http://localhost:5173',
   },
});
let onlineUsers = [];

io.on('connection', (socket) => {
   // console.log(`New connection: `, socket.id);

   // Listen to a connection when a user logs in (online)
   socket.on('addNewUser', (userId) => {
      !onlineUsers.some((user) => user.userId === userId) &&
         userId !== null &&
         onlineUsers.push({ userId, socketId: socket?.id });
      io.emit('getOnlineUsers', onlineUsers);
   });

   // Listen to a connection when a user sends a message
   socket.on('sendMessage', (data) => {
      // console.log(`Message received: `, data);
      const recipient = onlineUsers.find(
         (user) => user.userId === data.recipientId
      );
      if (recipient) {
         io.to(recipient.socketId).emit('getMessage', data);
         io.to(recipient.socketId).emit('getNotification', {
            senderId: data.senderId,
            isRead: false,
            date: new Date(),
         });
      }
   });

   // Listen to a connection when a user logs out (offline)
   socket.on('disconnect', () => {
      console.log(`User disconnected: `, socket.id);
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit('getOnlineUsers', onlineUsers);
   });
});

module.exports = { io, server };
