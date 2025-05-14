import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { useAuthStore } from "@/stores/auth-store";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ErrorBoundary } from "./error-boundary";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ErrorBoundary>
        <RootLayoutNav />
      </ErrorBoundary>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isOnboarded, isEmailVerified } = useAuthStore();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inOnboarding = segments[0] === "onboarding";
    const inVerification = segments[0] === "verify-email";

    // If the user is not onboarded, redirect to onboarding
    if (!isOnboarded && !inOnboarding) {
      router.replace("/onboarding");
      return;
    }

    // If the user is onboarded but not authenticated, redirect to login
    if (isOnboarded && !isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/login");
      return;
    }

    // If the user is authenticated but email not verified, redirect to verification
    if (isAuthenticated && !isEmailVerified && !inVerification && segments[0] !== "(tabs)") {
      router.replace("/verify-email");
      return;
    }

    // If the user is authenticated and email verified but still in auth group or onboarding, redirect to home
    if (isAuthenticated && isEmailVerified && (inAuthGroup || inOnboarding || inVerification)) {
      router.replace("/(tabs)");
      return;
    }
  }, [isAuthenticated, isOnboarded, isEmailVerified, segments]);

  return (
    <Stack
      screenOptions={{
        headerBackTitle: "Back",
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '600',
          color: '#FFFFFF',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      <Stack.Screen name="verify-email" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="announcement/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="message/[id]" options={{ headerShown: true }} />
      <Stack.Screen name="settings/account" options={{ headerShown: true }} />
      <Stack.Screen name="settings/notifications" options={{ headerShown: true }} />
      <Stack.Screen name="settings/privacy" options={{ headerShown: true }} />
      <Stack.Screen name="settings/help" options={{ headerShown: true }} />
    </Stack>
  );
}

import colors from "@/constants/colors";