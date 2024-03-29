import { Server as HttpServer } from "http";
import { Server as IOServer } from "socket.io";
import { User } from "../interfaces";

export const bootstrapSockets = (server: HttpServer) => {
  const io = new IOServer(server, {
    cors: {
      origin: "*",
    },
  });

  let bookingInfo: Record<string, { day: string; time: string }> = {};

  const getBookingInfoForSocket = (socketId: string) => {
    return bookingInfo[socketId];
  };

  io.on("connection", async (socket) => {
    const room = "appointments";
    await socket.join(room);

    const data = Object.values(bookingInfo);
    if (data.length > 0) {
      data.forEach((bookingInfo) => {
        socket.emit("booking confirmed", bookingInfo.day, bookingInfo.time);
      });
    }

    socket.on("booking", (day: string, hour: string) => {
      io.emit("booking confirmed", day, hour);
      delete bookingInfo[socket.id];
      bookingInfo[socket.id] = { day: day, time: hour };
    });

    socket.on("cancel booking", (day: string, hour: string) => {
      io.emit("booking cancelled", day, hour);
      delete bookingInfo[socket.id];
    });

    socket.on(
      "reservation",
      (day: string, hour: string, title: string, user: User) => {
        delete bookingInfo[socket.id];
        io.emit("reservation confirmed", day, hour, title, user);
      }
    );

    socket.on("disconnect", async () => {
      const booking = getBookingInfoForSocket(socket.id);
      if (booking) {
        io.emit("booking cancelled", booking.day, booking.time);
        delete bookingInfo[socket.id];
      }
    });
  });
};
