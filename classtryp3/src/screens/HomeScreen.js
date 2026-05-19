import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { colors, spacing, typography } from '../theme';

export default function HomeScreen() {
  const { profile, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>Classtryp</Text>
        <Text style={styles.welcome}>
          Hola, {profile?.full_name?.split(' ')[0] ?? 'Viajero'} 👋
        </Text>
        <Text style={styles.role}>
          {profile?.role === 'provider' ? '🏢 Proveedor' : '✈️ Cliente'}
        </Text>
        <Text style={styles.subtitle}>
          El dashboard completo viene en el próximo sprint.
        </Text>

        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  content: {
    flex: 1, paddingHorizontal: spacing.xl,
    justifyContent: 'center', alignItems: 'center', gap: spacing.md,
  },
  logo: { fontSize: typography.xl, fontWeight: typography.bold, color: colors.secondary },
  welcome: { fontSize: typography.xxl, fontWeight: typography.bold, color: colors.textLight, textAlign: 'center' },
  role: { fontSize: typography.base, color: '#9CA3AF' },
  subtitle: { fontSize: typography.sm, color: '#6B7280', textAlign: 'center' },
  signOutBtn: {
    marginTop: spacing.xl, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: 12,
  },
  signOutText: { color: colors.textLight, fontSize: typography.base },
});
