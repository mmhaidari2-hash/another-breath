import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { setToken } from '../api';
import { colors } from '../theme';
import type { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Studio'>;

export default function StudioScreen({ navigation }: Props) {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>Studio</Text>
      <Text style={styles.sub}>
        You are signed in on the Cladak mobile client. Full listing ops remain on the web Studio /
        Ops desk for Phase 1; this app covers market browse, intro requests, and sell intake.
      </Text>
      <Pressable style={styles.cta} onPress={() => navigation.navigate('Market')}>
        <Text style={styles.ctaText}>Browse market</Text>
      </Pressable>
      <Pressable style={styles.ghost} onPress={() => navigation.navigate('Sell')}>
        <Text style={styles.ghostText}>Sell an asset</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.stone, padding: 16, paddingTop: 24 },
  title: { fontSize: 34, fontWeight: '800', color: colors.coal },
  sub: { marginTop: 10, color: colors.soft, lineHeight: 22 },
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
