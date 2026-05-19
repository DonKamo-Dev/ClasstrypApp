import { useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ListingCard } from '../../components/ListingCard';
import { supabase } from '../../lib/supabase';
import { colors, spacing, typography, borderRadius } from '../../theme';

const FILTERS = [
  { value: null,          label: 'Todos',        icon: 'grid-outline',     iconActive: 'grid' },
  { value: 'houses',      label: 'Casas',        icon: 'home-outline',     iconActive: 'home' },
  { value: 'boats',       label: 'Botes',        icon: 'boat-outline',     iconActive: 'boat' },
  { value: 'transport',   label: 'Transporte',   icon: 'car-outline',      iconActive: 'car' },
  { value: 'experiences', label: 'Experiencias', icon: 'compass-outline',  iconActive: 'compass' },
  { value: 'extras',      label: 'Extras',       icon: 'sparkles-outline', iconActive: 'sparkles' },
];

export default function ExplorarScreen({ navigation }) {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);

  useEffect(() => { fetchListings(); }, []);

  useEffect(() => {
    let result = listings;
    if (category) result = result.filter(l => l.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q) ||
        l.location_name?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [listings, category, search]);

  async function fetchListings() {
    setLoading(true);
    const { data } = await supabase
      .from('listings')
      .select('*, listing_photos(url, is_cover, sort_order)')
      .eq('status', 'active')
      .order('total_reviews', { ascending: false });
    setListings(data ?? []);
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header + Buscador + Filtros — todo en un bloque sin divisores */}
      <View style={styles.topBlock}>
        <Text style={styles.headerTitle}>Explorar</Text>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar casas, botes, experiencias..."
            placeholderTextColor={colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filtros */}
        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={item => item.value ?? 'all'}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersRow}
          renderItem={({ item }) => {
            const active = category === item.value;
            return (
              <TouchableOpacity
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setCategory(item.value)}
              >
                <Ionicons
                  name={active ? item.iconActive : item.icon}
                  size={16}
                  color={active ? '#FFFFFF' : colors.textSecondary}
                />
                <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Resultados */}
      {loading ? (
        <ActivityIndicator color={colors.secondary} style={{ marginTop: 60 }} size="large" />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.resultsCount}>
              {filtered.length} {filtered.length === 1 ? 'servicio' : 'servicios'} disponibles
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={52} color={colors.border} />
              <Text style={styles.emptyTitle}>Sin resultados</Text>
              <Text style={styles.emptySubtitle}>
                {search ? `No encontramos "${search}"` : 'No hay servicios en esta categoría'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              style={styles.card}
              onPress={() => navigation.navigate('ListingDetail', { listing: item })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBlock: {
    backgroundColor: colors.surface,
    paddingTop: spacing.md,
    paddingBottom: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: typography.xl, fontWeight: typography.bold,
    color: colors.textPrimary, paddingHorizontal: spacing.lg, marginBottom: spacing.md,
  },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1, borderColor: colors.border,
    height: 48, gap: spacing.sm,
    marginHorizontal: spacing.lg, marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: typography.base, color: colors.textPrimary },
  filtersRow: { paddingHorizontal: spacing.lg, gap: 10 },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: borderRadius.full, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.surface,
    minHeight: 42,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterLabel: { fontSize: 14, fontWeight: typography.medium, color: colors.textSecondary },
  filterLabelActive: { color: '#FFFFFF', fontWeight: typography.semibold },
  listContent: { padding: spacing.lg, gap: spacing.md },
  resultsCount: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.sm },
  card: {},
  empty: { alignItems: 'center', paddingVertical: 60, gap: spacing.sm },
  emptyTitle: { fontSize: typography.lg, fontWeight: typography.bold, color: colors.textPrimary },
  emptySubtitle: { fontSize: typography.base, color: colors.textSecondary, textAlign: 'center' },
});
