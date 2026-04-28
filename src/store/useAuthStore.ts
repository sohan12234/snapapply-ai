import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  user: any | null;
  setAuth: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Initialize with Puter's current auth state if available
  const checkAuth = () => {
    try {
      return typeof window !== 'undefined' && window.puter?.auth?.isSignedIn();
    } catch {
      return false;
    }
  };

  return {
    isLoggedIn: checkAuth(),
    user: null,
    setAuth: (user) => set({ isLoggedIn: true, user }),
    logout: () => {
      window.puter.auth.signOut();
      set({ isLoggedIn: false, user: null });
    },
  };
});
