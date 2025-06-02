import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const samplePrograms = [
  {
    id: 1,
    name: 'Computer Science',
    faculty: 'Faculty of Computing and Information Systems',
    admissionChance: 'High',
    duration: '4 years',
    type: 'Regular',
    requirements: 'A1-C6 in Math (Core & Elective), Physics, Chemistry',
    description: 'Study software development, algorithms, and computer systems.',
  },
  {
    id: 2,
    name: 'Electrical Engineering',
    faculty: 'College of Engineering',
    admissionChance: 'Medium',
    duration: '4 years',
    type: 'Fee-Paying',
    requirements: 'A1-C6 in Math (Core & Elective), Physics, Chemistry',
    description: 'Design and develop electrical systems and devices.',
  },
  {
    id: 3,
    name: 'Information Technology',
    faculty: 'Faculty of Computing and Information Systems',
    admissionChance: 'High',
    duration: '4 years',
    type: 'Regular',
    requirements: 'A1-C6 in Math (Core), Physics, Any other subject',
    description: 'Focus on IT infrastructure, networks, and systems administration.',
  },
  {
    id: 4,
    name: 'Applied Physics',
    faculty: 'College of Science',
    admissionChance: 'Medium',
    duration: '4 years',
    type: 'Parallel',
    requirements: 'A1-C6 in Math (Core & Elective), Physics, Chemistry',
    description: 'Apply physics principles to solve real-world problems.',
  },
];

const ProgramRecommendations = ({ route, navigation }) => {
  const { course, results } = route.params || { course: '', results: {} };
  const [savedRecommendations, setSavedRecommendations] = useState([]);

  const getChanceColor = (chance) => {
    switch (chance) {
      case 'High':
        return { backgroundColor: '#DCFCE7', color: '#15803D' };
      case 'Medium':
        return { backgroundColor: '#FEF9C3', color: '#CA8A04' };
      case 'Low':
        return { backgroundColor: '#FEE2E2', color: '#DC2626' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#4B5563' };
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Regular':
        return { backgroundColor: '#DBEAFE', color: '#2563EB' };
      case 'Fee-Paying':
        return { backgroundColor: '#F3E8FF', color: '#7C3AED' };
      case 'Parallel':
        return { backgroundColor: '#FFEDD5', color: '#EA580C' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#4B5563' };
    }
  };

  const saveRecommendations = async () => {
    const recommendationsData = {
      course,
      results,
      programs: samplePrograms,
      timestamp: new Date().toISOString(),
    };

    try {
      const existingRecommendations = JSON.parse(
        (await AsyncStorage.getItem('knust-saved-recommendations')) || '[]'
      );
      existingRecommendations.push(recommendationsData);
      await AsyncStorage.setItem(
        'knust-saved-recommendations',
        JSON.stringify(existingRecommendations)
      );

      Toast.show({
        type: 'success',
        text1: 'Recommendations Saved!',
        text2: 'Your program recommendations have been saved to your profile.',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to save recommendations.',
      });
    }
  };

  const toggleSaveProgram = (programId) => {
    if (savedRecommendations.includes(programId)) {
      setSavedRecommendations((prev) => prev.filter((id) => id !== programId));
      Toast.show({
        type: 'info',
        text1: 'Program Removed',
        text2: 'Program removed from your saved list.',
      });
    } else {
      setSavedRecommendations((prev) => [...prev, programId]);
      Toast.show({
        type: 'success',
        text1: 'Program Saved',
        text2: 'Program added to your saved list.',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#006633" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate('WassceInput')}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Recommended Programs</Text>
          <Text style={styles.headerSubtitle}>Based on your profile</Text>
        </View>
        <Text style={styles.headerStep}>Step 3 of 3</Text>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoText}>
          <Text style={styles.infoTextBold}>Top 4 recommendations</Text> based on your {course} background and WASSCE results.
        </Text>
        <TouchableOpacity
          style={styles.saveAllButton}
          onPress={saveRecommendations}
        >
          <Icon name="bookmark" size={16} color="#1E40AF" />
          <Text style={styles.saveAllText}>Save All</Text>
        </TouchableOpacity>
      </View>

      {/* Programs List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {samplePrograms.map((program) => (
          <View key={program.id} style={styles.programCard}>
            <View style={styles.programHeader}>
              <View style={styles.programInfo}>
                <Text style={styles.programName}>{program.name}</Text>
                <Text style={styles.programFaculty}>{program.faculty}</Text>
              </View>
              <View style={styles.programTags}>
                <Text
                  style={[
                    styles.tag,
                    getChanceColor(program.admissionChance),
                  ]}
                >
                  {program.admissionChance} Chance
                </Text>
                <Text
                  style={[styles.tag, getTypeColor(program.type)]}
                >
                  {program.type}
                </Text>
              </View>
            </View>

            <Text style={styles.programDescription}>{program.description}</Text>

            <View style={styles.programDetails}>
              <View style={styles.detailRow}>
                <Icon name="schedule" size={16} color="#4B5563" />
                <Text style={styles.detailText}>Duration: {program.duration}</Text>
              </View>
              <Text style={styles.requirements}>
                <Text style={styles.requirementsBold}>Requirements: </Text>
                {program.requirements}
              </Text>
            </View>

            <View style={styles.programActions}>
              <TouchableOpacity style={styles.learnMoreButton}>
                <Text style={styles.learnMoreText}>Learn More</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.saveButton,
                  savedRecommendations.includes(program.id) && styles.savedButton,
                ]}
                onPress={() => toggleSaveProgram(program.id)}
              >
                <Icon
                  name={savedRecommendations.includes(program.id) ? 'check' : 'bookmark'}
                  size={16}
                  color={savedRecommendations.includes(program.id) ? '#15803D' : '#6B7280'}
                />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.askButton}
          onPress={() => navigation.navigate('Chat')}
        >
          <Text style={styles.askButtonText}>Ask Questions About These Programs</Text>
        </TouchableOpacity>
      </View>

      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#006633',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#DCFCE7',
    fontSize: 14,
  },
  headerStep: {
    color: '#DCFCE7',
    fontSize: 14,
  },
  infoBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    padding: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1E3A8A',
  },
  infoTextBold: {
    fontWeight: 'bold',
  },
  saveAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  saveAllText: {
    color: '#1E40AF',
    fontSize: 14,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  programCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  programHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  programInfo: {
    flex: 1,
  },
  programName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  programFaculty: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  programTags: {
    alignItems: 'flex-end',
  },
  tag: {
    fontSize: 12,
    fontWeight: '500',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 4,
  },
  programDescription: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 12,
  },
  programDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  requirements: {
    fontSize: 12,
    color: '#6B7280',
  },
  requirementsBold: {
    fontWeight: 'bold',
  },
  programActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnMoreButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#15803D',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  learnMoreText: {
    color: '#15803D',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  savedButton: {
    borderColor: '#15803D',
    backgroundColor: '#DCFCE7',
  },
  actionContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  askButton: {
    backgroundColor: '#006633',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  askButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ProgramRecommendations;