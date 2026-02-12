# Cliniko Waitlist Optimizer

A smart waitlist-to-slot matching system that helps clinic staff efficiently fill cancelled appointments with waitlisted patients. This is a proposed feature enhancement for [Cliniko](https://www.cliniko.com/).

## Overview

When appointments are cancelled, clinics often struggle to fill those slots quickly. This tool automatically matches available slots with waitlisted patients based on:

- **Patient preferences** (preferred practitioners, available days/times)
- **Urgency levels** (urgent, high, normal, low)
- **Wait time** (prioritizes patients who have been waiting longer)
- **Appointment type compatibility** (duration matching)

### Key Features

- **Smart Matching Algorithm** - Scores and ranks matches based on multiple weighted factors
- **Real-time Dashboard** - View top matches, active waitlist, and practitioner availability
- **Urgency Filtering** - Filter matches by urgency level (urgent, high, normal, low)
- **One-Click Booking** - Book appointments directly from the matches table
- **Fully Responsive** - Works on desktop, tablet, and mobile devices

## Tech Stack

### Backend
- **NestJS 11** - Node.js framework with TypeScript
- **Prisma 7** - Next-generation ORM with PostgreSQL
- **PostgreSQL** - Relational database

### Frontend
- **Next.js 16** - React framework with App Router
- **TanStack Query v5** - Server state management
- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library
- **Lucide React** - Icon library

### Infrastructure
- **Turborepo** - High-performance monorepo build system
- **pnpm** - Fast, disk space efficient package manager

## Project Structure

```
cliniko-waitlist-optimizer/
├── apps/
│   ├── api/                 # NestJS backend
│   │   ├── prisma/          # Database schema & migrations
│   │   └── src/
│   │       └── modules/     # Feature modules (matching, waitlist, slots, dashboard)
│   └── web/                 # Next.js frontend
│       ├── app/             # App router pages
│       ├── components/      # React components
│       ├── hooks/           # Custom hooks (TanStack Query)
│       └── lib/             # API client & utilities
├── packages/
│   ├── types/               # Shared TypeScript types
│   ├── ui/                  # shadcn/ui components
│   ├── eslint-config/       # Shared ESLint config
│   └── typescript-config/   # Shared TypeScript config
└── docs/                    # Documentation
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL 15+ (or use Docker)

### Installation

1. **Clone the repository**
   ```bash
   git clone git@github.com:iammilankhati/cliniko-waitlist-optimiser.git
   cd cliniko-waitlist-optimizer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   # In apps/api, create .env file
   cp apps/api/.env.example apps/api/.env

   # Update DATABASE_URL with your PostgreSQL connection string
   DATABASE_URL="postgresql://user:password@localhost:5432/cliniko_waitlist"
   ```

4. **Set up the database**
   ```bash
   # Run migrations
   cd apps/api
   npx prisma migrate dev

   # Seed demo data
   npx prisma db seed
   ```

5. **Start the development servers**
   ```bash
   # From root directory - starts both API and Web
   pnpm dev
   ```

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000/api/v1

## API Endpoints

### Dashboard
- `GET /api/v1/dashboard/overview` - Dashboard statistics
- `GET /api/v1/dashboard/top-matches` - Top scored matches
- `GET /api/v1/dashboard/practitioners` - Practitioner availability

### Matching
- `GET /api/v1/matching` - All potential matches
- `GET /api/v1/matching/waitlist/:id` - Matches for specific waitlist entry
- `POST /api/v1/matching/book` - Book a match

### Waitlist
- `GET /api/v1/waitlist` - All waitlist entries
- `GET /api/v1/waitlist/stats` - Waitlist statistics

### Slots
- `GET /api/v1/slots/stats` - Available slot statistics

## Matching Algorithm

The matching algorithm scores each potential waitlist-slot pair (0-100) based on:

| Factor | Weight | Description |
|--------|--------|-------------|
| Duration Match | 30 | Slot duration matches appointment type |
| Urgency | 25 | Higher urgency = higher score |
| Wait Time | 20 | Longer wait = higher score |
| Preferred Practitioner | 15 | Patient's preferred practitioner |
| Available Days | 10 | Slot day matches patient availability |

## Deployment

### Quick Deploy Options

**For demonstration purposes, you can deploy:**

- **Frontend (Vercel)**: Connect your GitHub repo and deploy the `apps/web` directory
- **Backend (Railway/Render)**: Deploy the `apps/api` directory with PostgreSQL addon
- **Database**: Use Railway PostgreSQL, Supabase, or Neon for free tier PostgreSQL

### Environment Variables

**Backend (apps/api/.env)**
```env
DATABASE_URL="postgresql://..."
PORT=4000
NODE_ENV=production
CORS_ORIGIN="https://your-frontend-url.vercel.app"
```

**Frontend (apps/web/.env)**
```env
NEXT_PUBLIC_API_URL="https://your-api-url.railway.app/api/v1"
```

## Development

```bash
# Run all apps in development
pnpm dev

# Run only API
pnpm dev --filter=@cliniko/api

# Run only Web
pnpm dev --filter=web

# Build all apps
pnpm build

# Lint all apps
pnpm lint

# Format code
pnpm format
```

## Demo Data

The seed script creates realistic demo data including:
- 3 business locations
- 5 practitioners with specializations
- 6 appointment types (Initial Consult, Follow-up, Treatment, etc.)
- 20 patients with varied preferences
- 15 active waitlist entries
- 40 available slots over the next 2 weeks

## License

MIT

## Author

Built as a proposed feature enhancement for Cliniko's practice management software.

---

**Note**: This is a demonstration project and is not affiliated with or endorsed by Cliniko.
