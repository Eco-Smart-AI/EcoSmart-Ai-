import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Modal,
  Switch,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  ShieldCheck,
  Award,
  Building2,
  FileCheck,
  Wallet,
  Star,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Trash2,
  Search,
  MessageSquare,
  Phone,
  Sparkles,
  Check,
  X,
  Lock,
  AlertCircle,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import RecyclerBottomNavBar from '../../components/common/RecyclerBottomNavBar';

type ProfileView =
  | 'overview'
  | 'reviews'
  | 'settings'
  | 'help'
  | 'logout_modal'
  | 'delete_account'
  | 'faq_set_aside'
  | 'faq_no_code'
  | 'faq_change_prices'
  | 'faq_cash_out'
  | 'faq_renew_licence';

export default function RecyclerProfileScreen() {
  const router = useRouter();
  const [view, setView] = useState<ProfileView>('overview');

  // Settings toggles
  const [notifRequests, setNotifRequests] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifMoney, setNotifMoney] = useState(true);
  const [notifTips, setNotifTips] = useState(false);
  const [language, setLanguage] = useState<'English' | 'Pidgin' | 'Hausa'>('English');
  const [helpSearch, setHelpSearch] = useState('');

  const demoTabs: { id: ProfileView; label: string }[] = [
    { id: 'overview', label: '1. Profile' },
    { id: 'reviews', label: '2. Reviews' },
    { id: 'settings', label: '3. Settings' },
    { id: 'help', label: '4. Help & Support' },
    { id: 'logout_modal', label: '5. Log Out Modal' },
    { id: 'delete_account', label: '6. Delete Account' },
    { id: 'faq_set_aside', label: '7. FAQ: Set Aside' },
    { id: 'faq_no_code', label: '8. FAQ: No Code' },
    { id: 'faq_change_prices', label: '9. FAQ: Prices' },
    { id: 'faq_cash_out', label: '10. FAQ: Cash Out' },
    { id: 'faq_renew_licence', label: '11. FAQ: Licence' },
  ];

  const faqArticles: Record<
    string,
    { title: string; paragraphs: string[] }
  > = {
    faq_set_aside: {
      title: 'How does money set aside work?',
      paragraphs: [
        'When you accept a request, the money for it moves from your wallet into "set aside". The household can see it\'s ready, so they know you\'re serious.',
        'At the pickup you pay for the real weight. Any money you didn\'t use comes back to your wallet straight away.',
        'If the household isn\'t there, all of it comes back to you.',
      ],
    },
    faq_no_code: {
      title: "Household didn't give the code",
      paragraphs: [
        "Don't leave without the code. The household sees it in their app after they agree to the final amount.",
        'Ask them to open their pickup in the EcoSmart app. If they still won\'t share it, tap "Something\'s wrong".',
        'Your money stays safely set aside while EcoSmart checks. Nobody can take it.',
      ],
    },
    faq_change_prices: {
      title: 'How do I change my prices?',
      paragraphs: [
        'Go to Listings and open a collection. Change the price per kg and tap Save.',
        'New requests use your new price straight away. Pickups you already accepted keep the price you agreed.',
      ],
    },
    faq_cash_out: {
      title: "My cash out hasn't arrived",
      paragraphs: [
        'Most cash outs arrive within a few minutes. Some banks can take up to 24 hours.',
        'Check that your payout account name matches your ID. If it\'s still missing after 24 hours, chat with us and share the reference number.',
      ],
    },
    faq_renew_licence: {
      title: 'How do I renew my licence?',
      paragraphs: [
        'We remind you 30 days before your licence expires.',
        'Go to Profile · Verification and documents and add a photo of your new licence. We check it within 24 hours.',
        'You can keep working while we check.',
      ],
    },
  };

  const renderProfileOverview = () => (
    <View style={styles.contentWrap}>
      {/* Business Header Card */}
      <View style={styles.businessCard}>
        <View style={styles.bizHeaderRow}>
          <View style={styles.bizAvatar}>
            <Text style={styles.bizAvatarText}>MW</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.bizName}>Musa Waste Collection</Text>
            <Text style={styles.bizRole}>Collector · Kubwa, Abuja</Text>
          </View>
        </View>

        <View style={styles.badgesRow}>
          <View style={styles.verifiedTag}>
            <ShieldCheck size={13} color="#2E7D32" />
            <Text style={styles.verifiedTagText}>✓ ID verified</Text>
          </View>
          <View style={styles.verifiedTag}>
            <Award size={13} color="#2E7D32" />
            <Text style={styles.verifiedTagText}>✓ Licensed</Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricTile}>
            <Text style={styles.metricLabel}>Rating</Text>
            <Text style={styles.metricVal}>4.8</Text>
            <Text style={styles.metricSub}>124 reviews</Text>
          </View>
          <View style={styles.metricTile}>
            <Text style={styles.metricLabel}>Pickups</Text>
            <Text style={styles.metricVal}>184</Text>
            <Text style={styles.metricSub}>since July</Text>
          </View>
          <View style={styles.metricTile}>
            <Text style={styles.metricLabel}>Reliability</Text>
            <Text style={styles.metricVal}>98%</Text>
            <Text style={styles.metricSub}>on time</Text>
          </View>
        </View>
      </View>

      {/* BUSINESS SECTION */}
      <Text style={styles.groupHeader}>BUSINESS</Text>
      <View style={styles.menuCard}>
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => router.push('/recycler/setup' as any)}
        >
          <Building2 size={18} color="#4B5563" />
          <Text style={styles.menuRowTitle}>Business details</Text>
          <ChevronRight size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => router.push('/recycler/verification' as any)}
        >
          <FileCheck size={18} color="#4B5563" />
          <Text style={styles.menuRowTitle}>Verification and documents</Text>
          <Text style={styles.menuRowRightVal}>Approved</Text>
          <ChevronRight size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => router.push('/recycler/wallet' as any)}
        >
          <Wallet size={18} color="#4B5563" />
          <Text style={styles.menuRowTitle}>Payout account</Text>
          <Text style={styles.menuRowRightVal}>OPay · 6789</Text>
          <ChevronRight size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => setView('reviews')}
        >
          <Star size={18} color="#EAB308" />
          <Text style={styles.menuRowTitle}>Reviews</Text>
          <Text style={styles.menuRowRightVal}>4.8</Text>
          <ChevronRight size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuRow, { borderBottomWidth: 0 }]}
          onPress={() => router.push('/recycler/analytics' as any)}
        >
          <BarChart3 size={18} color="#EAB308" />
          <Text style={styles.menuRowTitle}>Analytics</Text>
          <Text style={styles.menuRowRightVal}>₦166,600 this month</Text>
          <ChevronRight size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* APP SECTION */}
      <Text style={styles.groupHeader}>APP</Text>
      <View style={styles.menuCard}>
        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => setView('settings')}
        >
          <Settings size={18} color="#4B5563" />
          <Text style={styles.menuRowTitle}>Settings</Text>
          <ChevronRight size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuRow}
          onPress={() => setView('help')}
        >
          <HelpCircle size={18} color="#4B5563" />
          <Text style={styles.menuRowTitle}>Help and support</Text>
          <ChevronRight size={18} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuRow, { borderBottomWidth: 0 }]}
          onPress={() => setView('logout_modal')}
        >
          <LogOut size={18} color="#DC2626" />
          <Text style={[styles.menuRowTitle, { color: '#DC2626' }]}>Log out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        showBack={true}
        rightAction="bell"
        onPressBell={() => router.push('/recycler/notifications' as any)}
      />

      {/* Sub-Header below green wave */}
      <View style={styles.header}>
        {view === 'overview' || view === 'logout_modal' ? (
          <Text style={styles.headerTitle}>Profile</Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() =>
                view.startsWith('faq_')
                  ? setView('help')
                  : view === 'delete_account'
                  ? setView('settings')
                  : setView('overview')
              }
              style={styles.backBtn}
            >
              <ArrowLeft size={20} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitleSmall}>
              {view === 'reviews'
                ? 'Reviews'
                : view === 'settings'
                ? 'Settings'
                : view === 'help'
                ? 'Help and support'
                : view === 'delete_account'
                ? 'Delete account'
                : 'Help'}
            </Text>
          </View>
        )}
      </View>

      {/* Demo Switcher Pills */}
      <View style={styles.demoPillsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoPillsScroll}
        >
          {demoTabs.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.demoPill, view === t.id && styles.demoPillActive]}
              onPress={() => setView(t.id)}
            >
              <Text style={[styles.demoPillText, view === t.id && styles.demoPillTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ================= FRAME 1 & 5: PROFILE OVERVIEW ================= */}
        {(view === 'overview' || view === 'logout_modal') && renderProfileOverview()}

        {/* ================= FRAME 2: REVIEWS ================= */}
        {view === 'reviews' && (
          <View style={styles.contentWrap}>
            <View style={styles.ratingOverviewCard}>
              <View style={styles.ratingLeftCol}>
                <Text style={styles.ratingScoreBig}>4.8</Text>
                <Text style={styles.starsGold}>★★★★★</Text>
                <Text style={styles.ratingCountSub}>124 reviews</Text>
              </View>
              <View style={styles.ratingRightCol}>
                {[
                  { star: '5', pct: '85%' },
                  { star: '4', pct: '12%' },
                  { star: '3', pct: '3%' },
                  { star: '2', pct: '0%' },
                  { star: '1', pct: '0%' },
                ].map((bar) => (
                  <View key={bar.star} style={styles.barRow}>
                    <Text style={styles.barStarText}>{bar.star}</Text>
                    <View style={styles.barTrack}>
                      <View style={[styles.barFill, { width: bar.pct as any }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.groupHeader}>LATEST</Text>
            <View style={styles.reviewsListCard}>
              <View style={styles.reviewItem}>
                <View style={styles.reviewTopRow}>
                  <Text style={styles.reviewerName}>Amaka O. ★★★★★</Text>
                  <Text style={styles.reviewDate}>Mon</Text>
                </View>
                <Text style={styles.reviewBody}>
                  Quick and fair. Weighed in front of me.
                </Text>
              </View>

              <View style={styles.reviewItem}>
                <View style={styles.reviewTopRow}>
                  <Text style={styles.reviewerName}>Halima B. ★★★★☆</Text>
                  <Text style={styles.reviewDate}>Last week</Text>
                </View>
                <Text style={styles.reviewBody}>
                  Came a bit late but paid correctly.
                </Text>
              </View>

              <View style={[styles.reviewItem, { borderBottomWidth: 0 }]}>
                <View style={styles.reviewTopRow}>
                  <Text style={styles.reviewerName}>Tunde A. ★★★★★</Text>
                  <Text style={styles.reviewDate}>2 weeks ago</Text>
                </View>
                <Text style={styles.reviewBody}>
                  Very polite. Will use again.
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ================= FRAME 3: SETTINGS ================= */}
        {view === 'settings' && (
          <View style={styles.contentWrap}>
            <Text style={styles.groupHeader}>NOTIFY ME ABOUT</Text>
            <View style={styles.menuCard}>
              <View style={styles.switchRow}>
                <Text style={styles.menuRowTitle}>New requests</Text>
                <Switch
                  value={notifRequests}
                  onValueChange={setNotifRequests}
                  trackColor={{ false: '#D1D5DB', true: '#2E7D32' }}
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.menuRowTitle}>Messages</Text>
                <Switch
                  value={notifMessages}
                  onValueChange={setNotifMessages}
                  trackColor={{ false: '#D1D5DB', true: '#2E7D32' }}
                />
              </View>
              <View style={styles.switchRow}>
                <Text style={styles.menuRowTitle}>Money in and out</Text>
                <Switch
                  value={notifMoney}
                  onValueChange={setNotifMoney}
                  trackColor={{ false: '#D1D5DB', true: '#2E7D32' }}
                />
              </View>
              <View style={[styles.switchRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.menuRowTitle}>Tips and news</Text>
                <Switch
                  value={notifTips}
                  onValueChange={setNotifTips}
                  trackColor={{ false: '#D1D5DB', true: '#2E7D32' }}
                />
              </View>
            </View>

            <Text style={styles.groupHeader}>LANGUAGE</Text>
            <View style={styles.menuCard}>
              {(['English', 'Pidgin', 'Hausa'] as const).map((lang, idx) => (
                <TouchableOpacity
                  key={lang}
                  style={[styles.menuRow, idx === 2 && { borderBottomWidth: 0 }]}
                  onPress={() => setLanguage(lang)}
                >
                  <Text style={styles.menuRowTitle}>{lang}</Text>
                  {language === lang && <Check size={18} color="#2E7D32" />}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.settingsDisclaimer}>
              New request alerts play a sound so you don't miss them. Money alerts can't be fully
              turned off — you'll always get an SMS when money moves.
            </Text>

            <Text style={styles.groupHeader}>ACCOUNT</Text>
            <TouchableOpacity
              style={styles.deleteAccountRow}
              onPress={() => setView('delete_account')}
            >
              <Trash2 size={18} color="#DC2626" />
              <Text style={styles.deleteAccountRowText}>Delete account</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        )}

        {/* ================= FRAME 4: HELP AND SUPPORT ================= */}
        {view === 'help' && (
          <View style={styles.contentWrap}>
            <TouchableOpacity
              style={styles.askMinaHeroCard}
              onPress={() => router.push('/recycler/mina' as any)}
            >
              <View style={styles.minaAvatarSmall}>
                <Image
                  source={require('../../assets/images/mina-avatar.png')}
                  style={{ width: 34, height: 34, borderRadius: 17 }}
                  resizeMode="cover"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.askMinaCardTitle}>Ask Mina</Text>
                <Text style={styles.askMinaCardSub}>
                  Your AI helper. Instant answers, any time.
                </Text>
              </View>
              <ChevronRight size={18} color="#2E7D32" />
            </TouchableOpacity>

            <View style={styles.searchBarBox}>
              <Search size={18} color="#9CA3AF" />
              <TextInput
                style={styles.searchTextInput}
                placeholder="Search help"
                placeholderTextColor="#9CA3AF"
                value={helpSearch}
                onChangeText={setHelpSearch}
              />
            </View>

            <Text style={styles.groupHeader}>COMMON QUESTIONS</Text>
            <View style={styles.menuCard}>
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => setView('faq_set_aside')}
              >
                <Text style={styles.menuRowTitle}>How does money set aside work?</Text>
                <ChevronRight size={18} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => setView('faq_no_code')}
              >
                <Text style={styles.menuRowTitle}>Household didn't give the code</Text>
                <ChevronRight size={18} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => setView('faq_change_prices')}
              >
                <Text style={styles.menuRowTitle}>How do I change my prices?</Text>
                <ChevronRight size={18} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => setView('faq_cash_out')}
              >
                <Text style={styles.menuRowTitle}>My cash out hasn't arrived</Text>
                <ChevronRight size={18} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuRow, { borderBottomWidth: 0 }]}
                onPress={() => setView('faq_renew_licence')}
              >
                <Text style={styles.menuRowTitle}>How do I renew my licence?</Text>
                <ChevronRight size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <Text style={styles.groupHeader}>TALK TO US</Text>
            <View style={styles.menuCard}>
              <TouchableOpacity
                style={styles.menuRow}
                onPress={() => router.push('/recycler/mina' as any)}
              >
                <MessageSquare size={18} color="#2E7D32" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.talkTitle}>Chat with support</Text>
                  <Text style={styles.talkSub}>Usually replies in 10 minutes</Text>
                </View>
                <ChevronRight size={18} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuRow, { borderBottomWidth: 0 }]}>
                <Phone size={18} color="#2E7D32" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.talkTitle}>Call support</Text>
                  <Text style={styles.talkSub}>Mon–Sat, 8am–6pm</Text>
                </View>
                <ChevronRight size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ================= FRAME 6: DELETE ACCOUNT ================= */}
        {view === 'delete_account' && (
          <View style={styles.contentWrap}>
            <Text style={styles.deleteMainTitle}>Before you delete your account</Text>
            <Text style={styles.deleteMainSub}>
              Finish these first so no one loses money.
            </Text>

            <View style={styles.menuCard}>
              <View style={styles.prereqRow}>
                <View style={styles.prereqXCircle}>
                  <X size={14} color="#6B7280" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.talkTitle}>Cash out your wallet</Text>
                  <Text style={styles.talkSub}>₦1,550 still in your wallet</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/recycler/wallet' as any)}>
                  <Text style={styles.prereqActionLink}>Cash out</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.prereqRow}>
                <View style={styles.prereqXCircle}>
                  <X size={14} color="#6B7280" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.talkTitle}>Finish your active pickup</Text>
                  <Text style={styles.talkSub}>Musa A. · ₦450 set aside</Text>
                </View>
                <TouchableOpacity onPress={() => router.push('/recycler/pickup' as any)}>
                  <Text style={styles.prereqActionLink}>View</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.prereqRow, { borderBottomWidth: 0 }]}>
                <View style={styles.prereqCheckCircle}>
                  <Check size={14} color="#2E7D32" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.talkTitle}>No open disputes</Text>
                  <Text style={styles.talkSub}>Nothing to settle</Text>
                </View>
              </View>
            </View>

            <Text style={styles.groupHeader}>WHAT HAPPENS WHEN YOU DELETE</Text>
            <View style={styles.menuCard}>
              <View style={styles.prereqRow}>
                <Building2 size={18} color="#6B7280" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.talkTitle}>Your listings and profile are removed</Text>
                  <Text style={styles.talkSub}>Households can't find you any more</Text>
                </View>
              </View>
              <View style={[styles.prereqRow, { borderBottomWidth: 0 }]}>
                <Lock size={18} color="#6B7280" />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.talkTitle}>We keep payment records for 6 years</Text>
                  <Text style={styles.talkSub}>
                    The law requires it. Nobody else can see them.
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity style={styles.disabledDeleteBtn} disabled>
              <Text style={styles.disabledDeleteBtnText}>Delete account</Text>
            </TouchableOpacity>
            <Text style={styles.disabledCaption}>
              Available once the steps above are done
            </Text>
          </View>
        )}

        {/* ================= FRAMES 7–11: FAQ ARTICLES ================= */}
        {view.startsWith('faq_') && faqArticles[view] && (
          <View style={styles.contentWrap}>
            <Text style={styles.faqTitle}>{faqArticles[view].title}</Text>

            <View style={styles.faqBodyCard}>
              {faqArticles[view].paragraphs.map((p, i) => (
                <Text
                  key={i}
                  style={[
                    styles.faqParagraph,
                    i < faqArticles[view].paragraphs.length - 1 && { marginBottom: 14 },
                  ]}
                >
                  {p}
                </Text>
              ))}
            </View>

            <View style={styles.faqSupportCard}>
              <Text style={styles.faqSupportHint}>
                Still need help? We usually reply in 10 minutes.
              </Text>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => router.push('/recycler/mina' as any)}
              >
                <Text style={styles.primaryBtnText}>Chat with support</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Ask Mina Button */}
      {view === 'overview' && (
        <TouchableOpacity
          style={styles.floatingMinaBtn}
          onPress={() => router.push('/recycler/mina' as any)}
          activeOpacity={0.85}
        >
          <Image
            source={require('../../assets/images/mina-avatar.png')}
            style={{ width: 34, height: 34, borderRadius: 17 }}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}

      {/* Log Out Modal (Frame 5) */}
      <Modal
        visible={view === 'logout_modal'}
        transparent
        animationType="fade"
        onRequestClose={() => setView('overview')}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.logoutCard}>
            <Text style={styles.logoutTitle}>Log out of EcoSmart?</Text>

            <View style={styles.logoutPointRow}>
              <View style={styles.logoutGreenCircle}>
                <Lock size={16} color="#2E7D32" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.talkTitle}>Your money stays safe</Text>
                <Text style={styles.talkSub}>₦1,550 available · ₦450 set aside</Text>
              </View>
            </View>

            <View style={[styles.logoutPointRow, { marginTop: 12, marginBottom: 20 }]}>
              <View style={styles.logoutAmberCircle}>
                <AlertCircle size={16} color="#D97706" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.talkTitle}>You won't get new requests</Text>
                <Text style={styles.talkSub}>Until you log in again</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setView('overview')}
            >
              <Text style={styles.primaryBtnText}>Stay logged in</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutRedLinkBtn}
              onPress={() => {
                setView('overview');
                router.push('/sign-in' as any);
              }}
            >
              <Text style={styles.logoutRedLinkText}>Log out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 5-Tab Bottom Navigation */}
      <RecyclerBottomNavBar activeTab="Profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFCF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  headerTitleSmall: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  bellBtn: {
    padding: 6,
  },
  demoPillsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 8,
  },
  demoPillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  demoPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  demoPillActive: {
    backgroundColor: '#2E7D32',
  },
  demoPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  demoPillTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  contentWrap: {
    gap: 14,
  },
  businessCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  bizHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bizAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E6B34',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bizAvatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bizName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  bizRole: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  metricTile: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  metricLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  metricVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  metricSub: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 1,
  },
  groupHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 10,
  },
  menuRowTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  menuRowRightVal: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 4,
  },
  ratingOverviewCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    alignItems: 'center',
  },
  ratingLeftCol: {
    width: 90,
    alignItems: 'center',
  },
  ratingScoreBig: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
  },
  starsGold: {
    fontSize: 13,
    color: '#EAB308',
    marginTop: 2,
  },
  ratingCountSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  ratingRightCol: {
    flex: 1,
    marginLeft: 16,
    gap: 4,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barStarText: {
    fontSize: 11,
    color: '#6B7280',
    width: 10,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#EAB308',
    borderRadius: 3,
  },
  reviewsListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
  },
  reviewItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  reviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  reviewDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  reviewBody: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingsDisclaimer: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
  deleteAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    gap: 10,
  },
  deleteAccountRowText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  askMinaHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  minaAvatarSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  askMinaCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  askMinaCardSub: {
    fontSize: 12,
    color: '#166534',
    marginTop: 1,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  talkTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  talkSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  deleteMainTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  deleteMainSub: {
    fontSize: 13,
    color: '#6B7280',
  },
  prereqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  prereqXCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prereqCheckCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prereqActionLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },
  disabledDeleteBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 12,
  },
  disabledDeleteBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  disabledCaption: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  faqTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  faqBodyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  faqParagraph: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 21,
  },
  faqSupportCard: {
    backgroundColor: '#E8F5E9',
    borderRadius: 14,
    padding: 16,
    gap: 12,
  },
  faqSupportHint: {
    fontSize: 12,
    color: '#166534',
  },
  primaryBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  floatingMinaBtn: {
    position: 'absolute',
    bottom: 82,
    right: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  logoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
  },
  logoutTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  logoutPointRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutGreenCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutAmberCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutRedLinkBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  logoutRedLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
});
