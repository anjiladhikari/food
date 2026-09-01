import { SHEETS, useSheet } from "../lib/sheets.js";

export default function Cooking() {
  const { rows, error, loading } = useSheet(SHEETS.cooking);

  if (loading) {
    return <p className="py-16 text-center text-muted">Loading cooking notes…</p>;
  }

  if (error) {
    return (
      <p className="py-16 text-center text-muted">
        Could not load cooking information.
      </p>
    );
  }

  return (
    <>
      <h2 className="font-display text-3xl leading-tight sm:text-4xl">
        How to Cook
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
              <p className="mt-4 whitespace-pre-line border-t border-line pt-3 text-sm leading-relaxed text-muted">
                <span className="font-semibold text-clay">Tip · </span>
                {row[3]}
              </p>
            )}
          </article>
        ))}
      </div>
    </>
  );
}
