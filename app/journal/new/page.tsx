// app/journal/new/page.tsx
import { NewJournalEntryForm } from "@/components/NewJournalEntryForm";

export const metadata = {
  title: "Write New Journal Entry | Temple Journal",
  description: "Record your attendance and preserve spiritual promptings safely inside your vault.",
};

export default function NewJournalEntryPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6 md:p-12 pb-32 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm space-y-6">
        
        <header className="border-b border-zinc-100 pb-4">
          <span className="text-3xl" aria-hidden="true">✍️</span>
          <h1 className="text-2xl font-serif font-bold text-[#1A2530] mt-2">
            Record a New Milestone
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Preserve your attendance dates, unique personal reflections, and spiritual insights.
          </p>
        </header>

        <NewJournalEntryForm />

      </div>
    </div>
  );
}
