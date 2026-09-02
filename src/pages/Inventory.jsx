import { useEffect, useState } from "react";
import {
    getInventory,
    addInventoryItem,
    updateInventoryQuantity,
    deleteInventoryItem,
} from "../lib/inventory";

export default function Inventory() {
    const [items, setItems] = useState([]);
    const [foodName, setFoodName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("g");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        if (!foodName.trim() || !quantity) return;

        try {
            await addInventoryItem(
                foodName.trim(),
                Number(quantity),
                unit
            );

            setFoodName("");
            setQuantity("");

            await loadInventory();
        } catch {
            setError(error.message || "Could not add item.");
        }
    }

    async function changeQuantity(item, amount) {
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
        try {
            await deleteInventoryItem(id);

            setItems((current) =>
                current.filter((item) => item.id !== id)
            );
        } catch {
            setError("Could not delete item.");
        }
    }

    if (loading) {
        return <p>Loading inventory...</p>;
    }

    return (
        <div>
            <h2>Inventory</h2>

            <form onSubmit={handleSubmit}>
                <input
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    placeholder="Food name"
                />

                <input
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Quantity"
                />

                <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                >
                    <option value="g">g</option>
                    <option value="ml">ml</option>
                    <option value="count">count</option>
                </select>

                <button type="submit">
                    Add
                </button>
            </form>

            {error && <p>{error}</p>}

            <div className="inventory-grid">
                {items.map((item) => (
                    <div key={item.id}>
                        <strong>{item.food_name}</strong>

                        <div>
                            {item.quantity} {item.unit}
                        </div>

                        <button
                            onClick={() => changeQuantity(item, -1)}
                        >
                            −
                        </button>

                        <button
                            onClick={() => changeQuantity(item, 1)}
                        >
                            +
                        </button>
                        <button onClick={() => removeItem(item.id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}