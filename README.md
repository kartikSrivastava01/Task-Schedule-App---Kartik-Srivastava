# TeamTask Pro — Tactical Project Management System

[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**TeamTask Pro** is a high-performance, responsive Project Management application engineered for tactical team collaboration and operational excellence. This application empowers teams to orchestrate complex workflows, track project nodes, and manage task deployments with precision.

> **Note:** This is a **Frontend-Only Architecture** deployment. To ensure seamless demonstration and evaluation without server-side dependencies, the application utilizes an advanced `localStorage` persistence layer. It simulates a full-stack experience including authentication, RBAC, and real-time state calculation purely within the client environment.

---

## 🔗 Live Resources

- **Live Project URL**: [https://task-schedule-app-kartik-srivastava-production.up.railway.app/]
- **GitHub Repository**: [https://github.com/kartikSrivastava01/Task-Schedule-App---Kartik-Srivastava/edit/main/README.md]

---

## 🔑 Demo Access Credentials

| Role | Email Identity | Access Key |
| :--- | :--- | :--- |
| **Administrator** | `admin@example.com` | `admin123` |
| **Member Unit 01** | `member@example.com` | `member123` |
| **Member Unit 02** | `jatin@example.com` | `member123` |

*Demo data is automatically synchronized and seeded into your local browser environment upon initial initialization.*

---

## 🚀 Core Features

### 🔐 Authentication Protocol
- **Identity Simulation**: Comprehensive Signup and Login flows with credential validation.
- **Session Persistence**: Automated session recovery via `localStorage`.
- **Duplicate Prevention**: Logic-level checks to prevent redundant unit registrations.
- **Protected Routing**: Cryptographic-like route guarding based on authentication and role parameters.

### 🛡️ Role-Based Access Control (RBAC)
- **ADMIN Tier**:
  - Full structural control over Projects (Create, Edit, Delete).
  - Personnel Management: Addition and removal of project member nodes.
  - Deployment Control: Creation, Assignment, and Lifecycle management of all tasks.
  - Global intelligence overview via full-scale Dashboard analytics.
- **MEMBER Tier**:
  - Strategic view restricted to assigned project sectors.
  - Operational queue management for assigned tasks.
  - Restricted state updates (Status updates only; structural parameters remain immutable).
  - Personalized performance metrics on Dashboard.

### 📊 Tactical Dashboard
- **Total Intelligence**: Global counters for Projects, Tasks, and Personnel.
- **Status Breakdown**: Visual distribution of Completed, Pending, and In-Progress nodes.
- **Threat Detection**: Automated identification of Overdue task deployments.
- **Efficiency Metrics**: Real-time completion percentage calculations based on operational data.

### 📂 Project & Task Management
- **Workspaces**: Dedicated views for project metadata and associated task clusters.
- **Lifecycle Tracking**: Status transitions (TODO → IN_PROGRESS → COMPLETED).
- **Priority Scaling**: Tiered urgency markers (LOW, MEDIUM, HIGH).
- **Intelligence Search**: Global search parameters for instant task and project retrieval.

---

## 🛠️ Technical Implementation

- **Library**: `React 19` (Functional Components, Hooks)
- **Build Engine**: `Vite` for optimized development and bundling.
- **State Architecture**: `React Context API` for global Auth and Session state.
- **Interface Design**: `Tailwind CSS 4.0` with Glassmorphism aesthetics and custom tactical themes.
- **Routing**: `React Router 7` for seamless multi-page navigation.
- **Persistence**: Enhanced `localStorage` wrapper with JSON serialization.
- **Icons**: `Lucide React` for optimized vector iconography.
- **Motion**: `framer-motion` for fluid state transitions.

---

## 💼 Why Frontend-Only?

This architectural decision was made to maximize availability and ease of evaluation. By utilizing a local persistence layer, the application:
1. **Eliminates Deployment Friction**: No backend failures or database connection strings required.
2. **Instant Response**: Zero-latency data operations for a "desktop-class" feel.
3. **Pure Logic Demonstration**: Focuses entirely on the complex frontend logic, UI engineering, and state management strategies.

---

## 💾 Local Storage Schema

The system operates using four primary data keys:

1. `teamTaskManager_users`: Registry of registered identities and authentication hashes.
2. `teamTaskManager_currentUser`: Active session state and bearer identity.
3. `teamTaskManager_projects`: Structural metadata for all project volumes.
4. `teamTaskManager_tasks`: Detailed state for every operational unit.

### 📋 Data Structures

**User Object**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "ADMIN | MEMBER",
  "createdAt": "ISOString"
}
```

**Project Object**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "createdBy": "userId",
  "members": ["userId"],
  "createdAt": "ISOString",
  "updatedAt": "ISOString"
}
```

**Task Object**
```json
{
  "id": "string",
  "title": "string",
  "status": "TODO | IN_PROGRESS | COMPLETED",
  "priority": "LOW | MEDIUM | HIGH",
  "dueDate": "ISOString",
  "projectId": "projectId",
  "assignedTo": "userId",
  "createdBy": "userId",
  "createdAt": "ISOString"
}
```

---

## 🏗️ Folder Architecture

```text
team-task-manager/
├── src/
│   ├── components/  # Reusable UI primitives (Badges, Stats, Modals)
│   ├── context/     # Global state and Auth providers
│   ├── layouts/     # Persistent UI wrappers (Sidebar, Header)
│   ├── pages/       # Strategic view components (Dashboard, Tasks)
│   ├── routes/      # Guarded routing logic
│   ├── utils/       # localStorage drivers and ID generators
│   ├── styles/      # Global Tailwind configuration
│   ├── App.tsx      # Core Application logic
│   └── main.tsx     # Modern entry point
├── package.json     # Dependency manifest
└── README.md        # Technical Documentation
```

---

## ⚙️ Installation & Deployment

### Local Development
1. **Clone the Sector**:
   `git clone <repository-url>`
2. **Install Module Dependencies**:
   `npm install`
3. **Execute Development Server**:
   `npm run dev`
4. **Access UI**:
   Navigate to `http://localhost:3000`

### Production Build
1. **Compress & Bundle**:
   `npm run build`
2. **Preview Asset Bundle**:
   `npm run preview`

### Deployment Guide
- **Vercel**: Import Repo → Set Build to `npm run build` → Set Output to `dist` → Deploy.
- **Netlify**: Import Repo → Set Build to `npm run build` → Set Publish to `dist` → Deploy.

---

## ⚖️ Permission Matrix

| Feature | Administrator | Member |
| :--- | :---: | :---: |
| Initialize Projects | ✅ | ❌ |
| Edit Project Schemas | ✅ | ❌ |
| Delete Project Nodes | ✅ | ❌ |
| View Assigned Projects | ✅ | ✅ |
| Deploy New Tasks | ✅ | ❌ |
| Assign Personnel | ✅ | ❌ |
| Update Task Status | ✅ | ✅ (Own Only) |
| Remove Task Nodes | ✅ | ❌ |
| View Full Intelligence | ✅ | ❌ (Restricted) |

---

## 🔄 Reset Protocol

The application includes a **Factory Reset** feature located in the Profile settings. Executing this command will:
1. Purge all `localStorage` keys.
2. Re-initialize the default seed database.
3. Redirect to the Authentication gate for a fresh deployment.

---

## 📸 System Previews

| [Login Gate] | [Tactical Dashboard] |
| :---: | :---: |
| ![Login Screenshot Placeholder] | ![Dashboard Screenshot Placeholder] |

| [Project Registry] | [Deployment Queue] |
| :---: | :---: |
| ![Projects Screenshot Placeholder] | ![Tasks Screenshot Placeholder] |

---

## 📽️ Demo Presentation Script

1. **Deployment Intro**: "Welcome to TeamTask Pro, a tactical task management system engineered for performance."
2. **Admin Briefing**: Log in as Admin. Navigate the Dashboard. Highlight calculations and overdue alerts.
3. **Project Initialization**: Create a new project. Assign Member Unit 01.
4. **Task Deployment**: Create a High-Priority task. Set an immediate due date to show the "Overdue" indicator.
5. **Member Execution**: Switch to Member perspective. Demonstrate restricted UI visibility (No Create buttons).
6. **Persistence Check**: Refresh the page. Show that all operations remain synchronized in the local environment.
7. **Conclusion**: "TeamTask Pro provides full project orchestration with zero server friction."

---

## ⚠️ Architectural Limitations & Security Notice

- **Authentication Simulation**: Password hashes are stored locally for demonstration. This is **not** intended for production security.
- **Isolated Environment**: Data is browser-specific. Clearing cache or switching browsers will reset the context.
- **Scale Constraints**: `localStorage` has a standard 5MB character limit.

---

## 🔮 Future Roadmap

- Migrating to `PostgreSQL` and `Prisma` for multi-user synchronization.
- Implementing `JWT` Bearer authentication with `bcrypt` encryption.
- Direct `Socket.io` integration for real-time collaborative updating.
- AI-driven task prioritization using Gemini API nodes.

---
*Engineered by Tactical Productivity Units for Assessment Purposes. 2026.*
