export function registerChatEvents(
  io,
  socket
) {
  socket.on("send_message", (data) => {
    io.to(socket.roomId).emit(
      "receive_message",
      data
    );
  });
}