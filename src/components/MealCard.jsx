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
      <div className="min-w-0 border-t border-line pt-2 sm:pt-4">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className={"h-1.5 w-1.5 shrink-0 rounded-full " + dot} />
          <h4 className="text-[9px] font-semibold uppercase tracking-[0.06em] text-muted sm:text-[11px] sm:tracking-[0.12em]">
            {title}
          </h4>
        </div>

        <ul className="mt-1 space-y-0.5 text-[10px] leading-snug break-words text-ink/95 sm:mt-1.5 sm:space-y-1 sm:text-[13px]">
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
    <article className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
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

      <ul className="mt-2.5 space-y-1 text-[14px] leading-relaxed text-ink sm:mt-3 sm:space-y-1.5 sm:text-base">
        {items.length ? (
          items.map((item, i) => <li key={i}>{item}</li>)
        ) : (
          <li className="text-muted">—</li>
        )}
      </ul>
    </article>
  );
}
