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
  Send,
  Image as ImageIcon,
  Video,
  File,
  ArrowLeft,
} from 'lucide-react-native';
import colors from '@/constants/colors';
import { messages } from '@/mocks/messages';
import { useAuthStore } from '@/stores/auth-store';

export default function MessageDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuthStore();

  const message = messages.find(m => m.id.toString() === id);

  const [replyText, setReplyText] = useState('');
  const [conversation, setConversation] = useState<Array<{
    id: number;
    sender: string;
    isUser: boolean;
    text: string;
    timestamp: string;
    attachments?: Array<{
      type: 'image' | 'video' | 'file';
      url: string;
      name?: string;
    }>;
  }>>([
    {
      id: 1,
      sender: message?.sender || 'Admin',
      isUser: false,
      text: message?.message || '',
      timestamp: message?.timestamp || new Date().toISOString(),
    }
  ]);

  if (!message) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Message not found</Text>
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;

    const newMessage = {
      id: conversation.length + 1,
      sender: user?.name || 'You',
      isUser: true,
      text: replyText.trim(),
      timestamp: new Date().toISOString(),
    };

    setConversation([...conversation, newMessage]);
    setReplyText('');

    // Simulate a response after 1 second
    setTimeout(() => {
      const responseMessage = {
        id: conversation.length + 2,
        sender: message.sender,
        isUser: false,
        text: "Thank you for your message. We'll get back to you shortly.",
        timestamp: new Date().toISOString(),
      };

      setConversation(prev => [...prev, responseMessage]);
    }, 1000);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: message.title,
          headerTintColor: '#FFFFFF',
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
          ),
        }}
      />

      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />

        <View style={styles.categoryBadgeContainer}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryColor(message.category) + '20' }
            ]}
          >
            <Text
              style={[
                styles.categoryText,
                { color: getCategoryColor(message.category) }
              ]}
            >
              {message.category}
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {conversation.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageContainer,
                msg.isUser ? styles.userMessageContainer : styles.otherMessageContainer
              ]}
            >
              {!msg.isUser && (
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=1974&auto=format&fit=crop' }}
                  style={styles.avatar}
                />
              )}

              <View
                style={[
                  styles.messageBubble,
                  msg.isUser ? styles.userMessageBubble : styles.otherMessageBubble
                ]}
              >
                <View style={styles.messageHeader}>
                  <Text style={styles.messageSender}>{msg.sender}</Text>
                  <Text style={styles.messageTime}>{formatDate(msg.timestamp)}</Text>
                </View>

                <Text style={styles.messageText}>{msg.text}</Text>

                {msg.attachments && msg.attachments.length > 0 && (
                  <View style={styles.attachmentsContainer}>
                    {msg.attachments.map((attachment, index) => (
                      <View key={index} style={styles.attachment}>
                        {attachment.type === 'image' && (
                          <Image
                            source={{ uri: attachment.url }}
                            style={styles.attachmentImage}
                            resizeMode="cover"
                          />
                        )}

                        {attachment.type === 'video' && (
                          <View style={styles.attachmentVideo}>
                            <Video size={24} color="#FFF" />
                            <Text style={styles.attachmentName}>{attachment.name}</Text>
                          </View>
                        )}

                        {attachment.type === 'file' && (
                          <View style={styles.attachmentFile}>
                            <File size={24} color={colors.primary} />
                            <Text style={styles.attachmentName}>{attachment.name}</Text>
                          </View>
                        )}
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {msg.isUser && (
                <Image
                  source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop' }}
                  style={styles.avatar}
                />
              )}
            </View>
          ))}
        </ScrollView>

        <View style={styles.replyContainer}>
          <View style={styles.attachmentButtons}>
            <TouchableOpacity style={styles.attachmentButton}>
              <ImageIcon size={20} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachmentButton}>
              <Video size={20} color={colors.secondary} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.attachmentButton}>
              <File size={20} color={colors.textLight} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type your reply..."
              value={replyText}
              onChangeText={setReplyText}
              multiline
              placeholderTextColor={colors.textLight}
            />

            <TouchableOpacity
              style={[
                styles.sendButton,
                !replyText.trim() && styles.disabledButton
              ]}
              onPress={handleSendReply}
              disabled={!replyText.trim()}
            >
              <Send size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerBackButton: {
    marginLeft: 8,
  },
  categoryBadgeContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.card,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  messageBubble: {
    maxWidth: '70%',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 8,
  },
  userMessageBubble: {
    backgroundColor: `${colors.primary}20`,
  },
  otherMessageBubble: {
    backgroundColor: colors.card,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  messageSender: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  messageTime: {
    fontSize: 12,
    color: colors.textLight,
    marginLeft: 8,
  },
  messageText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  attachmentsContainer: {
    marginTop: 8,
  },
  attachment: {
    marginTop: 4,
  },
  attachmentImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
  },
  attachmentVideo: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentFile: {
    backgroundColor: '#F0F2F5',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentName: {
    marginLeft: 8,
    fontSize: 14,
    color: colors.text,
  },
  replyContainer: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 12,
  },
  attachmentButtons: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 12,
  },
  attachmentButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F2F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingRight: 48,
    fontSize: 14,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
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