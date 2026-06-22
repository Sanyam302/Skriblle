import express from "express";
import http from "http";
import { Server } from "socket.io";
import { startRoomTimer } from "./Socket/roomTimer.js";

import { socketHandler } from "./Socket/socketHandlers.js";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
startRoomTimer(io);
socketHandler(io);


server.listen(3000, () => {
  console.log("Server running");
});