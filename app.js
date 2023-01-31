const http = require("http");
const express = require("express");
const socket = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static("public"));

server.listen(3000, (_) => {
  console.log("Sever is running on 3000");
});

const activeUsers = new Set();
io.on("connection", (socket) => {
  console.log("A user is connected..");

  socket.on("new user", function (data) {
    console.log("new user start");
    console.log("data", data);
    socket.userId = data;
    console.log("userId", socket.userId);
    activeUsers.add(data);
    console.log("activeusers", [...activeUsers]);
    io.emit("new user", [...activeUsers]);
    console.log("new user end");
  });

  socket.on("disconnect", () => {
    activeUsers.delete(socket.userId);
    io.emit("user disconnected", socket.userId);
    console.log(activeUsers);
  });

  socket.on("chat message", function (data) {
    io.emit("chat message", data);
  });

  socket.on("typing", function (data) {
    console.log("typing");
    socket.broadcast.emit("typing", data);
    console.log("typing ends");
  });
});
