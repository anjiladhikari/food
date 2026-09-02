import { useState } from "react";
import { signIn } from "../lib/auth";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await signIn(email, password);
      await onLogin();
    } catch {
      setError("Invalid email or password.");
    }
  }

  return (
    <div className="mx-auto max-w-sm py-12">
      <h2 className="font-display text-3xl">
        Login
      </h2>

      <p className="mt-2 text-sm text-muted">
        Sign in to manage inventory, purchases and meal tracking.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4"
      >
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-line bg-surface px-4 py-3 outline-none focus:border-clay"
        />

        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-line bg-surface px-4 py-3 outline-none focus:border-clay"
        />

        <button
          type="submit"
          className="w-full cursor-pointer rounded-lg bg-cream px-4 py-3 font-medium text-ink transition-all duration-150 hover:-translate-y-px hover:shadow-md"
        >
          Login
        </button>

        {error && (
          <p className="text-sm text-clay">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}