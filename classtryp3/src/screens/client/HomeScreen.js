import { useEffect, useState } from 'react';
import {
  ActivityIndicator, RefreshControl, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListingCardHorizontal, ListingCard } from '../../components/ListingCard';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';

const CATEGORIES = [
  { value: null,          label: 'Todo',         icon: 'grid-outline',     iconActive: 'grid' },
  { value: 'houses',      label: 'Casas',        icon: 'home-outline',     iconActive: 'home' },
  { value: 'boats',       label: 'Botes',        icon: 'boat-outline',     iconActive: 'boat' },
  { value: 'transport',   label: 'Transporte',   icon: 'car-outline',      iconActive: 'car' },
  { value: 'experiences', label: 'Experiencias', icon: 'compass-outline',  iconActive: 'compass' },
  { value: 'extras',      label: 'Extras',       icon: 'sparkles-outline', iconActive: 'sparkles' },
];

export default function HomeScreen({ navigation }) {
  const { profile } = useAuth();
  const [featured, setFeatured] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const [featuredRes, listingsRes] = await Promise.all([
        supabase
          .from('featured_listings')
          .select('listing_id, listings(*, listing_photos(url, is_cover, sort_order))')
          .eq('is_active', true)
          .order('sort_order'),
        supabase
          .from('listings')
          .select('*, listing_photos(url, is_cover, sort_order)')
          .eq('status', 'active')
          .order('total_reviews', { ascending: false })
          .limit(10),
      ]);
      setFeatured((featuredRes.data ?? []).map(f => f.listings));
      setListings(listingsRes.data ?? []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  const filteredListings = activeCategory
    ? listings.filter(l => l.category === activeCategory)
    : listings;

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Viajero';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLogo}>Classtryp</Text>
          <Text style={styles.headerGreeting}>Hola, {firstName} 👋</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} tintColor={colors.secondary} />}
      >
        {/* Hero CTA */}
        <TouchableOpacity style={styles.heroBanner} onPress={() => navigation.navigate('Paquetes')} activeOpacity={0.9}>
          <Text style={styles.heroEmoji}>✈️</Text>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>¿A dónde vamos?</Text>
            <Text style={styles.heroSubtitle}>Armá tu paquete completo en 2 minutos</Text>
          </View>
          <View style={styles.heroBtn}>
            <Text style={styles.heroBtnText}>Armar →</Text>
          </View>
        </TouchableOpacity>

        {/* Categorías rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explorar por categoría</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat.value;
              return (
                <TouchableOpacity
                  key={cat.value ?? 'all'}
                  style={[styles.categoryChip, active && styles.categoryChipActive]}
                  onPress={() => setActiveCategory(cat.value)}
                >
                  <Ionicons
                    name={active ? cat.iconActive : cat.icon}
                    size={16}
                    color={active ? '#FFFFFF' : colors.textSecondary}
                  />
                  <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Destacados */}
        {featured.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Destacados</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Explorar')}>
                <Text style={styles.seeAll}>Ver todos →</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.featuredRow}>
              {featured.filter(Boolean).map((item) => (
                <ListingCardHorizontal
                  key={item.id}
                  listing={item}
                  onPress={() => navigation.navigate('ListingDetail', { listing: item })}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Todos los listings */}
        <View style={[styles.section, { paddingBottom: 32 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {activeCategory ? CATEGORIES.find(c => c.value === activeCategory)?.label : 'Disponibles ahora'}
            </Text>
            <Text style={styles.countText}>{filteredListings.length} servicios</Text>
          </View>

          {loading ? (
            <ActivityIndicator color={colors.secondary} style={{ marginTop: 40 }} />
          ) : filteredListings.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🏖️</Text>
              <Text style={styles.emptyText}>No hay servicios disponibles{'\n'}en esta categoría todavía</Text>
            </View>
          ) : (
            <View style={styles.grid}>
              {filteredListings.map((item) => (
                <ListingCard
                  key={item.id}
                  listing={item}
                  style={styles.gridCard}
                  onPress={() => navigation.navigate('ListingDetail', { listing: item })}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    backgroundColor: colors.primary,
  },
  headerLogo: { fontSize: typography.base, fontWeight: typography.bold, color: colors.secondary },
  headerGreeting: { fontSize: typography.lg, fontWeight: typography.bold, color: '#FFFFFF', marginTop: 2 },
  notifBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  notifIcon: { fontSize: 18 },
  heroBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.secondary,
    marginHorizontal: spacing.lg, marginTop: spacing.lg,
    borderRadius: borderRadius.lg, padding: spacing.md, gap: spacing.md,
  },
  heroEmoji: { fontSize: 36 },
  heroText: { flex: 1 },
  heroTitle: { fontSize: typography.md, fontWeight: typography.bold, color: colors.primary },
  heroSubtitle: { fontSize: 12, color: colors.primary, opacity: 0.7, marginTop: 2 },
  heroBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 20,
  },
  heroBtnText: { color: colors.secondary, fontSize: 13, fontWeight: typography.bold },
  section: { marginTop: spacing.lg },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, marginBottom: spacing.sm,
  },
  sectionTitle: { fontSize: typography.md, fontWeight: typography.bold, color: colors.textPrimary, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  seeAll: { fontSize: 13, color: colors.secondary, fontWeight: typography.semibold },
  countText: { fontSize: 13, color: colors.textSecondary },
  categoriesRow: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  categoryChip: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    backgroundColor: colors.surface, paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: borderRadius.full, borderWidth: 1.5, borderColor: colors.border,
    minHeight: 42,
  },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryLabel: { fontSize: 14, fontWeight: typography.medium, color: colors.textSecondary },
  categoryLabelActive: { color: '#FFFFFF', fontWeight: typography.semibold },
  featuredRow: { paddingHorizontal: spacing.lg, gap: spacing.md },
  grid: { paddingHorizontal: spacing.lg, gap: spacing.md },
  gridCard: {},
  empty: { alignItems: 'center', paddingVertical: 48, gap: spacing.sm },
  emptyEmoji: { fontSize: 48 },
  emptyText: { fontSize: typography.base, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});
