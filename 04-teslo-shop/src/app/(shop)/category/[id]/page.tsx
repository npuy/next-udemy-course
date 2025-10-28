import { ProductGrid, Title } from "@/components";
import { ProductCategory } from "@/interfaces";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{
    id: ProductCategory;
  }>;
}

const filterProductsByCategory = (categoryId: ProductCategory) => {
  const products = initialData.products;
  return products.filter((product) => product.gender === categoryId);
};

const categoriesTitleMap: Record<ProductCategory, string> = {
  kid: "Kids",
  men: "Men",
  women: "Women",
  unisex: "All",
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;

  if (!(id in categoriesTitleMap)) notFound();

  const products = filterProductsByCategory(id);

  return (
    <>
      <Title
        title={categoriesTitleMap[id]}
        subtitle={`${categoriesTitleMap[id]} products`}
      />

      <ProductGrid products={products} />
    </>
  );
}
