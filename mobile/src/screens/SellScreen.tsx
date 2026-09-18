import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { api } from '../api';
import { colors } from '../theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Sell'>;

export default function SellScreen({ navigation }: Props) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    product: '',
    niche: '',
    mrr: '',
    askingPrice: '',
    notes: '',
  });
  const [terms, setTerms] = useState(false);
  const [nonCirc, setNonCirc] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!terms || !nonCirc) {
      setError('Seller Terms and Non-Circumvention are required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api('/api/seller-inquiries', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          acceptedSellerTerms: true,
          acceptedNonCircumvention: true,
        }),
      });
      setDone(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <View style={styles.root}>
        <Text style={styles.title}>In manual review</Text>
        <Text style={styles.sub}>
          A PENDING listing was created. It stays private until Ops verifies it.
        </Text>
        <Pressable style={styles.cta} onPress={() => navigation.navigate('Market')}>
          <Text style={styles.ctaText}>Back to market</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Sell your asset</Text>
      <Text style={styles.sub}>England-based exchange · success fee 3–5% on closed deals</Text>
      {(
        [
          ['name', 'Your name'],
          ['email', 'Email'],
          ['product', 'Product name'],
          ['niche', 'Niche'],
          ['mrr', 'MRR (GBP)'],
          ['askingPrice', 'Asking price (GBP)'],
          ['notes', 'Notes for reviewers'],
        ] as const
      ).map(([key, label]) => (
        <TextInput
          key={key}
          style={styles.input}
          placeholder={label}
          placeholderTextColor={colors.mute}
          autoCapitalize={key === 'email' ? 'none' : 'sentences'}
          keyboardType={key === 'email' ? 'email-address' : 'default'}
          value={form[key]}
          onChangeText={(v) => setForm((f) => ({ ...f, [key]: v }))}
        />
      ))}
      <Pressable style={styles.check} onPress={() => setTerms((v) => !v)}>
        <Text style={styles.checkMark}>{terms ? '☑' : '☐'}</Text>
        <Text style={styles.checkText}>I accept Seller Terms and success fees</Text>
      </Pressable>
      <Pressable style={styles.check} onPress={() => setNonCirc((v) => !v)}>
        <Text style={styles.checkMark}>{nonCirc ? '☑' : '☐'}</Text>
        <Text style={styles.checkText}>I accept Non-Circumvention</Text>
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.cta} onPress={submit} disabled={loading}>
        <Text style={styles.ctaText}>{loading ? 'Submitting…' : 'Submit for review'}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.stone, padding: 16 },
  title: { fontSize: 32, fontWeight: '800', color: colors.coal },
  sub: { marginTop: 8, marginBottom: 14, color: colors.soft },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.raised,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    color: colors.coal,
  },
  check: { flexDirection: 'row', gap: 8, marginTop: 8, alignItems: 'flex-start' },
  checkMark: { color: colors.signal, fontSize: 16 },
  checkText: { flex: 1, color: colors.soft, fontSize: 13 },
  cta: { marginTop: 16, backgroundColor: colors.signal, paddingVertical: 14, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '800' },
  error: { color: '#b00020', marginTop: 10 },
});
