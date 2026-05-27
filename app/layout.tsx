import type { Metadata } from "next";
import "./globals.css";
import BottomNavigation from "@/components/navigation/BottomNavigation";

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
        <main className="app-shell">{children}</main>
        <BottomNavigation />
      </body>
    </html>
  );
}