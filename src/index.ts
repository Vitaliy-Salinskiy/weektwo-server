import dotenv from "dotenv";
import express from "express";
import { Request, Response } from "express";
import http from "http";
import cors from "cors";

dotenv.config();

import { bootstrapSockets } from "./sockets";

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

bootstrapSockets(server);

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

const bootstrap = async () => {
  try {
    server.listen(PORT, () =>
      console.log(`Server started at http://localhost:${PORT}`)
    );
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

bootstrap();
