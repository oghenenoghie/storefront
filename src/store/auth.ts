import { create } from "zustand";
import { User } from "@/types";
import { authApi } from "@/lib/api";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  login: async (username, password) => {
    set({ isLoading: true });
    const { data } = await authApi.login(username, password);
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    const me = await authApi.me();
    set({ user: me.data, isLoading: false });
  },
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null });
  },
  fetchMe: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;
    try {
      const { data } = await authApi.me();
      set({ user: data });
    } catch {
      // token expired
    }
  },
}));
