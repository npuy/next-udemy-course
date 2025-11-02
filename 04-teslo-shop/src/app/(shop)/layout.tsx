import { Footer, Sidebar, TopMenu } from "@/components";
import { Hydration } from "@/store";

export default function ShopLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Hydration />
      <TopMenu />
      <Sidebar />

      <div className="sm:px-10">{children}</div>

      <Footer />
    </main>
  );
}
