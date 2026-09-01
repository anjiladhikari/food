const DOTS = {
  breakfast: "bg-ochre",
  lunch: "bg-olive",
  dinner: "bg-clay",
  nutrition: "bg-slate-warm",
};

export default function MealCard({ accent, title, time, items, compact = false }) {
  const dot = DOTS[accent] ?? DOTS.breakfast;

  if (compact) {
    return (
      <div>
        <div className="flex items-center gap-2">
          <span className={"h-1.5 w-1.5 shrink-0 rounded-full " + dot} />
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
            {title}
          </h4>
        </div>

        <ul className="mt-1.5 space-y-1 text-[13px] leading-snug text-ink/85">
          {items.length ? (
            items.map((item, i) => <li key={i}>{item}</li>)
          ) : (
            <li className="text-muted">—</li>
          )}
        </ul>
      </div>
    );
  }

  return (
    <article className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className={"h-2 w-2 shrink-0 rounded-full " + dot} />
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em]">
            {title}
          </h3>
        </div>

        {time && (
          <span className="text-xs tabular-nums text-muted">{time}</span>
        )}
      </div>

      <ul className="mt-3 space-y-1.5 text-[15px] leading-relaxed text-ink/90 sm:text-base">
        {items.length ? (
          items.map((item, i) => <li key={i}>{item}</li>)
        ) : (
          <li className="text-muted">—</li>
        )}
      </ul>
    </article>
  );
}
