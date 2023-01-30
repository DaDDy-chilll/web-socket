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

io.on("connection", (socket) => {
  console.log("A user is connected..");
});
