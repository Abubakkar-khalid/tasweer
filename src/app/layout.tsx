import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import { ProductProvider } from "@/components/ProductContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "AURA | Premium Essentials",
  description: "Minimalist, premium essentials designed for the modern lifestyle.",
};

import { AuthProvider } from "@/components/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <ProductProvider>
            <CartProvider>
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </CartProvider>
          </ProductProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
