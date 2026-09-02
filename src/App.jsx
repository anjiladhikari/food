import { useEffect, useRef, useState } from "react";
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

function playTick(context) {
  if (!context || context.state !== "running") return;

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.value = 1200;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.015, now + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

  oscillator.connect(gain).connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.04);
}

function localTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function App() {

  const [tab, setTab] = useState("today");
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginRequested, setLoginRequested] = useState(false);
  const [clock, setClock] = useState(() => localTime());
  const [soundOn, setSoundOn] = useState(false);
  const soundOnRef = useRef(false);
  const audioRef = useRef(null);

  // Warm the cache once per page session; every tab reuses these fetches.
  useEffect(() => {
    Object.values(SHEETS).forEach((sheet) => {
      getSheet(sheet).catch(() => { });
    });
  }, []);
  useEffect(() => {
    const id = setInterval(() => {
      setClock(localTime());

      if (soundOnRef.current) playTick(audioRef.current);
    }, 1000);

    return () => {
      clearInterval(id);
      audioRef.current?.close();
      audioRef.current = null;
    };
  }, []);

  function toggleSound() {
    const next = !soundOn;

    setSoundOn(next);
    soundOnRef.current = next;

    if (next) {
      if (!audioRef.current) {
        audioRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      audioRef.current.resume();
    }
  }

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
      <header className="sticky top-0 z-20 flex items-center gap-2.5 border-b border-line/70 bg-cream px-3 py-1.5 sm:gap-4 sm:px-6 sm:py-2">
        <div className="flex shrink-0 items-center gap-2.5 border-r border-line pr-2.5 sm:gap-3 sm:pr-4">
          <h1 className="font-display text-sm leading-tight tracking-tight whitespace-nowrap sm:text-lg">
            My Food Plan
          </h1>

          <div className="rounded-md border-l border-line bg-surface px-2 py-0.5 text-left leading-tight">
            <p className="text-[9px] uppercase tracking-[0.14em] text-muted sm:text-[10px]">
              {today}
            </p>

            <div className="flex items-center gap-1.5">
              <p className="text-[10px] font-medium tabular-nums text-ink/85 sm:text-[11px]">
                {clock}
              </p>

              <button
                type="button"
                onClick={toggleSound}
                aria-pressed={soundOn}
                aria-label={
                  soundOn
                    ? "Turn tick sound off"
                    : "Turn tick sound on"
                }
                className="cursor-pointer rounded text-[10px] leading-none opacity-60 transition-opacity duration-150 hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink/40"
              >
                {soundOn ? "🔊" : "🔇"}
              </button>
            </div>
          </div>
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
