import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors, Spacing, Typography } from '../../constants/theme';
import { useSessionStore } from '../../stores/sessionStore';

const EXAMPLE_INTENTS = [
  'Read transformer paper',
  'Walk outside',
  'Lift weights',
  'Study German',
  'Journal',
  'Relax intentionally',
];

export default function IntentScreen() {
  const router = useRouter();
  const setIntent = useSessionStore((state) => state.setIntent);
  const [text, setText] = useState('');

  const handleContinue = () => {
    if (text.trim()) {
      setIntent(text.trim());
      router.push('/duration');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What is your intention?</Text>

      <TextInput
        style={styles.input}
        placeholder="Type your intention..."
        placeholderTextColor={Colors.textLight}
        value={text}
        onChangeText={setText}
        multiline
        maxLength={100}
        autoFocus
      />

      <ScrollView style={styles.examples} showsVerticalScrollIndicator={false}>
        <Text style={styles.examplesTitle}>Examples:</Text>
        {EXAMPLE_INTENTS.map((example, index) => (
          <TouchableOpacity
            key={index}
            style={styles.exampleButton}
            onPress={() => {
              setText(example);
            }}
          >
            <Text style={styles.exampleText}>{example}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.continueButton, !text.trim() && styles.continueButtonDisabled]}
        onPress={handleContinue}
        disabled={!text.trim()}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
  },
  title: {
    ...Typography.title,
    color: Colors.text,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  input: {
    ...Typography.body,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: Spacing.md,
    minHeight: 100,
    textAlignVertical: 'top',
    color: Colors.text,
  },
  examples: {
    marginTop: Spacing.lg,
    maxHeight: 200,
  },
  examplesTitle: {
    ...Typography.caption,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
  },
  exampleButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  exampleText: {
    ...Typography.body,
    color: Colors.text,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  continueButtonDisabled: {
    backgroundColor: Colors.border,
  },
  continueButtonText: {
    ...Typography.subtitle,
    color: Colors.white,
    fontWeight: '600',
  },
});
