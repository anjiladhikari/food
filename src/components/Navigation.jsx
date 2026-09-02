const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream ";

export default function Navigation({ tabs, active, onChange }) {
  return (
    <nav className="flex min-w-0 flex-1 gap-0.5 overflow-x-auto rounded-full border border-line bg-surface p-1 sm:gap-1">
      {tabs.map((tab) => {
        const isActive = tab.id === active;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={isActive ? "page" : undefined}
            className={
              "min-w-fit flex-auto cursor-pointer rounded-full border px-2 py-1.5 text-[11px] font-medium whitespace-nowrap transition-all duration-150 sm:px-3 sm:text-[13px] " +
              FOCUS_RING +
              (isActive
                ? "border-ink/15 bg-ink/10 text-ink"
                : "border-transparent text-muted hover:bg-ink/5 hover:text-ink")
            }
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
