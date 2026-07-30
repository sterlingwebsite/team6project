"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Temple = {
  _id: string;
  name: string;
  location: string;
};

type FieldErrors = {
  templeId?: string;
  visitDate?: string;
  insights?: string;
};

const today = () => new Date().toISOString().split("T")[0];

export function NewJournalEntryForm() {
  const router = useRouter();

  const [temples, setTemples] = useState<Temple[]>([]);
  const [templesStatus, setTemplesStatus] = useState<
    "loading" | "ready" | "error"
  >("loading");

  const [templeId, setTempleId] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [insights, setInsights] = useState("");

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadTemples() {
      try {
        const res = await fetch("/api/temples");
        if (!res.ok) throw new Error("Failed to load temples");
        const data = await res.json();
        if (!cancelled) {
          setTemples(Array.isArray(data) ? data : (data.temples ?? []));
          setTemplesStatus("ready");
        }
      } catch {
        if (!cancelled) setTemplesStatus("error");
      }
    }

    loadTemples();
    return () => {
      cancelled = true;
    };
  }, []);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};

    if (!templeId) {
      errors.templeId = "Please select a temple.";
    }

    if (!visitDate) {
      errors.visitDate = "Please enter a visit date.";
    } else if (visitDate > today()) {
      errors.visitDate = "Visit date cannot be in the future.";
    }

    if (!insights.trim()) {
      errors.insights = "Please share a spiritual insight from your visit.";
    }

    return errors;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templeId,
          visitDate,
          insights: insights.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Failed to save your journal entry.");
      }

      router.push("/journal");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to save your journal entry."
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="templeId"
          className="text-sm font-medium text-[#1A2530] dark:text-zinc-200"
        >
          Temple
        </label>
        {templesStatus === "error" ? (
          <p className="text-sm text-[#C62828]" role="alert">
            Couldn&apos;t load the temple list. Please try again later.
          </p>
        ) : (
          <select
            id="templeId"
            name="templeId"
            value={templeId}
            onChange={(e) => setTempleId(e.target.value)}
            disabled={templesStatus === "loading"}
            aria-invalid={Boolean(fieldErrors.templeId)}
            aria-describedby={
              fieldErrors.templeId ? "templeId-error" : undefined
            }
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-[#1A2530] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
          >
            <option value="" disabled>
              {templesStatus === "loading"
                ? "Loading temples..."
                : "Select a temple"}
            </option>
            {temples.map((temple) => (
              <option key={temple._id} value={temple._id}>
                {temple.name} — {temple.location}
              </option>
            ))}
          </select>
        )}
        {fieldErrors.templeId && (
          <p id="templeId-error" className="text-sm text-[#C62828]" role="alert">
            {fieldErrors.templeId}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="visitDate"
          className="text-sm font-medium text-[#1A2530] dark:text-zinc-200"
        >
          Entry date
        </label>
        <input
          id="visitDate"
          name="visitDate"
          type="date"
          value={visitDate}
          max={today()}
          onChange={(e) => setVisitDate(e.target.value)}
          aria-invalid={Boolean(fieldErrors.visitDate)}
          aria-describedby={
            fieldErrors.visitDate ? "visitDate-error" : undefined
          }
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-[#1A2530] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldErrors.visitDate && (
          <p id="visitDate-error" className="text-sm text-[#C62828]" role="alert">
            {fieldErrors.visitDate}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="insights"
          className="text-sm font-medium text-[#1A2530] dark:text-zinc-200"
        >
          Spiritual insights
        </label>
        <textarea
          id="insights"
          name="insights"
          rows={6}
          value={insights}
          onChange={(e) => setInsights(e.target.value)}
          placeholder="Reflect on what you experienced during this visit..."
          aria-invalid={Boolean(fieldErrors.insights)}
          aria-describedby={
            fieldErrors.insights ? "insights-error" : undefined
          }
          className="resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-[#1A2530] focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
        />
        {fieldErrors.insights && (
          <p id="insights-error" className="text-sm text-[#C62828]" role="alert">
            {fieldErrors.insights}
          </p>
        )}
      </div>

      {submitError && (
        <p className="text-sm text-[#C62828]" role="alert">
          {submitError}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[#D4AF37] px-5 py-2 text-sm font-medium text-[#1A2530] transition-colors hover:bg-[#c4a132] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save entry"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/journal")}
          className="text-sm font-medium text-[#1A2530] hover:underline dark:text-zinc-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
