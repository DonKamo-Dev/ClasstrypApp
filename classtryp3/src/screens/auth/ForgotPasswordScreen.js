import { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../theme';

export default function ForgotPasswordScreen({ navigation }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleReset() {
    if (!email) { Alert.alert('Email requerido'); return; }
    setLoading(true);
    try {
      await resetPassword(email.trim().toLowerCase());
      setSent(true);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

          {sent ? (
            <View style={styles.successContainer}>
              <Text style={styles.successEmoji}>📬</Text>
              <Text style={styles.title}>Revisá tu email</Text>
              <Text style={styles.subtitle}>
                Enviamos un link para restablecer tu contraseña a{'\n'}
                <Text style={styles.emailHighlight}>{email}</Text>
              </Text>
              <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.primaryBtnText}>Volver al login</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={styles.emoji}>🔑</Text>
              <Text style={styles.title}>Recuperar contraseña</Text>
              <Text style={styles.subtitle}>
                Ingresá tu email y te mandamos un link para crear una nueva contraseña.
              </Text>

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="tu@email.com"
                  placeholderTextColor="#6B7280"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                onPress={handleReset}
                disabled={loading}
              >
                {loading
                  ? <ActivityIndicator color={colors.primary} />
                  : <Text style={styles.primaryBtnText}>Enviar link</Text>
                }
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  content: { flex: 1, paddingHorizontal: spacing.xl },
  backBtn: { marginTop: spacing.sm, marginBottom: spacing.xl },
  backArrow: { fontSize: 28, color: colors.textLight, fontWeight: typography.bold },
  emoji: { fontSize: 48, marginBottom: spacing.md },
  title: { fontSize: typography.xl, fontWeight: typography.bold, color: colors.textLight, marginBottom: spacing.sm },
  subtitle: { fontSize: typography.base, color: '#9CA3AF', lineHeight: 24, marginBottom: spacing.xl },
  fieldGroup: { gap: spacing.xs, marginBottom: spacing.lg },
  label: { fontSize: typography.sm, fontWeight: typography.medium, color: '#9CA3AF' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, height: 52,
    paddingHorizontal: spacing.md,
    fontSize: typography.base, color: colors.textLight,
  },
  primaryBtn: {
    backgroundColor: colors.secondary, height: 56, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { fontSize: typography.md, fontWeight: typography.bold, color: colors.primary },
  successContainer: { flex: 1, justifyContent: 'center', gap: spacing.md },
  successEmoji: { fontSize: 64, marginBottom: spacing.sm },
  emailHighlight: { color: colors.secondary, fontWeight: typography.semibold },
});
