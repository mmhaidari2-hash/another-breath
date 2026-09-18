import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text } from 'react-native';
import MarketScreen from './src/screens/MarketScreen';
import ListingScreen from './src/screens/ListingScreen';
import SellScreen from './src/screens/SellScreen';
import TrustScreen from './src/screens/TrustScreen';
import LoginScreen from './src/screens/LoginScreen';
import StudioScreen from './src/screens/StudioScreen';
import { colors } from './src/theme';
import type { RootStackParamList } from './src/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.stone,
    card: colors.stone,
    text: colors.coal,
    primary: colors.signal,
    border: colors.border,
  },
};

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="dark" />
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: colors.stone },
          headerTintColor: colors.coal,
          headerTitleStyle: { fontWeight: '800' },
          headerRight: () => (
            <Pressable onPress={() => navigation.navigate('Sell')} style={{ marginRight: 4 }}>
              <Text style={{ color: colors.signal, fontWeight: '800' }}>Sell</Text>
            </Pressable>
          ),
        })}
      >
        <Stack.Screen
          name="Market"
          component={MarketScreen}
          options={({ navigation }) => ({
            title: 'Market',
            headerLeft: () => (
              <Pressable onPress={() => navigation.navigate('Trust')} style={{ marginLeft: 4 }}>
                <Text style={{ color: colors.soft, fontWeight: '600' }}>Trust</Text>
              </Pressable>
            ),
            headerRight: () => (
              <Pressable
                onPress={() => navigation.navigate('Login')}
                style={{ marginRight: 12, flexDirection: 'row', gap: 12 }}
              >
                <Text
                  style={{ color: colors.soft, fontWeight: '600' }}
                  onPress={() => navigation.navigate('Login')}
                >
                  Sign in
                </Text>
                <Text
                  style={{ color: colors.signal, fontWeight: '800' }}
                  onPress={() => navigation.navigate('Sell')}
                >
                  Sell
                </Text>
              </Pressable>
            ),
          })}
        />
        <Stack.Screen name="Listing" component={ListingScreen} options={{ title: 'Asset' }} />
        <Stack.Screen name="Sell" component={SellScreen} options={{ title: 'Sell' }} />
        <Stack.Screen name="Trust" component={TrustScreen} options={{ title: 'Trust' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Sign in' }} />
        <Stack.Screen name="Studio" component={StudioScreen} options={{ title: 'Studio' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
