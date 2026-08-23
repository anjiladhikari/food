const SHEET_ID = "1QwwTSwh7imbzvkHXPvvtZ5awNyf41r_aMnQUsLFivAY";

const content = document.getElementById("content");

let todayOffset = 0;

// -------------------------
// READ GOOGLE SHEET
// -------------------------

async function getSheet(sheetName) {
    const url =
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq` +
        `?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Could not load Google Sheet.");
    }

    const text = await response.text();

    const data = JSON.parse(
        text.substring(47, text.length - 2)
    );

    const rows = data.table.rows.map(row =>
        row.c.map(cell => cell?.v ?? "")
    );

    // Remove header rows and empty rows
    return rows.filter(row => {
        const firstCell = String(row[0] ?? "").trim();

        return (
            firstCell &&
            firstCell !== "Day" &&
            firstCell !== "Food Item"
        );
    });
}


// -------------------------
// HELPERS
// -------------------------

function mealText(text) {
    if (!text) return "";

    return String(text)
        .split("\n")
        .map(item =>
            item
                .replace(/^[+•]\s*/, "")
                .trim()
        )
        .filter(Boolean)
        .map(item => `<div>${item}</div>`)
        .join("");
}


function getTodayIndex() {
    const day = new Date().getDay();

    // Monday = Day 1
    // Tuesday = Day 2
    // ...
    // Sunday = Day 7

    return day === 0 ? 6 : day - 1;
}


function getWeekdayName(offset = 0) {
    const date = new Date();

    date.setDate(date.getDate() + offset);

    return date.toLocaleDateString("en-AU", {
        weekday: "long"
    });
}


function renderDay(row, title = "") {
    if (!row) {
        return "<p>No food plan found.</p>";
    }

    return `
        ${title ? `<h2>${title}</h2>` : ""}

        <h2>${row[0]}</h2>

        <section>
            <h3>Breakfast · 8–9 AM</h3>
            ${mealText(row[1])}
        </section>

        <section>
            <h3>Lunch · 1–3 PM</h3>
            ${mealText(row[2])}
        </section>

        <section>
            <h3>Dinner · 6–7 PM</h3>
            ${mealText(row[3])}
        </section>

        <section>
            <h3>Daily Nutrition & Cost</h3>
            ${mealText(row[4])}
        </section>
    `;
}


// -------------------------
// TODAY
// -------------------------

async function showToday() {
    content.innerHTML = "Loading...";

    try {
        const plan = await getSheet("food plan");

        const todayIndex = getTodayIndex();

        const selectedIndex =
            (todayIndex + todayOffset) % plan.length;

        const label =
            todayOffset === 0
                ? `Today · ${getWeekdayName(0)}`
                : `${getWeekdayName(todayOffset)}`;

        content.innerHTML = `
            ${renderDay(plan[selectedIndex], label)}

            <button
                class="next-day"
                onclick="showNextDay()"
            >
                Next Day →
            </button>
        `;

    } catch (error) {
        content.innerHTML =
            "<p>Could not load the food plan.</p>";

        console.error(error);
    }
}


function showNextDay() {
    todayOffset++;

    if (todayOffset >= 7) {
        todayOffset = 0;
    }

    showToday();
}


// -------------------------
// WEEK
// TODAY + NEXT 3 DAYS
// -------------------------

async function showWeek() {
    content.innerHTML = "Loading...";

    try {
        const plan = await getSheet("food plan");

        const todayIndex = getTodayIndex();

        let html = `<h2>Next 4 Days</h2>`;

        for (let offset = 0; offset < 4; offset++) {

            const index =
                (todayIndex + offset) % plan.length;

            const label =
                offset === 0
                    ? `Today · ${getWeekdayName(0)}`
                    : offset === 1
                    ? `Tomorrow · ${getWeekdayName(1)}`
                    : getWeekdayName(offset);

            html += `
                <div class="week-day">
                    ${renderDay(plan[index], label)}
                </div>
            `;
        }

        content.innerHTML = html;

    } catch (error) {
        content.innerHTML =
            "<p>Could not load the weekly plan.</p>";

        console.error(error);
    }
}


// -------------------------
// SHOPPING
// -------------------------

async function showShopping() {
    content.innerHTML = "Loading...";

    try {
        const foods =
            await getSheet("cooking links and which food");

        content.innerHTML = `
            <h2>Shopping</h2>

            ${foods.map(row => `
                <section>

                    <h3>${row[0]}</h3>

                    ${
                        row[1]
                            ? `<strong>${row[1]}</strong>`
                            : ""
                    }

                    ${
                        row[2]
                            ? `<p>${row[2]}</p>`
                            : ""
                    }

                    ${
                        row[3]
                            ? `
                            <a
                                href="${row[3]}"
                                target="_blank"
                                rel="noopener"
                            >
                                Open Woolworths
                            </a>
                            `
                            : ""
                    }

                </section>
            `).join("")}
        `;

    } catch (error) {
        content.innerHTML =
            "<p>Could not load shopping information.</p>";

        console.error(error);
    }
}


// -------------------------
// COOKING
// -------------------------

async function showCooking() {
    content.innerHTML = "Loading...";

    try {
        const cooking =
            await getSheet("how to cook");

        content.innerHTML = `
            <h2>How to Cook</h2>

            ${cooking.map(row => `
                <section>

                    <h3>${row[0]}</h3>

                    ${
                        row[1]
                            ? `<strong>${row[1]}</strong>`
                            : ""
                    }

                    ${
                        row[2]
                            ? `<p>${row[2]}</p>`
                            : ""
                    }

                    ${
                        row[3]
                            ? `<small>${row[3]}</small>`
                            : ""
                    }

                </section>
            `).join("")}
        `;

    } catch (error) {
        content.innerHTML =
            "<p>Could not load cooking information.</p>";

        console.error(error);
    }
}


// -------------------------
// NAVIGATION
// -------------------------

document.getElementById("todayBtn").onclick = () => {
    todayOffset = 0;
    showToday();
};

document.getElementById("weekBtn").onclick = showWeek;
document.getElementById("shopBtn").onclick = showShopping;
document.getElementById("cookBtn").onclick = showCooking;


// Start app
showToday();
