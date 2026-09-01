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
                "flex-1 rounded-full px-2 py-2 text-[13px] font-medium transition-colors sm:text-sm " +
                (isActive
                  ? "bg-ink text-cream"
                  : "text-muted hover:text-ink")
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
