import { Suspense } from "react";
import Header from "@/app/components/layouts/Header";
import Footer from "@/app/components/layouts/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <div className="min-h-screen">{children}</div>
      </Suspense>
      <Footer />
    </>
  );
}
