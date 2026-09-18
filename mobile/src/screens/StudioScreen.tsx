import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { api, setToken } from '../api';
import { colors } from '../theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Studio'>;

type ListingRow = {
  id: string;
  title: string;
  slug: string;
  verificationStatus: string;
  askingPrice: number;
};

export default function StudioScreen({ navigation }: Props) {
  const [rows, setRows] = useState<ListingRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api<{ listings: Omit<ListingRow, 'verificationStatus'>[] }>('/api/listings');
      setRows((data.listings || []).map((l) => ({ ...l, verificationStatus: 'VERIFIED' })));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Studio</Text>
      <Text style={styles.sub}>
        Signed-in shell · market overview. Full Ops desk (verify / outbox / fees) is on web `/ops`.
      </Text>

      {loading && <Text style={styles.sub}>Loading listings…</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      {rows.slice(0, 12).map((l) => (
        <Pressable
          key={l.id}
          style={styles.card}
          onPress={() => navigation.navigate('Listing', { slug: l.slug })}
        >
          <Text style={styles.cardTitle}>{l.title}</Text>
          <Text style={styles.cardMeta}>
            {l.verificationStatus} · £{l.askingPrice.toLocaleString('en-GB')}
          </Text>
        </Pressable>
      ))}

      <Pressable style={styles.cta} onPress={() => navigation.navigate('Market')}>
        <Text style={styles.ctaText}>Browse market</Text>
      </Pressable>
      <Pressable style={styles.ghost} onPress={() => navigation.navigate('Sell')}>
        <Text style={styles.ghostText}>Sell with evidence</Text>
      </Pressable>
      <Pressable style={styles.ghost} onPress={load}>
        <Text style={styles.ghostText}>Refresh</Text>
      </Pressable>
      <Pressable
        style={styles.ghost}
        onPress={async () => {
          await setToken(null);
          navigation.replace('Login');
        }}
      >
        <Text style={styles.ghostText}>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.stone, padding: 16, paddingTop: 24 },
  title: { fontSize: 34, fontWeight: '800', color: colors.coal },
  sub: { marginTop: 10, color: colors.soft, lineHeight: 22 },
  error: { marginTop: 10, color: '#b91c1c' },
  card: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.raised,
    padding: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: colors.coal },
  cardMeta: { marginTop: 4, fontSize: 12, color: colors.mute },
  cta: { marginTop: 24, backgroundColor: colors.signal, paddingVertical: 14, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '800' },
  ghost: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: colors.raised,
  },
  ghostText: { color: colors.coal, fontWeight: '700' },
});
