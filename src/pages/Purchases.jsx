import { useEffect, useState } from "react";
import { addInventoryItem } from "../lib/inventory";
import {
    getPurchases,
    addPurchase,
} from "../lib/purchases";

export default function Purchases() {
    const [purchases, setPurchases] = useState([]);
    const [foodName, setFoodName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("g");
    const [price, setPrice] = useState("");

    async function loadPurchases() {
        const data = await getPurchases();
        setPurchases(data);
    }

    useEffect(() => {
        loadPurchases();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        if (!foodName || !quantity || !price) return;

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
                new Date(purchase.purchased_at) >= startOfWeek
        )
        .reduce(
            (total, purchase) =>
                total + Number(purchase.price),
            0
        );

    const monthTotal = purchases
        .filter(
            (purchase) =>
                new Date(purchase.purchased_at) >= startOfMonth
        )
        .reduce(
            (total, purchase) =>
                total + Number(purchase.price),
            0
        );
    return (
        <div>
            <h2>Purchases</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Food name"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                />

                <input
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                />

                <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="count">count</option>
                </select>

                <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <button type="submit">Add Purchase</button>
            </form>
            <div>
                <strong>This week:</strong> ${weekTotal.toFixed(2)}
                <br />
                <strong>This month:</strong> ${monthTotal.toFixed(2)}
            </div>
            {purchases.map((purchase) => (
                <div key={purchase.id}>
                    {purchase.food_name} — {purchase.quantity} {purchase.unit} — $
                    {purchase.price}
                </div>
            ))}
        </div>
    );
}