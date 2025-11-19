import { TRPCReactProvider } from "@/trpc/client";
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Next Shopify",
  description: "Next.js Shopify Storefront",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col antialiased">
        <TRPCReactProvider>
          <Header />
          <main className="grow">{children}</main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
