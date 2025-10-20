import "./globals.css";
import "@/lib/fontawesome";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/ProductContext";
import { AuthProvider } from "@/context/AuthContext";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="vi" suppressHydrationWarning>
        <body>
          <AuthProvider>
            <CartProvider>
              <div>
                <Header />
                <main>{children}</main>
                <Footer />
              </div>
            </CartProvider>
          </AuthProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
