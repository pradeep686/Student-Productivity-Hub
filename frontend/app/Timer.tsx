import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  Animated,
  Dimensions
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function PomodoroScreen() {
  const router = useRouter();

  // ----- CONFIG -----
  const FOCUS_TIME = 25 * 60;
  const SHORT_BREAK = 5 * 60;
  const LONG_BREAK = 15 * 60;
  const LONG_BREAK_INTERVAL = 4;

  // ----- STATES -----
  const [time, setTime] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "short" | "long">("focus");
  const [sessions, setSessions] = useState(0);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  
  // Refs for animations and timer
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ----- EFFECTS -----
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
  // Clear any existing timer
  if (timerRef.current) {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }

  if (isRunning && time > 0) {
    timerRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          // Timer reached 0, handle session end
          setTimeout(() => handleSessionEnd(), 100);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000) as unknown as NodeJS.Timeout;
    
    // Pulsing animation when running
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  } else {
    // Stop pulsing animation when not running
    pulseAnim.setValue(1);
  }

  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
}, [isRunning, time]);

  // ----- SESSION LOGIC -----
  const handleSessionEnd = () => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mode === "focus") {
      const newSessionCount = sessions + 1;
      setSessions(newSessionCount);
      setCompletedPomodoros(prev => prev + 1);

      if (newSessionCount % LONG_BREAK_INTERVAL === 0) {
        setMode("long");
        setTime(LONG_BREAK);
      } else {
        setMode("short");
        setTime(SHORT_BREAK);
      }
    } else {
      setMode("focus");
      setTime(FOCUS_TIME);
    }
    setIsRunning(false);
  };

  // ----- HELPERS -----
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleReset = () => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRunning(false);
    setMode("focus");
    setTime(FOCUS_TIME);
    // Reset sessions count on full reset
    setSessions(0);
    setCompletedPomodoros(0);
  };

  const handleModeChange = (newMode: "focus" | "short" | "long") => {
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRunning(false);
    setMode(newMode);
    
    // Set time based on new mode
    switch (newMode) {
      case "focus":
        setTime(FOCUS_TIME);
        break;
      case "short":
        setTime(SHORT_BREAK);
        break;
      case "long":
        setTime(LONG_BREAK);
        break;
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // ----- MODE CONFIG -----
  const modeConfig = {
    focus: {
      color: "#4CD964",
      darkColor: "#2E8B57",
      icon: 'school',
      title: 'Focus Time',
      emoji: '🎯'
    },
    short: {
      color: "#5AC8FA", 
      darkColor: "#007AFF",
      icon: 'cafe',
      title: 'Short Break',
      emoji: '☕'
    },
    long: {
      color: "#FF9500",
      darkColor: "#FF6B6B",
      icon: 'beer',
      title: 'Long Break',
      emoji: '🌴'
    }
  };

  const currentMode = modeConfig[mode];

  // Calculate progress for visual indicator
  const getProgressScale = () => {
    const totalTime = mode === "focus" ? FOCUS_TIME : 
                     mode === "short" ? SHORT_BREAK : 
                     LONG_BREAK;
    return 1 - (time / totalTime);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: currentMode.color }]}>
        <View style={styles.headerContent}>
          
          <Text style={styles.headerTitle}>Timer</Text>
          <Text style={styles.headerSubtitle}>Boost Your Productivity </Text>
        </View>
      </View>

<View style = {{height : 21}}></View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          
          {/* Timer Card */}
          <View style={styles.timerCard}>
            <Animated.View style={[
              styles.timerContainer,
              { transform: [{ scale: pulseAnim }] }
            ]}>
              <View style={[styles.progressCircle, { borderColor: currentMode.color }]}>
                <View style={[
                  styles.progressFill,
                  { 
                    backgroundColor: currentMode.color,
                    opacity: 0.2,
                    transform: [{ scale: 0.3 + (getProgressScale() * 0.7) }]
                  }
                ]} />
              </View>
              
              <Text style={styles.timerText}>{formatTime(time)}</Text>
              <Text style={[styles.modeText, { color: currentMode.color }]}>
                {currentMode.emoji} {currentMode.title}
              </Text>
            </Animated.View>
          </View>

          {/* Control Buttons */}
          <View style={styles.controlsCard}>
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[
                  styles.controlButton,
                  { backgroundColor: isRunning ? "#FF9500" : currentMode.color }
                ]}
                onPress={toggleTimer}
              >
                <Ionicons 
                  name={isRunning ? "pause" : "play"} 
                  size={24} 
                  color="#fff" 
                />
                <Text style={styles.controlButtonText}>
                  {isRunning ? "Pause" : "Start"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.controlButton, { backgroundColor: "#FF6B6B" }]}
                onPress={handleReset}
              >
                <Ionicons name="refresh" size={24} color="#fff" />
                <Text style={styles.controlButtonText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Mode Selection */}
          <View style={styles.modesCard}>
            <Text style={styles.sectionTitle}>Timer Modes</Text>
            <View style={styles.modesContainer}>
              {Object.entries(modeConfig).map(([key, config]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.modeButton,
                    mode === key && styles.activeModeButton,
                    { backgroundColor: config.color }
                  ]}
                  onPress={() => handleModeChange(key as any)}
                >
                  <Ionicons name={config.icon as any} size={20} color="#fff" />
                  <Text style={styles.modeButtonText}>{config.title}</Text>
                  <Text style={styles.modeTime}>
                    {key === "focus" ? formatTime(FOCUS_TIME) : 
                     key === "short" ? formatTime(SHORT_BREAK) : 
                     formatTime(LONG_BREAK)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Statistics */}
          <View style={styles.statsCard}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{completedPomodoros}</Text>
                <Text style={styles.statLabel}>Pomodoros</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{sessions}</Text>
                <Text style={styles.statLabel}>Sessions</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {Math.floor((completedPomodoros * FOCUS_TIME) / 3600)}
                </Text>
                <Text style={styles.statLabel}>Hours</Text>
              </View>
            </View>
          </View>

          {/* Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Pro Tips</Text>
            <Text style={styles.tipText}>• One Pomodoro = 25 min focus + 5 min break</Text>
            <Text style={styles.tipText}>• After 4 Pomodoros, take a 15-30 min break</Text>
            <Text style={styles.tipText}>• Avoid distractions during focus sessions</Text>
            <Text style={styles.tipText}>• Use breaks to stretch and relax your eyes</Text>
          </View>

          {/* Session Progress */}
          <View style={styles.progressCard}>
            <Text style={styles.sectionTitle}>Session Progress</Text>
            <View style={styles.sessionProgress}>
              {[...Array(4)].map((_, index) => (
                <View 
                  key={index}
                  style={[
                    styles.sessionDot,
                    index < sessions % 4 && styles.completedSessionDot,
                    { backgroundColor: index < sessions % 4 ? currentMode.color : '#e9ecef' }
                  ]}
                />
              ))}
            </View>
            <Text style={styles.progressText}>
              {sessions % 4}/4 sessions until long break
            </Text>
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
    height: height * 0.12,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 0,
    paddingHorizontal: 20,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContent: {
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 50,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
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
    marginTop: -40,
  },
  timerCard: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 30,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  timerContainer: {
    alignItems: 'center',
  },
  progressCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 8,
    borderColor: '#4CD964',
  },
  progressFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modeText: {
    fontSize: 18,
    fontWeight: '600',
  },
  controlsCard: {
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  controlButton: {
    flex: 1,
    borderRadius: 16,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modesCard: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  modesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modeButton: {
    flex: 1,
    borderRadius: 16,
    marginHorizontal: 5,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  activeModeButton: {
    transform: [{ scale: 1.05 }],
    shadowColor: '#667eea',
  },
  modeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  modeTime: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 10,
    marginTop: 2,
  },
  statsCard: {
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  tipsCard: {
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
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
  progressCard: {
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
  sessionProgress: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  sessionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  completedSessionDot: {
    transform: [{ scale: 1.2 }],
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
});