import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  Wallet,
  Lock,
  ArrowDownLeft,
  ArrowUpRight,
  Plus,
  Copy,
  Check,
  Clock,
  Info,
  AlertCircle,
  Sparkles,
  Building2,
} from 'lucide-react-native';
import TopGreenWave from '../../components/common/TopGreenWave';
import RecyclerBottomNavBar from '../../components/common/RecyclerBottomNavBar';

type WalletViewState = 'overview' | 'top_up' | 'cash_out' | 'cash_out_done';

export default function RecyclerWalletScreen() {
  const router = useRouter();
  const [viewState, setViewState] = useState<WalletViewState>('overview');
  const [cashOutAmount, setCashOutAmount] = useState('1,550');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const demoTabs: { id: WalletViewState; label: string }[] = [
    { id: 'overview', label: '1. Wallet Overview' },
    { id: 'top_up', label: '2. Top Up' },
    { id: 'cash_out', label: '3. Cash Out' },
    { id: 'cash_out_done', label: '4. Cash Out Sent' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TopGreenWave />

      {/* Header */}
      <View style={styles.header}>
        {viewState === 'overview' ? (
          <Text style={styles.headerTitle}>Wallet</Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => setViewState('overview')}
              style={styles.backBtn}
            >
              <ArrowLeft size={22} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitleSmall}>
              {viewState === 'top_up' ? 'Top up' : 'Cash out'}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.bellBtn}
          onPress={() => router.push('/recycler/notifications' as any)}
        >
          <Bell size={20} color="#1F2937" />
        </TouchableOpacity>
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
              style={[styles.demoPill, viewState === t.id && styles.demoPillActive]}
              onPress={() => setViewState(t.id)}
            >
              <Text style={[styles.demoPillText, viewState === t.id && styles.demoPillTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ================= FRAME 1: WALLET OVERVIEW ================= */}
        {viewState === 'overview' && (
          <View style={styles.contentWrap}>
            {/* Dark Green Wallet Hero Card */}
            <View style={styles.heroWalletCard}>
              <View style={styles.heroTopRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Wallet size={14} color="#D1FAE5" />
                  <Text style={styles.heroBrandText}>ECOSMART WALLET</Text>
                </View>
                <View style={styles.verifiedPill}>
                  <Text style={styles.verifiedPillText}>✓ Verified</Text>
                </View>
              </View>

              <Text style={styles.availableLabel}>Available</Text>
              <Text style={styles.availableAmount}>₦1,550</Text>

              <View style={styles.heroSubBoxesRow}>
                <View style={styles.heroSubBox}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Lock size={12} color="#FDE68A" />
                    <Text style={styles.subBoxLabel}>Set aside</Text>
                  </View>
                  <Text style={[styles.subBoxValue, { color: '#FDE68A' }]}>₦450</Text>
                  <Text style={styles.subBoxNote}>Locked for 1 active pickup</Text>
                </View>

                <View style={styles.heroSubBox}>
                  <Text style={styles.subBoxLabel}>Paid this week</Text>
                  <Text style={styles.subBoxValue}>₦24,800</Text>
                  <Text style={styles.subBoxNote}>To 31 households</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons Row */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.topUpPrimaryBtn}
                onPress={() => setViewState('top_up')}
              >
                <Text style={styles.topUpPrimaryBtnText}>Top up</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cashOutOutlineBtn}
                onPress={() => setViewState('cash_out')}
              >
                <Text style={styles.cashOutOutlineBtnText}>Cash out</Text>
              </TouchableOpacity>
            </View>

            {/* Recent Activity List */}
            <View style={styles.activityCard}>
              <Text style={styles.activityHeader}>Recent activity</Text>

              {/* Row 1: Set aside */}
              <View style={styles.activityRow}>
                <View style={[styles.actIconCircle, { backgroundColor: '#FEF3C7' }]}>
                  <Lock size={16} color="#D97706" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.actTitle}>Set aside · Musa A.</Text>
                  <Text style={styles.actSub}>Today, 10:05 · pickup active</Text>
                </View>
                <Text style={styles.actAmountNeg}>–₦450</Text>
              </View>

              {/* Row 2: Returned */}
              <View style={styles.activityRow}>
                <View style={[styles.actIconCircle, { backgroundColor: '#E8F5E9' }]}>
                  <ArrowDownLeft size={16} color="#2E7D32" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.actTitle}>Returned · Amaka O.</Text>
                  <Text style={styles.actSub}>Yesterday · unused</Text>
                </View>
                <Text style={styles.actAmountPos}>+₦66</Text>
              </View>

              {/* Row 3: Paid */}
              <View style={styles.activityRow}>
                <View style={[styles.actIconCircle, { backgroundColor: '#E0F2FE' }]}>
                  <ArrowUpRight size={16} color="#0284C7" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.actTitle}>Paid · Amaka O.</Text>
                  <Text style={styles.actSub}>Yesterday · 3.2 kg PET</Text>
                </View>
                <Text style={styles.actAmountNeg}>–₦384</Text>
              </View>

              {/* Row 4: Top up */}
              <View style={[styles.activityRow, { borderBottomWidth: 0 }]}>
                <View style={[styles.actIconCircle, { backgroundColor: '#E8F5E9' }]}>
                  <Plus size={16} color="#2E7D32" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.actTitle}>Top up · bank transfer</Text>
                  <Text style={styles.actSub}>Mon, 9 Nov</Text>
                </View>
                <Text style={styles.actAmountPos}>+₦2,000</Text>
              </View>
            </View>
          </View>
        )}

        {/* ================= FRAME 2: TOP UP ================= */}
        {viewState === 'top_up' && (
          <View style={styles.contentWrap}>
            <Text style={styles.pageMainTitle}>Send money to your EcoSmart account</Text>
            <Text style={styles.pageMainSub}>
              Transfer from any bank or app. It shows in your wallet in about a minute.
            </Text>

            <View style={styles.bankAccountCard}>
              <Text style={styles.accFieldLabel}>Account number</Text>
              <View style={styles.accNumRow}>
                <Text style={styles.accNumberBig}>2094817365</Text>
                <TouchableOpacity style={styles.copyPillBtn} onPress={handleCopy}>
                  {copied ? (
                    <Check size={14} color="#2E7D32" />
                  ) : (
                    <Copy size={14} color="#2E7D32" />
                  )}
                  <Text style={styles.copyPillText}>{copied ? 'Copied' : 'Copy'}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.divider} />

              <View style={styles.bankMetaRow}>
                <Text style={styles.bankMetaLabel}>Bank</Text>
                <Text style={styles.bankMetaValue}>Moniepoint MFB (Partner Bank)</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.bankMetaRow}>
                <Text style={styles.bankMetaLabel}>Account name</Text>
                <Text style={styles.bankMetaValue}>EcoSmart / Musa Waste</Text>
              </View>
            </View>

            <Text style={styles.sectionHeader}>Other ways to top up</Text>

            <TouchableOpacity style={styles.otherMethodCard}>
              <View style={styles.methodIconCircle}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#4B5563' }}>#</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.methodTitle}>USSD</Text>
                <Text style={styles.methodSub}>Dial a code from your bank</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.otherMethodCard}>
              <View style={styles.methodIconCircle}>
                <Building2 size={18} color="#4B5563" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.methodTitle}>Cash at a POS agent</Text>
                <Text style={styles.methodSub}>Give cash, the agent sends it to this account</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cashOutOutlineBtn, { marginTop: 24, paddingVertical: 15 }]}
              onPress={() => setViewState('overview')}
            >
              <Text style={styles.cashOutOutlineBtnText}>I've sent the money</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= FRAME 3: CASH OUT ================= */}
        {viewState === 'cash_out' && (
          <View style={styles.contentWrap}>
            <View style={styles.cashOutSummaryBox}>
              <Text style={styles.canCashOutLabel}>You can cash out</Text>
              <Text style={styles.canCashOutAmount}>₦1,550</Text>
              <Text style={styles.canCashOutNote}>
                ₦450 set aside for active pickups isn't included
              </Text>
            </View>

            <Text style={styles.sectionHeader}>Amount</Text>
            <View style={styles.amountInputBox}>
              <Text style={styles.amountPrefix}>₦</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                value={cashOutAmount}
                onChangeText={setCashOutAmount}
              />
            </View>
            <TouchableOpacity onPress={() => setCashOutAmount('1,550')}>
              <Text style={styles.cashOutAllLink}>Cash out all</Text>
            </TouchableOpacity>

            {/* Payout Destination Card */}
            <View style={styles.payoutBankCard}>
              <View style={styles.payoutIconCircle}>
                <Building2 size={18} color="#0284C7" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.payoutBankTitle}>OPay · •••• 6789</Text>
                <Text style={styles.payoutBankOwner}>MUSA ABDULLAHI</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/recycler/profile' as any)}>
                <Text style={styles.changeLink}>Change</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pilotFreeNotice}>
              <Clock size={15} color="#6B7280" />
              <Text style={styles.pilotFreeText}>
                Usually arrives in a few minutes. Free during the pilot.
              </Text>
            </View>

            {/* Ask Mina Prompt Card */}
            <TouchableOpacity
              style={styles.minaCashOutRow}
              onPress={() => router.push('/recycler/mina' as any)}
            >
              <Sparkles size={16} color="#2E7D32" />
              <Text style={styles.minaCashOutText}>Questions about cash out?</Text>
              <Text style={styles.askMinaLink}>Ask Mina →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 24 }]}
              onPress={() => setViewState('cash_out_done')}
            >
              <Text style={styles.primaryBtnText}>Cash out ₦{cashOutAmount}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= FRAME 4: CASH OUT SUCCESS ================= */}
        {viewState === 'cash_out_done' && (
          <View style={styles.contentWrap}>
            <View style={styles.doneCheckCircle}>
              <Check size={32} color="#2E7D32" />
            </View>
            <Text style={styles.doneTitle}>₦{cashOutAmount} is on its way</Text>
            <Text style={styles.doneSub}>
              To OPay · •••• 6789. Usually arrives in a few minutes.
            </Text>

            <View style={styles.doneSummaryCard}>
              <View style={styles.doneMetricsRow}>
                <View style={styles.doneMetricBox}>
                  <Text style={styles.doneMetricLabel}>Fee</Text>
                  <Text style={styles.doneMetricValue}>Free</Text>
                </View>
                <View style={styles.doneMetricBox}>
                  <Text style={styles.doneMetricLabel}>Wallet now</Text>
                  <Text style={styles.doneMetricValue}>₦0</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Info size={14} color="#6B7280" />
                <Text style={styles.doneSetAsideNote}>
                  ₦450 is still set aside for your active pickup.
                </Text>
              </View>
            </View>

            <View style={styles.supportNoticeBox}>
              <AlertCircle size={15} color="#6B7280" />
              <Text style={styles.supportNoticeText}>
                Not received after 30 minutes? Contact support from Profile.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 32 }]}
              onPress={() => setViewState('overview')}
            >
              <Text style={styles.primaryBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Floating Ask Mina Button */}
      {viewState === 'overview' && (
        <TouchableOpacity
          style={styles.floatingMinaBtn}
          onPress={() => router.push('/recycler/mina' as any)}
          activeOpacity={0.85}
        >
          <Sparkles size={18} color="#2E7D32" />
        </TouchableOpacity>
      )}

      {/* 5-Tab Bottom Navigation */}
      <RecyclerBottomNavBar activeTab="Wallet" />
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
  heroWalletCard: {
    backgroundColor: '#1E6B34',
    borderRadius: 18,
    padding: 18,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBrandText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#D1FAE5',
    letterSpacing: 0.6,
  },
  verifiedPill: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  availableLabel: {
    fontSize: 12,
    color: '#D1FAE5',
    marginTop: 12,
  },
  availableAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
  },
  heroSubBoxesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  heroSubBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: 12,
  },
  subBoxLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E5E7EB',
  },
  subBoxValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  subBoxNote: {
    fontSize: 11,
    color: '#D1FAE5',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  topUpPrimaryBtn: {
    flex: 1,
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topUpPrimaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cashOutOutlineBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashOutOutlineBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E7D32',
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  activityHeader: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  actSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  actAmountNeg: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  actAmountPos: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2E7D32',
  },
  pageMainTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#111827',
  },
  pageMainSub: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
  },
  bankAccountCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 18,
  },
  accFieldLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  accNumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  accNumberBig: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  copyPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  copyPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  bankMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankMetaLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  bankMetaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginTop: 6,
  },
  otherMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
  },
  methodIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  methodSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  cashOutSummaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 18,
    alignItems: 'center',
  },
  canCashOutLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  canCashOutAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    marginTop: 4,
  },
  canCashOutNote: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
  },
  amountInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  amountPrefix: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6B7280',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  cashOutAllLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },
  payoutBankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginTop: 4,
  },
  payoutIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0F2FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payoutBankTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  payoutBankOwner: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  changeLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },
  pilotFreeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  pilotFreeText: {
    fontSize: 12,
    color: '#4B5563',
    flex: 1,
  },
  minaCashOutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 14,
  },
  minaCashOutText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  askMinaLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },
  primaryBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  doneCheckCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 16,
  },
  doneTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginTop: 8,
  },
  doneSub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
  doneSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginTop: 8,
  },
  doneMetricsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  doneMetricBox: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 12,
  },
  doneMetricLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  doneMetricValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
  },
  doneSetAsideNote: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  supportNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  supportNoticeText: {
    fontSize: 12,
    color: '#4B5563',
    flex: 1,
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
});
