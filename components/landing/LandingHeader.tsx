import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Globe } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';

interface Props {
  onOpenLanguage: () => void;
  onSignIn: () => void;
}

export const LandingHeader: React.FC<Props> = ({ onOpenLanguage, onSignIn }) => {
  const { i18n, t } = useTranslation();
  const currentLangLabel = (i18n.language || 'en').toUpperCase();

  return (
    <View style={styles.headerWrapper}>
      <View style={styles.navBar}>
        {/* Brand Logo */}
        <View style={styles.logoRow}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Right Controls */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.langPill}
            onPress={onOpenLanguage}
            activeOpacity={0.7}
            accessibilityLabel="Select language"
          >
            <Globe size={15} color="#1E293B" />
            <Text style={styles.langPillText}>{currentLangLabel} ⌵</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.signInBtn}
            onPress={onSignIn}
            activeOpacity={0.7}
          >
            <Text style={styles.signInBtnText}>{t('common.signIn')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Small Green Tint Wave under the white nav */}
      <View style={styles.waveContainer} pointerEvents="none">
        <Svg width="100%" height={22} viewBox="0 0 400 22" preserveAspectRatio="none">
          <Path
            d="M 0,0 L 400,0 L 400,10 C 310,20 210,5 120,16 C 60,22 0,11 0,11 Z"
            fill="#E6F4D7"
          />
        </Svg>
      </View>
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
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 124,
    height: 34,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  signInBtn: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: '#0F1E12',
    backgroundColor: '#FFFFFF',
  },
  signInBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
  },
  waveContainer: {
    width: '100%',
    height: 22,
    backgroundColor: 'transparent',
  },
});
