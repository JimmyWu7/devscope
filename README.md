# DevScope

**DevScope** is a developer productivity and career intelligence platform that helps users track job applications, analyze GitHub activity, and centralize their software engineering journey in one place.

👉 Live App: https://devscope-flame.vercel.app/

---

## 📌 Overview

Job application platforms like LinkedIn, Indeed, Handshake, and company career pages often do not provide reliable confirmation or tracking once an application is submitted.

DevScope solves this by giving developers a **central system to track, analyze, and manage all job applications**, while also integrating **GitHub insights and developer statistics** into a unified dashboard.

It also includes a **Chrome extension** that automatically extracts job application details directly from job listing pages and syncs them into the platform.

---

## 🚨 Problem

- No centralized way to track job applications across platforms
- Missing or inconsistent application confirmation emails
- Difficult to compare applications, statuses, and outcomes
- Limited visibility into personal job search performance
- GitHub data is fragmented and not career-contextualized

---

## 💡 Solution

DevScope provides:

- A **job application tracking system**
- A **Chrome extension** to auto-capture job details from listings
- A **developer analytics dashboard**
- A **GitHub-powered profile system**

Everything is centralized into a single, structured workflow for job seekers.

---

## ✨ Key Features

### 📊 Job Application Tracker

- Track all submitted job applications in one place
- Store company, role, salary, location, work mode, and status
- Search, filter, and sort applications
- Compare application outcomes over time

### 🧩 Chrome Extension (Vite-based)

- Extracts job data from:
  - LinkedIn
  - Indeed
  - Handshake
  - Company career pages
- Auto-fills or manually captures:
  - Company name
  - Role title
  - Salary range
  - Work mode
  - Location
  - Date posted
  - Platform
  - Application url
- Sends structured data directly to DevScope dashboard

### 📈 Developer Dashboard

- Monthly application statistics
- Interview rate tracking
- Job application trends and insights

### 🧑‍💻 GitHub Integration

- GitHub OAuth login
- GitHub contribution heatmap
- Public repository syncing
- Display of user projects inside DevScope

### 🔐 Authentication

- GitHub OAuth-based authentication
- Secure session handling

---

## 🧱 Tech Stack

**Frontend / Fullstack**

- Next.js (App Router)
- TypeScript
- Tailwind CSS

**Backend**

- Next.js API Route Handlers
- Prisma ORM

**Database**

- PostgreSQL (Neon)

**Storage**

- Cloudflare R2 (resumes & uploads)

**Authentication**

- GitHub OAuth (NextAuth-based flow)

**Extension**

- Vite
- TypeScript
- Chrome Extension APIs

**Deployment**

- Vercel

---

## 🧩 Chrome Extension

The DevScope Chrome extension lives inside the same repository (`/extension`).

### How it works:

1. User opens a job posting page
2. Extension parses job details using platform-specific parsers:
   - LinkedIn
   - Indeed
   - Handshake
3. Data is structured and either:
   - Manually submitted via popup UI
   - Auto-captured on submit actions
4. Data is sent to DevScope backend and stored in the user dashboard

---

## 🗄️ Data Model

Core entities include:

- Users (GitHub-based profiles)
- Job Applications (tracking system)
- GitHub Repositories
- GitHub Sync metadata
- Resumes

Full schema: [`/prisma/schema.prisma`](./prisma/schema.prisma)

---

## 🏗️ Architecture

DevScope is a monolithic Next.js application with:

- Server Components for data-heavy rendering
- API Route Handlers for backend logic
- Prisma for database operations
- GitHub API integration layer
- Chrome extension as an external ingestion pipeline

More details: [`/docs/architecture.md`](./docs/architecture.md)

---

## 📦 Product Scope

### MVP Features

- GitHub OAuth login
- GitHub repo + contribution sync
- Job application tracking system
- Chrome extension for job capture
- Dashboard analytics (applications + interviews)

See full scope: [`/docs/mvp-scope.md`](./docs/mvp-scope.md)

---

## 🖼️ Screenshots

- Dashboard
- Job applications tracker
- Chrome extension popup

---

## 🚀 Roadmap

### Next Up

- AI-generated job application summaries
- Resume parsing improvements
- Advanced analytics dashboard
- Job search pipeline automation
- Notifications for application status updates

---

## 📁 Project Structure

- `/src` → Main Next.js application
- `/extension` → Chrome extension (Vite + TypeScript)
- `/prisma` → Database schema + migrations
- `/docs` → Product and system documentation

---

## 🧑‍💻 Getting Started

```bash
git clone https://github.com/your-repo/devscope.git
cd devscope
npm install
```

### Setup environment

```bash
cp .env.example .env
```

### Run development server

```bash
npm run dev
```

### Run extension (development)

```bash
cd extension
npm install
npm run dev
```

---

## 🌐 Deployment
- Frontend + Backend: Vercel
- Database: PostgreSQL (Neon)
- File Storage: Cloudflare R2
- Extension: Local / Chrome unpacked extension