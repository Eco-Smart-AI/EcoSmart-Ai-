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
import { User, Lock, Eye, EyeOff, Check, AlertCircle } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';

import { TopGreenWave } from '../components/common/TopGreenWave';
import { AppHeader } from '../components/common/AppHeader';
import { LanguageBottomSheet } from '../components/sheets/LanguageBottomSheet';

export default function SignInScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [identifier, setIdentifier] = useState('0803 456 7890');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [langSheetVisible, setLangSheetVisible] = useState(false);
  const [loginRole, setLoginRole] = useState<'household' | 'recycler'>('household');

  const isIdentifierValid = identifier.trim().length >= 5;

  const handleSignIn = () => {
    // For demo purposes: if password is 'wrong' or 'error', show S-08b error state
    if (password.toLowerCase() === 'wrong' || password.toLowerCase() === 'error') {
      setHasError(true);
      return;
    }

    setHasError(false);
    // Navigate to Household Home (/home) or Recycler Home (/recycler/home)
    router.replace((loginRole === 'recycler' ? '/recycler/home' : '/home') as any);
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
        <View style={styles.headingSection}>
          <Text style={styles.mainTitle}>{t('signIn.title')}</Text>
          <Text style={styles.subTitle}>{t('signIn.subtitle')}</Text>

          {/* Role Toggle for Demo Testing (Household vs Recycler) */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#F1F5F9',
              borderRadius: 18,
              padding: 3,
              marginTop: 14,
              borderWidth: 1,
              borderColor: '#E2E8F0',
            }}
          >
            <TouchableOpacity
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 15,
                backgroundColor: loginRole === 'household' ? '#2D6A2E' : 'transparent',
              }}
              onPress={() => setLoginRole('household')}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: loginRole === 'household' ? '#FFFFFF' : '#475569',
                }}
              >
                Household
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 15,
                backgroundColor: loginRole === 'recycler' ? '#2D6A2E' : 'transparent',
              }}
              onPress={() => setLoginRole('recycler')}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: loginRole === 'recycler' ? '#FFFFFF' : '#475569',
                }}
              >
                Recycler (Musa)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formCard}>
          {/* Phone number or email input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('signIn.phoneOrEmail')}</Text>
            <View style={styles.inputBox}>
              <User size={18} color="#94A3B8" />
              <TextInput
                style={styles.textInput}
                placeholder="0803 000 0000 or email"
                placeholderTextColor="#94A3B8"
                value={identifier}
                onChangeText={(val) => {
                  setIdentifier(val);
                  if (hasError) setHasError(false);
                }}
                autoCapitalize="none"
              />
              {isIdentifierValid && (
                <Check size={18} color="#15803D" strokeWidth={2.5} />
              )}
            </View>
          </View>

          {/* Password with Forgot password link */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.inputLabel}>{t('signIn.password')}</Text>
              <TouchableOpacity
                onPress={() => router.push('/forgot-password')}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotLink}>{t('signIn.forgotPassword')}</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputBox, hasError && styles.inputBoxError]}>
              <Lock size={18} color={hasError ? '#B91C1C' : '#94A3B8'} />
              <TextInput
                style={[styles.textInput, hasError && styles.textInputError]}
                placeholder="Enter password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(val) => {
                  setPassword(val);
                  if (hasError) setHasError(false);
                }}
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

            {/* S-08b Error message */}
            {hasError && (
              <View style={styles.errorRow}>
                <AlertCircle size={15} color="#B91C1C" />
                <Text style={styles.errorText}>
                  {t('signIn.wrongPasswordError')}
                </Text>
              </View>
            )}
          </View>

          {/* Sign In CTA */}
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={handleSignIn}
            activeOpacity={0.85}
          >
            <Text style={styles.signInBtnText}>{t('signIn.signInBtn')}</Text>
          </TouchableOpacity>
        </View>

        {/* Social Login Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>{t('signIn.orContinueWith')}</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialRow}>
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
            <Text style={styles.socialBtnText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Path
                fill="#000000"
                d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.98.6-2.62 1.35-.57.65-1.06 1.71-.93 2.73 1 .08 2.01-.48 2.63-1.23z"
              />
            </Svg>
            <Text style={styles.socialBtnText}>Apple</Text>
          </TouchableOpacity>
        </View>

        {/* Create account prompt */}
        <View style={styles.signUpRow}>
          <Text style={styles.signUpPromptText}>{t('signIn.newToEcoSmart')}{' '}</Text>
          <TouchableOpacity
            onPress={() => router.push('/choose-account')}
            activeOpacity={0.7}
          >
            <Text style={styles.signUpLinkText}>{t('signIn.createAccount')}</Text>
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
  },
  headingSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#133E1A',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subTitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
  },
  formCard: {
    marginHorizontal: 20,
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
  forgotLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D6A2E',
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
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F1E12',
    height: '100%',
  },
  textInputError: {
    color: '#B91C1C',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 2,
  },
  errorText: {
    fontSize: 12,
    color: '#B91C1C',
    flex: 1,
    lineHeight: 16,
    fontWeight: '500',
  },
  signInBtn: {
    backgroundColor: '#2D6A2E',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#2D6A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  signInBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
  },
  signUpPromptText: {
    fontSize: 15,
    color: '#475569',
  },
  signUpLinkText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2D6A2E',
  },
});
