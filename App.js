"use client";

import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";

// Import screens
import SplashScreen from "./src/screens/SplashScreen";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ChatScreen from "./src/screens/ChatScreen";
import FAQScreen from "./src/screens/FAQScreen";
import InquiryHistoryScreen from "./src/screens/InquiryHistoryScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import CourseSelection from "./src/screens/CourseSelection";
import ProgramRecommendations from "./src/screens/ProgramRecommendations";
import WassceInput from "./src/screens/WassceInput";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack Navigator
const AuthStackNavigator = ({ onAuthChange }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn">
        {(props) => <SignInScreen {...props} onAuthChange={onAuthChange} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {(props) => <SignUpScreen {...props} onAuthChange={onAuthChange} />}
      </Stack.Screen>
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

// Bottom Tab Navigator
const MainTabNavigator = ({ onLogout }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Chat") {
            iconName = "chat";
          } else if (route.name === "Programs") {
            iconName = "school";
          } else if (route.name === "FAQ") {
            iconName = "help";
          } else if (route.name === "Profile") {
            iconName = "person";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#006633",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E7EB",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home">
        {(props) => <HomeScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Programs" component={CourseSelection} />
      <Tab.Screen name="FAQ" component={FAQScreen} />
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Main App Stack Navigator
const MainStackNavigator = ({ onLogout }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs">
        {(props) => <MainTabNavigator {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="CourseSelection" component={CourseSelection} />
      <Stack.Screen name="WassceInput" component={WassceInput} />
      <Stack.Screen name="ProgramRecommendations" component={ProgramRecommendations} />
      <Stack.Screen name="InquiryHistory" component={InquiryHistoryScreen} />
    </Stack.Navigator>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthStatus = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      const idToken = await AsyncStorage.getItem("idToken");

      setIsFirstLaunch(hasLaunched === null);
      setIsAuthenticated(idToken !== null);

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleAuthChange = async () => {
    try {
      const idToken = await AsyncStorage.getItem("idToken");
      setIsAuthenticated(idToken !== null);
      if (!idToken) {
        await AsyncStorage.removeItem("userEmail");
        await AsyncStorage.removeItem("userUid");
      }
      console.log("Auth state changed, isAuthenticated:", idToken !== null);
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isFirstLaunch ? (
          <Stack.Screen name="Onboarding">
            {(props) => <OnboardingScreen {...props} onComplete={handleAuthChange} />}
          </Stack.Screen>
        ) : !isAuthenticated ? (
          <Stack.Screen name="Auth">
            {(props) => <AuthStackNavigator {...props} onAuthChange={handleAuthChange} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Main">
            {(props) => <MainStackNavigator {...props} onLogout={handleAuthChange} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;