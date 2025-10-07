"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { useAppSelector } from "@/store";
import {
  addOne,
  initCounterState,
  subtractOne,
} from "@/store/counter/counterSlice";

interface Props {
  value?: number;
}

export interface CounterResponse {
  method: string;
  count: number;
}

const getApiCounter = async (): Promise<CounterResponse> => {
  const data = await fetch("/api/counter").then((res) => res.json());

  return data;
};

export const CartCounter = ({ value = 0 }: Props) => {
  // const [counter, setCounter] = useState(value);
  const counter = useAppSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  const handleIncrement = () => {
    dispatch(addOne());
  };
  const handleDecrement = () => {
    dispatch(subtractOne());
  };

  // useEffect(() => {
  //   dispatch(initCounterState(value));
  // }, [dispatch, value]);

  useEffect(() => {
    getApiCounter().then(({ count }) => dispatch(initCounterState(count)));
  }, [dispatch]);

  return (
    <>
      <span className="text-9xl">{counter}</span>

      <div className="flex">
        <button
          className="flex items-center justify-center p-2 rounded-xl bg-gray-900 text-white hover:bg-gray-600 transition-all w-[100px] mr-2"
          onClick={handleIncrement}
        >
          +1
        </button>
        <button
          className="flex items-center justify-center p-2 rounded-xl bg-gray-900 text-white hover:bg-gray-600 transition-all w-[100px] mr-2"
          onClick={handleDecrement}
        >
          -1
        </button>
      </div>
    </>
  );
};
