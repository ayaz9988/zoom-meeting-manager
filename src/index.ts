import express, { type Request, type Response } from "express";
import dotenv from "dotenv";

import v1 from "./routes/v1/index.ts";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


app.use("/v1", v1);

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express + TypeScript" });
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
