import { Navbar } from "@/components";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center p-24">
        <span className="text-lg">Hello World!</span>
        {children}
      </div>
    </>
  );
}
