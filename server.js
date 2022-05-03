require("dotenv").config();
const db = require('./config/database');
const socketio = require('socket.io');
const http = require('http');

const app = require("./app");
const server = http.createServer(app);
const io = socketio(server, { cors: {origin: "*"}} );

let users = [];

const addUser = (userId, socketId)=>{
  !users.some(user=>user.userId == userId)&&
    users.push({userId, socketId});
}

const removeUser = (socketId)=>{
  users = users.filter(user=>user.socketId != socketId);
}

const getUser = (userId)=>{
  return users.find(user=>user.userId == userId)
}

io.on('connection', (socket) => {
    //login
    socket.on("addUser", userId=>{
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });

    //messages
    socket.on("send_message", function (data) {
      const user = getUser(data.reciever_id)
      if(user){
        io.to(user.socketId).emit("get_message", data);
      }

      db.execute(`INSERT INTO chat(sender_id, reciever_id, message, msg_time) VALUES (?, ?, ?, ?)`, 
      [data.sender_id, data.reciever_id, data.message, data.msg_time]);
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