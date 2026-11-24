import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Globe, ArrowLeft, Bell } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';

interface Props {
  onOpenLanguage?: () => void;
  showBack?: boolean;
  showWave?: boolean;
  rightAction?: 'lang' | 'bell' | 'none';
  onPressBell?: () => void;
}

export const AppHeader: React.FC<Props> = ({
  onOpenLanguage,
  showBack = false,
  showWave = true,
  rightAction = 'lang',
  onPressBell,
}) => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const currentLangLabel = (i18n.language || 'en').toUpperCase();

  return (
    <View style={styles.headerWrapper}>
      {/* 1. White Navigation Bar */}
      <View style={styles.navBar}>
        <View style={styles.leftRow}>
          {showBack && (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              activeOpacity={0.7}
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.4} />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.logoRow}
            onPress={() => router.replace('/')}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.brandLogoImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {rightAction === 'bell' ? (
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={onPressBell || (() => alert('No new notifications'))}
            activeOpacity={0.7}
            accessibilityLabel="Notifications"
          >
            <Bell size={21} color="#0F1E12" strokeWidth={2} />
          </TouchableOpacity>
        ) : rightAction === 'lang' && onOpenLanguage ? (
          <TouchableOpacity
            style={styles.langPill}
            onPress={onOpenLanguage}
            activeOpacity={0.7}
            accessibilityLabel="Select language"
          >
            <Globe size={15} color="#1E293B" />
            <Text style={styles.langPillText}>{currentLangLabel} ⌵</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* 2. Small Green Tint Wave Strip directly under the white nav */}
      {showWave && (
        <View style={styles.waveContainer} pointerEvents="none">
          <Svg width="100%" height={22} viewBox="0 0 400 22" preserveAspectRatio="none">
            <Path
              d="M 0,0 L 400,0 L 400,10 C 310,20 210,5 120,16 C 60,22 0,11 0,11 Z"
              fill="#E6F4D7"
            />
          </Svg>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    zIndex: 20,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogoImage: {
    width: 120,
    height: 32,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  langPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveContainer: {
    width: '100%',
    height: 22,
    backgroundColor: 'transparent',
  },
});
