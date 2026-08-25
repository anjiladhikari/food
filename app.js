const SHEET_ID = "1QwwTSwh7imbzvkHXPvvtZ5awNyf41r_aMnQUsLFivAY";

const content = document.getElementById("content");

let todayOffset = 0;
let weekStartOffset = 0;

const cache = {};

// -------------------------
// BANANA / RICE WEEK
// -------------------------

function getFoodWeek() {
    // Monday 24 August 2026 = Banana Week
    const anchorMonday = new Date(2026, 7, 24);
    anchorMonday.setHours(0, 0, 0, 0);

    const today = new Date();

    // Find Monday of the current week
    const day = today.getDay();
    const diffToMonday = day === 0 ? -6 : 1 - day;

    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() + diffToMonday);
    currentMonday.setHours(0, 0, 0, 0);

    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    const weeksPassed = Math.round(
        (currentMonday - anchorMonday) / oneWeek
    );

    if (Math.abs(weeksPassed) % 2 === 0) {
        return {
            name: "Banana Week",
            emoji: "🍌",
            className: "banana-week"
        };
    }

    return {
        name: "Rice Week",
        emoji: "🍚",
        className: "rice-week"
    };
}

function foodWeekBadge() {
    const week = getFoodWeek();

    return `
        <span class="food-week ${week.className}">
            ${week.emoji} ${week.name}
        </span>
    `;
}

// -------------------------
// GOOGLE SHEETS
// -------------------------

async function getSheet(sheetName) {
    if (cache[sheetName]) {
        return cache[sheetName];
    }

    const url =
        `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq` +
        `?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

    const response = await fetch(url);
    const text = await response.text();

    const data = JSON.parse(
        text.substring(47, text.length - 2)
    );

    const rows = data.table.rows
        .map(row =>
            row.c.map(cell => cell?.v ?? "")
        )
        .filter(row => {
            const first = String(row[0]).trim();

            return (
                first &&
                first !== "Day" &&
                first !== "Food Item"
            );
        });

    cache[sheetName] = rows;

    return rows;
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

function normalMode() {
    document.body.classList.remove("week-mode");
}

function pageTitle(title) {
    return `
        <div class="page-title-row">
            <h2>${title}</h2>
            ${foodWeekBadge()}
        </div>
    `;
}

// -------------------------
// DAY DISPLAY
// -------------------------

function renderDay(row, title = "", showNext = false) {
    if (!row) {
        return "<p>No food plan found.</p>";
    }

    return `
        ${title ? pageTitle(title) : ""}

        <div class="day-title-row">
            <h2>${row[0]}</h2>

            ${
                showNext
                    ? `
                        <button
                            class="small-next"
                            onclick="showNextDay()"
                        >
                            Next →
                        </button>
                    `
                    : ""
            }
        </div>

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
    normalMode();

    content.innerHTML = "Loading...";

    try {
        const plan = await getSheet("food plan");

        const todayIndex = getTodayIndex();

        const selectedIndex =
            (todayIndex + todayOffset) % plan.length;

        const label =
            todayOffset === 0
                ? `Today · ${getWeekdayName(0)}`
                : todayOffset === 1
                ? `Tomorrow · ${getWeekdayName(1)}`
                : getWeekdayName(todayOffset);

        content.innerHTML = renderDay(
            plan[selectedIndex],
            label,
            true
        );

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
// -------------------------

async function showWeek(startOffset = null) {
    document.body.classList.add("week-mode");

    if (startOffset !== null) {
        weekStartOffset = startOffset;
    }

    content.innerHTML = "Loading...";

    try {
        const plan = await getSheet("food plan");
        const todayIndex = getTodayIndex();

        const sevenDays = [];

        for (let offset = 0; offset < 7; offset++) {
            const index =
                (todayIndex + offset) % plan.length;

            sevenDays.push({
                row: plan[index],
                offset
            });
        }

        const fourDays = [];

        for (let i = 0; i < 4; i++) {
            const offset =
                (weekStartOffset + i) % 7;

            const index =
                (todayIndex + offset) % plan.length;

            fourDays.push({
                row: plan[index],
                offset
            });
        }

        content.innerHTML = `
            ${pageTitle("Weekly Plan")}

            <div class="week-buttons">
                ${sevenDays.map(day => `
                    <button
                        class="${
                            day.offset === weekStartOffset
                                ? "active"
                                : ""
                        }"
                        onclick="showWeek(${day.offset})"
                    >
                        ${day.row[0]}
                    </button>
                `).join("")}
            </div>

            <div class="week-grid">
                ${fourDays.map(day => {
                    const label =
                        day.offset === 0
                            ? `Today · ${getWeekdayName(0)}`
                            : day.offset === 1
                            ? `Tomorrow · ${getWeekdayName(1)}`
                            : getWeekdayName(day.offset);

                    return `
                        <div class="week-column ${
                            day.offset === weekStartOffset
                                ? "selected-card"
                                : ""
                        }">

                            <div class="week-day-heading">
                                <strong>${label}</strong>
                                <span>${day.row[0]}</span>
                            </div>

                            <div class="week-meal">
                                <strong>Breakfast</strong>
                                ${mealText(day.row[1])}
                            </div>

                            <div class="week-meal">
                                <strong>Lunch</strong>
                                ${mealText(day.row[2])}
                            </div>

                            <div class="week-meal">
                                <strong>Dinner</strong>
                                ${mealText(day.row[3])}
                            </div>

                            <div class="week-meal">
                                <strong>Nutrition</strong>
                                ${mealText(day.row[4])}
                            </div>

                        </div>
                    `;
                }).join("")}
            </div>
        `;

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
    normalMode();

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
    normalMode();

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

document.getElementById("weekBtn").onclick = () => {
    weekStartOffset = 0;
    showWeek();
};

document.getElementById("shopBtn").onclick =
    showShopping;

document.getElementById("cookBtn").onclick =
    showCooking;

// Start
showToday();

// Preload remaining sheets in background
getSheet("cooking links and which food");
getSheet("how to cook");
