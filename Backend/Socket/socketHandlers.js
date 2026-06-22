import { assignRoom } from "./roomHandlers.js";

import { registerDrawingEvents } from "./drawingHandler.js"

import { registerChatEvents } from "./ChatHandler.js";

import { removeUser } from "../rooms/roomManager.js";

import { startRoundTimer } from "../game/gameManager.js";
import { registerGuessHandlers } from "../game/guessHandlers.js";

import { rooms } from "../rooms/roomManager.js";
import { createRoom } from "../rooms/roomManager.js";
import { startRound } from "../game/gameManager.js";

export function socketHandler(io) {

  io.on("connection", (socket) => {

   

    registerDrawingEvents(socket);
    registerChatEvents(io, socket);
     registerGuessHandlers(
    io,
    socket
  );
     
    socket.on(
      "quick_play",
      ({ username }) => {

        const room =
          assignRoom(
            io,
            socket,
            username
          ); 
          if (!room) {
            socket.emit(
              "error",
              "Username already taken in this room."
            );
            return;
          }

        io.to(room.roomId).emit(
          "room_update",
          room
        );
       
        socket.emit(
          "room_joined",
          room
        );
      }
    );
   

socket.on(
  "word_selected",
  (word) => {

    const room = rooms.get(
      socket.roomId
    );

    if (!room) return;

    room.currentWord = word;

    room.status = "DRAWING";

    function hideWord(word) {
  return word
    .split("")
    .map(() => "_")
    .join(" ");
}

const hiddenWord =
  hideWord(word);

  const drawer =
  room.players[
    room.currentDrawerIndex
  ];

  room.currentHint =
  hideWord(word);

  io.to(
  drawer.socketId
).emit(
  "word_hint",
  {
    hint: word
  }
);

socket.to(room.roomId).emit(
  "word_hint",
  {
    hint: hiddenWord
  }
);
    

   

    io.to(room.roomId).emit(
      "room_update",
      room
    );

    startRoundTimer(
      io,
      room
    );
  }
);
socket.on(
  "play_again",
  () => {

    deleteRoom(
      socket.roomId
    );

  }
);


socket.on(
  "create_private_room",
  ({
    username,
    maxPlayers,
    maxRounds,
    drawTime
  }) => {

    const room =
      createRoom(
        socket.id,
        username
      );

    const oldRoomId =
      room.roomId;

    const roomCode =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    room.roomId =
      roomCode;

    room.maxPlayers =
      maxPlayers;

    room.maxRounds =
      maxRounds;

    room.drawTime =
      drawTime;

    room.isPrivate =
      true;

    rooms.delete(
      oldRoomId
    );
    const player={
  socketId: socket.id,
  username: username,
  score: 0
  }
   room.players.push(player);
    rooms.set(
      roomCode,
      room
    );

    socket.join(
      roomCode
    );

    socket.roomId =
      roomCode;
    room.hostId =
  socket.id;

room.isPrivate =
  true;

room.status =
  "LOBBY";
    io.emit(
      "room_joined",
      room
    );
  
  }
);

socket.on(
  "join_private_room",
  ({
    username,
    roomCode
  }) => {
     
    const room =
      rooms.get(
        roomCode
      );

    if (!room) {

      socket.emit(
        "error",
        "Room not found"
      );

      return;
    }

    if (
      room.players.length >=
      room.maxPlayers
    ) {

      socket.emit(
        "error",
        "Room is full"
      );

      return;
    }

    room.players.push({
      socketId:
        socket.id,

      username,

      score: 0
    });
    room.status="LOBBY"
    socket.join(
      roomCode
    );

    socket.roomId =
      roomCode;

    io.to(roomCode).emit(
      "room_update",
      room
    );

    socket.emit(
      "room_joined",
      room
    );


  }
);



socket.on(
  "start_private_game",
  () => {

    const room =
      rooms.get(
        socket.roomId
      );

    if (!room) {
      return;
    }

    // Only host can start
    if (
      room.hostId !==
      socket.id
    ) {
      return;
    }

    // Minimum 2 players
    if (
      room.players.length < 2
    ) {

      socket.emit(
        "error",
        "Need at least 2 players"
      );

      return;
    }

    

    startRound(
      io,
      room
    );

  }
);
    socket.on("disconnect", () => {

      removeUser(
        socket.roomId,
        socket.id
      );

      
    });

  });

}