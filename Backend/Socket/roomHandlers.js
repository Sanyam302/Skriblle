import {
  createRoom,
  findAvailableRoom,
  generateUsername
} from "../rooms/roomManager.js";
import { startRoomTimer } from "./roomTimer.js";


export function assignRoom(io,socket,username,avatarSeed) {
  const socketId = socket.id;
  username = username?username:generateUsername();
  
  const player={
  socketId: socket.id,
  username: username,
  avatarSeed: avatarSeed || username,
  score: 0
  }
  let room = findAvailableRoom();
  
  if (!room) {
    room = createRoom(socketId,username);
  }
   const exists =
  room.players.some(
    p => p.socketId === socket.id
  );
  if(exists){
    return null;
  }
  room.players.push(player);
  console.log(room);
  socket.join(room.roomId);
  socket.roomId = room.roomId;
  if (
  room.players.length === 2 &&
  !room.timerStarted && !room.isPrivate
) {
  room.timerStarted = true;

  room.closeAt = Date.now() + 5000;

  room.status = "COUNTDOWN";
  startRoomTimer(io);
  console.log(
    `Timer started for room ${room.roomId}`
  );
}

  socket.roomId = room.roomId;
  console.log(
  `${socket.id} joined room ${room.roomId}`
);

console.log(
  `Players in room: ${room.players.length}`
);
  return room;
}