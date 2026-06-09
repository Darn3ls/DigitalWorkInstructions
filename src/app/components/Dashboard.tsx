import { useState } from "react";
import { Search, Bell, ChevronDown, Plus, Edit2, Copy, Trash2, Eye, Filter, X } from "lucide-react";
import { mockWorkInstructions, currentUser, categories, type WorkInstruction, type WIStatus } from "./mock-data";
import { StatusBadge } from "./StatusBadge";

interface DashboardProps {
  onOpen: (wi: WorkInstruction) => void;
  onEdit: (wi: WorkInstruction) => void;
  onCreate: () => void;
}

export function Dashboard({ onOpen, onEdit, onCreate }: DashboardProps) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<WIStatus | "all">("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [profileOpen, setProfileOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [instructions, setInstructions] = useState(mockWorkInstructions);

  const filtered = instructions.filter((wi) => {
    const matchSearch =
      wi.title.toLowerCase().includes(search.toLowerCase()) ||
      wi.category.toLowerCase().includes(search.toLowerCase()) ||
      wi.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === "all" || wi.status === filterStatus;
    const matchCat = filterCategory === "all" || wi.category === filterCategory;
    return matchSearch && matchStatus && matchCat;
  });

  const handleDelete = (id: string) => {
    setInstructions((prev) => prev.filter((wi) => wi.id !== id));
  };

  const handleDuplicate = (wi: WorkInstruction) => {
    const dup: WorkInstruction = {
      ...wi,
      id: `wi-${Date.now()}`,
      title: `${wi.title} (Copy)`,
      status: "draft",
      createdAt: new Date().toISOString().slice(0, 10),
      lastModified: new Date().toISOString().slice(0, 10),
      completionPercentage: 0,
    };
    setInstructions((prev) => [dup, ...prev]);
  };

  const stats = {
    total: instructions.length,
    published: instructions.filter((w) => w.status === "published").length,
    draft: instructions.filter((w) => w.status === "draft").length,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--primary)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" fill="white" />
                <rect x="14" y="3" width="7" height="7" rx="1" fill="white" fillOpacity="0.6" />
                <rect x="3" y="14" width="7" height="7" rx="1" fill="white" fillOpacity="0.6" />
                <rect x="14" y="14" width="7" height="7" rx="1" fill="white" />
              </svg>
            </div>
            <span
              className="text-foreground hidden sm:block"
              style={{ fontSize: "1rem", fontWeight: 700, letterSpacing: "-0.02em", fontFamily: "'Inter', sans-serif" }}
            >
              WorkInstr
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-lg mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search instructions, categories, tags…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-input-background border border-border rounded-lg text-foreground placeholder-muted-foreground outline-none transition-all"
              style={{ fontSize: "0.875rem" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Notifications */}
            <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Bell size={18} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "var(--destructive)" }}
              />
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white shrink-0"
                  style={{ background: "var(--primary)", fontSize: "0.75rem", fontWeight: 700 }}
                >
                  {currentUser.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <span className="text-foreground hidden sm:block" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                  {currentUser.name.split(" ")[0]}
                </span>
                <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-xl shadow-lg py-1 z-30">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-foreground" style={{ fontSize: "0.875rem", fontWeight: 600 }}>{currentUser.name}</p>
                    <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>{currentUser.email}</p>
                    <span
                      className="inline-block mt-1 px-2 py-0.5 rounded-full capitalize"
                      style={{ fontSize: "0.6875rem", background: "var(--accent)", color: "var(--accent-foreground)", fontWeight: 500 }}
                    >
                      {currentUser.role}
                    </span>
                  </div>
                  {["Profile Settings", "Notifications", "Help & Support"].map((item) => (
                    <button
                      key={item}
                      className="w-full text-left px-4 py-2 text-foreground hover:bg-muted transition-colors"
                      style={{ fontSize: "0.875rem" }}
                    >
                      {item}
                    </button>
                  ))}
                  <div className="border-t border-border mt-1 pt-1">
                    <button className="w-full text-left px-4 py-2 hover:bg-muted transition-colors" style={{ fontSize: "0.875rem", color: "var(--destructive)" }}>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
              Work Instructions
            </h1>
            <p className="text-muted-foreground mt-0.5" style={{ fontSize: "0.9375rem" }}>
              {currentUser.department} · {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3">
            {[
              { label: "Total", value: stats.total, color: "var(--foreground)" },
              { label: "Published", value: stats.published, color: "#15803d" },
              { label: "Drafts", value: stats.draft, color: "#a16207" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center px-4 py-2 bg-card border border-border rounded-lg"
              >
                <span style={{ fontSize: "1.25rem", fontWeight: 700, color: s.color, fontFamily: "'DM Mono', monospace" }}>
                  {s.value}
                </span>
                <span className="text-muted-foreground" style={{ fontSize: "0.6875rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted transition-colors text-foreground"
            style={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            <Filter size={14} />
            Filters
            {(filterStatus !== "all" || filterCategory !== "all") && (
              <span
                className="w-4 h-4 rounded-full text-white flex items-center justify-center"
                style={{ background: "var(--primary)", fontSize: "0.625rem", fontWeight: 700 }}
              >
                {(filterStatus !== "all" ? 1 : 0) + (filterCategory !== "all" ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Status pills */}
          {(["all", "published", "draft", "archived"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className="px-4 py-2 rounded-lg border transition-colors capitalize"
              style={{
                fontSize: "0.8125rem",
                fontWeight: 500,
                background: filterStatus === s ? "var(--primary)" : "var(--card)",
                color: filterStatus === s ? "white" : "var(--foreground)",
                borderColor: filterStatus === s ? "var(--primary)" : "var(--border)",
              }}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}

          {filterCategory !== "all" && (
            <button
              onClick={() => setFilterCategory("all")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground transition-colors"
              style={{ fontSize: "0.8125rem" }}
            >
              {filterCategory} <X size={12} />
            </button>
          )}
        </div>

        {/* Category filter expanded */}
        {filterOpen && (
          <div className="flex flex-wrap gap-2 mb-6 p-4 bg-card border border-border rounded-xl">
            <span className="text-muted-foreground self-center mr-2" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
              Category:
            </span>
            {["all", ...categories].map((cat) => (
              <button
                key={cat}
                onClick={() => { setFilterCategory(cat); setFilterOpen(false); }}
                className="px-3 py-1.5 rounded-lg border transition-colors"
                style={{
                  fontSize: "0.8125rem",
                  background: filterCategory === cat ? "var(--accent)" : "var(--secondary)",
                  color: filterCategory === cat ? "var(--accent-foreground)" : "var(--muted-foreground)",
                  borderColor: filterCategory === cat ? "var(--accent-foreground)" : "transparent",
                  fontWeight: filterCategory === cat ? 600 : 400,
                }}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            ))}
          </div>
        )}

        {/* Results count */}
        <p className="text-muted-foreground mb-4" style={{ fontSize: "0.8125rem" }}>
          Showing {filtered.length} of {instructions.length} instructions
        </p>

        {/* Cards grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mb-4 opacity-30">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p style={{ fontSize: "1rem", fontWeight: 500 }}>No instructions found</p>
            <p style={{ fontSize: "0.875rem" }}>Try adjusting your filters or search query</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((wi) => (
              <WICard
                key={wi.id}
                wi={wi}
                onOpen={() => onOpen(wi)}
                onEdit={() => onEdit(wi)}
                onDuplicate={() => handleDuplicate(wi)}
                onDelete={() => handleDelete(wi.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={onCreate}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 flex items-center gap-2 px-5 py-3.5 rounded-xl text-white shadow-lg hover:shadow-xl transition-all active:scale-95 z-10"
        style={{ background: "var(--primary)", fontSize: "0.9375rem", fontWeight: 600 }}
      >
        <Plus size={18} />
        <span className="hidden sm:inline">Create Work Instruction</span>
        <span className="sm:hidden">Create</span>
      </button>

      {profileOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setProfileOpen(false)} />
      )}
    </div>
  );
}

interface WICardProps {
  wi: WorkInstruction;
  onOpen: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function WICard({ wi, onOpen, onEdit, onDuplicate, onDelete }: WICardProps) {
  const completedSteps = wi.steps.filter((s) => s.completed).length;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-all group">
      {/* Card top color band */}
      <div
        className="h-1"
        style={{
          background:
            wi.status === "published"
              ? "var(--success, #16a34a)"
              : wi.status === "draft"
              ? "var(--warning, #f59e0b)"
              : "var(--muted-foreground)",
        }}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="px-2 py-0.5 rounded-md"
                style={{
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  background: "var(--accent)",
                  color: "var(--accent-foreground)",
                  letterSpacing: "0.03em",
                  textTransform: "uppercase",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {wi.category}
              </span>
              <span className="text-muted-foreground" style={{ fontSize: "0.6875rem", fontFamily: "'DM Mono', monospace" }}>
                v{wi.version}
              </span>
            </div>
            <h3
              className="text-foreground leading-snug line-clamp-2"
              style={{ fontSize: "0.9375rem", fontWeight: 600 }}
            >
              {wi.title}
            </h3>
          </div>
          <StatusBadge status={wi.status} size="sm" />
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-4 line-clamp-2" style={{ fontSize: "0.8125rem", lineHeight: 1.5 }}>
          {wi.description}
        </p>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
              {completedSteps} of {wi.steps.length} steps
            </span>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: wi.completionPercentage === 100 ? "#15803d" : "var(--foreground)", fontFamily: "'DM Mono', monospace" }}>
              {wi.completionPercentage}%
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${wi.completionPercentage}%`,
                background:
                  wi.completionPercentage === 100
                    ? "#16a34a"
                    : "var(--primary)",
              }}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4 text-muted-foreground" style={{ fontSize: "0.75rem" }}>
          <span>By <span className="text-foreground" style={{ fontWeight: 500 }}>{wi.author}</span></span>
          <span>Modified {wi.lastModified}</span>
          <span style={{ fontFamily: "'DM Mono', monospace" }}>~{wi.estimatedTime} min</span>
        </div>

        {/* Tags */}
        {wi.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {wi.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md"
                style={{
                  fontSize: "0.6875rem",
                  background: "var(--secondary)",
                  color: "var(--muted-foreground)",
                }}
              >
                #{tag}
              </span>
            ))}
            {wi.tags.length > 3 && (
              <span className="text-muted-foreground" style={{ fontSize: "0.6875rem" }}>
                +{wi.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <button
            onClick={onOpen}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-white transition-colors"
            style={{ background: "var(--primary)", fontSize: "0.8125rem", fontWeight: 600 }}
          >
            <Eye size={14} />
            Open
          </button>
          <button
            onClick={onEdit}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={onDuplicate}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Duplicate"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={onDelete}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-border hover:bg-red-50 transition-colors text-muted-foreground hover:text-red-600"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
