import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  RefreshControl,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, Bell, Filter, Image as ImageIcon, Video, Send } from 'lucide-react-native';
import { Link } from 'expo-router';
import AnnouncementCard from '@/components/AnnouncementCard';
import colors from '@/constants/colors';
import { announcements } from '@/mocks/announcements';
import { useAuthStore } from '@/stores/auth-store';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [showNewPost, setShowNewPost] = useState(false);
  const [postText, setPostText] = useState('');
  const { user } = useAuthStore();

  const categories = ['All', 'Academic', 'Events', 'News', 'Sports', 'Clubs'];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real app, this would fetch new data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const filteredAnnouncements = React.useMemo(() => {
    if (activeCategory === 'All') return announcements;
    return announcements.filter(announcement =>
      announcement.category === activeCategory
    );
  }, [activeCategory]);

  const renderHeader = () => (
    <View style={styles.headerContent}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Hello,</Text>
        <Text style={styles.nameText}>{user?.name || 'Student'}</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search announcements..."
            placeholderTextColor={colors.textLight}
          />
        </View>

        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={20} color={colors.text} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <View style={styles.categoriesContainer}>
        <View style={styles.categoriesHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity>
            <Filter size={18} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                activeCategory === category && styles.activeCategoryButton
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category && styles.activeCategoryText
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.newPostContainer}>
        <TouchableOpacity
          style={styles.newPostButton}
          onPress={() => setShowNewPost(!showNewPost)}
        >
          <Text style={styles.newPostButtonText}>
            {showNewPost ? 'Cancel' : 'Create New Post'}
          </Text>
        </TouchableOpacity>

        {showNewPost && (
          <View style={styles.createPostContainer}>
            <View style={styles.postInputContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop' }}
                style={styles.userAvatar}
              />
              <TextInput
                style={styles.postInput}
                placeholder="What's on your mind?"
                multiline
                value={postText}
                onChangeText={setPostText}
                placeholderTextColor={colors.textLight}
              />
            </View>

            <View style={styles.postActions}>
              <View style={styles.mediaButtons}>
                <TouchableOpacity style={styles.mediaButton}>
                  <ImageIcon size={20} color={colors.primary} />
                  <Text style={styles.mediaButtonText}>Photo</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.mediaButton}>
                  <Video size={20} color={colors.secondary} />
                  <Text style={styles.mediaButtonText}>Video</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.postButton,
                  !postText && styles.disabledButton
                ]}
                disabled={!postText}
              >
                <Send size={18} color="#FFF" />
                <Text style={styles.postButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>Announcements</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <FlatList
        data={filteredAnnouncements}
        renderItem={({ item }) => (
          <Link href={`/announcement/${item.id}`} asChild>
            <TouchableOpacity>
              <AnnouncementCard {...item} />
            </TouchableOpacity>
          </Link>
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
      />
    </SafeAreaView>
  );
}

import { ScrollView } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
  },
  headerContent: {
    marginBottom: 16,
  },
  welcomeContainer: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.textLight,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: colors.text,
    fontSize: 16,
  },
  notificationButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoriesScroll: {
    flexDirection: 'row',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeCategoryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: colors.text,
  },
  activeCategoryText: {
    color: '#FFF',
    fontWeight: '500',
  },
  newPostContainer: {
    marginBottom: 24,
  },
  newPostButton: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  newPostButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  createPostContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  postInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInput: {
    flex: 1,
    minHeight: 80,
    maxHeight: 120,
    color: colors.text,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  mediaButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  postButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    gap: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  postButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});