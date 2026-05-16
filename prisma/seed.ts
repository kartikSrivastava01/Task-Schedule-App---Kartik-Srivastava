import { PrismaClient, Role, TaskStatus, Priority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.task.deleteMany();
  await prisma.projectMember.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('admin123', 10);
  const memberPassword = await bcrypt.hash('member123', 10);

  // Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const member1 = await prisma.user.create({
    data: {
      email: 'member1@example.com',
      name: 'Member One',
      password: memberPassword,
      role: Role.MEMBER,
    },
  });

  const member2 = await prisma.user.create({
    data: {
      email: 'member2@example.com',
      name: 'Member Two',
      password: memberPassword,
      role: Role.MEMBER,
    },
  });

  // Projects
  const project1 = await prisma.project.create({
    data: {
      title: 'Website Redesign',
      description: 'Overhaul the company website with a modern design.',
      createdById: admin.id,
      members: {
        create: [
          { userId: admin.id },
          { userId: member1.id },
          { userId: member2.id },
        ],
      },
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Mobile App Development',
      description: 'Build a new mobile app for task tracking.',
      createdById: admin.id,
      members: {
        create: [
          { userId: admin.id },
          { userId: member1.id },
        ],
      },
    },
  });

  // Tasks for Project 1
  await prisma.task.createMany({
    data: [
      {
        title: 'Design Mockups',
        description: 'Create initial design mockups in Figma.',
        status: TaskStatus.COMPLETED,
        priority: Priority.HIGH,
        projectId: project1.id,
        assignedToId: member1.id,
        createdById: admin.id,
        dueDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
      },
      {
        title: 'Frontend Implementation',
        description: 'Implement the designed mockups using React.',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.MEDIUM,
        projectId: project1.id,
        assignedToId: member1.id,
        createdById: admin.id,
        dueDate: new Date(Date.now() + 86400000 * 3), // In 3 days
      },
      {
        title: 'Content Review',
        description: 'Review the website content with the marketing team.',
        status: TaskStatus.TODO,
        priority: Priority.LOW,
        projectId: project1.id,
        assignedToId: member2.id,
        createdById: admin.id,
        dueDate: new Date(Date.now() + 86400000 * 5), // In 5 days
      },
    ],
  });

  // Tasks for Project 2
  await prisma.task.createMany({
    data: [
      {
        title: 'API Authentication',
        description: 'Set up JWT-based authentication for the mobile app.',
        status: TaskStatus.IN_PROGRESS,
        priority: Priority.HIGH,
        projectId: project2.id,
        assignedToId: member1.id,
        createdById: admin.id,
        dueDate: new Date(Date.now() - 86400000), // 1 day ago (Overdue)
      },
      {
        title: 'Database Schema Design',
        description: 'Define the database models for the mobile app.',
        status: TaskStatus.TODO,
        priority: Priority.MEDIUM,
        projectId: project2.id,
        assignedToId: admin.id,
        createdById: admin.id,
        dueDate: new Date(Date.now() + 86400000 * 7), // In 7 days
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
