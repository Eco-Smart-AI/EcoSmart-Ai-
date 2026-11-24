import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Home, RefreshCw, ArrowRight, Check, Lock, ShieldCheck } from 'lucide-react-native';

import { TopGreenWave } from '../components/common/TopGreenWave';
import { AppHeader } from '../components/common/AppHeader';
import { LanguageBottomSheet } from '../components/sheets/LanguageBottomSheet';

export default function ChooseAccountScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [langSheetVisible, setLangSheetVisible] = useState(false);

  const handleSelectRole = (role: 'household' | 'recycler') => {
    router.push({
      pathname: '/sign-up',
      params: { role },
    });
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with White Bar & Small Green Wave Strip */}
      <AppHeader
        showBack={true}
        onOpenLanguage={() => setLangSheetVisible(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Illustration with Wavy Bottom Profile */}
        <View style={styles.illustrationWrapper}>
          <Image
            source={require('../assets/images/onboarding-hero.png')}
            style={styles.illustrationImage}
            resizeMode="cover"
          />
        </View>

        {/* Headings */}
        <View style={styles.headingSection}>
          <Text style={styles.mainTitle}>{t('chooseAccount.title')}</Text>
          <Text style={styles.subTitle}>{t('chooseAccount.subtitle')}</Text>
        </View>

        {/* Divider with Center Badge */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerBadgeText}>{t('chooseAccount.iam')}</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Role Cards List */}
        <View style={styles.cardsContainer}>
          {/* Card 1: Household */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleSelectRole('household')}
            activeOpacity={0.8}
          >
            <View style={styles.roleIconCircle}>
              <Home size={24} color="#2D6A2E" />
            </View>
            <View style={styles.roleInfo}>
              <Text style={styles.roleTitle}>{t('chooseAccount.householdTitle')}</Text>
              <Text style={styles.roleDesc}>{t('chooseAccount.householdDesc')}</Text>
            </View>
            <View style={styles.arrowCircle}>
              <ArrowRight size={18} color="#64748B" />
            </View>
          </TouchableOpacity>

          {/* Card 2: Recycler */}
          <TouchableOpacity
            style={styles.roleCard}
            onPress={() => handleSelectRole('recycler')}
            activeOpacity={0.8}
          >
            <View style={styles.roleIconCircle}>
              <RefreshCw size={22} color="#2D6A2E" />
            </View>
            <View style={styles.roleInfo}>
              <Text style={styles.roleTitle}>{t('chooseAccount.recyclerTitle')}</Text>
              <Text style={styles.roleDesc}>{t('chooseAccount.recyclerDesc')}</Text>
            </View>
            <View style={styles.arrowCircle}>
              <ArrowRight size={18} color="#64748B" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Sign in Prompt */}
        <View style={styles.signInRow}>
          <Text style={styles.signInPromptText}>
            {t('chooseAccount.alreadyHaveAccount')}{' '}
          </Text>
          <TouchableOpacity onPress={handleSignIn} activeOpacity={0.7}>
            <Text style={styles.signInLinkText}>{t('chooseAccount.signIn')}</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Trust Indicators */}
        <View style={styles.trustBar}>
          <View style={styles.trustItem}>
            <Check size={14} color="#2D6A2E" strokeWidth={2.5} />
            <Text style={styles.trustText}>{t('chooseAccount.freeToJoin')}</Text>
          </View>
          <View style={styles.trustItem}>
            <Lock size={13} color="#2D6A2E" strokeWidth={2.5} />
            <Text style={styles.trustText}>{t('chooseAccount.moneyProtected')}</Text>
          </View>
          <View style={styles.trustItem}>
            <ShieldCheck size={14} color="#2D6A2E" strokeWidth={2.5} />
            <Text style={styles.trustText}>{t('chooseAccount.verifiedRecyclers')}</Text>
          </View>
        </View>
      </ScrollView>

      {/* S-01b: Language Bottom Sheet Modal */}
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
  scrollContent: {
    paddingBottom: 36,
  },
  illustrationWrapper: {
    width: '100%',
    height: 195,
    overflow: 'hidden',
    backgroundColor: '#EEF7F0',
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 36,
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },
  headingSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 22,
  },
  mainTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#153D1A',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#153D1A',
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 14,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  roleIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EBF6ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleInfo: {
    flex: 1,
    marginLeft: 14,
    marginRight: 10,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 3,
  },
  roleDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 30,
  },
  signInPromptText: {
    fontSize: 15,
    color: '#475569',
  },
  signInLinkText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2D6A2E',
  },
  trustBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 18,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  trustText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
});
