// components/LikeButton.tsx
"use client";

import { useState } from "react";

type LikeButtonProps = {
  templeId: string;
  factId: string;
  onLikeSuccess?: () => void;
};

export default function LikeButton({ templeId, factId, onLikeSuccess }: LikeButtonProps) {
  const [isLiking, setIsLiking] = useState(false);

  async function handleLike() {
    if (isLiking) return;
    setIsLiking(true);
    
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
        alert("Could not register your like submission.");
      }
    } catch (error) {
      console.error("Failed to like fact:", error);
    } finally {
      setIsLiking(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLiking}
      className="rounded-md bg-amber-500 hover:bg-amber-600 px-3 py-1 text-xs font-semibold text-white transition-colors disabled:opacity-50"
    >
      {isLiking ? "Liking..." : "👍 Like"}
    </button>
  );
}
