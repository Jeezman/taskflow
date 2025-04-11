'use client';

import { useState, useEffect } from 'react';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Link from 'next/link';

type TaskStatus = 'todo' | 'in-progress' | 'done';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date | null;
  createdAt: Date;
  projectId: number;
}

interface Project {
  id: number;
  title: string;
  description: string;
}

interface ApiTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string | null;
  createdAt: string;
  projectId: number;
}

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'todo':
      return 'bg-slate-100 text-slate-700';
    case 'in-progress':
      return 'bg-blue-100 text-blue-700';
    case 'done':
      return 'bg-green-100 text-green-700';
  }
};

const getStatusLabel = (status: TaskStatus) => {
  switch (status) {
    case 'todo':
      return 'To Do';
    case 'in-progress':
      return 'In Progress';
    case 'done':
      return 'Done';
  }
};

const formatDate = (date: Date | null) => {
  if (!date) return null;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const isOverdue = (date: Date | null) => {
  if (!date) return false;
  return date < new Date() && date.toDateString() !== new Date().toDateString();
};

function EditTaskModal({
  task,
  onClose,
  onSave,
}: {
  task: Task;
  onClose: () => void;
  onSave: (updatedTask: Task) => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(
    task.dueDate?.toISOString().split('T')[0] || ''
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...task,
      title,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-10 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="edit-title"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Title
            </label>
            <input
              id="edit-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Task title"
            />
          </div>
          <div>
            <label
              htmlFor="edit-description"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              aria-label="Task description"
            />
          </div>
          <div>
            <label
              htmlFor="edit-due-date"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Due Date
            </label>
            <div className="relative">
              <input
                id="edit-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Task due date"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onDelete,
  onEdit,
}: {
  task: Task;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-white rounded-lg border border-slate-200 cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium">{task.title}</span>
        <div className="flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1 text-slate-400 hover:text-blue-500 transition-colors"
            aria-label="Edit task"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
            aria-label="Delete task"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      {task.description && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      {task.dueDate && (
        <div className="flex items-center gap-1 mb-3">
          <CalendarIcon className="w-4 h-4 text-slate-400" />
          <span
            className={`text-sm ${
              isOverdue(task.dueDate) ? 'text-red-500' : 'text-slate-600'
            }`}
          >
            {formatDate(task.dueDate)}
            {isOverdue(task.dueDate) && ' (Overdue)'}
          </span>
        </div>
      )}
      <div className="flex justify-center">
        <span
          className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}
        >
          {getStatusLabel(task.status)}
        </span>
      </div>
    </div>
  );
}

function Column({
  status,
  tasks,
  onDelete,
  onEdit,
}: {
  status: TaskStatus;
  tasks: Task[];
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div ref={setNodeRef} className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          {getStatusLabel(status)}
        </h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
            status
          )}`}
        >
          {tasks.length}
        </span>
      </div>
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
          {tasks.length === 0 && (
            <div className="p-4 text-center text-slate-400 bg-slate-50 rounded-lg">
              No tasks in this status
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNoProjectsAlert, setShowNoProjectsAlert] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const fetchTasks = async (projectId: number) => {
    try {
      // setIsLoading(true);
      const response = await fetch(`/api/tasks?projectId=${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = (await response.json()) as ApiTask[];
      // Convert string dates to Date objects
      const tasksWithDates = data.map((task) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        createdAt: new Date(task.createdAt),
      }));
      setTasks(tasksWithDates);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
        if (data.length > 0) {
          const firstProjectId = data[0].id;
          setSelectedProjectId(firstProjectId);
          await fetchTasks(firstProjectId);
          setShowNoProjectsAlert(false);
        } else {
          setShowNoProjectsAlert(true);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleProjectChange = async (projectId: number) => {
    setSelectedProjectId(projectId);
    await fetchTasks(projectId);
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !selectedProjectId) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      description: newTaskDescription,
      dueDate: newTaskDueDate ? new Date(newTaskDueDate) : null,
      status: 'todo',
      createdAt: new Date(),
      projectId: selectedProjectId,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskDueDate('');
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleEditSave = (updatedTask: Task) => {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    // If dropped on a column
    if (['todo', 'in-progress', 'done'].includes(over.id as string)) {
      const newStatus = over.id as TaskStatus;

      // Update the task status in the UI immediately
      setTasks(
        tasks.map((task) => {
          if (task.id === active.id) {
            return { ...task, status: newStatus };
          }
          return task;
        })
      );

      // If moved to in-progress, make an API call
      if (newStatus === 'in-progress') {
        try {
          const response = await fetch(`/api/tasks?id=${activeTask.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: newStatus,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to update task status');
          }
        } catch (error) {
          console.error('Error updating task status:', error);
          // Revert the status change in the UI if the API call fails
          setTasks(
            tasks.map((task) => {
              if (task.id === active.id) {
                return { ...task, status: activeTask.status };
              }
              return task;
            })
          );
        }
      }
    } else {
      // If dropped on a task
      const overTask = tasks.find((task) => task.id === over.id);
      if (overTask) {
        if (activeTask.status === overTask.status) {
          // Reorder within the same column
          const oldIndex = tasks.findIndex((task) => task.id === active.id);
          const newIndex = tasks.findIndex((task) => task.id === over.id);
          setTasks(arrayMove(tasks, oldIndex, newIndex));
        } else {
          // Move to a different column
          const newStatus = overTask.status;
          setTasks(
            tasks.map((task) => {
              if (task.id === active.id) {
                return { ...task, status: newStatus };
              }
              return task;
            })
          );

          // If moved to in-progress, make an API call
          if (newStatus === 'in-progress') {
            try {
              const response = await fetch(`/api/tasks?id=${activeTask.id}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  status: newStatus,
                }),
              });

              if (!response.ok) {
                throw new Error('Failed to update task status');
              }
            } catch (error) {
              console.error('Error updating task status:', error);
              // Revert the status change in the UI if the API call fails
              setTasks(
                tasks.map((task) => {
                  if (task.id === active.id) {
                    return { ...task, status: activeTask.status };
                  }
                  return task;
                })
              );
            }
          }
        }
      }
    }

    setActiveId(null);
  };

  const activeTask = activeId
    ? tasks.find((task) => task.id === activeId)
    : null;

  return (
    <div className="p-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          </div>

          {showNoProjectsAlert && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-blue-800">
                    No Projects Found
                  </h3>
                  <p className="mt-1 text-sm text-blue-700">
                    You need to create a project before you can add tasks.
                  </p>
                </div>
                <Link
                  href="/dashboard/projects"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Project
                </Link>
              </div>
            </div>
          )}

          {!showNoProjectsAlert && (
            <form onSubmit={addTask} className="mb-8 space-y-4">
              <div className="flex gap-4">
                <select
                  value={selectedProjectId || ''}
                  onChange={(e) => handleProjectChange(Number(e.target.value))}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  aria-label="Select project"
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title..."
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                >
                  <PlusIcon className="w-5 h-5" />
                  Add Task
                </button>
              </div>
              <div>
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Task description..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                />
              </div>
              <div className="relative">
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Due date"
                />
              </div>
            </form>
          )}

          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['todo', 'in-progress', 'done'] as TaskStatus[]).map(
                (status) => (
                  <Column
                    key={status}
                    status={status}
                    tasks={tasks.filter((task) => task.status === status)}
                    onDelete={deleteTask}
                    onEdit={editTask}
                  />
                )
              )}
            </div>
            <DragOverlay>
              {activeTask ? (
                <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{activeTask.title}</span>
                    <button
                      className="p-1 text-slate-400"
                      aria-label="Delete task"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  {activeTask.description && (
                    <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                      {activeTask.description}
                    </p>
                  )}
                  {activeTask.dueDate && (
                    <div className="flex items-center gap-1 mb-3">
                      <CalendarIcon className="w-4 h-4 text-slate-400" />
                      <span
                        className={`text-sm ${
                          isOverdue(activeTask.dueDate)
                            ? 'text-red-500'
                            : 'text-slate-600'
                        }`}
                      >
                        {formatDate(activeTask.dueDate)}
                        {isOverdue(activeTask.dueDate) && ' (Overdue)'}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-center">
                    <span
                      className={`px-2 py-1 rounded text-xs ${getStatusColor(
                        activeTask.status
                      )}`}
                    >
                      {getStatusLabel(activeTask.status)}
                    </span>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>

          {editingTask && (
            <EditTaskModal
              task={editingTask}
              onClose={() => setEditingTask(null)}
              onSave={handleEditSave}
            />
          )}
        </div>
      )}
    </div>
  );
}
