import { authenticatedFetch } from "@/lib/auth/client/authenticated-fetch";
import type { ApiResponse } from "./contracts";

export async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await authenticatedFetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const result = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (!response.ok || !result?.success) {
    throw new Error(
      result && !result.success
        ? result.error.message
        : "The request could not be completed.",
    );
  }

  return result.data;
}
