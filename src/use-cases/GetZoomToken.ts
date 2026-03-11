import { IMeetingRepository } from "../domain/interfaces/MeetingRepositroy.ts";

export class getZoomToken {
    private meetingRepository: IMeetingRepository;
    
    constructor(meetingRepository: IMeetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    async execute() {
        return await this.meetingRepository.getZoomToken();
    }
}