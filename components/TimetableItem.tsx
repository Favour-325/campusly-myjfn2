import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, MapPin, User } from 'lucide-react-native';
import colors from '@/constants/colors';

interface TimetableItemProps {
  course: string;
  lecturer: string;
  time: string;
  room: string;
}

export default function TimetableItem({ course, lecturer, time, room }: TimetableItemProps) {
  return (
    <View style={styles.container}>
      <View style={styles.courseContainer}>
        <Text style={styles.course}>{course}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <User size={16} color={colors.primary} />
          <Text style={styles.detailText}>{lecturer}</Text>
        </View>

        <View style={styles.detailRow}>
          <Clock size={16} color={colors.primary} />
          <Text style={styles.detailText}>{time}</Text>
        </View>

        <View style={styles.detailRow}>
          <MapPin size={16} color={colors.primary} />
          <Text style={styles.detailText}>{room}</Text>
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
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  courseContainer: {
    marginBottom: 12,
  },
  course: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textLight,
  },
});