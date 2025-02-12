import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProviderWrapper from "./components/SessionProviderWrapper";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PDF-Chat",
  description: "PDF-Chat",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}
