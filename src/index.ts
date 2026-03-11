import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from 'cors';
import path from "path";
import { fileURLToPath } from "url";
import { meetingRouter } from "./interface/routes/meetingRoutes.ts";
import { errorHandler } from "./interface/middleware/errorHandler.ts";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({
    origin: process.env.FRONTEND_ORIGIN!,
    credentials: true
}));

app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; connect-src 'self' http://localhost:5000 https://api.zoom.us; font-src 'self' https://cdn.jsdelivr.net data:;"
    );
    next();
});

app.use(express.static(path.join(__dirname, './public')));

app.use(express.json());


app.use("/api", meetingRouter);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Static files: http://localhost:${port}/index.html`);
    console.log(`API: http://localhost:${port}/api/meetings`);
});