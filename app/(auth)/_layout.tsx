import { Stack } from 'expo-router';
import colors from '@/constants/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
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
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: 'Create Account',
          headerShown: false,
        }}
      />
    </Stack>
  );
}