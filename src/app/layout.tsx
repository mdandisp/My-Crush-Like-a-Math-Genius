import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Game Kuis Kalkulus: My Crush Like A Math Genius",
  description: "Tingkatkan kemampuan matematika dan kalkulus Anda melalui game kuis interaktif yang seru dan menantang! Raih peringkat teratas dan taklukkan setiap soal.",
  keywords: "kuis kalkulus, belajar matematika, game edukasi matematika, my crush like a math genius, latihan kalkulus",
  authors: [{ name: "Kelompok 6" }],
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
