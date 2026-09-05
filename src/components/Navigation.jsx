import { useEffect, useRef, useState } from "react";

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream ";

export default function Navigation({ tabs, active, onChange }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (!menuRef.current?.contains(event.target)) setOpen(false);
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const activeTab = tabs.find((tab) => tab.id === active);

  return (
    <>
      <nav className="hidden min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex sm:justify-center sm:gap-6">
        {tabs.map((tab) => {
          const isActive = tab.id === active;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={
                "min-w-fit shrink-0 cursor-pointer rounded-sm border-b-2 px-0.5 py-1.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 sm:py-1 sm:text-[13px] " +
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

        <button
          type="button"
          className={
            "min-w-fit shrink-0 cursor-pointer rounded-sm border-b-2 px-0.5 py-1.5 text-[11px] font-medium whitespace-nowrap transition-colors duration-150 sm:py-1 sm:text-[13px] " +
            FOCUS_RING +
            "border-transparent text-muted hover:border-line hover:text-ink"
          }
        >
          Tools
        </button>
      </nav>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-2 sm:hidden">
        <span className="truncate text-[11px] font-medium text-ink">
          {activeTab?.label}
        </span>

        <div ref={menuRef} className="relative shrink-0">
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            aria-label="Open navigation menu"
            onClick={() => setOpen((current) => !current)}
            className={
              "cursor-pointer rounded-md border border-line bg-surface px-2 py-1.5 text-[13px] leading-none text-muted transition-colors duration-150 hover:border-ink/40 hover:text-ink " +
              FOCUS_RING
            }
          >
            ☰
          </button>

          {open && (
            <ul className="absolute right-0 top-full z-30 mt-1.5 w-36 overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-lg shadow-black/40">
              {tabs.map((tab) => {
                const isActive = tab.id === active;

                return (
                  <li key={tab.id}>
                    <button
                      type="button"
                      aria-current={isActive ? "page" : undefined}
                      onClick={() => {
                        onChange(tab.id);
                        setOpen(false);
                      }}
                      className={
                        "block w-full cursor-pointer px-3 py-2 text-left text-[13px] transition-colors duration-150 " +
                        (isActive
                          ? "bg-ink/10 font-medium text-ink"
                          : "text-muted hover:bg-ink/5 hover:text-ink")
                      }
                    >
                      {tab.label}
                    </button>
                  </li>
                );
              })}

              <li>
                <button
                  type="button"
                  className="block w-full cursor-pointer px-3 py-2 text-left text-[13px] text-muted transition-colors duration-150 hover:bg-ink/5 hover:text-ink"
                >
                  Tools
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
