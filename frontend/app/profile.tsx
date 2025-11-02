import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Alert, 
  TouchableOpacity, 
  ScrollView,
  Animated 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const fadeAnim = new Animated.Value(0);
  
  // User profile data
  const [profile, setProfile] = useState({
    name: "Pradeep T T",
    email: "pradeep.ct22@bitsathy.ac.in.com",
    phone: "8072550945",
    rollNumber: "7376222CT140",
    role: "Student",
    dob: "2005-05-15",
    bloodGroup: "AB+",
    department: "Computer Technology",
    batch: "2022-2026"
  });

  useEffect(() => {
    loadProfileData();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadProfileData = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem("userProfile");
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.log("Error loading profile:", error);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    await AsyncStorage.setItem("userProfile", JSON.stringify(profile));
    Alert.alert("✅ Profile Updated", "Your details were saved successfully!");
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace("/login");
          }
        }
      ]
    );
  };

  const updateProfileField = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const ProfileField = ({ label, value, field, editable = true, icon }: any) => (
    <View style={styles.fieldContainer}>
      <View style={styles.fieldHeader}>
        <Ionicons name={icon} size={18} color="#667eea" />
        <Text style={styles.fieldLabel}>{label}</Text>
      </View>
      <TextInput
        style={[
          styles.fieldInput,
          !editable && styles.disabledField
        ]}
        value={value}
        onChangeText={(text) => updateProfileField(field, text)}
        editable={isEditing && editable}
        placeholderTextColor="#999"
      />
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
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color="#fff" />
          </View>
          <Text style={styles.userName}>{profile.name}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{profile.department}</Text>
          </View>
        </View>
      </LinearGradient>

      

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

           <Text style={{height : 31}}></Text>
         
          {/* Personal Information Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person-circle" size={24} color="#667eea" />
              <Text style={styles.cardTitle}>Personal Information</Text>
            </View>
            
            <ProfileField 
              label="Full Name" 
              value={profile.name} 
              field="name" 
              icon="person-outline"
            />
            <ProfileField 
              label="Email ID" 
              value={profile.email} 
              field="email" 
              icon="mail-outline"
            />
            <ProfileField 
              label="Phone Number" 
              value={profile.phone} 
              field="phone" 
              icon="call-outline"
            />
            <ProfileField 
              label="Date of Birth" 
              value={profile.dob} 
              field="dob" 
              icon="calendar-outline"
            />
            <ProfileField 
              label="Blood Group" 
              value={profile.bloodGroup} 
              field="bloodGroup" 
              icon="water-outline"
            />
          </View>

          {/* Academic Information Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="school" size={24} color="#667eea" />
              <Text style={styles.cardTitle}>Academic Information</Text>
            </View>
            
            <ProfileField 
              label="Roll Number" 
              value={profile.rollNumber} 
              field="rollNumber" 
              icon="id-card-outline"
            />
            <ProfileField 
              label="Department" 
              value={profile.department} 
              field="department" 
              icon="business-outline"
            />
            <ProfileField 
              label="Batch" 
              value={profile.batch} 
              field="batch" 
              icon="time-outline"
            />
            <ProfileField 
              label="Role" 
              value={profile.role} 
              field="role" 
              editable={false}
              icon="person-outline"
            />
          </View>

          {/* Statistics Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="stats-chart" size={24} color="#667eea" />
              <Text style={styles.cardTitle}>Academic Status </Text>
            </View>
            
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>85%</Text>
                <Text style={styles.statLabel}>Attendance</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>5</Text>
                <Text style={styles.statLabel}>Projects</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>7.66</Text>
                <Text style={styles.statLabel}>CGPA</Text>
              </View>
               <View style={styles.statItem}>
                <Text style={styles.statNumber}>0</Text>
                <Text style={styles.statLabel}>Arrear Count</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>45</Text>
                <Text style={styles.statLabel}>Study Notes</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[
                styles.actionButton,
                isEditing ? styles.saveButton : styles.editButton
              ]}
              onPress={isEditing ? handleSave : () => setIsEditing(true)}
            >
              <LinearGradient
                colors={isEditing ? ['#4CD964', '#2E8B57'] : ['#667eea', '#764ba2']}
                style={styles.gradientButton}
              >
                <Ionicons 
                  name={isEditing ? "checkmark-circle" : "create-outline"} 
                  size={20} 
                  color="#fff" 
                />
                <Text style={styles.actionButtonText}>
                  {isEditing ? "Save Changes" : "Edit Profile"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FF5252']}
                style={styles.gradientButton}
              >
                <Ionicons name="log-out-outline" size={20} color="#fff" />
                <Text style={styles.actionButtonText}>Logout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    height: 210,
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userRole: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    marginTop: -40,
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
  fieldContainer: {
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  fieldInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
  },
  disabledField: {
    backgroundColor: '#f1f3f4',
    color: '#666',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  actionsContainer: {
    marginBottom: 30,
  },
  actionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  editButton: {
    shadowColor: '#667eea',
  },
  saveButton: {
    shadowColor: '#4CD964',
  },
  logoutButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});