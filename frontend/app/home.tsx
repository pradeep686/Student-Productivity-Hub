import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Animated,
  Dimensions 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Define proper TypeScript types
type ScreenRoute = "/attendance" | "/assignment" | "/notes" | "/reports" | "/profile" | "/Timer";
type IconName = "calendar" | "document-text" | "book" | "bar-chart" | "person" | "print" | "log-out-outline" | "person-circle";

interface Feature {
  id: number;
  title: string;
  icon: IconName;
  color: readonly [string, string];
  screen: ScreenRoute;
  emoji: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { role: routeRole } = useLocalSearchParams();
  const [role, setRole] = useState("Student");
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  // ✅ Load role from route or AsyncStorage
  useEffect(() => {
    const fetchUserRole = async () => {
      if (routeRole) {
        setRole(routeRole as string);
        await AsyncStorage.setItem("userRole", routeRole as string);
      } else {
        const storedRole = await AsyncStorage.getItem("userRole");
        if (storedRole) setRole(storedRole);
      }
    };
    fetchUserRole();

    // Animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [routeRole]);

  // ✅ Logout
  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/login");
  };

 const features: Feature[] = [
  {
    id: 5,
    title: "Profile",
    icon: "person",
    color: ["#fa709a", "#fee140"] as const,
    screen: "/profile",
    emoji: "👤"
  },
  {
    id: 1,
    title: "Mark Attendance",
    icon: "calendar",
    color: ["#667eea", "#764ba2"] as const,
    screen: "/attendance",
    emoji: "📅"
  },
  {
    id: 2,
    title: "Submit Assignments",
    icon: "document-text",
    color: ["#f093fb", "#f5576c"] as const,
    screen: "/assignment",
    emoji: "📝"
  },
  {
    id: 3,
    title: "Study Notes",
    icon: "book",
    color: ["#4facfe", "#00f2fe"] as const,
    screen: "/notes",
    emoji: "📖"
  },
  
{
  id: 7,
  title: "Study Timer",
  icon: "person", // or "time"
  color: ["#4CD964", "#2E8B57"] as const, // Green for focus
  screen: "/Timer",
  emoji: "📚" // Books + clock
},
  {
    id: 4,
    title: "View Reports",
    icon: "bar-chart",
    color: ["#43e97b", "#38f9d7"] as const,
    screen: "/reports",
    emoji: "📊"
  },
   
];

const teacherFeature: Feature = {
  id: 6,
  title: "Print Attendance Sheet",
  icon: "print",
  color: ["#6C63FF", "#8B85FF"] as const,
  screen: "/Timer",
  emoji: "🧾"
};

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <LinearGradient
  colors={['#667eea', '#764ba2'] as const}
  style={styles.header}
>
        <View style={styles.headerContent}>
          <View style={styles.avatar}>
            <Ionicons name="person-circle" size={60} color="#fff" />
          </View>
          <Text style={styles.welcome}>Welcome back!</Text>
          <Text style={styles.role}>{role}</Text>
          <View style={styles.statusIndicator}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Features Grid */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <View style={styles.grid}>
          {features.map((feature, index) => (
            <Animated.View
              key={feature.id}
              style={[
                styles.featureCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.featureButton}
                onPress={() => router.push(feature.screen)}
              >
                <LinearGradient
                  colors={feature.color}
                  style={styles.gradientBackground}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.emoji}>{feature.emoji}</Text>
                  <Ionicons 
                    name={feature.icon} 
                    size={24} 
                    color="#fff" 
                    style={styles.icon} 
                  />
                </LinearGradient>
                <Text style={styles.featureTitle}>{feature.title}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}

          {/* Teacher Only Feature */}
          {role === "Teacher" && (
            <Animated.View
              style={[
                styles.featureCard,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.featureButton}
                onPress={() => router.push(teacherFeature.screen)}
              >
                <LinearGradient
                  colors={teacherFeature.color}
                  style={styles.gradientBackground}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.emoji}>{teacherFeature.emoji}</Text>
                  <Ionicons 
                    name={teacherFeature.icon} 
                    size={24} 
                    color="#fff" 
                    style={styles.icon} 
                  />
                </LinearGradient>
                <Text style={styles.featureTitle}>{teacherFeature.title}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>

        {/* Logout Button */}
        <Animated.View
          style={[
            styles.logoutContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <LinearGradient
  colors={['#FF5252', '#FF6B6B'] as const}
  style={styles.logoutGradient}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
              <Ionicons name="log-out-outline" size={20} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
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
    height: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 10,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  role: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginBottom: 10,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CD964',
    marginRight: 6,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2D3748',
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: (width - 60) / 2,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  featureButton: {
    alignItems: 'center',
    padding: 15,
  },
  gradientBackground: {
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  emoji: {
    fontSize: 24,
    position: 'absolute',
    top: 8,
    left: 8,
  },
  icon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
    textAlign: 'center',
    lineHeight: 18,
  },
  logoutContainer: {
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});