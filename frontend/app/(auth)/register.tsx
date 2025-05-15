import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Eye, EyeOff, Mail, Lock, User, BookOpen, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react-native';
import colors from '@/constants/colors';
import { useAuthStore } from '@/stores/auth-store';
import { departments } from '@/mocks/departments';
import { levels } from '@/mocks/levels';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [level, setLevel] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDepartments, setShowDepartments] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const { register } = useAuthStore();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName) newErrors.fullName = 'Full name is required';
    if (!studentId) newErrors.studentId = 'Student ID is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!department) newErrors.department = 'Department is required';
    if (!level) newErrors.level = 'Level is required';
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const success = await register({
        name: fullName,
        studentId,
        email,
        department,
        level,
        password,
      });

      if (success) {
        router.replace('/verify-email');
      } else {
        setErrors({ form: 'Registration failed. Please try again.' });
      }
    } catch (err) {
      setErrors({ form: 'An error occurred. Please try again.' });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.logo}>Campusly</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.description}>
            Register to access your campus portal
          </Text>

          {errors.form ? <Text style={styles.errorText}>{errors.form}</Text> : null}

          <View style={styles.inputContainer}>
            <User size={20} color={colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              placeholderTextColor={colors.textLight}
            />
          </View>
          {errors.fullName ? <Text style={styles.errorText}>{errors.fullName}</Text> : null}

          <View style={styles.inputContainer}>
            <BookOpen size={20} color={colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Student ID"
              value={studentId}
              onChangeText={setStudentId}
              autoCapitalize="none"
              placeholderTextColor={colors.textLight}
            />
          </View>
          {errors.studentId ? <Text style={styles.errorText}>{errors.studentId}</Text> : null}

          <View style={styles.inputContainer}>
            <Mail size={20} color={colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="University Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.textLight}
            />
          </View>
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowDepartments(!showDepartments)}
          >
            <BookOpen size={20} color={colors.textLight} style={styles.inputIcon} />
            <Text
              style={[
                styles.input,
                !department && { color: colors.textLight }
              ]}
            >
              {department || 'Select Department'}
            </Text>
            {showDepartments ? (
              <ChevronUp size={20} color={colors.textLight} />
            ) : (
              <ChevronDown size={20} color={colors.textLight} />
            )}
          </TouchableOpacity>
          {errors.department ? <Text style={styles.errorText}>{errors.department}</Text> : null}

          {showDepartments && (
            <View style={styles.departmentDropdown}>
              <ScrollView style={{ maxHeight: 200 }}>
                {departments.map((dept) => (
                  <TouchableOpacity
                    key={dept.id}
                    style={styles.departmentItem}
                    onPress={() => {
                      setDepartment(dept.name);
                      setShowDepartments(false);
                    }}
                  >
                    <Text style={styles.departmentText}>{dept.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <TouchableOpacity
            style={styles.inputContainer}
            onPress={() => setShowLevels(!showLevels)}
          >
            <GraduationCap size={20} color={colors.textLight} style={styles.inputIcon} />
            <Text
              style={[
                styles.input,
                !level && { color: colors.textLight }
              ]}
            >
              {level || 'Select Level'}
            </Text>
            {showLevels ? (
              <ChevronUp size={20} color={colors.textLight} />
            ) : (
              <ChevronDown size={20} color={colors.textLight} />
            )}
          </TouchableOpacity>
          {errors.level ? <Text style={styles.errorText}>{errors.level}</Text> : null}

          {showLevels && (
            <View style={styles.departmentDropdown}>
              <ScrollView style={{ maxHeight: 200 }}>
                {levels.map((lvl) => (
                  <TouchableOpacity
                    key={lvl.id}
                    style={styles.departmentItem}
                    onPress={() => {
                      setLevel(lvl.name);
                      setShowLevels(false);
                    }}
                  >
                    <Text style={styles.departmentText}>{lvl.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.inputContainer}>
            <Lock size={20} color={colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.textLight}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={20} color={colors.textLight} />
              ) : (
                <Eye size={20} color={colors.textLight} />
              )}
            </TouchableOpacity>
          </View>
          {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

          <View style={styles.inputContainer}>
            <Lock size={20} color={colors.textLight} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor={colors.textLight}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff size={20} color={colors.textLight} />
              ) : (
                <Eye size={20} color={colors.textLight} />
              )}
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.registerButtonText}>Register</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
    paddingVertical: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textLight,
    marginBottom: 24,
  },
  errorText: {
    color: colors.error,
    marginTop: -8,
    marginBottom: 16,
    fontSize: 12,
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.text,
  },
  eyeIcon: {
    padding: 8,
  },
  departmentDropdown: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginTop: -8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 1000,
  },
  departmentItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  departmentText: {
    fontSize: 16,
    color: colors.text,
  },
  registerButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  registerButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: colors.textLight,
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});