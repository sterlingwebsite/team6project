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
          {/* 🛠️ FIX: Replaced the low-contrast raw pencil emoji with an inline SVG using a > 7:1 contrast ratio */}
          <div className="text-[#54410D] mb-2" aria-hidden="true">
            <svg 
              className="w-8 h-8" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" 
              />
            </svg>
          </div>

          <h1 className="text-2xl font-serif font-bold text-[#1A2530] mt-2">
            Record a New Milestone
          </h1>
          {/* 🛠️ FIX: Boosted contrast from text-zinc-500 to text-zinc-600 to satisfy readability thresholds */}
          <p className="text-zinc-600 text-sm mt-1">
            Preserve your attendance dates, unique personal reflections, and spiritual insights.
          </p>
        </header>

        <NewJournalEntryForm />

      </div>
    </div>
  );
}
