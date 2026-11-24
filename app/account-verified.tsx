import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react-native';
import Svg, { Circle, G, Line } from 'react-native-svg';

export default function AccountVerifiedScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const spinAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Entrance animation for success badge
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Continuous rotation for the loading spinner
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 3. Auto navigate to home / dashboard after 3 seconds
    const timer = setTimeout(() => {
      // Navigate to Home / Landing or next destination
      router.replace('/' as any);
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Animated Success Badge */}
        <Animated.View
          style={[
            styles.badgeWrapper,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.successCircle}>
            <View style={styles.innerCheckRing}>
              <Check size={28} color="#FFFFFF" strokeWidth={3} />
            </View>
          </View>
        </Animated.View>

        {/* Headings */}
        <Animated.View style={[styles.textSection, { opacity: opacityAnim }]}>
          <Text style={styles.title}>{t('accountVerified.title')}</Text>
          <Text style={styles.subtitle}>{t('accountVerified.subtitle')}</Text>
        </Animated.View>

        {/* Loading Spinner & Status */}
        <View style={styles.loadingSection}>
          <Text style={styles.settingUpText}>{t('accountVerified.settingUp')}</Text>

          <Animated.View style={{ transform: [{ rotate: spin }], marginTop: 16 }}>
            <Svg width={36} height={36} viewBox="0 0 36 36">
              <G stroke="#2D6A2E" strokeWidth={3.5} strokeLinecap="round">
                <Line x1="18" y1="4" x2="18" y2="9" opacity="1" />
                <Line x1="28" y1="8" x2="24.5" y2="11.5" opacity="0.88" />
                <Line x1="32" y1="18" x2="27" y2="18" opacity="0.75" />
                <Line x1="28" y1="28" x2="24.5" y2="24.5" opacity="0.6" />
                <Line x1="18" y1="32" x2="18" y2="27" opacity="0.45" />
                <Line x1="8" y1="28" x2="11.5" y2="24.5" opacity="0.3" />
                <Line x1="4" y1="18" x2="9" y2="18" opacity="0.18" />
                <Line x1="8" y1="8" x2="11.5" y2="11.5" opacity="0.1" />
              </G>
            </Svg>
          </Animated.View>
        </View>

        {/* Manual continue if user doesn't want to wait */}
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => router.replace('/' as any)}
          activeOpacity={0.7}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#EDF7EE',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  badgeWrapper: {
    marginBottom: 26,
  },
  successCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#23692E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#23692E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 6,
  },
  innerCheckRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 44,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#133E1A',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    textAlign: 'center',
  },
  loadingSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  settingUpText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F1E12',
  },
  continueBtn: {
    position: 'absolute',
    bottom: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  continueBtnText: {
    fontSize: 14,
    color: '#2D6A2E',
    fontWeight: '700',
  },
});
