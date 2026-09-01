const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream ";

export default function Navigation({ tabs, active, onChange }) {
  return (
    <div className="sticky top-0 z-20 border-b border-line/70 bg-cream px-4 pb-3 pt-2 sm:pb-4">
      <nav className="mx-auto flex w-full max-w-md gap-1 rounded-full border border-line bg-surface p-1">
        {tabs.map((tab) => {
          const isActive = tab.id === active;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={
                "flex-1 cursor-pointer rounded-full px-2 py-2 text-[13px] font-medium transition-all duration-150 sm:text-sm " +
                FOCUS_RING +
                (isActive
                  ? "bg-ink text-cream"
                  : "text-muted hover:bg-ink/5 hover:text-ink")
              }
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
