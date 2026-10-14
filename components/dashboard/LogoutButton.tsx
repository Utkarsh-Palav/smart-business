"use client";

import { LogOut, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useAuthStore } from "@/lib/store/auth-store";

type LogoutButtonProps = {
  iconOnly?: boolean;
};

export function LogoutButton({ iconOnly = false }: LogoutButtonProps) {
  const router = useRouter();
  const clearUser = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result?.error?.message || "Unable to log out. Please try again.",
        );
      }

      clearUser();
      router.replace("/login");
      router.refresh();
    } catch (logoutError) {
      setError(
        logoutError instanceof Error
          ? logoutError.message
          : "Unable to log out. Please try again.",
      );
      setIsLoggingOut(false);
    }
  }

  return (
    <div className="border-t p-2">
      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`flex items-center rounded-md py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60 ${
          iconOnly ? "justify-center px-2" : "w-full gap-2 px-3"
        }`}
        aria-label={iconOnly ? "Log out" : undefined}
        title={iconOnly ? "Log out" : undefined}
        aria-describedby={error ? "logout-error" : undefined}
      >
        {isLoggingOut ? (
          <LoaderCircle size={18} className="animate-spin" />
        ) : (
          <LogOut size={18} />
        )}
        {!iconOnly && (isLoggingOut ? "Logging out..." : "Log out")}
      </button>
      {error ? (
        <p id="logout-error" className="mt-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
