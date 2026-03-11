import type { meetingType } from "../domain/entities/Meeting.ts";
import type { IMeetingRepository } from "../domain/interfaces/MeetingRepositroy.ts";

export class GetAllMeetings {
    private meetingRepository: IMeetingRepository;
    
    constructor(meetingRepository: IMeetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    async execute(pageSize: number, type: meetingType, pageToken?: string) {
        return await this.meetingRepository.getMeetingsPage(pageSize, type, pageToken);
    }
}