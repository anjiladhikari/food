const SHEET_ID = "1QwwTSwh7imbzvkHXPvvtZ5awNyf41r_aMnQUsLFivAY";

const cache = {};

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

    const rows = data.table.rows.map(row =>
        row.c.map(cell => cell?.v ?? "")
    );

    cache[sheetName] = rows;

    return rows;
}

const content = document.getElementById("content");

function mealText(text) {
    return String(text)
        .split("\n")
        .map(item => item.replace(/^\+\s*/, "").trim())
        .filter(Boolean)
        .map(item => `<div>${item}</div>`)
        .join("");
}

function renderDay(row, target = content) {
    target.innerHTML = `
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
            <h3>Daily Nutrition</h3>
            ${mealText(row[4])}
        </section>
    `;
}

async function showToday() {
    content.innerHTML = "Loading...";

    const plan = await getSheet("food plan");

    const jsDay = new Date().getDay();
    const dayNumber = jsDay === 0 ? 7 : jsDay;

    renderDay(plan[dayNumber - 1]);
}

async function showWeek() {
    const plan = await getSheet("food plan");

    content.innerHTML = `
        <h2>Weekly Plan</h2>

        <div>
            ${plan.map((row, index) =>
                `<button onclick="openDay(${index})">${row[0]}</button>`
            ).join("")}
        </div>

        <div id="dayPlan"></div>
    `;

    window.weekData = plan;
}

function openDay(index) {
    renderDay(
        window.weekData[index],
        document.getElementById("dayPlan")
    );
}

async function showShopping() {
    content.innerHTML = "Loading...";

    const foods = await getSheet("cooking links and which food");

    content.innerHTML = `
        <h2>Shopping</h2>

        ${foods.map(row => `
            <section>
                <h3>${row[0]}</h3>
                <strong>${row[1]}</strong>
                <p>${row[2]}</p>
                <a href="${row[3]}" target="_blank">
                    Open Woolworths
                </a>
            </section>
        `).join("")}
    `;
}

async function showCooking() {
    content.innerHTML = "Loading...";

    const cooking = await getSheet("how to cook");

    content.innerHTML = `
        <h2>How to Cook</h2>

        ${cooking.map(row => `
            <section>
                <h3>${row[0]}</h3>
                <strong>${row[1]}</strong>
                <p>${row[2]}</p>
                <small>${row[3]}</small>
            </section>
        `).join("")}
    `;
}

document.getElementById("todayBtn").onclick = showToday;
document.getElementById("weekBtn").onclick = showWeek;
document.getElementById("shopBtn").onclick = showShopping;
document.getElementById("cookBtn").onclick = showCooking;

showToday();

// Preload the other sheets in the background
getSheet("cooking links and which food");
getSheet("how to cook");
