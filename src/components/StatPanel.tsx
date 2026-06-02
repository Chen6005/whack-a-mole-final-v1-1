interface StatPanelProps {
  label: string;
  value: string | number;
  variant?: "score" | "timer" | "plain";
}

export function StatPanel({ label, value, variant = "plain" }: StatPanelProps) {
  return (
    <div className={`stat-panel stat-panel--${variant}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
