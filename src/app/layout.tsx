import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloProvider } from './ApolloProvider';
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AmplifyProvider } from '@/context/AmplifyContext';

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
      <body className={inter.className}>
        <AmplifyProvider>
          <ApolloProvider>
            <CartProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
            </CartProvider>
          </ApolloProvider>
        </AmplifyProvider>
      </body>
    </html>
  );
}
