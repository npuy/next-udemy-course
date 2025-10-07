import { PokemonGrid } from "@/pokemons";

export default async function PokemonsPage() {
  return (
    <div className="flex flex-col">
      <span className="text-5xl my-2">
        Favorites <small className="text-blue-500">from state</small>
      </span>

      <PokemonGrid pokemons={[]} />
    </div>
  );
}
