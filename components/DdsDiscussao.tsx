export function DdsDiscussao({ label, questions }: { label: string; questions: string[] }) {
  return (
    <section className="py-6">
      <h2 className="font-mono text-sm uppercase tracking-widest text-safety-yellow">{label}</h2>
      <ul className="mt-3 flex flex-col gap-4">
        {questions.map((question, i) => (
          <li key={i} className="flex gap-3 text-2xl leading-relaxed text-white">
            <span className="shrink-0 text-safety-yellow" aria-hidden="true">
              —
            </span>
            <span>{question}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
