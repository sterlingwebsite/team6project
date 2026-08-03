// components/EmptyFactsState.tsx
import Link from "next/link";

export default function EmptyFactsState() {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-12 text-center max-w-xl mx-auto space-y-4 shadow-sm">
      <span className="text-4xl block" aria-hidden="true">💡</span>
      <h2 className="text-lg font-semibold text-[#1A2530]">No contributions tracked yet</h2>
      <p className="text-sm text-zinc-600 max-w-xs mx-auto leading-relaxed">
        When you add historical milestones or unique architectural features directly to individual temple profile screens, they will aggregate inside this management pane.
      </p>
      <Link
        href="/temples"
        className="inline-block bg-[#1A2530] text-white hover:bg-zinc-800 focus:ring-2 focus:ring-offset-2 focus:ring-[#1A2530] px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm"
      >
        Explore Directory & Contribute
      </Link>
    </div>
  );
}
