import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Company Simulator — Autonomous Software Factory",
  description:
    "Transform any product idea into a complete, runnable application through collaboration between 12 specialized AI agents that debate, fight, and build together.",
  keywords: [
    "AI",
    "multi-agent",
    "software factory",
    "autonomous",
    "code generation",
    "hackathon",
  ],
  openGraph: {
    title: "AI Company Simulator",
    description: "Watch AI agents fight and build your software idea.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
