import axios from "axios";

let cachedToken: string | null = null;
let tokenExpiry = 0;

export default async function getZoomToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const basicAuth = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString('base64');

  const res = await axios.post(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
    null,
    { headers: { Authorization: `Basic ${basicAuth}` } }
  );

  cachedToken = res.data.access_token;
  tokenExpiry = Date.now() + (res.data.expires_in * 1000) - 60000; // refresh 1min early
  return cachedToken;
}