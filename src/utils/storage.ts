import { User, Project, Task, Role } from '../types.ts';

const STORAGE_KEYS = {
  USERS: 'teamTaskManager_users',
  CURRENT_USER: 'teamTaskManager_currentUser',
  PROJECTS: 'teamTaskManager_projects',
  TASKS: 'teamTaskManager_tasks',
};

// --- Generic Helpers ---
const getStorage = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const setStorage = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const generateId = () => Math.random().toString(36).substr(2, 9);

// --- User Operations ---
export const getUsers = (): User[] => getStorage<User>(STORAGE_KEYS.USERS);

export const findUserByEmail = (email: string): User | undefined => {
  return getUsers().find(u => u.email === email);
};

export const findUserById = (id: string): User | undefined => {
  return getUsers().find(u => u.id === id);
};

export const saveUser = (user: User) => {
  const users = getUsers();
  setStorage(STORAGE_KEYS.USERS, [...users, user]);
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

// --- Project Operations ---
export const getProjects = (): Project[] => getStorage<Project>(STORAGE_KEYS.PROJECTS);

export const saveProject = (project: Project) => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === project.id);
  if (index >= 0) {
    projects[index] = project;
    setStorage(STORAGE_KEYS.PROJECTS, projects);
  } else {
    setStorage(STORAGE_KEYS.PROJECTS, [...projects, project]);
  }
};

export const deleteProject = (id: string) => {
  const projects = getProjects().filter(p => p.id !== id);
  setStorage(STORAGE_KEYS.PROJECTS, projects);
  // Also delete tasks associated with this project
  const tasks = getTasks().filter(t => t.projectId !== id);
  setStorage(STORAGE_KEYS.TASKS, tasks);
};

export const getProjectById = (id: string): Project | undefined => {
  return getProjects().find(p => p.id === id);
};

// --- Task Operations ---
export const getTasks = (): Task[] => getStorage<Task>(STORAGE_KEYS.TASKS);

export const saveTask = (task: Task) => {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === task.id);
  if (index >= 0) {
    tasks[index] = task;
    setStorage(STORAGE_KEYS.TASKS, tasks);
  } else {
    setStorage(STORAGE_KEYS.TASKS, [...tasks, task]);
  }
};

export const deleteTask = (id: string) => {
  const tasks = getTasks().filter(t => t.id !== id);
  setStorage(STORAGE_KEYS.TASKS, tasks);
};

export const getTaskById = (id: string): Task | undefined => {
  return getTasks().find(t => t.id === id);
};

// --- Seeding ---
export const seedInitialData = () => {
  if (getUsers().length > 0) return;

  const users: User[] = [
    {
      id: 'admin-1',
      name: 'System Admin',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'ADMIN',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'member-1',
      name: 'John Member',
      email: 'member@example.com',
      password: 'member123',
      role: 'MEMBER',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'member-2',
      name: 'Jatin Dev',
      email: 'jatin@example.com',
      password: 'member123',
      role: 'MEMBER',
      createdAt: new Date().toISOString(),
    },
  ];

  const projects: Project[] = [
    {
      id: 'project-1',
      title: 'Cloud Transformation',
      description: 'Migrating legacy infrastructure to hyperscale cloud nodes.',
      createdBy: 'admin-1',
      members: ['admin-1', 'member-1', 'member-2'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'project-2',
      title: 'Security Hardening',
      description: 'Implementation of Zero-Trust architecture across all tactical units.',
      createdBy: 'admin-1',
      members: ['admin-1', 'member-1'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const tasks: Task[] = [
    {
      id: 'task-1',
      title: 'Database Schema Migration',
      description: 'Update core user schemas for compliance.',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      projectId: 'project-1',
      assignedTo: 'member-1',
      createdBy: 'admin-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-2',
      title: 'Firewall Audit',
      description: 'Reviewing all ingress rules for edge nodes.',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() - 86400000).toISOString(), // Overdue
      projectId: 'project-2',
      assignedTo: 'member-1',
      createdBy: 'admin-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'task-3',
      title: 'API Gateway Setup',
      description: 'Deploying kong gateway cluster.',
      status: 'COMPLETED',
      priority: 'LOW',
      dueDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      projectId: 'project-1',
      assignedTo: 'member-2',
      createdBy: 'admin-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  setStorage(STORAGE_KEYS.USERS, users);
  setStorage(STORAGE_KEYS.PROJECTS, projects);
  setStorage(STORAGE_KEYS.TASKS, tasks);
};
