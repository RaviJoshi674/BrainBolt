# BrainBolt - Adaptive Infinite Quiz Platform

BrainBolt is a full-stack adaptive quiz app built with Next.js App Router, Prisma, PostgreSQL, and Redis.

## 🎥 Project Demo - PROJECT_DEMO.txt.

## Highlights

- Adaptive difficulty engine with momentum + hysteresis
- Difficulty range **0 to 10**
- Difficulty resets to **0** on wrong answer
- Difficulty upgared after every 3 correct answers.
- Streak and score tracking with leaderboard ranks
- Idempotent answer submissions using `answerIdempotencyKey`
- JWT-based auth (`register`, `login`)
- Redis-backed caching and leaderboard updates
- Global API rate limiting middleware:
  - 100 req / 15 min (all API)
  - 30 req / min (`/api/v1/quiz/answer`)
- Unified API route error handling via shared helper
- Dark/Light mode toggle

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- Redis
- Tailwind CSS
- SWR
- Zod

## Quick Start

### Prerequisites

- Node.js 18+
- Docker + Docker Compose

### Run with Docker (recommended)

```bash
cp .env.example .env
docker compose up --build -d
```

App: `http://localhost:3000`

### Local development

```bash
npm install
docker compose up postgres redis -d
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run type-check
npm run lint
npm run format

npm run db:generate
npm run db:push
npm run db:migrate
npm run db:seed
npm run db:studio
```

## Current Project Structure

```text
BrainBolt_Windsurf/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── (landing)/
│   │   │   ├── page.tsx
│   │   │   └── auth/
│   │   │       ├── login/page.tsx
│   │   │       └── register/page.tsx
│   │   ├── (app)/
│   │   │   ├── quiz/page.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   └── leaderboard/
│   │   ├── api/v1/
│   │   │   ├── auth/
│   │   │   ├── quiz/
│   │   │   └── leaderboard/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/
│   │   ├── quiz/
│   │   ├── leaderboard/
│   │   └── ui/
│   ├── lib/
│   │   ├── adaptive/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── cache/
│   │   ├── context/
│   │   ├── db/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   ├── middleware.ts
│   └── styles/
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

## API Endpoints

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`

### Quiz

- `GET /api/v1/quiz/next`
- `POST /api/v1/quiz/answer`
- `GET /api/v1/quiz/metrics`

### Leaderboard

- `GET /api/v1/leaderboard/score?limit=50&offset=0`
- `GET /api/v1/leaderboard/streak?limit=50&offset=0`

## Environment Variables

Use `.env.example` as the source of truth:

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/brainbolt?schema=public"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NODE_ENV="development"
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## Notes

- Seed is non-destructive and idempotent.
- API route errors are centralized in `src/lib/api/route-error.ts`.
- Rate limiting and security headers are handled in `src/middleware.ts`.
