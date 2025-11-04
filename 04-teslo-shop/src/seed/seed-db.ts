import { PrismaClient } from "@/generated/prisma/client";
const prisma = new PrismaClient();

import { initialData } from "./seed";

async function main() {
  // 1. Borrar registros previos
  // await Promise.all( [
  await prisma.user.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  // ]);

  const { categories, products, users } = initialData;

  await prisma.user.createMany({
    data: users,
  });

  //  Categorias
  // {
  //   name: 'Shirt'
  // }
  const categoriesData = categories.map((name) => ({ name }));

  await prisma.category.createMany({
    data: categoriesData,
  });

  const categoriesDB = await prisma.category.findMany();

  interface Category {
    id: string;
    name: string;
  }

  type CategoriesMap = Record<string, string>;

  const categoriesMap: CategoriesMap = categoriesDB.reduce(
    (map: CategoriesMap, category: Category) => {
      map[category.name.toLowerCase()] = category.id;
      return map;
    },
    {} as CategoriesMap
  ); //<string=shirt, string=categoryID>

  // Productos

  products.forEach(async (product) => {
    const { type, images, ...rest } = product;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    });

    // Images
    const imagesData = images.map((image) => ({
      url: image,
      productId: dbProduct.id,
    }));

    await prisma.productImage.createMany({
      data: imagesData,
    });
  });

  console.log("Seed ejecutado correctamente");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
