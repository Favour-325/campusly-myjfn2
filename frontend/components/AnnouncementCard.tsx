import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MessageSquare, ThumbsUp, PartyPopper } from 'lucide-react-native';
import colors from '@/constants/colors';

interface AnnouncementCardProps {
  title: string;
  content: string;
  timestamp: string;
  author: string;
  category: string;
  reactions: {
    like: number;
    celebrate: number;
    sad: number;
  };
  comments: number;
  image?: string;
}

export default function AnnouncementCard({
  title,
  content,
  timestamp,
  author,
  category,
  reactions,
  comments,
  image
}: AnnouncementCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.metaContainer}>
        <Text style={styles.author}>Posted by {author}</Text>
        <Text style={styles.timestamp}>{formatDate(timestamp)}</Text>
      </View>
      
      {image && (
        <Image 
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      
      <Text style={styles.content} numberOfLines={3}>
        {content}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.reactions}>
          <View style={styles.reaction}>
            <ThumbsUp size={14} color={colors.textLight} />
            <Text style={styles.reactionCount}>{reactions.like}</Text>
          </View>
          
          <View style={styles.reaction}>
            <PartyPopper size={14} color={colors.textLight} />
            <Text style={styles.reactionCount}>{reactions.celebrate}</Text>
          </View>
        </View>
        
        <View style={styles.comments}>
          <MessageSquare size={14} color={colors.textLight} />
          <Text style={styles.commentCount}>{comments}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  metaContainer: {
    marginBottom: 12,
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
    height: 160,
    borderRadius: 8,
    marginBottom: 12,
  },
  content: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  reactions: {
    flexDirection: 'row',
    gap: 12,
  },
  reaction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reactionCount: {
    fontSize: 12,
    color: colors.textLight,
  },
  comments: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  commentCount: {
    fontSize: 12,
    color: colors.textLight,
  },
});