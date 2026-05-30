import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import BottomNavigation from "@/components/navigation/BottomNavigation";
import RouteMemory from "@/components/navigation/RouteMemory";

export const metadata: Metadata = {
  title: "OHMS DBX",
  description: "Ohio Music Scene Database",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <RouteMemory />
        </Suspense>

        <main className="app-shell">{children}</main>
        <BottomNavigation />
      </body>
    </html>
  );
}