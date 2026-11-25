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
  Clock,
  Wallet,
  AlertTriangle,
  HelpCircle,
  Camera,
  Check,
  ShieldCheck,
  Phone,
  MessageSquare,
  TrendingDown,
  Info,
} from 'lucide-react-native';
import TopGreenWave from '../../components/common/TopGreenWave';
import RecyclerBottomNavBar from '../../components/common/RecyclerBottomNavBar';

type WhatIfScenario =
  | 'no_show_timer'
  | 'refunded_wallet'
  | 'top_up_difference'
  | 'propose_rate'
  | 'report_problem'
  | 'cancel_modal'
  | 'timeout_question';

export default function RecyclerPickupWhatIfsScreen() {
  const router = useRouter();
  const [scenario, setScenario] = useState<WhatIfScenario>('no_show_timer');

  // Rate proposal state
  const [rateReason, setRateReason] = useState<'wet' | 'mixed' | 'quality'>('wet');
  const [newRate, setNewRate] = useState('100');
  const [rateMessage, setRateMessage] = useState('Some bottles had water inside');

  // Report problem state
  const [problemReason, setProblemReason] = useState<string>('photo_mismatch');

  const scenarios: { id: WhatIfScenario; label: string }[] = [
    { id: 'no_show_timer', label: '1. Waiting Timer' },
    { id: 'refunded_wallet', label: '2. Refunded No-show' },
    { id: 'top_up_difference', label: '3. Top Up Heavier' },
    { id: 'propose_rate', label: '4. Propose Rate' },
    { id: 'report_problem', label: '5. Report Problem' },
    { id: 'cancel_modal', label: '6. Cancel Modal' },
    { id: 'timeout_question', label: '7. Pickup Timeout' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TopGreenWave />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/recycler/pickup' as any)}
          style={styles.headerBackBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>
            {scenario === 'report_problem'
              ? 'Report a problem'
              : scenario === 'propose_rate'
              ? 'Propose a new rate'
              : 'Pickup · Musa A.'}
          </Text>
          <Text style={styles.headerSub}>REQ-001</Text>
        </View>
      </View>

      {/* Interactive Scenario Switcher Pills */}
      <View style={styles.demoPillsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.demoPillsScroll}>
          {scenarios.map((sc) => (
            <TouchableOpacity
              key={sc.id}
              style={[styles.demoPill, scenario === sc.id && styles.demoPillActive]}
              onPress={() => setScenario(sc.id)}
            >
              <Text style={[styles.demoPillText, scenario === sc.id && styles.demoPillTextActive]}>
                {sc.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ================= SCENARIO 1: WAITING FOR MUSA (NO-SHOW COUNTDOWN) ================= */}
        {scenario === 'no_show_timer' && (
          <View style={styles.contentWrap}>
            <View style={styles.clockCircleWrap}>
              <Clock size={36} color="#D97706" />
            </View>
            <Text style={styles.mainTitle}>Waiting for Musa</Text>
            <Text style={styles.mainSub}>
              Stay nearby. If Musa doesn't come, you can cancel and get your money back.
            </Text>

            <View style={styles.timerBox}>
              <Text style={styles.timerDigits}>09:12</Text>
              <Text style={styles.timerSubText}>left to wait</Text>
            </View>

            <View style={styles.checklistCard}>
              <Text style={styles.checklistTitle}>Before you can cancel</Text>
              
              <View style={styles.checkItem}>
                <Check size={16} color="#2E7D32" />
                <Text style={styles.checkItemText}>You're at the pickup area</Text>
              </View>

              <View style={styles.checkItem}>
                <Check size={16} color="#2E7D32" />
                <Text style={styles.checkItemText}>You called or messaged Musa</Text>
              </View>

              <View style={styles.checkItem}>
                <Clock size={16} color="#9CA3AF" />
                <Text style={[styles.checkItemText, { color: '#9CA3AF' }]}>15 minutes have passed</Text>
              </View>
            </View>

            <View style={styles.contactRow}>
              <TouchableOpacity
                style={styles.contactBtn}
                onPress={() => router.push('/recycler/call' as any)}
              >
                <Phone size={18} color="#2E7D32" />
                <Text style={styles.contactBtnText}>Call Musa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactBtn}
                onPress={() => router.push('/recycler/chat' as any)}
              >
                <MessageSquare size={18} color="#2E7D32" />
                <Text style={styles.contactBtnText}>Message</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.dangerActionBtn}
              onPress={() => setScenario('refunded_wallet')}
            >
              <Text style={styles.dangerActionText}>Cancel · household not here</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= SCENARIO 2: REFUNDED NO-SHOW ================= */}
        {scenario === 'refunded_wallet' && (
          <View style={styles.contentWrap}>
            <View style={styles.walletSuccessWrap}>
              <Wallet size={36} color="#2E7D32" />
            </View>
            <Text style={styles.mainTitle}>₦450 is back in your wallet</Text>
            <Text style={styles.mainSub}>
              Musa didn't come, so this pickup was cancelled. It won't affect your rating.
            </Text>

            <View style={styles.infoSummaryCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Reason</Text>
                <Text style={styles.infoValue}>Household not here</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>You waited</Text>
                <Text style={styles.infoValue}>15 min</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 20 }]}
              onPress={() => router.push('/recycler/requests' as any)}
            >
              <Text style={styles.primaryBtnText}>Back to requests</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= SCENARIO 3: TOP UP DIFFERENCE (HEAVIER) ================= */}
        {scenario === 'top_up_difference' && (
          <View style={styles.contentWrap}>
            <View style={styles.sheetBox}>
              <Text style={styles.sheetTitle}>Add ₦150 to continue</Text>
              <Text style={styles.sheetSub}>
                The waste weighs more than expected. Add the difference before Musa sees the amount.
              </Text>

              <View style={styles.amountNeededBox}>
                <Text style={styles.neededLabel}>Still needed</Text>
                <Text style={styles.neededAmount}>₦150</Text>
              </View>

              <View style={styles.breakdownRow}>
                <View>
                  <Text style={styles.breakdownLabel}>New total (5.0 kg)</Text>
                  <Text style={styles.breakdownVal}>₦600</Text>
                </View>
                <View>
                  <Text style={styles.breakdownLabel}>Already set aside</Text>
                  <Text style={styles.breakdownVal}>₦450</Text>
                </View>
              </View>

              <View style={styles.payMethodWrap}>
                <Wallet size={18} color="#2E7D32" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.payMethodTitle}>Bank transfer</Text>
                  <Text style={styles.payMethodSub}>Or change method</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primaryBtn, { marginTop: 18 }]}
                onPress={() => router.push('/recycler/pickup' as any)}
              >
                <Text style={styles.primaryBtnText}>Add ₦150</Text>
              </TouchableOpacity>

              <Text style={styles.subtextNotice}>
                Musa keeps his waste until the full amount is covered.
              </Text>
            </View>
          </View>
        )}

        {/* ================= SCENARIO 4: PROPOSE A NEW RATE ================= */}
        {scenario === 'propose_rate' && (
          <View style={styles.contentWrap}>
            <Text style={styles.mainTitle}>Propose a new rate</Text>
            <Text style={styles.mainSub}>Musa must agree before the price changes.</Text>

            <Text style={styles.fieldHeading}>Why?</Text>
            <View style={styles.tagsRow}>
              {[
                { id: 'wet', label: 'Wet or dirty' },
                { id: 'mixed', label: 'Mixed materials' },
                { id: 'quality', label: 'Lower quality' },
              ].map((tag) => (
                <TouchableOpacity
                  key={tag.id}
                  style={[styles.rateTag, rateReason === tag.id && styles.rateTagActive]}
                  onPress={() => setRateReason(tag.id as any)}
                >
                  <Text style={[styles.rateTagText, rateReason === tag.id && styles.rateTagTextActive]}>
                    {rateReason === tag.id ? '✓ ' : ''}{tag.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldHeading}>New rate</Text>
            <View style={styles.rateInputRow}>
              <Text style={styles.rateCurrency}>₦</Text>
              <TextInput
                style={styles.rateTextInput}
                keyboardType="numeric"
                value={newRate}
                onChangeText={setNewRate}
              />
              <Text style={styles.rateUnit}>per kg</Text>
            </View>
            <Text style={styles.rateSubInfo}>Agreed rate was ₦120 per kg</Text>

            <View style={styles.musaCalculationCard}>
              <Text style={styles.calcTitle}>Musa will see</Text>
              <View style={styles.priceWithDiscountRow}>
                <Text style={styles.newPrice}>₦320</Text>
                <Text style={styles.oldStrikethrough}>₦384</Text>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>₦64 less</Text>
                </View>
              </View>
              <Text style={styles.rateCalcFormula}>3.2 kg × ₦100 per kg</Text>
              <View style={styles.infoRowDivider} />
              <Text style={styles.rateCancelNote}>
                If Musa says no, there's no deal and your ₦450 comes back.
              </Text>
            </View>

            <Text style={styles.fieldHeading}>Message to Musa (optional)</Text>
            <TextInput
              style={styles.messageInputBox}
              value={rateMessage}
              onChangeText={setRateMessage}
              placeholder="e.g. Some bottles had water inside"
              multiline
            />

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 16 }]}
              onPress={() => router.push('/recycler/pickup' as any)}
            >
              <Text style={styles.primaryBtnText}>Send to Musa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelTextBtn}
              onPress={() => router.push('/recycler/pickup' as any)}
            >
              <Text style={styles.cancelTextBtnText}>Keep ₦120/kg</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= SCENARIO 5: REPORT A PROBLEM (DISPUTE) ================= */}
        {scenario === 'report_problem' && (
          <View style={styles.contentWrap}>
            <Text style={styles.mainTitle}>What's wrong?</Text>
            <Text style={styles.mainSub}>The money stays set aside until EcoSmart support checks.</Text>

            <View style={styles.problemOptionsList}>
              {[
                { id: 'photo_mismatch', label: 'Not the waste in the photo' },
                { id: 'unfair_amount', label: "Musa won't accept a fair amount" },
                { id: 'no_code', label: "Musa won't give the code" },
                { id: 'other', label: 'Something else' },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.problemOption, problemReason === opt.id && styles.problemOptionActive]}
                  onPress={() => setProblemReason(opt.id)}
                >
                  <Text style={styles.problemOptionText}>{opt.label}</Text>
                  <View style={[styles.radioCircle, problemReason === opt.id && styles.radioCircleSelected]}>
                    {problemReason === opt.id && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.photoUploadBtn}>
              <Camera size={20} color="#2E7D32" />
              <Text style={styles.photoUploadText}>Add a photo (optional)</Text>
            </TouchableOpacity>

            <View style={styles.reassuranceBox}>
              <ShieldCheck size={20} color="#2E7D32" />
              <Text style={styles.reassuranceText}>
                Stay calm. Support will look at the photos, chat and amounts and decide fairly.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 24 }]}
              onPress={() => router.push('/recycler/requests' as any)}
            >
              <Text style={styles.primaryBtnText}>Send to support</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= SCENARIO 6: CANCEL THIS PICKUP? MODAL ================= */}
        {scenario === 'cancel_modal' && (
          <View style={styles.contentWrap}>
            <View style={styles.modalCard}>
              <Text style={styles.modalHeading}>Cancel this pickup?</Text>

              <View style={styles.consequenceBox}>
                <View style={styles.consequenceRow}>
                  <Wallet size={20} color="#2E7D32" />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.consequenceTitle}>₦450 comes back to your wallet</Text>
                    <Text style={styles.consequenceSub}>Straight away</Text>
                  </View>
                </View>

                <View style={[styles.consequenceRow, { marginTop: 14 }]}>
                  <TrendingDown size={20} color="#D97706" />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.consequenceTitle}>Your reliability score goes down</Text>
                    <Text style={styles.consequenceSub}>Musa is already waiting for you</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => router.push('/recycler/pickup' as any)}
              >
                <Text style={styles.primaryBtnText}>Keep pickup</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelPickupDangerBtn}
                onPress={() => router.push('/recycler/requests' as any)}
              >
                <Text style={styles.cancelPickupDangerText}>Cancel pickup</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ================= SCENARIO 7: TIMEOUT QUESTION ================= */}
        {scenario === 'timeout_question' && (
          <View style={styles.contentWrap}>
            <View style={styles.helpCircleWrap}>
              <HelpCircle size={40} color="#2E7D32" />
            </View>
            <Text style={styles.mainTitle}>Did the pickup with Musa happen?</Text>
            <Text style={styles.mainSub}>
              The pickup time ended 2 hours ago and nothing was confirmed.
            </Text>

            <View style={styles.timeoutInfoBox}>
              <View style={styles.timeoutRow}>
                <Text style={styles.timeoutLabel}>Pickup time</Text>
                <Text style={styles.timeoutVal}>Today, 10:00–11:00</Text>
              </View>
              <View style={styles.infoDivider} />
              <View style={styles.timeoutRow}>
                <Text style={styles.timeoutLabel}>Set aside</Text>
                <Text style={styles.timeoutVal}>₦450</Text>
              </View>
            </View>

            <View style={styles.timeoutTipRow}>
              <Info size={14} color="#6B7280" />
              <Text style={styles.timeoutTipText}>
                If no one answers in 24 hours, the pickup closes and your ₦450 comes back.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 24 }]}
              onPress={() => router.push('/recycler/pickup' as any)}
            >
              <Text style={styles.primaryBtnText}>Yes, I collected the waste</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineActionBtn}
              onPress={() => setScenario('refunded_wallet')}
            >
              <Text style={styles.outlineActionText}>No, it didn't happen</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Recycler 5-tab Bottom Navigation */}
      <RecyclerBottomNavBar activeTab="Requests" />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerBackBtn: {
    padding: 6,
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  headerSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
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
    paddingBottom: 100,
  },
  contentWrap: {
    gap: 14,
  },
  clockCircleWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  walletSuccessWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  helpCircleWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginTop: 12,
  },
  mainSub: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  timerBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    alignItems: 'center',
    marginTop: 8,
  },
  timerDigits: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
  },
  timerSubText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  checklistTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  checkItemText: {
    fontSize: 13,
    color: '#374151',
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  contactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 10,
  },
  contactBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  dangerActionBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  dangerActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  infoSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  primaryBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sheetBox: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  sheetSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  amountNeededBox: {
    backgroundColor: '#FEF3C7',
    padding: 14,
    borderRadius: 10,
    marginTop: 14,
    alignItems: 'center',
  },
  neededLabel: {
    fontSize: 12,
    color: '#92400E',
  },
  neededAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#92400E',
    marginTop: 2,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 8,
  },
  breakdownLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  breakdownVal: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  payMethodWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  payMethodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  payMethodSub: {
    fontSize: 12,
    color: '#6B7280',
  },
  subtextNotice: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 10,
  },
  fieldHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  rateTag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  rateTagActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  rateTagText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  rateTagTextActive: {
    color: '#2E7D32',
    fontWeight: '700',
  },
  rateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  rateCurrency: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginRight: 6,
  },
  rateTextInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  rateUnit: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  rateSubInfo: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  musaCalculationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginTop: 14,
  },
  calcTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceWithDiscountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  newPrice: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  oldStrikethrough: {
    fontSize: 16,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  rateCalcFormula: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 4,
  },
  infoRowDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  rateCancelNote: {
    fontSize: 12,
    color: '#6B7280',
  },
  messageInputBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    fontSize: 14,
    color: '#111827',
    minHeight: 70,
    textAlignVertical: 'top',
    marginTop: 8,
  },
  cancelTextBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelTextBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  problemOptionsList: {
    gap: 8,
    marginTop: 10,
  },
  problemOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    borderRadius: 10,
  },
  problemOptionActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#F8FDF7',
  },
  problemOptionText: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
    flex: 1,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  radioCircleSelected: {
    borderColor: '#2E7D32',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2E7D32',
  },
  photoUploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2E7D32',
    borderStyle: 'dashed',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  photoUploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  reassuranceBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#E8F5E9',
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  reassuranceText: {
    fontSize: 12,
    color: '#166534',
    flex: 1,
    lineHeight: 18,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    marginTop: 20,
  },
  modalHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  consequenceBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginVertical: 18,
  },
  consequenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  consequenceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  consequenceSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  cancelPickupDangerBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  cancelPickupDangerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  timeoutInfoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginTop: 10,
  },
  timeoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  timeoutLabel: {
    fontSize: 13,
    color: '#6B7280',
  },
  timeoutVal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  timeoutTipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  timeoutTipText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  outlineActionBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  outlineActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
});
