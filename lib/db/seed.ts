import { db } from './index';
import { users, projects, tasks, taskStatusEnum } from './schema';
import { hashPassword } from '@/lib/auth/session';

export async function seed() {
  try {
    // Create a test user
    const hashedPassword = await hashPassword('password123');
    const [user] = await db
      .insert(users)
      .values({
        name: 'John Doe',
        email: 'johndoe@example.com',
        hashedPassword,
      })
      .returning();

    // Create a test project
    const [project] = await db
      .insert(projects)
      .values({
        title: 'My First Project',
        description: 'A test project to get started',
        userId: user.id,
      })
      .returning();

    // Create some test tasks
    await db.insert(tasks).values({
      projectId: project.id,
      title: 'Set up the project',
      description: 'Initialize the project structure',
      status: taskStatusEnum.enumValues[2], // 'done'
      dueDate: '2024-03-20',
    });

    await db.insert(tasks).values({
      projectId: project.id,
      title: 'Create database schema',
      description: 'Design and implement the database schema',
      status: taskStatusEnum.enumValues[2], // 'done'
      dueDate: '2024-03-21',
    });

    await db.insert(tasks).values({
      projectId: project.id,
      title: 'Implement authentication',
      description: 'Add user authentication and authorization',
      status: taskStatusEnum.enumValues[1], // 'in-progress'
      dueDate: '2024-03-25',
    });

    await db.insert(tasks).values({
      projectId: project.id,
      title: 'Build task management UI',
      description: 'Create the user interface for managing tasks',
      status: taskStatusEnum.enumValues[0], // 'todo'
      dueDate: '2024-03-30',
    });

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
