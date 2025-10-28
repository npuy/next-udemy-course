import { ProductGrid, Title } from "@/components";
import { initialData } from "@/seed/seed";

const products = initialData.products;

export default function HomePage() {
  return (
    <>
      <Title title={"Shop"} subtitle="All products" />

      <ProductGrid products={products} />
    </>
  );
}
