import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { ApolloProvider } from "./ApolloProvider";
import { CartProvider } from "@/context/CartContext";
import PageWrapper from "@/components/PageWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Three Girls and a Wick",
  description: "Handcrafted candles, soaps, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} font-body`}>
        <ApolloProvider>
          <CartProvider>
            <PageWrapper>
              {children}
            </PageWrapper>
          </CartProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
