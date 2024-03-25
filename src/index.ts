import dotenv from "dotenv";
import express from "express";
import { Request, Response } from "express";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (_req: Request, res: Response) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
