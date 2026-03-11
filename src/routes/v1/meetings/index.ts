import express, { Router } from "express";
import { createMeeting, deleteMeeting, gettingMeetings } from "./controller.ts";
const meetings: Router = express.Router();

meetings.get('/', gettingMeetings);

meetings.post('/', createMeeting);

meetings.delete('/', deleteMeeting);

export default meetings;
