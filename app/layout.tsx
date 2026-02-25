import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Silver Lantern - Habit Tracker",
  description: "Simple habit tracker to build better daily routines",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
