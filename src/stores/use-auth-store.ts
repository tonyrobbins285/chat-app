import { create } from "zustand";

interface AuthState {
  accessToken: string;
  setSession: (session: string) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: localStorage.getItem("accessToken") || "",
  setSession: (session) => set({ accessToken: session }),
  clearSession: () => set({ accessToken: "" }),
}));
