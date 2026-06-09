import type { WIStatus } from "./mock-data";

interface StatusBadgeProps {
  status: WIStatus;
  size?: "sm" | "md";
}

const config: Record<WIStatus, { label: string; bg: string; color: string; dot: string }> = {
  published: { label: "Published", bg: "#dcfce7", color: "#15803d", dot: "#16a34a" },
  draft: { label: "Draft", bg: "#fef9c3", color: "#a16207", dot: "#f59e0b" },
  archived: { label: "Archived", bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const c = config[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full"
      style={{
        background: c.bg,
        color: c.color,
        padding: size === "sm" ? "2px 8px" : "3px 10px",
        fontSize: size === "sm" ? "0.75rem" : "0.8125rem",
        fontWeight: 500,
        fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.01em",
      }}
    >
      <span
        className="inline-block rounded-full shrink-0"
        style={{ width: 6, height: 6, background: c.dot }}
      />
      {c.label}
    </span>
  );
}
