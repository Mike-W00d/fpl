import { Suspense } from "react";
import { NavWrapper } from "@/components/nav/nav-wrapper";
import { NavSkeleton } from "@/components/nav/nav-skeleton";

export default function NavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Suspense fallback={<NavSkeleton />}>
        <NavWrapper />
      </Suspense>
      <main className="pb-16 md:pb-0">{children}</main>
    </>
  );
}
