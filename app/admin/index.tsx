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
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Home,
  CheckCircle2,
  Scale,
  ShieldCheck,
  CreditCard,
  MessageSquare,
  Users,
  Tag,
  Flag,
  FileText,
  History,
  Search,
  Lock,
  Clock,
  AlertCircle,
  Check,
  X,
  User,
  Camera,
  MapPin,
  Download,
  RotateCcw,
  ArrowLeft,
} from 'lucide-react-native';

export type AdminSection =
  | 'sign_in'
  | 'two_factor'
  | 'overview'
  | 'verifications'
  | 'disputes'
  | 'approvals'
  | 'payments'
  | 'pickup_detail'
  | 'failed_payout'
  | 'support'
  | 'users'
  | 'market_rates'
  | 'reports'
  | 'content'
  | 'audit_log';

export type AdminPopupModal =
  | null
  | 'send_back_musa'
  | 'adjust_dispute_600'
  | 'suspend_halima';

export default function EcoSmartAdminPortal() {
  const router = useRouter();

  // Current active view across all 15 frames of Copy 9
  const [section, setSection] = useState<AdminSection>('overview');
  const [popupModal, setPopupModal] = useState<AdminPopupModal>(null);

  // Auth state (Screen 00)
  const [staffEmail, setStaffEmail] = useState('ifeoma@ecosmart.ng');
  const [staffPassword, setStaffPassword] = useState('••••••••••••');
  const [otpDigits, setOtpDigits] = useState(['4', '8', '2', '0', '3', '']);

  // Verifications state (Screen 01 Frame 2)
  const [verifTab, setVerifTab] = useState<'all' | 'business' | 'collector'>('all');
  const [selectedVerifId, setSelectedVerifId] = useState('musa');
  const [faceMatchOk, setFaceMatchOk] = useState<boolean>(true);
  const [licenceOk, setLicenceOk] = useState<boolean>(false);

  // Disputes state (Screen 01 Frame 3)
  const [disputeChoice, setDisputeChoice] = useState<'pay' | 'adjust' | 'refund'>('adjust');
  const [disputeNewRate, setDisputeNewRate] = useState('₦100/kg → ₦600 to household');
  const [disputeReason, setDisputeReason] = useState('Part of the cardboard was wet, fair split at ₦100/kg');

  // Approvals state (Screen 01 Frame 4)
  const [approvalTab, setApprovalTab] = useState<'waiting' | 'approved' | 'rejected'>('waiting');

  // Payments state (Screen 01 Frame 5)
  const [paymentFilter, setPaymentFilter] = useState('All');

  // Support state (Screen 02 Frame 3)
  const [supportTab, setSupportTab] = useState<'open' | 'done'>('open');
  const [supportReply, setSupportReply] = useState('');
  const [supportMessages, setSupportMessages] = useState([
    {
      id: '1',
      sender: 'user',
      text: "Hello, I cashed out ₦1,000 to OPay yesterday but it hasn't come.",
      time: '10:41',
    },
    {
      id: '2',
      sender: 'admin',
      text: 'Hi Musa, I\'m checking now. Can you confirm the last 4 digits of your OPay account?',
      time: '10:42 · Ifeoma',
    },
    {
      id: '3',
      sender: 'user',
      text: 'It ends 4421.',
      time: '10:43',
    },
  ]);

  // Users state (Screen 03 Frame 1)
  const [usersTab, setUsersTab] = useState('All 1,284');
  const [suspendReason, setSuspendReason] = useState('Asked a recycler to pay outside the app');

  // Market rates state (Screen 03 Frame 2)
  const [minRate, setMinRate] = useState('80');
  const [maxRate, setMaxRate] = useState('150');
  const [rateChangeReason, setRateChangeReason] = useState("Recyclers' average went up to ₦118");

  // Reports state (Screen 03 Frame 3)
  const [reportsTab, setReportsTab] = useState('Open 2');

  // Content CMS state (Screen 03 Frame 4)
  const [contentTab, setContentTab] = useState('All');
  const [contentLang, setContentLang] = useState<'EN' | 'Pidgin' | 'Hausa' | 'Yoruba' | 'Igbo'>('EN');
  const [tip1, setTip1] = useState('Empty, rinse and dry');
  const [tip2, setTip2] = useState('Flatten to save space');
  const [tip3, setTip3] = useState('Keep caps separate');

  // Audit log state (Screen 03 Frame 5)
  const [auditTab, setAuditTab] = useState('All actions');

  const handleSendSupportReply = () => {
    if (!supportReply.trim()) return;
    setSupportMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'admin',
        text: supportReply.trim(),
        time: 'Just now · Ifeoma',
      },
    ]);
    setSupportReply('');
  };

  // Top Switcher Bar for reviewing all 18 screens & pop-ups in Copy 9
  const quickJumpPills: { id: AdminSection; label: string; modal?: AdminPopupModal }[] = [
    { id: 'sign_in', label: '00.1 Sign In' },
    { id: 'two_factor', label: '00.2 2FA Code' },
    { id: 'overview', label: '01.1 Overview' },
    { id: 'verifications', label: '01.2 Verifications' },
    { id: 'disputes', label: '01.3 Disputes' },
    { id: 'approvals', label: '01.4 Approvals' },
    { id: 'payments', label: '01.5 Payments' },
    { id: 'pickup_detail', label: '02.1 Pickup REQ-001' },
    { id: 'failed_payout', label: '02.2 Failed Payout' },
    { id: 'support', label: '02.3 Support Desk' },
    { id: 'users', label: '03.1 Users' },
    { id: 'market_rates', label: '03.2 Market Rates' },
    { id: 'reports', label: '03.3 Reports' },
    { id: 'content', label: '03.4 Content CMS' },
    { id: 'audit_log', label: '03.5 Audit Log' },
  ];

  const renderTopSwitcher = () => (
    <View style={styles.switcherBar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.switcherScroll}
      >
        <TouchableOpacity
          style={styles.backToAppChip}
          onPress={() => router.push('/' as any)}
        >
          <ArrowLeft size={13} color="#166534" />
          <Text style={styles.backToAppText}>Mobile App</Text>
        </TouchableOpacity>

        {quickJumpPills.map((p) => {
          const isActive = section === p.id && !popupModal;
          return (
            <TouchableOpacity
              key={p.id}
              style={[styles.switchPill, isActive && styles.switchPillActive]}
              onPress={() => {
                setPopupModal(null);
                setSection(p.id);
              }}
            >
              <Text style={[styles.switchPillText, isActive && styles.switchPillTextActive]}>
                {p.label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Screen 04 Confirmation Pop-ups triggers */}
        <TouchableOpacity
          style={[styles.switchPill, popupModal === 'send_back_musa' && styles.switchPillModal]}
          onPress={() => {
            setSection('verifications');
            setPopupModal('send_back_musa');
          }}
        >
          <Text style={styles.switchPillText}>04.1 Pop-up: Send Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchPill, popupModal === 'adjust_dispute_600' && styles.switchPillModal]}
          onPress={() => {
            setSection('disputes');
            setPopupModal('adjust_dispute_600');
          }}
        >
          <Text style={styles.switchPillText}>04.2 Pop-up: Adjust ₦600</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.switchPill, popupModal === 'suspend_halima' && styles.switchPillModal]}
          onPress={() => {
            setSection('users');
            setPopupModal('suspend_halima');
          }}
        >
          <Text style={styles.switchPillText}>04.3 Pop-up: Suspend User</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  // ============================================================================
  // SCREEN 00: SIGN IN & 2-STEP AUTHENTICATOR CODE
  // ============================================================================
  if (section === 'sign_in' || section === 'two_factor') {
    return (
      <SafeAreaView style={styles.authPage}>
        {renderTopSwitcher()}
        <View style={styles.authCenterWrap}>
          <Text style={styles.authBrandTitle}>EcoSmart AI</Text>
          <Text style={styles.authBrandSub}>Admin · Abuja pilot</Text>

          {section === 'sign_in' ? (
            <View style={styles.authCard}>
              <Text style={styles.authCardHeading}>Sign in</Text>

              <Text style={styles.authFieldLabel}>Work email</Text>
              <TextInput
                style={styles.authInput}
                value={staffEmail}
                onChangeText={setStaffEmail}
              />

              <Text style={[styles.authFieldLabel, { marginTop: 14 }]}>Password</Text>
              <TextInput
                style={styles.authInput}
                value={staffPassword}
                onChangeText={setStaffPassword}
                secureTextEntry={false}
              />

              <TouchableOpacity
                style={styles.authGreenBtn}
                onPress={() => setSection('two_factor')}
              >
                <Text style={styles.authGreenBtnText}>Sign in</Text>
              </TouchableOpacity>

              <Text style={styles.authForgotHint}>
                Forgot password? Ask the admin lead to reset it.
              </Text>
            </View>
          ) : (
            <View style={styles.authCard}>
              <Text style={styles.authCardHeading}>Enter your 6-digit code</Text>
              <Text style={styles.auth2faSub}>
                Open your authenticator app and type the code for EcoSmart Admin.
              </Text>

              <View style={styles.otpRow}>
                {otpDigits.map((d, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.otpBox,
                      idx === 5 && styles.otpBoxActive,
                    ]}
                  >
                    <Text style={styles.otpDigitText}>{d}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={styles.authGreenBtn}
                onPress={() => setSection('overview')}
              >
                <Text style={styles.authGreenBtnText}>Verify and continue</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ marginTop: 12, alignItems: 'center' }}
                onPress={() => setSection('overview')}
              >
                <Text style={styles.backupCodeLink}>Use a backup code instead</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.authStaffNotice}>
            <Lock size={12} color="#94A3B8" />
            <Text style={styles.authStaffNoticeText}>
              For EcoSmart staff only. Every sign-in is recorded.
            </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ============================================================================
  // PERSISTENT LEFT SIDEBAR + MAIN DESKTOP WORKSPACE (SCREENS 01 - 04)
  // ============================================================================
  const sidebarItems: {
    id: AdminSection;
    label: string;
    Icon: any;
    badge?: number;
    badgeColor?: 'amber' | 'green';
  }[] = [
    { id: 'overview', label: 'Overview', Icon: Home },
    { id: 'verifications', label: 'Verifications', Icon: CheckCircle2, badge: 12 },
    { id: 'disputes', label: 'Disputes', Icon: Scale, badge: 3 },
    { id: 'approvals', label: 'Approvals', Icon: ShieldCheck, badge: 2 },
    { id: 'payments', label: 'Payments', Icon: CreditCard },
    { id: 'support', label: 'Support', Icon: MessageSquare, badge: 4 },
    { id: 'users', label: 'Users', Icon: Users },
    { id: 'market_rates', label: 'Market rates', Icon: Tag },
    { id: 'reports', label: 'Reports', Icon: Flag, badge: 2 },
    { id: 'content', label: 'Content', Icon: FileText },
    { id: 'audit_log', label: 'Audit log', Icon: History },
  ];

  // Map sub-detail views to their parent sidebar item highlight
  const activeSidebarId: AdminSection =
    section === 'pickup_detail' || section === 'failed_payout'
      ? 'payments'
      : section;

  return (
    <SafeAreaView style={styles.desktopRoot}>
      {renderTopSwitcher()}

      <View style={styles.workspaceRow}>
        {/* ================= LEFT SIDEBAR ================= */}
        <View style={styles.sidebar}>
          <View style={styles.sidebarBrandBox}>
            <Text style={styles.sidebarBrandName}>EcoSmart AI</Text>
            <Text style={styles.sidebarBrandSub}>Admin · Abuja pilot</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            {sidebarItems.map((item) => {
              const isSelected = activeSidebarId === item.id;
              const IconComp = item.Icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.navRow, isSelected && styles.navRowActive]}
                  onPress={() => setSection(item.id)}
                >
                  <IconComp
                    size={16}
                    color={isSelected ? '#166534' : '#475569'}
                    strokeWidth={isSelected ? 2.3 : 1.9}
                  />
                  <Text style={[styles.navLabel, isSelected && styles.navLabelActive]}>
                    {item.label}
                  </Text>
                  {item.badge !== undefined && (
                    <View
                      style={[
                        styles.navBadge,
                        isSelected ? styles.navBadgeActive : styles.navBadgeAmber,
                      ]}
                    >
                      <Text
                        style={[
                          styles.navBadgeText,
                          isSelected
                            ? styles.navBadgeTextActive
                            : styles.navBadgeTextAmber,
                        ]}
                      >
                        {item.badge}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={styles.sidebarSignOut}
            onPress={() => setSection('sign_in')}
          >
            <Text style={styles.sidebarSignOutText}>Ifeoma A. · Sign out</Text>
          </TouchableOpacity>
        </View>

        {/* ================= MAIN CONTENT PANE ================= */}
        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={styles.mainContent}
          showsVerticalScrollIndicator={false}
        >
          {/* -------------------------------------------------------------- */}
          {/* 01.1 OVERVIEW                                                  */}
          {/* -------------------------------------------------------------- */}
          {section === 'overview' && (
            <View style={{ gap: 18 }}>
              <View style={styles.pageHeaderRow}>
                <View>
                  <Text style={styles.pageTitle}>Good morning, Ifeoma</Text>
                  <Text style={styles.pageSubtitle}>Thursday 12 Nov · Abuja pilot</Text>
                </View>
                <View style={styles.topSearchBox}>
                  <Search size={15} color="#94A3B8" />
                  <TextInput
                    style={styles.topSearchInput}
                    placeholder="Search name, phone or REQ-..."
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              {/* 4 KPI Cards */}
              <View style={styles.kpiRow}>
                <TouchableOpacity
                  style={styles.kpiCard}
                  onPress={() => setSection('verifications')}
                >
                  <Text style={styles.kpiLabel}>Waiting for verification</Text>
                  <Text style={styles.kpiNumber}>12</Text>
                  <Text style={styles.kpiSub}>Oldest waiting 19 h</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.kpiCard}
                  onPress={() => setSection('disputes')}
                >
                  <Text style={styles.kpiLabel}>Open disputes</Text>
                  <Text style={styles.kpiNumber}>3</Text>
                  <Text style={styles.kpiSub}>₦1,734 frozen</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.kpiCard}
                  onPress={() => setSection('payments')}
                >
                  <Text style={styles.kpiLabel}>Held in escrow</Text>
                  <Text style={styles.kpiNumber}>₦184,500</Text>
                  <Text style={styles.kpiSub}>48 active pickups</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.kpiCard}
                  onPress={() => setSection('failed_payout')}
                >
                  <Text style={styles.kpiLabel}>Failed payouts</Text>
                  <Text style={styles.kpiNumber}>1</Text>
                  <Text style={[styles.kpiSub, { color: '#DC2626', fontWeight: '600' }]}>
                    Needs a retry
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 2-Column Body: Needs your attention + Today */}
              <View style={styles.twoColWorkspace}>
                {/* Left: Needs your attention */}
                <View style={[styles.whiteCard, { flex: 2.2 }]}>
                  <View style={styles.cardHeaderBetween}>
                    <Text style={styles.cardSectionTitle}>Needs your attention</Text>
                    <Text style={styles.cardMutedCount}>5 items</Text>
                  </View>

                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.thText, { flex: 2.1 }]}>Item</Text>
                    <Text style={[styles.thText, { flex: 1.5 }]}>Who</Text>
                    <Text style={[styles.thText, { flex: 0.7 }]}>Waiting</Text>
                    <Text style={[styles.thText, { flex: 1 }]}>Status</Text>
                  </View>

                  {[
                    {
                      item: 'Second approval · REQ-0588 · ₦62,000',
                      who: 'Asked by Tunde',
                      waiting: '2 h',
                      status: 'Needs you',
                      tone: 'amber',
                      target: 'approvals' as AdminSection,
                    },
                    {
                      item: 'Licence check',
                      who: 'Musa Waste',
                      waiting: '19 h',
                      status: 'To review',
                      tone: 'amber',
                      target: 'verifications' as AdminSection,
                    },
                    {
                      item: 'Dispute · REQ-0412',
                      who: 'Halima B. / Bwari Renew',
                      waiting: '3 h',
                      status: 'Frozen',
                      tone: 'red',
                      target: 'disputes' as AdminSection,
                    },
                    {
                      item: 'Payout failed',
                      who: 'Bwari Renew · PAY-0871',
                      waiting: '1 h',
                      status: 'Retry',
                      tone: 'red',
                      target: 'failed_payout' as AdminSection,
                    },
                    {
                      item: 'Code not entered',
                      who: 'REQ-0398',
                      waiting: '2 h',
                      status: 'Waiting',
                      tone: 'amber',
                      target: 'pickup_detail' as AdminSection,
                    },
                  ].map((row, i) => (
                    <TouchableOpacity
                      key={i}
                      style={styles.tableDataRow}
                      onPress={() => setSection(row.target)}
                    >
                      <Text style={[styles.tdBold, { flex: 2.1 }]}>{row.item}</Text>
                      <Text style={[styles.tdNormal, { flex: 1.5 }]}>{row.who}</Text>
                      <Text style={[styles.tdNormal, { flex: 0.7 }]}>{row.waiting}</Text>
                      <View style={{ flex: 1, alignItems: 'flex-start' }}>
                        <View
                          style={[
                            styles.statusBadge,
                            row.tone === 'red' ? styles.badgeRed : styles.badgeAmber,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              row.tone === 'red'
                                ? styles.badgeRedText
                                : styles.badgeAmberText,
                            ]}
                          >
                            {row.tone === 'red' ? '❗ ' : '🕒 '}
                            {row.status}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Right: Today stats */}
                <View style={[styles.whiteCard, { flex: 1 }]}>
                  <Text style={styles.cardSectionTitle}>Today</Text>

                  {[
                    { label: 'Pickups completed', val: '38', green: false },
                    { label: 'Paid to households', val: '₦41,820', green: true },
                    { label: 'Returned to recyclers', val: '₦6,140', green: false },
                    { label: 'New recyclers approved', val: '4', green: false },
                    { label: 'No-shows', val: '2', green: false },
                  ].map((stat, idx) => (
                    <View key={idx} style={styles.todayMetricRow}>
                      <Text style={styles.todayMetricLabel}>{stat.label}</Text>
                      <Text
                        style={[
                          styles.todayMetricVal,
                          stat.green && { color: '#2E7D32' },
                        ]}
                      >
                        {stat.val}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 01.2 VERIFICATIONS                                             */}
          {/* -------------------------------------------------------------- */}
          {section === 'verifications' && (
            <View style={{ gap: 16 }}>
              <View>
                <Text style={styles.pageTitle}>Verifications</Text>
                <Text style={styles.pageSubtitle}>
                  12 waiting · oldest 19 h · aim to review within 24 h
                </Text>
              </View>

              <View style={styles.twoColWorkspace}>
                {/* Left queue list */}
                <View style={[styles.whiteCard, { flex: 0.9, padding: 12 }]}>
                  <View style={styles.subTabsRow}>
                    {[
                      { id: 'all', label: 'All 12' },
                      { id: 'business', label: 'Business 3' },
                      { id: 'collector', label: 'Collector 9' },
                    ].map((t) => (
                      <TouchableOpacity
                        key={t.id}
                        style={[
                          styles.subTabPill,
                          verifTab === t.id && styles.subTabPillActive,
                        ]}
                        onPress={() => setVerifTab(t.id as any)}
                      >
                        <Text
                          style={[
                            styles.subTabText,
                            verifTab === t.id && styles.subTabTextActive,
                          ]}
                        >
                          {t.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {[
                    { id: 'musa', name: 'Musa Waste Collection', role: 'Collector', wait: '19 h', urgent: true },
                    { id: 'bwari', name: 'Bwari Renew Ltd', role: 'Business', wait: '11 h', urgent: false },
                    { id: 'aisha', name: 'Aisha M.', role: 'Collector', wait: '6 h', urgent: false },
                    { id: 'dutse', name: 'Dutse Recyclers', role: 'Business', wait: '2 h', urgent: false },
                  ].map((item) => {
                    const active = selectedVerifId === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.queueListItem,
                          active && styles.queueListItemActive,
                        ]}
                        onPress={() => setSelectedVerifId(item.id)}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.queueItemName}>{item.name}</Text>
                          <Text style={styles.queueItemSub}>{item.role}</Text>
                        </View>
                        <Text
                          style={[
                            styles.queueItemWait,
                            item.urgent && { color: '#D97706', fontWeight: '700' },
                          ]}
                        >
                          {item.wait}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Right inspection detail */}
                <View style={[styles.whiteCard, { flex: 2.3, gap: 16 }]}>
                  <View style={styles.cardHeaderBetween}>
                    <View>
                      <Text style={styles.inspectTitle}>Musa Waste Collection</Text>
                      <Text style={styles.inspectSub}>
                        Collector · Kubwa · signed up with agent Tunde · waiting 19 h
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, styles.badgeAmber]}>
                      <Text style={[styles.statusBadgeText, styles.badgeAmberText]}>
                        🕒 In review
                      </Text>
                    </View>
                  </View>

                  {/* Automatic checks box */}
                  <View style={styles.innerSectionCard}>
                    <View style={styles.cardHeaderBetween}>
                      <Text style={styles.innerCardTitle}>Automatic checks</Text>
                      <View style={[styles.statusBadge, styles.badgeGreen]}>
                        <Text style={[styles.statusBadgeText, styles.badgeGreenText]}>
                          ✓ 3 of 3 passed
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.autoCheckLine}>
                      <Text style={{ color: '#2E7D32', fontWeight: '700' }}>✓ </Text>
                      NIN 1234 567 8901 found · MUSA ABDULLAHI
                    </Text>
                    <Text style={styles.autoCheckLine}>
                      <Text style={{ color: '#2E7D32', fontWeight: '700' }}>✓ </Text>
                      Payout account name matches NIN
                    </Text>
                    <Text style={styles.autoCheckLine}>
                      <Text style={{ color: '#2E7D32', fontWeight: '700' }}>✓ </Text>
                      Phone number verified by SMS
                    </Text>
                  </View>

                  {/* Face Match */}
                  <View style={styles.innerSectionCard}>
                    <Text style={styles.innerCardTitle}>Is this the same person?</Text>
                    <View style={styles.photoCompareRow}>
                      <View style={styles.photoPlaceholderBox}>
                        <User size={22} color="#64748B" />
                        <Text style={styles.photoPlaceholderLabel}>NIN photo · from NIMC</Text>
                      </View>
                      <View style={styles.photoPlaceholderBox}>
                        <Camera size={22} color="#64748B" />
                        <Text style={styles.photoPlaceholderLabel}>Selfie · taken in app</Text>
                      </View>
                    </View>

                    <View style={styles.checkControlRow}>
                      <View>
                        <Text style={styles.checkControlTitle}>Face match</Text>
                        <Text style={styles.checkControlSub}>
                          Compare face shape, eyes and nose
                        </Text>
                      </View>
                      <View style={styles.okFixBtns}>
                        <TouchableOpacity
                          style={[styles.okBtn, faceMatchOk && styles.okBtnSelected]}
                          onPress={() => setFaceMatchOk(true)}
                        >
                          <Text style={[styles.okBtnText, faceMatchOk && styles.okBtnTextSelected]}>
                            ✓ OK
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.fixBtn, !faceMatchOk && styles.fixBtnSelected]}
                          onPress={() => setFaceMatchOk(false)}
                        >
                          <Text style={[styles.fixBtnText, !faceMatchOk && styles.fixBtnTextSelected]}>
                            ✕ Fix
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* Work Licence */}
                  <View style={styles.innerSectionCard}>
                    <Text style={styles.innerCardTitle}>Work licence</Text>
                    <View style={styles.licenceRow}>
                      <View style={[styles.photoPlaceholderBox, { flex: 1 }]}>
                        <FileText size={22} color="#64748B" />
                        <Text style={styles.photoPlaceholderLabel}>Licence photo</Text>
                      </View>
                      <View style={{ flex: 1.3, gap: 6, justifyContent: 'center' }}>
                        <View style={styles.metaKeyValRow}>
                          <Text style={styles.metaKey}>Issuer</Text>
                          <Text style={styles.metaVal}>AEPB</Text>
                        </View>
                        <View style={styles.metaKeyValRow}>
                          <Text style={styles.metaKey}>Number</Text>
                          <Text style={styles.metaVal}>AEPB/RC/2025/0412</Text>
                        </View>
                        <View style={styles.metaKeyValRow}>
                          <Text style={styles.metaKey}>Expires</Text>
                          <Text style={styles.metaVal}>31 Dec 2026</Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.checkControlRow}>
                      <View>
                        <Text style={styles.checkControlTitle}>Licence check</Text>
                        <Text style={styles.checkControlSub}>
                          Readable, matches the name, not expired
                        </Text>
                      </View>
                      <View style={styles.okFixBtns}>
                        <TouchableOpacity
                          style={[styles.okBtn, licenceOk && styles.okBtnSelected]}
                          onPress={() => setLicenceOk(true)}
                        >
                          <Text style={[styles.okBtnText, licenceOk && styles.okBtnTextSelected]}>
                            ✓ OK
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.fixBtn, !licenceOk && styles.fixBtnSelected]}
                          onPress={() => setLicenceOk(false)}
                        >
                          <Text style={[styles.fixBtnText, !licenceOk && styles.fixBtnTextSelected]}>
                            ✕ Fix
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* Footer Decision Bar */}
                  <View style={styles.verifFooterBar}>
                    <Text style={styles.verifFooterWarning}>
                      ❗ 1 item marked Fix — only the licence photo is sent back.
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                      <TouchableOpacity
                        style={styles.outlineActionBtn}
                        onPress={() => setSection('audit_log')}
                      >
                        <Text style={styles.outlineActionBtnText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.solidGreenActionBtn}
                        onPress={() => setPopupModal('send_back_musa')}
                      >
                        <Text style={styles.solidGreenActionBtnText}>Send back to fix</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 01.3 DISPUTES (Dispute · REQ-0412)                             */}
          {/* -------------------------------------------------------------- */}
          {section === 'disputes' && (
            <View style={{ gap: 16 }}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={styles.pageTitle}>Dispute · REQ-0412</Text>
                  <View style={[styles.statusBadge, styles.badgeRed]}>
                    <Text style={[styles.statusBadgeText, styles.badgeRedText]}>
                      ❗ Money frozen
                    </Text>
                  </View>
                </View>
                <Text style={styles.pageSubtitle}>
                  Halima B. (household) and Bwari Renew (recycler) · opened 3 h ago by the recycler
                </Text>
              </View>

              <View style={styles.twoColWorkspace}>
                {/* Left Column: Money + Evidence + Timeline */}
                <View style={{ flex: 1.6, gap: 14 }}>
                  <View style={styles.whiteCard}>
                    <Text style={styles.cardSectionTitle}>Money</Text>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Set aside by recycler</Text>
                      <Text style={styles.metaVal}>₦600</Text>
                    </View>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Final amount sent to household</Text>
                      <Text style={styles.metaVal}>₦540 · 6 kg × ₦90</Text>
                    </View>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Household accepted</Text>
                      <Text style={[styles.metaVal, { color: '#DC2626' }]}>No</Text>
                    </View>
                  </View>

                  <View style={styles.whiteCard}>
                    <Text style={styles.cardSectionTitle}>Evidence</Text>
                    <View style={styles.photoCompareRow}>
                      <View style={styles.photoPlaceholderBox}>
                        <FileText size={20} color="#64748B" />
                        <Text style={styles.photoPlaceholderLabel}>Request photo</Text>
                      </View>
                      <View style={styles.photoPlaceholderBox}>
                        <Scale size={20} color="#64748B" />
                        <Text style={styles.photoPlaceholderLabel}>Scale photo · 6.0 kg</Text>
                      </View>
                    </View>
                    <View style={styles.quoteGrayBox}>
                      <Text style={styles.quoteLabel}>Recycler's reason</Text>
                      <Text style={styles.quoteBody}>
                        "Some cardboard was wet. I offered ₦90/kg instead of ₦110/kg."
                      </Text>
                    </View>
                  </View>

                  <View style={styles.whiteCard}>
                    <Text style={styles.cardSectionTitle}>Timeline</Text>
                    {[
                      { time: '12:05', text: 'Accepted · ₦600 set aside', err: false },
                      { time: '12:31', text: 'Arrived · GPS inside pickup area', err: false },
                      { time: '12:40', text: 'Weighed 6.0 kg · scale photo', err: false },
                      { time: '12:42', text: 'New rate proposed · ₦90/kg', err: false },
                      { time: '12:44', text: 'Household declined the new rate', err: true },
                    ].map((ev, i) => (
                      <View key={i} style={styles.timelineRow}>
                        <Text style={styles.timelineTime}>{ev.time}</Text>
                        <Text
                          style={[
                            styles.timelineText,
                            ev.err && { color: '#DC2626', fontWeight: '600' },
                          ]}
                        >
                          {ev.err ? '❗ ' : '✓ '}
                          {ev.text}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Right Column: Your Decision */}
                <View style={[styles.whiteCard, { flex: 1.1, gap: 12 }]}>
                  <Text style={styles.cardSectionTitle}>Your decision</Text>

                  {[
                    {
                      id: 'pay',
                      title: 'Pay household',
                      sub: 'At the agreed ₦110/kg → ₦660 (recycler tops up ₦60)',
                    },
                    {
                      id: 'adjust',
                      title: 'Adjust the amount',
                      sub: 'Set a fair amount for both sides',
                    },
                    {
                      id: 'refund',
                      title: 'Refund recycler',
                      sub: '₦600 back to the recycler, waste stays with the household',
                    },
                  ].map((opt) => {
                    const selected = disputeChoice === opt.id;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        style={[
                          styles.decisionOptionBox,
                          selected && styles.decisionOptionBoxSelected,
                        ]}
                        onPress={() => setDisputeChoice(opt.id as any)}
                      >
                        <View
                          style={[
                            styles.radioOuter,
                            selected && styles.radioOuterActive,
                          ]}
                        >
                          {selected && <View style={styles.radioInnerDot} />}
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                          <Text style={styles.decisionOptTitle}>{opt.title}</Text>
                          <Text style={styles.decisionOptSub}>{opt.sub}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}

                  <Text style={styles.authFieldLabel}>New rate</Text>
                  <TextInput
                    style={styles.authInput}
                    value={disputeNewRate}
                    onChangeText={setDisputeNewRate}
                  />
                  <Text style={styles.smallHelperText}>
                    The household still gives their code to release it.
                  </Text>

                  <Text style={styles.authFieldLabel}>Reason · both sides see this</Text>
                  <TextInput
                    style={styles.authInput}
                    value={disputeReason}
                    onChangeText={setDisputeReason}
                  />

                  <View style={styles.auditHintRow}>
                    <Lock size={12} color="#64748B" />
                    <Text style={styles.auditHintText}>
                      Saved to the audit log. Above ₦50,000 needs a second admin.
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.authGreenBtn}
                    onPress={() => setPopupModal('adjust_dispute_600')}
                  >
                    <Text style={styles.authGreenBtnText}>Confirm decision</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 01.4 SECOND APPROVALS                                          */}
          {/* -------------------------------------------------------------- */}
          {section === 'approvals' && (
            <View style={{ gap: 16 }}>
              <View>
                <Text style={styles.pageTitle}>Approvals</Text>
                <Text style={styles.pageSubtitle}>
                  Big money decisions need a second admin before they happen.
                </Text>
              </View>

              <View style={styles.twoColWorkspace}>
                {/* Left table */}
                <View style={[styles.whiteCard, { flex: 1.7 }]}>
                  <View style={styles.subTabsRow}>
                    {[
                      { id: 'waiting', label: 'Waiting for you 2' },
                      { id: 'approved', label: 'Approved' },
                      { id: 'rejected', label: 'Rejected' },
                    ].map((t) => (
                      <TouchableOpacity
                        key={t.id}
                        style={[
                          styles.subTabPill,
                          approvalTab === t.id && styles.subTabPillActive,
                        ]}
                        onPress={() => setApprovalTab(t.id as any)}
                      >
                        <Text
                          style={[
                            styles.subTabText,
                            approvalTab === t.id && styles.subTabTextActive,
                          ]}
                        >
                          {t.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.thText, { flex: 2.2 }]}>Decision</Text>
                    <Text style={[styles.thText, { flex: 1 }]}>Amount</Text>
                    <Text style={[styles.thText, { flex: 1 }]}>Asked by</Text>
                    <Text style={[styles.thText, { flex: 0.7 }]}>Waiting</Text>
                  </View>

                  <View style={[styles.tableDataRow, styles.rowHighlightGreen]}>
                    <View style={{ flex: 2.2 }}>
                      <Text style={styles.tdBold}>Dispute decision · REQ-0588</Text>
                      <Text style={styles.tdSub}>Pay household after wet-weight dispute</Text>
                    </View>
                    <Text style={[styles.tdBold, { flex: 1 }]}>₦62,000</Text>
                    <Text style={[styles.tdNormal, { flex: 1 }]}>Tunde</Text>
                    <Text style={[styles.tdNormal, { flex: 0.7 }]}>2 h</Text>
                  </View>

                  <View style={styles.tableDataRow}>
                    <View style={{ flex: 2.2 }}>
                      <Text style={styles.tdBold}>Large cash out · Kubwa Green Hub</Text>
                      <Text style={styles.tdSub}>First cash out above ₦50,000</Text>
                    </View>
                    <Text style={[styles.tdBold, { flex: 1 }]}>₦74,300</Text>
                    <Text style={[styles.tdNormal, { flex: 1 }]}>System</Text>
                    <Text style={[styles.tdNormal, { flex: 0.7 }]}>40 min</Text>
                  </View>
                </View>

                {/* Right detail card */}
                <View style={[styles.whiteCard, { flex: 1.1, gap: 12 }]}>
                  <View style={styles.cardHeaderBetween}>
                    <View>
                      <Text style={styles.cardSectionTitle}>Dispute decision · REQ-0588</Text>
                      <Text style={styles.inspectSub}>Asked by Tunde · 2 h ago</Text>
                    </View>
                    <View style={[styles.statusBadge, styles.badgeAmber]}>
                      <Text style={[styles.statusBadgeText, styles.badgeAmberText]}>
                        🕒 Needs you
                      </Text>
                    </View>
                  </View>

                  <View style={styles.metaKeyValRow}>
                    <Text style={styles.metaKey}>Household</Text>
                    <Text style={styles.metaVal}>Aisha M.</Text>
                  </View>
                  <View style={styles.metaKeyValRow}>
                    <Text style={styles.metaKey}>Recycler</Text>
                    <Text style={styles.metaVal}>Dutse Recyclers</Text>
                  </View>
                  <View style={styles.metaKeyValRow}>
                    <Text style={styles.metaKey}>Set aside</Text>
                    <Text style={styles.metaVal}>₦70,000</Text>
                  </View>
                  <View style={styles.metaKeyValRow}>
                    <Text style={styles.metaKey}>Tunde's decision</Text>
                    <Text style={[styles.metaVal, { color: '#2E7D32' }]}>
                      Pay household ₦62,000
                    </Text>
                  </View>
                  <View style={styles.metaKeyValRow}>
                    <Text style={styles.metaKey}>Returned to recycler</Text>
                    <Text style={styles.metaVal}>₦8,000</Text>
                  </View>

                  <View style={styles.quoteGrayBox}>
                    <Text style={styles.quoteLabel}>Tunde's reason</Text>
                    <Text style={styles.quoteBody}>
                      Scale photo shows 620 kg. Recycler's claim of wet cardboard isn't supported by
                      the photos.
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.outlineFullBtn}
                    onPress={() => setSection('pickup_detail')}
                  >
                    <Text style={styles.outlineFullBtnText}>View pickup</Text>
                  </TouchableOpacity>

                  <Text style={styles.smallHelperText}>
                    You can't approve your own decisions.
                  </Text>

                  <TouchableOpacity
                    style={styles.authGreenBtn}
                    onPress={() => setSection('payments')}
                  >
                    <Text style={styles.authGreenBtnText}>Approve · pay ₦62,000</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.redOutlineFullBtn}
                    onPress={() => setSection('disputes')}
                  >
                    <Text style={styles.redOutlineFullBtnText}>Reject and send back</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 01.5 PAYMENTS LEDGER                                           */}
          {/* -------------------------------------------------------------- */}
          {section === 'payments' && (
            <View style={{ gap: 16 }}>
              <View style={styles.pageHeaderRow}>
                <View>
                  <Text style={styles.pageTitle}>Payments</Text>
                  <Text style={styles.pageSubtitle}>
                    Every naira that moves. Nothing can be edited — corrections are added as new
                    entries.
                  </Text>
                </View>
                <View style={styles.topSearchBox}>
                  <Search size={15} color="#94A3B8" />
                  <TextInput
                    style={styles.topSearchInput}
                    placeholder="Search name, phone or REQ-..."
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={styles.whiteCard}>
                <View style={styles.subTabsRow}>
                  {[
                    'All',
                    'Set aside 48',
                    'Released 38',
                    'Returned 12',
                    'Payouts 9',
                    'Failed 1',
                  ].map((tab) => (
                    <TouchableOpacity
                      key={tab}
                      style={[
                        styles.subTabPill,
                        paymentFilter === tab && styles.subTabPillActive,
                      ]}
                      onPress={() => setPaymentFilter(tab)}
                    >
                      <Text
                        style={[
                          styles.subTabText,
                          paymentFilter === tab && styles.subTabTextActive,
                        ]}
                      >
                        {tab}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.thText, { flex: 0.7 }]}>Time</Text>
                  <Text style={[styles.thText, { flex: 1 }]}>Type</Text>
                  <Text style={[styles.thText, { flex: 1.3 }]}>From</Text>
                  <Text style={[styles.thText, { flex: 1.5 }]}>To</Text>
                  <Text style={[styles.thText, { flex: 1 }]}>Reference</Text>
                  <Text style={[styles.thText, { flex: 1 }]}>Amount</Text>
                  <Text style={[styles.thText, { flex: 0.9 }]}>Status</Text>
                </View>

                {[
                  {
                    time: '10:26',
                    type: 'Released',
                    from: 'Escrow',
                    to: 'Musa A. (household)',
                    ref: 'REQ-001',
                    amount: '₦384',
                    pos: false,
                    status: 'Done',
                    tone: 'green',
                    action: 'pickup_detail' as AdminSection,
                  },
                  {
                    time: '10:26',
                    type: 'Returned',
                    from: 'Escrow',
                    to: 'Kubwa Green Hub',
                    ref: 'REQ-001',
                    amount: '+₦66',
                    pos: true,
                    status: 'Done',
                    tone: 'green',
                    action: 'pickup_detail' as AdminSection,
                  },
                  {
                    time: '10:05',
                    type: 'Set aside',
                    from: 'Kubwa Green Hub',
                    to: 'Escrow',
                    ref: 'REQ-001',
                    amount: '₦450',
                    pos: false,
                    status: 'Held',
                    tone: 'gray',
                    action: 'pickup_detail' as AdminSection,
                  },
                  {
                    time: '09:58',
                    type: 'Top up',
                    from: 'Bank transfer',
                    to: 'Kubwa Green Hub',
                    ref: 'TOP-2291',
                    amount: '+₦250',
                    pos: true,
                    status: 'Done',
                    tone: 'green',
                    action: 'payments' as AdminSection,
                  },
                  {
                    time: '09:40',
                    type: 'Payout',
                    from: 'Bwari Renew',
                    to: 'Moniepoint ••5512',
                    ref: 'PAY-0871',
                    amount: '₦12,500',
                    pos: false,
                    status: 'Failed',
                    tone: 'red',
                    action: 'failed_payout' as AdminSection,
                  },
                  {
                    time: '09:12',
                    type: 'Frozen',
                    from: 'Escrow',
                    to: '—',
                    ref: 'REQ-0412',
                    amount: '₦600',
                    pos: false,
                    status: 'Dispute',
                    tone: 'amber',
                    action: 'disputes' as AdminSection,
                  },
                ].map((p, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.tableDataRow}
                    onPress={() => setSection(p.action)}
                  >
                    <Text style={[styles.tdNormal, { flex: 0.7 }]}>{p.time}</Text>
                    <Text style={[styles.tdBold, { flex: 1 }]}>{p.type}</Text>
                    <Text style={[styles.tdNormal, { flex: 1.3 }]}>{p.from}</Text>
                    <Text style={[styles.tdNormal, { flex: 1.5 }]}>{p.to}</Text>
                    <Text style={[styles.tdBold, { flex: 1, color: '#2E7D32' }]}>{p.ref}</Text>
                    <Text
                      style={[
                        styles.tdBold,
                        { flex: 1 },
                        p.pos && { color: '#2E7D32' },
                      ]}
                    >
                      {p.amount}
                    </Text>
                    <View style={{ flex: 0.9, alignItems: 'flex-start' }}>
                      <View
                        style={[
                          styles.statusBadge,
                          p.tone === 'green'
                            ? styles.badgeGreen
                            : p.tone === 'red'
                            ? styles.badgeRed
                            : p.tone === 'amber'
                            ? styles.badgeAmber
                            : styles.badgeGray,
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusBadgeText,
                            p.tone === 'green'
                              ? styles.badgeGreenText
                              : p.tone === 'red'
                              ? styles.badgeRedText
                              : p.tone === 'amber'
                              ? styles.badgeAmberText
                              : styles.badgeGrayText,
                          ]}
                        >
                          {p.tone === 'green' ? '✓ ' : p.tone === 'red' ? '❗ ' : '• '}
                          {p.status}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}

                <View style={styles.tableFooterRow}>
                  <Text style={styles.cardMutedCount}>Showing 6 of 214 today</Text>
                  <TouchableOpacity style={styles.outlineActionBtn}>
                    <Text style={styles.outlineActionBtnText}>Export CSV</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 02.1 PICKUP INSPECTOR (Pickup · REQ-001)                       */}
          {/* -------------------------------------------------------------- */}
          {section === 'pickup_detail' && (
            <View style={{ gap: 16 }}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={styles.pageTitle}>Pickup · REQ-001</Text>
                  <View style={[styles.statusBadge, styles.badgeGreen]}>
                    <Text style={[styles.statusBadgeText, styles.badgeGreenText]}>✓ Paid</Text>
                  </View>
                </View>
                <Text style={styles.pageSubtitle}>
                  Musa A. (household) and Kubwa Green Hub (recycler) · Thursday 12 Nov
                </Text>
              </View>

              <View style={styles.twoColWorkspace}>
                <View style={{ flex: 1.7, gap: 14 }}>
                  <View style={styles.whiteCard}>
                    <Text style={styles.cardSectionTitle}>Money</Text>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Set aside by recycler</Text>
                      <Text style={styles.metaVal}>₦450</Text>
                    </View>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Paid to household · 3.2 kg × ₦120</Text>
                      <Text style={[styles.metaVal, { color: '#2E7D32' }]}>₦384</Text>
                    </View>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Returned to recycler</Text>
                      <Text style={styles.metaVal}>₦66</Text>
                    </View>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>EcoSmart fee</Text>
                      <Text style={styles.metaVal}>₦0</Text>
                    </View>
                  </View>

                  <View style={styles.whiteCard}>
                    <Text style={styles.cardSectionTitle}>Timeline</Text>
                    {[
                      { time: '10:05', text: 'Recycler accepted · ₦450 set aside' },
                      { time: '10:07', text: 'SMS sent to household' },
                      { time: '10:18', text: 'Recycler on the way' },
                      { time: '10:24', text: 'Arrived · GPS inside pickup area' },
                      { time: '10:25', text: 'Weighed 3.2 kg · scale photo' },
                      { time: '10:26', text: 'Household accepted ₦384 and gave the code' },
                      { time: '10:26', text: '₦384 paid · ₦66 returned' },
                    ].map((t, idx) => (
                      <View key={idx} style={styles.timelineRow}>
                        <Text style={styles.timelineTime}>{t.time}</Text>
                        <Text style={styles.timelineText}>
                          <Text style={{ color: '#2E7D32', fontWeight: '700' }}>✓ </Text>
                          {t.text}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.whiteCard}>
                    <Text style={styles.cardSectionTitle}>Evidence</Text>
                    <View style={styles.photoCompareRow}>
                      <View style={styles.photoPlaceholderBox}>
                        <FileText size={18} color="#64748B" />
                        <Text style={styles.photoPlaceholderLabel}>Scan photo</Text>
                      </View>
                      <View style={styles.photoPlaceholderBox}>
                        <Scale size={18} color="#64748B" />
                        <Text style={styles.photoPlaceholderLabel}>Scale photo · 3.2 kg</Text>
                      </View>
                      <View style={styles.photoPlaceholderBox}>
                        <MapPin size={18} color="#64748B" />
                        <Text style={styles.photoPlaceholderLabel}>Arrival GPS</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Right Column: Household + Recycler + Messages */}
                <View style={{ flex: 1, gap: 14 }}>
                  <View style={styles.whiteCard}>
                    <View style={styles.cardHeaderBetween}>
                      <View>
                        <Text style={styles.cardSectionTitle}>Household</Text>
                        <Text style={styles.inspectSub}>Musa A. · Kubwa</Text>
                      </View>
                      <View style={[styles.statusBadge, styles.badgeGreen]}>
                        <Text style={[styles.statusBadgeText, styles.badgeGreenText]}>
                          ✓ Active
                        </Text>
                      </View>
                    </View>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Phone</Text>
                      <Text style={styles.metaVal}>•••• 2290</Text>
                    </View>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Pickups</Text>
                      <Text style={styles.metaVal}>4</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.outlineFullBtn}
                      onPress={() => setSection('users')}
                    >
                      <Text style={styles.outlineFullBtnText}>Open profile</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.whiteCard}>
                    <View style={styles.cardHeaderBetween}>
                      <View>
                        <Text style={styles.cardSectionTitle}>Recycler</Text>
                        <Text style={styles.inspectSub}>Kubwa Green Hub · Kubwa</Text>
                      </View>
                      <View style={[styles.statusBadge, styles.badgeGreen]}>
                        <Text style={[styles.statusBadgeText, styles.badgeGreenText]}>
                          ✓ Verified
                        </Text>
                      </View>
                    </View>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Rating</Text>
                      <Text style={styles.metaVal}>4.8 · 124 reviews</Text>
                    </View>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Pickups</Text>
                      <Text style={styles.metaVal}>412</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.outlineFullBtn}
                      onPress={() => setSection('users')}
                    >
                      <Text style={styles.outlineFullBtnText}>Open profile</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.whiteCard}>
                    <Text style={styles.cardSectionTitle}>Messages</Text>
                    <Text style={styles.inspectSub}>6 messages · no phone numbers shared</Text>
                    <Text style={[styles.quoteBody, { marginTop: 8 }]}>
                      "Coming in 5 minutes." · 10:18 · recycler
                    </Text>
                    <Text style={[styles.quoteBody, { marginTop: 4 }]}>
                      "I'm at the blue gate." · 10:23
                    </Text>
                    <Text style={[styles.smallHelperText, { marginTop: 10 }]}>
                      Admins can read pickup chats only when a pickup is reported or disputed.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 02.2 FAILED PAYOUT (Failed payout · PAY-0871)                  */}
          {/* -------------------------------------------------------------- */}
          {section === 'failed_payout' && (
            <View style={{ gap: 16 }}>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={styles.pageTitle}>Failed payout · PAY-0871</Text>
                  <View style={[styles.statusBadge, styles.badgeRed]}>
                    <Text style={[styles.statusBadgeText, styles.badgeRedText]}>❗ Failed</Text>
                  </View>
                </View>
                <Text style={styles.pageSubtitle}>
                  Bwari Renew · cash out of ₦12,500 to Moniepoint ••5512 · 09:40 today
                </Text>
              </View>

              <View style={styles.twoColWorkspace}>
                <View style={{ flex: 1.7, gap: 14 }}>
                  <View style={styles.redAlertBox}>
                    <AlertCircle size={18} color="#DC2626" />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.redAlertTitle}>The bank rejected the transfer</Text>
                      <Text style={styles.redAlertBody}>
                        Provider message: "Account name does not match." The money is back in Bwari
                        Renew's wallet — nothing is lost.
                      </Text>
                    </View>
                  </View>

                  <View style={styles.whiteCard}>
                    <Text style={styles.cardSectionTitle}>Payout details</Text>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Amount</Text>
                      <Text style={styles.metaVal}>₦12,500</Text>
                    </View>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>To</Text>
                      <Text style={styles.metaVal}>Moniepoint ••5512</Text>
                    </View>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Name on bank account</Text>
                      <Text style={styles.metaVal}>BWARI RENEWABLE VENTURES</Text>
                    </View>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Name on EcoSmart account</Text>
                      <Text style={styles.metaVal}>Bwari Renew Ltd</Text>
                    </View>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Tried</Text>
                      <Text style={styles.metaVal}>Once · 09:40</Text>
                    </View>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Wallet balance now</Text>
                      <Text style={styles.metaVal}>₦12,500</Text>
                    </View>
                  </View>

                  <View style={styles.whiteCard}>
                    <Text style={styles.cardSectionTitle}>History</Text>
                    {[
                      { time: '09:40', desc: 'Cash out requested · ₦12,500', ok: false },
                      { time: 'Mon', desc: 'Cash out · ₦8,000 to Moniepoint ••5512', ok: true },
                      { time: '2 Nov', desc: 'Cash out · ₦15,200 to Moniepoint ••5512', ok: true },
                    ].map((h, i) => (
                      <View key={i} style={styles.tableDataRow}>
                        <Text style={[styles.tdNormal, { width: 70 }]}>{h.time}</Text>
                        <Text style={[styles.tdNormal, { flex: 1 }]}>{h.desc}</Text>
                        <View
                          style={[
                            styles.statusBadge,
                            h.ok ? styles.badgeGreen : styles.badgeRed,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              h.ok ? styles.badgeGreenText : styles.badgeRedText,
                            ]}
                          >
                            {h.ok ? '✓ Done' : '❗ Failed'}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={[styles.whiteCard, { flex: 1, gap: 12, alignSelf: 'flex-start' }]}>
                  <Text style={styles.cardSectionTitle}>What to do</Text>
                  <Text style={styles.quoteBody}>
                    Names don't match, so a retry will fail again. Ask the recycler to fix their
                    bank details first.
                  </Text>
                  <Text style={styles.smallHelperText}>
                    Both actions are saved to the audit log.
                  </Text>

                  <TouchableOpacity
                    style={styles.authGreenBtn}
                    onPress={() => setSection('support')}
                  >
                    <Text style={styles.authGreenBtnText}>Ask recycler to fix bank details</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.outlineFullBtn}
                    onPress={() => setSection('payments')}
                  >
                    <Text style={styles.outlineFullBtnText}>Retry payout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 02.3 SUPPORT DESK (3-Column View)                              */}
          {/* -------------------------------------------------------------- */}
          {section === 'support' && (
            <View style={{ gap: 16 }}>
              <View>
                <Text style={styles.pageTitle}>Support</Text>
                <Text style={styles.pageSubtitle}>
                  Chats from households and recyclers. We aim to reply within 10 minutes, Mon–Sat
                  8am–6pm.
                </Text>
              </View>

              <View style={[styles.whiteCard, { padding: 0, overflow: 'hidden' }]}>
                <View style={styles.twoColWorkspace}>
                  {/* Column 1: Ticket List */}
                  <View style={styles.supportColLeft}>
                    <View style={[styles.subTabsRow, { padding: 12 }]}>
                      <TouchableOpacity
                        style={[
                          styles.subTabPill,
                          supportTab === 'open' && styles.subTabPillActive,
                        ]}
                        onPress={() => setSupportTab('open')}
                      >
                        <Text
                          style={[
                            styles.subTabText,
                            supportTab === 'open' && styles.subTabTextActive,
                          ]}
                        >
                          Open 4
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.subTabPill,
                          supportTab === 'done' && styles.subTabPillActive,
                        ]}
                        onPress={() => setSupportTab('done')}
                      >
                        <Text
                          style={[
                            styles.subTabText,
                            supportTab === 'done' && styles.subTabTextActive,
                          ]}
                        >
                          Done
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {[
                      {
                        name: 'Musa A.',
                        sub: "Household · My cash out hasn't arrived",
                        time: '2 min',
                        active: true,
                      },
                      {
                        name: 'Kubwa Green Hub',
                        sub: "Recycler · Household didn't give the...",
                        time: '9 min',
                        active: false,
                      },
                      {
                        name: 'Halima B.',
                        sub: 'Household · How do I change my addres...',
                        time: '25 min',
                        active: false,
                      },
                      {
                        name: 'Dutse Circular',
                        sub: 'Recycler · Licence renewal question',
                        time: '1 h',
                        active: false,
                      },
                    ].map((t, idx) => (
                      <View
                        key={idx}
                        style={[
                          styles.queueListItem,
                          t.active && styles.queueListItemActive,
                        ]}
                      >
                        <View style={{ flex: 1 }}>
                          <Text style={styles.queueItemName}>{t.name}</Text>
                          <Text style={styles.queueItemSub} numberOfLines={1}>
                            {t.sub}
                          </Text>
                        </View>
                        <Text style={styles.queueItemWait}>{t.time}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Column 2: Chat Thread */}
                  <View style={styles.supportColCenter}>
                    <View style={styles.supportChatHeader}>
                      <View>
                        <Text style={styles.cardSectionTitle}>Musa A.</Text>
                        <Text style={styles.inspectSub}>
                          Household · Kubwa · started 2 min ago
                        </Text>
                      </View>
                      <TouchableOpacity style={styles.outlineActionBtn}>
                        <Text style={styles.outlineActionBtnText}>Mark as done</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.supportMessagesArea}>
                      {supportMessages.map((m) => (
                        <View
                          key={m.id}
                          style={[
                            styles.supportBubble,
                            m.sender === 'admin'
                              ? styles.supportBubbleAdmin
                              : styles.supportBubbleUser,
                          ]}
                        >
                          <Text style={styles.supportBubbleText}>{m.text}</Text>
                          <Text style={styles.supportBubbleTime}>{m.time}</Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.supportInputBar}>
                      <TextInput
                        style={styles.supportTextInput}
                        placeholder="Type a reply..."
                        placeholderTextColor="#94A3B8"
                        value={supportReply}
                        onChangeText={setSupportReply}
                      />
                      <TouchableOpacity
                        style={styles.solidGreenActionBtn}
                        onPress={handleSendSupportReply}
                      >
                        <Text style={styles.solidGreenActionBtnText}>Send</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Column 3: About Musa A. */}
                  <View style={styles.supportColRight}>
                    <Text style={styles.cardSectionTitle}>About Musa A.</Text>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Account</Text>
                      <Text style={styles.metaVal}>Household · active</Text>
                    </View>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Wallet now</Text>
                      <Text style={[styles.metaVal, { color: '#2E7D32' }]}>₦1,624</Text>
                    </View>
                    <View style={styles.metaKeyValRow}>
                      <Text style={styles.metaKey}>Last cash out</Text>
                      <Text style={styles.metaVal}>₦1,000 · pending</Text>
                    </View>

                    <Text style={[styles.innerCardTitle, { marginTop: 12 }]}>Recent pickups</Text>
                    <TouchableOpacity
                      style={styles.recentPickupChip}
                      onPress={() => setSection('pickup_detail')}
                    >
                      <View>
                        <Text style={styles.tdBold}>REQ-001 · ₦384</Text>
                        <Text style={styles.tdSub}>Kubwa Green Hub · Thu</Text>
                      </View>
                      <View style={[styles.statusBadge, styles.badgeGreen]}>
                        <Text style={[styles.statusBadgeText, styles.badgeGreenText]}>✓ Paid</Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.outlineFullBtn}
                      onPress={() => setSection('users')}
                    >
                      <Text style={styles.outlineFullBtnText}>Open profile</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.outlineFullBtn}
                      onPress={() => setSection('payments')}
                    >
                      <Text style={styles.outlineFullBtnText}>See payments</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 03.1 USERS                                                     */}
          {/* -------------------------------------------------------------- */}
          {section === 'users' && (
            <View style={{ gap: 16 }}>
              <View style={styles.pageHeaderRow}>
                <View>
                  <Text style={styles.pageTitle}>Users</Text>
                  <Text style={styles.pageSubtitle}>
                    Households and recyclers in the Abuja pilot
                  </Text>
                </View>
                <View style={styles.topSearchBox}>
                  <Search size={15} color="#94A3B8" />
                  <TextInput
                    style={styles.topSearchInput}
                    placeholder="Search name, phone or REQ-..."
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <View style={styles.twoColWorkspace}>
                <View style={[styles.whiteCard, { flex: 1.9 }]}>
                  <View style={styles.subTabsRow}>
                    {['All 1,284', 'Households 1,166', 'Recyclers 118', 'Suspended 3'].map(
                      (tab) => (
                        <TouchableOpacity
                          key={tab}
                          style={[
                            styles.subTabPill,
                            usersTab === tab && styles.subTabPillActive,
                          ]}
                          onPress={() => setUsersTab(tab)}
                        >
                          <Text
                            style={[
                              styles.subTabText,
                              usersTab === tab && styles.subTabTextActive,
                            ]}
                          >
                            {tab}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>

                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.thText, { flex: 1.6 }]}>Name</Text>
                    <Text style={[styles.thText, { flex: 1 }]}>Type</Text>
                    <Text style={[styles.thText, { flex: 1 }]}>Area</Text>
                    <Text style={[styles.thText, { flex: 0.8 }]}>Pickups</Text>
                    <Text style={[styles.thText, { flex: 1 }]}>Status</Text>
                  </View>

                  {[
                    { name: 'Halima B.', type: 'Household', area: 'Bwari', pickups: '12', status: 'Active', tone: 'green', selected: true },
                    { name: 'Kubwa Green Hub', type: 'Recycler', area: 'Kubwa', pickups: '412', status: 'Verified', tone: 'green', selected: false },
                    { name: 'Musa Waste', type: 'Recycler', area: 'Kubwa', pickups: '0', status: 'To review', tone: 'amber', selected: false },
                    { name: 'Musa A.', type: 'Household', area: 'Kubwa', pickups: '4', status: 'Active', tone: 'green', selected: false },
                    { name: 'Dutse Circular', type: 'Recycler', area: 'Dutse', pickups: '118', status: 'Verified', tone: 'green', selected: false },
                    { name: 'Quick Scrap NG', type: 'Recycler', area: 'Bwari', pickups: '22', status: 'Suspended', tone: 'red', selected: false },
                  ].map((u, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.tableDataRow,
                        u.selected && styles.rowHighlightGreen,
                      ]}
                    >
                      <Text style={[styles.tdBold, { flex: 1.6 }]}>{u.name}</Text>
                      <Text style={[styles.tdNormal, { flex: 1 }]}>{u.type}</Text>
                      <Text style={[styles.tdNormal, { flex: 1 }]}>{u.area}</Text>
                      <Text style={[styles.tdNormal, { flex: 0.8 }]}>{u.pickups}</Text>
                      <View style={{ flex: 1, alignItems: 'flex-start' }}>
                        <View
                          style={[
                            styles.statusBadge,
                            u.tone === 'green'
                              ? styles.badgeGreen
                              : u.tone === 'amber'
                              ? styles.badgeAmber
                              : styles.badgeRed,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              u.tone === 'green'
                                ? styles.badgeGreenText
                                : u.tone === 'amber'
                                ? styles.badgeAmberText
                                : styles.badgeRedText,
                            ]}
                          >
                            {u.tone === 'green' ? '✓ ' : u.tone === 'amber' ? '🕒 ' : '❗ '}
                            {u.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}

                  <Text style={[styles.cardMutedCount, { marginTop: 12 }]}>
                    Showing 6 of 1,284
                  </Text>
                </View>

                {/* Right User Inspector */}
                <View style={[styles.whiteCard, { flex: 1, gap: 10 }]}>
                  <View style={styles.cardHeaderBetween}>
                    <View>
                      <Text style={styles.cardSectionTitle}>Halima B.</Text>
                      <Text style={styles.inspectSub}>Household · joined 2 Oct</Text>
                    </View>
                    <View style={[styles.statusBadge, styles.badgeGreen]}>
                      <Text style={[styles.statusBadgeText, styles.badgeGreenText]}>✓ Active</Text>
                    </View>
                  </View>

                  <View style={styles.metaKeyValRow}>
                    <Text style={styles.metaKey}>Phone</Text>
                    <Text style={styles.metaVal}>•••• 4821</Text>
                  </View>
                  <View style={styles.metaKeyValRow}>
                    <Text style={styles.metaKey}>Area</Text>
                    <Text style={styles.metaVal}>Bwari, Abuja</Text>
                  </View>
                  <View style={styles.metaKeyValRow}>
                    <Text style={styles.metaKey}>ID check</Text>
                    <Text style={styles.metaVal}>Not needed · under ₦50,000</Text>
                  </View>
                  <View style={styles.metaKeyValRow}>
                    <Text style={styles.metaKey}>Pickups</Text>
                    <Text style={styles.metaVal}>12</Text>
                  </View>
                  <View style={styles.metaKeyValRow}>
                    <Text style={styles.metaKey}>Earned</Text>
                    <Text style={[styles.metaVal, { color: '#2E7D32' }]}>₦6,420</Text>
                  </View>
                  <View style={styles.metaKeyValRow}>
                    <Text style={styles.metaKey}>Reports about her</Text>
                    <Text style={styles.metaVal}>0</Text>
                  </View>

                  <Text style={styles.smallHelperText}>
                    Suspending stops new pickups. Money already held is not affected.
                  </Text>

                  <TouchableOpacity
                    style={styles.outlineFullBtn}
                    onPress={() => setSection('payments')}
                  >
                    <Text style={styles.outlineFullBtnText}>See her payments</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.redOutlineFullBtn}
                    onPress={() => setPopupModal('suspend_halima')}
                  >
                    <Text style={styles.redOutlineFullBtnText}>Suspend account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 03.2 MARKET RATES                                              */}
          {/* -------------------------------------------------------------- */}
          {section === 'market_rates' && (
            <View style={{ gap: 16 }}>
              <View>
                <Text style={styles.pageTitle}>Market rates</Text>
                <Text style={styles.pageSubtitle}>
                  Guide prices households see. Each recycler still sets their own price.
                </Text>
              </View>

              <View style={styles.twoColWorkspace}>
                <View style={[styles.whiteCard, { flex: 1.8 }]}>
                  <Text style={styles.cardSectionTitle}>Guide price per kg</Text>
                  <Text style={styles.inspectSub}>Kubwa and Bwari</Text>

                  <View style={[styles.tableHeaderRow, { marginTop: 10 }]}>
                    <Text style={[styles.thText, { flex: 1.4 }]}>Material</Text>
                    <Text style={[styles.thText, { flex: 1.1 }]}>Guide range</Text>
                    <Text style={[styles.thText, { flex: 1 }]}>Recyclers' avg</Text>
                    <Text style={[styles.thText, { flex: 0.9 }]}>Changed</Text>
                    <Text style={[styles.thText, { flex: 0.9 }]}>Status</Text>
                  </View>

                  {[
                    { mat: 'PET bottles', range: '₦80–₦150', avg: '₦118', changed: 'Today', live: true, selected: true },
                    { mat: 'HDPE bottles', range: '₦90–₦140', avg: '₦105', changed: '3 Nov', live: true, selected: false },
                    { mat: 'Aluminium cans', range: '₦500–₦800', avg: '₦760', changed: '3 Nov', live: true, selected: false },
                    { mat: 'Cardboard', range: '₦40–₦80', avg: '₦58', changed: '28 Oct', live: true, selected: false },
                    { mat: 'Glass bottles', range: '₦20–₦40', avg: '₦30', changed: '28 Oct', live: true, selected: false },
                    { mat: 'E-waste', range: '—', avg: '—', changed: '—', live: false, selected: false },
                  ].map((r, i) => (
                    <View
                      key={i}
                      style={[
                        styles.tableDataRow,
                        r.selected && styles.rowHighlightGreen,
                      ]}
                    >
                      <Text style={[styles.tdBold, { flex: 1.4 }]}>{r.mat}</Text>
                      <Text style={[styles.tdBold, { flex: 1.1 }]}>{r.range}</Text>
                      <Text style={[styles.tdNormal, { flex: 1 }]}>{r.avg}</Text>
                      <Text style={[styles.tdNormal, { flex: 0.9 }]}>{r.changed}</Text>
                      <View style={{ flex: 0.9, alignItems: 'flex-start' }}>
                        <View
                          style={[
                            styles.statusBadge,
                            r.live ? styles.badgeGreen : styles.badgeGray,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              r.live ? styles.badgeGreenText : styles.badgeGrayText,
                            ]}
                          >
                            {r.live ? '✓ Live' : '• Not collected'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                <View style={[styles.whiteCard, { flex: 1, gap: 12, alignSelf: 'flex-start' }]}>
                  <Text style={styles.cardSectionTitle}>Edit · PET bottles</Text>

                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.authFieldLabel}>Lowest ₦/kg</Text>
                      <TextInput
                        style={styles.authInput}
                        value={minRate}
                        onChangeText={setMinRate}
                        keyboardType="numeric"
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.authFieldLabel}>Highest ₦/kg</Text>
                      <TextInput
                        style={styles.authInput}
                        value={maxRate}
                        onChangeText={setMaxRate}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>

                  <View style={styles.quoteGrayBox}>
                    <Text style={styles.quoteLabel}>Households will see</Text>
                    <Text style={[styles.tdBold, { marginTop: 2 }]}>
                      Recyclers near you pay ₦{minRate}–₦{maxRate}/kg
                    </Text>
                  </View>

                  <Text style={styles.authFieldLabel}>Reason for the change</Text>
                  <TextInput
                    style={styles.authInput}
                    value={rateChangeReason}
                    onChangeText={setRateChangeReason}
                  />

                  <Text style={styles.smallHelperText}>Saved to the audit log.</Text>

                  <TouchableOpacity
                    style={styles.authGreenBtn}
                    onPress={() => setSection('audit_log')}
                  >
                    <Text style={styles.authGreenBtnText}>Save new range</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 03.3 PRIVATE REPORTS                                           */}
          {/* -------------------------------------------------------------- */}
          {section === 'reports' && (
            <View style={{ gap: 16 }}>
              <View>
                <Text style={styles.pageTitle}>Reports</Text>
                <Text style={styles.pageSubtitle}>
                  Private reports from households and recyclers. Only admins see these.
                </Text>
              </View>

              <View style={styles.twoColWorkspace}>
                <View style={[styles.whiteCard, { flex: 1.8 }]}>
                  <View style={styles.subTabsRow}>
                    {['Open 2', 'Being checked 1', 'Closed'].map((tab) => (
                      <TouchableOpacity
                        key={tab}
                        style={[
                          styles.subTabPill,
                          reportsTab === tab && styles.subTabPillActive,
                        ]}
                        onPress={() => setReportsTab(tab)}
                      >
                        <Text
                          style={[
                            styles.subTabText,
                            reportsTab === tab && styles.subTabTextActive,
                          ]}
                        >
                          {tab}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.thText, { flex: 1.8 }]}>Report</Text>
                    <Text style={[styles.thText, { flex: 1 }]}>From</Text>
                    <Text style={[styles.thText, { flex: 1.1 }]}>About</Text>
                    <Text style={[styles.thText, { flex: 0.9 }]}>Received</Text>
                    <Text style={[styles.thText, { flex: 0.9 }]}>Status</Text>
                  </View>

                  {[
                    { rep: 'Asked to pay outside the app', from: 'Musa A.', about: 'Dutse Circular', rec: 'Today', status: 'New', tone: 'red', sel: true },
                    { rep: 'Rude at pickup', from: 'Ibrahim K.', about: 'Quick Scrap NG', rec: '10 Nov', status: 'New', tone: 'red', sel: false },
                    { rep: 'Scale looked wrong', from: 'Halima B.', about: 'Bwari Renew', rec: 'Yesterday', status: 'Checking', tone: 'amber', sel: false },
                  ].map((r, i) => (
                    <View
                      key={i}
                      style={[styles.tableDataRow, r.sel && styles.rowHighlightGreen]}
                    >
                      <Text style={[styles.tdBold, { flex: 1.8 }]}>{r.rep}</Text>
                      <Text style={[styles.tdNormal, { flex: 1 }]}>{r.from}</Text>
                      <Text style={[styles.tdNormal, { flex: 1.1 }]}>{r.about}</Text>
                      <Text style={[styles.tdNormal, { flex: 0.9 }]}>{r.rec}</Text>
                      <View style={{ flex: 0.9, alignItems: 'flex-start' }}>
                        <View
                          style={[
                            styles.statusBadge,
                            r.tone === 'red' ? styles.badgeRed : styles.badgeAmber,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              r.tone === 'red' ? styles.badgeRedText : styles.badgeAmberText,
                            ]}
                          >
                            {r.tone === 'red' ? '❗ ' : '🕒 '}
                            {r.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                <View style={[styles.whiteCard, { flex: 1, gap: 12, alignSelf: 'flex-start' }]}>
                  <View style={styles.cardHeaderBetween}>
                    <View>
                      <Text style={styles.cardSectionTitle}>Asked to pay outside the app</Text>
                      <Text style={styles.inspectSub}>Today, 09:10 · REQ-0401</Text>
                    </View>
                    <View style={[styles.statusBadge, styles.badgeRed]}>
                      <Text style={[styles.statusBadgeText, styles.badgeRedText]}>❗ New</Text>
                    </View>
                  </View>

                  <View style={styles.metaKeyValRow}>
                    <Text style={styles.metaKey}>From</Text>
                    <Text style={styles.metaVal}>Musa A. · household</Text>
                  </View>
                  <View style={styles.metaKeyValRow}>
                    <Text style={styles.metaKey}>About</Text>
                    <Text style={styles.metaVal}>Dutse Circular · recycler</Text>
                  </View>
                  <View style={styles.metaKeyValRow}>
                    <Text style={styles.metaKey}>Earlier reports</Text>
                    <Text style={styles.metaVal}>1</Text>
                  </View>

                  <View style={styles.quoteGrayBox}>
                    <Text style={styles.quoteLabel}>What they said</Text>
                    <Text style={styles.quoteBody}>
                      "He said I should send money to his OPay so he can come faster."
                    </Text>
                  </View>

                  <TouchableOpacity style={styles.authGreenBtn}>
                    <Text style={styles.authGreenBtnText}>Warn recycler</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.redOutlineFullBtn}
                    onPress={() => setPopupModal('suspend_halima')}
                  >
                    <Text style={styles.redOutlineFullBtnText}>Suspend recycler</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.outlineFullBtn}>
                    <Text style={styles.outlineFullBtnText}>Close report</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 03.4 CONTENT CMS                                               */}
          {/* -------------------------------------------------------------- */}
          {section === 'content' && (
            <View style={{ gap: 16 }}>
              <View>
                <Text style={styles.pageTitle}>Content</Text>
                <Text style={styles.pageSubtitle}>
                  Tips and notices shown in the app, in every language.
                </Text>
              </View>

              <View style={styles.twoColWorkspace}>
                <View style={[styles.whiteCard, { flex: 1.8 }]}>
                  <View style={styles.subTabsRow}>
                    {['All', 'Scan results', 'Home', 'Help'].map((t) => (
                      <TouchableOpacity
                        key={t}
                        style={[
                          styles.subTabPill,
                          contentTab === t && styles.subTabPillActive,
                        ]}
                        onPress={() => setContentTab(t)}
                      >
                        <Text
                          style={[
                            styles.subTabText,
                            contentTab === t && styles.subTabTextActive,
                          ]}
                        >
                          {t}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.thText, { flex: 1.8 }]}>Item</Text>
                    <Text style={[styles.thText, { flex: 1 }]}>Shows on</Text>
                    <Text style={[styles.thText, { flex: 0.9 }]}>Languages</Text>
                    <Text style={[styles.thText, { flex: 0.9 }]}>Edited</Text>
                    <Text style={[styles.thText, { flex: 0.9 }]}>Status</Text>
                  </View>

                  {[
                    { item: 'Get it ready · PET', on: 'Scan result', langs: '3', ed: 'Today', live: true, sel: true },
                    { item: 'Not collected yet · e-waste', on: 'Scan result', langs: '2', ed: '3 Nov', live: true, sel: false },
                    { item: 'How to throw it away', on: 'Scan result', langs: '1', ed: '3 Nov', live: true, sel: false },
                    { item: 'Pilot area notice', on: 'Home', langs: '3', ed: '1 Nov', live: true, sel: false },
                    { item: 'Get it ready · PET (Yoruba)', on: 'Scan result', langs: '1', ed: 'Today', live: false, sel: false },
                  ].map((c, idx) => (
                    <View
                      key={idx}
                      style={[styles.tableDataRow, c.sel && styles.rowHighlightGreen]}
                    >
                      <Text style={[styles.tdBold, { flex: 1.8 }]}>{c.item}</Text>
                      <Text style={[styles.tdNormal, { flex: 1 }]}>{c.on}</Text>
                      <Text style={[styles.tdNormal, { flex: 0.9 }]}>{c.langs}</Text>
                      <Text style={[styles.tdNormal, { flex: 0.9 }]}>{c.ed}</Text>
                      <View style={{ flex: 0.9, alignItems: 'flex-start' }}>
                        <View
                          style={[
                            styles.statusBadge,
                            c.live ? styles.badgeGreen : styles.badgeAmber,
                          ]}
                        >
                          <Text
                            style={[
                              styles.statusBadgeText,
                              c.live ? styles.badgeGreenText : styles.badgeAmberText,
                            ]}
                          >
                            {c.live ? '✓ Live' : '🕒 Draft'}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                <View style={[styles.whiteCard, { flex: 1, gap: 10, alignSelf: 'flex-start' }]}>
                  <Text style={styles.cardSectionTitle}>Edit · Get it ready · PET</Text>

                  <View style={styles.subTabsRow}>
                    {(['EN', 'Pidgin', 'Hausa', 'Yoruba', 'Igbo'] as const).map((lng) => (
                      <TouchableOpacity
                        key={lng}
                        style={[
                          styles.subTabPill,
                          contentLang === lng && styles.subTabPillActive,
                        ]}
                        onPress={() => setContentLang(lng)}
                      >
                        <Text
                          style={[
                            styles.subTabText,
                            contentLang === lng && styles.subTabTextActive,
                          ]}
                        >
                          {lng}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.authFieldLabel}>Tip 1</Text>
                  <TextInput style={styles.authInput} value={tip1} onChangeText={setTip1} />

                  <Text style={styles.authFieldLabel}>Tip 2</Text>
                  <TextInput style={styles.authInput} value={tip2} onChangeText={setTip2} />

                  <Text style={styles.authFieldLabel}>Tip 3</Text>
                  <TextInput style={styles.authInput} value={tip3} onChangeText={setTip3} />

                  <Text style={styles.smallHelperText}>Keep each tip short and simple.</Text>

                  <TouchableOpacity
                    style={styles.authGreenBtn}
                    onPress={() => setSection('audit_log')}
                  >
                    <Text style={styles.authGreenBtnText}>Publish</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.outlineFullBtn}>
                    <Text style={styles.outlineFullBtnText}>Save draft</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* -------------------------------------------------------------- */}
          {/* 03.5 AUDIT LOG                                                 */}
          {/* -------------------------------------------------------------- */}
          {section === 'audit_log' && (
            <View style={{ gap: 16 }}>
              <View style={styles.pageHeaderRow}>
                <View>
                  <Text style={styles.pageTitle}>Audit log</Text>
                  <Text style={styles.pageSubtitle}>
                    Every admin action, with who did it and when. Nobody can edit this list.
                  </Text>
                </View>
                <TouchableOpacity style={styles.outlineActionBtn}>
                  <Text style={styles.outlineActionBtnText}>Export CSV</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.whiteCard}>
                <View style={styles.subTabsRow}>
                  {['All actions', 'Money', 'Accounts', 'Rates', 'Content'].map((t) => (
                    <TouchableOpacity
                      key={t}
                      style={[
                        styles.subTabPill,
                        auditTab === t && styles.subTabPillActive,
                      ]}
                      onPress={() => setAuditTab(t)}
                    >
                      <Text
                        style={[
                          styles.subTabText,
                          auditTab === t && styles.subTabTextActive,
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.thText, { flex: 1 }]}>Time</Text>
                  <Text style={[styles.thText, { flex: 0.9 }]}>Admin</Text>
                  <Text style={[styles.thText, { flex: 1.6 }]}>Action</Text>
                  <Text style={[styles.thText, { flex: 1.2 }]}>On</Text>
                  <Text style={[styles.thText, { flex: 1.8 }]}>Details</Text>
                </View>

                {[
                  { time: 'Today, 10:42', admin: 'Ifeoma', action: 'Changed PET guide range', on: 'Market rates', details: '₦80–₦140 → ₦80–₦150' },
                  { time: 'Today, 10:05', admin: 'Ifeoma', action: 'Approved recycler', on: 'Musa Waste', details: 'Licence AEPB/RC/2025/0412' },
                  { time: 'Today, 09:51', admin: 'Tunde', action: 'Decided dispute · adjusted', on: 'REQ-0412', details: '₦600 to household' },
                  { time: 'Today, 09:40', admin: 'Tunde', action: 'Retried failed payout', on: 'PAY-0871', details: '₦12,500 to Bwari Renew' },
                  { time: 'Yesterday', admin: 'Ifeoma', action: 'Suspended account', on: 'Quick Scrap NG', details: '2 reports · asked for cash' },
                  { time: 'Yesterday', admin: 'Ifeoma', action: 'Published content', on: 'Get it ready · PET', details: 'EN, Pidgin, Hausa' },
                ].map((log, i) => (
                  <View key={i} style={styles.tableDataRow}>
                    <Text style={[styles.tdNormal, { flex: 1 }]}>{log.time}</Text>
                    <Text style={[styles.tdNormal, { flex: 0.9 }]}>{log.admin}</Text>
                    <Text style={[styles.tdBold, { flex: 1.6 }]}>{log.action}</Text>
                    <Text style={[styles.tdNormal, { flex: 1.2 }]}>{log.on}</Text>
                    <Text style={[styles.tdNormal, { flex: 1.8 }]}>{log.details}</Text>
                  </View>
                ))}

                <View style={styles.tableFooterRow}>
                  <Text style={styles.cardMutedCount}>Showing 6 of 1,208 actions</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity style={styles.outlineActionBtn}>
                      <Text style={styles.outlineActionBtnText}>Previous</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.outlineActionBtn}>
                      <Text style={styles.outlineActionBtnText}>Next</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      {/* ==================================================================== */}
      {/* SCREEN 04: RISKY ACTION CONFIRMATION POP-UPS (3 MODALS)              */}
      {/* ==================================================================== */}
      <Modal
        visible={popupModal !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPopupModal(null)}
      >
        <View style={styles.modalBackdrop}>
          {/* 04.1: Send back to Musa Waste Collection? */}
          {popupModal === 'send_back_musa' && (
            <View style={styles.confirmModalBox}>
              <View style={styles.modalGreenIconCircle}>
                <RotateCcw size={18} color="#2E7D32" />
              </View>
              <Text style={styles.confirmModalTitle}>
                Send back to Musa Waste Collection?
              </Text>
              <Text style={styles.confirmModalSub}>
                They get an SMS asking for a clearer licence photo. Their NIN, selfie and payout
                account stay approved.
              </Text>
              <View style={styles.confirmModalActions}>
                <TouchableOpacity
                  style={styles.outlineActionBtn}
                  onPress={() => setPopupModal(null)}
                >
                  <Text style={styles.outlineActionBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.solidGreenActionBtn}
                  onPress={() => {
                    setPopupModal(null);
                    setSection('audit_log');
                  }}
                >
                  <Text style={styles.solidGreenActionBtnText}>Send back</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 04.2: Adjust REQ-0412 to ₦600? */}
          {popupModal === 'adjust_dispute_600' && (
            <View style={styles.confirmModalBox}>
              <View style={styles.modalGreenIconCircle}>
                <Scale size={18} color="#2E7D32" />
              </View>
              <Text style={styles.confirmModalTitle}>Adjust REQ-0412 to ₦600?</Text>
              <Text style={styles.confirmModalSub}>
                Both sides get an SMS with your reason. The household still gives their code to
                release the money.
              </Text>

              <View style={styles.modalBreakdownBox}>
                <View style={styles.metaKeyValRow}>
                  <Text style={styles.metaKey}>To household</Text>
                  <Text style={[styles.metaVal, { color: '#2E7D32' }]}>₦600</Text>
                </View>
                <View style={styles.metaKeyValRow}>
                  <Text style={styles.metaKey}>Back to recycler</Text>
                  <Text style={styles.metaVal}>₦0</Text>
                </View>
                <View style={styles.metaKeyValRow}>
                  <Text style={styles.metaKey}>New rate</Text>
                  <Text style={styles.metaVal}>₦100/kg × 6 kg</Text>
                </View>
              </View>

              <View style={styles.confirmModalActions}>
                <TouchableOpacity
                  style={styles.outlineActionBtn}
                  onPress={() => setPopupModal(null)}
                >
                  <Text style={styles.outlineActionBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.solidGreenActionBtn}
                  onPress={() => {
                    setPopupModal(null);
                    setSection('audit_log');
                  }}
                >
                  <Text style={styles.solidGreenActionBtnText}>Confirm decision</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 04.3: Suspend Halima B.? */}
          {popupModal === 'suspend_halima' && (
            <View style={styles.confirmModalBox}>
              <View style={styles.modalRedIconCircle}>
                <AlertCircle size={18} color="#DC2626" />
              </View>
              <Text style={styles.confirmModalTitle}>Suspend Halima B.?</Text>
              <Text style={styles.confirmModalSub}>
                She can't book new pickups or cash out until you restore her account. Money already
                held for pickups is not affected.
              </Text>

              <Text style={[styles.authFieldLabel, { marginTop: 10 }]}>
                Reason · she'll see this
              </Text>
              <TextInput
                style={[styles.authInput, { marginBottom: 14 }]}
                value={suspendReason}
                onChangeText={setSuspendReason}
                placeholder="e.g. Asked a recycler to pay outside the app"
              />

              <View style={styles.confirmModalActions}>
                <TouchableOpacity
                  style={styles.outlineActionBtn}
                  onPress={() => setPopupModal(null)}
                >
                  <Text style={styles.outlineActionBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.solidRedActionBtn}
                  onPress={() => {
                    setPopupModal(null);
                    setSection('audit_log');
                  }}
                >
                  <Text style={styles.solidRedActionBtnText}>Suspend account</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  desktopRoot: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  switcherBar: {
    backgroundColor: '#0F1E12',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1E3A23',
  },
  switcherScroll: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  backToAppChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E6F4D7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    marginRight: 6,
  },
  backToAppText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#166534',
  },
  switchPill: {
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  switchPillActive: {
    backgroundColor: '#2E7D32',
  },
  switchPillModal: {
    backgroundColor: '#D97706',
  },
  switchPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  switchPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  // Auth Screen 00
  authPage: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  authCenterWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  authBrandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E6B34',
  },
  authBrandSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 20,
  },
  authCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 24,
  },
  authCardHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  auth2faSub: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginTop: -6,
    marginBottom: 16,
  },
  authFieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  authInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
  },
  authGreenBtn: {
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  authGreenBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  authForgotHint: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 14,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  otpBox: {
    flex: 1,
    height: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  otpBoxActive: {
    borderColor: '#2E7D32',
    borderWidth: 2,
  },
  otpDigitText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  backupCodeLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  authStaffNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
  },
  authStaffNoticeText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  // Desktop Workspace
  workspaceRow: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 215,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
  sidebarBrandBox: {
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  sidebarBrandName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E6B34',
  },
  sidebarBrandSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderRadius: 8,
    marginBottom: 2,
    gap: 10,
  },
  navRowActive: {
    backgroundColor: '#E6F4D7',
  },
  navLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  navLabelActive: {
    color: '#166534',
    fontWeight: '700',
  },
  navBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  navBadgeActive: {
    backgroundColor: '#2E7D32',
  },
  navBadgeAmber: {
    backgroundColor: '#FEF3C7',
  },
  navBadgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  navBadgeTextActive: {
    color: '#FFFFFF',
  },
  navBadgeTextAmber: {
    color: '#B45309',
  },
  sidebarSignOut: {
    paddingHorizontal: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  sidebarSignOutText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  mainScroll: {
    flex: 1,
  },
  mainContent: {
    padding: 24,
    paddingBottom: 60,
  },
  pageHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  pageSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  topSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    width: 260,
    gap: 8,
  },
  topSearchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
  },
  kpiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  kpiCard: {
    flex: 1,
    minWidth: 170,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
  },
  kpiLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  kpiNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginVertical: 6,
  },
  kpiSub: {
    fontSize: 11,
    color: '#64748B',
  },
  twoColWorkspace: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  whiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 18,
  },
  cardHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardMutedCount: {
    fontSize: 11,
    color: '#94A3B8',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  thText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingHorizontal: 6,
  },
  rowHighlightGreen: {
    backgroundColor: '#F4FBF0',
    borderLeftWidth: 3,
    borderLeftColor: '#2E7D32',
  },
  tdBold: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  tdNormal: {
    fontSize: 12,
    color: '#475569',
  },
  tdSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeAmber: {
    backgroundColor: '#FEF3C7',
  },
  badgeAmberText: {
    color: '#B45309',
  },
  badgeRed: {
    backgroundColor: '#FEE2E2',
  },
  badgeRedText: {
    color: '#DC2626',
  },
  badgeGreen: {
    backgroundColor: '#E6F4D7',
  },
  badgeGreenText: {
    color: '#166534',
  },
  badgeGray: {
    backgroundColor: '#F1F5F9',
  },
  badgeGrayText: {
    color: '#475569',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  todayMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  todayMetricLabel: {
    fontSize: 12,
    color: '#475569',
  },
  todayMetricVal: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  subTabsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  subTabPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#F8FAFC',
  },
  subTabPillActive: {
    backgroundColor: '#E6F4D7',
  },
  subTabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  subTabTextActive: {
    color: '#166534',
    fontWeight: '800',
  },
  queueListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  queueListItemActive: {
    backgroundColor: '#F4FBF0',
    borderLeftWidth: 3,
    borderLeftColor: '#2E7D32',
  },
  queueItemName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  queueItemSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  queueItemWait: {
    fontSize: 11,
    color: '#64748B',
  },
  inspectTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  inspectSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  innerSectionCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    padding: 14,
    gap: 8,
  },
  innerCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  autoCheckLine: {
    fontSize: 12,
    color: '#334155',
  },
  photoCompareRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  photoPlaceholderBox: {
    width: 150,
    height: 92,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  photoPlaceholderLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  checkControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  checkControlTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  checkControlSub: {
    fontSize: 11,
    color: '#64748B',
  },
  okFixBtns: {
    flexDirection: 'row',
    gap: 6,
  },
  okBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  okBtnSelected: {
    backgroundColor: '#E6F4D7',
    borderColor: '#2E7D32',
  },
  okBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  okBtnTextSelected: {
    color: '#166534',
  },
  fixBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  fixBtnSelected: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  fixBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  fixBtnTextSelected: {
    color: '#DC2626',
  },
  licenceRow: {
    flexDirection: 'row',
    gap: 16,
  },
  metaKeyValRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  metaKey: {
    fontSize: 12,
    color: '#64748B',
  },
  metaVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  verifFooterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  verifFooterWarning: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  outlineActionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  outlineActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  solidGreenActionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#2E7D32',
  },
  solidGreenActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  solidRedActionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#DC2626',
  },
  solidRedActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  quoteGrayBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  quoteLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  quoteBody: {
    fontSize: 12,
    color: '#0F172A',
    marginTop: 2,
    lineHeight: 18,
  },
  timelineRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 5,
  },
  timelineTime: {
    fontSize: 11,
    color: '#64748B',
    width: 42,
  },
  timelineText: {
    fontSize: 12,
    color: '#0F172A',
    flex: 1,
  },
  decisionOptionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  decisionOptionBoxSelected: {
    borderColor: '#2E7D32',
    backgroundColor: '#F4FBF0',
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  radioOuterActive: {
    borderColor: '#2E7D32',
  },
  radioInnerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
  },
  decisionOptTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  decisionOptSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  smallHelperText: {
    fontSize: 11,
    color: '#64748B',
  },
  auditHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  auditHintText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  outlineFullBtn: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 4,
  },
  outlineFullBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  redOutlineFullBtn: {
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 4,
  },
  redOutlineFullBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  tableFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
  },
  redAlertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 14,
  },
  redAlertTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#DC2626',
  },
  redAlertBody: {
    fontSize: 12,
    color: '#7F1D1D',
    marginTop: 2,
    lineHeight: 17,
  },
  // Support 3-col
  supportColLeft: {
    flex: 0.9,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    minWidth: 210,
  },
  supportColCenter: {
    flex: 1.6,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
    minWidth: 280,
    justifyContent: 'space-between',
  },
  supportColRight: {
    flex: 0.95,
    padding: 16,
    gap: 8,
    minWidth: 210,
  },
  supportChatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  supportMessagesArea: {
    padding: 16,
    gap: 10,
    minHeight: 240,
  },
  supportBubble: {
    maxWidth: '82%',
    padding: 10,
    borderRadius: 10,
  },
  supportBubbleUser: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
  },
  supportBubbleAdmin: {
    alignSelf: 'flex-end',
    backgroundColor: '#E6F4D7',
  },
  supportBubbleText: {
    fontSize: 12,
    color: '#0F172A',
    lineHeight: 17,
  },
  supportBubbleTime: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 4,
  },
  supportInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  supportTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 12,
  },
  recentPickupChip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
  },
  // Confirmation Modals (Screen 04)
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  confirmModalBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 22,
  },
  modalGreenIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F4D7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalRedIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  confirmModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  confirmModalSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 18,
  },
  modalBreakdownBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
  },
  confirmModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
});
