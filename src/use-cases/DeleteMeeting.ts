import type { IMeetingRepository } from "../domain/interfaces/MeetingRepositroy.ts";

export class DeleteMeeting {
    private meetingRepository: IMeetingRepository;
    
    constructor(meetingRepository: IMeetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    async execute(meetingId: number) {
        return await this.meetingRepository.deleteMeetingHelper(meetingId);
    }
}