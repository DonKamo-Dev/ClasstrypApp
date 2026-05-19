import { useEffect, useState } from 'react';
import {
  ActivityIndicator, Image, ScrollView,
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { colors, spacing, typography, borderRadius } from '../../theme';

const CATEGORY_ICONS = {
  houses: 'home-outline', boats: 'boat-outline',
  transport: 'car-outline', experiences: 'compass-outline', extras: 'sparkles-outline',
};
const CATEGORY_LABELS = {
  houses: 'Alojamiento', boats: 'Bote',
  transport: 'Transporte', experiences: 'Experiencia', extras: 'Extra',
};
const PRICE_UNITS = {
  night: 'noche', day: 'día', service: 'servicio', hour: 'hora',
};

function formatDate(d) {
  if (!d) return '—';
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
}

function ServiceRow({ listing, nights, onRemove, onSwap }) {
  const photo = listing?.listing_photos?.[0]?.url;
  const price = listing?.price_base ?? 0;
  const unit = PRICE_UNITS[listing?.price_unit] ?? '';
  const total = listing?.price_unit === 'night' ? price * nights : price;

  return (
    <View style={styles.serviceRow}>
      <View style={styles.serviceImageBox}>
        {photo
          ? <Image source={{ uri: photo }} style={styles.serviceImage} resizeMode="cover" />
          : <View style={[styles.serviceImage, styles.serviceImagePlaceholder]}>
              <Ionicons name={CATEGORY_ICONS[listing?.category]} size={24} color="#9CA3AF" />
            </View>
        }
      </View>
      <View style={styles.serviceInfo}>
        <Text style={styles.serviceCat}>{CATEGORY_LABELS[listing?.category]}</Text>
        <Text style={styles.serviceTitle} numberOfLines={1}>{listing?.title}</Text>
        <Text style={styles.servicePrice}>
          ${total?.toLocaleString('es-CO')} COP
          <Text style={styles.servicePriceUnit}> · ${price?.toLocaleString('es-CO')}/{unit}</Text>
        </Text>
      </View>
      <View style={styles.serviceActions}>
        <TouchableOpacity style={styles.serviceActionBtn} onPress={onSwap}>
          <Ionicons name="swap-horizontal-outline" size={16} color={colors.secondary} />
        </TouchableOpacity>
        {onRemove && (
          <TouchableOpacity style={styles.serviceActionBtn} onPress={onRemove}>
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function PackageResultScreen({ route, navigation }) {
  const { wizardData } = route.params;
  const [loading, setLoading] = useState(true);
  const [package_, setPackage] = useState({ house: null, boat: null, transport: null, extras: [] });
  const [allListings, setAllListings] = useState({});

  const nights = wizardData.checkIn && wizardData.checkOut
    ? Math.ceil((new Date(wizardData.checkOut) - new Date(wizardData.checkIn)) / (1000 * 60 * 60 * 24))
    : 1;

  const totalPax = (wizardData.adults ?? 2) + (wizardData.children ?? 0);

  useEffect(() => { buildPackage(); }, []);

  async function buildPackage() {
    setLoading(true);
    const { data: listings } = await supabase
      .from('listings')
      .select('*, listing_photos(url, is_cover, sort_order)')
      .eq('status', 'active')
      .lte('capacity_min', totalPax)
      .gte('capacity_max', totalPax);

    if (!listings?.length) { setLoading(false); return; }

    const grouped = {};
    for (const l of listings) {
      if (!grouped[l.category]) grouped[l.category] = [];
      grouped[l.category].push(l);
    }
    setAllListings(grouped);

    const bestHouse = grouped.houses?.[0] ?? null;
    const bestBoat  = wizardData.preferences?.includes('boat') ? grouped.boats?.[0] : null;
    const bestTrans = grouped.transport?.[0] ?? null;
    const extras    = wizardData.preferences?.includes('chef') ? [grouped.extras?.[0]].filter(Boolean) : [];

    setPackage({ house: bestHouse, boat: bestBoat, transport: bestTrans, extras });
    setLoading(false);
  }

  function removeService(key) {
    if (key === 'extras') setPackage(p => ({ ...p, extras: [] }));
    else setPackage(p => ({ ...p, [key]: null }));
  }

  function addService(category) {
    const options = allListings[category] ?? [];
    if (!options.length) return;
    const keyMap = { boats: 'boat', transport: 'transport', extras: 'extras' };
    const key = keyMap[category];
    if (key === 'extras') setPackage(p => ({ ...p, extras: [options[0]] }));
    else setPackage(p => ({ ...p, [key]: options[0] }));
  }

  // Calcular totales
  const servicePrice = (l) => l ? (l.price_unit === 'night' ? l.price_base * nights : l.price_base) : 0;
  const baseAmount = servicePrice(package_.house)
    + servicePrice(package_.boat)
    + servicePrice(package_.transport)
    + package_.extras.reduce((sum, e) => sum + servicePrice(e), 0);
  const clientFee = Math.round(baseAmount * 0.05);
  const total = baseAmount + clientFee;

  const OPTIONAL_CATEGORIES = [
    { key: 'boat',      category: 'boats',      label: 'Agregar bote',       icon: 'boat-outline' },
    { key: 'transport', category: 'transport',  label: 'Agregar transporte',  icon: 'car-outline' },
    { key: 'extras',    category: 'extras',     label: 'Agregar extra',       icon: 'sparkles-outline' },
  ];

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.secondary} />
        <Text style={{ marginTop: 16, fontSize: 16, color: colors.textSecondary }}>
          Armando tu paquete ideal...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tu paquete</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Resumen del viaje */}
        <View style={styles.tripSummary}>
          <View style={styles.summaryItem}>
            <Ionicons name="calendar-outline" size={16} color={colors.secondary} />
            <Text style={styles.summaryText}>
              {formatDate(wizardData.checkIn)} → {formatDate(wizardData.checkOut)} · {nights} noche{nights !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={styles.summaryItem}>
            <Ionicons name="people-outline" size={16} color={colors.secondary} />
            <Text style={styles.summaryText}>{totalPax} personas</Text>
          </View>
        </View>

        {/* Servicios del paquete */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tu paquete incluye</Text>

          {package_.house && (
            <ServiceRow
              listing={package_.house} nights={nights}
              onSwap={() => {}}
            />
          )}

          {package_.transport && (
            <ServiceRow
              listing={package_.transport} nights={nights}
              onRemove={() => removeService('transport')}
              onSwap={() => {}}
            />
          )}

          {package_.boat && (
            <ServiceRow
              listing={package_.boat} nights={nights}
              onRemove={() => removeService('boat')}
              onSwap={() => {}}
            />
          )}

          {package_.extras.map((e, i) => (
            <ServiceRow
              key={e.id} listing={e} nights={nights}
              onRemove={() => removeService('extras')}
              onSwap={() => {}}
            />
          ))}

          {/* Agregar servicios opcionales */}
          <View style={styles.addServicesRow}>
            {OPTIONAL_CATEGORIES.filter(opt => {
              if (opt.key === 'boat') return !package_.boat;
              if (opt.key === 'transport') return !package_.transport;
              if (opt.key === 'extras') return package_.extras.length === 0;
              return false;
            }).map(opt => (
              <TouchableOpacity
                key={opt.key}
                style={styles.addServiceBtn}
                onPress={() => addService(opt.category)}
              >
                <Ionicons name={opt.icon} size={16} color={colors.secondary} />
                <Text style={styles.addServiceText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Desglose financiero */}
        <View style={[styles.section, styles.financeCard]}>
          <Text style={styles.sectionTitle}>Desglose de precio</Text>

          {[
            package_.house && ['Alojamiento', servicePrice(package_.house)],
            package_.transport && ['Transporte', servicePrice(package_.transport)],
            package_.boat && ['Bote', servicePrice(package_.boat)],
            ...package_.extras.map(e => ['Extra', servicePrice(e)]),
          ].filter(Boolean).map(([label, amount], i) => (
            <View key={i} style={styles.financeRow}>
              <Text style={styles.financeLabel}>{label}</Text>
              <Text style={styles.financeAmount}>${amount.toLocaleString('es-CO')} COP</Text>
            </View>
          ))}

          <View style={styles.divider} />
          <View style={styles.financeRow}>
            <Text style={styles.financeLabel}>Tarifa de gestión (5%)</Text>
            <Text style={styles.financeAmount}>${clientFee.toLocaleString('es-CO')} COP</Text>
          </View>
          <View style={[styles.financeRow, styles.financeTotal]}>
            <Text style={styles.financeTotalLabel}>Total</Text>
            <Text style={styles.financeTotalAmount}>${total.toLocaleString('es-CO')} COP</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Text style={styles.footerLabel}>Package total</Text>
          <Text style={styles.footerTotal} numberOfLines={1}>${total.toLocaleString('es-CO')} COP</Text>
        </View>
        <TouchableOpacity
          style={styles.reserveBtn}
          onPress={() => navigation.navigate('ClientTabs')}
        >
          <Text style={styles.reserveBtnText}>Reserve package</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 17, fontWeight: typography.bold, color: colors.textPrimary },
  tripSummary: {
    flexDirection: 'row', gap: spacing.lg,
    backgroundColor: colors.primary, padding: spacing.lg,
  },
  summaryItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryText: { fontSize: 13, color: '#FFFFFF', fontWeight: '500' },
  section: {
    backgroundColor: colors.surface, margin: spacing.lg,
    borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border,
    padding: spacing.lg, gap: spacing.md,
  },
  sectionTitle: { fontSize: 16, fontWeight: typography.bold, color: colors.textPrimary },
  serviceRow: {
    flexDirection: 'row', gap: spacing.md, alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  serviceImageBox: { width: 64, height: 56, borderRadius: borderRadius.sm, overflow: 'hidden' },
  serviceImage: { width: '100%', height: '100%' },
  serviceImagePlaceholder: { backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  serviceInfo: { flex: 1, gap: 3 },
  serviceCat: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  serviceTitle: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  servicePrice: { fontSize: 13, fontWeight: '700', color: colors.textPrimary },
  servicePriceUnit: { fontSize: 11, fontWeight: '400', color: colors.textSecondary },
  serviceActions: { gap: 6 },
  serviceActionBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  addServicesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingTop: spacing.xs },
  addServiceBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: borderRadius.full, borderWidth: 1.5,
    borderColor: colors.secondary + '60', backgroundColor: '#FFF8EC',
  },
  addServiceText: { fontSize: 12, fontWeight: '600', color: colors.secondary },
  financeCard: { marginTop: 0 },
  financeRow: { flexDirection: 'row', justifyContent: 'space-between' },
  financeLabel: { fontSize: 14, color: colors.textSecondary },
  financeAmount: { fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  financeTotal: { paddingTop: spacing.sm },
  financeTotalLabel: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  financeTotalAmount: { fontSize: 18, fontWeight: '700', color: colors.secondary },
  footer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: 14,
    backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  footerLeft: { flex: 1, marginRight: spacing.md },
  footerLabel: { fontSize: 12, color: colors.textSecondary },
  footerTotal: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  reserveBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.secondary, paddingHorizontal: 20,
    paddingVertical: 14, borderRadius: 14, flexShrink: 0,
  },
  reserveBtnText: { fontSize: 14, fontWeight: '700', color: colors.primary },
});
