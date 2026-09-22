import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { api, formatGbp } from '../api';
import { colors } from '../theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Market'>;

type ListingCard = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  niche: string | null;
  askingPricePence: number;
  mrrPence: number | null;
  grade: string | null;
};

export default function MarketScreen({ navigation }: Props) {
  const [q, setQ] = useState('');
  const [items, setItems] = useState<ListingCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (query = q) => {
    setError(null);
    try {
      const data = await api<{ listings: ListingCard[] }>(
        `/api/listings${query ? `?q=${encodeURIComponent(query)}` : ''}`
      );
      setItems(data.listings);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [q]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      load();
    }, [load])
  );

  return (
    <View style={styles.root}>
      <Text style={styles.brand}>CLADAK</Text>
      <Text style={styles.sub}>Verified Micro-SaaS exchange · GBP · England</Text>
      <View style={styles.searchRow}>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Search verified assets"
          placeholderTextColor={colors.mute}
          style={styles.input}
          onSubmitEditing={() => {
            setLoading(true);
            load(q);
          }}
        />
        <Pressable
          style={styles.searchBtn}
          onPress={() => {
            setLoading(true);
            load(q);
          }}
        >
          <Text style={styles.searchBtnText}>Go</Text>
        </Pressable>
      </View>

      {loading && <ActivityIndicator color={colors.signal} style={{ marginTop: 24 }} />}
      {error && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              setLoading(true);
              load();
            }}
          />
        }
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          !loading ? <Text style={styles.empty}>No verified listings.</Text> : null
        }
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() => navigation.navigate('Listing', { slug: item.slug })}
          >
            <View style={styles.cardTop}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.price}>{formatGbp(item.askingPricePence)}</Text>
            </View>
            <Text style={styles.meta}>
              {item.niche || 'Micro-SaaS'} · Grade {item.grade || '—'}
              {item.mrrPence != null ? ` · MRR ${formatGbp(item.mrrPence)}` : ''}
            </Text>
            {!!item.tagline && <Text style={styles.tagline}>{item.tagline}</Text>}
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.stone, paddingHorizontal: 16, paddingTop: 12 },
  brand: { fontSize: 34, fontWeight: '800', color: colors.coal, letterSpacing: -1 },
  sub: { marginTop: 4, color: colors.mute, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 },
  searchRow: { flexDirection: 'row', gap: 8, marginTop: 16, marginBottom: 12 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.raised,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.coal,
  },
  searchBtn: { backgroundColor: colors.signal, paddingHorizontal: 16, justifyContent: 'center' },
  searchBtnText: { color: '#fff', fontWeight: '700' },
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.raised,
    padding: 16,
    marginBottom: 10,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  title: { flex: 1, fontSize: 22, fontWeight: '800', color: colors.coal },
  price: { fontSize: 16, fontWeight: '700', color: colors.signal },
  meta: { marginTop: 6, color: colors.mute, fontSize: 12 },
  tagline: { marginTop: 8, color: colors.soft, fontSize: 14 },
  error: { color: '#b00020', marginTop: 12 },
  empty: { color: colors.mute, marginTop: 24, textAlign: 'center' },
});
