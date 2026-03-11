import { validate } from "class-validator";
import type { CreateMeetingRequest } from "../../domain/entities/Meeting.ts";
import { CreateMeeting } from "../../use-cases/CreateMeeting.ts";
import { DeleteMeeting } from "../../use-cases/DeleteMeeting.ts";
import { GetAllMeetings } from "../../use-cases/GetAllMeetings.ts";
import { type Request, type Response } from "express";
import { plainToInstance } from "class-transformer";
import { CreateMeetingDto } from "../dto/CreateMeetingDto.ts";

export class MeetingController {
    private getAllMeetings: GetAllMeetings;
    private createMeeting: CreateMeeting;
    private deleteMeeting: DeleteMeeting;

    constructor(
        getAllMeetings: GetAllMeetings,
        createMeeting: CreateMeeting,
        deleteMeeting: DeleteMeeting,
    ) {
        this.getAllMeetings = getAllMeetings;
        this.createMeeting = createMeeting;
        this.deleteMeeting = deleteMeeting;
    }

    async getAll(req: Request, res: Response) {
        try {
            const {
                page_token,
                page_size = '30',
                type = 'scheduled'
            } = req.query;

            const meetings = await this.getAllMeetings.execute(
                parseInt(page_size as string),
                type as any,
                page_token as string | undefined,
            );
            res.json(meetings);
        } catch (err: any) {
            res.status(500).json({ error: err.message });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const dto = plainToInstance(CreateMeetingDto, req.body);

            const errors = await validate(dto);

            if (errors.length > 0) {
                return res.status(400).json({
                    errors: errors.map(err => Object.values(err.constraints || {}))
                });
            }

            const meetingData: CreateMeetingRequest = dto;

            const meeting = await this.createMeeting.execute(meetingData);

            res.status(201).json({
                success: true,
                meeting
            });
        } catch (err: any) {
            res.status(err.response?.status || 500).json({
                error: err.response?.data || err.message
            });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const meetingId = parseInt(req.params.meetingId as string);

            await this.deleteMeeting.execute(meetingId);

            res.json({ success: true, deleted: meetingId });
        } catch (error: any) {
            res.status(error.response?.status || 500).json({
                error: error.response?.data || error.message
            });
        }
    }
}