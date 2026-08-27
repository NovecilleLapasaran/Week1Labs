import { StyleSheet, View, Text } from 'react-native';
import TaskCard from './components/TaskCard';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>My Tasks</Text>
      <TaskCard title="Study for CCE 106" done={false} />
      <TaskCard title="Meditate for 10 minutes" done={true} />
      <TaskCard title="Walk the talk" done={false} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 16, backgroundColor: '#FFFFFF' },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
});