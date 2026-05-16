# TeamTask Pro - Tactical Task Management System

A premium, high-performance task management application designed for streamlined collaboration and operational efficiency. This version is a **frontend-only demo** that utilizes the browser's `localStorage` for data persistence, making it fully functional without requiring a dedicated backend server.

## 🚀 Key Features

- **Frontend-Only Persistence**: All data is stored locally in your browser via `localStorage`. No server setup required.
- **Role-Based Access Control (RBAC)**:
  - **ADMIN**: Full control over projects, tasks, and team members.
  - **MEMBER**: Focus on assigned tasks and project visibility based on membership.
- **Interactive Dashboard**: Real-time stats calculation including completion percentages, overdue task alerts, and activity logs.
- **Advanced Task Management**: Filter by status/priority, search functionality, and status lifecycle tracking.
- **Project Workspaces**: Progress tracking via visual indicators and team member management.

## 🛠️ Tech Stack

- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS (Glassmorphism & Tactical UI)
- **Icons**: Lucide React
- **Animations**: Motion (framer-motion)
- **Date Handling**: date-fns
- **Routing**: React Router 7

## 🔑 Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@example.com` | `admin123` |
| **Member** | `member@example.com` | `member123` |
| **Member** | `jatin@example.com` | `member123` |

## 🏗️ Folder Structure

```text
team-task-manager/
  src/
    components/    # Reusable UI components
    context/       # Auth and Global state
    layouts/       # Shared page wrappers
    pages/         # View components
    utils/         # localStorage and helper logic
    types.ts       # Global TypeScript types
    App.tsx        # Routing and App entry
    main.tsx       # Vite entry point
  package.json
  README.md
```

## ⚙️ Setup & Installation

1. **Clone and Install**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 💡 How localStorage Works

This application uses specific keys in the browser's local storage to persist data:
- `teamTaskManager_users`: Registry of user accounts.
- `teamTaskManager_currentUser`: The currently authenticated session.
- `teamTaskManager_projects`: Project configuration and metadata.
- `teamTaskManager_tasks`: Individual task units and states.

*Note: In a production environment, sensitive data like passwords should never be stored in localStorage. This is a simulation for demo purposes.*

## ⚠️ Limitations

- **Browser Specific**: Data is unique to the browser and device used.
- **No Cross-Device Sync**: Since there is no backend, data does not sync between different computers.
- **Storage Limits**: Limited to approximately 5MB of text data (standard localStorage limit).

---

**TeamTask Pro** - *Engineered for Tactical Productivity.*
