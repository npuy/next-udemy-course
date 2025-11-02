"use client";

import Link from "next/link";
import { IoCartOutline, IoSearchOutline } from "react-icons/io5";

import { titleFont } from "@/config/fonts";
import { useCartStore, useUIStore } from "@/store";

export const TopMenu = () => {
  const openSidebar = useUIStore((state) => state.openSidebar);
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());

  return (
    <nav className="flex px-5 justify-between items-center w-full">
      {/* Logo */}
      <div>
        <Link href={"/"}>
          <span className={`${titleFont.className} antialiased font-bold`}>
            Teslo
          </span>
          <span> | Shop</span>
        </Link>
      </div>

      {/* Center menu */}
      <div className="hidden sm:block">
        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/gender/men"}
        >
          Men
        </Link>

        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/gender/women"}
        >
          Women
        </Link>

        <Link
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
          href={"/gender/kid"}
        >
          Kids
        </Link>
      </div>

      {/* Right menu */}
      <div className="flex items-center">
        <Link href={"/search"} className="mx-2">
          <IoSearchOutline className="w-5 h-5" />
        </Link>

        <Link
          href={totalItemsInCart === 0 ? "/empty" : "/cart"}
          className="mx-2"
        >
          <div className="relative">
            <span className="absolute text-xs rounded-full px-1 font-bold -top-2 bg-blue-700 text-white -right-2">
              {totalItemsInCart === 0 ? "" : totalItemsInCart}
            </span>
            <IoCartOutline className="w-5 h-5" />
          </div>
        </Link>

        <button
          onClick={openSidebar}
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Menu
        </button>
      </div>
    </nav>
  );
};
