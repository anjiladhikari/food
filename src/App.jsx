import { useEffect, useState } from "react";
import Navigation from "./components/Navigation.jsx";
import Today from "./pages/Today.jsx";
import Week from "./pages/Week.jsx";
import Shopping from "./pages/Shopping.jsx";
import Cooking from "./pages/Cooking.jsx";
import { SHEETS, getSheet } from "./lib/sheets.js";

const TABS = [
  { id: "today", label: "Today", Page: Today },
  { id: "week", label: "Week", Page: Week },
  { id: "shopping", label: "Shopping", Page: Shopping },
  { id: "cooking", label: "Cooking", Page: Cooking },
];

export default function App() {
  const [tab, setTab] = useState("today");

  // Warm the cache once per page session; every tab reuses these fetches.
  useEffect(() => {
    Object.values(SHEETS).forEach((sheet) => {
      getSheet(sheet).catch(() => {});
    });
  }, []);

  const { Page } = TABS.find((item) => item.id === tab);

  const today = new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen">
      <header className="px-4 pb-4 pt-8 text-center sm:pt-10">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">
          {today}
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
          My Food Plan
        </h1>
      </header>

      <Navigation tabs={TABS} active={tab} onChange={setTab} />

      <main
        className={
          "mx-auto w-full pb-16 pt-6 sm:px-6 sm:pt-8 " +
          (tab === "week" ? "max-w-6xl px-2" : "max-w-3xl px-4")
        }
      >
        <Page />
      </main>
    </div>
  );
}
