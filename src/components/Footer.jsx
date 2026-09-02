export default function Footer() {
  return (
  <footer className="px-4 pb-10 text-center text-xs text-muted">
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
  </footer>
  );
}
