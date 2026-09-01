import { SHEETS, useSheet } from "../lib/sheets.js";

export default function Shopping() {
  const { rows, error, loading } = useSheet(SHEETS.shopping);

  if (loading) {
    return <p className="py-16 text-center text-muted">Loading shopping list…</p>;
  }

  if (error) {
    return (
      <p className="py-16 text-center text-muted">
        Could not load shopping information.
      </p>
    );
  }

  return (
    <>
      <h2 className="font-display text-3xl leading-tight sm:text-4xl">
        Shopping
      </h2>

      <div className="mt-5 space-y-3 sm:mt-7 sm:space-y-4">
        {rows.map((row, i) => (
          <article
            key={i}
            className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
          >
            <h3 className="font-display text-xl sm:text-2xl">{row[0]}</h3>

            {row[1] && (
              <p className="mt-1 text-sm font-semibold text-olive">{row[1]}</p>
            )}

            {row[2] && (
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink/90">
                {row[2]}
              </p>
            )}

            {row[3] && (
              <a
                href={row[3]}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-full border border-line px-4 py-2 text-sm font-medium transition-colors hover:bg-ink hover:text-cream"
              >
                Open Woolworths →
              </a>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
