import axios from "axios";

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


let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getZoomToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const basicAuth = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID!}:${process.env.ZOOM_CLIENT_SECRET!}`
  ).toString('base64');

  const res = await axios.post(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID!}`,
    null,
    { headers: { Authorization: `Basic ${basicAuth}` } }
  );

  cachedToken = res.data.access_token;
  tokenExpiry = Date.now() + (res.data.expires_in * 1000) - 60000; // refresh 1min early
  return cachedToken;
}


export async function getMeetingsPage(
  pageToken?: string,
  pageSize: number = 30,
  type: 'scheduled' | 'past' | 'upcoming' | 'live' = 'scheduled'
): Promise<PaginatedMeetings> {
  const token = await getZoomToken();
  
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

export async function createMeetingHelper(data: CreateMeetingRequest): Promise<ZoomMeetingCreated> {
  const token = await getZoomToken();
  
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
  } catch(err: any) {
    throw new Error("Failed to create a meeting");
  }
}

export async function deleteMeetingHelper(meetingId: number) {
  const token = await getZoomToken();

  try {
    await axios.delete(
      `https://api.zoom.us/v2/meetings/${meetingId}`,
      { 
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  } catch(err:any){
    throw new Error("Failed to delete the meeting");
  }
}