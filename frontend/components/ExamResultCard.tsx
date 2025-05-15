import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FileText, Download, Eye } from 'lucide-react-native';
import colors from '@/constants/colors';

interface ExamResultCardProps {
  title: string;
  course: string;
  semester: string;
  uploadedBy: string;
  uploadDate: string;
  size: string;
  onView: () => void;
  onDownload: () => void;
}

export default function ExamResultCard({
  title,
  course,
  semester,
  uploadedBy,
  uploadDate,
  size,
  onView,
  onDownload
}: ExamResultCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <FileText size={24} color={colors.error} />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.course}>{course}</Text>
        
        <View style={styles.details}>
          <Text style={styles.semester}>{semester}</Text>
          <Text style={styles.uploadInfo}>
            {uploadedBy} • {uploadDate}
          </Text>
        </View>
        
        <View style={styles.actions}>
          <Text style={styles.size}>{size}</Text>
          
          <View style={styles.buttons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onView}
            >
              <Eye size={16} color={colors.primary} />
              <Text style={styles.actionText}>View</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={onDownload}
            >
              <Download size={16} color={colors.primary} />
              <Text style={styles.actionText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  course: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 8,
  },
  details: {
    marginBottom: 8,
  },
  semester: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  uploadInfo: {
    fontSize: 12,
    color: colors.textLight,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  size: {
    fontSize: 12,
    color: colors.textLight,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: `${colors.primary}15`,
    borderRadius: 16,
  },
  actionText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
});