import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import NotificationItem from '@/components/NotificationItem';
import colors from '@/constants/colors';
import { notifications } from '@/mocks/notifications';

type NotificationType = 'all' | 'urgent' | 'event';

export default function NotificationsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<NotificationType>('all');
  const [notificationsList, setNotificationsList] = useState(notifications);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real app, this would fetch new data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleNotificationPress = (id: number) => {
    // Mark notification as read
    setNotificationsList(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const filteredNotifications = React.useMemo(() => {
    if (filter === 'all') return notificationsList;
    return notificationsList.filter(notification => notification.type === filter);
  }, [filter, notificationsList]);

  const renderHeader = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[styles.filterButton, filter === 'all' && styles.activeFilterButton]}
        onPress={() => setFilter('all')}
      >
        <Text
          style={[
            styles.filterText,
            filter === 'all' && styles.activeFilterText
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.filterButton, filter === 'urgent' && styles.activeFilterButton]}
        onPress={() => setFilter('urgent')}
      >
        <Text
          style={[
            styles.filterText,
            filter === 'urgent' && styles.activeFilterText
          ]}
        >
          Urgent
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.filterButton, filter === 'event' && styles.activeFilterButton]}
        onPress={() => setFilter('event')}
      >
        <Text
          style={[
            styles.filterText,
            filter === 'event' && styles.activeFilterText
          ]}
        >
          Events
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <FlatList
        data={filteredNotifications}
        renderItem={({ item }) => (
          <NotificationItem
            title={item.title}
            message={item.message}
            timestamp={item.timestamp}
            isRead={item.isRead}
            type={item.type as 'normal' | 'urgent' | 'event'}
            onPress={() => handleNotificationPress(item.id)}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No notifications found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: colors.text,
  },
  activeFilterText: {
    color: '#FFF',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
});