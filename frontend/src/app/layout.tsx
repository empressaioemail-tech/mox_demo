import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mox Demo",
  description: "Adaptive surface demo for Mox — Nelray Blvd redevelopment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
