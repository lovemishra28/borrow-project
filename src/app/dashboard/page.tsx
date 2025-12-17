"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Transaction {
  _id: string;
  componentId: { title: string; category: string; type: "GIVE" | "TAKE" };
  lenderId: { _id: string; name: string; email: string };
  borrowerId: { _id: string; name: string; email: string };
  status: string;
  responseMessage?: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<string | null>(null);
  const [actionType, setActionType] = useState<"ACTIVE" | "REJECTED" | null>(null);
  const [messageInput, setMessageInput] = useState("");

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
        setUserId(data.currentUser._id);
      }
    } catch (error) {
      console.error("Error fetching dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const openActionModal = (txId: string, type: "ACTIVE" | "REJECTED") => {
    setSelectedTx(txId);
    setActionType(type);
    setMessageInput(type === "ACTIVE" ? "" : ""); // Clear input
    setModalOpen(true);
  };

  const submitAction = async () => {
    if (!selectedTx || !actionType) return;

    try {
      const res = await fetch(`/api/transactions/${selectedTx}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            status: actionType,
            responseMessage: messageInput 
        }),
      });

      if (res.ok) {
        alert("Success!");
        setModalOpen(false);
        fetchDashboard();
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      alert("Something went wrong.");
    }
  };

  const handleSimpleUpdate = async (txId: string, status: string) => {
    if (!confirm("Confirm action?")) return;
    try {
        await fetch(`/api/transactions/${txId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        fetchDashboard();
    } catch (e) { console.error(e) }
  };

  // --- FILTERS ---
  const actionRequired = transactions.filter((t) => {
    if (t.status !== "PENDING") return false;
    const isMyGiveItem = t.lenderId._id === userId && t.componentId.type === "GIVE";
    const isMyTakeRequest = t.borrowerId._id === userId && t.componentId.type === "TAKE";
    return isMyGiveItem || isMyTakeRequest;
  });

  const pendingOnOthers = transactions.filter((t) => {
    if (t.status !== "PENDING") return false;
    const iRequestedTheirItem = t.borrowerId._id === userId && t.componentId.type === "GIVE";
    const iOfferedMyItem = t.lenderId._id === userId && t.componentId.type === "TAKE";
    return iRequestedTheirItem || iOfferedMyItem;
  });

  const active = transactions.filter(t => t.status === "ACTIVE");
  const history = transactions.filter(t => ["COMPLETED", "REJECTED"].includes(t.status));

  if (loading) return <div className="flex justify-center items-center h-screen text-muted-foreground bg-background">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-background min-h-screen transition-colors duration-300">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <Link href="/components" className="text-sm font-medium text-accent hover:text-accent/80 transition-colors">
          &larr; Back to Marketplace
        </Link>
      </div>

      {/* 1. URGENT: Action Required */}
      {actionRequired.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <div className="h-3 w-3 rounded-full bg-destructive mr-2 animate-pulse"></div>
            <h2 className="text-xl font-bold text-foreground">Action Required</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {actionRequired.map((t) => (
              <div key={t._id} className="bg-card rounded-xl shadow-md border-l-4 border-destructive p-6 flex flex-col justify-between hover:shadow-lg transition-all">
                <div>
                    <h3 className="font-bold text-lg text-card-foreground mb-1">{t.componentId.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                        {t.componentId.type === "GIVE" 
                            ? <><span className="font-semibold text-accent">{t.borrowerId.name}</span> wants to borrow this.</>
                            : <><span className="font-semibold text-green-600 dark:text-green-400">{t.lenderId.name}</span> has this item for you.</>
                        }
                    </p>
                </div>
                <div className="flex gap-3 mt-4">
                  <button 
                    onClick={() => openActionModal(t._id, "ACTIVE")}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => openActionModal(t._id, "REJECTED")}
                    className="flex-1 bg-secondary text-secondary-foreground py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. WAITING: Pending Requests */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-4">Requests Sent (Pending)</h2>
        {pendingOnOthers.length === 0 ? (
            <p className="text-muted-foreground text-sm">No pending requests.</p>
        ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pendingOnOthers.map(t => (
                    <div key={t._id} className="bg-card p-5 rounded-lg border border-border shadow-sm opacity-75">
                         <h3 className="font-semibold text-card-foreground">{t.componentId.title}</h3>
                         <p className="text-xs text-muted-foreground mt-1">
                             Waiting for {t.componentId.type === "GIVE" ? t.lenderId.name : t.borrowerId.name} to respond.
                         </p>
                    </div>
                ))}
            </div>
        )}
      </div>

      {/* 3. ACTIVE: Current Transactions */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-4">Active Exchanges</h2>
        {active.length === 0 ? (
             <p className="text-muted-foreground text-sm">No active exchanges.</p>
        ) : (
             <div className="grid gap-6 md:grid-cols-2">
                {active.map(t => (
                    <div key={t._id} className="bg-card p-6 rounded-xl shadow border border-green-100 dark:border-green-900 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">ACTIVE</div>
                        <h3 className="font-bold text-lg text-card-foreground">{t.componentId.title}</h3>
                        
                        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
                             <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-1">Exchange Details / Message:</p>
                             <p className="text-sm text-foreground italic">"{t.responseMessage || 'No specific instructions provided.'}"</p>
                             {/* Show Contact info if I am the borrower */}
                             {t.borrowerId._id === userId && (
                                <p className="text-xs text-muted-foreground mt-2">Contact Owner: {t.lenderId.email}</p>
                             )}
                        </div>

                        <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
                            <span>
                                {t.lenderId._id === userId ? `Lent to: ${t.borrowerId.name}` : `Borrowed from: ${t.lenderId.name}`}
                            </span>
                            {t.lenderId._id === userId && (
                                <button 
                                    onClick={() => handleSimpleUpdate(t._id, "COMPLETED")}
                                    className="text-accent font-medium hover:underline"
                                >
                                    Mark as Returned
                                </button>
                            )}
                        </div>
                    </div>
                ))}
             </div>
        )}
      </div>

       {/* 4. HISTORY: Rejected or Completed */}
       <div className="mb-12">
        <h2 className="text-xl font-bold text-foreground mb-4">History (Rejected / Completed)</h2>
        <div className="space-y-4">
            {history.map(t => (
                <div key={t._id} className="bg-card p-4 rounded-lg border border-border flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-bold mr-2 ${t.status === 'REJECTED' ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-secondary-foreground'}`}>
                            {t.status}
                        </span>
                        <span className="font-medium text-card-foreground">{t.componentId.title}</span>
                        {t.status === 'REJECTED' && t.responseMessage && (
                            <p className="text-sm text-destructive mt-1">Reason: "{t.responseMessage}"</p>
                        )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 md:mt-0">
                        {new Date(t.createdAt).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* --- MODAL --- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6 border border-border">
                <h3 className="text-xl font-bold mb-4 text-card-foreground">
                    {actionType === "ACTIVE" ? "Approve Request" : "Decline Request"}
                </h3>
                
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                    {actionType === "ACTIVE" 
                        ? "Contact Details / Pickup Instructions (Required):" 
                        : "Reason for rejection (Optional):"}
                </label>
                
                <textarea
                    className="w-full border border-input bg-background text-foreground rounded-md p-2 h-24 mb-6 focus:ring-2 focus:ring-ring focus:outline-none transition-colors"
                    placeholder={actionType === "ACTIVE" ? "e.g., Meet me at the library at 2pm. Call 999..." : "e.g., Sorry, item is damaged."}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                />

                <div className="flex justify-end space-x-3">
                    <button 
                        onClick={() => setModalOpen(false)}
                        className="px-4 py-2 text-muted-foreground hover:bg-secondary rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={submitAction}
                        className={`px-4 py-2 text-white rounded-md transition-colors ${actionType === 'ACTIVE' ? 'bg-green-600 hover:bg-green-700' : 'bg-destructive hover:bg-destructive/90'}`}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}