# JobFlow — Frontend

> Track every job application. Miss nothing.

JobFlow is a full-stack job application tracker built for developers actively job hunting. It gives you a clean dashboard to monitor your pipeline, track statuses, get reminded about follow-ups, and see your response rate at a glance.

**Live Demo:** [jobflow.vercel.app](https://jobflow.vercel.app) <!-- replace with your URL -->  
**Backend Repo:** [job-flow-backend](https://github.com/AndaniMagodi/job-flow-backend)

---

## Screenshots

### Dashboard
![Dashboard](./screenshots/dashboard.png)

### Applications
![Applications](./screenshots/applications.png)

### Login
![Login](./screenshots/login.png)

---

## Features

- **Auth** — Register and sign in with JWT-based authentication
- **Dashboard** — Summary cards showing total applications, interviews, offers, and response rate
- **Action Centre** — Highlights overdue follow-ups so nothing slips through
- **Recent Activity** — Timeline of your latest application events
- **Applications List** — Full list of tracked applications with status badges
- **Quick Add** — Add a new application in seconds with auto-filled status and date
- **Status Tracking** — Applied → Interview → Offer → Rejected
- **Notes** — Add notes to each application
- **Job Link** — Save the original job posting URL per application

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React + TypeScript |
| State Management | React Context |
| Server State / Data Fetching | TanStack Query (React Query) |
| Routing | React Router v7 |
| HTTP Client | Native Fetch API (custom wrapper) |
| Build Tool | Vite |

---

## Getting Started

### Prerequisites
- Node.js 18+
- The backend running locally or deployed (see [backend repo](https://github.com/AndaniMagodi/job-flow-backend))

### Installation

```bash
git clone https://github.com/AndaniMagodi/job-flow-frontend.git
cd job-flow-frontend
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_API_URL=http://localhost:8000
```

### Run Locally

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Project Structure

```
src/
├── api/              # API call functions
├── assets/           # Static assets
├── components/       # Reusable UI components
├── context/          # React context providers
├── data/             # Static/seed data
├── lib/              # Utility functions and helpers
├── pages/            # Route-level page components
├── types/            # TypeScript interfaces
├── App.tsx           # Root component
└── main.tsx          # Entry point
```

---

## Deployment

Deployed on **Vercel**. Connect your GitHub repo and set the `VITE_API_URL` environment variable to your backend URL.

---

## Roadmap

- [ ] Kanban board view
- [ ] Email reminders for follow-ups
- [ ] Interview preparation notes
- [ ] CSV export of all applications
