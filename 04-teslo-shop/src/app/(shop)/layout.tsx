import { Footer, Sidebar, TopMenu } from "@/components";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <TopMenu />
      <Sidebar />

      <div className="sm:px-10">{children}</div>

      <Footer />
    </main>
  );
}
