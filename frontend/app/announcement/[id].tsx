import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ThumbsUp,
  PartyPopper,
  Frown,
  Share2,
  Bookmark,
  MessageSquare,
  Send,
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { announcements } from '@/mocks/announcements';
import { useAuthStore } from '@/stores/auth-store';

export default function AnnouncementDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const announcement = announcements.find(a => a.id.toString() === id);

  const [reactions, setReactions] = useState(announcement?.reactions || { like: 0, celebrate: 0, sad: 0 });
  const [userReactions, setUserReactions] = useState({
    like: false,
    celebrate: false,
    sad: false
  });
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Array<{
    id: number;
    user: string;
    avatar: string;
    text: string;
    timestamp: string;
  }>>([
    {
      id: 1,
      user: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1974&auto=format&fit=crop',
      text: 'Thanks for the information! This is really helpful.',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      user: 'Michael Johnson',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop',
      text: 'Will there be any follow-up sessions?',
      timestamp: '1 hour ago'
    }
  ]);

  if (!announcement) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Announcement not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleReaction = (type: 'like' | 'celebrate' | 'sad') => {
    setUserReactions(prev => {
      const newUserReactions = { ...prev };

      // Toggle the reaction
      newUserReactions[type] = !prev[type];

      // Update the count
      setReactions(prevReactions => ({
        ...prevReactions,
        [type]: prevReactions[type] + (newUserReactions[type] ? 1 : -1)
      }));

      return newUserReactions;
    });
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment = {
      id: comments.length + 1,
      user: user?.name || 'You',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop',
      text: commentText.trim(),
      timestamp: 'Just now'
    };

    setComments([...comments, newComment]);
    setCommentText('');
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Announcement',
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
          <View style={styles.card}>
            <Text style={styles.title}>{announcement.title}</Text>

            <View style={styles.metaContainer}>
              <Text style={styles.author}>Posted by {announcement.author}</Text>
              <Text style={styles.timestamp}>{formatDate(announcement.timestamp)}</Text>
            </View>

            {announcement.image && (
              <Image
                source={{ uri: announcement.image }}
                style={styles.image}
                resizeMode="cover"
              />
            )}

            <Text style={styles.content}>{announcement.content}</Text>

            <View style={styles.actionsContainer}>
              <View style={styles.reactions}>
                <TouchableOpacity
                  style={[styles.reactionButton, userReactions.like && styles.activeReaction]}
                  onPress={() => handleReaction('like')}
                >
                  <ThumbsUp size={16} color={userReactions.like ? colors.primary : colors.textLight} />
                  <Text style={[styles.reactionCount, userReactions.like && styles.activeReactionText]}>
                    {reactions.like}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.reactionButton, userReactions.celebrate && styles.activeReaction]}
                  onPress={() => handleReaction('celebrate')}
                >
                  <PartyPopper size={16} color={userReactions.celebrate ? colors.secondary : colors.textLight} />
                  <Text style={[styles.reactionCount, userReactions.celebrate && styles.celebrateReactionText]}>
                    {reactions.celebrate}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.reactionButton, userReactions.sad && styles.activeReaction]}
                  onPress={() => handleReaction('sad')}
                >
                  <Frown size={16} color={userReactions.sad ? colors.primary : colors.textLight} />
                  <Text style={[styles.reactionCount, userReactions.sad && styles.activeReactionText]}>
                    {reactions.sad}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Share2 size={20} color={colors.textLight} />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setIsBookmarked(!isBookmarked)}
                >
                  <Bookmark
                    size={20}
                    color={isBookmarked ? colors.secondary : colors.textLight}
                    fill={isBookmarked ? colors.secondary : 'none'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
              Comments ({comments.length})
            </Text>

            <View style={styles.commentInputContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop' }}
                style={styles.commentAvatar}
              />

              <View style={styles.commentInputWrapper}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write a comment..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  placeholderTextColor={colors.textLight}
                />

                <TouchableOpacity
                  style={[
                    styles.sendButton,
                    !commentText.trim() && styles.disabledButton
                  ]}
                  onPress={handleAddComment}
                  disabled={!commentText.trim()}
                >
                  <Send size={18} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>

            {comments.map((comment) => (
              <View key={comment.id} style={styles.commentItem}>
                <Image
                  source={{ uri: comment.avatar }}
                  style={styles.commentAvatar}
                />

                <View style={styles.commentContent}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{comment.user}</Text>
                    <Text style={styles.commentTime}>{comment.timestamp}</Text>
                  </View>

                  <Text style={styles.commentText}>{comment.text}</Text>

                  <View style={styles.commentActions}>
                    <TouchableOpacity style={styles.commentAction}>
                      <ThumbsUp size={14} color={colors.textLight} />
                      <Text style={styles.commentActionText}>Like</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.commentAction}>
                      <MessageSquare size={14} color={colors.textLight} />
                      <Text style={styles.commentActionText}>Reply</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
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
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  metaContainer: {
    marginBottom: 16,
  },
  author: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textLight,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    marginBottom: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  reactions: {
    flexDirection: 'row',
    gap: 8,
  },
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 4,
  },
  activeReaction: {
    backgroundColor: '#E7F0FF',
  },
  reactionCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  activeReactionText: {
    color: colors.primary,
  },
  celebrateReactionText: {
    color: colors.secondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  commentsSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  commentInputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentContent: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    padding: 12,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  commentTime: {
    fontSize: 12,
    color: colors.textLight,
  },
  commentText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: 'row',
    gap: 16,
  },
  commentAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentActionText: {
    fontSize: 12,
    color: colors.textLight,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  backButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});