"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ProfileData {
  user: {
    name: string;
    email: string;
    branch: string;
    year: number;
    reputationScore: number;
    createdAt: string;
  };
  projects: any[];
  inventory: any[];
}

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const profileData = await res.json();
          setData(profileData);
        }
      } catch (error) {
        console.error("Error fetching profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div className="text-center py-20 text-muted-foreground">Loading Profile...</div>;
  if (!data) return <div className="text-center py-20 text-destructive">Failed to load profile. Please log in.</div>;

  const { user, projects, inventory } = data;

  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-card shadow-md rounded-lg overflow-hidden mb-8 border border-border">
          <div className="bg-primary h-32"></div>
          <div className="px-6 pb-6">
            <div className="relative flex items-end -mt-12 mb-4">
              <div className="h-24 w-24 rounded-full p-1 border-4 border-background shadow-lg flex items-center justify-center text-4xl font-bold text-primary bg-[#FAF3E1]">
                {user.name.charAt(0)}
              </div>
              <div className="ml-4 mb-1">
                <h1 className="text-2xl font-bold text-card-foreground">{user.name}</h1>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="ml-auto flex gap-3">
                   <Link href="/components/add" className="bg-secondary text-secondary-foreground border border-border px-4 py-2 rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
                    + List Item
                  </Link>
                  <Link href="/projects/add" className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                    + Add Project
                  </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 border-t border-border pt-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Branch & Year</p>
                <p className="text-lg font-semibold text-card-foreground">{user.branch} - Year {user.year}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reputation Score</p>
                <div className="flex items-center">
                  <span className={`text-2xl font-bold mr-2 ${user.reputationScore >= 50 ? 'text-green-600' : 'text-yellow-600'}`}>
                      {user.reputationScore}
                  </span>
                  <span className="text-xs text-muted-foreground">points</span>
                </div>
              </div>
              <div>
                 <p className="text-sm font-medium text-muted-foreground">Projects Built</p>
                 <p className="text-lg font-semibold text-card-foreground">{projects.length}</p>
              </div>
              <div>
                 <p className="text-sm font-medium text-muted-foreground">Community Rank</p>
                 <p className="text-lg font-semibold text-card-foreground">
                   {user.reputationScore > 100 ? "Expert" : user.reputationScore > 50 ? "Contributor" : "Member"}
                 </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Inventory */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-card shadow-md rounded-lg p-6 border border-border">
              <h2 className="text-lg font-bold text-card-foreground mb-4">My Inventory / Requests</h2>
              {inventory.length === 0 ? (
                  <p className="text-muted-foreground text-sm">You haven't listed any items or requests.</p>
              ) : (
                  <ul className="space-y-4">
                  {inventory.map((item: any) => (
                      <li key={item._id} className="flex justify-between items-center border-b border-border pb-2 last:border-0 last:pb-0">
                      <div>
                          <p className="text-sm font-medium text-card-foreground truncate w-40">{item.title}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${item.type === 'GIVE' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'}`}>
                              {item.type}
                          </span>
                          <span className={`ml-2 text-xs text-muted-foreground`}>{item.status}</span>
                      </div>
                      </li>
                  ))}
                  </ul>
              )}
               <div className="mt-4 pt-4 border-t border-border">
                  <Link href="/dashboard" className="text-sm text-accent hover:text-accent/80 font-medium transition-colors">
                      Go to Transaction Dashboard &rarr;
                  </Link>
               </div>
            </div>
          </div>

          {/* Right Column: Projects */}
          <div className="lg:col-span-2">
             <h2 className="text-xl font-bold text-foreground mb-4">My Projects</h2>
             {projects.length === 0 ? (
                 <div className="bg-card rounded-lg p-10 text-center border-2 border-dashed border-border">
                     <p className="text-muted-foreground mb-4">You haven't uploaded any projects yet.</p>
                     <Link href="/projects/add" className="text-accent font-medium hover:underline">
                         Start Building Your Portfolio
                     </Link>
                 </div>
             ) : (
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     {projects.map((project: any) => (
                         <div key={project._id} className="bg-card border border-border rounded-lg p-5 shadow-sm hover:shadow-md transition-all">
                             <h3 className="font-bold text-card-foreground text-lg mb-2">{project.title}</h3>
                             <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{project.description}</p>
                             <div className="flex flex-wrap gap-2 mb-4">
                                 {project.techStack.slice(0, 3).map((tech: string) => (
                                     <span key={tech} className="bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                                         {tech}
                                     </span>
                                 ))}
                             </div>
                             {project.githubLink && (
                                 <a href={project.githubLink} target="_blank" className="text-sm text-accent hover:text-accent/80 font-medium transition-colors">
                                     View Code
                                 </a>
                             )}
                         </div>
                     ))}
                 </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}