require("dotenv").config();
const db = require('./config/database');
const socketio = require('socket.io');
const http = require('http');
const express = require('express');

const app = require("./app");
//for html page loading, find socket folder in root directory to run static files from there
app.use(express.static('socket'));

const server = http.createServer(app);
const io = socketio(server, { cors: {origin: "*"}} );

let users = [];

//function for socket
const addUser = (userId, socketId)=>{
    users.push({userId, socketId});
}

const removeUser = (socketId)=>{
  users = users.filter(user=>user.socketId != socketId);
}

const getUser = (userId)=>{
  return users.filter(user=>user.userId == userId)
}

//socket
io.on('connection', (socket) => {
    //login
    socket.on("addUser", userId=>{
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    //messages
    socket.on("send_message", function (data) {
      db.execute(`INSERT INTO chat(sender_id, reciever_id, message, msg_time) VALUES (?, ?, ?, ?)`, 
      [data.sender_id, data.reciever_id, data.message, data.msg_time]);

      const sender = getUser(data.sender_id)
      if(sender.length != 0 ){
        sender.forEach((item)=>io.to(item.socketId).emit("message_sended", data))
      }

      const user = getUser(data.reciever_id)
      if(user.length !=0 ){
        user.forEach((item)=>io.to(item.socketId).emit("get_message", data))
      }      
    });

    //logout
    socket.on('disconnect', () => {
      removeUser(socket.id);
      io.emit("getUsers", users)
    });
});

server.listen(process.env.PORT, () => {
    console.log(`server running on, http://localhost:${process.env.PORT}`);
});