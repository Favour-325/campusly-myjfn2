import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell, Calendar, AlertTriangle } from 'lucide-react-native';
import colors from '@/constants/colors';

interface NotificationItemProps {
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'normal' | 'urgent' | 'event';
  onPress: () => void;
}

export default function NotificationItem({
  title,
  message,
  timestamp,
  isRead,
  type,
  onPress
}: NotificationItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIcon = () => {
    switch (type) {
      case 'urgent':
        return <AlertTriangle size={20} color={colors.warning} />;
      case 'event':
        return <Calendar size={20} color={colors.secondary} />;
      default:
        return <Bell size={20} color={colors.primary} />;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, !isRead && styles.unread]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {!isRead && <View style={styles.unreadDot} />}
        </View>

        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>

        <Text style={styles.timestamp}>{formatDate(timestamp)}</Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
    marginLeft: 8,
  },
  message: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textLight,
  },
});