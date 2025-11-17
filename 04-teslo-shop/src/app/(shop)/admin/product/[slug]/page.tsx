import { getCategories, getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { notFound } from "next/navigation";
import { ProductForm } from "./ui/ProductForm";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}
export default async function ProductPage({ params }: Props) {
  const slug = (await params).slug;

  const [product, categories] = await Promise.all([
    getProductBySlug(slug),
    getCategories(),
  ]);

  if (!product) notFound();

  const title = slug === "new" ? "New product" : "Edit product";

  return (
    <>
      <Title title={title} />

      <ProductForm product={product} categories={categories} />
    </>
  );
}
