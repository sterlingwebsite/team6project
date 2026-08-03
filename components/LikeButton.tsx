"use client";

import { useState } from "react";

type LikeButtonProps = {
  templeId: string;
  factId: string;
  onLikeSuccess?: () => void;
};

export default function LikeButton({ templeId, factId, onLikeSuccess }: LikeButtonProps) {
  const [isLiking, setIsLiking] = useState(false);
  // Added an inline error string to eliminate generic browser alert pops completely
  const [errorText, setErrorText] = useState<string | null>(null);

  async function handleLike() {
    if (isLiking) return;
    setIsLiking(true);
    setErrorText(null);
    
    try {
      const response = await fetch(
        `/api/temples/${templeId}/facts/${factId}/like`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        if (onLikeSuccess) {
          onLikeSuccess();
        }
      } else {
        const errData = await response.json().catch(() => ({}));
        setErrorText(errData.message || "Could not register your vote selection.");
      }
    } catch (error) {
      console.error("Failed to like fact:", error);
      setErrorText("Network transmission failure. Please try again.");
    } finally {
      setIsLiking(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleLike}
        disabled={isLiking}
        // Swapped amber with a clean zinc fill to pass strict WCAG contrast checks perfectly
        className="rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 focus:ring-2 focus:ring-[#9A7B1C] focus:outline-none px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 flex items-center gap-1"
      >
        <span aria-hidden="true">👍</span>
        <span>{isLiking ? "Voting..." : "Helpful Vote"}</span>
      </button>
      
      {errorText && (
        <span className="text-[10px] text-[#C62828] font-medium" role="alert">
          {errorText}
        </span>
      )}
    </div>
  );
}
