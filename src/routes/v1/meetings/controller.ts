import axios from "axios";
import getZoomToken from "../../../helpers/zoomAuth.ts";
import {type Request, type Response } from "express";

export const gettingMeetings = async (req: Request, res:  Response) => {
  try {
    const token = await getZoomToken();
    const zoomRes = await axios.get(
      'https://api.zoom.us/v2/users/me/meetings',
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.json(zoomRes.data);
  } catch (err: any) {
    res.status(err.response?.status || 500).json(err.response?.data || err.message);
  }
}