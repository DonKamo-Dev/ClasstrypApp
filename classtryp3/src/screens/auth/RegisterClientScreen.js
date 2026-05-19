import { useState } from 'react';
import {
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography } from '../../theme';

export default function RegisterClientScreen({ navigation }) {
  const { signUpClient } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function set(key, value) { setForm(prev => ({ ...prev, [key]: value })); }

  async function handleRegister() {
    if (!form.fullName || !form.email || !form.password) {
      Alert.alert('Campos requeridos', 'Completá nombre, email y contraseña.');
      return;
    }
    if (form.password.length < 6) {
      Alert.alert('Contraseña débil', 'Mínimo 6 caracteres.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Contraseñas distintas', 'Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      await signUpClient({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        fullName: form.fullName.trim(),
        phone: form.phone.trim(),
      });
      Alert.alert(
        '¡Cuenta creada!',
        'Revisá tu email para confirmar tu cuenta.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      Alert.alert('Error al registrarse', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.emoji}>✈️</Text>
          <Text style={styles.title}>Crear cuenta de viajero</Text>
          <Text style={styles.subtitle}>Gratis — sin cargos hasta que reservés</Text>

          <View style={styles.form}>
            {[
              { key: 'fullName', label: 'Nombre completo', placeholder: 'Carlos Martinez', type: 'default' },
              { key: 'email', label: 'Email', placeholder: 'tu@email.com', type: 'email-address' },
              { key: 'phone', label: 'Teléfono (opcional)', placeholder: '+57 300 000 0000', type: 'phone-pad' },
            ].map(({ key, label, placeholder, type }) => (
              <View key={key} style={styles.fieldGroup}>
                <Text style={styles.label}>{label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={placeholder}
                  placeholderTextColor="#6B7280"
                  keyboardType={type}
                  autoCapitalize={key === 'email' ? 'none' : 'words'}
                  value={form[key]}
                  onChangeText={(v) => set(key, v)}
                />
              </View>
            ))}

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor="#6B7280"
                  secureTextEntry={!showPassword}
                  value={form.password}
                  onChangeText={(v) => set('password', v)}
                />
                <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
                  <Text>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirmar contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Repetí tu contraseña"
                placeholderTextColor="#6B7280"
                secureTextEntry
                value={form.confirmPassword}
                onChangeText={(v) => set('confirmPassword', v)}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color={colors.primary} />
              : <Text style={styles.primaryBtnText}>Crear cuenta</Text>
            }
          </TouchableOpacity>

          <Text style={styles.terms}>
            Al registrarte aceptás los{' '}
            <Text style={styles.termsLink}>Términos de Uso</Text> y la{' '}
            <Text style={styles.termsLink}>Política de Privacidad</Text>
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>
              ¿Ya tenés cuenta? <Text style={styles.loginLinkBold}>Iniciar sesión</Text>
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  scroll: { paddingHorizontal: spacing.xl, paddingBottom: spacing.xxl },
  backBtn: { marginTop: spacing.sm, marginBottom: spacing.md },
  backArrow: { fontSize: 28, color: colors.textLight, fontWeight: typography.bold },
  emoji: { fontSize: 40, marginBottom: spacing.sm },
  title: { fontSize: typography.xl, fontWeight: typography.bold, color: colors.textLight, marginBottom: spacing.xs },
  subtitle: { fontSize: typography.sm, color: '#6B7280', marginBottom: spacing.xl },
  form: { gap: spacing.md, marginBottom: spacing.lg },
  fieldGroup: { gap: spacing.xs },
  label: { fontSize: typography.sm, fontWeight: typography.medium, color: '#9CA3AF' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12, height: 52,
    paddingHorizontal: spacing.md,
    fontSize: typography.base, color: colors.textLight,
  },
  eyeBtn: { position: 'absolute', right: 14, height: 52, justifyContent: 'center' },
  primaryBtn: {
    backgroundColor: colors.secondary, height: 56, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { fontSize: typography.md, fontWeight: typography.bold, color: colors.primary },
  terms: { fontSize: 12, color: '#6B7280', textAlign: 'center', marginBottom: spacing.md, lineHeight: 18 },
  termsLink: { color: colors.secondary },
  loginLink: { textAlign: 'center', fontSize: typography.sm, color: '#6B7280' },
  loginLinkBold: { color: colors.secondary, fontWeight: typography.semibold },
});
