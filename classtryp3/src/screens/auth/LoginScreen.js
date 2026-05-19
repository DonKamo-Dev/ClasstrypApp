import { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../theme';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Ingresá tu email y contraseña.');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim().toLowerCase(), password);
    } catch (error) {
      Alert.alert('Error al iniciar sesión', error.message === 'Invalid login credentials'
        ? 'Email o contraseña incorrectos.'
        : error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.logo}>Classtryp</Text>
          <Text style={styles.title}>Bienvenido de vuelta</Text>
          <Text style={styles.subtitle}>Ingresá a tu cuenta para continuar</Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="tu@email.com"
                placeholderTextColor="#6B7280"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="••••••••"
                  placeholderTextColor="#6B7280"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.primary} />
              : <Text style={styles.primaryBtnText}>Iniciar sesión</Text>
            }
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register */}
          <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('UserType')}>
            <Text style={styles.secondaryBtnText}>Crear cuenta nueva</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  backBtn: { marginTop: spacing.sm, marginBottom: spacing.lg },
  backArrow: { fontSize: 28, color: colors.textLight, fontWeight: typography.bold },
  logo: { fontSize: typography.lg, fontWeight: typography.bold, color: colors.secondary, marginBottom: spacing.xs },
  title: { fontSize: typography.xxl, fontWeight: typography.bold, color: colors.textLight, marginBottom: spacing.xs },
  subtitle: { fontSize: typography.sm, color: '#6B7280', marginBottom: spacing.xl },
  form: { gap: spacing.md, marginBottom: spacing.lg },
  fieldGroup: { gap: spacing.xs },
  label: { fontSize: typography.sm, fontWeight: typography.medium, color: '#9CA3AF' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: spacing.md,
    fontSize: typography.base,
    color: colors.textLight,
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  eyeBtn: {
    position: 'absolute', right: 14,
    height: 52, justifyContent: 'center',
  },
  eyeText: { fontSize: 18 },
  forgotText: { fontSize: typography.sm, color: colors.secondary, textAlign: 'right' },
  primaryBtn: {
    backgroundColor: colors.secondary,
    height: 56, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { fontSize: typography.md, fontWeight: typography.bold, color: colors.primary },
  divider: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.1)' },
  dividerText: { fontSize: typography.sm, color: '#6B7280' },
  secondaryBtn: {
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
    height: 56, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: typography.md, fontWeight: typography.semibold, color: colors.textLight },
});
