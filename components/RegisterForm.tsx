// components\RegisterForm.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage("Please fill out all mandatory registration input fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Password values do not match. Please verify entries.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to create user account profile.");
      }

      router.push("/auth/login?registered=true");
    } catch (err: unknown) {
      console.error("Registration submittal error details:", err);
      setErrorMessage(err instanceof Error ? err.message : "Network transmission failure. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 border border-zinc-200 shadow-sm space-y-6">
      <h1 className="text-center text-3xl font-serif font-bold text-[#1A2530]">
        Create an Account
      </h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div aria-live="assertive">
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs font-medium text-center shadow-sm">
              {errorMessage}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
            Username
          </label>
          <input
            id="username"
            type="text"
            required
            disabled={loading}
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#9A7B1C] focus:border-[#9A7B1C] focus:outline-none transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            required
            disabled={loading}
            placeholder="username@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#9A7B1C] focus:border-[#9A7B1C] focus:outline-none transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            disabled={loading}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#9A7B1C] focus:border-[#9A7B1C] focus:outline-none transition-all disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            disabled={loading}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-zinc-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#9A7B1C] focus:border-[#9A7B1C] focus:outline-none transition-all disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1A2530] text-white hover:bg-zinc-800 focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2530] focus:outline-none font-semibold px-4 py-2.5 rounded-lg text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-block animate-pulse">Provisioning user profile...</span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="text-center pt-2 border-t border-zinc-100 text-sm text-zinc-500">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-[#9A7B1C] hover:underline focus:outline-2 focus:outline-offset-2 focus:outline-[#9A7B1C]"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
