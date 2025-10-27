import { Sidebar, TopMenu } from "@/components";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <TopMenu />
      <Sidebar />

      <div className="px-5 sm:px-10">{children}</div>
    </main>
  );
}
