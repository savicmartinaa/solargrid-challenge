"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (user.role === "viewer") {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!user || user.role === "viewer") {
    return null;
  }

  return <>{children}</>;
}
