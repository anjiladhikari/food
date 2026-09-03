import { useEffect, useState } from "react";
import {
  getVisitorCount,
  incrementVisitorCount,
} from "../lib/visitors.js";


export default function Footer() {


  const [visits, setVisits] = useState(null);

  useEffect(() => {
    async function loadVisits() {
      try {
        const alreadyCounted =
          sessionStorage.getItem("visit-counted");

        if (!alreadyCounted) {
          const count = await incrementVisitorCount();
          setVisits(count);

          sessionStorage.setItem("visit-counted", "true");
        } else {
          const count = await getVisitorCount();
          setVisits(count);
        }
      } catch (error) {
        console.error(error);
      }
    }

    loadVisits();
  }, []);
  return (
    <footer className="px-4 pb-8 text-center text-xs text-muted sm:pb-10">
      <p className="mx-auto mb-3 max-w-xl leading-relaxed">
        A responsive weekly meal planner for viewing daily meals, weekly plans,
        shopping information and cooking instructions.
      </p>
      © 2026{" "}
      <a
        href="https://anjiladhikari.com.np"
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer text-clay/90 underline decoration-clay/40 underline-offset-4 transition-colors duration-150 hover:text-clay hover:decoration-clay/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      >
        Geeky Anjil
      </a>
      {visits !== null && (
        <span> 👁 {visits} visits</span>
      )}
    </footer>
  );
}
