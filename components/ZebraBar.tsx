export function ZebraBar({ className = "h-2" }: { className?: string }) {
  return <div className={`zebra-stripe ${className}`} aria-hidden="true" />;
}
