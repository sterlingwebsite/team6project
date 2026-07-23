"use client";

import Link from "next/link";

export default function LoginForm() {
  return (
    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Sign In
      </h1>

      <form className="space-y-4">

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium"
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Enter your email"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium"
          >
            Password
          </label>

          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="Enter your password"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700"
        >
          Sign In
        </button>

      </form>

      <p className="mt-6 text-center text-sm">
        Don't have an account?{" "}
        <Link
          href="/auth/signup"
          className="font-medium text-blue-600 hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}