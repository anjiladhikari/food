const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream ";

export default function Navigation({ tabs, active, onChange }) {
  return (
    <nav className="flex min-w-0 flex-1 gap-2.5 overflow-x-auto sm:justify-center sm:gap-6">
      {tabs.map((tab) => {
        const isActive = tab.id === active;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            aria-current={isActive ? "page" : undefined}
            className={
              "min-w-fit shrink-0 cursor-pointer rounded-sm border-b-2 px-0.5 py-1 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 sm:text-[13px] " +
              FOCUS_RING +
              (isActive
                ? "border-ink text-ink"
                : "border-transparent text-muted hover:border-line hover:text-ink")
            }
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
