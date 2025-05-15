import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import TimetableItem from '@/components/TimetableItem';
import colors from '@/constants/colors';
import { timetable } from '@/mocks/timetable';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// Generate weeks for infinite scrolling
const generateWeeks = (count: number) => {
  const weeks = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is Sunday

  for (let i = -Math.floor(count / 2); i < Math.ceil(count / 2); i++) {
    const weekStart = new Date(today);
    weekStart.setDate(diff + (i * 7));

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 4); // Friday

    const weekLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

    weeks.push({
      id: i.toString(),
      label: weekLabel,
      startDate: weekStart,
    });
  }

  return weeks;
};

const weeks = generateWeeks(100); // Generate 100 weeks (50 past, 50 future)

export default function TimetableScreen() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [currentWeekIndex, setCurrentWeekIndex] = useState(Math.floor(weeks.length / 2));
  const weekListRef = useRef<FlatList>(null);

  const currentWeek = weeks[currentWeekIndex];

  const handlePrevWeek = () => {
    if (currentWeekIndex > 0) {
      setCurrentWeekIndex(currentWeekIndex - 1);
      weekListRef.current?.scrollToIndex({
        index: currentWeekIndex - 1,
        animated: true
      });
    }
  };

  const handleNextWeek = () => {
    if (currentWeekIndex < weeks.length - 1) {
      setCurrentWeekIndex(currentWeekIndex + 1);
      weekListRef.current?.scrollToIndex({
        index: currentWeekIndex + 1,
        animated: true
      });
    }
  };

  const renderDaySelector = () => (
    <View style={styles.daySelector}>
      {days.map((day) => (
        <TouchableOpacity
          key={day}
          style={[
            styles.dayButton,
            selectedDay === day && styles.selectedDayButton,
          ]}
          onPress={() => setSelectedDay(day)}
        >
          <Text
            style={[
              styles.dayText,
              selectedDay === day && styles.selectedDayText,
            ]}
          >
            {day.substring(0, 3)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderWeekItem = ({ item, index }: { item: typeof weeks[0], index: number }) => (
    <TouchableOpacity
      style={[
        styles.weekItem,
        currentWeekIndex === index && styles.selectedWeekItem
      ]}
      onPress={() => {
        setCurrentWeekIndex(index);
      }}
    >
      <Text
        style={[
          styles.weekItemText,
          currentWeekIndex === index && styles.selectedWeekItemText
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.weekButton}
          onPress={handlePrevWeek}
        >
          <ChevronLeft size={20} color={colors.text} />
        </TouchableOpacity>

        <Text style={styles.weekText}>{currentWeek.label}</Text>

        <TouchableOpacity
          style={styles.weekButton}
          onPress={handleNextWeek}
        >
          <ChevronRight size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.weekListContainer}>
        <FlatList
          ref={weekListRef}
          data={weeks}
          renderItem={renderWeekItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={Math.floor(weeks.length / 2)}
          getItemLayout={(data, index) => ({
            length: 150,
            offset: 150 * index,
            index,
          })}
          contentContainerStyle={styles.weekList}
        />
      </View>

      {renderDaySelector()}

      <ScrollView
        style={styles.scheduleContainer}
        contentContainerStyle={styles.scheduleContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.timelineHeader}>
          <Text style={styles.dayTitle}>{selectedDay}</Text>
          <Text style={styles.classesCount}>
            {timetable[selectedDay as keyof typeof timetable]?.length || 0} Classes
          </Text>
        </View>

        {timetable[selectedDay as keyof typeof timetable]?.map((item) => (
          <TimetableItem
            key={item.id}
            course={item.course}
            lecturer={item.lecturer}
            time={item.time}
            room={item.room}
          />
        ))}

        {(!timetable[selectedDay as keyof typeof timetable] ||
          timetable[selectedDay as keyof typeof timetable].length === 0) && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No classes scheduled for {selectedDay}</Text>
            </View>
          )}
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  weekButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  weekText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  weekListContainer: {
    height: 50,
    marginBottom: 8,
  },
  weekList: {
    paddingHorizontal: 8,
  },
  weekItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
  },
  selectedWeekItem: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  weekItemText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedWeekItemText: {
    color: '#FFF',
  },
  daySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectedDayButton: {
    backgroundColor: colors.primary,
  },
  dayText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedDayText: {
    color: '#FFF',
    fontWeight: '500',
  },
  scheduleContainer: {
    flex: 1,
  },
  scheduleContent: {
    padding: 16,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  classesCount: {
    fontSize: 14,
    color: colors.textLight,
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