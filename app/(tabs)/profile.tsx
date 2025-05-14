import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Link } from 'expo-router';
import {
  User,
  Mail,
  BookOpen,
  GraduationCap,
  Settings,
  HelpCircle,
  Bell,
  Shield,
  LogOut
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAuthStore } from '@/stores/auth-store';

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>{user?.name || 'Student Name'}</Text>
          <Text style={styles.studentId}>{user?.studentId || 'STU123456'}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Mail size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user?.email || 'student@university.edu'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <BookOpen size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>{user?.department || 'Computer Science'}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <GraduationCap size={20} color={colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Level</Text>
                <Text style={styles.infoValue}>{user?.level || '300 Level'}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingsCard}>
            <Link href="/settings/account" asChild>
              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsIconContainer}>
                  <Settings size={20} color={colors.primary} />
                </View>
                <View style={styles.settingsContent}>
                  <Text style={styles.settingsLabel}>Account Settings</Text>
                </View>
                <View style={styles.settingsArrow} />
              </TouchableOpacity>
            </Link>

            <View style={styles.divider} />

            <Link href="/settings/notifications" asChild>
              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsIconContainer}>
                  <Bell size={20} color={colors.primary} />
                </View>
                <View style={styles.settingsContent}>
                  <Text style={styles.settingsLabel}>Notifications</Text>
                </View>
                <View style={styles.settingsArrow} />
              </TouchableOpacity>
            </Link>

            <View style={styles.divider} />

            <Link href="/settings/privacy" asChild>
              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsIconContainer}>
                  <Shield size={20} color={colors.primary} />
                </View>
                <View style={styles.settingsContent}>
                  <Text style={styles.settingsLabel}>Privacy & Security</Text>
                </View>
                <View style={styles.settingsArrow} />
              </TouchableOpacity>
            </Link>

            <View style={styles.divider} />

            <Link href="/settings/help" asChild>
              <TouchableOpacity style={styles.settingsItem}>
                <View style={styles.settingsIconContainer}>
                  <HelpCircle size={20} color={colors.primary} />
                </View>
                <View style={styles.settingsContent}>
                  <Text style={styles.settingsLabel}>Help & Support</Text>
                </View>
                <View style={styles.settingsArrow} />
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={20} color="#FFF" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Campusly v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  editButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '500',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: colors.textLight,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingsContent: {
    flex: 1,
  },
  settingsLabel: {
    fontSize: 16,
    color: colors.text,
  },
  settingsArrow: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.textLight,
    transform: [{ rotate: '45deg' }],
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  logoutButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 16,
  },
});