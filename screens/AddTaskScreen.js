import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
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

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDone = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const renderRightActions = useCallback(
    (item) =>
      () => (
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => deleteTask(item.id)}
        >
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      ),
    []
  );

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
          <Swipeable renderRightActions={renderRightActions(item)}>
            <TouchableOpacity onPress={() => toggleDone(item.id)}>
              <TaskCard title={item.title} done={item.done} />
            </TouchableOpacity>
          </Swipeable>
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
  deleteBtn: {
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 8,
    marginVertical: 6,
    marginLeft: 8,
  },
  deleteBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
});
