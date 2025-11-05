"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { IoAlertCircleOutline } from "react-icons/io5";

import { authenticate } from "@/actions";

export const LoginForm = () => {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );
  useEffect(() => {
    if (errorMessage === "Success") {
      // redireccionar
      window.location.replace("/");
    }
  }, [errorMessage]);

  return (
    <form action={formAction} className="flex flex-col">
      <label htmlFor="email">Email</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
        name="email"
      />

      <label htmlFor="email">Password</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="password"
        name="password"
      />
      {errorMessage !== "Success" && errorMessage && (
        <div
          className="flex h-8 items-end space-x-1 py-2"
          aria-live="polite"
          aria-atomic="true"
        >
          <>
            <IoAlertCircleOutline className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">{errorMessage}</p>
          </>
        </div>
      )}

      <button type="submit" aria-disabled={isPending} className="btn-primary">
        Login
      </button>

      {/* divisor line */}
      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500"></div>
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500"></div>
      </div>

      <Link href="/auth/register" className="btn-secondary text-center">
        Create new account
      </Link>
    </form>
  );
};
