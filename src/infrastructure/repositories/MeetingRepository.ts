import axios from "axios";
import { type IMeetingRepository } from "../../domain/interfaces/MeetingRepositroy.ts";
import type { CreateMeetingRequest, meetingType, PaginatedMeetings, ZoomMeetingCreated, ZoomMeetingsResponse } from "../../domain/entities/Meeting.ts";

export class MeetingRepository implements IMeetingRepository {
    private cachedToken: string | null = null;
    private tokenExpiry = 0;

    async getZoomToken() {
        if (this.cachedToken && Date.now() < this.tokenExpiry) {
            return this.cachedToken;
        }

        const basicAuth = Buffer.from(
            `${process.env.ZOOM_CLIENT_ID!}:${process.env.ZOOM_CLIENT_SECRET!}`
        ).toString('base64');

        const res = await axios.post(
            `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID!}`,
            null,
            { headers: { Authorization: `Basic ${basicAuth}` } }
        );

        this.cachedToken = res.data.access_token;
        this.tokenExpiry = Date.now() + (res.data.expires_in * 1000) - 60000; // refresh 1min early
        return this.cachedToken;
    }

    async getMeetingsPage(
        pageSize: number = 30,
        type: meetingType = 'scheduled',
        pageToken?: string,
    ): Promise<PaginatedMeetings> {
        const token = await this.getZoomToken();

        const params = new URLSearchParams({
            type,
            page_size: pageSize.toString(),
            ...(pageToken && { next_page_token: pageToken })
        });

        const response = await axios.get<ZoomMeetingsResponse>(
            `https://api.zoom.us/v2/users/me/meetings?${params}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return {
            ...response.data,
            has_more: !!response.data.next_page_token
        };
    }

    async createMeetingHelper(data: CreateMeetingRequest): Promise<ZoomMeetingCreated> {
        const token = await this.getZoomToken();

        try {
            const response = await axios.post(
                `https://api.zoom.us/v2/users/me/meetings`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (err: any) {
            throw new Error("Failed to create a meeting");
        }
    }

    async deleteMeetingHelper(meetingId: number) {
        const token = await this.getZoomToken();

        try {
            await axios.delete(
                `https://api.zoom.us/v2/meetings/${meetingId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
        } catch (err: any) {
            throw new Error("Failed to delete the meeting");
        }
    }
}