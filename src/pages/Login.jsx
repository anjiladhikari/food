import { useState } from "react";
import { signIn } from "../lib/auth";

const FIELD =
  "w-full min-w-0 rounded-lg border border-line bg-cream px-4 py-3 text-[15px] text-ink outline-none transition-colors duration-150 placeholder:text-muted/70 focus:border-clay focus:ring-2 focus:ring-clay/25";

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
    <div className="mx-auto max-w-sm py-10 sm:py-14">
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <h2 className="font-display text-2xl leading-tight sm:text-3xl">
          Login
        </h2>

        <p className="mt-2 text-sm leading-relaxed text-muted">
          Sign in to manage inventory, purchases and meal tracking.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-3"
        >
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={FIELD}
          />

          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={FIELD}
          />

          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-ink px-4 py-3 font-medium text-cream transition-all duration-150 hover:shadow-md hover:shadow-black/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface active:translate-y-0 motion-safe:hover:-translate-y-px"
          >
            Login
          </button>

          {error && (
            <p className="rounded-lg border border-clay/30 bg-clay/10 px-3 py-2 text-sm text-clay">
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
