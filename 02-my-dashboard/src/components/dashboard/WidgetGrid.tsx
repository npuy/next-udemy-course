"use client";

import { useAppSelector } from "@/store";
import { SimpleWidget } from "./SimpleWidget";
import { IoCart } from "react-icons/io5";

export const WidgetGrid = () => {
  const count = useAppSelector((state) => state.counter.count);

  return (
    <div className="flex flex-wrap p-2 items-center justify-center">
      <SimpleWidget
        title={count.toString()}
        label="Counter"
        subTitle="Shopping cart"
        href="/dashboard/counter"
        icon={<IoCart size={40} />}
      />
    </div>
  );
};
