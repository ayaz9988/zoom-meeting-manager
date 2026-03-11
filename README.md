# Zoom Meeting Manager

A simple Node.js application to manage Zoom meetings with a basic user interface.

## Features

- **List Meetings**: Display all scheduled meetings from your Zoom account
- **Create Meeting**: Create new meetings with date and time selection
- **Delete Meeting**: Remove unwanted meetings from your account

## Prerequisites

- Node.js (v18 or higher)
- A Zoom account
- Zoom API credentials (Client ID, Client Secret, and Account ID)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd zoom-meeting-manager
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your Zoom API credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your Zoom credentials:

```env
PORT=5000
FRONTEND_ORIGIN=http://localhost:3000

# Zoom API Credentials (get these from https://marketplace.zoom.us/)
ZOOM_CLIENT_ID=your_client_id
ZOOM_CLIENT_SECRET=your_client_secret
ZOOM_ACCOUNT_ID=your_account_id
```

#### How to get Zoom API Credentials

1. Go to [Zoom Marketplace](https://marketplace.zoom.us/)
2. Sign in with your Zoom account
3. Click "Develop" → "Build App"
4. Create a "Server-to-Server OAuth" app type
5. Set app name
6. In "App Credentials", note your Client ID and Client Secret
7. In "Information" set the your info.
8. In "Scopes", add: `meeting:write:meeting:admin`, `meeting:delete:meeting:admin`, `meeting:read:list_meetings:admin`, `user:read:user:admin`.
9. Activate your app

### 4. Run the Application

**Development mode:**

```bash
pnpm dev
```

**Production build:**

```bash
pnpm build
pnpm start
```

### 5. Access the Application

- **Frontend**: Open [http://localhost:5000/index.html](http://localhost:5000/index.html) in your browser
- **API**: Available at [http://localhost:5000/v1/meetings](http://localhost:5000/v1/meetings)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/v1/meetings` | List all meetings |
| POST | `/v1/meetings` | Create a new meeting |
| DELETE | `/v1/meetings/:meetingId` | Delete a meeting |

## Project Structure

```
src/
├── index.ts              # Main server entry point
├── helpers/
│   └── zoomAuth.ts       # Zoom API authentication & helpers
├── routes/
│   └── v1/
│       ├── index.ts      # API v1 router
│       └── meetings/
│           ├── index.ts  # Meeting routes
│           └── controller.ts  # Meeting API controllers
└── public/
    ├── index.html        # Frontend HTML
    └── script.js         # Frontend JavaScript
```

# Zoom meeting API docs

[https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/meetingCreate](https://developers.zoom.us/docs/api/rest/reference/zoom-api/methods/#operation/meetingCreate)