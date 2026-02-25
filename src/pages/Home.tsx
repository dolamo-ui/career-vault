import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut, Briefcase, BarChart3, X, Link, CalendarDays } from "lucide-react";
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "../firebase";

import {
  JobStatus,
  toCalendarApp,
  type JobApplication,
  type CalendarApplication,
} from "../types";

import DashboardHeader from "../components/DashboardHeader";
import DashboardStats  from "../components/DashboardStats";
import Progressbar     from "../components/Progressbar";
import FilterBar       from "../components/SearchAndFilters";
import JobGrid         from "../components/JobGrid";
import DashboardFooter from "../components/DashboardFooter";
import CalendarView    from "../components/Calendarview";

import {
  NotificationProvider,
  useJobNotifications,
} from "../context/NotificationContext";
import NotificationBell, { ToastStack } from "../components/NotificationBell";

interface FilterState { search: string; status: string; sort: "asc" | "desc"; }
type ActiveView = "grid" | "calendar";
interface StatsShape { applied: number; interviews: number; offers: number; rejected: number; }

// ─────────────────────────────────────────────────────────────────────────────
// JobModal
// ─────────────────────────────────────────────────────────────────────────────
interface JobModalProps {
  isOpen:   boolean;
  onClose:  () => void;
  onSubmit: (job: Partial<JobApplication>) => void;
  editJob:  JobApplication | null;
}

const JobModal: React.FC<JobModalProps> = ({ isOpen, onClose, onSubmit, editJob }) => {
  const emptyForm: Partial<JobApplication> = {
    title: "", company: "", location: "", salary: "",
    status: JobStatus.APPLIED,
    dateApplied:   new Date().toISOString().split("T")[0],
    interviewDate: "", jobUrl: "", description: "", notes: "",
  };

  const [formData, setFormData] = useState<Partial<JobApplication>>(emptyForm);
  useEffect(() => { setFormData(editJob ?? emptyForm); }, [editJob, isOpen]);

  const handleSubmit = (): void => {
    if (!formData.title || !formData.company) { alert("Please fill in required fields"); return; }
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  const inputClass =
    "w-full px-4 py-2.5 border border-black/[0.08] rounded-xl bg-black/[0.02] text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]/40 outline-none transition-all";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#FDFCFB] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#FDFCFB] border-b border-black/[0.06] px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">
            {editJob ? "Edit Application" : "Add New Application"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-black/[0.04] rounded-lg transition-colors">
            <X className="w-5 h-5 text-[#1A1A1A]/60" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Job Title *</label>
              <input type="text" value={formData.title ?? ""} placeholder="e.g., Software Engineer"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Company *</label>
              <input type="text" value={formData.company ?? ""} placeholder="e.g., Tech Corp"
                onChange={(e) => setFormData({ ...formData, company: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Location</label>
              <input type="text" value={formData.location ?? ""} placeholder="e.g., San Francisco, CA"
                onChange={(e) => setFormData({ ...formData, location: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Salary Range</label>
              <input type="text" value={formData.salary ?? ""} placeholder="e.g., $80k – $120k"
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Status *</label>
              <select value={formData.status ?? JobStatus.APPLIED}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof JobStatus[keyof typeof JobStatus] })}
                className={inputClass}>
                {Object.values(JobStatus).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Date Applied *</label>
              <input type="date" value={formData.dateApplied ?? ""}
                onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">
                Interview Date
                <span className="ml-1 text-xs font-normal text-[#1A1A1A]/30">(shows on calendar · triggers reminder)</span>
              </label>
              <input type="date" value={formData.interviewDate ?? ""}
                onChange={(e) => setFormData({ ...formData, interviewDate: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Job URL</label>
            <div className="relative">
              <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C5A059]" />
              <input type="url" value={formData.jobUrl ?? ""} placeholder="https://company.com/careers/job-listing"
                onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 border border-black/[0.08] rounded-xl bg-black/[0.02] text-[#1A1A1A] placeholder:text-[#1A1A1A]/30 focus:ring-2 focus:ring-[#C5A059]/40 focus:border-[#C5A059]/40 outline-none transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#1A1A1A] mb-2">Notes</label>
            <textarea value={formData.notes ?? ""} rows={4}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes about this application…"
              className={`${inputClass} resize-none`} />
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={onClose}
              className="flex-1 px-6 py-3 border border-black/[0.08] text-[#1A1A1A]/60 rounded-xl font-semibold hover:bg-black/[0.03] transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-[#1A1A1A] text-white rounded-xl font-semibold hover:bg-[#333] transition-colors shadow-lg shadow-black/10">
              {editJob ? "Save Changes" : "Add Application"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// HomeInner
// ─────────────────────────────────────────────────────────────────────────────
const HomeInner: React.FC = () => {
  const navigate = useNavigate();

  const [jobs, setJobs]               = useState<JobApplication[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob]   = useState<JobApplication | null>(null);
  const [userId, setUserId]           = useState<string | null>(null);
  const [authReady, setAuthReady]     = useState(false); // ✅ prevents flicker
  const [isLoading, setIsLoading]     = useState(true);
  const [activeView, setActiveView]   = useState<ActiveView>("grid");
  const [filters, setFilters]         = useState<FilterState>({ search: "", status: "", sort: "asc" });

  // ── ✅ Auth: use Firebase onAuthStateChanged instead of localStorage ─────────
  // This correctly restores the session on page refresh, handles token expiry,
  // and ensures each user only ever sees their own userId.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ✅ User is logged in — store their uid and sync to localStorage
        setUserId(user.uid);
        localStorage.setItem("userId", user.uid);
        localStorage.setItem("userEmail", user.email ?? "");
      } else {
        // ✅ No user — clear everything and redirect to login
        setUserId(null);
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        navigate("/login");
      }
      setAuthReady(true); // auth check complete, safe to render
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, [navigate]);

  // ── ✅ Firestore: only runs once userId is confirmed by Firebase Auth ────────
  useEffect(() => {
    if (!userId) return;
    setIsLoading(true);

    // Query ONLY this user's applications — userId field must match
    const q = query(
      collection(db, "applications"),
      where("userId", "==", userId)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data: JobApplication[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<JobApplication, "id">),
      }));
      setJobs(data);
      setIsLoading(false);
    }, (err) => {
      console.error("Firestore error:", err);
      setIsLoading(false);
    });

    return () => unsub();
  }, [userId]);

  // ── Interview reminders ─────────────────────────────────────────────────────
  useJobNotifications(jobs);

  // ── Derived state ───────────────────────────────────────────────────────────
  const filteredJobs = useMemo<JobApplication[]>(() => {
    let r = [...jobs];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      r = r.filter((j) => j.title?.toLowerCase().includes(q) || j.company?.toLowerCase().includes(q));
    }
    if (filters.status) r = r.filter((j) => j.status === filters.status);
    r.sort((a, b) =>
      filters.sort === "asc"
        ? (a.company ?? "").localeCompare(b.company ?? "")
        : (b.company ?? "").localeCompare(a.company ?? ""),
    );
    return r;
  }, [jobs, filters]);

  const calendarApps = useMemo<CalendarApplication[]>(() => jobs.map(toCalendarApp), [jobs]);

  const stats = useMemo<StatsShape>(() => ({
    applied:    jobs.filter((j) => j.status === "Applied").length,
    interviews: jobs.filter((j) => j.status === "Interview").length,
    offers:     jobs.filter((j) => j.status === "Offer" || j.status === "Hired").length,
    rejected:   jobs.filter((j) => j.status === "Rejected").length,
  }), [jobs]);

  // ── CSV export ──────────────────────────────────────────────────────────────
  const handleExport = (): void => {
    if (!jobs.length) { alert("No applications to export yet."); return; }
    const headers = ["Title","Company","Location","Salary","Status","Date Applied","Interview Date","Job URL","Notes"];
    const rows = jobs.map((j) => [
      j.title ?? "", j.company ?? "", j.location ?? "", j.salary ?? "",
      j.status ?? "", j.dateApplied ?? "", j.interviewDate ?? "", j.jobUrl ?? "",
      `"${(j.notes ?? "").replace(/"/g, '""')}"`,
    ]);
    const csv  = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `careervault-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link); link.click();
    document.body.removeChild(link); URL.revokeObjectURL(url);
  };

  // ── CRUD ────────────────────────────────────────────────────────────────────
  const handleAddOrEdit = async (jobData: Partial<JobApplication>): Promise<void> => {
    if (!userId) return; // safety guard
    const payload = { ...jobData, userId }; // ✅ always stamp userId on every record
    try {
      if (editingJob) {
        await updateDoc(doc(db, "applications", editingJob.id), payload);
      } else {
        await addDoc(collection(db, "applications"), {
          ...payload,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) { console.error("Error saving:", err); }
    setEditingJob(null);
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("Delete this application?")) return;
    try { await deleteDoc(doc(db, "applications", id)); }
    catch (err) { console.error("Error deleting:", err); }
  };

  // ── ✅ Logout: use Firebase signOut instead of just clearing localStorage ───
  const handleLogout = async (): Promise<void> => {
    try {
      await signOut(auth); // properly ends the Firebase session
      localStorage.removeItem("userId");
      localStorage.removeItem("userEmail");
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // ── ✅ Show loading spinner while Firebase checks auth state ─────────────────
  // Without this, the page flickers or redirects to /login before auth resolves
  if (!authReady) {
    return (
      <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-[#C5A059] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#1A1A1A]/40 font-medium">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-40 bg-[#FDFCFB]/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-[#E2D1B3] rounded-xl flex items-center justify-center shadow-sm">
                <Briefcase className="text-[#1A1A1A] w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-[#1A1A1A] tracking-tight">CareerVault</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-1 bg-black/[0.04] rounded-xl p-1">
                <button onClick={() => setActiveView("grid")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeView === "grid" ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
                  }`}>
                  <BarChart3 className="w-3.5 h-3.5" /> Grid
                </button>
                <button onClick={() => setActiveView("calendar")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeView === "calendar" ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#1A1A1A]/50 hover:text-[#1A1A1A]"
                  }`}>
                  <CalendarDays className="w-3.5 h-3.5" /> Calendar
                </button>
              </div>

              <NotificationBell />
              <div className="h-8 w-px bg-black/[0.06]" />

              <button onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-[#1A1A1A]/50 hover:text-[#FF6B6B] transition-colors group">
                <span className="hidden sm:inline">Logout</span>
                <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Main ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
        <header className="mb-8">
          <DashboardHeader
            onAddApplication={() => { setEditingJob(null); setIsModalOpen(true); }}
            onExport={handleExport}
          />
          <DashboardStats stats={stats} />
        </header>
        <section className="mb-8"><Progressbar applications={jobs} /></section>

        {activeView === "grid" && (
          <>
            <section className="mb-6">
              <FilterBar
                search={filters.search} status={filters.status} sort={filters.sort}
                onFilterChange={(e) => {
                  const { name, value } = e.target;
                  setFilters((prev) => ({ ...prev, [name]: value }));
                }}
              />
            </section>
            <section>
              <JobGrid
                jobs={filteredJobs} isLoading={isLoading}
                hasFilters={!!filters.search || !!filters.status}
                onEdit={(job) => { setEditingJob(job); setIsModalOpen(true); }}
                onDelete={handleDelete}
                onClearFilters={() => setFilters({ search: "", status: "", sort: "asc" })}
              />
            </section>
          </>
        )}

        {activeView === "calendar" && (
          <section><CalendarView applications={calendarApps} /></section>
        )}
      </main>

      <button
        onClick={() => { setEditingJob(null); setIsModalOpen(true); }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#1A1A1A] text-white rounded-full shadow-2xl shadow-black/20 flex items-center justify-center hover:bg-[#333] hover:scale-110 active:scale-90 transition-all z-30 sm:hidden"
        aria-label="Add application">
        <Plus className="w-8 h-8" />
      </button>

      <JobModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingJob(null); }}
        onSubmit={handleAddOrEdit}
        editJob={editingJob}
      />

      <DashboardFooter />
      <ToastStack />
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Home
// ─────────────────────────────────────────────────────────────────────────────
const Home: React.FC = () => (
  <NotificationProvider>
    <HomeInner />
  </NotificationProvider>
);

export default Home;