import type { CreateMeetingRequest } from "../domain/entities/Meeting.ts";
import type { IMeetingRepository } from "../domain/interfaces/MeetingRepositroy.ts";

export class CreateMeeting {
    private meetingRepository: IMeetingRepository;
    
    constructor(meetingRepository: IMeetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    async execute(data: CreateMeetingRequest) {
        return await this.meetingRepository.createMeetingHelper(data);
    }
}