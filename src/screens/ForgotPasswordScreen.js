"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import Icon from "react-native-vector-icons/MaterialIcons"

const ForgotPasswordScreen = () => {
  const [step, setStep] = useState(1) // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const navigation = useNavigation()

  const validateEmail = () => {
    const newErrors = {}
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateCode = () => {
    const newErrors = {}
    if (!code.trim()) {
      newErrors.code = "Verification code is required"
    } else if (code.length !== 6) {
      newErrors.code = "Code must be 6 digits"
    } else if (!/^\d+$/.test(code)) {
      newErrors.code = "Code must contain only numbers"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswords = () => {
    const newErrors = {}
    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required"
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters"
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSendCode = async () => {
    if (!validateEmail()) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      Alert.alert(
        "Code Sent",
        `A 6-digit verification code has been sent to ${email}. Please check your email.`,
        [{ text: "OK", onPress: () => setStep(2) }]
      )
    } catch (error) {
      Alert.alert("Error", "Failed to send verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!validateCode()) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // For demo purposes, accept any 6-digit code
      if (code === "123456" || code.length === 6) {
        setStep(3)
      } else {
        Alert.alert("Invalid Code", "The verification code is incorrect. Please try again.")
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!validatePasswords()) return

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      
      Alert.alert(
        "Password Reset Successful",
        "Your password has been reset successfully. You can now sign in with your new password.",
        [
          {
            text: "Sign In",
            onPress: () => navigation.navigate("SignIn"),
          },
        ]
      )
    } catch (error) {
      Alert.alert("Error", "Failed to reset password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const renderEmailStep = () => (
    <>
      <Text style={styles.stepTitle}>Reset Your Password</Text>
      <Text style={styles.stepDescription}>
        Enter your email address and we'll send you a verification code to reset your password.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
          <Icon name="email" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={(text) => {
              setEmail(text)
              if (errors.email) {
                setErrors((prev) => ({ ...prev, email: null }))
              }
            }}
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.disabledButton]}
        onPress={handleSendCode}
        disabled={isLoading}
      >
        <Text style={styles.primaryButtonText}>
          {isLoading ? "Sending Code..." : "Send Verification Code"}
        </Text>
      </TouchableOpacity>
    </>
  )

  const renderCodeStep = () => (
    <>
      <Text style={styles.stepTitle}>Enter Verification Code</Text>
      <Text style={styles.stepDescription}>
        We've sent a 6-digit verification code to {email}. Please enter it below.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Verification Code</Text>
        <View style={[styles.inputWrapper, errors.code && styles.inputError]}>
          <Icon name="security" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={code}
            onChangeText={(text) => {
              setCode(text)
              if (errors.code) {
                setErrors((prev) => ({ ...prev, code: null }))
              }
            }}
            placeholder="Enter 6-digit code"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
        {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
      </View>

      <View style={styles.codeHint}>
        <Text style={styles.codeHintText}>Demo code: 123456</Text>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.disabledButton]}
        onPress={handleVerifyCode}
        disabled={isLoading}
      >
        <Text style={styles.primaryButtonText}>
          {isLoading ? "Verifying..." : "Verify Code"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendButton} onPress={handleSendCode}>
        <Text style={styles.resendButtonText}>Didn't receive the code? Resend</Text>
      </TouchableOpacity>
    </>
  )

  const renderPasswordStep = () => (
    <>
      <Text style={styles.stepTitle}>Create New Password</Text>
      <Text style={styles.stepDescription}>
        Please create a new password for your account. Make sure it's strong and secure.
      </Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <View style={[styles.inputWrapper, errors.newPassword && styles.inputError]}>
          <Icon name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={(text) => {
              setNewPassword(text)
              if (errors.newPassword) {
                setErrors((prev) => ({ ...prev, newPassword: null }))
              }
            }}
            placeholder="Enter new password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showNewPassword}
          />
          <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)} style={styles.eyeIcon}>
            <Icon name={showNewPassword ? "visibility" : "visibility-off"} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm New Password</Text>
        <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
          <Icon name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text)
              if (errors.confirmPassword) {
                setErrors((prev) => ({ ...prev, confirmPassword: null }))
              }
            }}
            placeholder="Confirm new password"
            placeholderTextColor="#9CA3AF"
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
            <Icon name={showConfirmPassword ? "visibility" : "visibility-off"} size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isLoading && styles.disabledButton]}
        onPress={handleResetPassword}
        disabled={isLoading}
      >
        <Text style={styles.primaryButtonText}>
          {isLoading ? "Resetting Password..." : "Reset Password"}
        </Text>
      </TouchableOpacity>
    </>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      <KeyboardAvoidingView style={styles.keyboardAvoid} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>🔒</Text>
            </View>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressStep, step >= 1 && styles.activeStep]} />
              <View style={[styles.progressStep, step >= 2 && styles.activeStep]} />
              <View style={[styles.progressStep, step >= 3 && styles.activeStep]} />
            </View>
            <Text style={styles.progressText}>Step {step} of 3</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {step === 1 && renderEmailStep()}
            {step === 2 && renderCodeStep()}
            {step === 3 && renderPasswordStep()}
          </View>

          {/* Back to Sign In */}
          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Remember your password? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    alignSelf: "flex-start",
    padding: 8,
    marginBottom: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#FEF3C7",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoText: {
    fontSize: 32,
  },
  progressContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  progressBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressStep: {
    width: 60,
    height: 4,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 4,
    borderRadius: 2,
  },
  activeStep: {
    backgroundColor: "#006633",
  },
  progressText: {
    fontSize: 14,
    color: "#6B7280",
  },
  form: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
    textAlign: "center",
  },
  stepDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  inputIcon: {
    marginLeft: 16,
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 16,
    fontSize: 16,
    color: "#1F2937",
  },
  eyeIcon: {
    padding: 16,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    marginTop: 4,
  },
  codeHint: {
    backgroundColor: "#F0FDF4",
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  codeHintText: {
    fontSize: 14,
    color: "#166534",
    textAlign: "center",
    fontWeight: "500",
  },
  primaryButton: {
    backgroundColor: "#006633",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resendButton: {
    alignItems: "center",
    marginBottom: 24,
  },
  resendButtonText: {
    color: "#006633",
    fontSize: 14,
    fontWeight: "500",
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  signInText: {
    color: "#6B7280",
    fontSize: 14,
  },
  signInLink: {
    color: "#006633",
    fontSize: 14,
    fontWeight: "600",
  },
})

export default ForgotPasswordScreen
