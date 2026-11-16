import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NeonMind - AI Text Assistant",
  description: "Next.js, Express, Neon DB, and OpenAI Full-Stack AI Assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100">
        {children}
      </body>
    </html>
  );
}
