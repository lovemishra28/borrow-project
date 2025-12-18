"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    techStack: "", // We'll handle this as a comma-separated string first
    githubLink: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Convert comma-separated string to array
      const techStackArray = formData.techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech !== "");

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          techStack: techStackArray,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create project");
      }

      router.push("/projects");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 bg-background min-h-screen text-foreground transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6">Upload Project Documentation</h1>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 border border-destructive/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-sm border border-border">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground">Project Title</label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g., Smart Irrigation System"
            className="mt-1 block w-full rounded-md border-input bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring sm:text-sm p-2 border transition-colors"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground">Description / Documentation</label>
          <textarea
            name="description"
            rows={6}
            required
            placeholder="Describe your project, the problem it solves, and how it works..."
            className="mt-1 block w-full rounded-md border-input bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring sm:text-sm p-2 border transition-colors"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        {/* Tech Stack */}
        <div>
          <label className="block text-sm font-medium text-foreground">Tech Stack (Comma separated)</label>
          <input
            type="text"
            name="techStack"
            required
            placeholder="e.g., Arduino, React, Node.js, 3D Printing"
            className="mt-1 block w-full rounded-md border-input bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring sm:text-sm p-2 border transition-colors"
            value={formData.techStack}
            onChange={handleChange}
          />
        </div>

        {/* GitHub Link */}
        <div>
          <label className="block text-sm font-medium text-foreground">GitHub / Documentation Link (Optional)</label>
          <input
            type="url"
            name="githubLink"
            placeholder="https://github.com/username/repo"
            className="mt-1 block w-full rounded-md border-input bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring sm:text-sm p-2 border transition-colors"
            value={formData.githubLink}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 transition-colors"
        >
          {loading ? "Uploading..." : "Publish Project"}
        </button>
      </form>
    </div>
  );
}