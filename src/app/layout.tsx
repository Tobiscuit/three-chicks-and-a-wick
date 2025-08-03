import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloProvider } from './ApolloProvider';
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Amplify, ResourcesConfig } from 'aws-amplify';
import outputs from '@root/amplify_outputs.json';

// Define a comprehensive type for the Amplify outputs to ensure type safety.
// This handles cases where the custom API config may not be present during build.
type AppAmplifyOutputs = ResourcesConfig & {
  custom?: {
    API?: Record<
      string,
      {
        endpoint: string;
        region: string;
        apiName: string;
      }
    >;
  };
};

const typedOutputs: AppAmplifyOutputs = outputs;

const config: ResourcesConfig = { ...typedOutputs };

// If a custom API configuration exists, merge it into the main API config.
if (typedOutputs.custom?.API) {
  config.API = {
    ...typedOutputs.API,
    REST: {
      ...typedOutputs.API?.REST,
      ...typedOutputs.custom.API,
    },
  };
}

Amplify.configure(config, { ssr: true });


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
        <ApolloProvider>
          <CartProvider>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </CartProvider>
        </ApolloProvider>
      </body>
    </html>
  );
}
