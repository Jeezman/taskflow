import { db } from '@/lib/db';
import { tasks, projects } from '@/lib/db/schema';
import { desc, eq, and, sql } from 'drizzle-orm';

export type Task = {
  id: number;
  projectId: number;
  title: string;
  description: string | null;
  status: 'todo' | 'in-progress' | 'done';
  dueDate: Date | null;
};

export type TaskCounts = {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
};

export class TaskService {
  private static instance: TaskService;

  private constructor() {}

  public static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  async getRecentTasks(userId: number, limit: number = 5): Promise<Task[]> {
    const recentTasks = await db
      .select()
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(eq(projects.userId, userId))
      .orderBy(desc(tasks.id))
      .limit(limit);

    return recentTasks.map((result) => ({
      ...result.tasks,
      dueDate: result.tasks.dueDate ? new Date(result.tasks.dueDate) : null,
    }));
  }

  async getTaskCounts(userId: number): Promise<TaskCounts> {
    const today = new Date().toISOString().split('T')[0];

    const [totalCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(eq(projects.userId, userId));

    const [completedCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(and(eq(projects.userId, userId), eq(tasks.status, 'done')));

    const [inProgressCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(and(eq(projects.userId, userId), eq(tasks.status, 'in-progress')));

    const [overdueCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(tasks)
      .innerJoin(projects, eq(tasks.projectId, projects.id))
      .where(
        and(
          eq(projects.userId, userId),
          eq(tasks.status, 'todo'),
          sql`${tasks.dueDate} < ${today}`
        )
      );

    return {
      total: totalCount?.count || 0,
      completed: completedCount?.count || 0,
      inProgress: inProgressCount?.count || 0,
      overdue: overdueCount?.count || 0,
    };
  }
}
