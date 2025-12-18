"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ComponentItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: "GIVE" | "TAKE";
  status: "AVAILABLE" | "SOLD";
  userId: {
    _id: string; // Added _id here to check ownership
    name: string;
    branch: string;
    year: number;
    reputationScore: number;
  };
  createdAt: string;
}

export default function MarketplacePage() {
  const router = useRouter();
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"GIVE" | "TAKE">("GIVE");
  const [searchQuery, setSearchQuery] = useState("");
  const [requestingId, setRequestingId] = useState<string | null>(null);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const res = await fetch("/api/components");
      if (res.ok) {
        const data = await res.json();
        setComponents(data);
      }
    } catch (error) {
      console.error("Failed to fetch components", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (componentId: string) => {
    if (!confirm("Are you sure you want to initiate this request?")) return;

    setRequestingId(componentId);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ componentId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
      } else {
        alert("Request sent successfully! Check your dashboard.");
        // Optional: Refresh list or redirect
        router.refresh(); 
      }
    } catch (error) {
      alert("Failed to send request");
    } finally {
      setRequestingId(null);
    }
  };

  // Filter the list based on the selected tab and search query
  const filteredComponents = components.filter((c) => {
    const matchesType = c.type === filterType;
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background min-h-screen transition-colors duration-300">
      {/* Header Section */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-foreground sm:text-3xl sm:truncate">
            Component Marketplace
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Borrow parts from peers or ask for what you need.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/components/add"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring transition-colors"
          >
            + List Item / Request
          </Link>
        </div>
      </div>

      {/* --- SEARCH BAR --- */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {/* Magnifying Glass Icon */}
          <svg className="h-5 w-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-3 border border-input rounded-md leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-input sm:text-sm shadow-sm"
          placeholder="Search components (e.g., 'Arduino', 'Motor', 'Sensor')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-border mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setFilterType("GIVE")}
            className={`${
              filterType === "GIVE"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Available (GIVE)
          </button>
          <button
            onClick={() => setFilterType("TAKE")}
            className={`${
              filterType === "TAKE"
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Requests (TAKE)
          </button>
        </nav>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="text-center py-10 text-muted-foreground">Loading...</div>
      ) : filteredComponents.length === 0 ? (
        <div className="text-center py-10 bg-card rounded-lg shadow border border-border">
          <p className="text-muted-foreground">
             {searchQuery ? `No matches found for "${searchQuery}"` : "No items found in this category."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredComponents.map((item) => (
            <div
              key={item._id}
              className="bg-card overflow-hidden shadow rounded-lg border border-border hover:shadow-md transition-all"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === "AVAILABLE"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs text-muted-foreground">{item.category}</span>
                </div>
                <h3 className="text-lg leading-6 font-medium text-card-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center pt-4 border-t border-border">
                  <div className="shrink-0">
                    <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xs">
                      {item.userId?.name?.charAt(0) || "U"}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-card-foreground">
                      {item.userId?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.userId?.branch} • Score: {item.userId?.reputationScore}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-secondary/50 px-4 py-4 sm:px-6 border-t border-border">
                <button 
                  onClick={() => handleRequest(item._id)}
                  disabled={requestingId === item._id || item.status !== 'AVAILABLE'}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-input shadow-sm text-sm font-medium rounded-md text-foreground bg-background hover:bg-accent/10 focus:outline-none disabled:opacity-50 transition-colors"
                >
                  {requestingId === item._id ? "Processing..." : 
                   filterType === "GIVE" ? "Request to Borrow" : "I Have This"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}