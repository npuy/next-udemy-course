import type { Metadata } from "next";
import { geistMono, geistSans } from "@/config/fonts";

import "./globals.css";
import { Provider } from "@/components";

export const metadata: Metadata = {
  title: {
    default: "Teslo | Shop",
    template: "%s - Teslo | Shop",
  },
  description: "The best shop in the universe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
