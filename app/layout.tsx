import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/layout/Sidebar";

const headlineFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sovereign Finance — Admin Terminal",
  description: "High-precision financial management dashboard for capital architects. Track balances, transactions, and insights.",
};

import Providers from "@/components/layout/Providers";
import CommandPalette from "@/components/layout/CommandPalette";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${headlineFont.variable} ${bodyFont.variable}`}>
        <Providers>
          <div className="app-shell">
            <Sidebar />
            <main className="main-content">
              {children}
            </main>
          </div>
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}
