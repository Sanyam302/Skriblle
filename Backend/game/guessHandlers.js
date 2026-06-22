import { rooms } from "../rooms/roomManager.js";
import { endRound } from "../game/gameManager.js";

export function registerGuessHandlers(
  io,
  socket
) {
  socket.on("guess", (text) => {
    console.log(
      `Guess from ${socket.id}: ${text}`
    );
  const room = rooms.get(
  socket.roomId
);

console.log(
  "socket.roomId:",
  socket.roomId
);

console.log(
  "room:",
  room
);

if (!room) {
  console.log(
    "Room not found"
  );
  return;
}

console.log(
  "currentWord:",
  room.currentWord
);

if (!room.currentWord) {
  console.log(
    "No current word"
  );
  return;
}
    const player =
      room.players.find(
        (p) =>
          p.socketId === socket.id
      );

    if (!player) return;

    const drawer =
      room.players[
        room.currentDrawerIndex
      ];

    // Drawer cannot guess
    if (
      socket.id === drawer.socketId
    ) {
      return;
    }

    // Already guessed
    if (
      room.guessedPlayers.includes(
        socket.id
      )
    ) {
      return;
    }

    const guess =
      text.trim().toLowerCase();

    const answer =
      room.currentWord
        .trim()
        .toLowerCase();

    // ======================
    // CORRECT GUESS
    // ======================

    if (guess === answer) {
      
      const points =
        room.timeLeft * 10;

      player.score += points;

      room.guessedPlayers.push(
        socket.id
      );

      // Score update
      io.to(room.roomId).emit(
        "correct_guess",
        {
          username:
            player.username,
          points,
          totalScore:
            player.score,
        }
      );
  console.log(
  "Sending correct guess message"
);

      // Chat message
      io.to(room.roomId).emit(
        "receive_message",
        {
          user: "System",
          text: `${player.username} guessed the word!`,
          time:
            new Date().toLocaleTimeString(
              [],
              {
                hour: "2-digit",
                minute:
                  "2-digit",
              }
            ),
        }
      );

      const totalGuessers =
        room.players.length - 1;

      if (
        room.guessedPlayers
          .length ===
        totalGuessers
      ) {
        endRound(io, room);
      }

      return;
    }

    // ======================
    // WRONG GUESS
    // ======================

   console.log(
  "Sending wrong guess message"
);

io.to(room.roomId).emit(
  "receive_message",
  {
    user: player.username,
    text,
    time:
      new Date().toLocaleTimeString(),
  }
);
  });
}
