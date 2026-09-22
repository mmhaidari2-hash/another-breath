import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { api, formatGbp } from '../api';
import { colors } from '../theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Listing'>;

type Listing = {
  id: string;
  title: string;
  tagline: string | null;
  description: string;
  niche: string | null;
  askingPricePence: number;
  mrrPence: number | null;
  multiple: number | null;
  grade: string | null;
  verificationNotes: string | null;
  demoPolicy: string | null;
  evidenceRevenue?: boolean;
  evidenceProduct?: boolean;
  evidenceUi?: boolean;
};

export default function ListingScreen({ route }: Props) {
  const { slug } = route.params;
  const [listing, setListing] = useState<Listing | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [message, setMessage] = useState('');
  const [terms, setTerms] = useState(false);
  const [nonCirc, setNonCirc] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    api<{ listing: Listing }>(`/api/listings/${slug}`)
      .then((d) => setListing(d.listing))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Error'));
  }, [slug]);

  const submit = async () => {
    if (!listing) return;
    if (!terms || !nonCirc) {
      setFormError('Terms and Non-Circumvention are required');
      return;
    }
    setStatus('loading');
    setFormError(null);
    try {
      await api('/api/leads', {
        method: 'POST',
        body: JSON.stringify({
          listingId: listing.id,
          buyerName,
          buyerEmail,
          message,
          acceptedTerms: true,
          acceptedNonCircumvention: true,
        }),
      });
      setStatus('success');
    } catch (e: unknown) {
      setStatus('idle');
      setFormError(e instanceof Error ? e.message : 'Failed');
    }
  };

  if (error) {
    return (
      <View style={styles.root}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }
  if (!listing) {
    return (
      <View style={styles.root}>
        <ActivityIndicator color={colors.signal} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 48 }}>
      <Text style={styles.eyebrow}>{listing.niche} · Grade {listing.grade}</Text>
      <Text style={styles.title}>{listing.title}</Text>
      {!!listing.tagline && <Text style={styles.tagline}>{listing.tagline}</Text>}
      <Text style={styles.price}>{formatGbp(listing.askingPricePence)}</Text>
      <Text style={styles.meta}>
        {listing.mrrPence != null ? `MRR ${formatGbp(listing.mrrPence)}` : 'No MRR'}
        {listing.multiple != null ? ` · ${listing.multiple}×` : ''}
      </Text>

      <Text style={styles.section}>Overview</Text>
      <Text style={styles.body}>{listing.description}</Text>

      <Text style={styles.section}>Evidence</Text>
      <Text style={styles.body}>
        Revenue {listing.evidenceRevenue ? 'checked' : 'n/a'} · Product{' '}
        {listing.evidenceProduct ? 'checked' : 'pending'} · UI{' '}
        {listing.evidenceUi ? 'checked' : 'pending'}
      </Text>
      <Text style={styles.meta}>
        Live URL: {listing.demoPolicy === 'PUBLIC' ? 'public' : 'intro-only (anti-circumvention)'}
      </Text>
      {!!listing.verificationNotes && (
        <>
          <Text style={styles.section}>Verification file</Text>
          <Text style={styles.body}>{listing.verificationNotes}</Text>
        </>
      )}

      <View style={styles.desk}>
        <Text style={styles.section}>Request intro</Text>
        <Text style={styles.meta}>
          Seller email stays private. Cladak mediates contact. Off-platform deals after intro still
          owe the success fee.
        </Text>
        {status === 'success' ? (
          <Text style={styles.success}>
            Request queued. Cladak mediates the intro — off-platform contact is prohibited.
          </Text>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor={colors.mute}
              value={buyerName}
              onChangeText={setBuyerName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.mute}
              autoCapitalize="none"
              keyboardType="email-address"
              value={buyerEmail}
              onChangeText={setBuyerEmail}
            />
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="Message"
              placeholderTextColor={colors.mute}
              multiline
              value={message}
              onChangeText={setMessage}
            />
            <Pressable style={styles.check} onPress={() => setTerms((v) => !v)}>
              <Text style={styles.checkMark}>{terms ? '☑' : '☐'}</Text>
              <Text style={styles.checkText}>I accept Terms and fees</Text>
            </Pressable>
            <Pressable style={styles.check} onPress={() => setNonCirc((v) => !v)}>
              <Text style={styles.checkMark}>{nonCirc ? '☑' : '☐'}</Text>
              <Text style={styles.checkText}>I accept Non-Circumvention</Text>
            </Pressable>
            {formError && <Text style={styles.error}>{formError}</Text>}
            <Pressable
              style={styles.cta}
              onPress={submit}
              disabled={status === 'loading'}
            >
              <Text style={styles.ctaText}>
                {status === 'loading' ? 'Sending…' : 'Send request'}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.stone, padding: 16 },
  eyebrow: { color: colors.signal, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' },
  title: { marginTop: 8, fontSize: 36, fontWeight: '800', color: colors.coal, letterSpacing: -1 },
  tagline: { marginTop: 8, fontSize: 16, color: colors.soft },
  price: { marginTop: 16, fontSize: 28, fontWeight: '800', color: colors.coal },
  meta: { marginTop: 6, color: colors.mute, fontSize: 12 },
  section: { marginTop: 22, fontSize: 18, fontWeight: '800', color: colors.coal },
  body: { marginTop: 8, color: colors.soft, lineHeight: 22, fontSize: 15 },
  desk: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: colors.coal,
    backgroundColor: colors.raised,
    padding: 16,
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.coal,
    backgroundColor: colors.stone,
  },
  check: { flexDirection: 'row', gap: 8, marginTop: 12, alignItems: 'flex-start' },
  checkMark: { color: colors.signal, fontSize: 16 },
  checkText: { flex: 1, color: colors.soft, fontSize: 13 },
  cta: { marginTop: 16, backgroundColor: colors.signal, paddingVertical: 14, alignItems: 'center' },
  ctaText: { color: '#fff', fontWeight: '800' },
  success: { marginTop: 12, color: colors.coal, fontWeight: '600' },
  error: { color: '#b00020', marginTop: 10 },
});
