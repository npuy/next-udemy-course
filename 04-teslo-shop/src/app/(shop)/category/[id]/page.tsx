import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;

  if (id === "kids") notFound();

  return (
    <div className="">
      <h1>Category Page {id}</h1>
    </div>
  );
}
