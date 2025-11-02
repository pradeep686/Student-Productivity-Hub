import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Image,
  ScrollView,
  Animated,
  Dimensions
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Pre-defined assignment data with updated format
const predefinedAssignments = [
  {
    id: 1,
    subject: "Mathematics",
    topic: "Calculus Integration",
    content: "Solved problems on definite integrals and area under curves. Applied integration techniques to real-world physics problems.",
    hasImage: true,
    date: "2024-02-10",
    time: "14:30",
    status: "Submitted",
    marks: "85/100"
  },
  {
    id: 2,
    subject: "Physics",
    topic: "Quantum Mechanics Lab",
    content: "Wave-particle duality experiment with electron diffraction. Analysis of quantum superposition principles.",
    hasImage: false,
    date: "2024-02-15",
    time: "10:15",
    status: "Pending",
    marks: "Not Graded"
  },
  {
    id: 3,
    subject: "Chemistry",
    topic: "Organic Compounds Analysis",
    content: "Identification and characterization of organic functional groups. Spectroscopic analysis of unknown compounds.",
    hasImage: true,
    date: "2024-02-18",
    time: "16:45",
    status: "Submitted",
    marks: "92/100"
  },
  {
    id: 4,
    subject: "Computer Science",
    topic: "Data Structures Implementation",
    content: "Binary search tree implementation with traversal algorithms. Time complexity analysis of various operations.",
    hasImage: true,
    date: "2024-02-22",
    time: "09:20",
    status: "Submitted",
    marks: "88/100"
  }
];

export default function AssignmentScreen() {
  const router = useRouter();
  const { role = "Student" } = useLocalSearchParams();
  const [file, setFile] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [submissions, setSubmissions] = useState(predefinedAssignments);
  const [isLoading, setIsLoading] = useState(false);
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // 📂 Pick a document (PDF, Word, Image)
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "application/msword", "image/*"],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;
    setFile(result.assets ? result.assets[0] : result);
  };

  // 🖼️ Pick an image
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== "granted") {
      Alert.alert("Permission Denied", "Allow gallery access to pick an image");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  // 📤 Submit assignment
  const handleSubmit = async () => {
    if (!file) {
      Alert.alert("Error", "Please select a document or image first.");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Add new submission with the new format
    const newSubmission = {
      id: submissions.length + 1,
      subject: "General Studies",
      topic: "New Assignment Submission",
      content: comment || "Assignment submitted with attached files.",
      hasImage: file.mimeType?.includes("image") || false,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: "Submitted",
      marks: "Pending"
    };

    setSubmissions([newSubmission, ...submissions]);
    
    Alert.alert("✅ Success", "Assignment uploaded successfully!", [
      { text: "View Submissions", onPress: () => {} },
      { text: "OK", onPress: () => {} },
    ]);
    
    setFile(null);
    setComment("");
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted": return "#4CD964";
      case "Pending": return "#FF9500";
      case "Overdue": return "#FF3B30";
      default: return "#8E8E93";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Submitted": return "checkmark-circle";
      case "Pending": return "time";
      case "Overdue": return "alert-circle";
      default: return "document";
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>📝 Assignments</Text>
          <Text style={styles.headerSubtitle}>
            {role === "Student" ? "Submit your work " : "Review submissions"}
          </Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          
          {role === "Student" ? (
            <>
              {/* SPACE ADDED BETWEEN HEADER AND UPLOAD SECTION */}
              <View style={styles.space} />
              
              {/* Upload Section Card */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="cloud-upload" size={24} color="#667eea" />
                  <Text style={styles.cardTitle}>Upload Assignment</Text>
                </View>

                <View style={styles.uploadButtonsContainer}>
                  <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
                    <LinearGradient
                      colors={['#667eea', '#764ba2']}
                      style={styles.uploadGradient}
                    >
                      <Ionicons name="document-text" size={24} color="#fff" />
                      <Text style={styles.uploadButtonText}>Pick Document</Text>
                      <Text style={styles.uploadSubtext}>PDF, Word, etc.</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                    <LinearGradient
                      colors={['#FF6B6B', '#FF5252']}
                      style={styles.uploadGradient}
                    >
                      <Ionicons name="image" size={24} color="#fff" />
                      <Text style={styles.uploadButtonText}>Pick Image</Text>
                      <Text style={styles.uploadSubtext}>JPG, PNG, etc.</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                {/* File Preview */}
                {file && (
                  <View style={styles.previewCard}>
                    <View style={styles.previewHeader}>
                      <Ionicons name="document-attach" size={20} color="#667eea" />
                      <Text style={styles.previewTitle}>Selected File</Text>
                    </View>
                    <View style={styles.fileInfo}>
                      {file.mimeType?.includes("image") && (
                        <Image source={{ uri: file.uri }} style={styles.imagePreview} />
                      )}
                      <View style={styles.fileDetails}>
                        <Text style={styles.fileName} numberOfLines={1}>
                          {file.name || "Selected file"}
                        </Text>
                        <Text style={styles.fileSize}>
                          {file.size ? `Size: ${(file.size / 1024 / 1024).toFixed(2)} MB` : ''}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => setFile(null)}>
                        <Ionicons name="close-circle" size={24} color="#FF6B6B" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Comments Input - Bigger Box */}
                <View style={styles.commentsContainer}>
                  <Text style={styles.commentsLabel}>Comments / Notes</Text>
                  <TextInput
                    placeholder="Add any comments, notes, or instructions for your submission..."
                    placeholderTextColor="#999"
                    value={comment}
                    onChangeText={setComment}
                    style={styles.commentsInput}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>

                {/* Submit Button */}
                <TouchableOpacity 
                  style={[
                    styles.submitButton,
                    (!file || isLoading) && styles.submitButtonDisabled
                  ]}
                  onPress={handleSubmit}
                  disabled={!file || isLoading}
                >
                  <LinearGradient
                    colors={['#4CD964', '#2E8B57']}
                    style={styles.submitGradient}
                  >
                    {isLoading ? (
                      <Ionicons name="refresh" size={20} color="#fff" />
                    ) : (
                      <Ionicons name="paper-plane" size={20} color="#fff" />
                    )}
                    <Text style={styles.submitButtonText}>
                      {isLoading ? "Submitting..." : "Submit Assignment"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {/* Submissions History Card - UPDATED FORMAT */}
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <Ionicons name="list" size={24} color="#667eea" />
                  <Text style={styles.cardTitle}>Submission History</Text>
                </View>

                {submissions.map((assignment) => (
                  <View key={assignment.id} style={styles.assignmentItem}>
                    {/* Subject and Topic */}
                    <View style={styles.assignmentHeader}>
                      <View style={styles.subjectInfo}>
                        <Text style={styles.subjectName}>{assignment.subject}</Text>
                        <Text style={styles.topicName}>{assignment.topic}</Text>
                      </View>
                      <View style={styles.statusBadge}>
                        <Ionicons 
                          name={getStatusIcon(assignment.status)} 
                          size={16} 
                          color={getStatusColor(assignment.status)} 
                        />
                        <Text style={[styles.statusText, { color: getStatusColor(assignment.status) }]}>
                          {assignment.status}
                        </Text>
                      </View>
                    </View>
                    
                    {/* Content */}
                    <Text style={styles.contentText}>{assignment.content}</Text>
                    
                    {/* Image Status and Date/Time */}
                    <View style={styles.footerInfo}>
                      <View style={styles.imageStatus}>
                        <Ionicons 
                          name={assignment.hasImage ? "image" : "image-outline"} 
                          size={16} 
                          color={assignment.hasImage ? "#4CD964" : "#666"} 
                        />
                        <Text style={styles.imageStatusText}>
                          {assignment.hasImage ? "Image Uploaded" : "No Image"}
                        </Text>
                      </View>
                      <View style={styles.dateTime}>
                        <Ionicons name="time" size={14} color="#666" />
                        <Text style={styles.dateTimeText}>
                          {assignment.date}
                        </Text>
                      </View>
                    </View>

                    {/* Marks */}
                    <View style={styles.marksContainer}>
                      <Text style={styles.marksLabel}>Marks: </Text>
                      <Text style={[
                        styles.marksValue,
                        assignment.marks === "Pending" && { color: "#FF9500" },
                        assignment.marks === "Not Graded" && { color: "#FF3B30" }
                      ]}>
                        {assignment.marks}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            /* Teacher View */
            <View style={styles.teacherView}>
              <View style={styles.teacherCard}>
                <Ionicons name="school" size={60} color="#667eea" />
                <Text style={styles.teacherTitle}>Teacher Dashboard</Text>
                <Text style={styles.teacherText}>
                  You can review student submissions, grade assignments, and track submission status from your dashboard.
                </Text>
                <TouchableOpacity style={styles.teacherButton}>
                  <Text style={styles.teacherButtonText}>View All Submissions</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    height: height * 0.1,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  content: {
    padding: 20,
    marginTop: -20,
  },
  // ADDED SPACE BETWEEN HEADER AND CONTENT
  space: {
    height: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  uploadButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  uploadButton: {
    flex: 1,
    borderRadius: 16,
    marginHorizontal: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  uploadGradient: {
    padding: 20,
    alignItems: 'center',
    borderRadius: 16,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  uploadSubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  previewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePreview: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    color: '#666',
  },
  commentsContainer: {
    marginBottom: 20,
  },
  commentsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  commentsInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4CD964',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // UPDATED SUBMISSION HISTORY STYLES
  assignmentItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  topicName: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  contentText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  footerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  imageStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStatusText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  dateTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
  },
  marksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  marksLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  marksValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CD964',
  },
  teacherView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  teacherCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  teacherTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  teacherText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  teacherButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  teacherButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});