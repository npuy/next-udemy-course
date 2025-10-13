import { FavoritesGrid } from "@/pokemons";

export default async function FavoritePage() {
  return (
    <div className="flex flex-col">
      <span className="text-5xl my-2">
        Favorites <small className="text-blue-500">from state</small>
      </span>

      <FavoritesGrid />
    </div>
  );
}
