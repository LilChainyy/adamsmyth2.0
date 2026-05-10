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

export const metadata: Metadata = {
  title: {
    default: "AdamsMyth — Understand what you own",
    template: "%s | AdamsMyth",
  },
  description:
    "An AI learning assistant that helps you make sense of your investment portfolio — without telling you what to do.",
  metadataBase: new URL("https://adamsmyth.com"),
  openGraph: {
    title: "AdamsMyth — Understand what you own",
    description:
      "An AI learning assistant that helps you make sense of your investment portfolio — without telling you what to do.",
    siteName: "AdamsMyth",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AdamsMyth — Understand what you own",
    description:
      "An AI learning assistant that helps you make sense of your investment portfolio.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
