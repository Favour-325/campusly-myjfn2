import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Mail, Phone, Globe, MessageSquare, FileText, HelpCircle, ChevronRight } from 'lucide-react-native';
import colors from '@/constants/colors';

const contactInfo = [
  {
    id: 1,
    title: 'Email Support',
    description: 'support@campusly.edu',
    icon: <Mail size={24} color={colors.primary} />,
    action: () => Linking.openURL('mailto:support@campusly.edu'),
  },
  {
    id: 2,
    title: 'Phone Support',
    description: '+1 (555) 123-4567',
    icon: <Phone size={24} color={colors.primary} />,
    action: () => Linking.openURL('tel:+15551234567'),
  },
  {
    id: 3,
    title: 'Website',
    description: 'www.campusly.edu/help',
    icon: <Globe size={24} color={colors.primary} />,
    action: () => Linking.openURL('https://www.example.com'),
  },
];

const helpResources = [
  {
    id: 1,
    title: 'Frequently Asked Questions',
    icon: <HelpCircle size={24} color={colors.secondary} />,
  },
  {
    id: 2,
    title: 'User Guide',
    icon: <FileText size={24} color={colors.secondary} />,
  },
  {
    id: 3,
    title: 'Video Tutorials',
    icon: <FileText size={24} color={colors.secondary} />,
  },
  {
    id: 4,
    title: 'Live Chat Support',
    icon: <MessageSquare size={24} color={colors.secondary} />,
  },
];

export default function HelpSupportScreen() {
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Help & Support',
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
            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.sectionDescription}>
              Need help? Reach out to our support team through any of these channels:
            </Text>
            
            {contactInfo.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.contactItem}
                onPress={item.action}
              >
                <View style={styles.contactIconContainer}>
                  {item.icon}
                </View>
                
                <View style={styles.contactContent}>
                  <Text style={styles.contactTitle}>{item.title}</Text>
                  <Text style={styles.contactDescription}>{item.description}</Text>
                </View>
                
                <ChevronRight size={20} color={colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Help Resources</Text>
            
            {helpResources.map((item) => (
              <TouchableOpacity key={item.id} style={styles.resourceItem}>
                <View style={styles.resourceIconContainer}>
                  {item.icon}
                </View>
                
                <View style={styles.resourceContent}>
                  <Text style={styles.resourceTitle}>{item.title}</Text>
                </View>
                
                <ChevronRight size={20} color={colors.textLight} />
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Information</Text>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>May 15, 2023</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Build Number</Text>
              <Text style={styles.infoValue}>2023051501</Text>
            </View>
          </View>
          
          <View style={styles.feedbackContainer}>
            <Text style={styles.feedbackTitle}>We Value Your Feedback</Text>
            <Text style={styles.feedbackDescription}>
              Help us improve Campusly by sharing your thoughts and suggestions.
            </Text>
            
            <TouchableOpacity style={styles.feedbackButton}>
              <Text style={styles.feedbackButtonText}>Send Feedback</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 2,
  },
  contactDescription: {
    fontSize: 14,
    color: colors.primary,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resourceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.secondary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  resourceContent: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.text,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textLight,
  },
  feedbackContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  feedbackDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 16,
    textAlign: 'center',
  },
  feedbackButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
  },
  feedbackButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});