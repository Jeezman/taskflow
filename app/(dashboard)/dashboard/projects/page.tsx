'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

const projectSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface Project {
  id: number;
  title: string;
  description: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      setSubmitError(null);
      // TODO: Implement project creation logic with database
      const newProject: Project = {
        id: Date.now(), // Temporary ID until database integration
        title: data.title,
        description: data.description,
      };
      setProjects([...projects, newProject]);
      reset();
    } catch (error) {
      setSubmitError('Failed to create project. Please try again.');
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
        </div>

        {submitError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{submitError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mb-8 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Project title..."
                className={`w-full px-4 py-2 border ${
                  errors.title ? 'border-red-300' : 'border-slate-200'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register('title')}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {errors.title.message}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PlusIcon className="w-5 h-5" />
              Add Project
            </button>
          </div>
          <div>
            <textarea
              placeholder="Project description..."
              className={`w-full px-4 py-2 border ${
                errors.description ? 'border-red-300' : 'border-slate-200'
              } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]`}
              {...register('description')}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.description.message}
              </p>
            )}
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {project.title}
              </h3>
              <p className="text-slate-600 mb-4">{project.description}</p>
              <div className="flex justify-end">
                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="text-blue-600 hover:text-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
