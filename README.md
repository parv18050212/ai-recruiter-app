# 🌐 AI Recruiter Platform — Frontend (React + Vite + TypeScript)

[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![shadcn/ui](https://img.shields.io/badge/shadcn/ui-000000?style=flat)](https://ui.shadcn.com/)

> **Modern, production-focused frontend for the Autonomous AI Recruitment Manager.**
> Clean UI for HR teams, candidate tracking, resume ingestion, and real-time interview status synced with the backend orchestration engine.

Backend repo: **https://github.com/parv18050212/hr_agent**

---

# 🚀 Overview

This frontend is designed to provide a **professional-grade dashboard** for HR teams and a **self-service portal** for candidates.

It interacts with the backend’s automated pipeline that:

- Scores resumes using **Gemini embeddings**
- Flags high-fit candidates
- Sends interview proposals for approval
- Books Google Calendar meetings
- Emails candidates automatically

The frontend delivers a smooth UI for managing all of this.

---

# 🎯 Features

### ✅ **HR Dashboard**
- View all open job roles  
- Upload and manage resumes  
- View AI-generated match scores  
- Review interview proposals (Pending → Approve → Auto-book)  
- Track interview stages and meet links  

### ✅ **Candidate Portal**
- Enter email to view application status  
- Receive real-time updates once HR approves interviews  

### ✅ **Beautiful UI**
- Built with **shadcn/ui**, **TailwindCSS**, and clean component architecture  
- Mobile-friendly layouts  
- Dark/light mode compatible  

### ✅ **API Integration Layer**
- Typed service wrappers to interact with FastAPI backend  
- Endpoints for:
  - Jobs
  - Candidates
  - Resume upload
  - Pending interviews
  - Approvals
  - Candidate status view

### ✅ **Production-Ready Setup**
- Vite bundling  
- Environment-based API URLs  
- Docker-ready  
- CI/CD friendly structure  

---

# 🏗️ Tech Stack

| Layer | Tools |
|------|-------|
| Frontend Framework | React + TypeScript |
| UI | TailwindCSS, shadcn/ui |
| Build Tool | Vite |
| State Handling | React Query / Local State |
| API | Fetch/axios wrappers calling FastAPI backend |
| Deployment | Vercel / Netlify / Docker |

---

# 📁 Project Structure

```
ai-recruiter-app/
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Candidate + HR pages
│   ├── api/                 # API service wrappers
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utilities
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

# ⚙️ Setup & Installation

```bash
git clone https://github.com/parv18050212/ai-recruiter-app
cd ai-recruiter-app

npm install          # install dependencies
npm run dev          # start dev server on localhost:5173
```

---

# 🔌 API Configuration

Create a `.env` file:

```
VITE_API_BASE_URL=http://localhost:8000
```

Frontend will call:

```
GET  /jobs
POST /jobs/:id/candidates
GET  /pending-interviews
POST /pending-interviews/:id/approve
GET  /my-applications/:email
```

Vite proxy can also be used during development.

---

# 🧪 Development Workflow

### Start Dev Servers
```bash
npm run dev      # frontend
uvicorn hr_agent.app.main:app --reload  # backend
```

### Build for Production
```bash
npm run build
npm run preview
```

---

# 🌍 Deployment

### Recommended approaches:
- **Vercel** (static hosting + environment variables)
- **Netlify**
- **Docker container + Nginx**
- **Serve behind reverse proxy hitting FastAPI backend**

Minimal Dockerfile:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
```

---

# 🛤️ Roadmap

- Add HR analytics dashboard  
- Add real-time WebSocket updates  
- Add role-based authentication (HR, Recruiter, Candidate)  
- Add resume preview UI  
- Add drag-and-drop resume upload  

---

# 📄 License

MIT — free to use, modify, and deploy.

---

# 🙌 Acknowledgements

This UI powers the **Autonomous Recruitment Manager**, a full-stack system leveraging:

- Google Gemini  
- LangGraph agent workflows  
- FastAPI backend  
- pgvector semantic search  

Frontend + backend together provide end-to-end AI-powered recruitment automation.
