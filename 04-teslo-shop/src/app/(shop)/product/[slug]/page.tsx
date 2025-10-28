import {
  ProductMobileSlideshow,
  ProductSlideshow,
  QuantitySelector,
  SizeSelector,
} from "@/components";
import { titleFont } from "@/config/fonts";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getProductData = async (slug: string) => {
  return initialData.products.find((product) => product.slug === slug);
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await getProductData(slug);

  if (!product) notFound();

  return (
    <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">
      {/* Slideshow */}
      <div className="col-span-1 md:col-span-2">
        <ProductSlideshow
          images={product.images}
          title={product.title}
          className="hidden md:block"
        />
        <ProductMobileSlideshow
          images={product.images}
          title={product.title}
          className="block md:hidden"
        />
      </div>

      {/* Product details */}
      <div className="col-span-1 px-5">
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>
          {product.title}
        </h1>
        <p className="text-lg mb-5">${product.price.toFixed(2)}</p>

        {/* Size selector */}
        <SizeSelector
          selectedSize={product.sizes[1]}
          availableSizes={product.sizes}
        />

        {/* Quantity selector */}
        <QuantitySelector quantity={1} />

        {/* Button */}
        <button className="btn-primary my-5">Add to cart</button>

        {/* Description */}
        <h3 className="font-bold text-sm">Description</h3>
        <p className="font-light">{product.description}</p>
      </div>
    </div>
  );
}
