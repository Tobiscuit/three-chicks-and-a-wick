import type { Metadata } from "next";
import { Nunito, Poppins } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
  weight: ["700", "900"],
});

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: 'Three Chicks and a Wick',
  description: 'Handcrafted candles and crafts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${nunito.variable} ${poppins.variable}`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
