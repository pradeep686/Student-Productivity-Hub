import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Dimensions
} from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ReportsScreen() {
  const [selectedRange, setSelectedRange] = useState("Semester");
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Student Information
  const studentInfo = {
    name: "Pradeep T T",
    rollNumber: "7376222CT140",
    cgpa: "7.66",
    department: "Computer Technology",
    batch: "2022-2026"
  };

  // Course Data
  const courseData = [
    { courseCode: "22CT601", courseName: "DISTRIBUTED COMPUTING", semester: "6", grade: "A", result: "PASS" },
    { courseCode: "22CT602", courseName: "MACHINE LEARNING ESSENTIALS", semester: "6", grade: "A", result: "PASS" },
    { courseCode: "22CT603", courseName: "CLOUD COMPUTING", semester: "6", grade: "A", result: "PASS" },
    { courseCode: "22CT607", courseName: "MINI PROJECT II", semester: "6", grade: "A+", result: "PASS" },
    { courseCode: "22CT019", courseName: "CYBER SECURITY", semester: "6", grade: "A", result: "PASS" },
  ];

  // Extracurricular Activities
  const activitiesData = [
    { name: "Technical Competition", completed: 2, total: 5, icon: "trophy" },
    { name: "Paper Presentation", completed: 1, total: 3, icon: "document-text" },
    { name: "Project Competition", completed: 3, total: 4, icon: "code-slash" },
    { name: "Product Development", completed: 1, total: 2, icon: "construct" },
    { name: "Patent", completed: 0, total: 0, icon: "shield-checkmark" },
    { name: "Internship", completed: 1, total: 2, icon: "business" },
    { name: "Online Course", completed: 4, total: 6, icon: "laptop" },
  ];

  // Attendance Data
  const attendanceData = [
    { subject: "Mathematics", attendance: "92%", marks: "85/100" },
    { subject: "Physics", attendance: "88%", marks: "80/100" },
    { subject: "Chemistry", attendance: "95%", marks: "90/100" },
    { subject: "Computer Science", attendance: "96%", marks: "92/100" },
    { subject: "English", attendance: "90%", marks: "88/100" },
  ];

  const handleExportPDF = async () => {
    const html = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .student-info { margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #667eea; color: white; }
            .section { margin: 25px 0; }
            .cgpa-badge { 
              background: linear-gradient(135deg, #667eea, #764ba2); 
              color: white; 
              padding: 20px; 
              border-radius: 15px; 
              text-align: center;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Academic Performance Report</h1>
            <h3>${selectedRange} Report - ${new Date().toLocaleDateString()}</h3>
          </div>

          <div class="student-info">
            <h2>${studentInfo.name}</h2>
            <p><strong>Roll Number:</strong> ${studentInfo.rollNumber}</p>
            <p><strong>Department:</strong> ${studentInfo.department}</p>
            <p><strong>Batch:</strong> ${studentInfo.batch}</p>
          </div>

          <div class="cgpa-badge">
            <h2>Cumulative Grade Point Average (CGPA)</h2>
            <h1 style="font-size: 48px; margin: 10px 0;">${studentInfo.cgpa}</h1>
          </div>

          <div class="section">
            <h2>Course Performance</h2>
            <table>
              <tr>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Semester</th>
                <th>Grade</th>
                <th>Result</th>
              </tr>
              ${courseData.map(course => `
                <tr>
                  <td>${course.courseCode}</td>
                  <td>${course.courseName}</td>
                  <td>${course.semester}</td>
                  <td>${course.grade}</td>
                  <td>${course.result}</td>
                </tr>
              `).join('')}
            </table>
          </div>

          <div class="section">
            <h2>Attendance & Marks</h2>
            <table>
              <tr>
                <th>Subject</th>
                <th>Attendance</th>
                <th>Marks</th>
              </tr>
              ${attendanceData.map(item => `
                <tr>
                  <td>${item.subject}</td>
                  <td>${item.attendance}</td>
                  <td>${item.marks}</td>
                </tr>
              `).join('')}
            </table>
          </div>
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  const CourseItem = ({ item }: any) => (
    <View style={styles.courseItem}>
      <View style={styles.courseHeader}>
        <Text style={styles.courseCode}>{item.courseCode}</Text>
        <View style={[
          styles.gradeBadge,
          item.grade === "A+" && { backgroundColor: "#4CD964" }
        ]}>
          <Text style={styles.gradeText}>{item.grade}</Text>
        </View>
      </View>
      <Text style={styles.courseName}>{item.courseName}</Text>
      <View style={styles.courseFooter}>
        <Text style={styles.semester}>Semester {item.semester}</Text>
        <Text style={[
          styles.resultText,
          item.result === "PASS" ? styles.passText : styles.failText
        ]}>
          {item.result}
        </Text>
      </View>
    </View>
  );

  const ActivityItem = ({ item }: any) => (
    <View style={styles.activityItem}>
      <View style={styles.activityHeader}>
        <Ionicons name={item.icon as any} size={20} color="#667eea" />
        <Text style={styles.activityName}>{item.name}</Text>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${(item.completed / (item.total || 1)) * 100}%`,
                backgroundColor: item.completed === 0 ? "#ccc" : "#4CD964"
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {item.completed} out of {item.total || 1} Completed
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Gradient */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>📊 Performance Reports</Text>
          <Text style={styles.headerSubtitle}>Academic Progress Overview </Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        
        <View style = {{height : 10}}></View>

          {/* Student Info Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-circle" size={24} color="#667eea" />
              <Text style={styles.cardTitle}>Student Information</Text>
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{studentInfo.name}</Text>
              <Text style={styles.studentDetail}>Roll Number: {studentInfo.rollNumber}</Text>
              <Text style={styles.studentDetail}>Department: {studentInfo.department}</Text>
              <Text style={styles.studentDetail}>Batch: {studentInfo.batch}</Text>
            </View>
          </View>

          

          {/* Course Performance Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="school" size={24} color="#667eea" />
              <Text style={styles.cardTitle}>Course Performance - </Text>
              <Text style={styles.cardTitle}>CGPA: 7.66</Text>
            </View>
            <FlatList
              data={courseData}
              keyExtractor={(item) => item.courseCode}
              renderItem={({ item }) => <CourseItem item={item} />}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* Extracurricular Activities Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="trophy" size={24} color="#667eea" />
              <Text style={styles.cardTitle}>Extracurricular Activities</Text>
            </View>
            <View style={styles.activitiesGrid}>
              {activitiesData.map((activity, index) => (
                <ActivityItem key={index} item={activity} />
              ))}
            </View>
          </View>


          {/* Export Button */}
          <TouchableOpacity 
            style={styles.exportButton}
            onPress={handleExportPDF}
          >
            <LinearGradient
              colors={['#4CD964', '#2E8B57']}
              style={styles.exportGradient}
            >
              <Ionicons name="download" size={20} color="#fff" />
              <Text style={styles.exportButtonText}>Export as PDF</Text>
            </LinearGradient>
          </TouchableOpacity>
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
  filterCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  filterButtonActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
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
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  studentInfo: {
    // No additional styles needed
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  studentDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cgpaCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cgpaGradient: {
    padding: 25,
    alignItems: 'center',
    borderRadius: 20,
  },
  cgpaLabel: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 10,
    textAlign: 'center',
  },
  cgpaValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  cgpaSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  courseItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  courseCode: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  gradeBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gradeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  courseName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 18,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  semester: {
    fontSize: 12,
    color: '#666',
  },
  resultText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  passText: {
    color: '#4CD964',
  },
  failText: {
    color: '#FF3B30',
  },
  activitiesGrid: {
    // No additional styles needed
  },
  activityItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  progressContainer: {
    // No additional styles needed
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e9ecef',
    borderRadius: 3,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  attendanceItem: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subjectName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  attendancePercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  marksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  marksText: {
    fontSize: 14,
    color: '#666',
  },
  attendanceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  highAttendance: {
    backgroundColor: '#4CD964',
  },
  mediumAttendance: {
    backgroundColor: '#FF9500',
  },
  lowAttendance: {
    backgroundColor: '#FF3B30',
  },
  attendanceBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  exportButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#4CD964',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  exportGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});