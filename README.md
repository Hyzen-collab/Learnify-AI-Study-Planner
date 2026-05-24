# 🎓 Learnify — AI-Powered Study Planner

<div align="center">

![Learnify Banner](https://img.shields.io/badge/Learnify-AI%20Study%20Planner-4A7C59?style=for-the-badge&logo=graduation-cap&logoColor=white)

[![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=flat-square&logo=google)](https://aistudio.google.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**A full-stack AI-powered web application that generates personalised study plans, manages tasks, and provides an intelligent study assistant — built as a BSc (Hons) Software Engineering final year project.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [API Docs](#-api-documentation) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [How AI Integration Works](#-how-ai-integration-works)
- [Author](#-author)

---

## 📖 Project Overview

**Learnify** is a full-stack SaaS-style web application designed to help university students plan, manage, and optimise their study sessions using Artificial Intelligence. 

The application solves a real problem faced by students: the difficulty of creating structured, personalised study plans that account for multiple subjects, exam dates, priorities, and available time. By integrating Google's Gemini AI, Learnify generates detailed week-by-week study plans in seconds, tailored to each student's unique schedule and learning style.

### 🎯 Problem Statement
University students often struggle with:
- Unstructured study habits leading to poor exam performance
- Difficulty prioritising multiple subjects with different deadlines
- Lack of personalised guidance on how to allocate study time
- No centralised system to track study progress and tasks

### 💡 Solution
Learnify addresses these problems by providing:
- AI-generated personalised study plans based on subjects, exam dates and priorities
- A complete task management system with priority levels and due dates
- An AI chat assistant for instant study guidance
- A Pomodoro-style study timer to maintain focus
- A dashboard with visual analytics to track progress

---

## ✨ Features

### 🔐 Authentication System
- Secure user registration and login
- JWT (JSON Web Token) based authentication
- Password hashing with bcryptjs
- Protected routes — all data is user-specific

### 🤖 AI Study Plan Generator
- Input subjects, exam dates, priorities, and available hours
- Google Gemini 1.5 Flash generates a detailed week-by-week study plan
- Plans include topic breakdowns, revision checkpoints, and exam strategies
- Save generated plans to your account for future reference

### 💬 AI Study Assistant Chat
- Real-time conversational AI powered by Google Gemini
- Maintains conversation history within a session
- Quick prompt suggestions to get started instantly
- Helpful for concept explanations, study tips, and exam strategies

### ✅ Task Manager
- Create tasks with title, subject, priority, due date, and estimated time
- Mark tasks as complete with one click
- Filter by All / Pending / Completed
- Automatic completion timestamp recording

### 📊 Dashboard & Analytics
- Overview of total, completed, and pending tasks
- Tasks due today counter
- Total study hours logged
- Weekly activity bar chart
- Completion rate progress indicator
- Active study plans summary

### 📚 Study Plans Library
- View all saved AI-generated study plans
- Expand to read full plan content
- Subject tags with priority colour coding
- Plan status tracking (active/completed/paused)

### ⏱️ Pomodoro Study Timer
- Three modes: Focus (25 min), Short Break (5 min), Long Break (15 min)
- Animated circular progress indicator
- Session counter to track daily focus sessions
- Browser notifications when timer completes
- Subject input to log what you're studying

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.2 | UI component framework |
| Vite | 5.1 | Build tool and dev server |
| Tailwind CSS | 3.4 | Utility-first styling |
| React Router DOM | 6.22 | Client-side routing |
| Axios | 1.6 | HTTP client for API calls |
| Recharts | 2.12 | Data visualisation charts |
| Lucide React | 0.344 | Icon library |
| React Hot Toast | 2.4 | Toast notifications |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | JavaScript runtime |
| Express.js | 4.18 | Web application framework |
| Mongoose | 8.2 | MongoDB object modelling |
| JSON Web Token | 9.0 | Authentication tokens |
| bcryptjs | 2.4 | Password hashing |
| dotenv | 16.4 | Environment variable management |
| nodemon | 3.1 | Development auto-restart |

### Database & AI
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud NoSQL database |
| Google Gemini 1.5 Flash | AI plan generation and chat |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT BROWSER                       │
│              React + Vite (localhost:5173)               │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP Requests (Axios)
                      │ JWT Token in Headers
                      ▼
┌─────────────────────────────────────────────────────────┐
│                   EXPRESS.JS SERVER                      │
│                   (localhost:5000)                       │
│                                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  │
│  │  /auth  │  │ /plans  │  │ /tasks  │  │  /ai    │  │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘  │
│                      │                        │         │
│              JWT Auth Middleware               │         │
└──────────────────────┼────────────────────────┼─────────┘
                       │                        │
          ┌────────────┘                        └──────────┐
          ▼                                               ▼
┌──────────────────┐                        ┌────────────────────┐
│  MongoDB Atlas   │                        │  Google Gemini AI  │
│  (Cloud DB)      │                        │  (Gemini 1.5 Flash)│
│                  │                        │                    │
│  • users         │                        │  • generatePlan()  │
│  • plans         │                        │  • chat()          │
│  • tasks         │                        │  • studyTip()      │
└──────────────────┘                        └────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed on your machine:

| Tool | Version | Download |
|---|---|---|
| Node.js | 18 or higher | [nodejs.org](https://nodejs.org) |
| Git | Latest | [git-scm.com](https://git-scm.com) |
| VS Code | Latest | [code.visualstudio.com](https://code.visualstudio.com) |

You also need free accounts at:
- [MongoDB Atlas](https://mongodb.com/atlas) — free cloud database
- [Google AI Studio](https://aistudio.google.com) — free Gemini API key

---

### Installation

**Step 1 — Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/learnify-ai-study-planner.git
cd learnify-ai-study-planner
```

**Step 2 — Install backend dependencies**
```bash
cd backend
npm install
```

**Step 3 — Install frontend dependencies**
```bash
cd ../frontend
npm install
```

**Step 4 — Configure environment variables**
```bash
cd ../backend
cp .env.example .env
```
Open `.env` and fill in your credentials (see [Environment Variables](#-environment-variables) below).

**Step 5 — Run the backend server**
```bash
cd backend
npm run dev
```
You should see:
```
✅ Connected to MongoDB
✅ Server running on http://localhost:5000
```

**Step 6 — Run the frontend (new terminal)**
```bash
cd frontend
npm run dev
```

**Step 7 — Open the app**

Visit [http://localhost:5173](http://localhost:5173) in your browser, register an account and start using Learnify!

---

## 🔑 Environment Variables

Create a `.env` file inside the `backend/` folder with these values:

```env
# MongoDB Connection String (from MongoDB Atlas)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/learnify

# Google Gemini API Key (from aistudio.google.com)
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret (any long random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Server Port
PORT=5000

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

> ⚠️ **Never commit your `.env` file to GitHub.** It is already listed in `.gitignore` for safety.

---

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Create new account | ❌ |
| POST | `/api/auth/login` | Login to account | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

**Register Request Body:**
```json
{
  "name": "Piumal Gayashan",
  "email": "piumal@university.ac.lk",
  "password": "securepassword123"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Piumal Gayashan",
    "email": "piumal@university.ac.lk"
  }
}
```

---

### Study Plans Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/plans` | Get all user plans | ✅ |
| POST | `/api/plans` | Create new plan | ✅ |
| GET | `/api/plans/:id` | Get single plan | ✅ |
| PUT | `/api/plans/:id` | Update plan | ✅ |
| DELETE | `/api/plans/:id` | Delete plan | ✅ |

---

### Tasks Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/api/tasks` | Get all tasks | ✅ |
| GET | `/api/tasks/stats` | Get task statistics | ✅ |
| POST | `/api/tasks` | Create task | ✅ |
| PUT | `/api/tasks/:id` | Update/complete task | ✅ |
| DELETE | `/api/tasks/:id` | Delete task | ✅ |

---

### AI Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/ai/generate-plan` | Generate AI study plan | ✅ |
| POST | `/api/ai/chat` | Chat with AI assistant | ✅ |
| POST | `/api/ai/study-tip` | Get a study tip | ✅ |

**Generate Plan Request Body:**
```json
{
  "subjects": [
    {
      "name": "Data Structures",
      "examDate": "2024-06-15",
      "priority": "high",
      "hoursPerWeek": 8
    }
  ],
  "startDate": "2024-05-01",
  "endDate": "2024-06-15",
  "hoursPerDay": 4,
  "studyStyle": "balanced"
}
```

---

## 📁 Project Structure

```
learnify-ai-study-planner/
│
├── backend/                        # Node.js + Express API
│   ├── controllers/                # Business logic
│   │   ├── authController.js       # Register, login, get user
│   │   ├── planController.js       # CRUD for study plans
│   │   ├── taskController.js       # CRUD for tasks + stats
│   │   └── aiController.js         # Gemini AI integration
│   │
│   ├── models/                     # MongoDB schemas
│   │   ├── User.js                 # User model + password hashing
│   │   ├── Plan.js                 # Study plan model
│   │   └── Task.js                 # Task model
│   │
│   ├── routes/                     # API route definitions
│   │   ├── auth.js
│   │   ├── plans.js
│   │   ├── tasks.js
│   │   └── ai.js
│   │
│   ├── middleware/
│   │   └── auth.js                 # JWT verification middleware
│   │
│   ├── .env.example                # Environment variable template
│   ├── .gitignore
│   ├── package.json
│   └── server.js                   # App entry point
│
├── frontend/                       # React + Vite application
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx          # Sidebar navigation layout
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state
│   │   │
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── PlansPage.jsx
│   │   │   ├── TasksPage.jsx
│   │   │   ├── AIGeneratorPage.jsx
│   │   │   ├── AIChatPage.jsx
│   │   │   └── TimerPage.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js              # Axios instance + interceptors
│   │   │
│   │   ├── App.jsx                 # Routes configuration
│   │   ├── main.jsx                # React entry point
│   │   └── index.css               # Global styles + Tailwind
│   │
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

---

## 🤖 How AI Integration Works

Learnify uses **Google Gemini 1.5 Flash** via the `@google/generative-ai` Node.js SDK.

### Study Plan Generation
When a user submits their subjects and configuration, the backend constructs a detailed prompt including the student's name, subjects with exam dates and priorities, available study hours, and preferred study style. Gemini returns a structured week-by-week plan which is displayed in the frontend and can be saved to MongoDB.

### AI Chat Assistant
The chat feature maintains conversation history within a session. Each message sends the full conversation history to Gemini along with a system context that establishes the assistant as a software engineering study helper. Responses are capped at 500 tokens to keep them concise and relevant.

### Security
All AI endpoints are protected by JWT middleware — only authenticated users can make AI requests. The Gemini API key is stored in the `.env` file and never exposed to the frontend.

---

## 🔒 Security Features

- Passwords hashed with **bcryptjs** (12 salt rounds) — never stored as plain text
- **JWT tokens** expire after 7 days
- All API routes (except login/register) protected by auth middleware
- **CORS** configured to only accept requests from the frontend URL
- Environment variables used for all sensitive credentials
- `.gitignore` prevents `.env` from being committed to GitHub

---

## 👨‍💻 Author

**Piumal Gayashan**
BSc (Hons) Software Engineering — Year 3

- GitHub: [@YOUR_USERNAME](https://github.com/YOUR_USERNAME)
- Email: piumalmyself@gmail.com

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Built with ❤️ as a BSc Software Engineering Project
</div>
