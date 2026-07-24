import type { Metadata } from "next";
import { NewJournalEntryForm } from "./NewJournalEntryForm";

export const metadata: Metadata = {
  title: "New Journal Entry",
  description: "Record a new temple visit and spiritual insight.",
};

export default function NewJournalEntryPage() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="w-full max-w-xl">
        <h1 className="mb-2 text-2xl font-semibold text-[#1A2530] dark:text-zinc-50">
          New Journal Entry
        </h1>
        <p className="mb-8 text-sm text-zinc-600 dark:text-zinc-400">
          Log a temple visit and capture your spiritual insights.
        </p>
        <NewJournalEntryForm />
      </div>
    </div>
  );
}
