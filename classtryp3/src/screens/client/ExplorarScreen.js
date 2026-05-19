import { useEffect, useState } from 'react';
import {
  ActivityIndicator, FlatList, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ListingCard } from '../../components/ListingCard';
import { supabase } from '../../lib/supabase';
import { colors, spacing, typography, borderRadius } from '../../theme';

const FILTERS = [
  { value: null,          label: 'Todos',       emoji: '🗺️' },
  { value: 'houses',      label: 'Casas',       emoji: '🏠' },
  { value: 'boats',       label: 'Botes',       emoji: '🛥️' },
  { value: 'transport',   label: 'Transporte',  emoji: '🚐' },
  { value: 'experiences', label: 'Experiencias',emoji: '🤿' },
  { value: 'extras',      label: 'Extras',      emoji: '✨' },
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
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explorar</Text>
      </View>

      {/* Buscador */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
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
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filtros por categoría */}
      <FlatList
        horizontal
        data={FILTERS}
        keyExtractor={item => item.value ?? 'all'}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.filterChip, category === item.value && styles.filterChipActive]}
            onPress={() => setCategory(item.value)}
          >
            <Text style={styles.filterEmoji}>{item.emoji}</Text>
            <Text style={[styles.filterLabel, category === item.value && styles.filterLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
        style={styles.filtersList}
      />

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
              <Text style={styles.emptyEmoji}>🏖️</Text>
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
  header: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: typography.xl, fontWeight: typography.bold, color: colors.textPrimary },
  searchRow: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, backgroundColor: colors.surface },
  searchBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md, paddingHorizontal: spacing.md,
    borderWidth: 1, borderColor: colors.border, height: 48, gap: spacing.sm,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: typography.base, color: colors.textPrimary },
  clearIcon: { fontSize: 14, color: colors.textSecondary, padding: 4 },
  filtersList: { backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  filtersRow: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: spacing.sm },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.surface,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterEmoji: { fontSize: 14 },
  filterLabel: { fontSize: 13, fontWeight: typography.medium, color: colors.textSecondary },
  filterLabelActive: { color: '#FFFFFF', fontWeight: typography.semibold },
  listContent: { padding: spacing.lg, gap: spacing.md },
  resultsCount: { fontSize: 13, color: colors.textSecondary, marginBottom: spacing.sm },
  card: {},
  empty: { alignItems: 'center', paddingVertical: 60, gap: spacing.sm },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: typography.lg, fontWeight: typography.bold, color: colors.textPrimary },
  emptySubtitle: { fontSize: typography.base, color: colors.textSecondary, textAlign: 'center' },
});
