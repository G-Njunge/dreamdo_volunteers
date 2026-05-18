# DreamDo Africa — Volunteer Program Portal

> **Live Site:** [https://dreamdo-sigma.vercel.app](https://dreamdo-sigma.vercel.app)

A web-based volunteer reporting and management system built for **DreamDo Africa**. Volunteers can submit weekly progress reports through a personalized portal, while staff can manage the volunteer roster, view all reports organized by month, and download them as PDFs.

---

## Table of Contents

- [Overview](#overview)
- [Live Deployment](#live-deployment)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Deployment](#deployment)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)

---

## Overview

The DreamDo Africa Volunteer Portal replaces manual reporting methods (spreadsheets, email chains, Google Forms) with a purpose-built platform tailored to how DreamDo Africa operates. Every volunteer has access to a personalized reporting form, and staff have a secure dashboard with full visibility over all submissions.

---

## Live Deployment

The application is live and accessible at:

**[https://dreamdo-sigma.vercel.app](https://dreamdo-sigma.vercel.app)**

Hosted on **Vercel** with continuous deployment — every push to the `main` branch automatically triggers a new production build.

---

## Features

### Volunteer Side
- Select your name from the volunteer roster on the landing page
- Personalized greeting with your initials on the report page
- Structured weekly progress report covering:
  - Project / Task Name
  - Description
  - DreamDo Staff Member You Worked With
  - Challenges Faced
  - Next Steps / Goals
  - Support Needed from DreamDo Staff
- Confirmation screen on successful submission

### Staff Side
- Password-protected staff portal
- Dashboard with total volunteer and report counts
- **Progress Overview** — bar chart showing reports submitted per volunteer
- **All Reports** — reports grouped and organized by month
- Per-report PDF download — branded DreamDo Africa PDF for each submission
- Monthly PDF download — all reports from a given month bundled into one PDF
- **Manage Volunteers** — add new volunteers to the roster or remove existing ones

### General
- Data stored and synced in real time via Supabase (PostgreSQL)
- Fully responsive layout
- DreamDo Africa brand colors throughout (`#1a3896` royal blue palette)
- No user accounts required for volunteers — name-based access

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 |
| Bundler | Vite 5 |
| Database | Supabase (PostgreSQL) |
| PDF Generation | jsPDF 2.5 |
| Hosting | Vercel |
| Styling | Inline React styles (no CSS framework) |
| Language | JavaScript (JSX) |

---

## Project Structure

```
dreamdo-volunteer/
├── .env                    # Environment variables (never commit this)
├── .env.example            # Safe template to share with the team
├── .gitignore
├── index.html              # HTML entry point
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx            # React root mount
    ├── App.jsx             # Full application — all components and logic
    └── utils/
        └── supabase.js     # Supabase client initialisation
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) v18 or later
- npm (comes with Node.js)
- A [Supabase](https://supabase.com) account and project

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/dreamdo-volunteer.git
cd dreamdo-volunteer

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env
# Then open .env and fill in your Supabase credentials

# 4. Start the development server
npm run dev
```

Open your browser at **http://localhost:5173**

---

## Environment Variables

Create a `.env` file in the root of the project with the following:

```env
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

You can find both values in your Supabase project under **Settings → API**.

> **Important:** Never commit your `.env` file to version control. It is already included in `.gitignore`.

The `VITE_` prefix is required by Vite for any environment variable to be accessible in the browser.

### `.env.example`

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

---

## Database Setup

Run the following SQL in your **Supabase SQL Editor** to create the required tables:

```sql
-- Volunteer roster
create table volunteers (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  created_at timestamp default now()
);

-- Progress reports
create table reports (
  id uuid default gen_random_uuid() primary key,
  volunteer text not null,
  project_name text,
  project_description text,
  spd_staff text,
  challenges text,
  next_steps text,
  support_needed text,
  created_at timestamp default now()
);
```

After running the SQL, your tables will appear in the Supabase **Table Editor**. No further configuration is needed — the app connects automatically using your environment variables.

---

## Deployment

The project is deployed on **Vercel** at [https://dreamdo-sigma.vercel.app](https://dreamdo-sigma.vercel.app).

### Deploy your own instance

**Option 1 — Vercel CLI**
```bash
npm install -g vercel
vercel
```

**Option 2 — Vercel Dashboard**
1. Push your project to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel auto-detects Vite — no build configuration needed
4. Add your environment variables under **Project Settings → Environment Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**

Every subsequent push to `main` triggers an automatic redeployment.

### Build for production locally

```bash
npm run build
```

Output goes to the `dist/` folder. This can be deployed to any static hosting provider.

---

## Usage Guide

### As a Volunteer

1. Visit [https://dreamdo-sigma.vercel.app](https://dreamdo-sigma.vercel.app)
2. Click **Access as Volunteer**
3. Select your name from the dropdown
4. Fill in all fields on the progress report form
5. Click **Submit Progress Report**

### As Staff

1. Visit [https://dreamdo-sigma.vercel.app](https://dreamdo-sigma.vercel.app)
2. Click **Access as DreamDo Staff**
3. Enter the staff password
4. You will land on the **Volunteer Dashboard** with three tabs:
   - **Progress Overview** — visual bar chart of report activity per volunteer
   - **All Reports** — all submissions grouped by month, each downloadable as PDF
   - **Manage Volunteers** — add or remove volunteers from the roster

---

## Key Files to Edit

| What you want to change | Where to change it |
|---|---|
| Staff password | `STAFF_PASSWORD` constant at the top of `App.jsx` |
| Form questions | `QUESTIONS` array at the top of `App.jsx` |
| Brand colors | `BLUE`, `DARK_BLUE`, `MID_BLUE` constants in `App.jsx` |
| Organisation name / copy | Search for "DreamDo" in `App.jsx` and update as needed |
| Supabase credentials | `.env` file |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit: `git commit -m "Add your feature"`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

This project was built for **DreamDo Africa**. All rights reserved.

---

*Built with React + Vite + Supabase · Deployed on Vercel*
