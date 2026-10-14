"use client";

import { type AuthUser, useAuthStore } from "@/lib/store/auth-store";
import { useEffect } from "react";

const ACCESS_TOKEN_REFRESH_INTERVAL_MS = 10 * 60 * 1000;

interface AuthProviderProps {
  children: React.ReactNode;
  initialUser: AuthUser;
}

export function AuthProvider({ children, initialUser }: AuthProviderProps) {
  const storeSetUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    storeSetUser(initialUser);
  }, [initialUser, storeSetUser]);

  useEffect(() => {
    if (!initialUser) {
      return;
    }

    let refreshInFlight = false;
    let lastRefreshAt = Date.now();

    async function refreshSession() {
      if (refreshInFlight) {
        return;
      }

      refreshInFlight = true;

      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          lastRefreshAt = Date.now();
        } else if (response.status === 401) {
          storeSetUser(null);
        }
      } catch (error) {
        console.error("Unable to refresh authentication session.", error);
      } finally {
        refreshInFlight = false;
      }
    }

    const interval = window.setInterval(
      refreshSession,
      ACCESS_TOKEN_REFRESH_INTERVAL_MS,
    );

    function handleVisibilityChange() {
      if (
        document.visibilityState === "visible" &&
        Date.now() - lastRefreshAt >= ACCESS_TOKEN_REFRESH_INTERVAL_MS
      ) {
        void refreshSession();
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [initialUser, storeSetUser]);

  return <>{children}</>;
}
