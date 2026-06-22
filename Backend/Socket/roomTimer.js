import { rooms } from "../rooms/roomManager.js";
import { startRound } from "../game/gameManager.js";


let roomTimer = null;

export function startRoomTimer(io) {

  if (roomTimer) return;

  roomTimer = setInterval(() => {

    for (const room of rooms.values()) {

      if (
        room.status === "COUNTDOWN" &&
        Date.now() >= room.closeAt
      ) {

        room.status = "LOCKED";

        console.log(
          `Room locked: ${room.roomId}`
        );

        io.to(room.roomId).emit(
          "room_locked"
        );

        startRound(io, room);

      }

    }

  }, 1000);
}