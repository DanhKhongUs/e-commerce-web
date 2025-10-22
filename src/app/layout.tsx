import "./globals.css";
import { Outfit } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { CartProvider } from "@/context/ProductContext";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
  title: "E-Commerce. - Shop smarter",
  description: "E-Commerce. - Shop smarter",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="vi" suppressHydrationWarning>
        <body className={`${outfit.className} antialiased`}>
          <CartProvider>{children}</CartProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
