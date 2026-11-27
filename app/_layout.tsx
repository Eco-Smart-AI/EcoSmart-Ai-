import React from 'react';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, StyleSheet, Platform } from 'react-native';
import '../i18n';

export default function RootLayout() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <View style={[styles.webBackground, isAdminRoute && styles.adminWebBackground]}>
        <View style={[styles.phoneContainer, isAdminRoute && styles.adminDesktopContainer]}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  webBackground: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? '#EDF2F7' : '#FFFFFF',
    alignItems: Platform.OS === 'web' ? 'center' : 'stretch',
    justifyContent: 'flex-start',
    width: '100%',
    minHeight: '100%',
  },
  adminWebBackground: {
    backgroundColor: '#F8FAFC',
    alignItems: 'stretch',
  },
  phoneContainer: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    backgroundColor: '#FFFFFF',
    ...(Platform.OS === 'web'
      ? {
          maxWidth: 440,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 20,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: '#E2E8F0',
        }
      : {}),
  },
  adminDesktopContainer: {
    ...(Platform.OS === 'web'
      ? {
          maxWidth: '100%' as any,
          borderLeftWidth: 0,
          borderRightWidth: 0,
          shadowOpacity: 0,
          backgroundColor: '#F8FAFC',
        }
      : {}),
  },
});
