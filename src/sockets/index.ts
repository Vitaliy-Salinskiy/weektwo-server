import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";

export const bootstrapSockets = (server: HttpServer) => {
  const io = new IOServer(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    const room = "appointments";
    socket.join(room);

    const clientsInRoom = io.sockets.adapter.rooms.get(room);
    console.log(
      `Number of users in room ${room}: ${
        clientsInRoom ? clientsInRoom.size : 0
      }`
    );

    socket.on("disconnect", () => {
      console.log("Client disconnected");
      console.log(
        `Number of users in room ${room}: ${
          clientsInRoom ? clientsInRoom.size : 0
        }`
      );
    });
  });
};
