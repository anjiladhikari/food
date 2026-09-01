import { useState } from "react";
import MealCard from "../components/MealCard.jsx";
import {
  SHEETS,
  dayLabel,
  getTodayIndex,
  mealLines,
  useSheet,
} from "../lib/sheets.js";

export default function Week() {
  const { rows, error, loading } = useSheet(SHEETS.plan);
  const [startOffset, setStartOffset] = useState(0);

  if (loading) {
    return <p className="py-16 text-center text-muted">Loading weekly plan…</p>;
  }

  if (error || !rows.length) {
    return (
      <p className="py-16 text-center text-muted">
        Could not load the weekly plan.
      </p>
    );
  }

  const todayIndex = getTodayIndex();
  const rowFor = (offset) => rows[(todayIndex + offset) % rows.length];

  const allOffsets = [0, 1, 2, 3, 4, 5, 6];
  const visibleOffsets = [0, 1, 2, 3].map((i) => (startOffset + i) % 7);

  return (
    <>
      <h2 className="font-display text-3xl leading-tight sm:text-4xl">
        Weekly Plan
      </h2>

      <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
        {allOffsets.map((offset) => {
          const isActive = offset === startOffset;

          return (
            <button
              key={offset}
              type="button"
              onClick={() => setStartOffset(offset)}
              className={
                "rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors sm:text-sm " +
                (isActive
                  ? "border-ink bg-ink text-cream"
                  : "border-line bg-surface text-muted hover:text-ink")
              }
            >
              {rowFor(offset)[0]}
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-3 sm:mt-7 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {visibleOffsets.map((offset) => {
          const row = rowFor(offset);

          return (
            <div
              key={offset}
              className={
                "rounded-2xl border bg-surface p-4 sm:p-5 " +
                (offset === startOffset ? "border-ink/25" : "border-line")
              }
            >
              <div className="border-b border-line pb-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-clay">
                  {dayLabel(offset)}
                </p>
                <p className="mt-0.5 font-display text-xl">{row[0]}</p>
              </div>

              <div className="mt-4 space-y-4">
                <MealCard
                  compact
                  accent="breakfast"
                  title="Breakfast"
                  items={mealLines(row[1])}
                />
                <MealCard
                  compact
                  accent="lunch"
                  title="Lunch"
                  items={mealLines(row[2])}
                />
                <MealCard
                  compact
                  accent="dinner"
                  title="Dinner"
                  items={mealLines(row[3])}
                />
                <MealCard
                  compact
                  accent="nutrition"
                  title="Nutrition"
                  items={mealLines(row[4])}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
