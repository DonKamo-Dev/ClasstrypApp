import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, SafeAreaView } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

const steps = [
  {
    id: 1,
    question: '¿Qué tipo de grupo son?',
    options: [
      { label: '🎉 Amigos / Bachelor', value: 'amigos' },
      { label: '👨‍👩‍👧 Familia', value: 'familia' },
      { label: '💑 Pareja', value: 'pareja' },
      { label: '💼 Corporativo', value: 'corporativo' },
    ],
  },
  {
    id: 2,
    question: '¿Cuántas personas son?',
    options: [
      { label: '2 - 4 personas', value: 'small' },
      { label: '5 - 10 personas', value: 'medium' },
      { label: '11 - 20 personas', value: 'large' },
      { label: 'Más de 20', value: 'xlarge' },
    ],
  },
  {
    id: 3,
    question: '¿Cuánto es su presupuesto?',
    options: [
      { label: '💚 Hasta $500 USD', value: 'budget' },
      { label: '💛 $500 - $1,500 USD', value: 'mid' },
      { label: '🧡 $1,500 - $3,000 USD', value: 'premium' },
      { label: '❤️ Más de $3,000 USD', value: 'luxury' },
    ],
  },
  {
    id: 4,
    question: '¿Qué no puede faltar?',
    options: [
      { label: '🛥️ Paseo en bote', value: 'bote' },
      { label: '🤿 Snorkel / playa', value: 'playa' },
      { label: '🍽️ Gastronomía', value: 'gastro' },
      { label: '🎊 Fiesta / rumba', value: 'fiesta' },
    ],
  },
];

export default function WizardScreen({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const step = steps[currentStep];
  const progress = (currentStep / steps.length) * 100;

  const handleSelect = (value) => {
    const newAnswers = { ...answers, [step.id]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete && onComplete(newAnswers);
      }
    }, 300);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.stepLabel}>Paso {currentStep + 1} de {steps.length}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Question */}
      <View style={styles.content}>
        <Text style={styles.question}>{step.question}</Text>

        <View style={styles.options}>
          {step.options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                answers[step.id] === option.value && styles.optionSelected,
              ]}
              onPress={() => handleSelect(option.value)}
            >
              <Text style={[
                styles.optionText,
                answers[step.id] === option.value && styles.optionTextSelected,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { padding: spacing.lg, paddingBottom: spacing.md },
  stepLabel: { fontSize: typography.sm, color: colors.textSecondary, marginBottom: spacing.sm },
  progressBar: { height: 4, backgroundColor: colors.border, borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: colors.secondary, borderRadius: 2 },
  content: { flex: 1, padding: spacing.lg },
  question: { fontSize: typography.xl, fontWeight: typography.bold, color: colors.textPrimary, marginBottom: spacing.xl, lineHeight: 32 },
  options: { gap: spacing.sm },
  option: { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing.lg, borderWidth: 1.5, borderColor: colors.border },
  optionSelected: { borderColor: colors.secondary, backgroundColor: '#FFF8EC' },
  optionText: { fontSize: typography.base, color: colors.textPrimary, fontWeight: typography.medium },
  optionTextSelected: { color: colors.primary, fontWeight: typography.semibold },
});
