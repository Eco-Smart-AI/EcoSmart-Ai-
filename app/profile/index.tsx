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
import {
  ArrowLeft,
  Wallet,
  Landmark,
  MapPin,
  Bell,
  Globe,
  HelpCircle,
  ShieldAlert,
  LogOut,
  Check,
  Lock,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomNavBar } from '../../components/common/BottomNavBar';

type ProfileDemoMode =
  | '12.2_profile'
  | '5.10_notifications'
  | '6.10_notif_empty'
  | '5.11_language'
  | '6.18_session_expired';

export default function ProfileScreen() {
  const router = useRouter();
  const { i18n } = useTranslation();

  const [mode, setMode] = useState<ProfileDemoMode>('12.2_profile');
  const [selectedLang, setSelectedLang] = useState<string>(i18n.language || 'en');

  const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'pcm', label: 'Pidgin' },
    { code: 'ha', label: 'Hausa' },
    { code: 'yo', label: 'Yoruba' },
    { code: 'ig', label: 'Igbo' },
  ];

  const handleSaveLanguage = () => {
    i18n.changeLanguage(selectedLang);
    setMode('12.2_profile');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        showBack={false}
        rightAction="bell"
        onPressBell={() => setMode('5.10_notifications')}
      />

      {/* Demo Switcher for Profile, Notifications, Language, Session Expired */}
      <View style={styles.demoBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoScroll}
        >
          {(
            [
              { key: '12.2_profile', label: '12.2 Profile' },
              { key: '5.10_notifications', label: '5.10 Notifications' },
              { key: '6.10_notif_empty', label: '6.10 Notif Empty' },
              { key: '5.11_language', label: '5.11 Language' },
              { key: '6.18_session_expired', label: '6.18 Session Expired' },
            ] as const
          ).map((item) => {
            const active = mode === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.demoPill, active && styles.demoPillActive]}
                onPress={() => setMode(item.key)}
              >
                <Text style={[styles.demoPillText, active && styles.demoPillTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ===================================================== */}
        {/* 12.2 Generator Profile                                */}
        {/* ===================================================== */}
        {mode === '12.2_profile' && (
          <View>
            <Text style={styles.pageTitle}>Profile</Text>

            {/* User Card */}
            <View style={styles.userCard}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>MA</Text>
              </View>
              <View>
                <Text style={styles.userName}>Musa Abdullahi</Text>
                <Text style={styles.userMeta}>Household · Kubwa, Abuja</Text>
              </View>
            </View>

            {/* MONEY Section */}
            <Text style={styles.sectionHeader}>MONEY</Text>
            <View style={styles.menuCard}>
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => router.push('/wallet')}
              >
                <Wallet size={18} color="#2D6A2E" />
                <Text style={styles.menuLabel}>Wallet</Text>
                <Text style={styles.menuValue}>₦1,624</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => router.push('/wallet')}
              >
                <Landmark size={18} color="#2D6A2E" />
                <Text style={styles.menuLabel}>Payout account</Text>
                <Text style={styles.menuValue}>OPay •••• 4421</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </View>

            {/* APP Section */}
            <Text style={styles.sectionHeader}>APP</Text>
            <View style={styles.menuCard}>
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => router.push('/recyclers')}
              >
                <MapPin size={18} color="#475569" />
                <Text style={styles.menuLabel}>Saved addresses</Text>
                <Text style={styles.menuValue}>Home</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => setMode('5.10_notifications')}
              >
                <Bell size={18} color="#475569" />
                <Text style={styles.menuLabel}>Notifications</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => setMode('5.11_language')}
              >
                <Globe size={18} color="#475569" />
                <Text style={styles.menuLabel}>Language</Text>
                <Text style={styles.menuValue}>
                  {LANGUAGES.find((l) => l.code === selectedLang)?.label || 'English'}
                </Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => router.push('/messages')}
              >
                <HelpCircle size={18} color="#475569" />
                <Text style={styles.menuLabel}>Help and support</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => router.push('/negotiation')}
              >
                <ShieldAlert size={18} color="#475569" />
                <Text style={styles.menuLabel}>My reports</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            </View>

            {/* Log Out Button */}
            <TouchableOpacity
              style={styles.logoutCard}
              onPress={() => setMode('6.18_session_expired')}
            >
              <LogOut size={18} color="#DC2626" />
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ===================================================== */}
        {/* 5.10 Notifications                                    */}
        {/* ===================================================== */}
        {mode === '5.10_notifications' && (
          <View>
            <View style={styles.topBackRow}>
              <TouchableOpacity
                style={styles.backBtnRow}
                onPress={() => setMode('12.2_profile')}
              >
                <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
                <Text style={styles.backTitle}>Notifications</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setMode('6.10_notif_empty')}>
                <Text style={styles.markReadGreen}>Mark all read</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionHeader}>NEW</Text>
            <View style={styles.notifGroupCard}>
              {[
                {
                  title: 'Dispute solved: ₦384 paid to you',
                  time: 'Today, 14:30',
                  route: '/wallet',
                },
                {
                  title: 'A buyer wants your PET at ₦120/kg',
                  time: 'Today, 11:15',
                  route: '/wanted',
                },
                {
                  title: 'Kubwa Green Hub reviewed you',
                  time: 'Yesterday',
                  route: '/pickup/receipt',
                },
              ].map((n, idx) => (
                <React.Fragment key={n.title}>
                  {idx > 0 && <View style={styles.menuDivider} />}
                  <TouchableOpacity
                    style={styles.notifRow}
                    onPress={() => router.push(n.route as any)}
                  >
                    <View style={styles.notifIconGreen}>
                      <Check size={14} color="#2D6A2E" strokeWidth={2.6} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.notifTitle}>{n.title}</Text>
                      <Text style={styles.notifTime}>{n.time}</Text>
                    </View>
                    <View style={styles.unreadGreenDot} />
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>

            <Text style={styles.sectionHeader}>EARLIER</Text>
            <View style={styles.notifGroupCard}>
              {[
                { title: '₦384 added to your wallet', time: 'Sat, 14:15' },
                { title: 'Check the final amount: ₦384', time: 'Sat, 14:06' },
                { title: 'Kubwa Green Hub has arrived', time: 'Sat, 13:58' },
                { title: 'Kubwa Green Hub is on the way', time: 'Sat, 13:35' },
                { title: 'New pickup time: Sat, 2–3pm', time: 'Sat, 10:11' },
                { title: 'Pickup accepted · ₦450 set aside', time: 'Sat, 09:41' },
                { title: 'Your request to Bwari Renew expired', time: 'Fri, 18:00' },
              ].map((n, idx) => (
                <React.Fragment key={n.title}>
                  {idx > 0 && <View style={styles.menuDivider} />}
                  <TouchableOpacity
                    style={styles.notifRow}
                    onPress={() => router.push('/pickup/REQ-001')}
                  >
                    <View style={styles.notifIconAmber}>
                      <Bell size={14} color="#B45309" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.notifTitle}>{n.title}</Text>
                      <Text style={styles.notifTime}>{n.time}</Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                </React.Fragment>
              ))}
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 6.10 Notifications · Empty                            */}
        {/* ===================================================== */}
        {mode === '6.10_notif_empty' && (
          <View>
            <TouchableOpacity
              style={[styles.backBtnRow, { marginBottom: 14 }]}
              onPress={() => setMode('12.2_profile')}
            >
              <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
              <Text style={styles.backTitle}>Notifications</Text>
            </TouchableOpacity>

            <Text style={styles.pageTitle}>Notifications</Text>
            <Text style={styles.pageSubtitle}>
              Updates from your recycling activity.
            </Text>

            <View style={styles.emptyCard}>
              <View style={styles.emptyIconCircle}>
                <Bell size={24} color="#2D6A2E" />
              </View>
              <Text style={styles.emptyTitle}>You're all caught up</Text>
              <Text style={styles.emptyDesc}>
                New request updates, messages and payment notifications will appear here.
              </Text>
              <TouchableOpacity
                style={[styles.primaryGreenBtn, { width: '100%' }]}
                onPress={() => router.push('/home')}
              >
                <Text style={styles.primaryGreenBtnText}>Back to home</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 5.11 Language                                         */}
        {/* ===================================================== */}
        {mode === '5.11_language' && (
          <View>
            <TouchableOpacity
              style={[styles.backBtnRow, { marginBottom: 14 }]}
              onPress={() => setMode('12.2_profile')}
            >
              <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
              <Text style={styles.backTitle}>Language</Text>
            </TouchableOpacity>

            <Text style={styles.pageTitle}>Language</Text>
            <Text style={styles.pageSubtitle}>
              Choose the language you prefer to use in EcoSmart.
            </Text>

            <View style={styles.langListCard}>
              {LANGUAGES.map((lang) => {
                const selected = selectedLang === lang.code;
                return (
                  <TouchableOpacity
                    key={lang.code}
                    style={[
                      styles.langOptionRow,
                      selected && styles.langOptionRowSelected,
                    ]}
                    onPress={() => setSelectedLang(lang.code)}
                  >
                    <Text
                      style={[
                        styles.langOptionLabel,
                        selected && styles.langOptionLabelSelected,
                      ]}
                    >
                      {lang.label}
                    </Text>
                    <View
                      style={[
                        styles.radioOuter,
                        selected && styles.radioOuterSelected,
                      ]}
                    >
                      {selected && <View style={styles.radioInner} />}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.langHintBox}>
              <Text style={styles.langHintTitle}>
                {LANGUAGES.find((l) => l.code === selectedLang)?.label || 'English'} is currently selected
              </Text>
              <Text style={styles.langHintSub}>
                Choose one language, then save your preference.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryGreenBtn, { marginTop: 18 }]}
              onPress={handleSaveLanguage}
            >
              <Text style={styles.primaryGreenBtnText}>Save language</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ===================================================== */}
        {/* 6.18 Account · Session expired                        */}
        {/* ===================================================== */}
        {mode === '6.18_session_expired' && (
          <View>
            <TouchableOpacity
              style={[styles.backBtnRow, { marginBottom: 18 }]}
              onPress={() => setMode('12.2_profile')}
            >
              <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
              <Text style={styles.backTitle}>Account</Text>
            </TouchableOpacity>

            <View style={styles.sessionCard}>
              <View style={styles.emptyIconCircle}>
                <Lock size={22} color="#2D6A2E" />
              </View>
              <Text style={styles.emptyTitle}>You've been signed out</Text>
              <Text style={styles.emptyDesc}>
                To keep your money safe, please sign in again.
              </Text>

              <View style={styles.handoverSafeBanner}>
                <View style={styles.handoverSafeRow}>
                  <Check size={14} color="#2D6A2E" strokeWidth={2.8} />
                  <Text style={styles.handoverSafeTitle}>
                    In the middle of a handover?
                  </Text>
                </View>
                <Text style={styles.handoverSafeSub}>
                  Your code still works. It's also in your SMS.
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 190 }}>
              <TouchableOpacity
                style={styles.primaryGreenBtn}
                onPress={() => router.push('/sign-in')}
              >
                <Text style={styles.primaryGreenBtnText}>Sign in again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <BottomNavBar activeTab="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F4',
  },
  demoBar: {
    backgroundColor: '#EAF5EA',
    borderBottomWidth: 1,
    borderBottomColor: '#C7E4B2',
  },
  demoScroll: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  demoPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7E4B2',
  },
  demoPillActive: {
    backgroundColor: '#2D6A2E',
    borderColor: '#2D6A2E',
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2D6A2E',
  },
  demoPillTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F1E12',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    marginBottom: 14,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
    marginBottom: 16,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D6A2E',
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F1E12',
  },
  userMeta: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginTop: 4,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F1E12',
  },
  menuValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  chevron: {
    fontSize: 18,
    color: '#94A3B8',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },

  /* Notifications */
  topBackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  backBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1E12',
  },
  markReadGreen: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  notifGroupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  notifIconGreen: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifIconAmber: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F1E12',
  },
  notifTime: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  unreadGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2D6A2E',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  primaryGreenBtn: {
    backgroundColor: '#38762B',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryGreenBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* 5.11 Language */
  langListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    marginBottom: 14,
  },
  langOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 12,
  },
  langOptionRowSelected: {
    backgroundColor: '#E4F3D8',
  },
  langOptionLabel: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#0F1E12',
  },
  langOptionLabelSelected: {
    fontWeight: '800',
    color: '#1E5D2E',
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#2D6A2E',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2D6A2E',
  },
  langHintBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  langHintTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
  },
  langHintSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  /* 6.18 Session Expired */
  sessionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  handoverSafeBanner: {
    backgroundColor: '#EAF5EA',
    borderRadius: 14,
    padding: 14,
    width: '100%',
  },
  handoverSafeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  handoverSafeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E5D2E',
  },
  handoverSafeSub: {
    fontSize: 12,
    color: '#2D6A2E',
    marginTop: 2,
    marginLeft: 20,
  },
});
