import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants/theme';

export default function ReviewScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is what you did today</Text>
      <Text style={styles.placeholder}>Your sessions will appear here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  title: {
    ...Typography.title,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  placeholder: {
    ...Typography.body,
    color: Colors.textLight,
  },
});
