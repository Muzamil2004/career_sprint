<h1 align="center">✨ Full-Stack Interview Platform ✨</h1>

![Demo App](/frontend/public/readme-screenshot.png)

✨ Highlights:

- 🧑‍💻 VSCode-Powered Code Editor
- 🔐 Authentication via Clerk
- 🎥 1-on-1 Video Interview Rooms
- 🧭 Dashboard with Live Stats
- 🔊 Mic & Camera Toggle, Screen Sharing & Recording
- 💬 Real-time Chat Messaging
- ⚙️ Secure Code Execution in Isolated Environment
- 🎯 Auto Feedback — Success / Fail based on test cases
- 🎉 Confetti on Success + Notifications on Fail
- 🧩 Practice Problems Page (solo coding mode)
- 🔒 Room Locking — allows only 2 participants
- 🧠 Background Jobs with Inngest (async tasks)
- 🧰 REST API with Node.js & Express
- ⚡ Data Fetching & Caching via TanStack Query

---

## 🧪 .env Setup

### Backend (`/backend`)

```bash
PORT=3000
NODE_ENV=development

DB_URL=your_mongodb_connection_url

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

CLIENT_URL=http://localhost:5173
```

### Frontend (`/frontend`)

```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

VITE_API_URL=http://localhost:3000/api

VITE_STREAM_API_KEY=your_stream_api_key
```

---

## 🔧 Run the Backend

```bash

cd backend
npm install
npm run dev
```

---

## 🔧 Run the Frontend

```bash

cd frontend
npm install
npm run dev
```

---

## 🐳 Run with Docker

From project root:

```bash
docker compose up -d --build
```

App URLs:

- Frontend: `http://localhost:8080`
- Backend health check: `http://localhost:3000/health`
- MongoDB: `mongodb://localhost:27017` (optional external access)

Notes:

- Backend uses `backend/.env` through `docker-compose.yml`.
- Copy `backend/.env.example` to `backend/.env` and fill values before first run.
- Frontend calls backend via Nginx proxy at `/api`.
- If using Google OAuth, add `http://localhost:8080` to allowed origins/redirects.
- For production, use strong secrets and do not commit real `.env` values.
- In Docker, backend is configured to use the local Mongo container (`mongodb://mongo:27017/talentiq`).

Useful commands:

```bash
docker compose logs -f
docker compose down
```
