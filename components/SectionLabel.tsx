export default function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
      <span className="text-accent">({index})</span>
      <span className="h-px w-10 bg-line" />
      <span>{children}</span>
    </div>
  );
}
