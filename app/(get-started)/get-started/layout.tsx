import type { Metadata } from "next";
import { LogoutButton } from "@/components/logout-button";
import { CheckAccountButton } from "./_components/check-account-button";

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
      <header className="flex items-center justify-end gap-2 px-4 sm:px-6 py-4">
        <CheckAccountButton />
        <LogoutButton />
      </header>
      {children}
    </>
  );
}
