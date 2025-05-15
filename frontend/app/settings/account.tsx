import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Switch,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Camera, Edit2, ChevronRight, Save } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAuthStore } from '@/stores/auth-store';

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { user, updateUserProfile } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const handleSaveChanges = async () => {
    setIsLoading(true);
    
    try {
      // In a real app, this would make an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await updateUserProfile({ name, email, phone });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Account Settings',
          headerTintColor: '#FFFFFF',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => {
                if (isEditing) {
                  handleSaveChanges();
                } else {
                  setIsEditing(true);
                }
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : isEditing ? (
                <Save size={20} color="#FFFFFF" />
              ) : (
                <Edit2 size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          ),
        }}
      />
      
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop' }}
              style={styles.profileImage}
            />
            
            <TouchableOpacity style={styles.cameraButton}>
              <Camera size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.textLight}
                />
              ) : (
                <Text style={styles.value}>{user?.name}</Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  placeholderTextColor={colors.textLight}
                />
              ) : (
                <Text style={styles.value}>{user?.email}</Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Phone Number</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                  placeholderTextColor={colors.textLight}
                />
              ) : (
                <Text style={styles.value}>{phone || 'Not set'}</Text>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Student ID</Text>
              <Text style={styles.value}>{user?.studentId}</Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Department</Text>
              <Text style={styles.value}>{user?.department}</Text>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Level</Text>
              <Text style={styles.value}>{user?.level}</Text>
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Change Password</Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.menuItemText}>Two-Factor Authentication</Text>
                <Text style={styles.menuItemDescription}>
                  Add an extra layer of security to your account
                </Text>
              </View>
              <Switch
                value={twoFactorEnabled}
                onValueChange={setTwoFactorEnabled}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={twoFactorEnabled ? colors.primary : '#FFFFFF'}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Linked Accounts</Text>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Google</Text>
                <Text style={styles.menuItemDescription}>
                  Not connected
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Microsoft</Text>
                <Text style={styles.menuItemDescription}>
                  Not connected
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.dangerButton}>
            <Text style={styles.dangerButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerButton: {
    marginRight: 16,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: 24,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: colors.secondary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.card,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: colors.text,
  },
  input: {
    backgroundColor: '#F0F2F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
  },
  menuItemDescription: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
  },
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  switchItemContent: {
    flex: 1,
    marginRight: 8,
  },
  dangerButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  dangerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});