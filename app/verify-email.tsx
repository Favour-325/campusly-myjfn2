import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Mail, CheckCircle } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAuthStore } from '@/stores/auth-store';

export default function VerifyEmailScreen() {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const router = useRouter();
  const { user, verifyEmail } = useAuthStore();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (!verificationCode) {
      setError('Please enter the verification code');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      // In a real app, this would make an API call to verify the code
      // For this MVP, we'll simulate a successful verification
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (verificationCode === '123456') {
        await verifyEmail();
        router.replace('/(tabs)');
      } else {
        setError('Invalid verification code');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoading(true);

    try {
      // In a real app, this would make an API call to resend the code
      // For this MVP, we'll simulate a successful resend
      await new Promise(resolve => setTimeout(resolve, 1500));

      setCountdown(60);
      setCanResend(false);
    } catch (err) {
      setError('Failed to resend code. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Mail size={60} color={colors.primary} />
        </View>

        <Text style={styles.title}>Verify Your Email</Text>

        <Text style={styles.description}>
          We've sent a verification code to{' '}
          <Text style={styles.emailText}>{user?.email}</Text>
        </Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.codeContainer}>
          <TextInput
            style={styles.codeInput}
            placeholder="Enter verification code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            maxLength={6}
            placeholderTextColor={colors.textLight}
          />
        </View>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerify}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <CheckCircle size={20} color="#FFF" />
              <Text style={styles.verifyButtonText}>Verify Email</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={!canResend || isLoading}
          >
            <Text
              style={[
                styles.resendLink,
                (!canResend || isLoading) && styles.disabledText
              ]}
            >
              {canResend ? 'Resend Code' : `Resend in ${countdown}s`}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${colors.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emailText: {
    color: colors.primary,
    fontWeight: '500',
  },
  errorText: {
    color: colors.error,
    marginBottom: 16,
    textAlign: 'center',
  },
  codeContainer: {
    width: '100%',
    marginBottom: 24,
  },
  codeInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: 'center',
    letterSpacing: 8,
  },
  verifyButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    width: '100%',
    gap: 8,
  },
  verifyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  resendText: {
    color: colors.textLight,
    fontSize: 14,
  },
  resendLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  disabledText: {
    color: colors.textLight,
    opacity: 0.7,
  },
  backButton: {
    paddingVertical: 12,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
});