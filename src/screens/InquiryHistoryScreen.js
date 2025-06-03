"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import Icon from "react-native-vector-icons/MaterialIcons"

const InquiryHistoryScreen = ({ navigation }) => {
  const [inquiries, setInquiries] = useState([])
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    loadInquiries()
  }, [])

  const loadInquiries = async () => {
    try {
      const savedInquiries = await AsyncStorage.getItem("inquiryHistory")
      if (savedInquiries) {
        const parsed = JSON.parse(savedInquiries)
        // Convert timestamp strings back to Date objects
        const inquiriesWithDates = parsed.map(inquiry => ({
          ...inquiry,
          timestamp: inquiry.timestamp ? new Date(inquiry.timestamp) : null
        }))
        setInquiries(inquiriesWithDates)
      } else {
        // Demo data for illustration
        const demoInquiries = [
          {
            id: "1",
            type: "chat",
            title: "Computer Science Requirements",
            question: "What are the requirements for BSc Computer Science?",
            answer:
              "For BSc Computer Science at KNUST, you need: Core subjects: A1-C6 in English, Mathematics, Integrated Science...",
            timestamp: new Date("2024-12-20T10:30:00"),
            status: "answered",
            category: "programs",
          },
          {
            id: "2",
            type: "application",
            title: "Application Status Check",
            question: "What is the status of my application?",
            answer: "Your application is currently under review. You will be notified once a decision is made.",
            timestamp: new Date("2024-12-19T14:15:00"),
            status: "pending",
            category: "admission",
          },
          {
            id: "3",
            type: "chat",
            title: "Tuition Fees Information",
            question: "How much are the tuition fees for engineering programs?",
            answer:
              "Engineering program fees vary by stream: Regular stream: GHS 3,000-4,000, Fee-paying: GHS 10,000-15,000...",
            timestamp: new Date("2024-12-18T09:45:00"),
            status: "answered",
            category: "fees",
          },
          {
            id: "4",
            type: "support",
            title: "Document Upload Issue",
            question: "I am having trouble uploading my documents",
            answer: "Please ensure your documents are in PDF format and under 5MB. Try clearing your browser cache...",
            timestamp: new Date("2024-12-17T16:20:00"),
            status: "resolved",
            category: "technical",
          },
          {
            id: "5",
            type: "chat",
            title: "Campus Accommodation",
            question: "Is accommodation available on campus?",
            answer:
              "Yes, KNUST provides on-campus accommodation in various halls of residence. Room allocation is competitive...",
            timestamp: new Date("2024-12-16T11:30:00"),
            status: "answered",
            category: "campus",
          },
        ]
        setInquiries(demoInquiries)
        await AsyncStorage.setItem("inquiryHistory", JSON.stringify(demoInquiries))
      }
    } catch (error) {
      console.error("Error loading inquiries:", error)
    }
  }

  const filterOptions = [
    { id: "all", label: "All", count: inquiries.length },
    { id: "answered", label: "Answered", count: inquiries.filter((i) => i.status === "answered").length },
    { id: "pending", label: "Pending", count: inquiries.filter((i) => i.status === "pending").length },
    { id: "resolved", label: "Resolved", count: inquiries.filter((i) => i.status === "resolved").length },
  ]

  const filteredInquiries = filter === "all" ? inquiries : inquiries.filter((inquiry) => inquiry.status === filter)

  const getStatusColor = (status) => {
    switch (status) {
      case "answered":
        return "#10B981"
      case "pending":
        return "#F59E0B"
      case "resolved":
        return "#6366F1"
      default:
        return "#6B7280"
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "chat":
        return "chat"
      case "application":
        return "description"
      case "support":
        return "support"
      default:
        return "help"
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case "programs":
        return "#006633"
      case "admission":
        return "#FFC107"
      case "fees":
        return "#FF6B35"
      case "campus":
        return "#8B5CF6"
      case "technical":
        return "#EF4444"
      default:
        return "#6B7280"
    }
  }

  const formatDate = (date) => {
    if (!date) return "Unknown date"
    
    // Convert to Date object if it's not already
    const dateObj = date instanceof Date ? date : new Date(date)
    
    // Check if the date is valid
    if (isNaN(dateObj.getTime())) return "Invalid date"
    
    const now = new Date()
    const diffTime = Math.abs(now - dateObj)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return "Today"
    } else if (diffDays === 2) {
      return "Yesterday"
    } else if (diffDays <= 7) {
      return `${diffDays - 1} days ago`
    } else {
      return dateObj.toLocaleDateString()
    }
  }

  const handleDeleteInquiry = (inquiryId) => {
    Alert.alert("Delete Inquiry", "Are you sure you want to delete this inquiry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updatedInquiries = inquiries.filter((inquiry) => inquiry.id !== inquiryId)
          setInquiries(updatedInquiries)
          await AsyncStorage.setItem("inquiryHistory", JSON.stringify(updatedInquiries))
        },
      },
    ])
  }

  const handleClearAll = () => {
    Alert.alert(
      "Clear All History",
      "Are you sure you want to clear all inquiry history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            setInquiries([])
            await AsyncStorage.removeItem("inquiryHistory")
          },
        },
      ],
    )
  }

  const renderFilterTab = (option) => (
    <TouchableOpacity
      key={option.id}
      style={[styles.filterTab, filter === option.id && styles.activeFilterTab]}
      onPress={() => setFilter(option.id)}
    >
      <Text style={[styles.filterTabText, filter === option.id && styles.activeFilterTabText]}>{option.label}</Text>
      <View style={[styles.filterTabBadge, filter === option.id && styles.activeFilterTabBadge]}>
        <Text style={[styles.filterTabBadgeText, filter === option.id && styles.activeFilterTabBadgeText]}>
          {option.count}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const renderInquiryItem = (inquiry) => (
    <View key={inquiry.id} style={styles.inquiryCard}>
      <View style={styles.inquiryHeader}>
        <View style={styles.inquiryHeaderLeft}>
          <View style={[styles.typeIcon, { backgroundColor: getCategoryColor(inquiry.category) }]}>
            <Icon name={getTypeIcon(inquiry.type)} size={16} color="#FFFFFF" />
          </View>
          <View style={styles.inquiryInfo}>
            <Text style={styles.inquiryTitle} numberOfLines={1}>
              {inquiry.title}
            </Text>
            <Text style={styles.inquiryDate}>{formatDate(inquiry.timestamp)}</Text>
          </View>
        </View>
        <View style={styles.inquiryHeaderRight}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(inquiry.status) }]}>
            <Text style={styles.statusText}>{inquiry.status}</Text>
          </View>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteInquiry(inquiry.id)}>
            <Icon name="delete" size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inquiryContent}>
        <Text style={styles.questionLabel}>Question:</Text>
        <Text style={styles.questionText} numberOfLines={2}>
          {inquiry.question}
        </Text>

        {inquiry.answer && (
          <>
            <Text style={styles.answerLabel}>Answer:</Text>
            <Text style={styles.answerText} numberOfLines={3}>
              {inquiry.answer}
            </Text>
          </>
        )}
      </View>

      <View style={styles.inquiryActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="visibility" size={16} color="#006633" />
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>

        {inquiry.type === "chat" && (
          <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate("Chat")}>
            <Icon name="chat" size={16} color="#006633" />
            <Text style={styles.actionButtonText}>Continue Chat</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#006633" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inquiry History</Text>
        {inquiries.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Icon name="clear-all" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterOptions.map(renderFilterTab)}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredInquiries.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="history" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>
              {filter === "all" ? "No inquiries yet" : `No ${filter} inquiries`}
            </Text>
            <Text style={styles.emptyStateDescription}>
              {filter === "all"
                ? "Start chatting with our AI assistant to see your inquiry history here."
                : `You don't have any ${filter} inquiries at the moment.`}
            </Text>
            {filter === "all" && (
              <TouchableOpacity style={styles.startChatButton} onPress={() => navigation.navigate("Chat")}>
                <Text style={styles.startChatButtonText}>Start Chat</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.inquiriesList}>{filteredInquiries.map(renderInquiryItem)}</View>
        )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  clearButton: {
    padding: 4,
  },
  filterContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  activeFilterTab: {
    backgroundColor: "#006633",
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginRight: 6,
  },
  activeFilterTabText: {
    color: "#FFFFFF",
  },
  filterTabBadge: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  activeFilterTabBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  filterTabBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  activeFilterTabBadgeText: {
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  inquiriesList: {
    paddingVertical: 16,
  },
  inquiryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  inquiryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  inquiryHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  typeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  inquiryInfo: {
    flex: 1,
  },
  inquiryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  inquiryDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  inquiryHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  deleteButton: {
    padding: 4,
  },
  inquiryContent: {
    marginBottom: 12,
  },
  questionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  questionText: {
    fontSize: 14,
    color: "#1F2937",
    marginBottom: 8,
    lineHeight: 20,
  },
  answerLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  answerText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  inquiryActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionButtonText: {
    fontSize: 14,
    color: "#006633",
    fontWeight: "500",
    marginLeft: 4,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  startChatButton: {
    backgroundColor: "#006633",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  startChatButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
})

export default InquiryHistoryScreen
