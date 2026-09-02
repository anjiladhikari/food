import { useEffect, useRef, useState } from "react";

const FIELD =
  "w-full min-w-0 rounded-lg border border-line bg-cream px-3 py-2.5 text-[15px] text-ink outline-none transition-colors duration-150 placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/25";

export default function FoodSelect({
  foods,
  value,
  onChange,
  className = "",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    return () =>
      document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const matches = foods.filter((food) =>
    food.toLowerCase().includes(query.trim().toLowerCase())
  );

  function select(food) {
    onChange(food);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={wrapperRef} className={"relative " + className}>
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        value={open ? query : value}
        placeholder={value || "Search food…"}
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setQuery("");
            setOpen(false);
          }

          if (event.key === "Enter" && open) {
            event.preventDefault();
            if (matches.length) select(matches[0]);
          }
        }}
        className={"cursor-pointer " + FIELD}
      />

      {open && (
        <ul className="absolute inset-x-0 top-full z-30 mt-1 max-h-56 overflow-y-auto rounded-lg border border-line bg-surface py-1 shadow-lg shadow-black/40">
          {matches.length ? (
            matches.map((food) => (
              <li key={food}>
                <button
                  type="button"
                  onClick={() => select(food)}
                  className={
                    "block w-full cursor-pointer px-3 py-1.5 text-left text-[13px] transition-colors duration-150 " +
                    (food === value
                      ? "bg-ink/10 text-ink"
                      : "text-muted hover:bg-ink/5 hover:text-ink")
                  }
                >
                  {food}
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-1.5 text-[13px] text-muted">
              No matching food
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
