import { useEffect, useState } from "react";
import {
  getInventory,
  addInventoryItem,
  updateInventoryQuantity,
  deleteInventoryItem,
} from "../lib/inventory";
import { SHEETS, planFoodNames, useSheet } from "../lib/sheets.js";
import FoodSelect from "../components/FoodSelect.jsx";
import UnitSelect from "../components/UnitSelect.jsx";

const FIELD =
  "w-full min-w-0 rounded-lg border border-line bg-cream px-3 py-2.5 text-[15px] text-ink outline-none transition-colors duration-150 placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/25";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-cream";

const STEP_BUTTON =
  "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-line bg-cream text-base leading-none text-muted transition-all duration-150 hover:border-ink/40 hover:bg-ink/5 hover:text-ink active:translate-y-0 motion-safe:hover:-translate-y-px " +
  FOCUS;

export default function Inventory({ user, onRequireLogin }) {
  const [items, setItems] = useState([]);
  const [foodName, setFoodName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("g");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { rows } = useSheet(SHEETS.plan);
  const foods = planFoodNames(rows);

  async function loadInventory() {
    try {
      const data = await getInventory();
      setItems(data);
    } catch {
      setError("Could not load inventory.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInventory();
  }, [user]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!user) {
      onRequireLogin();
      return;
    }

    if (!foodName.trim() || !quantity) return;

    if (!foods.includes(foodName)) {
      setError("Select a food from the plan.");
      return;
    }

    try {
      setError("");

      await addInventoryItem(
        foodName.trim(),
        Number(quantity),
        unit
      );

      setFoodName("");
      setQuantity("");

      await loadInventory();
    } catch (error) {
      setError(error.message || "Could not add item.");
    }
  }

  async function changeQuantity(item, amount) {
    if (!user) {
      onRequireLogin();
      return;
    }

    const newQuantity = Math.max(
      0,
      Number(item.quantity) + amount
    );

    try {
      await updateInventoryQuantity(
        item.id,
        newQuantity
      );

      setItems((current) =>
        current.map((i) =>
          i.id === item.id
            ? { ...i, quantity: newQuantity }
            : i
        )
      );
    } catch {
      setError("Could not update quantity.");
    }
  }

  async function removeItem(id) {
    if (!user) {
      onRequireLogin();
      return;
    }

    try {
      await deleteInventoryItem(id);

      setItems((current) =>
        current.filter((item) => item.id !== id)
      );
    } catch {
      setError("Could not delete item.");
    }
  }

  return (
    <div>
      <h2 className="font-display text-3xl leading-tight sm:text-4xl">
        Inventory
      </h2>

      <form
        onSubmit={handleSubmit}
        className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-line bg-surface p-4 sm:mt-6 sm:grid-cols-[minmax(0,1fr)_6rem_6rem_auto] sm:gap-3 sm:p-5"
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
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Quantity"
          className={FIELD}
        />

        <UnitSelect value={unit} onChange={setUnit} />

        <button
          type="submit"
          className={
            "col-span-2 cursor-pointer rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-all duration-150 hover:shadow-md hover:shadow-black/30 active:translate-y-0 motion-safe:hover:-translate-y-px sm:col-span-1 " +
            FOCUS
          }
        >
          Add
        </button>
      </form>

      {error && (
        <p className="mt-3 rounded-lg border border-clay/30 bg-clay/10 px-3 py-2 text-sm text-clay">
          {error}
        </p>
      )}

      {loading && user && (
        <p className="mt-5 text-muted">
          Loading inventory...
        </p>
      )}

      <div className="mt-5 space-y-2 sm:mt-6 sm:space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-line bg-surface px-4 py-3"
          >
            <strong className="min-w-0 flex-1 truncate text-[15px] font-semibold">
              {item.food_name}
            </strong>

            <div className="shrink-0 text-sm tabular-nums text-muted">
              {item.quantity} {item.unit}
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-2">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() =>
                  changeQuantity(item, -1)
                }
                className={STEP_BUTTON}
              >
                −
              </button>

              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() =>
                  changeQuantity(item, 1)
                }
                className={STEP_BUTTON}
              >
                +
              </button>

              <button
                type="button"
                onClick={() =>
                  removeItem(item.id)
                }
                className={
                  "cursor-pointer rounded-full border border-line px-3 py-1.5 text-xs font-medium text-muted transition-all duration-150 hover:border-clay/50 hover:bg-clay/10 hover:text-clay active:translate-y-0 motion-safe:hover:-translate-y-px " +
                  FOCUS
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
