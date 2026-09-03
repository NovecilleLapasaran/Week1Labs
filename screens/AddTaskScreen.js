import { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import TaskCard from '../components/TaskCard';
import { colors } from '../theme';

export default function AddTaskScreen() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [quote, setQuote] = useState("Loading today's motivation...");

  // Load saved tasks once, when the screen first mounts
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const savedData = await AsyncStorage.getItem('tasks');
        if (savedData !== null) {
          setTasks(JSON.parse(savedData));
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadTasks();
  }, []);

  // Save tasks any time they change — but not before the initial load finishes
  useEffect(() => {
    if (!isLoaded) return;
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Failed to save tasks:', error);
      }
    };
    saveTasks();
  }, [tasks, isLoaded]);

  function loadQuote() {
    fetch('https://dummyjson.com/quotes/random')
      .then((response) => response.json())
      .then((data) => setQuote(`"${data.quote}" — ${data.author}`))
      .catch(() => setQuote('Believe in yourself and get it done!'));
  }

  // Fetch a motivational quote once, when the screen first mounts
  useEffect(() => {
    loadQuote();
  }, []);

  function handleAddTask() {
    if (taskText.trim() === '') {
      setErrorMessage('Please type a task before adding it.');
      return;
    }
    const newTask = { id: Date.now().toString(), title: taskText, done: false };
    setTasks([...tasks, newTask]);
    setTaskText('');
    setErrorMessage('');
  }

  function handleToggleTask(id) {
    setTasks(
      tasks.map((t) =>
        t.id === id ? { ...t, done: !t.done } : t
      )
    );
  }

  function handleDeleteTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  function handleRefreshQuote() {
    loadQuote();
  }

  return (
    <View style={styles.container}>
      <View style={styles.quoteRow}>
        <Ionicons name="chatbubble-ellipses-outline" size={18} color={colors.gray} />
        <Text style={styles.quote}>{quote}</Text>
      </View>

      <Text style={styles.heading}>My Tasks</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter a task"
        value={taskText}
        onChangeText={setTaskText}
      />
      {errorMessage !== '' && (
        <Text style={styles.error}>{errorMessage}</Text>
      )}
      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
          onPress={handleAddTask}
        >
          <Ionicons name="add-circle" size={20} color={colors.white} />
          <Text style={styles.addButtonText}>Add Task</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.quoteButton, pressed && styles.pressed]}
          onPress={handleRefreshQuote}
        >
          <Ionicons name="refresh" size={18} color={colors.orange} />
          <Text style={styles.quoteButtonText}>New Quote</Text>
        </Pressable>
      </View>

      {tasks.length > 0 && tasks.every((t) => t.done) && (
        <View style={styles.celebrationRow}>
          <Ionicons name="trophy" size={20} color={colors.teal} />
          <Text style={styles.celebration}>All done! Great work!</Text>
        </View>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Swipeable
            overshootRight={false}
            renderRightActions={() => (
              <Pressable
                style={styles.deleteAction}
                onPress={() => handleDeleteTask(item.id)}
              >
                <Ionicons name="trash" size={22} color={colors.white} />
                <Text style={styles.deleteActionText}>Delete</Text>
              </Pressable>
            )}
          >
            <TaskCard
              title={item.title}
              done={item.done}
              onToggle={() => handleToggleTask(item.id)}
              onDelete={() => handleDeleteTask(item.id)}
            />
          </Swipeable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet — add one above!</Text>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 20, fontWeight: 'bold', color: colors.navy, marginBottom: 12 },
  quoteRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  quote: {
    flex: 1,
    fontStyle: 'italic',
    color: colors.gray,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  error: { color: colors.red, marginBottom: 10 },
  buttonRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  addButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.teal,
    paddingVertical: 12,
    borderRadius: 10,
  },
  addButtonText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  quoteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.orange,
    paddingVertical: 12,
    borderRadius: 10,
  },
  quoteButtonText: { color: colors.orange, fontSize: 16, fontWeight: '600' },
  pressed: { opacity: 0.8 },
  deleteAction: {
    backgroundColor: colors.red,
    width: 92,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  deleteActionText: { color: colors.white, fontWeight: '600', fontSize: 13 },
  celebrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 12,
  },
  celebration: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.teal,
    textAlign: 'center',
  },
  list: { marginTop: 16 },
  empty: { textAlign: 'center', color: colors.gray, marginTop: 24 },
  separator: { height: 8 },
});