import { Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function TaskCard({ title, done, onToggle, onDelete }) {
  return (
    <Pressable onPress={onToggle} style={styles.card}>
      <Ionicons
        name={done ? 'checkmark-circle' : 'ellipse-outline'}
        size={22}
        color={done ? colors.teal : colors.gray}
      />
      <Text style={[styles.title, done && styles.titleDone]}>{title}</Text>
      <Pressable onPress={onDelete} hitSlop={8} style={styles.delete}>
        <Ionicons name="trash-outline" size={20} color={colors.red} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    marginVertical: 6,
    backgroundColor: colors.lightBg,
    borderRadius: 8,
  },
  title: { flex: 1, fontWeight: 'bold', fontSize: 16, color: colors.navy },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.gray,
    fontWeight: 'normal',
  },
});