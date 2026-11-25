import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

import { TopGreenWave } from '../components/common/TopGreenWave';
import { AppHeader } from '../components/common/AppHeader';
import { LanguageBottomSheet } from '../components/sheets/LanguageBottomSheet';

export default function SignUpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();
  
  const role = (params.role as string) || 'household';
  const isHousehold = role !== 'recycler';

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [langSheetVisible, setLangSheetVisible] = useState(false);

  const isFormValid =
    fullName.trim().length > 0 &&
    phone.trim().length >= 8 &&
    password.length >= 6 &&
    password === confirmPassword &&
    agreedToTerms;

  const handleCreateAccount = () => {
    // Navigate to phone verification (S-06)
    router.push({
      pathname: '/verify-phone' as any,
      params: { phone: `+234${phone.replace(/^0+/, '')}`, role },
    });
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header with Back Arrow and Language Selector */}
      <AppHeader
        showBack={true}
        onOpenLanguage={() => setLangSheetVisible(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Headings */}
        <View style={styles.headingSection}>
          <Text style={styles.mainTitle}>
            {isHousehold ? t('signUp.title') : 'Create your recycler account'}
          </Text>
          <Text style={styles.subTitle}>
            {isHousehold
              ? t('signUp.subtitle')
              : 'Start getting recycling requests and grow your business.'}
          </Text>
        </View>

        {/* Selected Role Badge */}
        <View style={styles.roleBadgeContainer}>
          <View style={styles.roleBadge}>
            <View style={styles.badgeCheckCircle}>
              <Check size={12} color="#15803D" strokeWidth={3} />
            </View>
            <Text style={styles.badgeText}>
              {isHousehold ? t('signUp.signingUpAs') : 'Signing up as a recycler'}
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/choose-account')}
              activeOpacity={0.7}
            >
              <Text style={styles.badgeChangeLink}>{t('signUp.change')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Container */}
        <View style={styles.formCard}>
          {/* 1. Full name or business name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              {isHousehold ? t('signUp.fullName') : 'Full name or business name'}
            </Text>
            <View style={styles.inputBox}>
              <User size={18} color="#94A3B8" />
              <TextInput
                style={styles.textInput}
                placeholder={
                  isHousehold
                    ? t('signUp.fullNamePlaceholder')
                    : 'e.g. Musa Waste Collection'
                }
                placeholderTextColor="#94A3B8"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* 2. Phone number */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('signUp.phone')}</Text>
            <View style={styles.phoneInputBox}>
              <View style={styles.countryPrefixRow}>
                <Text style={styles.countryFlagText}>🇳🇬</Text>
                <Text style={styles.countryCodeText}>+234</Text>
              </View>
              <View style={styles.prefixDivider} />
              <TextInput
                style={styles.phoneTextInput}
                placeholder="803 000 0000"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            <Text style={styles.helperText}>{t('signUp.phoneHelper')}</Text>
          </View>

          {/* 3. Email (Optional) */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.inputLabel}>{t('signUp.email')}</Text>
              <Text style={styles.optionalTag}>{t('signUp.optional')}</Text>
            </View>
            <View style={styles.inputBox}>
              <Mail size={18} color="#94A3B8" />
              <TextInput
                style={styles.textInput}
                placeholder={t('signUp.emailPlaceholder')}
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          {/* 4. Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('signUp.password')}</Text>
            <View style={styles.inputBox}>
              <Lock size={18} color="#94A3B8" />
              <TextInput
                style={styles.textInput}
                placeholder={t('signUp.passwordPlaceholder')}
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                {showPassword ? (
                  <EyeOff size={18} color="#64748B" />
                ) : (
                  <Eye size={18} color="#64748B" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* 5. Confirm password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('signUp.confirmPassword')}</Text>
            <View style={styles.inputBox}>
              <Lock size={18} color="#94A3B8" />
              <TextInput
                style={styles.textInput}
                placeholder={t('signUp.confirmPasswordPlaceholder')}
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                activeOpacity={0.7}
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} color="#64748B" />
                ) : (
                  <Eye size={18} color="#64748B" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms and Privacy Checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkboxBox, agreedToTerms && styles.checkboxBoxActive]}>
              {agreedToTerms && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
            </View>
            <Text style={styles.checkboxLabel}>
              {t('signUp.agreeText')}{' '}
              <Text style={styles.linkSpan}>{t('signUp.terms')}</Text>{' '}
              {t('signUp.and')}{' '}
              <Text style={styles.linkSpan}>{t('signUp.privacyPolicy')}</Text>
            </Text>
          </TouchableOpacity>

          {/* Create Account CTA */}
          <TouchableOpacity
            style={[styles.createBtn, isFormValid && styles.createBtnActive]}
            onPress={handleCreateAccount}
            activeOpacity={0.85}
          >
            <Text style={[styles.createBtnText, isFormValid && styles.createBtnTextActive]}>
              {t('signUp.createAccount')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Social Login Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t('signUp.orContinueWith')}</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialRow}>
          {/* Google Button */}
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <Path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <Path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <Path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </Svg>
            <Text style={styles.socialBtnText}>{t('signUp.google')}</Text>
          </TouchableOpacity>

          {/* Apple Button */}
          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Path
                fill="#000000"
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.62 1.35-.57.65-1.06 1.71-.93 2.73 1 .08 2.01-.48 2.63-1.23z"
              />
            </Svg>
            <Text style={styles.socialBtnText}>{t('signUp.apple')}</Text>
          </TouchableOpacity>
        </View>

        {/* Already have an account row */}
        <View style={styles.signInRow}>
          <Text style={styles.signInPromptText}>
            {t('signUp.alreadyHaveAccount')}{' '}
          </Text>
          <TouchableOpacity onPress={handleSignIn} activeOpacity={0.7}>
            <Text style={styles.signInLinkText}>{t('signUp.signIn')}</Text>
          </TouchableOpacity>
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
    paddingBottom: 40,
  },
  headingSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 28,
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
  },
  roleBadgeContainer: {
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal: 20,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5EA',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 8,
  },
  badgeCheckCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  badgeChangeLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
    textDecorationLine: 'underline',
    marginLeft: 2,
  },
  formCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 6,
  },
  optionalTag: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F1E12',
    height: '100%',
  },
  phoneInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    backgroundColor: '#FFFFFF',
  },
  countryPrefixRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 10,
  },
  countryFlagText: {
    fontSize: 16,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1E12',
  },
  prefixDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  phoneTextInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F1E12',
    height: '100%',
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 5,
    paddingLeft: 2,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    gap: 10,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkboxBoxActive: {
    backgroundColor: '#2D6A2E',
    borderColor: '#2D6A2E',
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#475569',
    flex: 1,
    lineHeight: 18,
  },
  linkSpan: {
    color: '#2D6A2E',
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  createBtn: {
    backgroundColor: '#F1F5F9',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 4,
  },
  createBtnActive: {
    backgroundColor: '#2D6A2E',
    borderColor: '#2D6A2E',
    shadowColor: '#2D6A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  createBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94A3B8',
  },
  createBtnTextActive: {
    color: '#FFFFFF',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 22,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  socialBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1E12',
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
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
});
