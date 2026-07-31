'use client';

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  
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
      const result = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (result?.error) {
        throw new Error("Invalid email or password credentials supplied.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error("Login client sequence crash:", err);
      setValidationError(err.message || "Authentication transmission failure. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {validationError && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs font-medium text-center shadow-sm">
          {validationError}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          placeholder="username@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-2 border border-zinc-300 rounded-lg shadow-sm text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all disabled:opacity-50"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-2 border border-zinc-300 rounded-lg shadow-sm text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#1A2530] text-white hover:bg-zinc-800 font-semibold px-4 py-2.5 rounded-lg text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
