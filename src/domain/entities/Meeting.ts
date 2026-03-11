export interface CreateMeetingRequest {
  topic: string;
  type: 1 | 2; // 1=instant, 2=scheduled
  start_time?: string; // ISO8601 "2026-03-11T14:00:00Z"
  duration?: number; // minutes
  timezone?: string;
  settings?: {
    join_before_host?: boolean;
    waiting_room?: boolean;
    mute_upon_entry?: boolean;
    password?: string;
  };
}

export type meetingType = 'scheduled' | 'past' | 'upcoming' | 'live'

export interface ZoomMeetingCreated {
  id: number;
  join_url: string;
  start_url: string;
  topic: string;
  status: string;
}

export interface ZoomMeeting {
  id: number;
  topic: string;
  start_time: string;
  duration: number;
  join_url: string;
  status: string;
}

export interface ZoomMeetingsResponse {
  meetings: ZoomMeeting[];
  next_page_token?: string;
  page_count: number;
  page_number: number;
  page_size: number;
  total_records?: number;
}

export interface PaginatedMeetings {
  meetings: ZoomMeeting[];
  next_page_token?: string;
  page_count: number;
  page_number: number;
  page_size: number;
  total_records?: number;
  has_more: boolean;
}
