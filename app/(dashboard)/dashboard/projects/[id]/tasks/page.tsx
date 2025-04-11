'use client';

import { useState, useEffect } from 'react';
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CalendarIcon,
  ChevronRightIcon,
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
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useParams } from 'next/navigation';
import Link from 'next/link';

type TaskStatus = 'todo' | 'in-progress' | 'done';

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: Date | null;
  createdAt: Date;
}

interface Project {
  id: number;
  title: string;
  description: string;
}

function TaskCard({
  task,
  onUpdate,
  onDelete,
}: {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
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
      className="bg-white p-4 rounded-lg shadow mb-2 cursor-move"
    >
      <div className="flex justify-between items-start">
        <h3 className="font-medium">{task.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onUpdate(task)}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Edit task"
            title="Edit task"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-500 hover:text-red-500"
            aria-label="Delete task"
            title="Delete task"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
      {task.dueDate && (
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <CalendarIcon className="h-4 w-4 mr-1" />
          {new Date(task.dueDate).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

export default function TasksPage() {
  const params = useParams();
  console.log('params', params);
  const projectId = params.id as string;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!projectId) return;

      try {
        const response = await fetch(`/api/projects/${projectId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        console.error('Error fetching project:', err);
      }
    }

    fetchProject();
  }, [projectId]);

  useEffect(() => {
    async function fetchTasks() {
      console.log('fetching tasks');
      console.log('projectId', projectId);
      if (!projectId) return;

      console.log('projectId', projectId);
      try {
        const response = await fetch(`/api/tasks?projectId=${projectId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTasks();
  }, [projectId]);

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
    setActiveId(null);
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !projectId) return;

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: parseInt(projectId),
          title: newTaskTitle,
          description: newTaskDescription,
          status: 'todo',
          dueDate: newTaskDueDate || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskDueDate('');
    } catch (error) {
      console.error('Error creating task:', error);
      // TODO: Show error message to user
    }
  };

  const handleUpdateTask = (task: Task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description || '');
    setNewTaskDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    );
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleTaskUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      const response = await fetch(`/api/tasks?id=${editingTask.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
          dueDate: newTaskDueDate || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks(
        tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      setEditingTask(null);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskDueDate('');
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link href="/dashboard/projects">Projects</Link>
            <ChevronRightIcon className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium">
              {project?.title || 'Loading...'}
            </span>
          </div>
        </div>
        <h2 className="text-2xl font-bold mb-4">Tasks</h2>
        <form
          onSubmit={editingTask ? handleTaskUpdate : addTask}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="task-title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Title
            </label>
            <input
              id="task-title"
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label
              htmlFor="task-description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Task Description
            </label>
            <textarea
              id="task-description"
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              placeholder="Enter task description"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label
              htmlFor="task-due-date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Due Date
            </label>
            <input
              id="task-due-date"
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {editingTask ? 'Update Task' : 'Add Task'}
          </button>
          {editingTask && (
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setNewTaskTitle('');
                setNewTaskDescription('');
                setNewTaskDueDate('');
              }}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No tasks yet. Add your first task above!
              </div>
            ) : (
              tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                />
              ))
            )}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <TaskCard
              task={tasks.find((task) => task.id === activeId)!}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
