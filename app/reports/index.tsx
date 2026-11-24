import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  Camera,
  Lock,
  Search,
  Sparkles,
  ShieldAlert,
  Clock,
  RefreshCw,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomNavBar } from '../../components/common/BottomNavBar';

type ReportsDemoMode =
  | '5.06_report_form'
  | '5.07_sent_sheet'
  | '5.07_my_reports'
  | '6.12_empty'
  | '5.08_paid'
  | '5.08_adjusted'
  | '5.08_refunded'
  | '5.09_help';

export default function ReportsAndSupportScreen() {
  const router = useRouter();

  const [mode, setMode] = useState<ReportsDemoMode>('5.06_report_form');
  const [sentModalVisible, setSentModalVisible] = useState<boolean>(false);
  const [selectedReason, setSelectedReason] = useState<string>(
    'Wrong weight or price'
  );
  const [reportNote, setReportNote] = useState<string>(
    'The scale showed 3.2 kg, but my bottles weighed 4 kg at home.'
  );
  const [photosCount, setPhotosCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const REASONS = [
    'Wrong weight or price',
    'Payment problem',
    "Didn't show up",
    'Rude or unsafe',
    'Other',
  ];

  const FAQS = [
    {
      q: 'How is my money kept safe?',
      a: 'When a recycler accepts your request, EcoSmart locks the estimated payout in escrow. It stays safe until your waste is weighed and you give your 4-digit handover code.',
    },
    {
      q: 'When do I give my code?',
      a: 'Only give your 4-digit code after the recycler weighs your bottles in front of you and you tap Accept on the final amount on your phone.',
    },
    {
      q: 'Why does a recycler have a minimum?',
      a: 'Home pickup requires fuel and van transport, so recyclers set a minimum weight (usually 3–5 kg). Smaller amounts can be dropped off at their yard from 1 kg.',
    },
    {
      q: 'How do I cash out?',
      a: 'Open Wallet and tap Cash out to my bank. Link your OPay, PalmPay, or Nigerian bank account once — transfers are free during the Kubwa pilot.',
    },
    {
      q: 'The weight looks wrong. What do I do?',
      a: 'Do not give your 4-digit code. Tap "Something\'s wrong" on the handover screen or submit a private report here with a photo of the scale.',
    },
  ];

  const selectDemoMode = (next: ReportsDemoMode) => {
    if (next === '5.07_sent_sheet') {
      setMode('5.06_report_form');
      setSentModalVisible(true);
    } else {
      setSentModalVisible(false);
      setMode(next);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        showBack={false}
        rightAction="bell"
        onPressBell={() => router.push('/profile')}
      />

      {/* Demo Switcher for all 8 screens in Screens · 13 */}
      <View style={styles.demoBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoScroll}
        >
          {(
            [
              { key: '5.06_report_form', label: '5.06 Report Form' },
              { key: '5.07_sent_sheet', label: '5.07 Sent Sheet' },
              { key: '5.07_my_reports', label: '5.07 My Reports' },
              { key: '6.12_empty', label: '6.12 Empty' },
              { key: '5.08_paid', label: '5.08 Solved · Paid' },
              { key: '5.08_adjusted', label: '5.08 Solved · Adjusted' },
              { key: '5.08_refunded', label: '5.08 Closed · Refunded' },
              { key: '5.09_help', label: '5.09 Help & Support' },
            ] as const
          ).map((item) => {
            const active =
              (item.key === '5.07_sent_sheet' && sentModalVisible) ||
              (!sentModalVisible && mode === item.key);
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.demoPill, active && styles.demoPillActive]}
                onPress={() => selectDemoMode(item.key)}
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
        {/* 5.06 Report a problem · Private                       */}
        {/* ===================================================== */}
        {mode === '5.06_report_form' && (
          <View>
            <TouchableOpacity
              style={styles.backRow}
              onPress={() => router.back()}
            >
              <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
              <Text style={styles.backText}>Report a problem</Text>
            </TouchableOpacity>

            <Text style={styles.pageTitle}>Report a problem</Text>
            <Text style={styles.pageSubtitle}>
              Only you and EcoSmart see this.
            </Text>

            {/* Pickup Summary Card */}
            <View style={styles.contextCard}>
              <View style={styles.contextRow}>
                <Image
                  source={require('../../assets/images/kubwa-yard.jpg')}
                  style={styles.recyclerThumb}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.recyclerName}>Kubwa Green Hub</Text>
                  <Text style={styles.recyclerPartner}>
                    Verified Eco Partner · Kubwa, Abuja
                  </Text>
                </View>
              </View>
              <Text style={styles.contextMetaBold}>
                PET · 3.2 kg · Expected ₦384
              </Text>
              <Text style={styles.contextMetaSub}>
                3.2 kg × ₦120/kg · Drop-off
              </Text>
            </View>

            {/* What went wrong? */}
            <Text style={styles.sectionLabel}>What went wrong?</Text>
            <View style={styles.chipsWrap}>
              {REASONS.map((reason) => {
                const selected = selectedReason === reason;
                return (
                  <TouchableOpacity
                    key={reason}
                    style={[
                      styles.reasonChip,
                      selected && styles.reasonChipSelected,
                    ]}
                    onPress={() => setSelectedReason(reason)}
                  >
                    {selected && (
                      <Check size={13} color="#2D6A2E" strokeWidth={2.8} />
                    )}
                    <Text
                      style={[
                        styles.reasonChipText,
                        selected && styles.reasonChipTextSelected,
                      ]}
                    >
                      {reason}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Tell us what happened */}
            <Text style={[styles.sectionLabel, { marginTop: 14 }]}>
              Tell us what happened
            </Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={3}
              value={reportNote}
              onChangeText={setReportNote}
              placeholder="Describe what happened..."
              placeholderTextColor="#94A3B8"
            />

            {/* Dashed Add Photos */}
            <TouchableOpacity
              style={styles.addPhotoDashed}
              onPress={() => setPhotosCount((c) => (c < 3 ? c + 1 : 0))}
            >
              <Camera size={16} color="#2D6A2E" />
              <Text style={styles.addPhotoText}>
                {photosCount > 0
                  ? `✓ ${photosCount} photo${photosCount > 1 ? 's' : ''} attached`
                  : 'Add photos (up to 3)'}
              </Text>
            </TouchableOpacity>

            {/* Escrow hold banner */}
            <View style={styles.escrowHoldBanner}>
              <Lock size={16} color="#2D6A2E" />
              <View style={{ flex: 1 }}>
                <Text style={styles.escrowHoldTitle}>
                  Your ₦450 stays on hold
                </Text>
                <Text style={styles.escrowHoldSub}>
                  No one gets paid until we decide.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryGreenBtn}
              onPress={() => setSentModalVisible(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryGreenBtnText}>Send report</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ===================================================== */}
        {/* 5.07 My reports                                       */}
        {/* ===================================================== */}
        {mode === '5.07_my_reports' && (
          <View>
            <TouchableOpacity
              style={styles.backRow}
              onPress={() => router.push('/profile')}
            >
              <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
              <Text style={styles.backText}>Reports</Text>
            </TouchableOpacity>

            <Text style={styles.pageTitle}>My reports</Text>
            <Text style={styles.pageSubtitle}>
              Only you and EcoSmart can see these.
            </Text>

            <View style={{ gap: 12 }}>
              <TouchableOpacity
                style={styles.reportListItem}
                onPress={() => setMode('5.08_paid')}
              >
                <View style={styles.reportIconGreen}>
                  <Check size={16} color="#2D6A2E" strokeWidth={2.6} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reportItemTitle}>
                    Wrong weight · Kubwa Green Hub
                  </Text>
                  <Text style={styles.reportItemSub}>ES-1048 · Sat 9 Nov</Text>
                </View>
                <View style={styles.solvedBadge}>
                  <Text style={styles.solvedBadgeText}>Solved</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reportListItem}
                onPress={() => setMode('5.08_adjusted')}
              >
                <View style={styles.reportIconAmber}>
                  <Clock size={16} color="#B45309" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.reportItemTitle}>
                    Didn't show up · Bwari Renew
                  </Text>
                  <Text style={styles.reportItemSub}>ES-1022 · Tue 5 Nov</Text>
                </View>
                <View style={styles.inReviewBadge}>
                  <Text style={styles.inReviewBadgeText}>In review</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 220 }}>
              <TouchableOpacity
                style={styles.outlineGreenBtn}
                onPress={() => setMode('5.06_report_form')}
              >
                <Text style={styles.outlineGreenBtnText}>Report a problem</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 6.12 My reports · Empty                               */}
        {/* ===================================================== */}
        {mode === '6.12_empty' && (
          <View>
            <TouchableOpacity
              style={styles.backRow}
              onPress={() => router.push('/profile')}
            >
              <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
              <Text style={styles.backText}>Reports</Text>
            </TouchableOpacity>

            <Text style={styles.pageTitle}>My reports</Text>
            <Text style={styles.pageSubtitle}>
              Private reports · Only EcoSmart sees this.
            </Text>

            <View style={styles.emptyCard}>
              <View style={styles.emptyIconCircle}>
                <ShieldAlert size={24} color="#2D6A2E" />
              </View>
              <Text style={styles.emptyTitle}>No reports yet</Text>
              <Text style={styles.emptyDesc}>
                Tell EcoSmart privately about a payment, handover or app problem. Reports aren't public reviews and aren't sent to recycler chat.
              </Text>
              <TouchableOpacity
                style={[styles.primaryGreenBtn, { width: '100%' }]}
                onPress={() => setMode('5.06_report_form')}
              >
                <Text style={styles.primaryGreenBtnText}>Report a problem</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 5.08 Dispute resolved · Paid / Adjusted / Refunded    */}
        {/* ===================================================== */}
        {(mode === '5.08_paid' ||
          mode === '5.08_adjusted' ||
          mode === '5.08_refunded') && (
          <View>
            <TouchableOpacity
              style={styles.backRow}
              onPress={() => setMode('5.07_my_reports')}
            >
              <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
              <Text style={styles.backText}>Reports</Text>
            </TouchableOpacity>

            <View style={styles.disputeHeroRow}>
              <View
                style={
                  mode === '5.08_refunded'
                    ? styles.disputeIconNeutral
                    : styles.disputeIconGreen
                }
              >
                {mode === '5.08_refunded' ? (
                  <RefreshCw size={20} color="#475569" />
                ) : (
                  <Check size={22} color="#2D6A2E" strokeWidth={2.8} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.disputeHeroTitle}>
                  {mode === '5.08_refunded' ? 'Dispute closed' : 'Dispute solved'}
                </Text>
                <Text style={styles.disputeHeroSub}>
                  {mode === '5.08_paid'
                    ? 'We checked the photos and agree with you.'
                    : mode === '5.08_adjusted'
                    ? 'We changed the amount after checking the weight.'
                    : "The handover didn't happen, so no one was paid."}
                </Text>
              </View>
            </View>

            <View style={styles.disputeOutcomeCard}>
              <Text style={styles.outcomeLabel}>
                {mode === '5.08_refunded'
                  ? 'Returned to the recycler'
                  : 'Paid to your wallet'}
              </Text>
              <Text style={styles.outcomeBigAmount}>
                {mode === '5.08_paid'
                  ? '₦384'
                  : mode === '5.08_adjusted'
                  ? '₦420'
                  : '₦450'}
              </Text>
              <Text style={styles.outcomeFormula}>
                {mode === '5.08_paid'
                  ? '3.2 kg PET at ₦120 per kg'
                  : mode === '5.08_adjusted'
                  ? '3.5 kg PET at ₦120 per kg'
                  : 'You keep your bottles'}
              </Text>

              <View style={styles.outcomeDivider} />

              {mode === '5.08_paid' && (
                <View style={{ gap: 8 }}>
                  <View style={styles.kvRow}>
                    <Text style={styles.kvLabel}>Money set aside</Text>
                    <Text style={styles.kvVal}>₦450</Text>
                  </View>
                  <View style={styles.kvRow}>
                    <Text style={styles.kvLabel}>Paid to you</Text>
                    <Text style={styles.kvValGreen}>+₦384</Text>
                  </View>
                  <View style={styles.kvRow}>
                    <Text style={styles.kvLabel}>Returned to recycler</Text>
                    <Text style={styles.kvVal}>₦66</Text>
                  </View>
                </View>
              )}

              {mode === '5.08_adjusted' && (
                <View style={{ gap: 8 }}>
                  <Text style={styles.whatChangedHeader}>What changed</Text>
                  <View style={styles.kvRow}>
                    <Text style={styles.kvLabel}>Recycler's weight</Text>
                    <Text style={styles.kvVal}>3.2 kg</Text>
                  </View>
                  <View style={styles.kvRow}>
                    <Text style={styles.kvLabel}>Correct weight</Text>
                    <Text style={styles.kvValGreen}>3.5 kg</Text>
                  </View>
                  <View style={styles.kvRow}>
                    <Text style={styles.kvLabel}>Returned to recycler</Text>
                    <Text style={styles.kvVal}>₦30</Text>
                  </View>
                </View>
              )}

              {mode === '5.08_refunded' && (
                <View style={{ gap: 8 }}>
                  <View style={styles.kvRow}>
                    <Text style={styles.kvLabel}>Paid to you</Text>
                    <Text style={styles.kvVal}>₦0</Text>
                  </View>
                  <View style={styles.kvRow}>
                    <Text style={styles.kvLabel}>Your bottles</Text>
                    <Text style={styles.kvVal}>Still yours</Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.refFootnoteRow}>
              <Lock size={13} color="#64748B" />
              <Text style={styles.refFootnoteText}>
                {mode === '5.08_refunded'
                  ? 'Reference ES-1048 · You can sell to another recycler any time.'
                  : 'Reference ES-1048 · Only you and EcoSmart can see this.'}
              </Text>
            </View>

            <View style={{ marginTop: 140 }}>
              <TouchableOpacity
                style={styles.primaryGreenBtn}
                onPress={() =>
                  router.push(mode === '5.08_refunded' ? '/recyclers' : '/wallet')
                }
              >
                <Text style={styles.primaryGreenBtnText}>
                  {mode === '5.08_refunded'
                    ? 'Find another recycler'
                    : 'View wallet'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryTextBtn}
                onPress={() => setMode('5.09_help')}
              >
                <Text style={styles.secondaryTextBtnLabel}>Contact support</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 5.09 Help & Support                                   */}
        {/* ===================================================== */}
        {mode === '5.09_help' && (
          <View>
            <TouchableOpacity
              style={styles.backRow}
              onPress={() => router.push('/profile')}
            >
              <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
              <Text style={styles.backText}>Help and support</Text>
            </TouchableOpacity>

            <Text style={styles.pageTitle}>How can we help?</Text>

            {/* Search Help */}
            <View style={styles.searchBox}>
              <Search size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search help"
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Dark Green Ask Mina Banner */}
            <TouchableOpacity
              style={styles.minaSupportBanner}
              onPress={() => router.push('/mina' as any)}
              activeOpacity={0.85}
            >
              <View style={styles.minaAvatarCircle}>
                <Sparkles size={18} color="#1E5D2E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.minaBannerTitle}>Ask Mina</Text>
                <Text style={styles.minaBannerSub}>
                  Our AI helper answers in seconds, any time.
                </Text>
              </View>
              <Text style={styles.minaBannerChevron}>›</Text>
            </TouchableOpacity>

            <Text style={styles.sectionLabel}>Popular questions</Text>
            <View style={styles.faqListCard}>
              {FAQS.filter((f) =>
                f.q.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((faq, idx) => {
                const isOpen = expandedFaq === faq.q;
                return (
                  <React.Fragment key={faq.q}>
                    {idx > 0 && <View style={styles.faqDivider} />}
                    <TouchableOpacity
                      style={styles.faqRow}
                      onPress={() =>
                        setExpandedFaq(isOpen ? null : faq.q)
                      }
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={styles.faqQuestionText}>{faq.q}</Text>
                        {isOpen && (
                          <Text style={styles.faqAnswerText}>{faq.a}</Text>
                        )}
                      </View>
                      <Text style={styles.faqChevron}>
                        {isOpen ? '⌄' : '›'}
                      </Text>
                    </TouchableOpacity>
                  </React.Fragment>
                );
              })}
            </View>

            <View style={styles.supportHoursRow}>
              <Clock size={13} color="#64748B" />
              <Text style={styles.supportHoursText}>
                Support replies within 24 hours, Monday to Saturday.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryGreenBtn, { marginTop: 18 }]}
              onPress={() => router.push('/mina' as any)}
            >
              <Text style={styles.primaryGreenBtnText}>
                Chat with EcoSmart support
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ===================================================== */}
      {/* 5.07 Report · Sent Bottom Sheet                       */}
      {/* ===================================================== */}
      <Modal
        visible={sentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSentModalVisible(false)}
      >
        <Pressable
          style={styles.sheetScrim}
          onPress={() => setSentModalVisible(false)}
        >
          <Pressable
            style={styles.sentSheetCard}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.sentCheckCircle}>
              <Check size={24} color="#FFFFFF" strokeWidth={3} />
            </View>
            <Text style={styles.sentSheetTitle}>Report sent</Text>
            <Text style={styles.sentSheetSub}>
              Only you and EcoSmart can see it. We'll reply within 24 hours.
            </Text>

            <View style={styles.sentDetailsBox}>
              <View style={styles.kvRow}>
                <Text style={styles.kvLabel}>Reference</Text>
                <Text style={styles.kvVal}>ES-1048</Text>
              </View>
              <View style={[styles.kvRow, { marginTop: 6 }]}>
                <Text style={styles.kvLabel}>Your ₦450</Text>
                <Text style={styles.kvVal}>
                  Stays set aside until we decide
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryGreenBtn, { width: '100%' }]}
              onPress={() => {
                setSentModalVisible(false);
                setMode('5.07_my_reports');
              }}
            >
              <Text style={styles.primaryGreenBtnText}>View my reports</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryTextBtn}
              onPress={() => setSentModalVisible(false)}
            >
              <Text style={styles.secondaryTextBtnLabel}>Done</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

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
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1E12',
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
  contextCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  recyclerThumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  recyclerName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F1E12',
  },
  recyclerPartner: {
    fontSize: 12,
    color: '#2D6A2E',
  },
  contextMetaBold: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
  },
  contextMetaSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reasonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  reasonChipSelected: {
    backgroundColor: '#E4F3D8',
    borderColor: '#2D6A2E',
    borderWidth: 1.5,
  },
  reasonChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  reasonChipTextSelected: {
    color: '#2D6A2E',
    fontWeight: '700',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    fontSize: 13.5,
    color: '#0F1E12',
    minHeight: 78,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  addPhotoDashed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 12,
    backgroundColor: '#FAFDF9',
    marginBottom: 14,
  },
  addPhotoText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  escrowHoldBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E4F3D8',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  escrowHoldTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E5D2E',
  },
  escrowHoldSub: {
    fontSize: 12,
    color: '#2D6A2E',
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
  secondaryTextBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryTextBtnLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  outlineGreenBtn: {
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: '#2D6A2E',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineGreenBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },

  /* 5.07 My reports */
  reportListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reportIconGreen: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportIconAmber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
  reportItemSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  solvedBadge: {
    backgroundColor: '#E4F3D8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  solvedBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  inReviewBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  inReviewBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B45309',
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
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },

  /* 5.08 Dispute Resolved */
  disputeHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  disputeIconGreen: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disputeIconNeutral: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disputeHeroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F1E12',
  },
  disputeHeroSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  disputeOutcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  outcomeLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  outcomeBigAmount: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0F1E12',
    marginVertical: 4,
  },
  outcomeFormula: {
    fontSize: 12.5,
    color: '#64748B',
  },
  outcomeDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 14,
  },
  whatChangedHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 4,
  },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  kvLabel: {
    fontSize: 12.5,
    color: '#64748B',
  },
  kvVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F1E12',
  },
  kvValGreen: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2D6A2E',
  },
  refFootnoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  refFootnoteText: {
    fontSize: 11.5,
    color: '#64748B',
  },

  /* 5.09 Help & Support */
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F1E12',
  },
  minaSupportBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1E5D2E',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  minaAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  minaBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  minaBannerSub: {
    fontSize: 12,
    color: '#DCFCE7',
    marginTop: 1,
  },
  minaBannerChevron: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  faqListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  faqRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 14,
    gap: 10,
  },
  faqQuestionText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F1E12',
  },
  faqAnswerText: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 18,
    marginTop: 6,
  },
  faqChevron: {
    fontSize: 16,
    color: '#94A3B8',
  },
  faqDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  supportHoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  supportHoursText: {
    fontSize: 11.5,
    color: '#64748B',
  },

  /* 5.07 Sent Modal Sheet */
  sheetScrim: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sentSheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 26,
    alignItems: 'center',
  },
  sentCheckCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#38762B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  sentSheetTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 4,
  },
  sentSheetSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  sentDetailsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    width: '100%',
    marginBottom: 16,
  },
});
