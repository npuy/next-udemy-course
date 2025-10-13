"use client";

import { useState } from "react";

import { useAppSelector } from "@/store";
import { PokemonGrid } from "./PokemonGrid";

export const FavoritesGrid = () => {
  const pokemonsDic = useAppSelector((state) => state.pokemons);

  const pokemonsArray = Object.values(pokemonsDic);

  const [pokemons] = useState(pokemonsArray);

  return <PokemonGrid pokemons={pokemons} />;
};
