import { useRef, useState } from 'react';
import {
  Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../theme';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    emoji: '🏠',
    title: 'Tu casa en Cartagena',
    subtitle: 'Casas de lujo, villas frente al mar y apartamentos premium. Todo verificado y con disponibilidad real.',
  },
  {
    id: '2',
    emoji: '🛥️',
    title: 'Tu bote privado',
    subtitle: 'Lanchas, veleros y yates con capitán incluido. Islas del Rosario, bahía de Cartagena y más.',
  },
  {
    id: '3',
    emoji: '✨',
    title: 'Todo en un solo pago',
    subtitle: 'Casa, transporte, bote, experiencias y extras. Un solo pago para todo tu viaje a Cartagena.',
  },
];

export default function OnboardingScreen({ navigation }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  function onViewableItemsChanged({ viewableItems }) {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  }

  function handleNext() {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.navigate('UserType');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.navigate('UserType')}>
        <Text style={styles.skipText}>Omitir</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.emojiContainer}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dotsRow}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
        ))}
      </View>

      {/* CTA */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.primaryBtn} onPress={handleNext}>
          <Text style={styles.primaryBtnText}>
            {currentIndex === slides.length - 1 ? 'Comenzar' : 'Siguiente'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>
            ¿Ya tenés cuenta? <Text style={styles.loginLinkBold}>Iniciar sesión</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  skipBtn: { alignSelf: 'flex-end', padding: spacing.md },
  skipText: { color: colors.textSecondary, fontSize: typography.sm },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emojiContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(201,168,76,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emoji: { fontSize: 56 },
  title: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: typography.base,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    width: 24, backgroundColor: colors.secondary,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  primaryBtn: {
    backgroundColor: colors.secondary,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: typography.md,
    fontWeight: typography.bold,
    color: colors.primary,
  },
  loginLink: {
    textAlign: 'center',
    fontSize: typography.sm,
    color: '#9CA3AF',
  },
  loginLinkBold: {
    color: colors.secondary,
    fontWeight: typography.semibold,
  },
});
