import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Switch,
  TouchableOpacity,
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';

export default function PrivacySecurityScreen() {
  const [settings, setSettings] = useState({
    activityStatus: true,
    profileVisibility: 'Everyone',
    locationServices: false,
    dataCollection: true,
    biometricLogin: false,
    rememberLogin: true,
    autoLogout: true,
  });
  
  const updateSetting = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Privacy & Security',
          headerTintColor: '#FFFFFF',
        }}
      />
      
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Privacy Settings</Text>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.switchItemText}>Activity Status</Text>
                <Text style={styles.switchItemDescription}>
                  Show when you're active on the app
                </Text>
              </View>
              <Switch
                value={settings.activityStatus}
                onValueChange={(value) => updateSetting('activityStatus', value)}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={settings.activityStatus ? colors.primary : '#FFFFFF'}
              />
            </View>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Profile Visibility</Text>
                <Text style={styles.menuItemDescription}>
                  {settings.profileVisibility}
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.switchItemText}>Location Services</Text>
                <Text style={styles.switchItemDescription}>
                  Allow app to access your location
                </Text>
              </View>
              <Switch
                value={settings.locationServices}
                onValueChange={(value) => updateSetting('locationServices', value)}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={settings.locationServices ? colors.primary : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.switchItemText}>Data Collection</Text>
                <Text style={styles.switchItemDescription}>
                  Allow app to collect usage data for improvements
                </Text>
              </View>
              <Switch
                value={settings.dataCollection}
                onValueChange={(value) => updateSetting('dataCollection', value)}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={settings.dataCollection ? colors.primary : '#FFFFFF'}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security Settings</Text>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.switchItemText}>Biometric Login</Text>
                <Text style={styles.switchItemDescription}>
                  Use fingerprint or face recognition to login
                </Text>
              </View>
              <Switch
                value={settings.biometricLogin}
                onValueChange={(value) => updateSetting('biometricLogin', value)}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={settings.biometricLogin ? colors.primary : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.switchItemText}>Remember Login</Text>
                <Text style={styles.switchItemDescription}>
                  Stay logged in on this device
                </Text>
              </View>
              <Switch
                value={settings.rememberLogin}
                onValueChange={(value) => updateSetting('rememberLogin', value)}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={settings.rememberLogin ? colors.primary : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.switchItemText}>Auto Logout</Text>
                <Text style={styles.switchItemDescription}>
                  Automatically logout after 30 minutes of inactivity
                </Text>
              </View>
              <Switch
                value={settings.autoLogout}
                onValueChange={(value) => updateSetting('autoLogout', value)}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={settings.autoLogout ? colors.primary : '#FFFFFF'}
              />
            </View>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Login History</Text>
                <Text style={styles.menuItemDescription}>
                  View recent login activity
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Data Management</Text>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Download Your Data</Text>
                <Text style={styles.menuItemDescription}>
                  Get a copy of your personal data
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemContent}>
                <Text style={styles.menuItemText}>Clear Cache</Text>
                <Text style={styles.menuItemDescription}>
                  Clear temporary data stored on your device
                </Text>
              </View>
              <ChevronRight size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity style={styles.privacyButton}>
            <Text style={styles.privacyButtonText}>View Privacy Policy</Text>
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
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
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
  switchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  switchItemContent: {
    flex: 1,
    marginRight: 8,
  },
  switchItemText: {
    fontSize: 16,
    color: colors.text,
  },
  switchItemDescription: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 2,
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
  privacyButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  privacyButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});