import type { Metadata } from "next";
import { LogoutButton } from "@/components/logout-button";

export const metadata: Metadata = {
  title: "Get Started — FPL",
  description: "Link your FPL account to get started",
};

export default function GetStartedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <header className="flex items-center justify-end px-4 sm:px-6 py-4">
        <LogoutButton />
      </header>
      {children}
    </>
  );
}
