import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptCraft Studio - AI Text Assistant",
  description: "Next.js, Express, Neon DB, and OpenRouter Full-Stack AI Assistant",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0B1120] text-[#F8FAFC] min-h-[100dvh] overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
