import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RenW - AI Influencer Workspace",
  description: "Create, manage, and publish content for your AI influencers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
