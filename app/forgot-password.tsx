import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react-native';

import { TopGreenWave } from '../components/common/TopGreenWave';
import { AppHeader } from '../components/common/AppHeader';
import { LanguageBottomSheet } from '../components/sheets/LanguageBottomSheet';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'phone' | 'email'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [hasError, setHasError] = useState(false);
  const [langSheetVisible, setLangSheetVisible] = useState(false);

  const handleSendCode = () => {
    // For demo purposes: if input contains '0000' or 'notfound', trigger S-09c error state
    if (
      (activeTab === 'phone' && phoneNumber.includes('0000')) ||
      (activeTab === 'email' && emailAddress.includes('notfound'))
    ) {
      setHasError(true);
      return;
    }

    setHasError(false);
    // Navigates to S-10 (Reset Code)
    router.push({
      pathname: '/reset-code',
      params: {
        target: activeTab === 'phone' ? `080•••••89` : emailAddress || 'user@example.com',
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        showBack={true}
        onOpenLanguage={() => setLangSheetVisible(true)}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Lock Icon Circle */}
        <View style={styles.iconCircleWrapper}>
          <View style={styles.iconCircle}>
            <Lock size={28} color="#2D6A2E" />
          </View>
        </View>

        {/* Headings */}
        <View style={styles.headingSection}>
          <Text style={styles.mainTitle}>{t('forgotPassword.title')}</Text>
          <Text style={styles.subTitle}>{t('forgotPassword.subtitle')}</Text>
        </View>

        {/* Tab Switcher: Phone vs Email */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'phone' && styles.tabBtnActive]}
            onPress={() => {
              setActiveTab('phone');
              setHasError(false);
            }}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'phone' && styles.tabBtnTextActive,
              ]}
            >
              {t('forgotPassword.phoneTab')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'email' && styles.tabBtnActive]}
            onPress={() => {
              setActiveTab('email');
              setHasError(false);
            }}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'email' && styles.tabBtnTextActive,
              ]}
            >
              {t('forgotPassword.emailTab')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {activeTab === 'phone' ? (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('forgotPassword.phoneLabel')}</Text>
              <View style={[styles.phoneInputBox, hasError && styles.inputBoxError]}>
                <View style={styles.countryPrefixRow}>
                  <Text style={styles.countryCodeText}>NG +234</Text>
                </View>
                <View style={styles.prefixDivider} />
                <TextInput
                  style={[styles.phoneTextInput, hasError && styles.textInputError]}
                  placeholder="803 000 0000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={(val) => {
                    setPhoneNumber(val);
                    if (hasError) setHasError(false);
                  }}
                />
                {hasError && <AlertCircle size={18} color="#B91C1C" />}
              </View>

              {hasError ? (
                <View style={styles.errorRow}>
                  <AlertCircle size={14} color="#B91C1C" />
                  <Text style={styles.errorText}>
                    {t('forgotPassword.notFoundError')}
                  </Text>
                </View>
              ) : (
                <Text style={styles.helperText}>
                  {t('forgotPassword.phoneHelper')}
                </Text>
              )}
            </View>
          ) : (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{t('forgotPassword.emailLabel')}</Text>
              <View style={[styles.inputBox, hasError && styles.inputBoxError]}>
                <Mail size={18} color={hasError ? '#B91C1C' : '#94A3B8'} />
                <TextInput
                  style={[styles.textInput, hasError && styles.textInputError]}
                  placeholder={t('forgotPassword.emailPlaceholder')}
                  placeholderTextColor="#94A3B8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={emailAddress}
                  onChangeText={(val) => {
                    setEmailAddress(val);
                    if (hasError) setHasError(false);
                  }}
                />
                {hasError && <AlertCircle size={18} color="#B91C1C" />}
              </View>

              {hasError && (
                <View style={styles.errorRow}>
                  <AlertCircle size={14} color="#B91C1C" />
                  <Text style={styles.errorText}>
                    {t('forgotPassword.notFoundError')}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Send Code CTA */}
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleSendCode}
            activeOpacity={0.85}
          >
            <Text style={styles.sendBtnText}>{t('forgotPassword.sendCode')}</Text>
          </TouchableOpacity>
        </View>

        {/* Back to sign in link */}
        <View style={styles.signInRow}>
          <Text style={styles.signInPromptText}>
            {t('forgotPassword.rememberPassword')}{' '}
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/sign-in')}
            activeOpacity={0.7}
          >
            <Text style={styles.signInLinkText}>{t('forgotPassword.signIn')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

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
    alignItems: 'center',
  },
  iconCircleWrapper: {
    marginTop: 10,
    marginBottom: 16,
  },
  iconCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#133E1A',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  subTitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  tabContainer: {
    flexDirection: 'row',
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  tabBtnActive: {
    backgroundColor: '#2D6A2E',
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  formCard: {
    width: '90%',
    padding: 22,
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 8,
  },
  phoneInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#2D6A2E',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    backgroundColor: '#FFFFFF',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  inputBoxError: {
    borderColor: '#DC2626',
    backgroundColor: '#FFF5F5',
  },
  countryPrefixRow: {
    marginRight: 10,
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
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F1E12',
    height: '100%',
  },
  textInputError: {
    color: '#B91C1C',
  },
  helperText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#B91C1C',
    flex: 1,
    fontWeight: '500',
    lineHeight: 16,
  },
  sendBtn: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  sendBtnText: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '700',
  },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
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
