import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://beauty-survey.vercel.app";

export const metadata: Metadata = {
  title: "美容診断 | あなたの肌タイプに合ったアイテムをご提案",
  description:
    "肌質・悩みに答えるだけで、あなたにぴったりのスキンケア・メイク・ヘアケアアイテムを診断します。",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "美容診断 | あなたの肌タイプに合ったアイテムをご提案",
    description:
      "肌質・悩みに答えるだけで、あなたにぴったりのスキンケア・メイク・ヘアケアアイテムを診断します。",
    url: siteUrl,
    siteName: "美容診断",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "美容診断 | あなたの肌タイプに合ったアイテムをご提案",
    description:
      "肌質・悩みに答えるだけで、あなたにぴったりのスキンケア・メイク・ヘアケアアイテムを診断します。",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
