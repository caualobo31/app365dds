export function DdsBlock({ label, text }: { label: string; text: string }) {
  return (
    <section className="py-6">
      <h2 className="font-mono text-sm uppercase tracking-widest text-safety-yellow">{label}</h2>
      <p className="mt-3 text-2xl leading-relaxed text-white">{text}</p>
    </section>
  );
}
