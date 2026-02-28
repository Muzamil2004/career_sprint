# Career Sprint

Full-stack interview preparation platform for coding, system design, aptitude, and verbal practice.

![Career Sprint Screenshot](./frontend/public/readme-screenshot.png)

## Overview
Career Sprint combines async practice and live mock interviews in one workflow so candidates can prepare end-to-end in a single product.

## Quick Links
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Docker Setup](#docker-setup)
- [API Snapshot](#api-snapshot)
- [Project Review Screenshots](#project-review-screenshots)

## Project Review Screenshots
![Project Review 1](./frontend/public/Screenshot%202026-02-28%20194650.png)
![Project Review 2](./frontend/public/Screenshot%202026-02-28%20194850.png)
![Project Review 3](./frontend/public/Screenshot%202026-02-28%20195017.png)
![Project Review 4](./frontend/public/Screenshot%202026-02-28%20195108.png)
![Project Review 5](./frontend/public/Screenshot%202026-02-28%20195146.png)
![Project Review 6](./frontend/public/Screenshot%202026-02-28%20195224.png)
![Project Review 7](./frontend/public/Screenshot%202026-02-28%20195253.png)
![Project Review 8](./frontend/public/Screenshot%202026-02-28%20195328.png)
![Project Review 9](./frontend/public/Screenshot%202026-02-28%20195418.png)
![Project Review 10](./frontend/public/Screenshot%202026-02-28%20195538.png)

## Features
- Multi-category preparation tracks: Coding, System Design, Aptitude, and Verbal
- Monaco-based coding workspace with language-aware starter templates (JavaScript, Python, Java)
- Manual run plus debounced auto-run with normalized output matching against expected results
- Local solved-problem tracking with progress indicators by category and overall completion
- Live 1:1 interview rooms with real-time Stream video + in-room chat
- Flexible session creation: AI-random problem generation or manual setup, with focus and minimum difficulty controls
- Interview guardrails: fullscreen enforcement, clipboard/context-menu blocking, and anti-shortcut protection
- Eye-proctoring using MediaPipe face landmarks with warning/violation counters and temporary focus lock
- Timed interview sessions with automatic host-end and persisted run statistics
- AI-generated post-session coaching with concise tips and analysis tailored to interview focus
- Session summaries capturing attempts, successful runs, accuracy, readiness, and proctoring risk signals
- Dashboard + profile analytics (accuracy, streaks, readiness score, solved breakdown)
- Auth system with JWT cookies and Google OAuth sign-in

## Tech Stack
| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite 7, Tailwind CSS 4, React Router 7, TanStack Query 5, Axios, Monaco Editor |
| Backend | Node.js (ES Modules), Express 5 |
| Database | MongoDB 7, Mongoose 8 |
| Realtime | Stream Video React SDK, Stream Chat, stream-chat-react |
| AI + Async Jobs | OpenAI API, Inngest |
| Auth + Security | bcryptjs, Google OAuth (`@react-oauth/google`, `google-auth-library`), JWT, cookie-based sessions |
| Dev Tooling | ESLint 9, Nodemon, Docker, Docker Compose |

## Project Structure
```text
Career Sprint/
  backend/              # Express API, auth, sessions, AI endpoints
  frontend/             # React app, pages, components, problem engine
  docker-compose.yml
```

## Environment Variables
### Backend (`backend/.env`)
Use `backend/.env.example` as base:

```bash
PORT=3000
NODE_ENV=production
DB_URL=

INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

STREAM_API_KEY=
STREAM_API_SECRET=

JWT_SECRET=
CLIENT_URL=http://localhost:8080
GOOGLE_CLIENT_ID=

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

### Frontend (`frontend/.env`)
```bash
VITE_API_URL=http://localhost:3000/api
VITE_STREAM_API_KEY=
VITE_GOOGLE_CLIENT_ID=
```

## Local Development
### 1. Start Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Docker Setup
Run from project root:

```bash
docker compose up -d --build
```

Services:
- Frontend: `http://localhost:8080`
- Backend health: `http://localhost:3001/health`
- MongoDB: `mongodb://localhost:27017`

Useful commands:
```bash
docker compose logs -f
docker compose down
```

## API Snapshot
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/oauth/google`
- `POST /api/sessions`
- `GET /api/sessions/active`
- `GET /api/sessions/my-recent`
- `POST /api/sessions/:id/join`
- `POST /api/sessions/:id/end`



## License

MIT




