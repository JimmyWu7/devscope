# Architecture — DevScope

This document describes the high-level system architecture for DevScope.

---

## Frontend
- Built with **Next.js App Router**
- Server Components used for data-heavy pages
- Client Components used only where interactivity is required

---

## Backend
- Implemented using **Next.js Route Handlers** (`/app/api`)
- Integrates with GitHub REST and GraphQL APIs
- Uses Prisma ORM for database access
- Route handlers are responsible for authentication, GitHub API orchestration, and database writes

---

## Database
- PostgreSQL
- Stores cached GitHub data to avoid refetching on every page load

---

## Authentication
- GitHub OAuth via NextAuth
- OAuth tokens stored securely on the server
- No direct client-side access to tokens

---

## Deployment
- Deployed on Vercel
- Frontend and backend hosted together
