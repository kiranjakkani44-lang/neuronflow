# NeuronFlow

AI Automation Agency SaaS Platform built for Indian SMBs.

## Tech Stack
- **Frontend:** React 18, Tailwind CSS, Vite, Zustand, Recharts, Framer Motion
- **Backend:** Node.js, Express, TypeScript, Prisma ORM
- **Database:** SQLite (dev) / PostgreSQL (prod)
- **Auth:** JWT + Google OAuth ready

## Features
- Live Agent Dashboard with real-time metrics
- Agent Marketplace with 18 pre-built AI agents
- ROI Calculator
- Lead capture & management
- Deployment tracking
- Agent logs viewer
- Billing & subscription management (Razorpay)

## Getting Started

### 1. Start the server

```bash
cd server
npm install
cp .env.example .env
npx prisma generate
npx prisma db push
npx ts-node-dev prisma/seed.ts
npm run dev
```

### 2. Start the client

```bash
cd client
npm install
npm run dev
```

### 3. Open the app

- **Landing:** http://localhost:5173
- **Marketplace:** http://localhost:5173/agents
- **Dashboard:** http://localhost:5173/dashboard (requires login)

## API Routes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | - | Register new user |
| POST | `/api/auth/login` | - | Login |
| POST | `/api/auth/logout` | ✓ | Logout |
| GET | `/api/auth/me` | ✓ | Get current user |
| PUT | `/api/auth/profile` | ✓ | Update profile |
| POST | `/api/auth/reset-request` | - | Request password reset |
| GET | `/api/agents` | - | List all agents |
| GET | `/api/agents/:slug` | - | Get agent details |
| GET | `/api/deployments` | ✓ | List user deployments |
| POST | `/api/deployments` | ✓ | Deploy an agent |
| PUT | `/api/deployments/:id` | ✓ | Pause/Resume deployment |
| DELETE | `/api/deployments/:id` | ✓ | Remove deployment |
| GET | `/api/deployments/:id/logs` | ✓ | Get agent logs |
| POST | `/api/audit` | - | Submit audit request |
| GET | `/api/leads` | ✓ | List leads |
| PUT | `/api/leads/:id` | ✓ | Update lead status |
| POST | `/api/payments/order` | ✓ | Create payment order |
| POST | `/api/payments/verify` | ✓ | Verify payment |

## Environment Variables

Copy `.env.example` to `.env` and fill in:

```bash
# Required
JWT_SECRET=your-secret-key

# Optional (for full functionality)
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-secret
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-secret
```

## Pages

- `/` - Landing page with hero, ROI calculator, pricing
- `/agents` - Agent marketplace
- `/agents/:slug` - Agent detail & deploy
- `/pricing` - Pricing plans
- `/contact` - Free audit request form
- `/login` - Login
- `/register` - Register
- `/dashboard` - Overview (protected)
- `/dashboard/agents` - My Agents (protected)
- `/dashboard/leads` - Lead management (protected)
- `/dashboard/agents/:id/logs` - Agent logs (protected)
- `/dashboard/billing` - Billing & subscriptions (protected)

## Docker (Production)

```bash
docker-compose up -d
```

This starts PostgreSQL, Redis, and the app with Nginx reverse proxy.

## Architecture

```
client/           React 18 SPA
├── pages/        Route pages
├── components/   Shared components
├── api/          Axios client with auth interceptor
└── store/        Zustand auth store

server/
├── src/
│   ├── index.ts          Express entry
│   ├── routes/           API route handlers
│   └── middleware/       Auth middleware
└── prisma/
    ├── schema.prisma     Database schema
    └── seed.ts           Seed data (18 agents)
```