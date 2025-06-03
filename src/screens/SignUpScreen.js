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
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { auth, db } from "../../firebase";
import Config from "react-native-config";
import axios from "axios";

const SignUpScreen = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptTerms, setAcceptTerms] = useState(false);

  const navigation = useNavigation();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) newErrors.phone = "Please enter a valid phone number";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!acceptTerms) newErrors.terms = "Please accept the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    if (!auth || !db) {
      Alert.alert("Error", "Authentication or database not ready. Please try again later.");
      return;
    }

    setIsLoading(true);

    try {
      console.log("API_BASE_URL:", Config.API_BASE_URL);
      console.log("Sending signup request to:", `${Config.API_BASE_URL}/signup`);
      console.log("Request payload:", {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      const response = await axios.post(`${Config.API_BASE_URL}/signup`, {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      }, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000, // 10-second timeout
      });

      console.log("Signup response:", response.status, response.data);

      const { signInWithCustomToken } = await import("firebase/auth");
      const userCredential = await signInWithCustomToken(auth, response.data.customToken);
      console.log("Signed up user:", userCredential.user.uid);

      const { doc, setDoc } = await import("firebase/firestore");
      await setDoc(
        doc(db, "users", response.data.uid),
        {
          uid: response.data.uid,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { merge: true }
      );
      console.log("Firestore user doc created for UID:", response.data.uid);

      Alert.alert("Success!", "Your account has been created successfully. Please sign in to continue.", [
        { text: "OK", onPress: () => navigation.navigate("SignIn") },
      ]);
    } catch (error) {
      let errorMessage = "Failed to sign up. Please check your network and try again.";
      if (error.response) {
        // Server responded with a status other than 2xx
        errorMessage = error.response.data.error || `Signup failed: ${error.response.status}`;
        console.error("Signup error (response):", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your network.";
        console.error("Signup error (request):", error.request);
      } else {
        // Error setting up the request
        errorMessage = error.message;
        console.error("Signup error (setup):", error.message);
      }
      console.error("Signup error details:", {
        message: errorMessage,
        code: error.code,
        stack: error.stack,
        url: `${Config.API_BASE_URL}/signup`,
        body: {
          email: formData.email,
          password: "****",
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
      });
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#1F2937" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>🎓</Text>
            </View>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join KNUST Pathfinder today</Text>
          </View>
          <View style={styles.form}>
            <View style={styles.nameRow}>
              <View style={[styles.inputContainer, styles.nameInput]}>
                <Text style={styles.label}>First Name</Text>
                <View style={[styles.inputWrapper, errors.firstName && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    value={formData.firstName}
                    onChangeText={(text) => updateFormData("firstName", text)}
                    placeholder="First name"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}
              </View>
              <View style={[styles.inputContainer, styles.nameInput]}>
                <Text style={styles.label}>Last Name</Text>
                <View style={[styles.inputWrapper, errors.lastName && styles.inputError]}>
                  <TextInput
                    style={styles.input}
                    value={formData.lastName}
                    onChangeText={(text) => updateFormData("lastName", text)}
                    placeholder="Last name"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}
              </View>
            </View>
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
              <Text style={styles.label}>Phone Number</Text>
              <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
                <Icon name="phone" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => updateFormData("phone", text)}
                  placeholder="Enter your phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              </View>
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
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
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
                <Icon name="lock" size={20} color="#9CA3AF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateFormData("confirmPassword", text)}
                  placeholder="Confirm your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Icon name={showConfirmPassword ? "visibility" : "visibility-off"} size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
            </View>
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => {
                  setAcceptTerms(!acceptTerms);
                  if (errors.terms) setErrors((prev) => ({ ...prev, terms: null }));
                }}
              >
                <Icon
                  name={acceptTerms ? "check-box" : "check-box-outline-blank"}
                  size={20}
                  color={acceptTerms ? "#006633" : "#9CA3AF"}
                />
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
            {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}
            <TouchableOpacity
              style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.signUpButtonText}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                <Text style={styles.signInLink}>Sign In</Text>
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
  header: { alignItems: "center", marginTop: 20, marginBottom: 24 },
  backButton: { alignSelf: "flex-start", padding: 8, marginBottom: 20 },
  logoContainer: {
    width: 60,
    height: 60,
    backgroundColor: "#006633",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoText: { fontSize: 24, color: "#FFFFFF" },
  title: { fontSize: 24, fontWeight: "bold", color: "#1F2937", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#6B7280", textAlign: "center" },
  form: { flex: 1 },
  nameRow: { flexDirection: "row", justifyContent: "space-between" },
  nameInput: { flex: 1, marginHorizontal: 4 },
  inputContainer: { marginBottom: 16 },
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
  termsContainer: { flexDirection: "row", alignItems: "flex-start", marginBottom: 24 },
  checkbox: { marginRight: 12, marginTop: 2 },
  termsText: { flex: 1, fontSize: 14, color: "#6B7280", lineHeight: 20 },
  termsLink: { color: "#006633", fontWeight: "600" },
  signUpButton: {
    backgroundColor: "#006633",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  signUpButtonDisabled: { opacity: 0.6 },
  signUpButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  signInContainer: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 24 },
  signInText: { color: "#6B7280", fontSize: 14 },
  signInLink: { color: "#006633", fontSize: 14, fontWeight: "600" },
});

export default SignUpScreen;