# Demo App

A realistic task management REST API built with Express, PostgreSQL, and TypeScript. Features JWT authentication, role-based access control, project management, tagging, comments, audit logging, and background job processing with BullMQ.

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express 5
- **Database**: PostgreSQL (raw `pg` driver, no ORM)
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **Background Jobs**: BullMQ + Redis (IORedis)
- **Testing**: Jest + Supertest
- **CI**: GitHub Actions

## Architecture

```
src/
  config/       # Database, Redis, auth, schema configuration
  controllers/  # HTTP request handlers
  middleware/   # Auth (JWT), error handling
  models/       # Database queries (raw SQL)
  routes/       # Express route definitions
  services/     # Business logic layer
  types/        # TypeScript types, enums, DTOs
  jobs/         # BullMQ queues and workers
tests/
  helpers/      # Test utilities (DB cleanup, auth helpers)
  *.test.ts     # Integration tests
```

## Setup

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Redis 7+ (for background jobs)

### Installation

```bash
npm install
cp .env .env.local  # Edit with your database credentials
npm run build
```

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_USER` | PostgreSQL user | `demo_user` |
| `DB_PASSWORD` | PostgreSQL password | `password` |
| `DB_NAME` | PostgreSQL database | `demo_db` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `PORT` | API server port | `3000` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT token expiry | `24h` |
| `BCRYPT_ROUNDS` | bcrypt hash rounds | `10` |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |

### Running

```bash
npm start          # Start API server
npm run worker     # Start background workers (requires Redis)
npm test           # Run integration tests (requires PostgreSQL)
```

## API Endpoints

### Auth
- `POST /auth/register` — Register a new user
- `POST /auth/login` — Login and get JWT token

### Users (requires auth)
- `GET /users` — List all users
- `PUT /users/:id/deactivate` — Deactivate user (admin only)
- `PUT /users/:id/activate` — Activate user (admin only)

### Tasks (requires auth)
- `POST /tasks` — Create a task
- `GET /tasks` — List tasks (supports `?status=`, `?projectId=`, `?assignedTo=`, `?userId=` filters)
- `GET /tasks/:id` — Get task by ID
- `PUT /tasks/:id` — Update a task
- `DELETE /tasks/:id` — Soft-delete a task
- `GET /tasks/:id/history` — Get audit history for a task

### Projects (requires auth)
- `POST /projects` — Create a project
- `GET /projects` — List projects (own projects, or all for admin)
- `GET /projects/:id` — Get project by ID
- `PUT /projects/:id` — Update a project
- `DELETE /projects/:id` — Soft-delete project (cascades to tasks)

### Tags (requires auth)
- `POST /tags` — Create a tag
- `GET /tags` — List all tags
- `GET /tags/task/:taskId` — Get tags for a task
- `POST /tags/:id/task` — Add tag to task
- `DELETE /tags/:id/task` — Remove tag from task
- `DELETE /tags/:id` — Delete a tag

### Comments (requires auth)
- `POST /tasks/:taskId/comments` — Add a comment
- `GET /tasks/:taskId/comments` — List comments for a task
