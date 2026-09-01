import { useState } from "react";
import MealCard from "../components/MealCard.jsx";
import {
  SHEETS,
  dayLabel,
  getTodayIndex,
  mealLines,
  useSheet,
} from "../lib/sheets.js";

export default function Today() {
  const { rows, error, loading } = useSheet(SHEETS.plan);
  const [offset, setOffset] = useState(0);

  if (loading) {
    return <p className="py-16 text-center text-muted">Loading food plan…</p>;
  }

  if (error || !rows.length) {
    return (
      <p className="py-16 text-center text-muted">
        Could not load the food plan.
      </p>
    );
  }

  const row = rows[(getTodayIndex() + offset) % rows.length];

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">
            {dayLabel(offset)}
          </p>
          <h2 className="mt-1 font-display text-3xl leading-tight sm:text-4xl">
            {row[0]}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setOffset((value) => (value + 1) % 7)}
          className="mt-1 shrink-0 rounded-full border border-line bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-ink hover:text-cream"
        >
          Next →
        </button>
      </div>

      <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
        <MealCard
          accent="breakfast"
          title="Breakfast"
          time="8–9 AM"
          items={mealLines(row[1])}
        />
        <MealCard
          accent="lunch"
          title="Lunch"
          time="1–3 PM"
          items={mealLines(row[2])}
        />
        <MealCard
          accent="dinner"
          title="Dinner"
          time="6–7 PM"
          items={mealLines(row[3])}
        />
        <MealCard
          accent="nutrition"
          title="Daily Nutrition & Cost"
          items={mealLines(row[4])}
        />
      </div>
    </>
  );
}
