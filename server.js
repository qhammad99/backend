require("dotenv").config();
const socketio = require('socket.io');
const http = require('http');

const app = require("./app");
const server = http.createServer(app);
const io = socketio(server, { cors: {origin: "*"}} );

let users = [];
io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id);
    socket.on("new_message", function (data) {
      io.emit("new_message", data);
  });
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
});

server.listen(process.env.PORT, () => {
    console.log(`server running on, http://localhost:${process.env.PORT}`);
});