import axios from "axios";
import { getMeetingsPage } from "../../../helpers/zoomAuth.ts";
import {type Request, type Response } from "express";

export const gettingMeetings = async (req: Request, res:  Response) => {
  try {
    const { 
      page_token, 
      page_size = '30', 
      type = 'scheduled' 
    } = req.query;

    const pageData = await getMeetingsPage(
      page_token as string | undefined,
      parseInt(page_size as string),
      type as any
    );

    res.json({
      success: true,
      current_page: pageData.page_number,
      total_pages: pageData.page_count,
      page_size: pageData.page_size,
      has_more: pageData.has_more,
      next_page_token: pageData.next_page_token,
      meetings: pageData.meetings
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createMeeting = async (req: Request, res:  Response) => {

}

export const deleteMeeting = async (req: Request, res:  Response) => {
  
}