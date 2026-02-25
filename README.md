# Talent-IQ

> Full-stack interview practice platform for coding, system design, aptitude, and verbal rounds.

![Talent-IQ Screenshot](./frontend/public/readme-screenshot.png)

## Why Talent-IQ
Talent-IQ combines solo practice and live mock interviews in one workflow:

- Practice categorized problems with difficulty filters
- Run code with language-aware starter templates
- Create and join live 1:1 interview sessions
- Get AI-generated feedback after sessions
- Track progress from dashboard and profile analytics

## Key Features
- Multi-category problem bank: Coding, System Design, Aptitude, Verbal
- Monaco-based code editor (JavaScript, Python, Java)
- Auto-check against expected outputs
- Real-time video + chat session rooms (2 participants max)
- Session summaries with attempts, success rate, and score
- Google OAuth + JWT auth flow
- Profile insights: accuracy, readiness meter, solved breakdown

## Tech Stack
- Frontend: React 19, Vite, Tailwind CSS, React Router, TanStack Query
- Backend: Node.js, Express, MongoDB (Mongoose)
- Realtime: Stream Video + Stream Chat
- AI/Async: OpenAI + Inngest
- Auth: Email/password + Google Sign-In + JWT cookies

## Project Structure
```text
talent-IQ/
  backend/      # Express API, auth, sessions, AI endpoints
  frontend/     # React app, pages, components, problem engine
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

### 1) Backend
```bash
cd backend
npm install
npm run dev
```

### 2) Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` by default.

## Docker Setup
Run everything from root:

```bash
docker compose up -d --build
```

Services:
- Frontend: `http://localhost:8080`
- Backend health: `http://localhost:3000/health`
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

## What Makes It Stand Out
- One platform for both async practice and live interview simulation
- Covers technical + non-technical interview prep dimensions
- Built-in feedback loop with analytics and readiness tracking

## License
ISC
