import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Check, AlertCircle, MessageSquare } from 'lucide-react-native';

import { TopGreenWave } from '../components/common/TopGreenWave';
import { AppHeader } from '../components/common/AppHeader';
import { LanguageBottomSheet } from '../components/sheets/LanguageBottomSheet';

export default function VerifyPhoneScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  const rawPhone = (params.phone as string) || '0803 000 0089';
  // Mask phone for privacy: e.g. 080•••••89
  const maskedPhone = rawPhone.length > 5
    ? `${rawPhone.slice(0, 3)}•••••${rawPhone.slice(-2)}`
    : '080•••••89';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [hasError, setHasError] = useState(false);
  const [resendTimer, setResendTimer] = useState(57);
  const [canResend, setCanResend] = useState(false);
  const [langSheetVisible, setLangSheetVisible] = useState(false);

  const inputRefs = useRef<Array<React.ComponentRef<typeof TextInput> | null>>([]);

  // Countdown timer for resend
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
    if (hasError) setHasError(false);

    // Support pasting full 6 digit code
    if (value.length > 1) {
      const digits = value.replace(/[^0-9]/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();

      if (digits.length === 6) {
        validateOtp(newOtp.join(''));
      }
      return;
    }

    const digit = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto-advance
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-validate when 6th digit entered
    if (index === 5 && digit) {
      const fullCode = newOtp.join('');
      validateOtp(fullCode);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const validateOtp = (code: string) => {
    // For demo purposes, '000000' triggers the wrong code error state (S-06b),
    // while other codes successfully verify and navigate to S-07
    if (code === '000000') {
      setHasError(true);
    } else {
      setHasError(false);
      router.push({
        pathname: '/account-verified',
        params: { phone: rawPhone, role: params.role || 'household' },
      });
    }
  };

  const handleManualVerify = () => {
    const fullCode = otp.join('');
    if (fullCode.length === 6) {
      validateOtp(fullCode);
    }
  };

  const handleResend = () => {
    setResendTimer(59);
    setCanResend(false);
    setHasError(false);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
  };

  const formattedTimer = `0:${resendTimer < 10 ? `0${resendTimer}` : resendTimer}`;
  const isFilled = otp.every((d) => d.length > 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <AppHeader
        showBack={true}
        onOpenLanguage={() => setLangSheetVisible(true)}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Banner: Sent (S-06) vs Wrong Code Error (S-06b) */}
        <View style={styles.bannerContainer}>
          {hasError ? (
            <View style={styles.errorBanner}>
              <AlertCircle size={18} color="#B91C1C" />
              <Text style={styles.errorBannerText}>
                {t('verifyPhone.wrongCode')}
              </Text>
            </View>
          ) : (
            <View style={styles.successBanner}>
              <Check size={16} color="#15803D" strokeWidth={2.5} />
              <Text style={styles.successBannerText}>
                {t('verifyPhone.codeSent', { phone: maskedPhone })}
              </Text>
            </View>
          )}
        </View>

        {/* Message Bubble Icon Badge */}
        <View style={styles.iconCircleWrapper}>
          <View style={styles.iconCircle}>
            <MessageSquare size={28} color="#2D6A2E" />
          </View>
        </View>

        {/* Headings */}
        <View style={styles.headingSection}>
          <Text style={styles.title}>{t('verifyPhone.title')}</Text>
          <Text style={styles.subtitle}>
            {t('verifyPhone.subtitle')}{' '}
            <Text style={styles.boldPhone}>{maskedPhone}</Text>.
          </Text>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.changeNumberBtn}
          >
            <Text style={styles.changeNumberText}>
              {t('verifyPhone.changeNumber')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 6-Digit OTP Box Row */}
        <View style={styles.otpRow}>
          {otp.map((digit, index) => {
            const isCurrent = otp.findIndex((d) => d === '') === index;
            return (
              <View
                key={index}
                style={[
                  styles.otpBox,
                  digit ? styles.otpBoxFilled : null,
                  isCurrent && !hasError ? styles.otpBoxActive : null,
                  hasError ? styles.otpBoxError : null,
                ]}
              >
                <TextInput
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    hasError && styles.otpInputError,
                  ]}
                  value={digit}
                  onChangeText={(val) => handleOtpChange(val, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={6}
                  selectTextOnFocus
                  autoFocus={index === 0}
                />
              </View>
            );
          })}
        </View>

        {/* Auto check helper */}
        <Text style={styles.autoCheckText}>
          {t('verifyPhone.autoCheckHelper')}
        </Text>

        {/* Verify Code Button */}
        <TouchableOpacity
          style={[styles.verifyBtn, isFilled && styles.verifyBtnActive]}
          onPress={handleManualVerify}
          activeOpacity={0.85}
          disabled={!isFilled}
        >
          <Text style={[styles.verifyBtnText, isFilled && styles.verifyBtnTextActive]}>
            {t('verifyPhone.verifyCode')}
          </Text>
        </TouchableOpacity>

        {/* Resend Timer & Call Me Links */}
        <View style={styles.bottomActions}>
          {canResend ? (
            <View style={styles.resendRow}>
              <Text style={styles.didntGetText}>
                {t('verifyPhone.didntGetIt')}{' '}
              </Text>
              <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
                <Text style={styles.resendLinkText}>
                  {t('verifyPhone.resendCode')}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.timerText}>
              {t('verifyPhone.didntGetIt')}{' '}
              {t('verifyPhone.resendIn', { timer: formattedTimer })}
            </Text>
          )}

          <TouchableOpacity
            style={styles.callLinkBtn}
            onPress={() => {}}
            activeOpacity={0.7}
          >
            <Text style={styles.callLinkText}>
              {t('verifyPhone.callInstead')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* S-01b: Language Bottom Sheet */}
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
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  bannerContainer: {
    width: '100%',
    marginTop: 10,
    marginBottom: 24,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5EA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 8,
  },
  successBannerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#15803D',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 8,
  },
  errorBannerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B91C1C',
    flex: 1,
    lineHeight: 18,
  },
  iconCircleWrapper: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F1E12',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  boldPhone: {
    fontWeight: '700',
    color: '#0F1E12',
  },
  changeNumberBtn: {
    marginTop: 6,
    paddingVertical: 4,
  },
  changeNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    marginBottom: 16,
  },
  otpBox: {
    width: 46,
    height: 56,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  otpBoxFilled: {
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  otpBoxActive: {
    borderColor: '#2D6A2E',
    backgroundColor: '#F7FCF8',
  },
  otpBoxError: {
    borderColor: '#DC2626',
    backgroundColor: '#FFF5F5',
  },
  otpInput: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F1E12',
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  otpInputError: {
    color: '#B91C1C',
  },
  autoCheckText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
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
  verifyBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94A3B8',
  },
  verifyBtnTextActive: {
    color: '#FFFFFF',
  },
  bottomActions: {
    alignItems: 'center',
    gap: 14,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  didntGetText: {
    fontSize: 14,
    color: '#64748B',
  },
  resendLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  timerText: {
    fontSize: 14,
    color: '#64748B',
  },
  callLinkBtn: {
    paddingVertical: 6,
  },
  callLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D6A2E',
  },
});
