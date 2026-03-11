import type { CreateMeetingRequest, meetingType, PaginatedMeetings, ZoomMeetingCreated } from "../entities/Meeting.ts";

export interface IMeetingRepository {
    getZoomToken(): Promise<string | null>;
    createMeetingHelper(data: CreateMeetingRequest): Promise<ZoomMeetingCreated>;
    getMeetingsPage(
        pageSize: number,
        type: meetingType,
        pageToken?: string,
    ): Promise<PaginatedMeetings>;
    deleteMeetingHelper(meetingId: number): Promise<void>;
}