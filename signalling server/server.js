const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
  cors:{
    origin:"*"
  }
});

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('a user connected');
  
    // Handle joining a room
    socket.on('join-room', (roomName) => {
      socket.join(roomName);
      console.log(`User joined room: ${roomName}`);
      
      // Notify others in the room that the user has joined
      socket.to(roomName).emit('user-joined', `User joined room: ${roomName}`);
    });
  
    // Handle WebRTC signaling messages
    socket.on('offer', ({offer,roomName}) => {
      console.log('Received offer:', offer);
      
      // Send the offer to all in the room except the sender
      socket.to(roomName).emit('offer', offer);
    });
  
    socket.on('answer', ({answer,  roomName}) => {
      console.log('Received answer:', answer);
      
      // Send the answer to all in the room except the sender
      socket.to(roomName).emit('answer', answer);
    });
  
    socket.on('ice-candidate', (candidate, targetSocketId, roomName) => {
      console.log('Received ICE candidate:', candidate);
      
      // Send the ICE candidate to all in the room except the sender
      socket.to(roomName).broadcast.emit('ice-candidate', candidate);
    });
  
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
  
  const port = 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});