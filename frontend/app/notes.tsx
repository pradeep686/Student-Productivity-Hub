import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Sample notes data
const sampleNotes = [
  {
    id: 1,
    text: "Mathematics: Calculus derivatives and integration formulas. Need to practice chain rule problems.",
    timestamp: "2024-02-15 10:30",
    subject: "Mathematics",
    color: "#667eea"
  },
  {
    id: 2,
    text: "Physics: Quantum mechanics principles - wave-particle duality and Heisenberg uncertainty principle.",
    timestamp: "2024-02-14 14:20",
    subject: "Physics",
    color: "#FF6B6B"
  },
  {
    id: 3,
    text: "Computer Science: Data structures - Binary trees traversal methods and time complexity analysis.",
    timestamp: "2024-02-13 16:45",
    subject: "Computer Science",
    color: "#4CD964"
  },
  {
    id: 4,
    text: "Chemistry: Organic compounds nomenclature and functional groups identification techniques.",
    timestamp: "2024-02-12 09:15",
    subject: "Chemistry",
    color: "#FF9500"
  },
  {
    id: 5,
    text: "Biology: Cell division process - mitosis and meiosis stages with diagrammatic representations.",
    timestamp: "2024-02-11 11:30",
    subject: "Biology",
    color: "#5AC8FA"
  },
  {
    id: 6,
    text: "English Literature: Shakespeare's Hamlet character analysis and major themes of revenge and madness.",
    timestamp: "2024-02-10 15:20",
    subject: "English",
    color: "#AF52DE"
  },
  {
    id: 7,
    text: "Mathematics: Linear algebra - matrix operations, determinants, and solving systems of equations.",
    timestamp: "2024-02-09 08:45",
    subject: "Mathematics",
    color: "#667eea"
  },
  {
    id: 8,
    text: "Physics: Electromagnetic theory - Maxwell's equations and their applications in wave propagation.",
    timestamp: "2024-02-08 13:10",
    subject: "Physics",
    color: "#FF6B6B"
  },
  {
    id: 9,
    text: "Computer Science: Database management systems - SQL queries, normalization, and transaction processing.",
    timestamp: "2024-02-07 17:35",
    subject: "Computer Science",
    color: "#4CD964"
  },
  {
    id: 10,
    text: "Chemistry: Chemical bonding theories - VSEPR theory, hybridization, and molecular geometry.",
    timestamp: "2024-02-06 10:50",
    subject: "Chemistry",
    color: "#FF9500"
  },
  {
    id: 11,
    text: "Biology: Genetics and inheritance patterns - Mendelian genetics, Punnett squares, and DNA structure.",
    timestamp: "2024-02-05 14:25",
    subject: "Biology",
    color: "#5AC8FA"
  },
  {
    id: 12,
    text: "English Grammar: Advanced sentence structures - complex sentences, clauses, and punctuation rules.",
    timestamp: "2024-02-04 09:40",
    subject: "English",
    color: "#AF52DE"
  }
];

export default function NotesScreen() {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [editingNote, setEditingNote] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [isExpanded, setIsExpanded] = useState(false);
  const fadeAnim = new Animated.Value(0);

  const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Computer Science", "Biology", "English"];

  // 🔹 Load notes from storage
  useEffect(() => {
    const loadNotes = async () => {
      const saved = await AsyncStorage.getItem("notes");
      if (saved) {
        setNotes(JSON.parse(saved));
      } else {
        // Load sample notes if no saved notes
        setNotes(sampleNotes);
      }
    };
    loadNotes();
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // 🔹 Save notes whenever updated
  useEffect(() => {
    AsyncStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // 🔹 Add or update note
  const handleAddNote = () => {
    if (!note.trim()) {
      Alert.alert("📝 Oops!", "Please write something before saving!");
      return;
    }
    
    if (editingNote !== null) {
      setNotes((prev) =>
        prev.map((n) => 
          n.id === editingNote ? { 
            ...n, 
            text: note,
            timestamp: new Date().toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })
          } : n
        )
      );
      setEditingNote(null);
    } else {
      const newNote = {
        id: Date.now(),
        text: note,
        timestamp: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        subject: selectedSubject === "All" ? "General" : selectedSubject,
        color: getRandomColor()
      };
      setNotes((prev) => [newNote, ...prev]);
    }
    setNote("");
    setIsExpanded(false);
  };

  // 🔹 Edit existing note
  const handleEdit = (noteItem: any) => {
    setNote(noteItem.text);
    setEditingNote(noteItem.id);
    setSelectedSubject(noteItem.subject);
    setIsExpanded(true);
  };

  // 🔹 Delete note
  const handleDelete = (id: number) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => setNotes(notes.filter((n) => n.id !== id))
        }
      ]
    );
  };

  const getRandomColor = () => {
    const colors = ["#667eea", "#764ba2", "#FF6B6B", "#4CD964", "#FF9500", "#5AC8FA", "#AF52DE"];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const filteredNotes = selectedSubject === "All" 
    ? notes 
    : notes.filter(note => note.subject === selectedSubject);

  const NoteCard = ({ item }: any) => (
    <View style={styles.noteCard}>
      <View style={[styles.subjectBadge, { backgroundColor: item.color }]}>
        <Text style={styles.subjectText}>{item.subject}</Text>
      </View>
      <Text style={styles.noteText}>{item.text}</Text>
      <View style={styles.noteFooter}>
        <Text style={styles.timestamp}>
          <Ionicons name="time" size={12} color="#666" />
          {" "}{item.timestamp}
        </Text>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="create-outline" size={18} color="#667eea" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleDelete(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
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
          <Text style={styles.headerTitle}>📚 Study Notes</Text>
          <Text style={styles.headerSubtitle}>Capture your learning journey </Text>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

          <View style={{ height: 21 }} />
          
          {/* Add Note Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="create" size={24} color="#667eea" />
              <Text style={styles.cardTitle}>
                {editingNote ? "Edit Note" : "Create New Note"}
              </Text>
            </View>

            {/* Subject Selection */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.subjectScroll}
            >
              {subjects.map((subject) => (
                <TouchableOpacity
                  key={subject}
                  style={[
                    styles.subjectChip,
                    selectedSubject === subject && styles.selectedSubjectChip
                  ]}
                  onPress={() => setSelectedSubject(subject)}
                >
                  <Text style={[
                    styles.subjectChipText,
                    selectedSubject === subject && styles.selectedSubjectChipText
                  ]}>
                    {subject}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Note Input */}
            <TextInput
              style={styles.noteInput}
              placeholder="Write your study notes, formulas, concepts, or important points..."
              placeholderTextColor="#999"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={isExpanded ? 6 : 3}
              textAlignVertical="top"
              onFocus={() => setIsExpanded(true)}
            />

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {editingNote && (
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {
                    setEditingNote(null);
                    setNote("");
                    setSelectedSubject("All");
                    setIsExpanded(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity 
                style={[
                  styles.addButton,
                  !note.trim() && styles.addButtonDisabled
                ]}
                onPress={handleAddNote}
                disabled={!note.trim()}
              >
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.addButtonGradient}
                >
                  <Ionicons 
                    name={editingNote ? "checkmark" : "add"} 
                    size={20} 
                    color="#fff" 
                  />
                  <Text style={styles.addButtonText}>
                    {editingNote ? "Update Note" : "Add Note"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Statistics Card */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{notes.length}</Text>
              <Text style={styles.statLabel}>Total Notes</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {new Set(notes.map(note => note.subject)).size}
              </Text>
              <Text style={styles.statLabel}>Subjects</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {Math.ceil(notes.reduce((acc, note) => acc + note.text.split(' ').length, 0) / 100)}
              </Text>
              <Text style={styles.statLabel}>Pages</Text>
            </View>
          </View>

          {/* Notes List */}
          <View style={styles.notesSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list" size={24} color="#667eea" />
              <Text style={styles.sectionTitle}>
                Your Notes ({filteredNotes.length})
              </Text>
            </View>

            {filteredNotes.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="document-text" size={60} color="#ccc" />
                <Text style={styles.emptyTitle}>No notes yet</Text>
                <Text style={styles.emptyText}>
                  {selectedSubject === "All" 
                    ? "Start writing your first note to capture your learning!"
                    : `No notes found for ${selectedSubject}. Create one now!`
                  }
                </Text>
              </View>
            ) : (
              <FlatList
                data={filteredNotes}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <NoteCard item={item} />}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            )}
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
  subjectScroll: {
    marginBottom: 15,
  },
  subjectChip: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedSubjectChip: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  subjectChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  selectedSubjectChipText: {
    color: '#fff',
  },
  noteInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    marginBottom: 15,
    minHeight: 100,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#667eea',
    marginRight: 10,
    flex: 1,
  },
  cancelButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  addButton: {
    flex: 2,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonDisabled: {
    opacity: 0.6,
  },
  addButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
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
  notesSection: {
    // No additional styles needed
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
    marginBottom: 5,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    lineHeight: 20,
  },
  noteCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  subjectBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  subjectText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  noteText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
});