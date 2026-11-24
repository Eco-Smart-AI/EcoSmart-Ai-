import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

import { LandingHeader } from '../components/landing/LandingHeader';
import { ScanPreviewCard } from '../components/landing/ScanPreviewCard';
import { TrustMetrics } from '../components/landing/TrustMetrics';
import { AudienceCards } from '../components/landing/AudienceCards';
import { HowItWorksSteps } from '../components/landing/HowItWorksSteps';
import { AiFeaturesGrid } from '../components/landing/AiFeaturesGrid';
import { MinaPromoCard } from '../components/landing/MinaPromoCard';
import { TestimonialCard } from '../components/landing/TestimonialCard';
import { LandingFooter } from '../components/landing/LandingFooter';
import { LanguageBottomSheet } from '../components/sheets/LanguageBottomSheet';

export default function LandingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [langSheetVisible, setLangSheetVisible] = useState(false);

  const handleGetStarted = () => {
    router.push('/choose-account' as any);
  };

  const handleSignIn = () => {
    router.push('/sign-in' as any);
  };

  const handleSelectRole = (role: 'household' | 'recycler') => {
    router.push({
      pathname: '/choose-account' as any,
      params: { role },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header with Language Selector & Sign In */}
      <LandingHeader
        onOpenLanguage={() => setLangSheetVisible(true)}
        onSignIn={handleSignIn}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 2. Hero Section */}
        <View style={styles.heroSection}>
          {/* Live Pilot Location Badge */}
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>{t('landing.badge')}</Text>
          </View>

          {/* Headline */}
          <Text style={styles.heroTitle}>{t('landing.heroTitle')}</Text>

          {/* Subtitle */}
          <Text style={styles.heroSubtitle}>{t('landing.heroSubtitle')}</Text>

          {/* Primary CTA */}
          <TouchableOpacity
            style={styles.heroCta}
            onPress={handleGetStarted}
            activeOpacity={0.85}
          >
            <Text style={styles.heroCtaText}>{t('common.getStarted')}</Text>
          </TouchableOpacity>

          {/* Secondary Link */}
          <TouchableOpacity
            style={styles.heroSecondaryLink}
            activeOpacity={0.7}
            onPress={() => {}}
          >
            <Text style={styles.heroSecondaryText}>{t('landing.seeHowItWorks')}</Text>
          </TouchableOpacity>

          {/* Interactive AI Scan Result Card Demonstration */}
          <ScanPreviewCard onFindRecycler={handleGetStarted} />
        </View>

        {/* 3. Trust & Pilot Metrics (Kubwa / ₦0 / 100% ID-checked / Escrow) */}
        <TrustMetrics />

        {/* 4. Audience Pathways (For Households / For Recyclers) */}
        <AudienceCards onSelectRole={handleSelectRole} />

        {/* 5. Step-by-Step Flow (Scan -> Instant Price -> Recycle & Earn) */}
        <HowItWorksSteps />

        {/* 6. AI Capabilities Grid */}
        <AiFeaturesGrid />

        {/* 7. 24/7 AI Assistant Showcase (Ask Mina) */}
        <MinaPromoCard onPressMina={() => {}} />

        {/* 8. Social Proof / Community Testimonial */}
        <TestimonialCard />

        {/* 9. Bottom Conversion Banner & Legal Footer */}
        <LandingFooter
          onGetStarted={handleGetStarted}
          onSignIn={handleSignIn}
        />
      </ScrollView>

      {/* S-01b: Multilingual Modal Bottom Sheet */}
      <LanguageBottomSheet
        visible={langSheetVisible}
        onClose={() => setLangSheetVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  topWaveContainer: {
    position: 'absolute',
    top: 58,
    left: 0,
    right: 0,
    height: 240,
    zIndex: 0,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  badgePill: {
    backgroundColor: '#EAF5EA',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    color: '#2D6A2E',
    fontSize: 13,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '800',
    color: '#0F1E12',
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: -0.8,
    marginBottom: 14,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 22,
    paddingHorizontal: 8,
  },
  heroCta: {
    backgroundColor: '#2D6A2E',
    width: '100%',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#2D6A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  heroCtaText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  heroSecondaryLink: {
    paddingVertical: 6,
    marginBottom: 6,
  },
  heroSecondaryText: {
    color: '#2D6A2E',
    fontSize: 15,
    fontWeight: '700',
  },
});
