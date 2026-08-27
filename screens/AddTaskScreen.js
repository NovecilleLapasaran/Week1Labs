import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import TaskCard from '../components/TaskCard';

export default function AddTaskScreen() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTask = () => {
    if (taskText.trim() === '') {
      Alert.alert('Oops', 'Please type a task first!');
      return;
    }
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: taskText.trim(), done: false },
    ]);
    setTaskText('');
  };

  const toggleDone = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add a Task</Text>

      {/* Task counter experiment */}
      <Text style={styles.counter}>
        {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="What do you need to do?"
          placeholderTextColor="#9FB0D0"
          value={taskText}
          onChangeText={setTaskText}
        />
        <TouchableOpacity style={styles.addBtn} onPress={addTask}>
          <Text style={styles.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleDone(item.id)}>
            <TaskCard title={item.title} done={item.done} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No tasks yet — add one above!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  counter: { fontSize: 14, color: '#6B7A99', marginBottom: 12 },
  inputRow: { flexDirection: 'row', marginBottom: 16 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D0D7E5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  addBtn: {
    backgroundColor: '#1B2A4A',
    borderRadius: 8,
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  empty: { textAlign: 'center', color: '#9FB0D0', marginTop: 32 },
});
