"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Info,
  LogIn,
  UserPlus,
  Trophy,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface MobileBottomNavProps {
  isAuthenticated: boolean;
}

const unauthenticatedItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/auth/login", label: "Log In", icon: LogIn },
  { href: "/auth/sign-up", label: "Sign Up", icon: UserPlus },
];

const authenticatedItems = [
  { href: "/leagues", label: "Leagues", icon: Trophy },
  { href: "/account", label: "Account", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function MobileBottomNav({ isAuthenticated }: MobileBottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  const items = isAuthenticated ? authenticatedItems : unauthenticatedItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        {isAuthenticated && (
          <button
            onClick={handleSignOut}
            className="flex flex-1 flex-col items-center gap-1 py-3 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>
    </nav>
  );
}
