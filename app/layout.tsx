import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { AuthListener } from "@/components/nav/auth-listener";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: {
    default: "FplTablePro — Fantasy Premier League Analytics & League Tracker",
    template: "%s | FplTablePro",
  },
  description:
    "Track your Fantasy Premier League mini-league standings, analyse gameweek history, compare FPL managers, and unlock awards. Free FPL companion for serious fantasy football managers.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthListener />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
