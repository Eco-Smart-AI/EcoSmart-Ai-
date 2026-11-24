import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

interface Props {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export const LandingFooter: React.FC<Props> = ({ onGetStarted, onSignIn }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {/* Conversion Banner */}
      <View style={styles.ctaBanner}>
        <Text style={styles.ctaTitle}>{t('landing.ctaBanner.title')}</Text>
        <Text style={styles.ctaSubtitle}>{t('landing.ctaBanner.subtitle')}</Text>

        <TouchableOpacity
          style={styles.ctaPrimaryBtn}
          onPress={onGetStarted}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaPrimaryText}>{t('common.getStarted')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.ctaSecondaryBtn}
          onPress={onSignIn}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaSecondaryText}>{t('common.signIn')}</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Navigation & Legal */}
      <View style={styles.footerNav}>
        <View style={styles.linksRow}>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.linkText}>{t('landing.footer.terms')}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.linkText}>{t('landing.footer.privacy')}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.linkText}>{t('landing.footer.help')}</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.linkText}>{t('landing.footer.contact')}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.copyrightText}>{t('landing.footer.copyright')}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  ctaBanner: {
    backgroundColor: '#1A431E',
    marginHorizontal: 20,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginBottom: 26,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  ctaSubtitle: {
    fontSize: 14,
    color: '#A7D7A9',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  ctaPrimaryBtn: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  ctaPrimaryText: {
    color: '#1A431E',
    fontSize: 16,
    fontWeight: '700',
  },
  ctaSecondaryBtn: {
    borderWidth: 1,
    borderColor: '#71A875',
    width: '100%',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaSecondaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footerNav: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  linksRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 14,
  },
  linkText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  copyrightText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
});
