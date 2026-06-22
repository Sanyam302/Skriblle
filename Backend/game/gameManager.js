import { getRandomWords } from "./wordManager.js";
import { revealLetter } from "./wordManager.js";
import {
  deleteRoom
} from "../rooms/roomManager.js";

export function startRound(io, room) {
const drawer =
  room.players[
    room.currentDrawerIndex
  ];

const words =
  getRandomWords(3);

room.guessedPlayers = [];
room.timeLeft = room.drawTime;
room.currentDrawerId =
  drawer.socketId;
room.status =
  "WORD_SELECTION";

io.to(room.roomId).emit(
  "room_update",
  room
);
  io.to(drawer.socketId).emit(
    "choose_word",
    words
  );


}

export function endRound(io, room) {

  // Stop timer
  if (room.roundTimer) {
    clearInterval(room.roundTimer);
    room.roundTimer = null;
  }

  room.status = "ROUND_END";

  // Show round result
  io.to(room.roomId).emit(
    "round_end",
    {
      word: room.currentWord,
      players: room.players
    }
  );

  
  

    room.currentDrawerIndex++;

    // Finished one cycle?
    if (
      room.currentDrawerIndex >=
      room.players.length
    ) {

      room.currentDrawerIndex = 0;

      room.currentRound++;
    }

    // Game Over?
    if (
      room.currentRound >=
      room.maxRounds
    ) {

      endGame(io, room);
      return;
    }

    startRound(io, room);

  ;
}

export function startRoundTimer(io, room) {

  const timer = setInterval(() => {

    room.timeLeft--;

   if (room.timeLeft ===  Math.floor(
    room.drawTime / 2
  )) {

  room.currentHint =
    revealLetter(
      room.currentWord,
      room.currentHint
    );

  room.players.forEach(
    (player) => {

      if (
        player.socketId !==
        room.currentDrawerId
      ) {

        io.to(
          player.socketId
        ).emit(
          "word_hint",
          {
            hint:
              room.currentHint
          }
        );

      }

    }
  );
}

if (room.timeLeft ===  Math.floor(
    room.drawTime / 3
  )) {

  room.currentHint =
    revealLetter(
      room.currentWord,
      room.currentHint
    );

  room.players.forEach(
    (player) => {

      if (
        player.socketId !==
        room.currentDrawerId
      ) {

        io.to(
          player.socketId
        ).emit(
          "word_hint",
          {
            hint:
              room.currentHint
          }
        );

      }

    }
  );
}

if (room.timeLeft ===  Math.floor(
    room.drawTime / 2
  )) {

  room.currentHint =
    revealLetter(
      room.currentWord,
      room.currentHint
    );

  room.players.forEach(
    (player) => {

      if (
        player.socketId !==
        room.currentDrawerId
      ) {

        io.to(
          player.socketId
        ).emit(
          "word_hint",
          {
            hint:
              room.currentHint
          }
        );

      }

    }
  );
}



    io.to(room.roomId).emit(
      "room_update",
      room
    );

    if (room.timeLeft <= 0) {

      clearInterval(timer);

      endRound(io, room);
    }

  }, 1000);

}

export function endGame(io, room) {

  room.status = "GAME_OVER";

  const winner =
    [...room.players]
      .sort(
        (a, b) =>
          b.score - a.score
      )[0];

  io.to(room.roomId).emit(
    "game_over",
    {
      winner,
      leaderboard:
        [...room.players].sort(
          (a, b) =>
            b.score - a.score
        )
    }
  );

  console.log(
    `Winner: ${winner.username}`
  );
   setTimeout(() => {

    deleteRoom(
      room.roomId
    );

  }, 10000); 
}
