// components/LoginForm.tsx
'use client';

import { useState } from "react";

export default function LoginForm() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!email.trim() || !password.trim()) {
      setValidationError("Please fill out all mandatory credential fields.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.error) {
        throw new Error(data.error || "Invalid email or password credentials supplied.");
      }

      window.location.href = "/dashboard";
    } catch (err: unknown) {
      console.error("Login client sequence details:", err);
      const errorMessage = err instanceof Error ? err.message : "Authentication transmission failure. Please try again.";
      setValidationError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div aria-live="assertive">
        {validationError && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs font-medium text-center shadow-sm">
            {validationError}
          </div>
        )}
      </div>

      <div>
        {/* Darkened text-zinc-500 to text-zinc-600 for contrast compliance */}
        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          required
          placeholder="sterling@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-2 border border-zinc-300 rounded-lg shadow-sm text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#6E5611] focus:border-[#6E5611] focus:outline-none transition-all disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-2 border border-zinc-300 rounded-lg shadow-sm text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#6E5611] focus:border-[#6E5611] focus:outline-none transition-all disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1A2530] text-white hover:bg-zinc-800 focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2530] focus:outline-none font-semibold px-4 py-2.5 rounded-lg text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="inline-block animate-pulse">Authenticating profile...</span>
        ) : (
          "Sign In Account"
        )}
      </button>
    </form>
  );
}
