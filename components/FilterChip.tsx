export function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-11 rounded-[4px] border px-3 font-mono text-sm uppercase tracking-wide transition-colors ${
        active
          ? "border-safety-yellow bg-safety-yellow text-graphite"
          : "border-border bg-surface text-text-secondary hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
