import { useState } from "react";
import { ArrowLeft, Plus, Trash2, Copy, GripVertical, ChevronDown, ChevronUp, Save, Eye } from "lucide-react";
import { categories, type WorkInstruction, type Step } from "./mock-data";

interface EditorScreenProps {
  wi?: WorkInstruction;
  onBack: () => void;
  onPreview: (wi: WorkInstruction) => void;
}

function makeNewStep(number: number): Step {
  return {
    id: `s-${Date.now()}-${number}`,
    number,
    title: `Step ${number}`,
    description: "",
    safetyNotes: "",
    requiredTools: [],
    expectedResult: "",
    completed: false,
  };
}

export function EditorScreen({ wi, onBack, onPreview }: EditorScreenProps) {
  const isNew = !wi;

  const [title, setTitle] = useState(wi?.title ?? "");
  const [description, setDescription] = useState(wi?.description ?? "");
  const [category, setCategory] = useState(wi?.category ?? categories[0]);
  const [tags, setTags] = useState(wi?.tags.join(", ") ?? "");
  const [estimatedTime, setEstimatedTime] = useState(String(wi?.estimatedTime ?? 30));
  const [version, setVersion] = useState(wi?.version ?? "1.0");
  const [steps, setSteps] = useState<Step[]>(wi?.steps ?? [makeNewStep(1)]);
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set([steps[0]?.id]));
  const [saved, setSaved] = useState(false);
  const [toolInput, setToolInput] = useState<Record<string, string>>({});

  const toggleExpand = (id: string) => {
    setExpandedSteps((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const addStep = () => {
    const newStep = makeNewStep(steps.length + 1);
    setSteps((prev) => [...prev, newStep]);
    setExpandedSteps((prev) => new Set([...prev, newStep.id]));
  };

  const deleteStep = (id: string) => {
    setSteps((prev) =>
      prev
        .filter((s) => s.id !== id)
        .map((s, i) => ({ ...s, number: i + 1 }))
    );
  };

  const duplicateStep = (step: Step) => {
    const dup: Step = { ...step, id: `s-${Date.now()}`, title: `${step.title} (Copy)` };
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.id === step.id);
      const next = [...prev];
      next.splice(idx + 1, 0, dup);
      return next.map((s, i) => ({ ...s, number: i + 1 }));
    });
    setExpandedSteps((prev) => new Set([...prev, dup.id]));
  };

  const updateStep = (id: string, patch: Partial<Step>) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const moveStep = (id: string, dir: -1 | 1) => {
    setSteps((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx + dir < 0 || idx + dir >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[idx + dir]] = [next[idx + dir], next[idx]];
      return next.map((s, i) => ({ ...s, number: i + 1 }));
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const builtWI: WorkInstruction = {
    id: wi?.id ?? `wi-${Date.now()}`,
    title: title || "Untitled Instruction",
    description,
    category,
    tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    estimatedTime: Number(estimatedTime) || 30,
    version,
    status: wi?.status ?? "draft",
    author: wi?.author ?? "Marco Rossi",
    createdAt: wi?.createdAt ?? new Date().toISOString().slice(0, 10),
    lastModified: new Date().toISOString().slice(0, 10),
    steps,
    completionPercentage: wi?.completionPercentage ?? 0,
    assignedUsers: wi?.assignedUsers ?? [],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky top bar */}
      <div className="bg-card border-b border-border sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            style={{ fontSize: "0.875rem" }}
          >
            <ArrowLeft size={18} />
            <span className="hidden sm:inline">Back to Dashboard</span>
          </button>
          <div className="h-5 w-px bg-border" />
          <h1 className="flex-1 text-foreground truncate" style={{ fontSize: "1rem", fontWeight: 600 }}>
            {isNew ? "New Work Instruction" : `Edit: ${wi.title}`}
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPreview(builtWI)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-foreground"
              style={{ fontSize: "0.875rem", fontWeight: 500 }}
            >
              <Eye size={15} />
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-all"
              style={{
                background: saved ? "#16a34a" : "var(--primary)",
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            >
              <Save size={15} />
              {saved ? "Saved!" : "Save"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* General Info */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-foreground mb-5" style={{ fontSize: "1rem", fontWeight: 600 }}>
            General Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-foreground mb-1.5" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                Title <span style={{ color: "var(--destructive)" }}>*</span>
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Hydraulic Pump Assembly — Model H420"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder-muted-foreground outline-none"
                style={{ fontSize: "0.9375rem" }}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-foreground mb-1.5" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief description of what this work instruction covers…"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder-muted-foreground outline-none resize-none"
                style={{ fontSize: "0.875rem" }}
              />
            </div>
            <div>
              <label className="block text-foreground mb-1.5" style={{ fontSize: "0.875rem", fontWeight: 500 }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground outline-none"
                style={{ fontSize: "0.875rem" }}
              >
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-foreground mb-1.5" style={{ fontSize: "0.875rem", fontWeight: 500 }}>Tags</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="hydraulic, pump, critical (comma-separated)"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder-muted-foreground outline-none"
                style={{ fontSize: "0.875rem" }}
              />
            </div>
            <div>
              <label className="block text-foreground mb-1.5" style={{ fontSize: "0.875rem", fontWeight: 500 }}>
                Estimated Time (minutes)
              </label>
              <input
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                min={1}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground outline-none"
                style={{ fontSize: "0.875rem", fontFamily: "'DM Mono', monospace" }}
              />
            </div>
            <div>
              <label className="block text-foreground mb-1.5" style={{ fontSize: "0.875rem", fontWeight: 500 }}>Version</label>
              <input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder-muted-foreground outline-none"
                style={{ fontSize: "0.875rem", fontFamily: "'DM Mono', monospace" }}
              />
            </div>
          </div>
        </section>

        {/* Step Builder */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-foreground" style={{ fontSize: "1rem", fontWeight: 600 }}>
              Steps <span className="text-muted-foreground" style={{ fontWeight: 400 }}>({steps.length})</span>
            </h2>
            <button
              onClick={addStep}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white transition-colors"
              style={{ background: "var(--primary)", fontSize: "0.875rem", fontWeight: 500 }}
            >
              <Plus size={15} />
              Add Step
            </button>
          </div>

          <div className="space-y-3">
            {steps.map((step, idx) => {
              const expanded = expandedSteps.has(step.id);
              return (
                <div
                  key={step.id}
                  className="bg-card border border-border rounded-xl overflow-hidden transition-all"
                >
                  {/* Step header */}
                  <div
                    className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-muted/40 transition-colors"
                    onClick={() => toggleExpand(step.id)}
                  >
                    <div className="text-muted-foreground cursor-grab shrink-0" onClick={(e) => e.stopPropagation()}>
                      <GripVertical size={16} />
                    </div>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
                      style={{ background: "var(--primary)", fontSize: "0.875rem", fontWeight: 700, fontFamily: "'DM Mono', monospace" }}
                    >
                      {step.number}
                    </div>
                    <input
                      value={step.title}
                      onChange={(e) => { e.stopPropagation(); updateStep(step.id, { title: e.target.value }); }}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 bg-transparent text-foreground outline-none"
                      style={{ fontSize: "0.9375rem", fontWeight: 600 }}
                      placeholder={`Step ${step.number} title…`}
                    />
                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => moveStep(step.id, -1)}
                        disabled={idx === 0}
                        className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => moveStep(step.id, 1)}
                        disabled={idx === steps.length - 1}
                        className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                      >
                        <ChevronDown size={14} />
                      </button>
                      <button
                        onClick={() => duplicateStep(step)}
                        className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        onClick={() => deleteStep(step.id)}
                        className="w-7 h-7 flex items-center justify-center rounded text-muted-foreground hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="w-px h-4 bg-border mx-1" />
                      <div className="text-muted-foreground">
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {/* Step content */}
                  {expanded && (
                    <div className="px-5 pb-5 border-t border-border space-y-4 pt-5">
                      <div>
                        <label className="block text-foreground mb-1.5" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                          Instruction Description
                        </label>
                        <textarea
                          value={step.description}
                          onChange={(e) => updateStep(step.id, { description: e.target.value })}
                          rows={4}
                          placeholder="Detailed step instructions…"
                          className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder-muted-foreground outline-none resize-none"
                          style={{ fontSize: "0.875rem" }}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-foreground mb-1.5" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                            ⚠️ Safety Notes
                          </label>
                          <textarea
                            value={step.safetyNotes ?? ""}
                            onChange={(e) => updateStep(step.id, { safetyNotes: e.target.value })}
                            rows={2}
                            placeholder="ESD precautions, PPE, hazards…"
                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder-muted-foreground outline-none resize-none"
                            style={{ fontSize: "0.875rem" }}
                          />
                        </div>
                        <div>
                          <label className="block text-foreground mb-1.5" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                            Expected Result
                          </label>
                          <textarea
                            value={step.expectedResult ?? ""}
                            onChange={(e) => updateStep(step.id, { expectedResult: e.target.value })}
                            rows={2}
                            placeholder="What should be true when this step is done…"
                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-input-background text-foreground placeholder-muted-foreground outline-none resize-none"
                            style={{ fontSize: "0.875rem" }}
                          />
                        </div>
                      </div>

                      {/* Required tools */}
                      <div>
                        <label className="block text-foreground mb-1.5" style={{ fontSize: "0.8125rem", fontWeight: 500 }}>
                          Required Tools
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(step.requiredTools ?? []).map((tool, ti) => (
                            <span
                              key={ti}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border"
                              style={{ fontSize: "0.8125rem", background: "var(--secondary)" }}
                            >
                              {tool}
                              <button
                                onClick={() =>
                                  updateStep(step.id, {
                                    requiredTools: step.requiredTools?.filter((_, i) => i !== ti),
                                  })
                                }
                                className="text-muted-foreground hover:text-foreground"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            value={toolInput[step.id] ?? ""}
                            onChange={(e) => setToolInput((p) => ({ ...p, [step.id]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && toolInput[step.id]?.trim()) {
                                updateStep(step.id, {
                                  requiredTools: [...(step.requiredTools ?? []), toolInput[step.id].trim()],
                                });
                                setToolInput((p) => ({ ...p, [step.id]: "" }));
                              }
                            }}
                            placeholder="Add tool and press Enter…"
                            className="flex-1 px-3 py-2 rounded-lg border border-border bg-input-background text-foreground placeholder-muted-foreground outline-none"
                            style={{ fontSize: "0.8125rem" }}
                          />
                        </div>
                      </div>

                      {/* Media upload placeholders */}
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "📷 Image", accept: "image/*" },
                          { label: "🎬 Video", accept: "video/*" },
                          { label: "📄 PDF", accept: ".pdf" },
                        ].map(({ label }) => (
                          <div
                            key={label}
                            className="flex flex-col items-center justify-center gap-1.5 py-4 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-accent/50 transition-all cursor-pointer"
                          >
                            <span style={{ fontSize: "1.25rem" }}>{label.split(" ")[0]}</span>
                            <span className="text-muted-foreground" style={{ fontSize: "0.75rem" }}>
                              {label.split(" ").slice(1).join(" ")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add step bottom */}
          <button
            onClick={addStep}
            className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-accent/30 transition-all flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
            style={{ fontSize: "0.875rem", fontWeight: 500 }}
          >
            <Plus size={16} />
            Add Another Step
          </button>
        </section>

        {/* Bottom action bar */}
        <div className="flex justify-end gap-3 pb-8">
          <button
            onClick={onBack}
            className="px-6 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors text-foreground"
            style={{ fontSize: "0.9375rem", fontWeight: 500 }}
          >
            Cancel
          </button>
          <button
            onClick={() => onPreview(builtWI)}
            className="px-6 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors text-foreground flex items-center gap-2"
            style={{ fontSize: "0.9375rem", fontWeight: 500 }}
          >
            <Eye size={15} />
            Preview
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-lg text-white flex items-center gap-2 transition-all"
            style={{ background: saved ? "#16a34a" : "var(--primary)", fontSize: "0.9375rem", fontWeight: 600 }}
          >
            <Save size={15} />
            {saved ? "Saved!" : isNew ? "Create Instruction" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
