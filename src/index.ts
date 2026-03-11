import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import axios from "axios";
import getZoomToken from "./helpers/zoomAuth.ts";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express + TypeScript" });
});


app.get('/meetings', async (req, res) => {
  try {
    const token = await getZoomToken();
    const zoomRes = await axios.get(
      'https://api.zoom.us/v2/users/me/meetings',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.json(zoomRes.data);
  } catch (err) {
    res.status(err.response?.status || 500).json(err.response?.data || err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
