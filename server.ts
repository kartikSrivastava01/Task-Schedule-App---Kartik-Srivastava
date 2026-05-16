import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { PrismaClient, Role, TaskStatus, Priority } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware, requireRole, AuthRequest } from './server/middleware.js';

dotenv.config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Auth Routes ---
  app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: role as Role || Role.MEMBER,
        },
      });

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: '7d',
      });

      res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
        expiresIn: '7d',
      });

      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/auth/me', authMiddleware, async (req: AuthRequest, res) => {
    res.json({ user: req.user });
  });

  // --- User Routes ---
  app.get('/api/users', authMiddleware, requireRole(Role.ADMIN), async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true },
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // --- Project Routes ---
  app.get('/api/projects', authMiddleware, async (req: AuthRequest, res) => {
    try {
      let projects;
      if (req.user?.role === Role.ADMIN) {
        projects = await prisma.project.findMany({
          include: {
            creator: { select: { name: true } },
            members: { include: { user: { select: { id: true, name: true, email: true } } } },
            tasks: true,
          },
        });
      } else {
        projects = await prisma.project.findMany({
          where: {
            members: { some: { userId: req.user?.id } },
          },
          include: {
            creator: { select: { name: true } },
            members: { include: { user: { select: { id: true, name: true, email: true } } } },
            tasks: { where: { assignedToId: req.user?.id } },
          },
        });
      }
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/projects', authMiddleware, requireRole(Role.ADMIN), async (req: AuthRequest, res) => {
    const { title, description, memberIds } = req.body;
    try {
      const project = await prisma.project.create({
        data: {
          title,
          description,
          createdById: req.user!.id,
          members: {
            create: [
              { userId: req.user!.id },
              ...(memberIds || []).map((id: string) => ({ userId: id })),
            ],
          },
        },
        include: { members: true },
      });
      res.status(201).json(project);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/projects/:id', authMiddleware, async (req: AuthRequest, res) => {
    const { id } = req.params;
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          creator: { select: { name: true } },
          members: { include: { user: { select: { id: true, name: true, email: true } } } },
          tasks: {
            include: { assignedTo: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!project) return res.status(404).json({ message: 'Project not found' });

      const isMember = project.members.some((m) => m.userId === req.user?.id);
      if (req.user?.role !== Role.ADMIN && !isMember) {
        return res.status(403).json({ message: 'Access denied' });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put('/api/projects/:id', authMiddleware, requireRole(Role.ADMIN), async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    try {
      const project = await prisma.project.update({
        where: { id },
        data: { title, description },
      });
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.delete('/api/projects/:id', authMiddleware, requireRole(Role.ADMIN), async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.project.delete({ where: { id } });
      res.json({ message: 'Project deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/projects/:id/members', authMiddleware, requireRole(Role.ADMIN), async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    try {
      const member = await prisma.projectMember.create({
        data: { projectId: id, userId },
      });
      res.status(201).json(member);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.delete('/api/projects/:id/members/:userId', authMiddleware, requireRole(Role.ADMIN), async (req, res) => {
    const { id, userId } = req.params;
    try {
      await prisma.projectMember.delete({
        where: { projectId_userId: { projectId: id, userId } },
      });
      res.json({ message: 'Member removed' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // --- Task Routes ---
  app.get('/api/tasks', authMiddleware, async (req: AuthRequest, res) => {
    try {
      let tasks;
      if (req.user?.role === Role.ADMIN) {
        tasks = await prisma.task.findMany({
          include: { project: true, assignedTo: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        });
      } else {
        tasks = await prisma.task.findMany({
          where: { assignedToId: req.user?.id },
          include: { project: true, assignedTo: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
        });
      }
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/tasks', authMiddleware, requireRole(Role.ADMIN), async (req: AuthRequest, res) => {
    const { title, description, status, priority, dueDate, projectId, assignedToId } = req.body;
    try {
      const task = await prisma.task.create({
        data: {
          title,
          description,
          status: status as TaskStatus,
          priority: priority as Priority,
          dueDate: dueDate ? new Date(dueDate) : null,
          projectId,
          assignedToId,
          createdById: req.user!.id,
        },
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.put('/api/tasks/:id', authMiddleware, async (req: AuthRequest, res) => {
    const { id } = req.params;
    const { title, description, status, priority, dueDate, assignedToId } = req.body;
    try {
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task) return res.status(404).json({ message: 'Task not found' });

      if (req.user?.role !== Role.ADMIN) {
        // If not admin, you can only update status of your own task
        if (task.assignedToId !== req.user?.id) {
          return res.status(403).json({ message: 'Access denied' });
        }
        // Only allow status update
        const updatedTask = await prisma.task.update({
          where: { id },
          data: { status: status as TaskStatus },
        });
        return res.json(updatedTask);
      }

      // Admin can update everything
      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          title,
          description,
          status: status as TaskStatus,
          priority: priority as Priority,
          dueDate: dueDate ? new Date(dueDate) : null,
          assignedToId,
        },
      });
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.patch('/api/tasks/:id/status', authMiddleware, async (req: AuthRequest, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const task = await prisma.task.findUnique({ where: { id } });
      if (!task) return res.status(404).json({ message: 'Task not found' });

      if (req.user?.role !== Role.ADMIN && task.assignedToId !== req.user?.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const updatedTask = await prisma.task.update({
        where: { id },
        data: { status: status as TaskStatus },
      });
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.delete('/api/tasks/:id', authMiddleware, requireRole(Role.ADMIN), async (req, res) => {
    const { id } = req.params;
    try {
      await prisma.task.delete({ where: { id } });
      res.json({ message: 'Task deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // --- Dashboard Stats ---
  app.get('/api/dashboard/stats', authMiddleware, async (req: AuthRequest, res) => {
    try {
      const now = new Date();
      let projectsCount, tasksQuery, membersCount = 0;

      if (req.user?.role === Role.ADMIN) {
        projectsCount = await prisma.project.count();
        tasksQuery = {};
        membersCount = await prisma.user.count({ where: { role: Role.MEMBER } });
      } else {
        projectsCount = await prisma.project.count({
          where: { members: { some: { userId: req.user?.id } } },
        });
        tasksQuery = { assignedToId: req.user?.id };
      }

      const tasks = await prisma.task.findMany({ where: tasksQuery });

      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t) => t.status === TaskStatus.COMPLETED).length;
      const inProgressTasks = tasks.filter((t) => t.status === TaskStatus.IN_PROGRESS).length;
      const pendingTasks = tasks.filter((t) => t.status === TaskStatus.TODO).length;
      const overdueTasks = tasks.filter(
        (t) => t.status !== TaskStatus.COMPLETED && t.dueDate && new Date(t.dueDate) < now
      ).length;

      const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      const recentTasks = await prisma.task.findMany({
        where: tasksQuery,
        include: { project: { select: { title: true } } },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });

      res.json({
        totalProjects: projectsCount,
        totalTasks,
        completedTasks,
        inProgressTasks,
        pendingTasks,
        overdueTasks,
        completionPercentage,
        recentTasks,
        membersCount,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // --- Vite Setup ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
