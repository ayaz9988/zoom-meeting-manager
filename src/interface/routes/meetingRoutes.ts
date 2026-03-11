import { Router } from "express";
import { MeetingRepository } from "../../infrastructure/repositories/MeetingRepository.ts";
import { GetAllMeetings } from "../../use-cases/GetAllMeetings.ts";
import { MeetingController } from "../controllers/MeetingController.ts";
import { CreateMeeting } from "../../use-cases/CreateMeeting.ts";
import { DeleteMeeting } from "../../use-cases/DeleteMeeting.ts";

const router:Router = Router();

const meetingRepo = new MeetingRepository();
const getAllMeetings = new GetAllMeetings(meetingRepo);
const createMeeting = new CreateMeeting(meetingRepo);
const deleteMeeting = new DeleteMeeting(meetingRepo);
const meetingController = new MeetingController(
    getAllMeetings,
    createMeeting,
    deleteMeeting,
);

router.get("/meetings", (req, res) => meetingController.getAll(req, res));
router.post("/meetings", (req, res) => meetingController.create(req, res));
router.delete("/meetings/:meetingId", (req, res) => meetingController.delete(req, res));

export { router as meetingRouter};