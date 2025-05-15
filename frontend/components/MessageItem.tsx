import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Mail, MailOpen } from 'lucide-react-native';
import colors from '@/constants/colors';

interface MessageItemProps {
  sender: string;
  title: string;
  message: string;
  timestamp: string;
  category: string;
  isRead: boolean;
  onPress: () => void;
}

export default function MessageItem({
  sender,
  title,
  message,
  timestamp,
  category,
  isRead,
  onPress
}: MessageItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'academic':
        return colors.primary;
      case 'financial':
        return colors.success;
      case 'system':
        return colors.info;
      case 'faculty':
        return colors.warning;
      default:
        return colors.secondary;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, !isRead && styles.unread]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {isRead ? (
          <MailOpen size={20} color={colors.textLight} />
        ) : (
          <Mail size={20} color={colors.primary} />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.sender}>{sender}</Text>
          <Text style={styles.timestamp}>{formatDate(timestamp)}</Text>
        </View>

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>

        <View style={styles.footer}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(category) + '20' }
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                { color: getCategoryColor(category) }
              ]}
            >
              {category}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.read,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  unread: {
    backgroundColor: colors.unread,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  iconContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sender: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textLight,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
});