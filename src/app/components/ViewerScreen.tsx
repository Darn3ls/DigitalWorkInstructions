import { useState, useEffect } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, Clock, Download, AlertTriangle, Wrench, RotateCcw } from "lucide-react";
import type { WorkInstruction } from "./mock-data";
import { currentUser } from "./mock-data";

interface ViewerScreenProps {
  wi: WorkInstruction;
  onBack: () => void;
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function ViewerScreen({ wi, onBack }: ViewerScreenProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [completedAt] = useState(new Date());

  const step = wi.steps[currentIdx];
  const totalSteps = wi.steps.length;
  const progress = Math.round((completed.size / totalSteps) * 100);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(id);
  }, [done]);

  const markComplete = () => {
    const next = new Set(completed);
    next.add(currentIdx);
    setCompleted(next);
    if (currentIdx < totalSteps - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setDone(true);
    }
  };

  const goTo = (idx: number) => {
    if (idx >= 0 && idx < totalSteps) setCurrentIdx(idx);
  };

  const restart = () => {
    setCompleted(new Set());
    setCurrentIdx(0);
    setDone(false);
    setElapsed(0);
  };

  const estRemainingMin = Math.round(
    (wi.estimatedTime * (totalSteps - completed.size)) / totalSteps
  );

  if (done) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="bg-card border-b border-border px-4 sm:px-6 h-16 flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors" style={{ fontSize: "0.875rem" }}>
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
        </div>

        {/* Completion */}
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full text-center">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "#dcfce7" }}
            >
              <CheckCircle size={48} style={{ color: "#16a34a" }} />
            </div>
            <h1 className="text-foreground mb-2" style={{ fontSize: "1.75rem", fontWeight: 700 }}>
              All Done!
            </h1>
            <p className="text-muted-foreground mb-8" style={{ fontSize: "1rem" }}>
              {wi.title}
            </p>

            <div className="bg-card border border-border rounded-xl p-6 text-left space-y-4 mb-8">
              {[
                { label: "Operator", value: currentUser.name },
                { label: "Completed", value: completedAt.toLocaleString("en-GB") },
                { label: "Total Time", value: formatTime(elapsed), mono: true },
                { label: "Steps Completed", value: `${totalSteps} / ${totalSteps}`, mono: true },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>{label}</span>
                  <span
                    className="text-foreground"
                    style={{ fontSize: "0.9375rem", fontWeight: 600, fontFamily: mono ? "'DM Mono', monospace" : undefined }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-white"
                style={{ background: "var(--primary)", fontSize: "1rem", fontWeight: 600 }}
              >
                <Download size={18} />
                Download PDF Report
              </button>
              <button
                onClick={restart}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border border-border hover:bg-muted transition-colors text-foreground"
                style={{ fontSize: "1rem", fontWeight: 500 }}
              >
                <RotateCcw size={16} />
                Run Again
              </button>
              <button
                onClick={onBack}
                className="w-full py-3.5 rounded-xl border border-border hover:bg-muted transition-colors text-muted-foreground"
                style={{ fontSize: "1rem" }}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            style={{ fontSize: "0.875rem" }}
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-semibold truncate" style={{ fontSize: "0.9375rem" }}>
              {wi.title}
            </p>
            <p className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
              Step {currentIdx + 1} of {totalSteps}
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground shrink-0" style={{ fontSize: "0.8125rem", fontFamily: "'DM Mono', monospace" }}>
            <Clock size={14} />
            {formatTime(elapsed)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-muted">
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${progress}%`, background: progress === 100 ? "#16a34a" : "var(--primary)" }}
          />
        </div>
      </div>

      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {/* Progress info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span
              className="text-muted-foreground"
              style={{ fontSize: "0.875rem" }}
            >
              <span style={{ fontWeight: 700, color: "var(--primary)", fontFamily: "'DM Mono', monospace" }}>
                {progress}%
              </span>{" "}
              complete
            </span>
            <span className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>·</span>
            <span className="text-muted-foreground" style={{ fontSize: "0.8125rem" }}>
              ~{estRemainingMin} min remaining
            </span>
          </div>
          {/* Step dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {wi.steps.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === currentIdx ? 20 : 8,
                  height: 8,
                  background: completed.has(i)
                    ? "#16a34a"
                    : i === currentIdx
                    ? "var(--primary)"
                    : "var(--border)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Current step card */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden flex-1">
          {/* Step number banner */}
          <div
            className="px-6 py-4 flex items-center gap-4"
            style={{ background: "var(--primary)" }}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-white shrink-0"
              style={{ background: "rgba(255,255,255,0.15)", fontSize: "1.5rem", fontWeight: 700, fontFamily: "'DM Mono', monospace" }}
            >
              {step.number}
            </div>
            <div>
              <p className="text-white/70" style={{ fontSize: "0.75rem", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Step {step.number} of {totalSteps}
              </p>
              <h2 className="text-white" style={{ fontSize: "1.125rem", fontWeight: 700 }}>
                {step.title}
              </h2>
            </div>
            {completed.has(currentIdx) && (
              <div className="ml-auto">
                <CheckCircle size={24} className="text-white" />
              </div>
            )}
          </div>

          <div className="p-6 space-y-5">
            {/* Description */}
            <div>
              <p
                className="text-foreground"
                style={{ fontSize: "1rem", lineHeight: 1.7 }}
              >
                {step.description || "No description provided for this step."}
              </p>
            </div>

            {/* Image placeholder */}
            <div
              className="w-full aspect-video rounded-xl flex items-center justify-center border border-border overflow-hidden"
              style={{ background: "var(--secondary)" }}
            >
              <div className="text-center text-muted-foreground">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="mx-auto mb-2 opacity-40">
                  <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="8.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 16l4-4 3 3 3-3 8 5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
                <p style={{ fontSize: "0.8125rem" }}>Step illustration</p>
              </div>
            </div>

            {/* Safety notes */}
            {step.safetyNotes && (
              <div
                className="flex gap-3 p-4 rounded-xl border"
                style={{ background: "#fef3c7", borderColor: "#fde68a" }}
              >
                <AlertTriangle size={18} style={{ color: "#d97706", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "#92400e", marginBottom: 4 }}>
                    Safety Warning
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "#92400e", lineHeight: 1.5 }}>
                    {step.safetyNotes}
                  </p>
                </div>
              </div>
            )}

            {/* Required tools */}
            {step.requiredTools && step.requiredTools.length > 0 && (
              <div
                className="p-4 rounded-xl border"
                style={{ background: "var(--accent)", borderColor: "var(--accent-foreground)" + "22" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Wrench size={15} style={{ color: "var(--accent-foreground)" }} />
                  <p style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--accent-foreground)" }}>
                    Required Tools
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {step.requiredTools.map((tool, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg"
                      style={{ fontSize: "0.8125rem", background: "var(--card)", color: "var(--foreground)", border: "1px solid var(--border)" }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Expected result */}
            {step.expectedResult && (
              <div className="flex gap-3 p-4 rounded-xl border border-border bg-secondary">
                <CheckCircle size={16} style={{ color: "#16a34a", flexShrink: 0, marginTop: 2 }} />
                <div>
                  <p style={{ fontSize: "0.8125rem", fontWeight: 600, marginBottom: 4 }}>Expected Result</p>
                  <p className="text-muted-foreground" style={{ fontSize: "0.875rem" }}>{step.expectedResult}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="grid grid-cols-3 gap-3 pb-4">
          <button
            onClick={() => goTo(currentIdx - 1)}
            disabled={currentIdx === 0}
            className="flex items-center justify-center gap-2 py-4 rounded-xl border border-border hover:bg-muted transition-colors text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ fontSize: "1rem", fontWeight: 600 }}
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={markComplete}
            className="flex items-center justify-center gap-2 py-4 rounded-xl text-white transition-all active:scale-95"
            style={{
              background: completed.has(currentIdx) ? "#16a34a" : "var(--primary)",
              fontSize: "1rem",
              fontWeight: 700,
            }}
          >
            {completed.has(currentIdx) ? (
              <>
                <CheckCircle size={20} />
                <span className="hidden sm:inline">Done</span>
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                <span className="hidden sm:inline">Complete</span>
              </>
            )}
          </button>

          <button
            onClick={() => goTo(currentIdx + 1)}
            disabled={currentIdx === totalSteps - 1}
            className="flex items-center justify-center gap-2 py-4 rounded-xl border border-border hover:bg-muted transition-colors text-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ fontSize: "1rem", fontWeight: 600 }}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
