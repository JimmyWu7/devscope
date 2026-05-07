# Architecture — DevScope

## Overview

DevScope is a full-stack Next.js application with an integrated Chrome extension that acts as an external data ingestion layer.

The system combines:

- Web dashboard (core platform)
- API backend (Next.js Route Handlers)
- Database (PostgreSQL + Prisma)
- Chrome extension (job data extractor)

---

## Frontend (Web App)

- Built with Next.js App Router
- Uses Server Components for data-heavy pages
- Client Components for interactive UI (tables, dialogs, filters)
- Dashboard, job tracker, GitHub insights, and project views

---

## Backend (API Layer)

- Next.js Route Handlers (`/app/api`)
- Handles:
  - Authentication (GitHub OAuth via NextAuth)
  - Job application CRUD operations
  - GitHub API sync (repos, contributions)
  - Extension token validation
- Acts as the main orchestration layer

---

## Chrome Extension

- Built with Vite + TypeScript
- Runs in browser context
- Parses job postings from:
  - LinkedIn
  - Indeed
  - Handshake
  - Company career pages

### Responsibilities:

- Extract structured job data from DOM
- Normalize data using platform-specific parsers
- Send data to backend API
- Support manual + auto capture modes

---

## Database

- PostgreSQL (Neon)
- Managed via Neon serverless Postgres
- Prisma ORM used for schema management and queries

Used for storing:
- Users
- GitHub profiles and repositories
- Job applications
- Sync metadata

---

## File Storage

- Cloudflare R2

Used for:
- Resume uploads
- Resume thumbnails (if generated)
- Secure object storage for user documents

R2 is used instead of traditional file storage to ensure:
- Low-cost scalable storage
- S3-compatible API
- Fast global access

---

## Authentication

- GitHub OAuth-based login
- Handled via NextAuth
- Tokens stored server-side only
- Used for both GitHub API access and user identity

---

## Deployment

- Frontend + Backend deployed on Vercel
- Database hosted on Neon (serverless Postgres)
- File storage handled via Cloudflare R2
- Chrome extension distributed separately (unpacked dev mode / future Chrome Web Store)