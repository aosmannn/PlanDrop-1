import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlanDrop",
  description:
    "Claim a pre-generated group plan from a live pool — first come, first served.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
