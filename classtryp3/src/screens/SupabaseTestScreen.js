import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '../lib/supabase';

export default function SupabaseTestScreen() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  async function runTests() {
    setLoading(true);
    setResults([]);
    const tests = [];

    // Test 1: Conexión básica
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      tests.push({
        name: 'Conexión a Supabase',
        ok: !error,
        detail: error ? error.message : 'OK',
      });
    } catch (e) {
      tests.push({ name: 'Conexión a Supabase', ok: false, detail: e.message });
    }

    // Test 2: Tabla listings (pública)
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('id, title, category, price_base')
        .eq('status', 'active')
        .limit(3);
      tests.push({
        name: 'Listings activos',
        ok: !error,
        detail: error ? error.message : `${data?.length ?? 0} encontrados`,
        data: data,
      });
    } catch (e) {
      tests.push({ name: 'Listings activos', ok: false, detail: e.message });
    }

    // Test 3: RLS — sin auth no puede ver profiles
    try {
      const { data, error } = await supabase.from('profiles').select('id, full_name').limit(1);
      // Con RLS activo y sin auth, data debe estar vacío
      const rlsWorking = !error && (data?.length === 0 || error?.code === 'PGRST301');
      tests.push({
        name: 'RLS activo (profiles protegidos)',
        ok: rlsWorking || !!error,
        detail: error ? `Bloqueado correctamente: ${error.code}` : `Filas visibles sin auth: ${data?.length}`,
      });
    } catch (e) {
      tests.push({ name: 'RLS profiles', ok: false, detail: e.message });
    }

    // Test 4: Auth — sesión actual
    try {
      const { data: { session } } = await supabase.auth.getSession();
      tests.push({
        name: 'Auth - sesión actual',
        ok: true,
        detail: session ? `Sesión activa: ${session.user.email}` : 'Sin sesión (normal)',
      });
    } catch (e) {
      tests.push({ name: 'Auth', ok: false, detail: e.message });
    }

    setResults(tests);
    setLoading(false);
  }

  useEffect(() => { runTests(); }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Supabase — Test de conexión</Text>
      <Text style={styles.subtitle}>classtryp3 ↔ Supabase</Text>

      <TouchableOpacity style={styles.btn} onPress={runTests} disabled={loading}>
        <Text style={styles.btnText}>{loading ? 'Probando...' : 'Re-correr tests'}</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator color="#C9A84C" style={{ marginTop: 24 }} />}

      {results.map((r, i) => (
        <View key={i} style={[styles.card, { borderLeftColor: r.ok ? '#10B981' : '#EF4444' }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>{r.ok ? '✓' : '✗'}</Text>
            <Text style={styles.cardName}>{r.name}</Text>
          </View>
          <Text style={[styles.cardDetail, { color: r.ok ? '#6B7280' : '#EF4444' }]}>
            {r.detail}
          </Text>
          {r.data && r.data.length > 0 && (
            <View style={styles.dataBlock}>
              {r.data.map((item, j) => (
                <Text key={j} style={styles.dataRow}>
                  {item.title} — ${item.price_base?.toLocaleString()} COP/{item.category}
                </Text>
              ))}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 24, paddingBottom: 48 },
  title: { fontSize: 22, fontWeight: '700', color: '#1A1A2E', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24 },
  btn: {
    backgroundColor: '#C9A84C',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  btnText: { color: '#1A1A2E', fontWeight: '700', fontSize: 15 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardIcon: { fontSize: 16, fontWeight: '700' },
  cardName: { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  cardDetail: { fontSize: 13 },
  dataBlock: { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  dataRow: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
});
