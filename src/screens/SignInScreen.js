"use client";

import { useState } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { auth } from "../../firebase";
import axios from "axios";
import axiosRetry from "axios-retry";

const BASE_URL = "https://knust-chat-bot-backend.onrender.com";

// Configure axios-retry
axiosRetry(axios, {
  retries: 3, // Retry up to 3 times
  retryDelay: (retryCount) => retryCount * 2000, // 2s, 4s, 6s delay
  retryCondition: (error) => {
    // Retry on timeout or network errors
    return error.code === "ECONNABORTED" || !error.response;
  },
});

const SignInScreen = ({ route }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigation = useNavigation();
  const { onAuthChange } = route.params || {};

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    if (!auth) {
      Alert.alert("Error", "Authentication not ready. Please try again later.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting to sign in with URL:", `${BASE_URL}/signin`);
      console.log("Request payload:", { email: formData.email, password: "****" });

      const response = await axios.post(`${BASE_URL}/signin`, {
        email: formData.email,
        password: formData.password,
      }, {
        headers: { "Content-Type": "application/json" },
        timeout: 20000, // 20-second timeout
      });

      console.log("Signin response:", response.status, response.data);

      const { signInWithCustomToken } = await import("firebase/auth");
      const userCredential = await signInWithCustomToken(auth, response.data.customToken);
      console.log("Signed in user:", userCredential.user.uid);

      const idToken = await auth.currentUser.getIdToken();
      console.log("ID token obtained:", idToken.slice(0, 20) + "...");

      await AsyncStorage.setItem("idToken", idToken);
      await AsyncStorage.setItem("userEmail", formData.email);
      await AsyncStorage.setItem("userUid", response.data.uid);
      console.log("AsyncStorage updated:", await AsyncStorage.multiGet(["idToken", "userEmail", "userUid"]));

      if (onAuthChange) {
        onAuthChange();
        console.log("onAuthChange triggered");
      }

      navigation.navigate("HomeScreen");
    } catch (error) {
      let errorMessage = "Failed to sign in. Please check your network and try again.";
      if (error.response) {
        errorMessage = error.response.data.error || `Sign in failed: ${error.response.status}`;
        console.error("Signin error (response):", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      } else if (error.request) {
        errorMessage = error.code === "ECONNABORTED"
          ? "Server timed out. Please try again or check if the server is running."
          : "No response from server. Please check your network.";
        console.error("Signin error (request):", error.request);
      } else {
        errorMessage = error.message;
        console.error("Signin error (setup):", error.message);
      }
      console.error("Signin error details:", {
        message: errorMessage,
        code: error.code,
        stack: error.stack,
        url: `${BASE_URL}/signin`,
        body: { email: formData.email, password: "****" },
      });
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>🎓</Text>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your KNUST journey</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
                <Icon name="email" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(text) => updateFormData("email", text)}
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
                <Icon name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.password}
                  onChangeText={(text) => updateFormData("password", text)}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Icon name={showPassword ? "visibility" : "visibility-off"} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            </View>
            <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              <Text style={styles.signInButtonText}>{isLoading ? "Signing In..." : "Sign In"}</Text>
            </TouchableOpacity>
            <View style={styles.signUpContainer}>
              <Text style={styles.signUpText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  keyboardAvoid: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24 },
  header: { alignItems: "center", marginTop: 40, marginBottom: 40 },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#006633",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  logoText: { fontSize: 32, color: "#FFFFFF" },
  title: { fontSize: 28, fontWeight: "bold", color: "#1F2937", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#6B7280", textAlign: "center" },
  form: { flex: 1 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "500", color: "#374151", marginBottom: 8 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  inputError: { borderColor: "#EF4444" },
  inputIcon: { marginLeft: 16, marginRight: 12 },
  input: { flex: 1, paddingVertical: 16, paddingRight: 16, fontSize: 16, color: "#1F2937" },
  eyeIcon: { padding: 16 },
  errorText: { color: "#EF4444", fontSize: 12, marginTop: 4 },
  forgotPassword: { alignSelf: "flex-end", marginBottom: 24 },
  forgotPasswordText: { color: "#006633", fontSize: 14, fontWeight: "500" },
  signInButton: {
    backgroundColor: "#006633",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  signInButtonDisabled: { opacity: 0.6 },
  signInButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  signUpContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 24 },
  signUpText: { color: "#6B7280", fontSize: 14 },
  signUpLink: { color: "#006633", fontSize: 14, fontWeight: "600" },
});

export default SignInScreen;