export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import { redirect } from "next/navigation";

interface HomePageProps {
  searchParams: Promise<{
    page?: string;
    take?: string;
  }>;
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page: paramPage, take: paramTake } = await searchParams;
  const page = paramPage ? parseInt(paramPage) : 1;
  const take = paramTake ? parseInt(paramTake) : 12;

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    take,
  });

  if (!products) redirect("/");

  return (
    <>
      <Title title={"Shop"} subtitle="All products" />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
