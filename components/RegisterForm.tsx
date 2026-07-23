"use client";

import Link from "next/link";

export default function RegisterForm() {
  return (
    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
      <h1 className="mb-6 text-center text-3xl font-bold">
        Create an Account
      </h1>

      <form className="space-y-4">

        {/* Username */}
        <div>
          <label
            htmlFor="username"
            className="mb-1 block text-sm font-medium"
          >
            Username
          </label>

          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder="Choose a username"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

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
            placeholder="Create a password"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-sm font-medium"
          >
            Confirm Password
          </label>

          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            placeholder="Re-enter your password"
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Register Button */}
        <button
          type="submit"
          className="w-full rounded-md bg-green-600 py-2 text-white transition hover:bg-green-700"
        >
          Create Account
        </button>

      </form>

      <p className="mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}