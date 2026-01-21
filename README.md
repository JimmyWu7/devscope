# DevScope

## Overview

DevScope is a developer intelligence platform that transforms raw GitHub activity into meaningful insights. It helps developers clearly showcase their work while allowing recruiters to quickly understand recent contributions and skills.

---

## Problem

GitHub provides raw data, but not clarity. Developers struggle to communicate impact, and recruiters struggle to assess candidates efficiently using repositories alone.

---

## Solution

DevScope aggregates GitHub data and presents it through a clean dashboard and public profile. It focuses on recent activity, language usage, and contribution visibility — without unnecessary complexity.

---

## Core Features (MVP)

- GitHub OAuth login
- Fetch public repositories
- Fetch recent commits (last 90 days)
- Developer dashboard:
  - Repository list
  - Commit activity count
  - Language usage
- Public profile at `/u/[username]`
- Database persistence

Out-of-scope features are intentionally excluded for focus.

> See full scope: [`/docs/mvp-scope.md`](./docs/mvp-scope.md)

---

## Tech Stack

- **Frontend:** Next.js (App Router, Server Components)
- **Backend:** Next.js Route Handlers, GitHub REST + GraphQL APIs
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth with GitHub OAuth
- **Deployment:** Vercel

---

## Architecture (High-Level)

DevScope uses a single Next.js application with clearly separated frontend, backend, and data responsibilities.

> Full details: [`/docs/architecture.md`](./docs/architecture.md)

---

## Data Model

Relational schema for users, repositories, commits, and sync tracking.

> Draft schema: [`/docs/data-model.md`](./docs/data-model.md)

---

## Product Planning Docs

- Product Vision: [`/docs/product-vision.md`](./docs/product-vision.md)
- MVP Scope: [`/docs/mvp-scope.md`](./docs/mvp-scope.md)
- Architecture: [`/docs/architecture.md`](./docs/architecture.md)
- Data Model: [`/docs/data-model.md`](./docs/data-model.md)

---

## Roadmap

**Phase 1 (MVP)**

- Planning & documentation (Sprint 0)
- App setup and environment configuration
- Core feature implementation
- Initial deployment

**Future Phases**

- AI summaries
- Portfolio mode
- Advanced analytics
- Notifications
