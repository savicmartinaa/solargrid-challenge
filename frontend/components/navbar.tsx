"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";

const AUTH_BUTTON_CLASS =
  "border-emerald-900 bg-white text-emerald-900 shadow-sm hover:border-emerald-950 hover:bg-emerald-50 hover:text-emerald-950 hover:shadow-md";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="border-b border-emerald-800 bg-emerald-700 text-white">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">
          SolarGrid
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-emerald-50">{user.name}</span>
              <Button
                variant="outline"
                size="sm"
                className={AUTH_BUTTON_CLASS}
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className={AUTH_BUTTON_CLASS}
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
