import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

export default function TrustScreen() {
  const blocks = [
    {
      t: 'Manual verification before publish',
      d: 'Nothing goes public without VERIFIED status. Review notes stay on the asset.',
    },
    {
      t: 'Anti-circumvention',
      d: 'Seller email never public. Leads require Terms + Non-Circumvention. Demo URLs default to intro-only.',
    },
    {
      t: 'UK operator',
      d: 'Based in England. GBP pricing. Governing law: England and Wales. Success fee 3–5% on closed deals.',
    },
    {
      t: 'What Phase 1 is not',
      d: 'Not escrow, not SOC2, not a live bank feed. Those arrive later — we do not pretend otherwise.',
    },
  ];

  return (
    <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.eyebrow}>Trust Center</Text>
      <Text style={styles.title}>Trust from process</Text>
      {blocks.map((b, i) => (
        <React.Fragment key={b.t}>
          <Text style={styles.num}>0{i + 1}</Text>
          <Text style={styles.h}>{b.t}</Text>
          <Text style={styles.p}>{b.d}</Text>
        </React.Fragment>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.stone, padding: 16 },
  eyebrow: { color: colors.signal, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' },
  title: { marginTop: 8, fontSize: 34, fontWeight: '800', color: colors.coal, marginBottom: 12 },
  num: { marginTop: 18, color: colors.signal, fontSize: 12 },
  h: { marginTop: 4, fontSize: 20, fontWeight: '800', color: colors.coal },
  p: { marginTop: 6, color: colors.soft, lineHeight: 22 },
});
