import { useAuthStore } from "@/lib/store/auth-store";

export function useSetSession() {
  return useAuthStore((state) => state.setSession);
}
