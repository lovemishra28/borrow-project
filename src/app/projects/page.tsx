"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink?: string;
  userId: {
    name: string;
    branch: string;
    year: number;
  };
  createdAt: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Error fetching projects", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background text-foreground min-h-screen transition-colors duration-300">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-foreground sm:text-3xl sm:truncate">
            Student Projects
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Explore what your peers are building and see their documentation.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/projects/add"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
          >
            + Upload Project
          </Link>
        </div>
      </div>

      {/* Project Grid */}
      {loading ? (
        <div className="text-center py-10 text-muted-foreground">Loading Showcase...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-lg shadow border border-border">
          <p className="text-muted-foreground">No projects uploaded yet. Be the first!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="flex flex-col bg-card overflow-hidden shadow rounded-lg border border-border hover:shadow-lg transition-all"
            >
              <div className="flex-1 p-6 flex flex-col">
                {/* Top part */}
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-accent">
                    {project.userId?.branch}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                {/* Main Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-card-foreground">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                    {project.description}
                  </p>
                </div>
                
                {/* Tech Stack & Author */}
                <div className="mt-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>
                    <div className="flex items-center pt-4 border-t border-border">
                        <div className="shrink-0">
                        <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
                            {project.userId?.name?.charAt(0) || "?"}
                        </div>
                        </div>
                        <div className="ml-3">
                        <p className="text-sm font-medium text-card-foreground">
                            {project.userId?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Year {project.userId?.year} Student
                        </p>
                        </div>
                    </div>
                </div>
              </div>
              
              {/* Footer Link */}
              {project.githubLink && (
                <div className="bg-secondary/50 px-6 py-3 border-t border-border">
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-accent hover:text-accent/80 transition-colors flex items-center justify-center"
                  >
                    View Code / Docs &rarr;
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}