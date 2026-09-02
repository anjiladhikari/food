import { useEffect, useState } from "react";
import Navigation from "./components/Navigation.jsx";
import Footer from "./components/Footer.jsx";
import Today from "./pages/Today.jsx";
import Week from "./pages/Week.jsx";
import Shopping from "./pages/Shopping.jsx";
import Cooking from "./pages/Cooking.jsx";
import { SHEETS, getSheet } from "./lib/sheets.js";
import Purchases from "./pages/Purchases.jsx";
import Inventory from "./pages/Inventory.jsx";
import Login from "./pages/Login.jsx";
import {
  getUser,
  signOut,
} from "./lib/auth.js";
const TABS = [
  { id: "today", label: "Today", Page: Today },
  { id: "week", label: "Week", Page: Week },
  { id: "shopping", label: "Shopping", Page: Shopping },
  { id: "cooking", label: "Cooking", Page: Cooking },
  { id: "inventory", label: "Inventory", Page: Inventory },
  { id: "purchases", label: "Purchases", Page: Purchases },
];

export default function App() {

  const [tab, setTab] = useState("today");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginRequested, setLoginRequested] = useState(false);

  // Warm the cache once per page session; every tab reuses these fetches.
  useEffect(() => {
    Object.values(SHEETS).forEach((sheet) => {
      getSheet(sheet).catch(() => { });
    });
  }, []);
  useEffect(() => {
    getUser()
      .then(setUser)
      .finally(() => setAuthLoading(false));
  }, []);

  const { Page } = TABS.find((item) => item.id === tab);

  const today = new Date().toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
  });

  <Page
    user={user}
    onRequireLogin={() => setLoginRequested(true)}
  />



  async function handleLogin() {
    const currentUser = await getUser();
    setUser(currentUser);
    setLoginRequested(false);
  }

  async function handleLogout() {
    await signOut();

    setUser(null);
    setTab("today");
    setLoginRequested(false);
  }
function handleTabChange(nextTab) {
  setTab(nextTab);
  setLoginRequested(false);
}

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 flex items-center gap-2.5 border-b border-line/70 bg-cream px-3 py-2 sm:gap-4 sm:px-6">
        <div className="shrink-0 border-r border-line pr-2.5 sm:pr-4">
          <h1 className="font-display text-sm leading-tight tracking-tight whitespace-nowrap sm:text-lg">
            My Food Plan
          </h1>
          <p className="text-[9px] uppercase tracking-[0.14em] text-muted sm:text-[10px]">
            {today}
          </p>
        </div>

        <Navigation
          tabs={TABS}
          active={tab}
          onChange={handleTabChange}
        />

        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            className="ml-auto shrink-0 cursor-pointer rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted transition-all duration-150 hover:border-ink/40 hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:text-sm"
          >
            Logout
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setLoginRequested(true)}
            className="ml-auto shrink-0 cursor-pointer rounded-full border border-line bg-surface px-3 py-1.5 text-xs text-muted transition-all duration-150 hover:border-ink/40 hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:text-sm"
          >
            Login
          </button>
        )}
      </header>
      <main
        className={
          "mx-auto w-full pb-16 pt-6 sm:px-6 sm:pt-8 " +
          (tab === "week" ? "max-w-6xl px-2" : "max-w-3xl px-4")
        }
      >
        {loginRequested && !user ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Page
            user={user}
            onRequireLogin={() => setLoginRequested(true)}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
