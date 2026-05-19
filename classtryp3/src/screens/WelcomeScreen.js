import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';

export default function WelcomeScreen({ onStartWizard }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logoArea}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>CT</Text>
        </View>
        <Text style={styles.brandName}>Classtryp</Text>
        <Text style={styles.tagline}>Cartagena a tu medida</Text>
      </View>
      <View style={styles.bottomSection}>
        <Text style={styles.headline}>Viajes inolvidables{'\n'}para grupos, familias{'\n'}y parejas</Text>
        <Text style={styles.subtext}>Casa, bote y experiencias en un solo paquete</Text>
        <TouchableOpacity style={styles.btnPrimary} onPress={onStartWizard}>
          <Text style={styles.btnPrimaryText}>Armar mi paquete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnSecondary}>
          <Text style={styles.btnSecondaryText}>Explorar por mi cuenta</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>¿Ya tienes cuenta? <Text style={styles.loginLink}>Inicia sesión</Text></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  logoArea: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  logoText: { fontSize: typography.xl, fontWeight: typography.bold, color: colors.textLight },
  brandName: { fontSize: typography.xxl, fontWeight: typography.bold, color: colors.textLight, letterSpacing: 2 },
  tagline: { fontSize: typography.sm, color: colors.secondary, marginTop: spacing.xs, letterSpacing: 1 },
  bottomSection: { backgroundColor: colors.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: spacing.xl, paddingBottom: 48 },
  headline: { fontSize: typography.xl, fontWeight: typography.bold, color: colors.textPrimary, lineHeight: 32, marginBottom: spacing.sm },
  subtext: { fontSize: typography.base, color: colors.textSecondary, marginBottom: spacing.xl, lineHeight: 22 },
  btnPrimary: { backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingVertical: 16, alignItems: 'center', marginBottom: spacing.sm },
  btnPrimaryText: { color: colors.textLight, fontSize: typography.base, fontWeight: typography.semibold },
  btnSecondary: { backgroundColor: colors.background, borderRadius: borderRadius.md, paddingVertical: 16, alignItems: 'center', marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  btnSecondaryText: { color: colors.textPrimary, fontSize: typography.base, fontWeight: typography.medium },
  loginText: { textAlign: 'center', fontSize: typography.sm, color: colors.textSecondary },
  loginLink: { color: colors.secondary, fontWeight: typography.semibold },
});
