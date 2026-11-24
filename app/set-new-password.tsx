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
import { Lock, Eye, EyeOff, Check } from 'lucide-react-native';

import { TopGreenWave } from '../components/common/TopGreenWave';
import { AppHeader } from '../components/common/AppHeader';
import { LanguageBottomSheet } from '../components/sheets/LanguageBottomSheet';

export default function SetNewPasswordScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [password, setPassword] = useState('Kubwa#2026');
  const [confirmPassword, setConfirmPassword] = useState('Kubwa#2026');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [langSheetVisible, setLangSheetVisible] = useState(false);

  // Requirement validations
  const hasMinLength = password.length >= 8;
  const hasCapital = /[A-Z]/.test(password);
  const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = password.length > 0 && password === confirmPassword;

  const handleSave = () => {
    // Navigates to S-12 (Password reset successful)
    router.replace('/password-reset-success');
  };

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
        {/* Lock Icon */}
        <View style={styles.iconCircleWrapper}>
          <View style={styles.iconCircle}>
            <Lock size={28} color="#2D6A2E" />
          </View>
        </View>

        {/* Headings */}
        <View style={styles.headingSection}>
          <Text style={styles.mainTitle}>{t('setNewPassword.title')}</Text>
          <Text style={styles.subTitle}>{t('setNewPassword.subtitle')}</Text>
        </View>

        {/* Card */}
        <View style={styles.formCard}>
          {/* New password input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('setNewPassword.newPassword')}</Text>
            <View style={styles.inputBoxActive}>
              <Lock size={18} color="#94A3B8" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter new password"
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

          {/* Strength Meter */}
          <View style={styles.strengthRow}>
            <View style={styles.strengthBars}>
              <View style={[styles.strengthBar, hasMinLength && styles.strengthBarActive]} />
              <View style={[styles.strengthBar, hasCapital && styles.strengthBarActive]} />
              <View style={[styles.strengthBar, hasNumberOrSymbol && styles.strengthBarActive]} />
            </View>
            <Text style={styles.strengthLabel}>{t('setNewPassword.strong')}</Text>
          </View>

          {/* Requirements list */}
          <View style={styles.reqList}>
            <View style={styles.reqItem}>
              <Check size={14} color={hasMinLength ? '#15803D' : '#94A3B8'} strokeWidth={2.5} />
              <Text style={[styles.reqText, hasMinLength && styles.reqTextActive]}>
                {t('setNewPassword.req1')}
              </Text>
            </View>

            <View style={styles.reqItem}>
              <Check size={14} color={hasCapital ? '#15803D' : '#94A3B8'} strokeWidth={2.5} />
              <Text style={[styles.reqText, hasCapital && styles.reqTextActive]}>
                {t('setNewPassword.req2')}
              </Text>
            </View>

            <View style={styles.reqItem}>
              <Check size={14} color={hasNumberOrSymbol ? '#15803D' : '#94A3B8'} strokeWidth={2.5} />
              <Text style={[styles.reqText, hasNumberOrSymbol && styles.reqTextActive]}>
                {t('setNewPassword.req3')}
              </Text>
            </View>
          </View>

          {/* Confirm new password input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('setNewPassword.confirmNewPassword')}</Text>
            <View style={styles.inputBox}>
              <Lock size={18} color="#94A3B8" />
              <TextInput
                style={styles.textInput}
                placeholder="Confirm new password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              {passwordsMatch && (
                <Check size={18} color="#15803D" strokeWidth={2.5} />
              )}
            </View>
          </View>

          {/* Save new password CTA */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Text style={styles.saveBtnText}>{t('setNewPassword.saveNewPassword')}</Text>
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
  scrollContent: { paddingBottom: 40, alignItems: 'center' },
  iconCircleWrapper: { marginTop: 10, marginBottom: 16 },
  iconCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingSection: { alignItems: 'center', paddingHorizontal: 20, marginBottom: 20 },
  mainTitle: { fontSize: 26, fontWeight: '800', color: '#133E1A', textAlign: 'center', marginBottom: 6 },
  subTitle: { fontSize: 15, color: '#64748B', textAlign: 'center' },
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
  inputGroup: { marginBottom: 14 },
  inputLabel: { fontSize: 14, fontWeight: '700', color: '#0F1E12', marginBottom: 8 },
  inputBoxActive: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#2D6A2E',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
    backgroundColor: '#FFFFFF',
    gap: 10,
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
  textInput: { flex: 1, fontSize: 15, color: '#0F1E12', height: '100%' },
  strengthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  strengthBars: { flexDirection: 'row', gap: 6, flex: 1, marginRight: 12 },
  strengthBar: { flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E2E8F0' },
  strengthBarActive: { backgroundColor: '#2D6A2E' },
  strengthLabel: { fontSize: 12, fontWeight: '700', color: '#15803D' },
  reqList: { gap: 8, marginBottom: 20 },
  reqItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reqText: { fontSize: 13, color: '#64748B' },
  reqTextActive: { color: '#15803D', fontWeight: '500' },
  saveBtn: {
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
  saveBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
