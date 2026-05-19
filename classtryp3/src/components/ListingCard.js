import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, borderRadius, spacing, typography } from '../theme';

const CATEGORY_LABELS = {
  houses: 'Casa / Villa',
  boats: 'Bote / Yate',
  transport: 'Transporte',
  experiences: 'Experiencia',
  extras: 'Servicio Extra',
};

const CATEGORY_ICONS = {
  houses: 'home-outline',
  boats: 'boat-outline',
  transport: 'car-outline',
  experiences: 'compass-outline',
  extras: 'sparkles-outline',
};

const PRICE_UNITS = {
  night: '/ noche', day: '/ día', service: '/ servicio', hour: '/ hora',
};

export function ListingCard({ listing, onPress, style }) {
  const photo = listing.listing_photos?.[0]?.url;
  const price = listing.price_base?.toLocaleString('es-CO');
  const unit = PRICE_UNITS[listing.price_unit] ?? '';

  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.92}>
      {/* Foto */}
      <View style={styles.imageBox}>
        {photo
          ? <Image source={{ uri: photo }} style={styles.image} resizeMode="cover" />
          : <View style={[styles.image, styles.imagePlaceholder]}>
              <Ionicons name={CATEGORY_ICONS[listing.category]} size={40} color="#9CA3AF" />
            </View>
        }
        <View style={styles.categoryBadge}>
          <Ionicons name={CATEGORY_ICONS[listing.category]} size={12} color="#FFFFFF" />
          <Text style={styles.categoryBadgeText}>{CATEGORY_LABELS[listing.category]}</Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{listing.title}</Text>

        <View style={styles.metaRow}>
          {listing.location_name && (
            <Text style={styles.location} numberOfLines={1}>📍 {listing.location_name}</Text>
          )}
          {listing.rating > 0 && (
            <Text style={styles.rating}>⭐ {listing.rating} ({listing.total_reviews})</Text>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>
            <Text style={styles.priceAmount}>${price} COP</Text>
            <Text style={styles.priceUnit}> {unit}</Text>
          </Text>
          <View style={styles.capacityBadge}>
            <Text style={styles.capacityText}>👥 hasta {listing.capacity_max}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function ListingCardHorizontal({ listing, onPress }) {
  const photo = listing.listing_photos?.[0]?.url;
  const price = listing.price_base?.toLocaleString('es-CO');
  const unit = PRICE_UNITS[listing.price_unit] ?? '';

  return (
    <TouchableOpacity style={styles.cardH} onPress={onPress} activeOpacity={0.92}>
      <View style={styles.imageBoxH}>
        {photo
          ? <Image source={{ uri: photo }} style={styles.imageH} resizeMode="cover" />
          : <View style={[styles.imageH, styles.imagePlaceholder]}>
              <Ionicons name={CATEGORY_ICONS[listing.category]} size={32} color="#9CA3AF" />
            </View>
        }
      </View>
      <View style={styles.infoH}>
        <View style={styles.categoryRowH}>
          <Ionicons name={CATEGORY_ICONS[listing.category]} size={12} color={colors.textSecondary} />
          <Text style={styles.categorySmall}>{CATEGORY_LABELS[listing.category]}</Text>
        </View>
        <Text style={styles.titleH} numberOfLines={2}>{listing.title}</Text>
        <Text style={styles.priceH}>${price} COP{'\n'}<Text style={styles.priceUnitH}>{unit}</Text></Text>
        {listing.rating > 0 && <Text style={styles.ratingH}>⭐ {listing.rating}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Card vertical (grid)
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageBox: { width: '100%', height: 180, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imagePlaceholder: {
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  placeholderEmoji: { fontSize: 40 },
  categoryBadge: {
    position: 'absolute', top: 10, left: 10,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(26,26,46,0.85)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  categoryBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
  info: { padding: spacing.md, gap: 6 },
  title: { fontSize: typography.base, fontWeight: typography.semibold, color: colors.textPrimary },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  location: { fontSize: 12, color: colors.textSecondary, flex: 1 },
  rating: { fontSize: 12, color: colors.textSecondary },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  price: {},
  priceAmount: { fontSize: typography.base, fontWeight: typography.bold, color: colors.textPrimary },
  priceUnit: { fontSize: 11, color: colors.textSecondary },
  capacityBadge: {
    backgroundColor: '#F3F4F6', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10,
  },
  capacityText: { fontSize: 11, color: colors.textSecondary },

  // Card horizontal (featured)
  cardH: {
    width: 200, backgroundColor: colors.surface,
    borderRadius: borderRadius.lg, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
  },
  imageBoxH: { width: '100%', height: 130 },
  imageH: { width: '100%', height: '100%' },
  infoH: { padding: spacing.sm, gap: 4 },
  categoryRowH: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  categorySmall: { fontSize: 10, color: colors.textSecondary },
  titleH: { fontSize: 13, fontWeight: typography.semibold, color: colors.textPrimary, lineHeight: 18 },
  priceH: { fontSize: 13, fontWeight: typography.bold, color: colors.textPrimary, marginTop: 4 },
  priceUnitH: { fontSize: 11, fontWeight: '400', color: colors.textSecondary },
  ratingH: { fontSize: 11, color: colors.textSecondary },
});
