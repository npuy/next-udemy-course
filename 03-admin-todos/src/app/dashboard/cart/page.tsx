import { ItemCard } from "@/shopping-cart/components/ItemCard";
import { cookies } from "next/headers";
import { type Product, products } from "@/products/data/products";
import { WidgetItem } from "@/components";

interface ProductsInCart {
  product: Product;
  quantity: number;
}

const getProductsInCart = (cart: {
  [id: string]: number;
}): ProductsInCart[] => {
  const productsInCart: ProductsInCart[] = [];
  for (const id in cart) {
    const product = products.find((p) => p.id === id);
    if (product) {
      productsInCart.push({ product, quantity: cart[id] });
    }
  }
  return productsInCart;
};

export default async function CartPage() {
  const cookieStore = await cookies();
  const cart = JSON.parse(cookieStore.get("cart")?.value || "{}") as {
    [id: string]: number;
  };

  const productsInCart = getProductsInCart(cart);

  const totalToPay = productsInCart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  return (
    <div>
      <h1 className="text-5xl">Shopping Cart</h1>
      <hr className="mb-2" />

      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-col gap-4 w-full sm:w-8/12">
          {productsInCart.map((prodInCart) => (
            <ItemCard key={prodInCart.product.id} {...prodInCart} />
          ))}
        </div>

        <div className="flex flex-col w-full sm:w-4/12">
          <WidgetItem title={"Total"}>
            <div className="mt-2 flex justify-center gap-4">
              <h3 className="text-3xl font-bold text-gray-700">
                ${(totalToPay * 1.15).toFixed(2)}
              </h3>
            </div>
            <span className="font-bold text-center text-gray-500">
              Tax: ${(totalToPay * 0.15).toFixed(2)}
            </span>
          </WidgetItem>
        </div>
      </div>
    </div>
  );
}
