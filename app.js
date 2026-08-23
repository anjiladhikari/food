const SHEET_ID = "1QwwTSwh7imbzvkHXPvvtZ5awNyf41r_aMnQUsLFivAY";

async function getSheet(sheetName) {
    const url =
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq` +
        `?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

    const response = await fetch(url);
    const text = await response.text();

    const data = JSON.parse(
        text.substring(47, text.length - 2)
    );

    return data.table.rows.map(row =>
        row.c.map(cell => cell?.v ?? "")
    );
}
