import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  Animated,
  ViewToken
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight } from 'lucide-react-native';
import OnboardingSlide from '@/components/OnboardingSlide';
import colors from '@/constants/colors';
import { useAuthStore } from '@/stores/auth-store';

const slides = [
  {
    id: '1',
    title: 'Stay Updated',
    description: 'Get real-time updates on campus announcements, events, and important notifications.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2069&auto=format&fit=crop',
  },
  {
    id: '2',
    title: 'Access Your Results',
    description: 'View your academic performance, grades, and course materials all in one place.',
    image: 'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: '3',
    title: 'Timetables Made Easy',
    description: 'Never miss a class with your personalized timetable and schedule reminders.',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop',
  },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<FlatList>(null);
  const router = useRouter();
  const { completeOnboarding } = useAuthStore();

  const viewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollTo = (index: number) => {
    if (slidesRef.current) {
      slidesRef.current.scrollToIndex({ index });
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollTo(currentIndex + 1);
    } else {
      completeOnboarding();
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.logo}>Campusly</Text>
        {currentIndex < slides.length - 1 && (
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipButton}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={slides}
        renderItem={({ item }) => <OnboardingSlide {...item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
        scrollEventThrottle={32}
      />

      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          {slides.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                currentIndex === index && styles.paginationDotActive,
              ]}
              onPress={() => scrollTo(index)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ChevronRight size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: colors.primary,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  skipButton: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginRight: 8,
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  nextButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
});