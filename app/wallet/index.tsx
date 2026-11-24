import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Clock,
  Lock,
  Landmark,
  Wallet as WalletIcon,
  Sparkles,
  Info,
  AlertCircle,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomNavBar } from '../../components/common/BottomNavBar';

type WalletDemoMode =
  | '11.1_wallet'
  | '6.21_toast'
  | '11.3_cashout'
  | '11.4_pending'
  | '4.05_link_bank'
  | '11.2_verify_high'
  | '6.16_failed'
  | '6.09_empty';

export default function WalletScreen() {
  const router = useRouter();

  const [mode, setMode] = useState<WalletDemoMode>('11.1_wallet');
  const [cashOutAmount, setCashOutAmount] = useState<string>('1,624');
  const [ninInput, setNinInput] = useState<string>('1234 567 8901');
  const [selectedBank, setSelectedBank] = useState<string>('OPay');
  const [accountNumber, setAccountNumber] = useState<string>('••••••4421');

  const BANKS = ['OPay', 'PalmPay', 'Moniepoint', 'GTBank', 'Access Bank', 'Kuda'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        showBack={false}
        rightAction="bell"
        onPressBell={() => router.push('/profile?tab=notifications' as any)}
      />

      {/* Demo Switcher for all 8 screens in Screens · 11 */}
      <View style={styles.demoBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoScroll}
        >
          {(
            [
              { key: '11.1_wallet', label: '11.1 Wallet' },
              { key: '6.21_toast', label: '6.21 Paid Toast' },
              { key: '11.3_cashout', label: '11.3 Cash Out' },
              { key: '11.4_pending', label: '11.4 Pending' },
              { key: '4.05_link_bank', label: '4.05 Link Bank' },
              { key: '11.2_verify_high', label: '11.2 Verify >₦50k' },
              { key: '6.16_failed', label: '6.16 Failed' },
              { key: '6.09_empty', label: '6.09 Empty' },
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
        {/* 11.1 Wallet & 6.21 Payment released toast             */}
        {/* ===================================================== */}
        {(mode === '11.1_wallet' || mode === '6.21_toast') && (
          <View>
            {mode === '6.21_toast' && (
              <View style={styles.releasedToast}>
                <View style={styles.toastCheckCircle}>
                  <Check size={15} color="#2D6A2E" strokeWidth={2.8} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.toastTitle}>₦384 added to your wallet</Text>
                  <Text style={styles.toastSub}>
                    From Kubwa Green Hub · PET 3.2 kg
                  </Text>
                </View>
              </View>
            )}

            <Text style={styles.pageTitle}>Wallet</Text>

            {/* Green EcoSmart Wallet Card */}
            <View style={styles.walletGreenCard}>
              <View style={styles.walletTagRow}>
                <WalletIcon size={14} color="#A7D7A9" />
                <Text style={styles.walletTagText}>ECOSMART WALLET</Text>
              </View>

              <Text style={styles.walletCanCashOut}>You can cash out</Text>
              <Text style={styles.walletBigBalance}>₦1,624</Text>

              <View style={styles.walletSubBoxesRow}>
                <View style={styles.walletSubBox}>
                  <Text style={styles.walletSubLabel}>Earned this month</Text>
                  <Text style={styles.walletSubVal}>₦3,920</Text>
                  <Text style={styles.walletSubMeta}>From 4 pickups</Text>
                </View>
                <View style={styles.walletSubBox}>
                  <Text style={styles.walletSubLabel}>Recycled</Text>
                  <Text style={styles.walletSubVal}>9.6 kg</Text>
                  <Text style={styles.walletSubMeta}>Kept out of drains</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryGreenBtn}
              onPress={() => setMode('11.3_cashout')}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryGreenBtnText}>Cash out to my bank</Text>
            </TouchableOpacity>

            <Text style={styles.recentHeader}>RECENT</Text>

            <View style={styles.txListCard}>
              <View style={styles.txRow}>
                <View style={styles.txIconGreen}>
                  <ArrowDownLeft size={16} color="#2D6A2E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txTitle}>Kubwa Green Hub</Text>
                  <Text style={styles.txSub}>Today · 3.2 kg PET</Text>
                </View>
                <Text style={styles.txAmountGreen}>+₦384</Text>
              </View>

              <View style={styles.txDivider} />

              <View style={styles.txRow}>
                <View style={styles.txIconNeutral}>
                  <ArrowUpRight size={16} color="#475569" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txTitle}>Cash out to OPay</Text>
                  <Text style={styles.txSub}>Mon · ending 4421</Text>
                </View>
                <Text style={styles.txAmountDark}>−₦2,000</Text>
              </View>

              <View style={styles.txDivider} />

              <View style={styles.txRow}>
                <View style={styles.txIconGreen}>
                  <ArrowDownLeft size={16} color="#2D6A2E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txTitle}>Bwari Renew</Text>
                  <Text style={styles.txSub}>Sat · 6 kg cardboard</Text>
                </View>
                <Text style={styles.txAmountGreen}>+₦360</Text>
              </View>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 11.3 Cash out                                         */}
        {/* ===================================================== */}
        {mode === '11.3_cashout' && (
          <View>
            <TouchableOpacity
              style={styles.backRow}
              onPress={() => setMode('11.1_wallet')}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
              <Text style={styles.backText}>Cash out</Text>
            </TouchableOpacity>

            <View style={styles.canCashOutCard}>
              <Text style={styles.canCashOutLabel}>You can cash out</Text>
              <Text style={styles.canCashOutAmount}>₦1,624</Text>
            </View>

            <Text style={styles.fieldLabel}>Amount</Text>
            <View style={styles.amountInputBox}>
              <Text style={styles.currencyPrefix}>₦</Text>
              <TextInput
                style={styles.amountTextInput}
                value={cashOutAmount}
                onChangeText={setCashOutAmount}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              onPress={() => setCashOutAmount('1,624')}
              activeOpacity={0.7}
            >
              <Text style={styles.cashOutAllLink}>Cash out all</Text>
            </TouchableOpacity>

            <Text style={styles.microSectionLabel}>SEND TO</Text>
            <View style={styles.bankRecipientCard}>
              <View style={styles.bankIconCircle}>
                <Landmark size={18} color="#2563EB" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.bankNameTitle}>OPay · ending 4421</Text>
                <Text style={styles.bankOwnerSub}>MUSA ABDULLAHI</Text>
              </View>
              <TouchableOpacity onPress={() => setMode('4.05_link_bank')}>
                <Text style={styles.changeGreenText}>Change</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.pilotInfoBar}>
              <Clock size={14} color="#64748B" />
              <Text style={styles.pilotInfoText}>
                Usually arrives in a few minutes. Free during the pilot.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.askMinaBar}
              onPress={() => router.push('/mina' as any)}
              activeOpacity={0.8}
            >
              <Sparkles size={15} color="#2D6A2E" />
              <Text style={styles.askMinaLeft}>Questions about cash out?</Text>
              <Text style={styles.askMinaRight}>Ask Mina →</Text>
            </TouchableOpacity>

            <View style={{ marginTop: 90 }}>
              <TouchableOpacity
                style={styles.primaryGreenBtn}
                onPress={() => setMode('11.4_pending')}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryGreenBtnText}>
                  Cash out ₦{cashOutAmount || '1,624'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 11.4 Cash out pending bank confirmation               */}
        {/* ===================================================== */}
        {mode === '11.4_pending' && (
          <View>
            <TouchableOpacity
              style={styles.backRow}
              onPress={() => setMode('11.3_cashout')}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
              <Text style={styles.backText}>Cash out</Text>
            </TouchableOpacity>

            <View style={styles.pendingCard}>
              <View style={styles.pendingCheckCircle}>
                <Check size={24} color="#2D6A2E" strokeWidth={2.8} />
              </View>
              <Text style={styles.pendingTitle}>
                ₦{cashOutAmount || '1,624'} cash out pending
              </Text>
              <Text style={styles.pendingSub}>
                To OPay · ending 4421. Awaiting bank confirmation.
              </Text>
              <View style={styles.pendingNoteRow}>
                <Info size={13} color="#64748B" />
                <Text style={styles.pendingNoteText}>
                  Not received after 30 minutes? Contact support from Profile.
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 220 }}>
              <TouchableOpacity
                style={styles.primaryGreenBtn}
                onPress={() => setMode('11.1_wallet')}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryGreenBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 4.05 Cash out · Link bank                             */}
        {/* ===================================================== */}
        {mode === '4.05_link_bank' && (
          <View>
            <TouchableOpacity
              style={styles.backRow}
              onPress={() => setMode('11.3_cashout')}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
              <Text style={styles.backText}>Link your bank</Text>
            </TouchableOpacity>

            <Text style={styles.pageTitle}>Link your bank</Text>
            <Text style={styles.pageSubtitle}>
              Add the bank account that will receive cash outs from your EcoSmart wallet.
            </Text>

            <View style={styles.noBankLinkedBanner}>
              <Text style={styles.noBankLinkedTitle}>No bank linked yet</Text>
              <Text style={styles.noBankLinkedSub}>
                Your ₦1,624 stays in your wallet. Linking a bank does not start a cash out.
              </Text>
            </View>

            <Text style={styles.fieldLabel}>Bank</Text>
            <View style={styles.bankPillsWrap}>
              {BANKS.map((bank) => {
                const active = selectedBank === bank;
                return (
                  <TouchableOpacity
                    key={bank}
                    style={[styles.bankOptionPill, active && styles.bankOptionPillActive]}
                    onPress={() => setSelectedBank(bank)}
                  >
                    <Text
                      style={[
                        styles.bankOptionText,
                        active && styles.bankOptionTextActive,
                      ]}
                    >
                      {bank}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Account number</Text>
            <TextInput
              style={styles.standardInput}
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="Enter 10-digit account number"
              placeholderTextColor="#94A3B8"
            />
            <Text style={styles.inputHelperText}>
              10-digit account number · Masked after lookup
            </Text>

            <View style={styles.confirmedNameCard}>
              <View style={styles.confirmedBadgePill}>
                <Text style={styles.confirmedBadgeText}>Account name confirmed</Text>
              </View>
              <Text style={styles.confirmedOwnerName}>Musa Abdullahi</Text>
              <Text style={styles.confirmedOwnerHint}>
                Check that this is your account before linking it.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryGreenBtn, { marginTop: 22 }]}
              onPress={() => setMode('11.3_cashout')}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryGreenBtnText}>Link bank</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ===================================================== */}
        {/* 11.2 Verify for cash outs above ₦50,000               */}
        {/* ===================================================== */}
        {mode === '11.2_verify_high' && (
          <View>
            <TouchableOpacity
              style={styles.backRow}
              onPress={() => setMode('11.3_cashout')}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
              <Text style={styles.backText}>Cash out</Text>
            </TouchableOpacity>

            <Text style={styles.pageTitle}>Verify for higher cash outs</Text>
            <Text style={styles.pageSubtitle}>
              Needed once to cash out more than ₦50,000.
            </Text>

            <View style={styles.verifyWhiteCard}>
              <Text style={styles.fieldLabel}>Use NIN or BVN — not both</Text>
              <TextInput
                style={styles.standardInput}
                value={ninInput}
                onChangeText={setNinInput}
                keyboardType="number-pad"
              />
              <Text style={styles.inputHelperText}>
                Don't know your NIN? Dial *346# from the phone linked to it.
              </Text>

              <View style={styles.ninFoundBox}>
                <View style={styles.ninFoundRow}>
                  <Check size={15} color="#2D6A2E" strokeWidth={2.8} />
                  <Text style={styles.ninFoundTitle}>Found: MUSA ABDULLAHI</Text>
                </View>
                <Text style={styles.ninFoundSub}>Is this you?</Text>
              </View>
            </View>

            <View style={styles.privacyLockRow}>
              <Lock size={14} color="#64748B" />
              <Text style={styles.privacyLockText}>
                Only used to check it's you. Recyclers never see it.
              </Text>
            </View>

            <View style={{ marginTop: 150 }}>
              <TouchableOpacity
                style={styles.primaryGreenBtn}
                onPress={() => setMode('11.3_cashout')}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryGreenBtnText}>Yes, that's me</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 6.16 Cash out · Failed                                */}
        {/* ===================================================== */}
        {mode === '6.16_failed' && (
          <View>
            <TouchableOpacity
              style={styles.backRow}
              onPress={() => setMode('11.1_wallet')}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
              <Text style={styles.backText}>Wallet</Text>
            </TouchableOpacity>

            <Text style={styles.pageTitle}>Cash out</Text>
            <Text style={styles.pageSubtitle}>
              Your cash out couldn't be started.
            </Text>

            <View style={styles.lightGreenBalanceBox}>
              <Text style={styles.lightGreenBalLabel}>Available balance</Text>
              <Text style={styles.lightGreenBalAmount}>₦1,624</Text>
              <Text style={styles.lightGreenBalSub}>
                Available in Musa's EcoSmart wallet
              </Text>
            </View>

            <View style={styles.failedCard}>
              <View style={styles.failedIconCircle}>
                <AlertCircle size={22} color="#2D6A2E" />
              </View>
              <Text style={styles.failedCardTitle}>
                Your money is safe in your wallet
              </Text>
              <Text style={styles.failedCardDesc}>
                The ₦500 cash out to GTBank ••••1234 failed. Nothing was deducted, and no fee was charged.
              </Text>

              <TouchableOpacity
                style={[styles.primaryGreenBtn, { width: '100%', marginVertical: 14 }]}
                onPress={() => setMode('11.3_cashout')}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryGreenBtnText}>Retry cash out</Text>
              </TouchableOpacity>

              <View style={styles.failedBreakdown}>
                <View style={styles.failedBreakdownRow}>
                  <Text style={styles.failedBreakdownLabel}>Amount</Text>
                  <Text style={styles.failedBreakdownVal}>₦500</Text>
                </View>
                <View style={styles.failedBreakdownRow}>
                  <Text style={styles.failedBreakdownLabel}>Destination</Text>
                  <Text style={styles.failedBreakdownVal}>GTBank ••••1234</Text>
                </View>
                <View style={styles.failedBreakdownRow}>
                  <Text style={styles.failedBreakdownLabel}>Fee</Text>
                  <Text style={styles.failedBreakdownVal}>₦0 (Free during the pilot)</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.secondaryTextBtn}
              onPress={() => setMode('11.1_wallet')}
            >
              <Text style={styles.secondaryTextBtnLabel}>Back to wallet</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ===================================================== */}
        {/* 6.09 Wallet · Empty                                   */}
        {/* ===================================================== */}
        {mode === '6.09_empty' && (
          <View>
            <Text style={styles.pageTitle}>Wallet</Text>
            <Text style={styles.pageSubtitle}>
              Your recycling earnings, available to cash out.
            </Text>

            <View style={styles.lightGreenBalanceBox}>
              <Text style={styles.lightGreenBalLabel}>Available balance</Text>
              <Text style={styles.lightGreenBalAmount}>₦0</Text>
              <Text style={styles.lightGreenBalSub}>
                No recycling earnings yet
              </Text>
            </View>

            <View style={styles.disabledCashOutBtn}>
              <Text style={styles.disabledCashOutText}>Cash out to your bank</Text>
            </View>
            <Text style={styles.emptyCashOutHint}>
              Cash out becomes available when you have money in your wallet. Free during the pilot.
            </Text>

            <View style={styles.linkedBankMiniCard}>
              <Text style={styles.linkedBankMiniTitle}>OPay ••••4421</Text>
              <Text style={styles.linkedBankMiniSub}>Musa · Linked bank</Text>
            </View>

            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Transactions</Text>
            <View style={styles.noTxCard}>
              <View style={styles.pendingCheckCircle}>
                <WalletIcon size={20} color="#2D6A2E" />
              </View>
              <Text style={styles.noTxTitle}>No transactions yet</Text>
              <Text style={styles.noTxSub}>
                Complete your first recycling sale to receive payment in your EcoSmart wallet.
              </Text>
              <TouchableOpacity
                style={[styles.primaryGreenBtn, { width: '100%' }]}
                onPress={() => router.push('/scan')}
              >
                <Text style={styles.primaryGreenBtnText}>Scan an item</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <BottomNavBar activeTab="home" />
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
    lineHeight: 19,
    marginBottom: 14,
  },
  releasedToast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    marginBottom: 14,
  },
  toastCheckCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F1E12',
  },
  toastSub: {
    fontSize: 12,
    color: '#64748B',
  },
  walletGreenCard: {
    backgroundColor: '#1E5D2E',
    borderRadius: 20,
    padding: 18,
    marginTop: 8,
    marginBottom: 14,
  },
  walletTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  walletTagText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#A7D7A9',
    letterSpacing: 0.7,
  },
  walletCanCashOut: {
    fontSize: 12.5,
    color: '#DCFCE7',
  },
  walletBigBalance: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  walletSubBoxesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  walletSubBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    padding: 12,
  },
  walletSubLabel: {
    fontSize: 11.5,
    color: '#DCFCE7',
    marginBottom: 2,
  },
  walletSubVal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  walletSubMeta: {
    fontSize: 11,
    color: '#A7D7A9',
    marginTop: 2,
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
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryTextBtnLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  recentHeader: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
    marginTop: 18,
    marginBottom: 10,
  },
  txListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  txIconGreen: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txIconNeutral: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
  txSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  txAmountGreen: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#2D6A2E',
  },
  txAmountDark: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F1E12',
  },
  txDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },

  /* 11.3 Cash out */
  canCashOutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  canCashOutLabel: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 4,
  },
  canCashOutAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F1E12',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 8,
  },
  amountInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2D6A2E',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748B',
    marginRight: 8,
  },
  amountTextInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '800',
    color: '#0F1E12',
  },
  cashOutAllLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D6A2E',
    marginTop: 8,
    marginBottom: 16,
  },
  microSectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  bankRecipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  bankIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankNameTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
  bankOwnerSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  changeGreenText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  pilotInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  pilotInfoText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  askMinaBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EAF5EA',
    borderRadius: 12,
    padding: 12,
  },
  askMinaLeft: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F1E12',
    flex: 1,
  },
  askMinaRight: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },

  /* 11.4 Pending */
  pendingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 10,
  },
  pendingCheckCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  pendingTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 6,
    textAlign: 'center',
  },
  pendingSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 16,
  },
  pendingNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  pendingNoteText: {
    fontSize: 11.5,
    color: '#64748B',
    flex: 1,
  },

  /* 4.05 Link bank */
  noBankLinkedBanner: {
    backgroundColor: '#E4F3D8',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  noBankLinkedTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E5D2E',
    marginBottom: 2,
  },
  noBankLinkedSub: {
    fontSize: 12,
    color: '#2D6A2E',
    lineHeight: 17,
  },
  bankPillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bankOptionPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  bankOptionPillActive: {
    backgroundColor: '#E4F3D8',
    borderColor: '#2D6A2E',
    borderWidth: 1.5,
  },
  bankOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  bankOptionTextActive: {
    color: '#2D6A2E',
    fontWeight: '700',
  },
  standardInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F1E12',
  },
  inputHelperText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 6,
  },
  confirmedNameCard: {
    backgroundColor: '#EAF5EA',
    borderRadius: 14,
    padding: 14,
    marginTop: 14,
  },
  confirmedBadgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#C7E4B2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  confirmedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E5D2E',
  },
  confirmedOwnerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F1E12',
  },
  confirmedOwnerHint: {
    fontSize: 12,
    color: '#2D6A2E',
    marginTop: 2,
  },

  /* 11.2 Verify for high cash outs */
  verifyWhiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  ninFoundBox: {
    backgroundColor: '#EAF5EA',
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  ninFoundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ninFoundTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E5D2E',
  },
  ninFoundSub: {
    fontSize: 12,
    color: '#2D6A2E',
    marginTop: 2,
    marginLeft: 21,
  },
  privacyLockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privacyLockText: {
    fontSize: 12,
    color: '#64748B',
  },

  /* 6.16 Failed & 6.09 Empty */
  lightGreenBalanceBox: {
    backgroundColor: '#E4F3D8',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  lightGreenBalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D6A2E',
  },
  lightGreenBalAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1E5D2E',
    marginVertical: 4,
  },
  lightGreenBalSub: {
    fontSize: 12,
    color: '#2D6A2E',
  },
  failedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  failedIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  failedCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 6,
    textAlign: 'center',
  },
  failedCardDesc: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  failedBreakdown: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    gap: 6,
  },
  failedBreakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  failedBreakdownLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  failedBreakdownVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F1E12',
  },
  disabledCashOutBtn: {
    backgroundColor: '#F1F5F9',
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  disabledCashOutText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#94A3B8',
  },
  emptyCashOutHint: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginBottom: 14,
  },
  linkedBankMiniCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  linkedBankMiniTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F1E12',
  },
  linkedBankMiniSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  noTxCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  noTxTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 6,
  },
  noTxSub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
});
