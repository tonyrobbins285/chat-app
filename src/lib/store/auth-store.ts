import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  setSession: (session: string) => void;
  clearSession: () => void;
}

const getInitialData = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("accessToken");
};

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: getInitialData(),
  setSession: (session) => set({ accessToken: session }),
  clearSession: () => set({ accessToken: null }),
}));
