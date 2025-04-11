import { Card } from '@/src/components/ui/card';
import { SessionService } from '@/app/services/session';
import { UserService } from '@/app/services/user';
import { TaskService, Task } from '@/app/services/task';
import Link from 'next/link';

export default async function DashboardPage() {
  const sessionService = SessionService.getInstance();
  const userId = await sessionService.getCurrentUserId();
  let firstName = '';
  let userTasks: Task[] = [];
  let taskCounts = {
    total: 0,
    completed: 0,
    inProgress: 0,
    overdue: 0,
  };

  if (userId) {
    const userService = UserService.getInstance();
    firstName = await userService.getUserFirstName(userId);

    const taskService = TaskService.getInstance();
    userTasks = await taskService.getRecentTasks(userId);
    taskCounts = await taskService.getTaskCounts(userId);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back{firstName ? `, ${firstName}` : ''}!
        </h1>
        <p className="text-slate-500">
          Here&apos;s what&apos;s happening with your tasks today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Tasks</p>
              <p className="text-2xl font-bold text-slate-900">
                {taskCounts.total}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Completed Today
              </p>
              <p className="text-2xl font-bold text-slate-900">
                {taskCounts.completed}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">In Progress</p>
              <p className="text-2xl font-bold text-slate-900">
                {taskCounts.inProgress}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Overdue</p>
              <p className="text-2xl font-bold text-slate-900">
                {taskCounts.overdue}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Tasks */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recent Tasks</h2>
          <Link
            href="/dashboard/tasks"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            View all
          </Link>
        </div>

        <Card className="overflow-hidden">
          {userTasks.length === 0 ? (
            <div className="p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-slate-900">
                No tasks yet
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Get started by creating a new project.
              </p>
              <div className="mt-6">
                <Link
                  href="/dashboard/projects"
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Create Project
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {userTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <input
                        type="checkbox"
                        id={`task-${task.id}`}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                        aria-label={`Mark task ${task.title} as complete`}
                        checked={task.status === 'done'}
                        readOnly
                      />
                      <div>
                        <h3 className="font-medium text-slate-900">
                          {task.title}
                        </h3>
                        <p className="text-sm text-slate-500">
                          {task.dueDate
                            ? `Due ${new Date(
                                task.dueDate
                              ).toLocaleDateString()}`
                            : 'No due date'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          task.status === 'done'
                            ? 'bg-green-100 text-green-800'
                            : task.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {task.status}
                      </span>
                      <button
                        className="p-1 text-slate-400 hover:text-slate-600"
                        aria-label={`More options for task ${task.title}`}
                        title={`More options for task ${task.title}`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
