# Codelave Server

**The backend API for the Codelave managed code execution platform.**

A NestJS backend that creates and manages secure, isolated Docker container sandboxes for running AI-generated code. It receives requests from SDKs, orchestrates Docker containers on a remote sandbox host, executes code inside those containers, streams output in real time via WebSockets, and handles file operations — all with strict security, usage tracking, and free tier enforcement.

---

## Architecture

```
┌─────────────┐       ┌──────────────────┐       ┌──────────────────┐
│  SDK / CLI  │──────▶│   NestJS API     │──────▶│  Sandbox Host    │
│  (API Key)  │  HTTP │   (Port 3000)    │ TCP   │  (Docker Daemon) │
└─────────────┘  + WS └────────┬─────────┘       └──────────────────┘
                               │                         │
                    ┌──────────┼──────────┐       ┌──────┴──────┐
                    │          │          │       │  Container  │
                    ▼          ▼          ▼       │  Container  │
               PostgreSQL   Redis      S3/MinIO  │  Container  │
                (Neon)     (Queues)   (Files)     └─────────────┘
```

---

## Tech Stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Framework      | NestJS with TypeScript (strict)   |
| ORM            | Prisma 7                          |
| Database       | PostgreSQL (Neon)                 |
| Auth           | JWT + SHA-256 hashed API keys     |
| Containers     | Docker (remote daemon via TCP)    |
| Real-time      | Socket.IO WebSocket gateway       |
| Validation     | class-validator + class-transformer |
| Docs           | Swagger (auto-generated)          |
| Testing        | Jest (44 tests passing)           |
| Scheduling     | @nestjs/schedule (cron jobs)      |
| Rate Limiting  | @nestjs/throttler                 |

---

## API Endpoints

### Auth
| Method   | Route              | Guard | Description                    |
|----------|--------------------|-------|--------------------------------|
| `POST`   | `/auth/register`   | —     | Register new user, get JWT     |
| `POST`   | `/auth/login`      | —     | Login, get JWT                 |
| `POST`   | `/auth/apikey`     | JWT   | Generate API key (shown once)  |
| `GET`    | `/auth/apikey`     | JWT   | List all API keys              |
| `DELETE` | `/auth/apikey/:id` | JWT   | Revoke an API key              |

### Sandbox
| Method   | Route            | Guard   | Description                 |
|----------|------------------|---------|-----------------------------|
| `POST`   | `/sandbox`       | API Key | Create sandbox + container  |
| `GET`    | `/sandbox`       | API Key | List user's sandboxes       |
| `GET`    | `/sandbox/:id`   | API Key | Get sandbox details         |
| `DELETE` | `/sandbox/:id`   | API Key | Destroy sandbox + container |

### Execution
| Method   | Route                          | Guard   | Description             |
|----------|--------------------------------|---------|-------------------------|
| `POST`   | `/sandbox/:id/execute`         | API Key | Execute code (sync)     |
| `GET`    | `/sandbox/:id/execute`         | API Key | List executions         |
| `WS`     | `/ws/execute`                  | API Key | Stream output real-time |

### Files
| Method   | Route                              | Guard   | Description           |
|----------|------------------------------------|---------|-----------------------|
| `POST`   | `/sandbox/:id/files/upload`        | API Key | Upload file to sandbox|
| `GET`    | `/sandbox/:id/files`               | API Key | List files            |
| `GET`    | `/sandbox/:id/files/:name`         | API Key | Download file         |

### Usage
| Method   | Route     | Guard | Description              |
|----------|-----------|-------|--------------------------|
| `GET`    | `/usage`  | JWT   | Current month usage      |

---

## Project Structure

```
src/
├── main.ts                          # Bootstrap + Swagger + global pipes
├── app.module.ts                    # Root module
├── auth/                            # Authentication + API key management
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── dto/auth.dto.ts
├── sandbox/                         # Sandbox lifecycle (create/destroy)
│   ├── sandbox.controller.ts
│   ├── sandbox.service.ts
│   ├── sandbox.module.ts
│   └── dto/sandbox.dto.ts
├── execution/                       # Code execution (REST + WebSocket)
│   ├── execution.controller.ts
│   ├── execution.service.ts
│   ├── execution.gateway.ts         # WebSocket streaming
│   ├── execution.module.ts
│   └── dto/execution.dto.ts
├── files/                           # File upload/download
│   ├── files.controller.ts
│   ├── files.service.ts
│   ├── files.module.ts
│   └── dto/files.dto.ts
├── lifecycle/                       # Background cleanup (cron)
│   ├── lifecycle.service.ts
│   └── lifecycle.module.ts
├── usage/                           # Usage tracking + limits
│   ├── usage.controller.ts
│   ├── usage.service.ts
│   └── usage.module.ts
├── docker/                          # Docker daemon integration
│   ├── docker.service.ts
│   └── docker.module.ts
├── database/                        # Prisma client wrapper
│   ├── prisma.service.ts
│   └── database.module.ts
└── common/                          # Shared infrastructure
    ├── guards/
    │   ├── jwt-auth.guard.ts
    │   └── api-key.guard.ts
    ├── filters/
    │   └── http-exception.filter.ts
    ├── interceptors/
    │   └── logging.interceptor.ts
    └── decorators/
        └── current-user.decorator.ts
```

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- PostgreSQL database (or Neon account)
- Docker daemon accessible via TCP (for sandbox host)

### 1. Install dependencies
```bash
cd server
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your database URL, JWT secret, Docker host, etc.
```

### 3. Generate Prisma client & push schema
```bash
npx prisma generate
npx prisma db push
```

### 4. Start development server
```bash
npm run start:dev
```

The server will be running at:
- **API:** http://localhost:3000
- **Swagger docs:** http://localhost:3000/api
- **WebSocket:** ws://localhost:3000/ws/execute

### 5. Run tests
```bash
npm test              # Run all tests
npm run test:cov      # Run with coverage report
```

---

## Environment Variables

| Variable                          | Description                              | Default              |
|-----------------------------------|------------------------------------------|----------------------|
| `DATABASE_URL`                    | PostgreSQL connection string             | —                    |
| `PORT`                            | Server port                              | `3000`               |
| `NODE_ENV`                        | Environment (development/production)     | `development`        |
| `JWT_SECRET`                      | Secret for signing JWT tokens            | —                    |
| `JWT_EXPIRATION`                  | JWT token expiration                     | `24h`                |
| `DOCKER_HOST`                     | Remote Docker daemon address             | `tcp://localhost:2376` |
| `SANDBOX_DEFAULT_TIMEOUT_SECONDS` | Default sandbox timeout                  | `300`                |
| `SANDBOX_MEMORY_LIMIT`           | Container memory limit                   | `256m`               |
| `SANDBOX_CPU_LIMIT`              | Container CPU limit (cores)              | `0.5`                |
| `SANDBOX_PID_LIMIT`              | Container PID limit                      | `64`                 |
| `SANDBOX_MAX_FILE_SIZE_BYTES`    | Max upload file size                     | `10485760` (10MB)    |
| `FREE_TIER_MAX_SANDBOXES`       | Max sandboxes per month (free tier)      | `5`                  |
| `FREE_TIER_MAX_EXECUTIONS`      | Max executions per month (free tier)     | `100`                |
| `FREE_TIER_MAX_COMPUTE_SECONDS` | Max compute seconds per month            | `600`                |
| `THROTTLE_TTL`                   | Rate limit window (seconds)              | `60`                 |
| `THROTTLE_LIMIT`                 | Max requests per window                  | `30`                 |

---

## Security

- **Passwords** hashed with bcrypt (12 rounds)
- **API keys** hashed with SHA-256 before database storage
- **JWT Bearer** authentication on dashboard routes
- **API Key** authentication (`X-API-Key` header) on SDK routes
- **Ownership isolation** — users can only access their own sandboxes (403 on cross-user)
- **Container hardening** — memory/CPU/PID limits, no-root user, capability dropping, no-new-privileges
- **Consistent error shape** — every error returns `{ statusCode, message, error }`
- **No sensitive data in logs** — API keys and passwords are never logged

---

## Useful Commands

```bash
# Kill process on a specific port
fuser -k 3000/tcp

# Generate Prisma client after schema changes
npx prisma generate

# Push schema changes to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Build for production
npm run build

# Start production server
npm run start:prod
```

---

## License

UNLICENSED — Private project.
