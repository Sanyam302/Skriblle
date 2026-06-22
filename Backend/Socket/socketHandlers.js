import { assignRoom } from "./roomHandlers.js";

import { registerDrawingEvents } from "./drawingHandler.js"

import { registerChatEvents } from "./ChatHandler.js";

import { removeUser } from "../rooms/roomManager.js";

import { startRoundTimer } from "../game/gameManager.js";
import { registerGuessHandlers } from "../game/guessHandlers.js";

import { rooms } from "../rooms/roomManager.js";

export function socketHandler(io) {

  io.on("connection", (socket) => {

    console.log(
      "Connected:",
      socket.id
    );

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
    

    console.log(
      "Word selected:",
      word,
      "in room:",
      room.roomId
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
    socket.on("disconnect", () => {

      removeUser(
        socket.roomId,
        socket.id
      );

      console.log(
        "Disconnected:",
        socket.id
      );
    });

  });

}