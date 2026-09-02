import { useEffect, useState } from "react";
import {
  getPurchases,
  addPurchase,
} from "../lib/purchases";
import { addInventoryItem } from "../lib/inventory";

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
      <h2>Purchases</h2>

      <form
        onSubmit={handleSubmit}
        className="mt-4 flex flex-wrap gap-3"
      >
        <input
          placeholder="Food name"
          value={foodName}
          onChange={(e) =>
            setFoodName(e.target.value)
          }
        />

        <input
          type="number"
          min="0"
          placeholder="Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
        />

        <select
          value={unit}
          onChange={(e) =>
            setUnit(e.target.value)
          }
        >
          <option value="g">g</option>
          <option value="ml">ml</option>
          <option value="count">
            count
          </option>
        </select>

        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Price"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
        />

        <button type="submit">
          Add Purchase
        </button>
      </form>

      <div className="mt-4">
        <div>
          <strong>This week:</strong>{" "}
          ${weekTotal.toFixed(2)}
        </div>

        <div>
          <strong>This month:</strong>{" "}
          ${monthTotal.toFixed(2)}
        </div>
      </div>

      {error && (
        <p className="mt-3 text-sm text-clay">
          {error}
        </p>
      )}

      <div className="mt-6 space-y-2">
        {purchases.map((purchase) => (
          <div key={purchase.id}>
            {purchase.food_name} —{" "}
            {purchase.quantity}{" "}
            {purchase.unit} — $
            {Number(purchase.price).toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}