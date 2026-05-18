import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shriya Kotala — AI/ML Engineer & Data Scientist",
  description:
    "Portfolio of Shriya Kotala, MS Computer Science graduate (GSU, GPA 3.99) specializing in AI/ML Engineering, Computer Vision, and Data Science.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
