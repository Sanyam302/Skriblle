import { time } from "console";
import crypto from "crypto";

export const  rooms = new Map();


export function createRoom(socketId,username) {
  const roomId = crypto.randomUUID();

  const room = {
    roomId,
    players: [
   
  ],
    currentRound: 0,
    maxRounds: 2,

    currentDrawerIndex: 0,
    cucurrentDrawerId : null,

    currentWord: null,
    turnsPlayed: 0,
    isPrivate: false,
    hostId:"",
    maxPlayers:20,
    drawTime:60,
    
    


    guessedPlayers: [],
    currentHint: "",

    gameStarted: false,
    roundEndsAt: null,
    status: "WAITING",
    timerStarted: false,
    timeLeft: 0,
    closeAt: null,
  };

  rooms.set(roomId, room);

  return room;
}
let playerCounter = 1;

export function generateUsername() {
  return `A${playerCounter++}`;
}
export function findAvailableRoom() {
  for (const room of rooms.values()) {
    if (
     room.status === "WAITING" ||
room.status === "COUNTDOWN" &&
      room.players.length < 20 && !room.isPrivate
    ) {
      return room;
    }
  }

  return null;
}

export function getRoom(roomId) {
  return rooms.get(roomId);
}

export function removeUser(roomId, socketId) {
  const room = rooms.get(roomId);

  if (!room) return;

  room.players = room.players.filter(
    (id) => id !== socketId
  );

  if (room.players.length === 0) {
    rooms.delete(roomId);
  }
}

export function deleteRoom(
  roomId
) {
  rooms.delete(roomId);

  console.log(
    `Room deleted: ${roomId}`
  );
}