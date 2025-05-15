import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Image } from 'react-native';
import colors from '@/constants/colors';

interface OnboardingSlideProps {
  title: string;
  description: string;
  image: string;
}

export default function OnboardingSlide({ title, description, image }: OnboardingSlideProps) {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <Image
        source={{ uri: image }}
        style={[styles.image, { width: width * 0.8 }]}
        resizeMode="contain"
      />

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  image: {
    height: 300,
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 24,
  },
});