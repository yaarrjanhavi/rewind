import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "REWIND - AI Interactive Historical Music Time Machine",
  description: "Travel back in time to explore historical events, music snapshots, cultural moments, and AI-generated capsules from 1900 to present day, styled like a 90s vintage operating system.",
  keywords: ["music time machine", "retro music history", "historical music trends", "AI historical narrative", "Windows 95 music website"],
  authors: [{ name: "Antigravity Team" }],
  icons: {
    icon: "/favicon.png",
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#1A2340"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
