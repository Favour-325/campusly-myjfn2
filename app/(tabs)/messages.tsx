import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Send, ChevronDown, Search } from 'lucide-react-native';
import { Link } from 'expo-router';
import MessageItem from '@/components/MessageItem';
import colors from '@/constants/colors';
import { messages } from '@/mocks/messages';

// Option B: Feedback Form
const categories = [
  'Academic',
  'Technical',
  'Financial',
  'Housing',
  'Other',
];

export default function MessagesScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [messagesList, setMessagesList] = useState(messages);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackCategory, setFeedbackCategory] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showCategories, setShowCategories] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real app, this would fetch new data
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  const handleMessagePress = (id: number) => {
    // Mark message as read
    setMessagesList(prev =>
      prev.map(message =>
        message.id === id
          ? { ...message, isRead: true }
          : message
      )
    );
  };

  const handleSendFeedback = () => {
    if (!feedbackCategory || !feedbackMessage) return;

    // In a real app, this would send the feedback to the server
    // For this MVP, we'll just clear the form
    setFeedbackCategory('');
    setFeedbackMessage('');
    setShowFeedbackForm(false);

    // Show a success message or toast
    alert('Feedback sent successfully!');
  };

  const filteredMessages = React.useMemo(() => {
    if (!searchQuery) return messagesList;

    return messagesList.filter(message =>
      message.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, messagesList]);

  const renderMessagesList = () => (
    <>
      <View style={styles.searchContainer}>
        <Search size={20} color={colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textLight}
        />
      </View>

      <FlatList
        data={filteredMessages}
        renderItem={({ item }) => (
          <Link href={`/message/${item.id}`} asChild>
            <TouchableOpacity>
              <MessageItem
                sender={item.sender}
                title={item.title}
                message={item.message}
                timestamp={item.timestamp}
                category={item.category}
                isRead={item.isRead}
                onPress={() => handleMessagePress(item.id)}
              />
            </TouchableOpacity>
          </Link>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
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
            <Text style={styles.emptyStateText}>No messages found</Text>
          </View>
        }
      />
    </>
  );

  const renderFeedbackForm = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.feedbackContainer}
    >
      <ScrollView
        contentContainerStyle={styles.feedbackContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.feedbackTitle}>Send Feedback</Text>
        <Text style={styles.feedbackDescription}>
          Let us know how we can improve your campus experience
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowCategories(!showCategories)}
          >
            <Text
              style={[
                styles.dropdownText,
                !feedbackCategory && styles.placeholderText
              ]}
            >
              {feedbackCategory || 'Select a category'}
            </Text>
            <ChevronDown size={20} color={colors.textLight} />
          </TouchableOpacity>

          {showCategories && (
            <View style={styles.categoriesList}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.categoryItem}
                  onPress={() => {
                    setFeedbackCategory(category);
                    setShowCategories(false);
                  }}
                >
                  <Text style={styles.categoryText}>{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Message</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Type your feedback here..."
            value={feedbackMessage}
            onChangeText={setFeedbackMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            placeholderTextColor={colors.textLight}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!feedbackCategory || !feedbackMessage) && styles.disabledButton
          ]}
          onPress={handleSendFeedback}
          disabled={!feedbackCategory || !feedbackMessage}
        >
          <Text style={styles.sendButtonText}>Send Feedback</Text>
          <Send size={20} color="#FFF" />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            !showFeedbackForm && styles.activeTabButton
          ]}
          onPress={() => setShowFeedbackForm(false)}
        >
          <Text
            style={[
              styles.tabText,
              !showFeedbackForm && styles.activeTabText
            ]}
          >
            Messages
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            showFeedbackForm && styles.activeTabButton
          ]}
          onPress={() => setShowFeedbackForm(true)}
        >
          <Text
            style={[
              styles.tabText,
              showFeedbackForm && styles.activeTabText
            ]}
          >
            Send Feedback
          </Text>
        </TouchableOpacity>
      </View>

      {showFeedbackForm ? renderFeedbackForm() : renderMessagesList()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: colors.text,
  },
  activeTabText: {
    color: '#FFF',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
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
  feedbackContainer: {
    flex: 1,
  },
  feedbackContent: {
    padding: 16,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  feedbackDescription: {
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.text,
  },
  placeholderText: {
    color: colors.textLight,
  },
  categoriesList: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 1000,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryText: {
    fontSize: 16,
    color: colors.text,
  },
  textArea: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    color: colors.text,
    minHeight: 120,
  },
  sendButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  disabledButton: {
    backgroundColor: colors.textLight,
    opacity: 0.7,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});