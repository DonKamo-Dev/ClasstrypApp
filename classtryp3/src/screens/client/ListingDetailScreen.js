import { useState } from 'react';
import {
  Dimensions, Image, Modal, ScrollView, Share,
  StyleSheet, Text, TouchableOpacity, View, FlatList,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';

const { width, height } = Dimensions.get('window');

const CATEGORY_LABELS = {
  houses: 'Casa / Villa', boats: 'Bote / Yate',
  transport: 'Transporte', experiences: 'Experiencia', extras: 'Servicio Extra',
};
const PRICE_UNITS = {
  night: 'noche', day: 'día', service: 'servicio', hour: 'hora',
};

export default function ListingDetailScreen({ route, navigation }) {
  const { listing } = route.params;
  const insets = useSafeAreaInsets();
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [saved, setSaved] = useState(false);

  const photos = listing.listing_photos ?? [];
  const coverPhoto = photos.find(p => p.is_cover)?.url ?? photos[0]?.url;
  const price = listing.price_base?.toLocaleString('es-CO');
  const unit = PRICE_UNITS[listing.price_unit] ?? '';

  const amenities = Array.isArray(listing.amenities)
    ? listing.amenities
    : (typeof listing.amenities === 'string' ? JSON.parse(listing.amenities) : []);

  const rules = typeof listing.rules === 'object' && listing.rules !== null
    ? listing.rules
    : (typeof listing.rules === 'string' ? JSON.parse(listing.rules) : {});

  async function handleShare() {
    await Share.share({ message: `${listing.title} — desde $${price} COP/${unit} en Classtryp` });
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

        {/* Foto hero */}
        <TouchableOpacity onPress={() => { setGalleryIndex(0); setGalleryVisible(true); }} activeOpacity={0.95}>
          <View style={styles.heroContainer}>
            {coverPhoto
              ? <Image source={{ uri: coverPhoto }} style={styles.heroImage} resizeMode="cover" />
              : <View style={[styles.heroImage, styles.heroPlaceholder]}>
                  <Ionicons name="image-outline" size={64} color="#D1D5DB" />
                </View>
            }
            {/* Overlay gradiente */}
            <View style={styles.heroOverlay} />

            {/* Contador de fotos */}
            {photos.length > 1 && (
              <View style={styles.photoCount}>
                <Ionicons name="images-outline" size={14} color="#FFFFFF" />
                <Text style={styles.photoCountText}>{photos.length} fotos</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* Botones flotantes sobre la foto */}
        <View style={[styles.floatingBtns, { top: insets.top + 12 }]}>
          <TouchableOpacity style={styles.floatingBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.floatingBtnGroup}>
            <TouchableOpacity style={styles.floatingBtn} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.floatingBtn} onPress={() => setSaved(!saved)}>
              <Ionicons name={saved ? 'heart' : 'heart-outline'} size={20} color={saved ? '#EF4444' : colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contenido */}
        <View style={styles.content}>

          {/* Categoría + Título */}
          <View style={styles.titleSection}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{CATEGORY_LABELS[listing.category]}</Text>
            </View>
            <Text style={styles.title}>{listing.title}</Text>

            <View style={styles.metaRow}>
              {listing.location_name && (
                <View style={styles.metaItem}>
                  <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
                  <Text style={styles.metaText}>{listing.location_name}</Text>
                </View>
              )}
              {listing.rating > 0 && (
                <View style={styles.metaItem}>
                  <Ionicons name="star" size={14} color="#F59E0B" />
                  <Text style={styles.metaText}>{listing.rating} · {listing.total_reviews} reseñas</Text>
                </View>
              )}
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
                <Text style={styles.metaText}>{listing.capacity_min}–{listing.capacity_max} personas</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Descripción */}
          {listing.description && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.description}>{listing.description}</Text>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* Amenities / Lo que incluye */}
          {amenities.length > 0 && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {listing.category === 'houses' ? 'Lo que incluye' : 'Qué incluye'}
                </Text>
                <View style={styles.amenitiesGrid}>
                  {amenities.map((item, i) => (
                    <View key={i} style={styles.amenityItem}>
                      <Ionicons name="checkmark-circle-outline" size={16} color={colors.secondary} />
                      <Text style={styles.amenityText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* Reglas / Info adicional */}
          {Object.keys(rules).length > 0 && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  {listing.category === 'houses' ? 'Reglas de la casa' : 'Información adicional'}
                </Text>
                <View style={styles.rulesGrid}>
                  {Object.entries(rules).map(([key, val]) => {
                    const labels = {
                      check_in: 'Check-in', check_out: 'Check-out',
                      pets: 'Mascotas', smoking: 'Fumar', parties: 'Fiestas',
                      min_nights: 'Mín. noches', includes: 'Incluye',
                      departure: 'Salida', return: 'Regreso',
                      advance_booking: 'Reserva anticipada', duration: 'Duración',
                      service_hours: 'Horario',
                    };
                    const display = labels[key] ?? key;
                    const value = typeof val === 'boolean'
                      ? (val ? 'Permitido' : 'No permitido')
                      : String(val);
                    return (
                      <View key={key} style={styles.ruleItem}>
                        <Text style={styles.ruleKey}>{display}</Text>
                        <Text style={styles.ruleVal}>{value}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* Galería thumbnails */}
          {photos.length > 1 && (
            <>
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Fotos ({photos.length})</Text>
                  <TouchableOpacity onPress={() => setGalleryVisible(true)}>
                    <Text style={styles.seeAll}>Ver todas</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbRow}>
                  {photos.slice(0, 5).map((p, i) => (
                    <TouchableOpacity key={i} onPress={() => { setGalleryIndex(i); setGalleryVisible(true); }}>
                      <Image source={{ uri: p.url }} style={styles.thumb} resizeMode="cover" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* Espacio para el footer */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Footer sticky — Precio + Reservar */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>Desde</Text>
          <Text style={styles.footerPriceAmount}>${price} COP</Text>
          <Text style={styles.footerPriceUnit}>/ {unit}</Text>
        </View>
        <TouchableOpacity
          style={styles.reserveBtn}
          onPress={() => navigation.navigate('ReservarFechas', { listing })}
        >
          <Text style={styles.reserveBtnText}>Reservar</Text>
        </TouchableOpacity>
      </View>

      {/* Galería fullscreen */}
      <Modal visible={galleryVisible} transparent animationType="fade">
        <View style={styles.galleryModal}>
          <TouchableOpacity
            style={[styles.galleryClose, { top: insets.top + 12 }]}
            onPress={() => setGalleryVisible(false)}
          >
            <Ionicons name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <FlatList
            data={photos}
            keyExtractor={(_, i) => String(i)}
            horizontal
            pagingEnabled
            initialScrollIndex={galleryIndex}
            getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.gallerySlide}>
                <Image source={{ uri: item.url }} style={styles.galleryImage} resizeMode="contain" />
              </View>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  heroContainer: { width, height: 300, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroPlaceholder: { backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  photoCount: {
    position: 'absolute', bottom: 14, right: 14,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14,
  },
  photoCountText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },
  floatingBtns: {
    position: 'absolute', left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  floatingBtnGroup: { flexDirection: 'row', gap: 8 },
  floatingBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 4, elevation: 4,
  },
  content: { backgroundColor: colors.surface },
  titleSection: { padding: spacing.lg, gap: spacing.sm },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20,
  },
  categoryText: { fontSize: 12, fontWeight: '600', color: colors.primary },
  title: { fontSize: 22, fontWeight: typography.bold, color: colors.textPrimary, lineHeight: 30 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 2 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 13, color: colors.textSecondary },
  divider: { height: 8, backgroundColor: '#F2F3F0' },
  section: { padding: spacing.lg, gap: spacing.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 17, fontWeight: typography.bold, color: colors.textPrimary },
  seeAll: { fontSize: 13, color: colors.secondary, fontWeight: typography.semibold },
  description: { fontSize: 15, color: colors.textSecondary, lineHeight: 24 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  amenityItem: { flexDirection: 'row', alignItems: 'center', gap: 7, width: '47%' },
  amenityText: { fontSize: 13, color: colors.textPrimary, flex: 1 },
  rulesGrid: { gap: 10 },
  ruleItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  ruleKey: { fontSize: 14, color: colors.textSecondary },
  ruleVal: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  thumbRow: { gap: 8 },
  thumb: { width: 100, height: 80, borderRadius: borderRadius.sm },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingTop: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 12,
  },
  footerPrice: { gap: 2 },
  footerPriceLabel: { fontSize: 12, color: colors.textSecondary },
  footerPriceAmount: { fontSize: 20, fontWeight: typography.bold, color: colors.textPrimary },
  footerPriceUnit: { fontSize: 12, color: colors.textSecondary },
  reserveBtn: {
    backgroundColor: colors.secondary, paddingHorizontal: 32,
    paddingVertical: 14, borderRadius: 14,
  },
  reserveBtnText: { fontSize: 16, fontWeight: typography.bold, color: colors.primary },
  galleryModal: { flex: 1, backgroundColor: '#000000' },
  galleryClose: {
    position: 'absolute', right: 16, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  gallerySlide: { width, height, alignItems: 'center', justifyContent: 'center' },
  galleryImage: { width, height: height * 0.8 },
});
