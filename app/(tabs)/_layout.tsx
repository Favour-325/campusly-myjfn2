import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Calendar, Bell, MessageSquare, User, BookOpen } from 'lucide-react-native';
import colors from '@/constants/colors';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontWeight: '600',
          color: '#FFFFFF',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="timetable"
        options={{
          title: 'Timetable',
          tabBarIcon: ({ color }) => <Calendar size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="study-materials"
        options={{
          title: 'Study Materials',
          tabBarIcon: ({ color }) => <BookOpen size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <Bell size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color }) => <MessageSquare size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}