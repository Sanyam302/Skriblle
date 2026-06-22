import { rooms } from "../rooms/roomManager.js";

function getCurrentDrawer(room) {
  return room.players[
    room.currentDrawerIndex
  ];
}
export function registerDrawingEvents(socket) {
  socket.on("draw_start", (data) => {

  const room = rooms.get(socket.roomId);

  if (!room) return;

  const drawer =
    getCurrentDrawer(room);

  if (
    socket.id !== drawer.socketId
  ) {
    return;
  }

  socket
    .to(room.roomId)
    .emit("draw_start", data);
});

  socket.on("draw_move", (data) => {

  const room = rooms.get(socket.roomId);

  if (!room) return;

  const drawer =
    getCurrentDrawer(room);

  if (
    socket.id !== drawer.socketId
  ) {
    return;
  }

  socket
    .to(room.roomId)
    .emit("draw_move", data);
});

socket.on("draw_end", () => {

  const room = rooms.get(socket.roomId);

  if (!room) return;

  const drawer =
    getCurrentDrawer(room);

  if (
    socket.id !== drawer.socketId
  ) {
    return;
  }

  socket
    .to(room.roomId)
    .emit("draw_end");
});
}