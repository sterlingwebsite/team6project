import TempleFactCard from "@/components/TempleFactCard";

type PageProps = {
  params: Promise<{
    templeId: string;
  }>;
};

type TempleFact = {
  id: string;
  factText: string;
  likesCount: number;
};

export default async function TemplePage({ params }: PageProps) {
  const { templeId } = await params;

  const response = await fetch(
    `http://localhost:3000/api/temples/${templeId}/facts`,
    {
      cache: "no-store",
    }
  );

  const data = await response.json();

  const facts: TempleFact[] = data.facts;

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">
        Temple Facts
      </h1>

      <p className="text-gray-600">
        Temple ID: {templeId}
      </p>

      <div className="space-y-4">
        {facts.map((fact) => (
          <TempleFactCard
            key={fact.id}
            fact={fact}
          />
        ))}
      </div>
    </main>
  );
}