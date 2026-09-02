import { useEffect, useState } from "react";
import {
  getPurchases,
  addPurchase,
} from "../lib/purchases";
import { addInventoryItem } from "../lib/inventory";
import { SHEETS, planFoodNames, useSheet } from "../lib/sheets.js";
import FoodSelect from "../components/FoodSelect.jsx";
import UnitSelect from "../components/UnitSelect.jsx";

const FIELD =
  "w-full min-w-0 rounded-lg border border-line bg-cream px-3 py-2.5 text-[15px] text-ink outline-none transition-colors duration-150 placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/25";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

export default function Purchases({
  user,
  onRequireLogin,
}) {
  const [purchases, setPurchases] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("g");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  const { rows } = useSheet(SHEETS.plan);
  const foods = planFoodNames(rows);

  async function loadPurchases() {
    try {
      const data = await getPurchases();
      setPurchases(data);
    } catch {
      setError("Could not load purchases.");
    }
  }

  useEffect(() => {
    loadPurchases();
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      onRequireLogin();
      return;
    }

    if (
      !foodName.trim() ||
      !quantity ||
      !price
    ) {
      return;
    }

    if (!foods.includes(foodName)) {
      setError("Select a food from the plan.");
      return;
    }

    try {
      setError("");

      await addPurchase(
        foodName.trim(),
        Number(quantity),
        unit,
        Number(price)
      );

      await addInventoryItem(
        foodName.trim(),
        Number(quantity),
        unit
      );

      setFoodName("");
      setQuantity("");
      setPrice("");

      await loadPurchases();
    } catch (error) {
      setError(
        error.message || "Could not add purchase."
      );
    }
  }

  const now = new Date();

  const startOfWeek = new Date(now);
  const day = now.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  startOfWeek.setDate(now.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const weekTotal = purchases
    .filter(
      (purchase) =>
        new Date(purchase.purchased_at) >=
        startOfWeek
    )
    .reduce(
      (total, purchase) =>
        total + Number(purchase.price),
      0
    );

  const monthTotal = purchases
    .filter(
      (purchase) =>
        new Date(purchase.purchased_at) >=
        startOfMonth
    )
    .reduce(
      (total, purchase) =>
        total + Number(purchase.price),
      0
    );

  return (
    <div>
      <h2 className="font-display text-3xl leading-tight sm:text-4xl">
        Purchases
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-line bg-surface p-4 sm:mt-6 sm:grid-cols-[minmax(0,1fr)_5.5rem_5.5rem_5.5rem_auto] sm:gap-3 sm:p-5"
      >
        <FoodSelect
          foods={foods}
          value={foodName}
          onChange={setFoodName}
          className="col-span-2 sm:col-span-1"
        />

        <input
          type="number"
          min="0"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
          className={FIELD}
        />

        <UnitSelect value={unit} onChange={setUnit} />

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          className={"col-span-2 sm:col-span-1 " + FIELD}
        />

        <button
          type="submit"
          className={
            "col-span-2 cursor-pointer rounded-lg bg-ink px-5 py-2.5 text-sm font-medium whitespace-nowrap text-cream transition-all duration-150 hover:shadow-md hover:shadow-black/30 active:translate-y-0 motion-safe:hover:-translate-y-px sm:col-span-1 " +
            FOCUS
          }
        >
          Add Purchase
        </button>
      </form>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:gap-3">
        <div className="rounded-xl border border-line bg-surface px-4 py-3">
          <strong className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            This week
          </strong>{" "}
          <span className="mt-1 block font-display text-2xl tabular-nums sm:text-3xl">
            ${weekTotal.toFixed(2)}
          </span>
        </div>

        <div className="rounded-xl border border-line bg-surface px-4 py-3">
          <strong className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            This month
          </strong>{" "}
          <span className="mt-1 block font-display text-2xl tabular-nums sm:text-3xl">
            ${monthTotal.toFixed(2)}
          </span>
        </div>
      </div>

      {error && (
        <p className="mt-3 rounded-lg border border-clay/30 bg-clay/10 px-3 py-2 text-sm text-clay">
          {error}
        </p>
      )}

      <div className="mt-5 space-y-2 sm:mt-6">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="flex items-baseline gap-3 rounded-xl border border-line bg-surface px-4 py-3"
          >
            <span className="min-w-0 flex-1 truncate text-[15px]">
              {purchase.food_name}
            </span>

            <span className="shrink-0 text-sm tabular-nums text-muted">
              {purchase.quantity}{" "}
              {purchase.unit}
            </span>

            <span className="shrink-0 font-medium tabular-nums text-clay">
              $
              {Number(purchase.price).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
