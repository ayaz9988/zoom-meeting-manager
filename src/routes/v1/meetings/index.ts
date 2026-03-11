import express, { Router } from "express";
import { gettingMeetings } from "./controller.ts";
const meetings: Router = express.Router();

meetings.get('/meetings', gettingMeetings);

export default meetings;
