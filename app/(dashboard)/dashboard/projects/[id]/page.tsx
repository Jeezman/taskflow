'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface Project {
  id: number;
  title: string;
  description: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectId = parseInt(params.id);

        if (isNaN(projectId)) {
          setError('Invalid project ID');
          return;
        }

        const response = await fetch(`/api/projects/${projectId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Project not found');
          } else if (response.status === 401) {
            setError('Unauthorized');
          } else {
            setError('Failed to load project details');
          }
          return;
        }

        const projectData = await response.json();
        setProject(projectData);
      } catch (err) {
        setError('Failed to load project details');
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error || 'Project not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Projects
          </button>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {project.title}
          </h1>
          <p className="text-slate-600">{project.description}</p>
          <div className="mt-4 text-sm text-slate-500">
            <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
            <p>
              Last updated: {new Date(project.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
