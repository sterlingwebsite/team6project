"use client";

import { useState } from "react";

type LikeButtonProps = {
  templeId: string;
  factId: string;
};

export default function LikeButton({
  templeId,
  factId,
}: LikeButtonProps) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  async function handleLike() {
    try {
      const response = await fetch(
        `/api/temples/${templeId}/facts/${factId}/like`,
        {
          method: "POST",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likesCount);
        setLiked(true);
      }
    } catch (error) {
      console.error("Failed to like fact:", error);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={liked}
      className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50"
    >
      {liked ? `Liked (${likes})` : "Like"}
    </button>
  );
}