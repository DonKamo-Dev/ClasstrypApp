import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../theme';

const options = [
  {
    type: 'client',
    emoji: '✈️',
    title: 'Soy viajero',
    description: 'Quiero armar mi viaje a Cartagena — casa, bote, experiencias y más.',
  },
  {
    type: 'provider',
    emoji: '🏠',
    title: 'Soy proveedor',
    description: 'Ofrezco casas, botes, transporte, experiencias o servicios en Cartagena.',
  },
];

export default function UserTypeScreen({ navigation }) {
  function handleSelect(type) {
    if (type === 'client') navigation.navigate('RegisterClient');
    else navigation.navigate('RegisterProvider');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Classtryp</Text>
        <Text style={styles.title}>¿Cómo vas a usar la app?</Text>
        <Text style={styles.subtitle}>Podés cambiar esto más adelante contactando al equipo.</Text>
      </View>

      <View style={styles.cards}>
        {options.map((opt) => (
          <TouchableOpacity key={opt.type} style={styles.card} onPress={() => handleSelect(opt.type)}>
            <Text style={styles.cardEmoji}>{opt.emoji}</Text>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{opt.title}</Text>
              <Text style={styles.cardDesc}>{opt.description}</Text>
            </View>
            <Text style={styles.cardArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLinkText}>
          ¿Ya tenés cuenta? <Text style={styles.loginLinkBold}>Iniciar sesión</Text>
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, paddingHorizontal: spacing.xl },
  header: { marginTop: spacing.xl, marginBottom: spacing.xxl, gap: spacing.sm },
  logo: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.secondary,
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: typography.xxl,
    fontWeight: typography.bold,
    color: colors.textLight,
    lineHeight: 36,
  },
  subtitle: { fontSize: typography.sm, color: '#6B7280' },
  cards: { gap: spacing.md },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardEmoji: { fontSize: 36 },
  cardContent: { flex: 1, gap: 4 },
  cardTitle: {
    fontSize: typography.md,
    fontWeight: typography.semibold,
    color: colors.textLight,
  },
  cardDesc: { fontSize: typography.sm, color: '#9CA3AF', lineHeight: 20 },
  cardArrow: { fontSize: 24, color: colors.secondary, fontWeight: typography.bold },
  loginLink: { marginTop: 'auto', paddingBottom: spacing.xl, alignItems: 'center' },
  loginLinkText: { fontSize: typography.sm, color: '#6B7280' },
  loginLinkBold: { color: colors.secondary, fontWeight: typography.semibold },
});
