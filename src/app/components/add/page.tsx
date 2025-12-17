"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddComponentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Microcontroller", // Default
    condition: "USED",           // Default
    type: "GIVE",                // Default
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/components", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to create listing");
      }

      router.push("/components");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 bg-background min-h-screen transition-colors duration-300">
      <h1 className="text-foreground text-2xl font-bold mb-6">List a Component</h1>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 border border-destructive/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg shadow-sm border border-border">
        
        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            What are you doing?
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="type"
                value="GIVE"
                checked={formData.type === "GIVE"}
                onChange={handleChange}
                className="text-primary h-4 w-4 focus:ring-ring border-input bg-background"
              />
              <span className="ml-2 text-foreground">I have something to lend (GIVE)</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="type"
                value="TAKE"
                checked={formData.type === "TAKE"}
                onChange={handleChange}
                className="text-primary h-4 w-4 focus:ring-ring border-input bg-background"
              />
              <span className="ml-2 text-foreground">I need something (TAKE)</span>
            </label>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-foreground">Component Name</label>
          <input
            type="text"
            name="title"
            required
            placeholder="e.g., ESP32 Dev Module"
            className="mt-1 block w-full rounded-md border-input bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring sm:text-sm p-2 border transition-colors"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-foreground">Category</label>
          <select
            name="category"
            className="mt-1 block w-full rounded-md border-input bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring sm:text-sm p-2 border transition-colors"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="Microcontroller">Microcontroller</option>
            <option value="Sensor">Sensor</option>
            <option value="Motor">Motor</option>
            <option value="Display">Display</option>
            <option value="Tool">Tool</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-foreground">Condition</label>
          <select
            name="condition"
            className="mt-1 block w-full rounded-md border-input bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring sm:text-sm p-2 border transition-colors"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="NEW">New / Unused</option>
            <option value="USED">Used (Good Condition)</option>
            <option value="DAMAGED">Slightly Damaged (Functional)</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground">Description</label>
          <textarea
            name="description"
            rows={4}
            required
            placeholder="Describe the item or why you need it..."
            className="mt-1 block w-full rounded-md border-input bg-background text-foreground shadow-sm focus:border-ring focus:ring-ring sm:text-sm p-2 border transition-colors"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:opacity-50 transition-colors"
        >
          {loading ? "Posting..." : "Post Listing"}
        </button>
      </form>
    </div>
  );
}