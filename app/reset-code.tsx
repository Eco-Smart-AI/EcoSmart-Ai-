import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Key, Check } from 'lucide-react-native';

import { TopGreenWave } from '../components/common/TopGreenWave';
import { AppHeader } from '../components/common/AppHeader';
import { LanguageBottomSheet } from '../components/sheets/LanguageBottomSheet';

export default function ResetCodeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  const target = (params.target as string) || '080•••••89';
  const [otp, setOtp] = useState(['7', '3', '1', '9', '0', '2']);
  const [resendTimer, setResendTimer] = useState(42);
  const [canResend, setCanResend] = useState(false);
  const [langSheetVisible, setLangSheetVisible] = useState(false);

  const inputRefs = useRef<Array<React.ComponentRef<typeof TextInput> | null>>([]);

  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = () => {
    // Navigates to S-11 (Set New Password)
    router.push('/set-new-password');
  };

  const formattedTimer = `0:${resendTimer < 10 ? `0${resendTimer}` : resendTimer}`;
  const isFilled = otp.every((d) => d.length > 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        showBack={true}
        onOpenLanguage={() => setLangSheetVisible(true)}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Code sent banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.successBanner}>
            <Check size={16} color="#15803D" strokeWidth={2.5} />
            <Text style={styles.successBannerText}>
              {t('resetCode.codeSent', { phone: target })}
            </Text>
          </View>
        </View>

        {/* Key Icon Badge */}
        <View style={styles.iconCircleWrapper}>
          <View style={styles.iconCircle}>
            <Key size={28} color="#2D6A2E" />
          </View>
        </View>

        {/* Headings */}
        <View style={styles.headingSection}>
          <Text style={styles.title}>{t('resetCode.title')}</Text>
          <Text style={styles.subtitle}>
            {t('resetCode.subtitle', { phone: target })}
          </Text>
        </View>

        {/* 6 OTP boxes */}
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <View key={index} style={[styles.otpBox, digit && styles.otpBoxFilled]}>
              <TextInput
                ref={(ref) => {
                  inputRefs.current[index] = ref;
                }}
                style={styles.otpInput}
                value={digit}
                onChangeText={(val) => handleOtpChange(val, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
              />
            </View>
          ))}
        </View>

        {/* Verify Code CTA */}
        <TouchableOpacity
          style={[styles.verifyBtn, isFilled && styles.verifyBtnActive]}
          onPress={handleVerify}
          activeOpacity={0.85}
        >
          <Text style={[styles.verifyBtnText, isFilled && styles.verifyBtnTextActive]}>
            {t('resetCode.verifyCode')}
          </Text>
        </TouchableOpacity>

        {/* Resend actions */}
        <View style={styles.bottomActions}>
          {canResend ? (
            <View style={styles.resendRow}>
              <Text style={styles.didntGetText}>{t('resetCode.didntGetIt')}{' '}</Text>
              <TouchableOpacity
                onPress={() => {
                  setResendTimer(59);
                  setCanResend(false);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.resendLinkText}>{t('resetCode.resendCode')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.timerText}>
              {t('resetCode.didntGetIt')}{' '}
              {t('resetCode.resendIn', { timer: formattedTimer })}
            </Text>
          )}

          <TouchableOpacity style={styles.callLinkBtn} activeOpacity={0.7}>
            <Text style={styles.callLinkText}>{t('resetCode.callInstead')}</Text>
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
  safeArea: { flex: 1, backgroundColor: '#FFFFFF', position: 'relative' },
  scrollContent: { paddingBottom: 40, paddingHorizontal: 20, alignItems: 'center' },
  bannerContainer: { width: '100%', marginTop: 10, marginBottom: 20 },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5EA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 8,
  },
  successBannerText: { fontSize: 14, fontWeight: '700', color: '#15803D' },
  iconCircleWrapper: { marginBottom: 16 },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingSection: { alignItems: 'center', marginBottom: 28 },
  title: { fontSize: 26, fontWeight: '800', color: '#0F1E12', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#475569', textAlign: 'center', lineHeight: 20, paddingHorizontal: 10 },
  otpRow: { flexDirection: 'row', justifyContent: 'center', gap: 8, width: '100%', marginBottom: 24 },
  otpBox: {
    width: 48,
    height: 58,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFilled: { borderColor: '#CBD5E1' },
  otpInput: { fontSize: 22, fontWeight: '800', color: '#0F1E12', textAlign: 'center', width: '100%', height: '100%' },
  verifyBtn: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  verifyBtnActive: {
    backgroundColor: '#2D6A2E',
    borderColor: '#2D6A2E',
    shadowColor: '#2D6A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  verifyBtnText: { fontSize: 16, fontWeight: '700', color: '#94A3B8' },
  verifyBtnTextActive: { color: '#FFFFFF' },
  bottomActions: { alignItems: 'center', gap: 14 },
  resendRow: { flexDirection: 'row', alignItems: 'center' },
  didntGetText: { fontSize: 14, color: '#64748B' },
  resendLinkText: { fontSize: 14, fontWeight: '700', color: '#2D6A2E' },
  timerText: { fontSize: 14, color: '#64748B' },
  callLinkBtn: { paddingVertical: 6 },
  callLinkText: { fontSize: 14, fontWeight: '700', color: '#2D6A2E' },
});
