import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  level: string;
  phone?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isEmailVerified: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    userData: Omit<User, "id"> & { password: string }
  ) => Promise<boolean>;
  logout: () => void;
  completeOnboarding: () => void;
  verifyEmail: () => Promise<boolean>;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isOnboarded: false,
      isEmailVerified: false,

      login: async (email, password) => {
        // In a real app, this would make an API call
        // For this MVP, we'll simulate a successful login with mock data
        if (email && password) {
          // Mock successful login
          set({
            isAuthenticated: true,
            user: {
              id: "12345",
              name: "John Doe",
              email: email,
              studentId: "STU123456",
              department: "Computer Science",
              level: "300 Level",
            },
            isEmailVerified: true,
          });
          return true;
        }
        return false;
      },

      register: async (userData) => {
        // In a real app, this would make an API call
        // For this MVP, we'll simulate a successful registration
        if (userData.email && userData.password) {
          // Mock successful registration
          set({
            isAuthenticated: true,
            isEmailVerified: false,
            user: {
              id: "12345",
              name: userData.name,
              email: userData.email,
              studentId: userData.studentId,
              department: userData.department,
              level: userData.level,
            },
          });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false, user: null });
      },

      completeOnboarding: () => {
        set({ isOnboarded: true });
      },

      verifyEmail: async () => {
        // In a real app, this would make an API call
        // For this MVP, we'll simulate a successful verification
        set({ isEmailVerified: true });
        return true;
      },

      updateUserProfile: async (userData) => {
        const currentUser = get().user;
        if (!currentUser) return false;

        set({
          user: {
            ...currentUser,
            ...userData,
          },
        });

        return true;
      },
    }),
    {
      name: "campusly-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
