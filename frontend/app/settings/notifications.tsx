import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  Switch,
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import colors from '@/constants/colors';

export default function NotificationSettingsScreen() {
  const [settings, setSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    announcements: true,
    messages: true,
    grades: true,
    events: true,
    reminders: true,
    marketing: false,
    sound: true,
    vibration: true,
  });
  
  const updateSetting = (key: keyof typeof settings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Notification Settings',
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
            <Text style={styles.sectionTitle}>Notification Channels</Text>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.switchItemText}>Push Notifications</Text>
                <Text style={styles.switchItemDescription}>
                  Receive notifications on your device
                </Text>
              </View>
              <Switch
                value={settings.pushEnabled}
                onValueChange={(value) => updateSetting('pushEnabled', value)}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={settings.pushEnabled ? colors.primary : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.switchItemText}>Email Notifications</Text>
                <Text style={styles.switchItemDescription}>
                  Receive notifications via email
                </Text>
              </View>
              <Switch
                value={settings.emailEnabled}
                onValueChange={(value) => updateSetting('emailEnabled', value)}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={settings.emailEnabled ? colors.primary : '#FFFFFF'}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Types</Text>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.switchItemText}>Announcements</Text>
                <Text style={styles.switchItemDescription}>
                  Campus-wide and department announcements
                </Text>
              </View>
              <Switch
                value={settings.announcements}
                onValueChange={(value) => updateSetting('announcements', value)}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={settings.announcements ? colors.primary : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.switchItemText}>Messages</Text>
                <Text style={styles.switchItemDescription}>
                  Direct messages from faculty and staff
                </Text>
              </View>
              <Switch
                value={settings.messages}
                onValueChange={(value) => updateSetting('messages', value)}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={settings.messages ? colors.primary : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.switchItemText}>Grades & Assessments</Text>
                <Text style={styles.switchItemDescription}>
                  Updates about your academic performance
                </Text>
              </View>
              <Switch
                value={settings.grades}
                onValueChange={(value) => updateSetting('grades', value)}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={settings.grades ? colors.primary : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.switchItemText}>Events</Text>
                <Text style={styles.switchItemDescription}>
                  Campus events, workshops, and activities
                </Text>
              </View>
              <Switch
                value={settings.events}
                onValueChange={(value) => updateSetting('events', value)}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={settings.events ? colors.primary : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.switchItemText}>Reminders</Text>
                <Text style={styles.switchItemDescription}>
                  Class schedules and assignment deadlines
                </Text>
              </View>
              <Switch
                value={settings.reminders}
                onValueChange={(value) => updateSetting('reminders', value)}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={settings.reminders ? colors.primary : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.switchItemText}>Marketing & Promotions</Text>
                <Text style={styles.switchItemDescription}>
                  Campus store deals and promotional content
                </Text>
              </View>
              <Switch
                value={settings.marketing}
                onValueChange={(value) => updateSetting('marketing', value)}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={settings.marketing ? colors.primary : '#FFFFFF'}
              />
            </View>
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Alert Settings</Text>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.switchItemText}>Sound</Text>
                <Text style={styles.switchItemDescription}>
                  Play sound when receiving notifications
                </Text>
              </View>
              <Switch
                value={settings.sound}
                onValueChange={(value) => updateSetting('sound', value)}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={settings.sound ? colors.primary : '#FFFFFF'}
              />
            </View>
            
            <View style={styles.switchItem}>
              <View style={styles.switchItemContent}>
                <Text style={styles.switchItemText}>Vibration</Text>
                <Text style={styles.switchItemDescription}>
                  Vibrate when receiving notifications
                </Text>
              </View>
              <Switch
                value={settings.vibration}
                onValueChange={(value) => updateSetting('vibration', value)}
                trackColor={{ false: '#D1D1D6', true: `${colors.primary}80` }}
                thumbColor={settings.vibration ? colors.primary : '#FFFFFF'}
              />
            </View>
          </View>
          
          <Text style={styles.noteText}>
            Note: Some critical notifications related to your academic status, security, and emergencies cannot be disabled.
          </Text>
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
  noteText: {
    fontSize: 14,
    color: colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
});