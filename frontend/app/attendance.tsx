import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  Animated,
  Dimensions
} from "react-native";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Sample weekly attendance data
const sampleWeeklyData = [
  { id: 1, date: "2024-01-15", day: "Monday", status: "Present", time: "09:15 AM", location: "College Campus" },
  { id: 2, date: "2024-01-16", day: "Tuesday", status: "Present", time: "09:05 AM", location: "College Campus" },
  { id: 3, date: "2024-01-17", day: "Wednesday", status: "Absent", time: "N/A", location: "N/A" },
  { id: 4, date: "2024-01-18", day: "Thursday", status: "Present", time: "08:55 AM", location: "College Campus" },
  { id: 5, date: "2024-01-19", day: "Friday", status: "Present", time: "09:20 AM", location: "College Campus" },
  { id: 6, date: "2024-01-20", day: "Saturday", status: "Weekend", time: "N/A", location: "N/A" },
  { id: 7, date: "2024-01-21", day: "Sunday", status: "Weekend", time: "N/A", location: "N/A" },
];

export default function AttendanceScreen() {
  const router = useRouter();
  const { role = "Student" } = useLocalSearchParams();
  const [location, setLocation] = useState<any>(null);
  const [status, setStatus] = useState<string>("Not Marked");
  const [loading, setLoading] = useState<boolean>(false);
  const [todayAttendance, setTodayAttendance] = useState<any>(null);
  const [weeklyData, setWeeklyData] = useState(sampleWeeklyData);
  const fadeAnim = new Animated.Value(0);

  // 📍 Request permission & fetch location
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location access is required to mark attendance.");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();

    // Animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Check if attendance already marked today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = weeklyData.find(record => record.date === today);
    if (todayRecord && todayRecord.status === "Present") {
      setStatus("Present");
      setTodayAttendance(todayRecord);
    }
  }, []);

  // 🕒 Mark attendance
  const handleMarkAttendance = async () => {
    if (!location) {
      Alert.alert("Error", "Unable to fetch location. Try again.");
      return;
    }

    setLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const today = new Date();
    const attendanceData = {
      id: weeklyData.length + 1,
      date: today.toISOString().split('T')[0],
      day: today.toLocaleDateString('en-US', { weekday: 'long' }),
      status: "Present",
      time: today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      location: "College Campus",
      coordinates: {
        latitude: location.latitude,
        longitude: location.longitude
      }
    };

    // Update today's attendance
    setTodayAttendance(attendanceData);
    setStatus("Present");

    // Update weekly data
    const updatedWeeklyData = weeklyData.map(record => 
      record.date === attendanceData.date ? attendanceData : record
    );
    setWeeklyData(updatedWeeklyData);

    setLoading(false);
    
    Alert.alert("✅ Success", `Attendance marked successfully at ${attendanceData.time}`, [
      { text: "View Details", onPress: () => {} },
      { text: "OK", onPress: () => {} },
    ]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Present": return "#4CD964";
      case "Absent": return "#FF3B30";
      case "Weekend": return "#8E8E93";
      default: return "#FF9500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Present": return "checkmark-circle";
      case "Absent": return "close-circle";
      case "Weekend": return "calendar";
      default: return "time";
    }
  };

  const presentDays = weeklyData.filter(r => r.status === "Present").length;
  const absentDays = weeklyData.filter(r => r.status === "Absent").length;
  const workingDays = weeklyData.filter(r => r.status !== "Weekend").length;
  const attendancePercentage = Math.round((presentDays / workingDays) * 100);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>📅 Attendance</Text>

        {role === "Student" ? (
          <Animated.View style={{ opacity: fadeAnim }}>

             <View style={[styles.statsCard, { marginBottom: 30 }]}>
  <View style={styles.statItem}>
    <Text style={styles.statNumber}>{presentDays}</Text>
    <Text style={styles.statLabel}>Present</Text>
  </View>
  <View style={styles.statItem}>
    <Text style={styles.statNumber}>{absentDays}</Text>
    <Text style={styles.statLabel}>Absent</Text>
  </View>
  <View style={styles.statItem}>
    <Text style={styles.statNumber}>{attendancePercentage}%</Text>
    <Text style={styles.statLabel}>Attendance</Text>
  </View>
</View>

            {/* Current Status Card */}
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Ionicons 
                  name={getStatusIcon(status)} 
                  size={32} 
                  color={getStatusColor(status)} 
                />
                <Text style={styles.statusTitle}>
                  {status === "Present" ? "Present" : "Today's Status"}
                </Text>
              </View>
              
              {status === "Present" && todayAttendance ? (
                <View style={styles.attendanceDetails}>
                  <Text style={styles.detailLabel}>Time: {todayAttendance.time}</Text>
                  <Text style={styles.detailLabel}>Location: {todayAttendance.location}</Text>
                  <Text style={styles.detailLabel}>
                    Coordinates: {location?.latitude.toFixed(4)}, {location?.longitude.toFixed(4)}
                  </Text>
                </View>
              ) : (
                <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
                  {status}
                </Text>
              )}
            </View>

            {/* Location Info */}
            <View style={styles.locationCard}>
              <Ionicons name="location" size={20} color="#007AFF" />
              <Text style={styles.locationText}>
                {location 
                  ? `Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                  : "Fetching your location..."
                }
              </Text>
            </View>

            {/* Mark Attendance Button */}
            {status !== "Present" && (
              <TouchableOpacity
                style={[
                  styles.button, 
                  loading && styles.buttonDisabled,
                ]}
                onPress={handleMarkAttendance}
                disabled={loading || status === "Present"}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.buttonText}>
                  {loading ? "Marking Attendance..." : "Mark Attendance for Today"}
                </Text>
              </TouchableOpacity>
            )}

            {/* Weekly Attendance */}
            <View style={styles.weeklySection}>
              <Text style={styles.sectionTitle}>This Week's Attendance</Text>
              {weeklyData.map((record) => (
                <View key={record.id} style={styles.weekItem}>
                  <View style={styles.weekDay}>
                    <Text style={styles.dayName}>{record.day}</Text>
                    <Text style={styles.date}>{record.date}</Text>
                  </View>
                  <View style={styles.weekStatus}>
                    <Ionicons 
                      name={getStatusIcon(record.status)} 
                      size={18} 
                      color={getStatusColor(record.status)} 
                    />
                    <Text style={[styles.statusLabel, { color: getStatusColor(record.status) }]}>
                      {record.status}
                    </Text>
                  </View>
                  <Text style={styles.weekTime}>{record.time}</Text>
                </View>
              ))}
            </View>

            {/* Stats */}
           
          </Animated.View>
        ) : (
          <View style={styles.teacherView}>
            <Ionicons name="school" size={60} color="#007AFF" />
            <Text style={styles.teacherTitle}>Teacher View</Text>
            <Text style={styles.teacherText}>
              You can view and print attendance sheets for all students from your dashboard.
            </Text>
            <TouchableOpacity style={styles.teacherButton}>
              <Text style={styles.teacherButtonText}>View Attendance Reports</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40, // Extra padding at bottom for better scrolling
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  statusCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 10,
    color: '#1a1a1a',
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  attendanceDetails: {
    marginTop: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  locationText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  weeklySection: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  weekItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  weekDay: {
    flex: 1,
  },
  dayName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  weekStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    minWidth: 80,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  weekTime: {
    fontSize: 12,
    color: '#666',
    minWidth: 60,
    textAlign: 'right',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  teacherView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    minHeight: 400,
  },
  teacherTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
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
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  teacherButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});