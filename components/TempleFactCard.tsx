import LikeButton from "./LikeButton";

type TempleFactCardProps = {
  templeId: string;
  fact: {
    id: string;
    factText: string;
    likesCount: number;
  };
};

export default function TempleFactCard({
  templeId,
  fact,
}: TempleFactCardProps) {
  return (
    <div className="rounded-lg border p-5 shadow-sm">
      <h2 className="text-lg font-semibold">
        Temple Fact
      </h2>

      <p className="mt-2 text-gray-700">
        {fact.factText}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-gray-500">
          ❤️ {fact.likesCount} likes
        </span>

        <LikeButton
          templeId={templeId}
          factId={fact.id}
        />
      </div>
    </div>
  );
}