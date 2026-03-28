import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "PlanDrop — Group plans, first come first served",
  description:
    "Browse a live pool of AI-curated outings for your crew. Claim one before it’s gone — then share the link and go.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-white font-sans text-base text-zinc-900 antialiased [font-feature-settings:'kern'_1,'liga'_1]">
        {children}
      </body>
    </html>
  );
}
