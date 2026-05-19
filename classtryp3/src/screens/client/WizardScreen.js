import { useState } from 'react';
import {
  Animated, Dimensions, ScrollView, StyleSheet,
  Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../../theme';

const { width } = Dimensions.get('window');

// ─── Constantes ───────────────────────────────────────────────
const GROUP_TYPES = [
  { value: 'friends',   label: 'Amigos / Bachelor', icon: 'people',       desc: 'La mejor rumbita' },
  { value: 'family',    label: 'Familia',            icon: 'home',         desc: 'Todos juntos' },
  { value: 'couple',    label: 'Pareja',             icon: 'heart',        desc: 'Momento especial' },
  { value: 'corporate', label: 'Corporativo',        icon: 'briefcase',    desc: 'Equipo de trabajo' },
];

const BUDGET_RANGES = [
  { value: 'low',     label: 'Hasta $2M COP',      sub: '~$500 USD',   color: '#10B981' },
  { value: 'mid',     label: '$2M – $5M COP',      sub: '~$500-1.2K USD', color: '#3B82F6' },
  { value: 'premium', label: '$5M – $10M COP',     sub: '~$1.2-2.5K USD', color: '#F59E0B' },
  { value: 'luxury',  label: '$10M – $20M COP',    sub: '~$2.5-5K USD', color: '#C9A84C' },
  { value: 'ultra',   label: 'Más de $20M COP',    sub: '+$5K USD',     color: '#EF4444' },
];

const PREFERENCES = [
  { value: 'beach',      label: 'Playa',          icon: 'sunny-outline' },
  { value: 'boat',       label: 'Paseo en bote',  icon: 'boat-outline' },
  { value: 'party',      label: 'Fiesta / Rumba', icon: 'musical-notes-outline' },
  { value: 'snorkel',    label: 'Snorkel',        icon: 'fish-outline' },
  { value: 'gastronomy', label: 'Gastronomía',    icon: 'restaurant-outline' },
  { value: 'photo',      label: 'Sesión de fotos',icon: 'camera-outline' },
  { value: 'spa',        label: 'Spa / Relax',    icon: 'leaf-outline' },
  { value: 'city',       label: 'City tour',      icon: 'map-outline' },
  { value: 'dj',         label: 'DJ / Música',    icon: 'headset-outline' },
  { value: 'chef',       label: 'Chef privado',   icon: 'pizza-outline' },
];

const TOTAL_STEPS = 5;

// ─── Helpers de calendario ─────────────────────────────────────
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function formatDate(d) {
  if (!d) return '';
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ─── Componente Calendario ─────────────────────────────────────
function CalendarPicker({ checkIn, checkOut, onSelectDate }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const MONTH_NAMES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  const DAY_NAMES = ['D','L','M','X','J','V','S'];

  const days = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function isInRange(day) {
    if (!checkIn || !checkOut) return false;
    const d = new Date(viewYear, viewMonth, day);
    return d > checkIn && d < checkOut;
  }
  function isCheckIn(day) {
    if (!checkIn) return false;
    const d = new Date(viewYear, viewMonth, day);
    return d.toDateString() === checkIn.toDateString();
  }
  function isCheckOut(day) {
    if (!checkOut) return false;
    const d = new Date(viewYear, viewMonth, day);
    return d.toDateString() === checkOut.toDateString();
  }
  function isPast(day) {
    const d = new Date(viewYear, viewMonth, day);
    return d < today;
  }

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  return (
    <View style={calStyles.container}>
      <View style={calStyles.header}>
        <TouchableOpacity onPress={prevMonth} style={calStyles.navBtn}>
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={calStyles.monthTitle}>{MONTH_NAMES[viewMonth]} {viewYear}</Text>
        <TouchableOpacity onPress={nextMonth} style={calStyles.navBtn}>
          <Ionicons name="chevron-forward" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
      <View style={calStyles.dayNames}>
        {DAY_NAMES.map(d => (
          <Text key={d} style={calStyles.dayName}>{d}</Text>
        ))}
      </View>
      <View style={calStyles.grid}>
        {cells.map((day, i) => {
          if (!day) return <View key={`e${i}`} style={calStyles.cell} />;
          const past = isPast(day);
          const selected = isCheckIn(day) || isCheckOut(day);
          const inRange = isInRange(day);
          return (
            <TouchableOpacity
              key={day}
              style={[
                calStyles.cell,
                inRange && calStyles.cellInRange,
                selected && calStyles.cellSelected,
              ]}
              onPress={() => !past && onSelectDate(new Date(viewYear, viewMonth, day))}
              disabled={past}
            >
              <Text style={[
                calStyles.dayText,
                past && calStyles.dayPast,
                inRange && calStyles.dayInRange,
                selected && calStyles.daySelected,
              ]}>{day}</Text>
              {isCheckIn(day) && <Text style={calStyles.dayLabel}>Entrada</Text>}
              {isCheckOut(day) && <Text style={calStyles.dayLabel}>Salida</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const calStyles = StyleSheet.create({
  container: { backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md },
  navBtn: { padding: 8 },
  monthTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  dayNames: { flexDirection: 'row', marginBottom: 8 },
  dayName: { flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '600', color: colors.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: `${100 / 7}%`, aspectRatio: 1, alignItems: 'center', justifyContent: 'center' },
  cellInRange: { backgroundColor: '#FFF8EC' },
  cellSelected: { backgroundColor: colors.secondary, borderRadius: 20 },
  dayText: { fontSize: 14, color: colors.textPrimary },
  dayPast: { color: '#D1D5DB' },
  dayInRange: { color: colors.primary },
  daySelected: { color: colors.primary, fontWeight: '700' },
  dayLabel: { fontSize: 7, color: colors.primary, fontWeight: '700', position: 'absolute', bottom: 2 },
});

// ─── Wizard Principal ──────────────────────────────────────────
export default function WizardScreen({ navigation }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    groupType: null,
    checkIn: null, checkOut: null,
    adults: 2, children: 0,
    budget: null,
    preferences: [],
  });

  function update(key, value) { setData(prev => ({ ...prev, [key]: value })); }

  function nextStep() {
    if (step < TOTAL_STEPS - 1) setStep(s => s + 1);
    else navigation.navigate('PackageResult', { wizardData: data });
  }
  function prevStep() {
    if (step === 0) navigation.goBack();
    else setStep(s => s - 1);
  }

  function handleDateSelect(date) {
    if (!data.checkIn || (data.checkIn && data.checkOut)) {
      update('checkIn', date); update('checkOut', null);
    } else {
      if (date <= data.checkIn) { update('checkIn', date); update('checkOut', null); }
      else update('checkOut', date);
    }
  }

  function togglePref(val) {
    update('preferences', data.preferences.includes(val)
      ? data.preferences.filter(p => p !== val)
      : [...data.preferences, val]);
  }

  const canContinue = () => {
    if (step === 0) return !!data.groupType;
    if (step === 1) return !!data.checkIn && !!data.checkOut;
    if (step === 2) return data.adults > 0;
    if (step === 3) return !!data.budget;
    if (step === 4) return data.preferences.length > 0;
    return false;
  };

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={prevStep} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.stepLabel}>{step + 1} de {TOTAL_STEPS}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Paso 1: Tipo de grupo ── */}
        {step === 0 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>¿Qué tipo de grupo son?</Text>
            <Text style={styles.stepSubtitle}>Personalizamos el paquete según tu grupo</Text>
            <View style={styles.groupGrid}>
              {GROUP_TYPES.map(opt => {
                const active = data.groupType === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.groupCard, active && styles.groupCardActive]}
                    onPress={() => update('groupType', opt.value)}
                  >
                    <Ionicons name={active ? opt.icon : `${opt.icon}-outline`} size={32}
                      color={active ? colors.secondary : colors.textSecondary} />
                    <Text style={[styles.groupLabel, active && styles.groupLabelActive]}>{opt.label}</Text>
                    <Text style={[styles.groupDesc, active && styles.groupDescActive]}>{opt.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ── Paso 2: Fechas ── */}
        {step === 1 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>¿Cuándo viajan?</Text>
            <Text style={styles.stepSubtitle}>Seleccioná entrada y salida</Text>

            {(data.checkIn || data.checkOut) && (
              <View style={styles.dateDisplay}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateBoxLabel}>Entrada</Text>
                  <Text style={styles.dateBoxValue}>
                    {data.checkIn ? formatDate(data.checkIn) : '—'}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={18} color={colors.textSecondary} />
                <View style={styles.dateBox}>
                  <Text style={styles.dateBoxLabel}>Salida</Text>
                  <Text style={styles.dateBoxValue}>
                    {data.checkOut ? formatDate(data.checkOut) : '—'}
                  </Text>
                </View>
              </View>
            )}

            <CalendarPicker
              checkIn={data.checkIn}
              checkOut={data.checkOut}
              onSelectDate={handleDateSelect}
            />

            {data.checkIn && data.checkOut && (
              <View style={styles.nightsChip}>
                <Ionicons name="moon-outline" size={14} color={colors.secondary} />
                <Text style={styles.nightsText}>
                  {Math.ceil((data.checkOut - data.checkIn) / (1000 * 60 * 60 * 24))} noches
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ── Paso 3: Personas ── */}
        {step === 2 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>¿Cuántos van?</Text>
            <Text style={styles.stepSubtitle}>Para encontrar el alojamiento ideal</Text>

            <View style={styles.countersCard}>
              {[
                { key: 'adults',   label: 'Adultos',  sub: '13 años o más',  min: 1 },
                { key: 'children', label: 'Niños',    sub: 'Menores de 13',  min: 0 },
              ].map(({ key, label, sub, min }) => (
                <View key={key} style={styles.counterRow}>
                  <View>
                    <Text style={styles.counterLabel}>{label}</Text>
                    <Text style={styles.counterSub}>{sub}</Text>
                  </View>
                  <View style={styles.counterControls}>
                    <TouchableOpacity
                      style={[styles.counterBtn, data[key] <= min && styles.counterBtnDisabled]}
                      onPress={() => data[key] > min && update(key, data[key] - 1)}
                    >
                      <Ionicons name="remove" size={18} color={data[key] <= min ? '#D1D5DB' : colors.textPrimary} />
                    </TouchableOpacity>
                    <Text style={styles.counterValue}>{data[key]}</Text>
                    <TouchableOpacity
                      style={styles.counterBtn}
                      onPress={() => update(key, data[key] + 1)}
                    >
                      <Ionicons name="add" size={18} color={colors.textPrimary} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.totalPax}>
              <Ionicons name="people-outline" size={18} color={colors.secondary} />
              <Text style={styles.totalPaxText}>
                {data.adults + data.children} personas en total
              </Text>
            </View>
          </View>
        )}

        {/* ── Paso 4: Presupuesto ── */}
        {step === 3 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>¿Cuál es tu presupuesto?</Text>
            <Text style={styles.stepSubtitle}>Para todo el grupo, todo incluido</Text>
            <View style={styles.budgetList}>
              {BUDGET_RANGES.map(opt => {
                const active = data.budget === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.budgetCard, active && { borderColor: opt.color, backgroundColor: opt.color + '10' }]}
                    onPress={() => update('budget', opt.value)}
                  >
                    <View style={[styles.budgetDot, { backgroundColor: opt.color }]} />
                    <View style={styles.budgetText}>
                      <Text style={[styles.budgetLabel, active && { color: colors.textPrimary, fontWeight: '700' }]}>
                        {opt.label}
                      </Text>
                      <Text style={styles.budgetSub}>{opt.sub}</Text>
                    </View>
                    {active && <Ionicons name="checkmark-circle" size={22} color={opt.color} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ── Paso 5: Preferencias ── */}
        {step === 4 && (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>¿Qué no puede faltar?</Text>
            <Text style={styles.stepSubtitle}>Seleccioná todo lo que quieran incluir</Text>
            <View style={styles.prefsGrid}>
              {PREFERENCES.map(pref => {
                const active = data.preferences.includes(pref.value);
                return (
                  <TouchableOpacity
                    key={pref.value}
                    style={[styles.prefChip, active && styles.prefChipActive]}
                    onPress={() => togglePref(pref.value)}
                  >
                    <Ionicons
                      name={pref.icon}
                      size={18}
                      color={active ? colors.secondary : colors.textSecondary}
                    />
                    <Text style={[styles.prefLabel, active && styles.prefLabelActive]}>
                      {pref.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {data.preferences.length > 0 && (
              <Text style={styles.prefsCount}>
                {data.preferences.length} seleccionado{data.preferences.length > 1 ? 's' : ''}
              </Text>
            )}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer CTA */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextBtn, !canContinue() && styles.nextBtnDisabled]}
          onPress={nextStep}
          disabled={!canContinue()}
        >
          <Text style={styles.nextBtnText}>
            {step === TOTAL_STEPS - 1 ? 'Ver mi paquete ✨' : 'Continuar'}
          </Text>
          {step < TOTAL_STEPS - 1 && (
            <Ionicons name="arrow-forward" size={18} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 4 },
  progressContainer: { flex: 1, gap: 4 },
  progressTrack: { height: 4, backgroundColor: colors.border, borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: colors.secondary, borderRadius: 2 },
  stepLabel: { fontSize: 11, color: colors.textSecondary, textAlign: 'right' },
  cancelText: { fontSize: 13, color: colors.textSecondary },
  scroll: { padding: spacing.lg },
  stepContent: { gap: spacing.lg },
  stepTitle: { fontSize: 26, fontWeight: typography.bold, color: colors.textPrimary, lineHeight: 34 },
  stepSubtitle: { fontSize: 15, color: colors.textSecondary, marginTop: -spacing.sm },

  // Grupo
  groupGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  groupCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    padding: spacing.lg, gap: spacing.xs,
    borderWidth: 2, borderColor: colors.border, alignItems: 'center',
  },
  groupCardActive: { borderColor: colors.secondary, backgroundColor: '#FFF8EC' },
  groupLabel: { fontSize: 14, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  groupLabelActive: { color: colors.primary },
  groupDesc: { fontSize: 12, color: colors.textSecondary, textAlign: 'center' },
  groupDescActive: { color: '#92794A' },

  // Fechas
  dateDisplay: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.md, backgroundColor: colors.surface,
    padding: spacing.md, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.border,
  },
  dateBox: { alignItems: 'center', gap: 3 },
  dateBoxLabel: { fontSize: 11, color: colors.textSecondary, fontWeight: '600' },
  dateBoxValue: { fontSize: 14, fontWeight: '700', color: colors.textPrimary },
  nightsChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    alignSelf: 'center', backgroundColor: '#FFF8EC',
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: 20,
    borderWidth: 1, borderColor: colors.secondary + '50',
  },
  nightsText: { fontSize: 13, fontWeight: '600', color: colors.secondary },

  // Personas
  countersCard: {
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  counterRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  counterLabel: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  counterSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  counterControls: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  counterBtn: {
    width: 36, height: 36, borderRadius: 18,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  counterBtnDisabled: { borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' },
  counterValue: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, minWidth: 28, textAlign: 'center' },
  totalPax: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    justifyContent: 'center', paddingVertical: spacing.sm,
  },
  totalPaxText: { fontSize: 14, color: colors.textSecondary, fontWeight: '500' },

  // Presupuesto
  budgetList: { gap: spacing.sm },
  budgetCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.surface, borderRadius: borderRadius.lg,
    padding: spacing.lg, borderWidth: 2, borderColor: colors.border,
  },
  budgetDot: { width: 14, height: 14, borderRadius: 7 },
  budgetText: { flex: 1 },
  budgetLabel: { fontSize: 15, fontWeight: '500', color: colors.textSecondary },
  budgetSub: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },

  // Preferencias
  prefsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  prefChip: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: borderRadius.full, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.surface,
  },
  prefChipActive: { borderColor: colors.secondary, backgroundColor: '#FFF8EC' },
  prefLabel: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  prefLabelActive: { color: colors.primary, fontWeight: '600' },
  prefsCount: {
    textAlign: 'center', fontSize: 13, color: colors.secondary,
    fontWeight: '600', marginTop: spacing.xs,
  },

  // Footer
  footer: {
    padding: spacing.lg, backgroundColor: colors.surface,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  nextBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: spacing.sm, backgroundColor: colors.secondary,
    height: 56, borderRadius: 14,
  },
  nextBtnDisabled: { opacity: 0.4 },
  nextBtnText: { fontSize: 16, fontWeight: typography.bold, color: colors.primary },
});
