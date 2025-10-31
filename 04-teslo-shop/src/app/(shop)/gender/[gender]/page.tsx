export const revalidate = 60;

import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid, Title } from "@/components";
import type { Gender } from "@/interfaces";
import { notFound, redirect } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    gender: Gender;
  }>;
  searchParams: Promise<{
    page?: string;
    take?: string;
  }>;
}

const categoriesTitleMap: Record<Gender, string> = {
  kid: "Kids",
  men: "Men",
  women: "Women",
  unisex: "All",
};

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { gender } = await params;
  const { page: paramPage, take: paramTake } = await searchParams;
  const page = paramPage ? parseInt(paramPage) : 1;
  const take = paramTake ? parseInt(paramTake) : 12;

  if (!(gender in categoriesTitleMap)) notFound();

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    take,
    gender,
  });

  if (!products) redirect(`/gender/${gender}`);

  return (
    <>
      <Title
        title={categoriesTitleMap[gender]}
        subtitle={`${categoriesTitleMap[gender]} products`}
      />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
