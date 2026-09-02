import { useEffect, useRef, useState } from "react";

const UNITS = ["g", "ml", "count"];

export default function UnitSelect({ value, onChange, className = "" }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
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

  return (
    <div ref={wrapperRef} className={"relative " + className}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex w-full min-w-0 cursor-pointer items-center justify-between gap-2 rounded-lg border border-line bg-cream px-3 py-2.5 text-[15px] leading-normal text-ink transition-colors duration-150 hover:border-ink/40 focus-visible:border-clay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-clay/25"
      >
        {value}

        <span className="text-[10px] text-muted">
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute inset-x-0 top-full z-40 mt-1 overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-lg shadow-black/40"
        >
          {UNITS.map((unit) => (
            <li key={unit}>
              <button
                type="button"
                role="option"
                aria-selected={unit === value}
                onClick={() => {
                  onChange(unit);
                  setOpen(false);
                }}
                className={
                  "block w-full cursor-pointer px-3 py-1.5 text-left text-[13px] transition-colors duration-150 " +
                  (unit === value
                    ? "bg-ink/10 text-ink"
                    : "text-muted hover:bg-ink/5 hover:text-ink")
                }
              >
                {unit}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
