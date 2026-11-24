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
import {
  AlertTriangle,
  Clock,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
  CheckCircle,
  Camera,
  MessageSquare,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomNavBar } from '../../components/common/BottomNavBar';

type NegotiationDemoState = 'G-B01' | 'G-B02' | 'G-B03' | 'G-B04' | 'G-B05';

export default function NegotiationScreen() {
  const router = useRouter();

  // State switcher for G-B01, G-B02, G-B03, G-B04, G-B05
  const [activeScreen, setActiveScreen] = useState<NegotiationDemoState>('G-B01');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const handleAction = (message: string) => {
    setActionFeedback(message);
    setTimeout(() => {
      setActionFeedback(null);
    }, 3500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader showBack={true} rightAction="bell" />

      {/* Demo Switcher */}
      <View style={styles.demoBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoScroll}
        >
          <Text style={styles.demoTitle}>Handover State:</Text>
          {(
            [
              { key: 'G-B01', label: 'G-B01 New Rate' },
              { key: 'G-B02', label: 'G-B02 Unclear Photo' },
              { key: 'G-B03', label: 'G-B03 No Reply' },
              { key: 'G-B04', label: 'G-B04 Handover?' },
              { key: 'G-B05', label: 'G-B05 Dispute Sent' },
            ] as const
          ).map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.demoPill, activeScreen === item.key && styles.demoPillActive]}
              onPress={() => {
                setActiveScreen(item.key);
                setActionFeedback(null);
              }}
            >
              <Text
                style={[
                  styles.demoPillText,
                  activeScreen === item.key && styles.demoPillTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Toast confirmation */}
        {actionFeedback && (
          <View style={styles.toastBanner}>
            <CheckCircle size={18} color="#2D6A2E" />
            <Text style={styles.toastText}>{actionFeedback}</Text>
          </View>
        )}

        {/* ============================================================ */}
        {/* G-B01: New Rate Offered                                      */}
        {/* ============================================================ */}
        {activeScreen === 'G-B01' && (
          <View>
            <View style={styles.screenHeader}>
              <Text style={styles.headerContext}>Your pickup</Text>
              <Text style={styles.reqCode}>REQ-001</Text>
            </View>

            <Text style={styles.screenTitle}>Kubwa Green Hub offered a new price</Text>
            <Text style={styles.screenSubtitle}>
              You decide. If you say no, you keep your bottles.
            </Text>

            {/* Price Adjustment Card */}
            <View style={styles.priceCard}>
              <Text style={styles.priceLabel}>You would get</Text>
              <View style={styles.priceRow}>
                <Text style={styles.newPrice}>₦320</Text>
                <Text style={styles.oldPrice}>₦384</Text>
                <View style={styles.diffPill}>
                  <Text style={styles.diffPillText}>₦64 less</Text>
                </View>
              </View>
              <Text style={styles.calcSubtext}>3.2 kg × ₦100 per kg (was ₦120)</Text>
            </View>

            {/* Reason Card */}
            <View style={styles.reasonCard}>
              <View style={styles.reasonHeader}>
                <AlertTriangle size={18} color="#D97706" />
                <Text style={styles.reasonTitle}>Their reason: Wet or dirty</Text>
              </View>
              <Text style={styles.reasonQuote}>“Some bottles had water inside”</Text>
            </View>

            {/* Escrow safety note */}
            <View style={styles.escrowNote}>
              <ShieldCheck size={16} color="#2D6A2E" />
              <Text style={styles.escrowNoteText}>
                ₦450 remains safe in EcoSmart escrow until you approve or decline.
              </Text>
            </View>

            {/* CTAs */}
            <TouchableOpacity
              style={styles.primaryAcceptBtn}
              onPress={() =>
                handleAction('New rate accepted (₦320). Generating your handover code…')
              }
              activeOpacity={0.8}
            >
              <Text style={styles.primaryAcceptBtnText}>Accept ₦320</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryRejectBtn}
              onPress={() =>
                handleAction('Offer declined. Your bottles remain yours with zero penalty.')
              }
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryRejectBtnText}>No, keep my bottles</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================ */}
        {/* G-B02: Scale Photo Unclear                                   */}
        {/* ============================================================ */}
        {activeScreen === 'G-B02' && (
          <View>
            <View style={styles.screenHeader}>
              <Text style={styles.headerContext}>Your pickup</Text>
              <Text style={styles.reqCode}>REQ-001</Text>
            </View>

            <View style={styles.noReplyIconWrap}>
              <Camera size={32} color="#D97706" />
            </View>

            <Text style={styles.screenTitle}>Waiting for a clearer scale photo</Text>
            <Text style={styles.screenSubtitle}>
              You asked Kubwa Green Hub to retake the scale photo so you can read the weight clearly.
            </Text>

            <View style={styles.reasonCard}>
              <View style={styles.reasonHeader}>
                <Clock size={16} color="#B45309" />
                <Text style={styles.reasonTitle}>Don't give your 4-digit code yet</Text>
              </View>
              <Text style={styles.reasonQuote}>
                Wait until the new scale photo shows on your screen and you agree to the final Naira amount.
              </Text>
            </View>

            <View style={styles.escrowNote}>
              <ShieldCheck size={16} color="#2D6A2E" />
              <Text style={styles.escrowNoteText}>
                ₦450 is still held safely by EcoSmart while they retake the photo.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.primaryAcceptBtn}
              onPress={() => router.push('/pickup/REQ-001' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryAcceptBtnText}>Simulate: New photo received →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryRejectBtn}
              onPress={() => router.push('/chat/kubwa-green-hub' as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryRejectBtnText}>Message recycler</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================ */}
        {/* G-B03: No Reply                                              */}
        {/* ============================================================ */}
        {activeScreen === 'G-B03' && (
          <View>
            <View style={styles.screenHeader}>
              <Text style={styles.headerContext}>Your request</Text>
              <Text style={styles.reqCode}>REQ-001</Text>
            </View>

            <View style={styles.noReplyIconWrap}>
              <Clock size={36} color="#D97706" />
            </View>

            <Text style={styles.screenTitle}>No reply from Kubwa Green Hub</Text>
            <Text style={styles.screenSubtitle}>
              It's been over an hour. Try another recycler, or let EcoSmart find one for you.
            </Text>

            {/* Option 1: EcoSmart Auto Match */}
            <View style={styles.matchCard}>
              <View style={styles.matchCardTop}>
                <View style={styles.sparkleIconWrap}>
                  <Sparkles size={20} color="#2D6A2E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.matchTitle}>Let EcoSmart match me</Text>
                  <Text style={styles.matchDesc}>
                    We send your request to recyclers who buy PET near Kubwa. The first to accept gets it.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.matchCtaBtn}
                onPress={() =>
                  handleAction('EcoSmart matching activated! Searching nearest verified recyclers…')
                }
                activeOpacity={0.8}
              >
                <Text style={styles.matchCtaBtnText}>Match me</Text>
                <ArrowRight size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Option 2: Choose another recycler */}
            <TouchableOpacity
              style={styles.chooseOtherBtn}
              onPress={() => router.push('/recyclers')}
              activeOpacity={0.7}
            >
              <Text style={styles.chooseOtherBtnText}>Choose another recycler</Text>
            </TouchableOpacity>

            {/* Option 3: Cancel Request */}
            <TouchableOpacity
              style={styles.cancelRequestBtn}
              onPress={() => handleAction('Request REQ-001 cancelled. No fees charged.')}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelRequestBtnText}>Cancel request</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================ */}
        {/* G-B04: Handover Check ("Did you give your bottles?")         */}
        {/* ============================================================ */}
        {activeScreen === 'G-B04' && (
          <View>
            <View style={styles.screenHeader}>
              <Text style={styles.headerContext}>Your pickup</Text>
              <Text style={styles.reqCode}>REQ-001</Text>
            </View>

            <View style={styles.questionIconWrap}>
              <HelpCircle size={36} color="#2563EB" />
            </View>

            <Text style={styles.screenTitle}>Did you give your bottles to Kubwa Green Hub?</Text>
            <Text style={styles.screenSubtitle}>
              You accepted ₦384 two hours ago, but the payment hasn't been completed.
            </Text>

            {/* Summary card */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>You accepted</Text>
                <Text style={styles.summaryValBold}>₦384</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Safe with EcoSmart</Text>
                <Text style={styles.summaryValGreen}>₦450</Text>
              </View>
            </View>

            {/* Guarantee note */}
            <View style={styles.guaranteeNote}>
              <ShieldCheck size={20} color="#2D6A2E" />
              <Text style={styles.guaranteeText}>
                If you say yes, the money stays safe and our support team will sort it out with you.
              </Text>
            </View>

            {/* Options */}
            <TouchableOpacity
              style={styles.primaryAcceptBtn}
              onPress={() => setActiveScreen('G-B05')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryAcceptBtnText}>Yes, I handed them over</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryRejectBtn}
              onPress={() =>
                handleAction('Understood. Escrow returned to pool and pickup closed.')
              }
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryRejectBtnText}>No, I still have them</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ============================================================ */}
        {/* G-B05: Dispute Sent & Escrow Locked                          */}
        {/* ============================================================ */}
        {activeScreen === 'G-B05' && (
          <View>
            <View style={styles.screenHeader}>
              <Text style={styles.headerContext}>Dispute · REQ-001</Text>
              <View style={styles.inReviewPill}>
                <Text style={styles.inReviewPillText}>In review</Text>
              </View>
            </View>

            <Text style={styles.screenTitle}>We're looking into your pickup</Text>
            <Text style={styles.screenSubtitle}>
              ₦450 is locked safely with EcoSmart while our team checks the scale photo and pickup log.
            </Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>1. Problem reported</Text>
                <Text style={styles.summaryValGreen}>Done ✓</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>2. EcoSmart reviewing photos</Text>
                <Text style={styles.summaryValBold}>Within 24h</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>3. Money paid to your wallet</Text>
                <Text style={styles.summaryLabel}>Up to ₦450</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryAcceptBtn}
              onPress={() => router.push('/reports' as any)}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryAcceptBtnText}>View resolution in My reports →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryRejectBtn}
              onPress={() => router.push('/mina' as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryRejectBtnText}>Ask Mina a question</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNavBar activeTab="requests" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  demoBar: {
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingVertical: 8,
  },
  demoScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 6,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
    marginRight: 4,
  },
  demoPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  demoPillActive: {
    backgroundColor: '#2D6A2E',
    borderColor: '#2D6A2E',
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  demoPillTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 32,
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#166534',
    flex: 1,
  },
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerContext: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  reqCode: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
  },
  inReviewPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  inReviewPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F1E12',
    lineHeight: 28,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 20,
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priceLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  newPrice: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F1E12',
  },
  oldPrice: {
    fontSize: 20,
    fontWeight: '600',
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  diffPill: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  diffPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  calcSubtext: {
    fontSize: 13,
    color: '#64748B',
  },
  reasonCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  reasonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  reasonTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
  },
  reasonQuote: {
    fontSize: 13.5,
    color: '#B45309',
    paddingLeft: 24,
    lineHeight: 19,
  },
  escrowNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EAF5EA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 22,
  },
  escrowNoteText: {
    fontSize: 12,
    color: '#2D6A2E',
    fontWeight: '500',
    flex: 1,
  },
  primaryAcceptBtn: {
    backgroundColor: '#2D6A2E',
    paddingVertical: 15,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D6A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  primaryAcceptBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryRejectBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingVertical: 14,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  secondaryRejectBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  noReplyIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  questionIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#C7E4B2',
    shadowColor: '#2D6A2E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  matchCardTop: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  sparkleIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 4,
  },
  matchDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  matchCtaBtn: {
    backgroundColor: '#2D6A2E',
    paddingVertical: 12,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  matchCtaBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chooseOtherBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2D6A2E',
    paddingVertical: 14,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  chooseOtherBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  cancelRequestBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelRequestBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  summaryValBold: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F1E12',
  },
  summaryValGreen: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D6A2E',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  guaranteeNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EAF5EA',
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
  },
  guaranteeText: {
    fontSize: 13,
    color: '#2D6A2E',
    fontWeight: '500',
    lineHeight: 18,
    flex: 1,
  },
});
