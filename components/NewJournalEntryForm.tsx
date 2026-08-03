// components/NewJournalEntryForm.tsx
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TempleCombobox } from "./TempleCombobox"; // Reusing our brand new dropdown child!

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

const today = () => {
  const localToday = new Date();
  const year = localToday.getFullYear();
  const month = String(localToday.getMonth() + 1).padStart(2, '0');
  const day = String(localToday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function NewJournalEntryForm() {
  const router = useRouter();

  const [temples, setTemples] = useState<Temple[]>([]);
  const [templesStatus, setTemplesStatus] = useState<"loading" | "ready" | "error">("loading");

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
        const res = await fetch("/api/temples/all");
        if (!res.ok) throw new Error("Failed to load temples");
        const data = await res.json();
        const list = Array.isArray(data) ? data : (data.temples ?? []);
        
        if (!cancelled) {
          setTemples(list);
          setTemplesStatus("ready");
        }
      } catch {
        if (!cancelled) setTemplesStatus("error");
      }
    }

    loadTemples();
    return () => { cancelled = true; };
  }, []);

  function validate(): FieldErrors {
    const errors: FieldErrors = {};
    if (!templeId) errors.templeId = "Please select a temple destination location.";
    if (!visitDate) errors.visitDate = "Please enter a visit date.";
    else if (visitDate > today()) errors.visitDate = "Visit date cannot be in the future.";
    if (!insights.trim()) errors.insights = "Please share a spiritual insight from your visit.";
    return errors;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

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
      router.refresh();
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Failed to save your journal entry.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      
      <div className="flex flex-col gap-2">
        <label htmlFor="templeSearch" className="text-sm font-semibold text-[#1A2530]">
          Select Temple
        </label>
        
        {/* REUSED FLEXIBLE COMBOMOX CHILD COMPONENT */}
        <TempleCombobox 
          temples={temples}
          status={templesStatus}
          onSelect={(id) => {
            setTempleId(id);
            setFieldErrors(prev => ({ ...prev, templeId: undefined }));
          }}
          hasError={Boolean(fieldErrors.templeId)}
        />
        
        {fieldErrors.templeId && (
          <p id="templeId-error" className="text-sm text-[#C62828] font-medium" role="alert">
            ⚠️ {fieldErrors.templeId}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="visitDate" className="text-sm font-semibold text-[#1A2530]">
          Date of Visit
        </label>
        <input
          id="visitDate"
          name="visitDate"
          type="date"
          value={visitDate}
          max={today()}
          onChange={(e) => setVisitDate(e.target.value)}
          aria-invalid={Boolean(fieldErrors.visitDate)}
          aria-describedby={fieldErrors.visitDate ? "visitDate-error" : undefined}
          className="rounded-lg border border-zinc-300 bg-white text-[#1A2530] px-4 py-2 text-sm focus:border-[#9A7B1C] focus:ring-2 focus:ring-[#9A7B1C] focus:outline-none"
        />
        {fieldErrors.visitDate && (
          <p id="visitDate-error" className="text-sm text-[#C62828] font-medium" role="alert">
            ⚠️ {fieldErrors.visitDate}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="insights" className="text-sm font-semibold text-[#1A2530]">
          Spiritual Insights & Promptings
        </label>
        <textarea
          id="insights"
          name="insights"
          rows={6}
          value={insights}
          onChange={(e) => setInsights(e.target.value)}
          placeholder="Reflect on what you experienced during this temple visit..."
          aria-invalid={Boolean(fieldErrors.insights)}
          aria-describedby={fieldErrors.insights ? "insights-error" : undefined}
          className="resize-y rounded-lg border border-zinc-300 bg-white text-[#1A2530] px-4 py-3 text-sm focus:border-[#9A7B1C] focus:ring-2 focus:ring-[#9A7B1C] focus:outline-none"
        />
        {fieldErrors.insights && (
          <p id="insights-error" className="text-sm text-[#C62828] font-medium" role="alert">
            ⚠️ {fieldErrors.insights}
          </p>
        )}
      </div>

      {submitError && (
        <p className="text-sm text-[#C62828] font-medium text-center bg-red-50 p-2.5 border border-red-200 rounded-lg" role="alert">
          ❌ {submitError}
        </p>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-[#1A2530] text-white hover:bg-zinc-800 focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2530] focus:outline-none font-medium px-6 py-2.5 text-sm transition-all disabled:opacity-60 shadow-sm"
        >
          {submitting ? "Saving entry..." : "Save Reflection Entry"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/journal")}
          className="text-sm font-medium text-zinc-500 hover:text-zinc-800 hover:underline focus:outline-none focus:ring-2 focus:ring-zinc-400 rounded p-0.5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
