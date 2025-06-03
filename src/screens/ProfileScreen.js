"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Switch,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Icon from "react-native-vector-icons/MaterialIcons"

const ProfileScreen = ({ navigation, onLogout }) => {
  const [userProfile, setUserProfile] = useState({
    name: "Rockson Agyamaku",
    email: "financialrock@knust.edu.gh",
    phone: "+233 24 123 4567",
    studentId: "KN2024001",
    program: "BSc Computer Science",
    level: "400",
    joinDate: "2025-06-01",
  })

  const [settings, setSettings] = useState({
    notifications: true,
    emailUpdates: true,
    darkMode: false,
    biometric: false,
  })

  const [stats, setStats] = useState({
    totalInquiries: 15,
    answeredQuestions: 12,
    savedPrograms: 3,
    daysActive: 45,
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail")
      if (email) {
        setUserProfile((prev) => ({ ...prev, email }))
      }

      // Load other user data from storage
      const savedSettings = await AsyncStorage.getItem("userSettings")
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    try {
      await AsyncStorage.setItem("userSettings", JSON.stringify(newSettings))
    } catch (error) {
      console.error("Error saving settings:", error)
    }
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.multiRemove(["userToken", "userEmail", "userSettings"])
            if (onLogout) {
              onLogout() // Call the onLogout callback
            }
          } catch (error) {
            console.error("Error logging out:", error)
          }
        },
      },
    ])
  }

  const handleEditProfile = () => {
    navigation.navigate("EditProfile")
  }

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword")
  }

  const handleDeleteAccount = () => {
    Alert.alert("Delete Account", "Are you sure you want to delete your account? This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          Alert.alert("Account Deleted", "Your account has been deleted successfully.")
        },
      },
    ])
  }

  const handleHelpSupport = () => {
    Alert.alert(
      "Help & Support",
      "Contact Information:\n\nEmail: support@knust.edu.gh\nPhone: +233 32 206 0001\nWebsite: www.knust.edu.gh\n\nOffice Hours:\nMonday - Friday: 8:00 AM - 5:00 PM\nSaturday: 9:00 AM - 2:00 PM",
      [{ text: "OK" }],
    )
  }

  const handleAbout = () => {
    Alert.alert(
      "About KNUST Pathfinder",
      "KNUST Pathfinder v1.0.0\n\nYour comprehensive guide to navigating the admission process at Kwame Nkrumah University of Science and Technology.\n\nFeatures:\n• AI-powered assistance\n• Program recommendations\n• Application tracking\n• FAQ and support\n\n© 2025 KNUST. All rights reserved.",
      [{ text: "OK" }],
    )
  }

  const menuItems = [
    {
      id: "edit",
      title: "Edit Profile",
      icon: "edit",
      onPress: handleEditProfile,
    },
    {
      id: "password",
      title: "Change Password",
      icon: "lock",
      onPress: handleChangePassword,
    },
    {
      id: "history",
      title: "Inquiry History",
      icon: "history",
      onPress: () => navigation.navigate("InquiryHistory"),
    },
    {
      id: "help",
      title: "Help & Support",
      icon: "help",
      onPress: handleHelpSupport,
    },
    {
      id: "about",
      title: "About KNUST Pathfinder",
      icon: "info",
      onPress: handleAbout,
    },
  ]

  const renderStatCard = (title, value, icon, color) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Icon name={icon} size={24} color={color} />
    </View>
  )

  const renderMenuItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
      <View style={styles.menuItemLeft}>
        <Icon name={item.icon} size={24} color="#6B7280" />
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <Icon name="chevron-right" size={24} color="#D1D5DB" />
    </TouchableOpacity>
  )

  const renderSettingItem = (title, key, description) => (
    <View style={styles.settingItem}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Switch
        value={settings[key]}
        onValueChange={(value) => updateSetting(key, value)}
        trackColor={{ false: "#E5E7EB", true: "#BBF7D0" }}
        thumbColor={settings[key] ? "#006633" : "#F3F4F6"}
      />
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#006633" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Icon name="logout" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {userProfile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userProfile.name}</Text>
              <Text style={styles.profileEmail}>{userProfile.email}</Text>
              <Text style={styles.profileDetails}>
                {userProfile.program} • Level {userProfile.level}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Icon name="edit" size={20} color="#006633" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileDetailsSection}>
            <View style={styles.detailRow}>
              <Icon name="phone" size={16} color="#6B7280" />
              <Text style={styles.detailText}>{userProfile.phone}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="badge" size={16} color="#6B7280" />
              <Text style={styles.detailText}>Student ID: {userProfile.studentId}</Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="calendar-today" size={16} color="#6B7280" />
              <Text style={styles.detailText}>Joined {new Date(userProfile.joinDate).toLocaleDateString()}</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activity Overview</Text>
          <View style={styles.statsGrid}>
            {renderStatCard("Total Inquiries", stats.totalInquiries, "chat", "#006633")}
            {renderStatCard("Questions Answered", stats.answeredQuestions, "check-circle", "#10B981")}
            {renderStatCard("Saved Programs", stats.savedPrograms, "bookmark", "#F59E0B")}
            {renderStatCard("Days Active", stats.daysActive, "trending-up", "#8B5CF6")}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingsCard}>
            {renderSettingItem(
              "Push Notifications",
              "notifications",
              "Receive notifications about application updates",
            )}
            {renderSettingItem("Email Updates", "emailUpdates", "Get important updates via email")}
            {renderSettingItem("Dark Mode", "darkMode", "Use dark theme throughout the app")}
            {renderSettingItem("Biometric Login", "biometric", "Use fingerprint or face ID to login")}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>{menuItems.map(renderMenuItem)}</View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <View style={styles.dangerCard}>
            <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteAccount}>
              <Icon name="delete-forever" size={24} color="#EF4444" />
              <Text style={styles.dangerText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>KNUST Pathfinder v1.0.0</Text>
          <Text style={styles.appInfoText}>© 2025 KNUST. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#006633",
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#006633",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 2,
  },
  profileDetails: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  editButton: {
    padding: 8,
  },
  profileDetailsSection: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    width: "48%",
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: "#6B7280",
  },
  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#1F2937",
    marginLeft: 12,
  },
  dangerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  dangerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dangerText: {
    fontSize: 16,
    color: "#EF4444",
    marginLeft: 12,
    fontWeight: "500",
  },
  appInfo: {
    alignItems: "center",
    paddingVertical: 24,
  },
  appInfoText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
})

export default ProfileScreen
