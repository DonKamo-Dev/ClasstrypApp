import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, typography, borderRadius } from '../../theme';

const MENU_ITEMS = [
  { emoji: '❤️', label: 'Mis favoritos',       soon: false },
  { emoji: '💳', label: 'Métodos de pago',      soon: true },
  { emoji: '📋', label: 'Historial de pagos',   soon: true },
  { emoji: '💬', label: 'Mensajes',             soon: true },
  { emoji: '⭐', label: 'Mis reseñas',          soon: true },
  { emoji: '🔔', label: 'Notificaciones',       soon: true },
  { emoji: '⚙️', label: 'Configuración',        soon: true },
];

export default function CuentaScreen() {
  const { profile, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mi cuenta</Text>
        </View>

        {/* Perfil */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {profile?.full_name?.[0]?.toUpperCase() ?? 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.full_name}</Text>
            <Text style={styles.profileRole}>
              {profile?.role === 'provider' ? '🏢 Proveedor' : '✈️ Cliente'}
            </Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Editar</Text>
          </TouchableOpacity>
        </View>

        {/* Menú */}
        <View style={styles.menu}>
          {MENU_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.menuItem, i < MENU_ITEMS.length - 1 && styles.menuItemBorder]}
              disabled={item.soon}
            >
              <Text style={styles.menuEmoji}>{item.emoji}</Text>
              <Text style={[styles.menuLabel, item.soon && styles.menuLabelSoon]}>{item.label}</Text>
              {item.soon
                ? <View style={styles.soonBadge}><Text style={styles.soonText}>Próximamente</Text></View>
                : <Text style={styles.menuArrow}>›</Text>
              }
            </TouchableOpacity>
          ))}
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
          <Text style={styles.signOutText}>Cerrar sesión</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Classtryp v1.0 · Cartagena de Indias</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: typography.xl, fontWeight: typography.bold, color: colors.textPrimary },
  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, margin: spacing.lg,
    borderRadius: borderRadius.lg, padding: spacing.lg, gap: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  },
  avatar: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: typography.bold, color: colors.primary },
  profileInfo: { flex: 1, gap: 4 },
  profileName: { fontSize: typography.md, fontWeight: typography.bold, color: colors.textPrimary },
  profileRole: { fontSize: 13, color: colors.textSecondary },
  editBtn: {
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.sm,
  },
  editBtnText: { fontSize: 13, color: colors.textPrimary, fontWeight: typography.medium },
  menu: {
    backgroundColor: colors.surface, marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.md,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  menuEmoji: { fontSize: 20, width: 28 },
  menuLabel: { flex: 1, fontSize: typography.base, color: colors.textPrimary },
  menuLabelSoon: { color: colors.textSecondary },
  menuArrow: { fontSize: 20, color: colors.textSecondary },
  soonBadge: {
    backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },
  soonText: { fontSize: 11, color: colors.textSecondary },
  signOutBtn: {
    margin: spacing.lg, borderWidth: 1, borderColor: colors.border,
    borderRadius: borderRadius.md, paddingVertical: spacing.md,
    alignItems: 'center',
  },
  signOutText: { fontSize: typography.base, color: '#EF4444', fontWeight: typography.medium },
  version: { textAlign: 'center', fontSize: 11, color: '#D1D5DB', paddingBottom: spacing.xl },
});
