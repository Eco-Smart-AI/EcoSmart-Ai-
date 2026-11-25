import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  WifiOff,
  RotateCcw,
  ArrowRight,
} from 'lucide-react-native';

import { AppHeader } from '../../components/common/AppHeader';
import { BottomNavBar } from '../../components/common/BottomNavBar';
import { LanguageBottomSheet } from '../../components/sheets/LanguageBottomSheet';

type RequestStep = 'form' | 'send_failed' | 'waiting' | 'match_sent' | 'no_response' | 'accepted';

export default function RequestPickupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const recyclerName = (params.name as string) || 'Bwari Renew';
  const weightKg = Number(params.weight) || 3;
  const ratePerKg = Number(params.rate) || 150;
  const estimatedPayout = Math.round(weightKg * ratePerKg);

  const [address, setAddress] = useState('12 Byazhin Road, Kubwa');
  const [landmark, setLandmark] = useState('Blue gate opposite the pharmacy');
  const [day, setDay] = useState<'today' | 'tomorrow'>('today');
  const [timeSlot, setTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [step, setStep] = useState<RequestStep>('form');
  const [cancelSheetVisible, setCancelSheetVisible] = useState(false);
  const [langSheetVisible, setLangSheetVisible] = useState(false);

  const handleSendRequest = () => {
    setStep('waiting');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        showBack
        onOpenLanguage={() => setLangSheetVisible(true)}
      />

      {/* Top Demo State Switcher */}
      <View style={styles.demoBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoScroll}
        >
          <Text style={styles.demoBarLabel}>Request State:</Text>
          {(
            [
              { key: 'form', label: '04 Form' },
              { key: 'send_failed', label: '6.13 Saved draft' },
              { key: 'waiting', label: 'Waiting' },
              { key: 'match_sent', label: '1.09 Match sent' },
              { key: 'no_response', label: '1.11 No reply' },
              { key: 'accepted', label: 'Accepted' },
            ] as const
          ).map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.demoPill, step === item.key && styles.demoPillActive]}
              onPress={() => setStep(item.key)}
            >
              <Text
                style={[
                  styles.demoPillText,
                  step === item.key && styles.demoPillTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.demoPill, cancelSheetVisible && styles.demoPillActive]}
            onPress={() => setCancelSheetVisible(true)}
          >
            <Text style={[styles.demoPillText, cancelSheetVisible && styles.demoPillTextActive]}>
              Cancel sheet
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ===================================================== */}
          {/* 1. FORM STATE (G-F03) & SEND FAILED BANNER            */}
          {/* ===================================================== */}
          {(step === 'form' || step === 'send_failed') && (
            <View>
              {step === 'send_failed' && (
                <View style={styles.sendFailedBanner}>
                  <View style={styles.sendFailedIconBox}>
                    <WifiOff size={18} color="#DC2626" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.sendFailedTitle}>Couldn't send your request</Text>
                    <Text style={styles.sendFailedSub}>
                      Check your internet connection. Your address and time are saved below.
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.retryPillBtn}
                    onPress={() => setStep('waiting')}
                    activeOpacity={0.8}
                  >
                    <RotateCcw size={13} color="#FFFFFF" />
                    <Text style={styles.retryPillBtnText}>Retry</Text>
                  </TouchableOpacity>
                </View>
              )}

              <Text style={styles.screenTitle}>Request pickup</Text>
              <Text style={styles.recyclerSub}>{recyclerName}</Text>

              {/* Material Pill */}
              <View style={styles.materialCard}>
                <Text style={styles.materialText}>PET bottles · ~{weightKg} kg</Text>
                <Text style={styles.materialMeta}>Verified waste</Text>
              </View>

              {/* Address card */}
              <View style={styles.fieldCard}>
                <View style={styles.fieldHeader}>
                  <Text style={styles.fieldLabel}>Pickup address</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setAddress(
                        address.includes('Byazhin')
                          ? 'Phase 4, Gado Nasko Road, Kubwa'
                          : '12 Byazhin Road, Kubwa'
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={styles.changeActionText}>Change</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.addressRow}>
                  <MapPin size={16} color="#15803D" />
                  <Text style={styles.addressText}>{address}</Text>
                </View>
                <Text style={styles.addressPrivacyText}>
                  Only shown to the recycler after they accept
                </Text>

                {/* Landmark Input */}
                <Text style={styles.inputLabel}>
                  Landmark (helps them find you)
                </Text>
                <TextInput
                  style={styles.textInput}
                  value={landmark}
                  onChangeText={setLandmark}
                  placeholder="e.g. Blue gate opposite the pharmacy"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* When Selection */}
              <View style={styles.fieldCard}>
                <Text style={styles.fieldLabel}>When?</Text>

                <View style={styles.optionRow}>
                  <TouchableOpacity
                    style={[
                      styles.dayButton,
                      day === 'today' && styles.dayButtonActive,
                    ]}
                    onPress={() => setDay('today')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        day === 'today' && styles.dayButtonTextActive,
                      ]}
                    >
                      Today
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.dayButton,
                      day === 'tomorrow' && styles.dayButtonActive,
                    ]}
                    onPress={() => setDay('tomorrow')}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dayButtonText,
                        day === 'tomorrow' && styles.dayButtonTextActive,
                      ]}
                    >
                      Tomorrow
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.slotRow}>
                  {(['morning', 'afternoon', 'evening'] as const).map((slot) => {
                    const label =
                      slot === 'morning'
                        ? 'Morning'
                        : slot === 'afternoon'
                        ? 'Afternoon'
                        : 'Evening';
                    const isSelected = timeSlot === slot;
                    return (
                      <TouchableOpacity
                        key={slot}
                        style={[
                          styles.slotButton,
                          isSelected && styles.slotButtonActive,
                        ]}
                        onPress={() => setTimeSlot(slot)}
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.slotButtonText,
                            isSelected && styles.slotButtonTextActive,
                          ]}
                        >
                          {label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Payout Calculation Box */}
              <View style={styles.payoutCard}>
                <Text style={styles.payoutLabel}>You'll get about</Text>
                <Text style={styles.payoutAmount}>₦{estimatedPayout}</Text>
                <Text style={styles.payoutFormula}>
                  ~{weightKg} kg × ₦{ratePerKg} per kg
                </Text>
              </View>

              {/* Mina Promo link */}
              <TouchableOpacity
                style={styles.minaPromoRow}
                activeOpacity={0.7}
                onPress={() => router.push('/mina' as any)}
              >
                <Sparkles size={16} color="#2D6A2E" />
                <Text style={styles.minaPromoText}>
                  Questions about pickups? Ask Mina →
                </Text>
              </TouchableOpacity>

              {/* Send Request Button */}
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSendRequest}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>
                  {step === 'send_failed' ? 'Try sending again' : 'Send request'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ===================================================== */}
          {/* 2. WAITING STATE (G-F04)                              */}
          {/* ===================================================== */}
          {step === 'waiting' && (
            <View>
              <View style={styles.trackingHeader}>
                <Text style={styles.requestIdText}>Your request REQ-001</Text>
                <View style={styles.statusBadgeWaiting}>
                  <Clock size={13} color="#92400E" />
                  <Text style={styles.statusBadgeWaitingText}>Waiting for response</Text>
                </View>
              </View>

              <Text style={styles.trackingTitle}>
                Waiting for {recyclerName}
              </Text>
              <Text style={styles.trackingSub}>
                They usually reply in about 15 minutes. We'll send you an SMS.
              </Text>

              {/* What happens next steps */}
              <View style={styles.stepsCard}>
                <Text style={styles.stepsCardTitle}>What happens next</Text>

                <View style={styles.stepItem}>
                  <View style={styles.stepNumberCircle}>
                    <Text style={styles.stepNumberText}>1</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepTitle}>They accept</Text>
                    <Text style={styles.stepDesc}>
                      Money for your waste is set aside with EcoSmart
                    </Text>
                  </View>
                </View>

                <View style={styles.stepItem}>
                  <View style={styles.stepNumberCircle}>
                    <Text style={styles.stepNumberText}>2</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepTitle}>They come and weigh it</Text>
                    <Text style={styles.stepDesc}>
                      You check the scale and agree the amount
                    </Text>
                  </View>
                </View>

                <View style={styles.stepItem}>
                  <View style={styles.stepNumberCircle}>
                    <Text style={styles.stepNumberText}>3</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.stepTitle}>You get paid</Text>
                    <Text style={styles.stepDesc}>
                      Into your EcoSmart wallet straight away
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => setStep('accepted')}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>Simulate: Recycler accepts →</Text>
              </TouchableOpacity>

              {/* Cancel Request Button triggers Confirmation Sheet */}
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setCancelSheetVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Cancel request</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ===================================================== */}
          {/* 2B. 1.09 Let EcoSmart match me · Sent                 */}
          {/* ===================================================== */}
          {step === 'match_sent' && (
            <View
              style={{
                backgroundColor: '#E6F4D7',
                borderRadius: 24,
                paddingVertical: 56,
                paddingHorizontal: 24,
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: 460,
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: '#2D6A2E',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 18,
                }}
              >
                <Sparkles size={28} color="#FFFFFF" />
              </View>
              <Text
                style={{
                  fontSize: 21,
                  fontWeight: '900',
                  color: '#0F1E12',
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                Finding a recycler for you
              </Text>
              <Text
                style={{
                  fontSize: 13.5,
                  color: '#334155',
                  textAlign: 'center',
                  lineHeight: 20,
                  marginBottom: 16,
                }}
              >
                We sent your request to 4 recyclers near you who pick up about {weightKg} kg. The first to accept takes it.
              </Text>
              <Text
                style={{
                  fontSize: 12.5,
                  fontWeight: '700',
                  color: '#2D6A2E',
                  marginBottom: 32,
                }}
              >
                We'll tell you as soon as one accepts
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor: '#2D6A2E',
                  paddingVertical: 13,
                  paddingHorizontal: 24,
                  borderRadius: 24,
                  marginBottom: 14,
                }}
                onPress={() => setStep('accepted')}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 13.5, fontWeight: '700' }}>
                  Simulate: Match found →
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setStep('form')}>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '700',
                    color: '#2D6A2E',
                    textDecorationLine: 'underline',
                  }}
                >
                  Withdraw request
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ===================================================== */}
          {/* 3. NO RESPONSE STATE (Household · State · No response)*/}
          {/* ===================================================== */}
          {step === 'no_response' && (
            <View>
              <View style={styles.trackingHeader}>
                <Text style={styles.requestIdText}>Your request REQ-001</Text>
                <View style={styles.statusBadgeWaiting}>
                  <AlertCircle size={13} color="#B45309" />
                  <Text style={styles.statusBadgeWaitingText}>No response yet</Text>
                </View>
              </View>

              <Text style={styles.trackingTitle}>
                No reply from {recyclerName}
              </Text>
              <Text style={styles.trackingSub}>
                It's been over an hour. You can let EcoSmart match you with the first available recycler near Kubwa.
              </Text>

              <View style={styles.autoMatchHighlightCard}>
                <View style={styles.autoMatchTopRow}>
                  <View style={styles.sparkleCircle}>
                    <Sparkles size={20} color="#2D6A2E" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.autoMatchTitle}>Let EcoSmart match me</Text>
                    <Text style={styles.autoMatchDesc}>
                      We send your ~{weightKg} kg PET request to 4 verified recyclers near Kubwa. First to accept comes today.
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.autoMatchActionBtn}
                  onPress={() => setStep('accepted')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.autoMatchActionBtnText}>Match me now</Text>
                  <ArrowRight size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.secondaryChoiceBtn}
                onPress={() => router.push('/recyclers' as any)}
                activeOpacity={0.75}
              >
                <Text style={styles.secondaryChoiceBtnText}>Choose another recycler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setCancelSheetVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Cancel request</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ===================================================== */}
          {/* 4. ACCEPTED STATE (G-F05)                             */}
          {/* ===================================================== */}
          {step === 'accepted' && (
            <View>
              <View style={styles.trackingHeader}>
                <Text style={styles.requestIdText}>Your request REQ-001</Text>
                <View style={styles.statusBadgeAccepted}>
                  <CheckCircle2 size={13} color="#15803D" />
                  <Text style={styles.statusBadgeAcceptedText}>Accepted</Text>
                </View>
              </View>

              {/* Stage Progress Pills */}
              <View style={styles.stageProgressBar}>
                <View style={[styles.stagePill, styles.stagePillActive]}>
                  <Text style={styles.stagePillTextActive}>Accepted</Text>
                </View>
                <View style={styles.stagePill}>
                  <Text style={styles.stagePillText}>On the way</Text>
                </View>
                <View style={styles.stagePill}>
                  <Text style={styles.stagePillText}>Arrived</Text>
                </View>
                <View style={styles.stagePill}>
                  <Text style={styles.stagePillText}>Agreed</Text>
                </View>
                <View style={styles.stagePill}>
                  <Text style={styles.stagePillText}>Paid</Text>
                </View>
              </View>

              <Text style={styles.trackingTitle}>
                {recyclerName} accepted!
              </Text>
              <Text style={styles.trackingSub}>
                Estimated arrival: Today between 9:00 AM – 11:30 AM
              </Text>

              {/* Escrow Guarantee Card */}
              <View style={styles.escrowCard}>
                <ShieldCheck size={20} color="#15803D" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.escrowTitle}>₦{estimatedPayout} reserved</Text>
                  <Text style={styles.escrowSub}>
                    Locked in EcoSmart Escrow until pickup verification
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={() => router.push('/pickup/REQ-001' as any)}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>Track pickup & Handover →</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.homeBtn, { marginTop: 10, backgroundColor: '#F1F5F9' }]}
                onPress={() => router.push('/home' as any)}
                activeOpacity={0.85}
              >
                <Text style={[styles.homeBtnText, { color: '#0F1E12' }]}>Return to Home</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      <BottomNavBar activeTab="requests" />

      {/* ===================================================== */}
      {/* Cancel Request Confirmation Bottom Sheet              */}
      {/* ===================================================== */}
      <Modal
        visible={cancelSheetVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCancelSheetVisible(false)}
      >
        <View style={styles.sheetBackdrop}>
          <View style={styles.cancelSheetCard}>
            <View style={styles.sheetHandle} />
            <Text style={styles.cancelSheetTitle}>Cancel this pickup request?</Text>
            <Text style={styles.cancelSheetDesc}>
              {recyclerName} hasn't accepted yet, so there is no fee to cancel. Your scanned waste items will stay saved.
            </Text>

            <TouchableOpacity
              style={styles.confirmCancelRedBtn}
              onPress={() => {
                setCancelSheetVisible(false);
                setStep('form');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.confirmCancelRedBtnText}>Yes, cancel request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.keepWaitingBtn}
              onPress={() => setCancelSheetVisible(false)}
              activeOpacity={0.75}
            >
              <Text style={styles.keepWaitingBtnText}>Keep waiting</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  },
  demoBar: {
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
  },
  demoScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 6,
  },
  demoBarLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    marginRight: 4,
  },
  demoPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  demoPillActive: {
    backgroundColor: '#2D6A2E',
    borderColor: '#2D6A2E',
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  demoPillTextActive: {
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
  },
  sendFailedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  sendFailedIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendFailedTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#991B1B',
  },
  sendFailedSub: {
    fontSize: 11.5,
    color: '#B91C1C',
    marginTop: 2,
    lineHeight: 16,
  },
  retryPillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  retryPillBtnText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F1E12',
  },
  recyclerSub: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
  },
  materialCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  materialText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F1E12',
  },
  materialMeta: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '700',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  fieldCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  fieldHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F1E12',
  },
  changeActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  addressPrivacyText: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F1E12',
  },
  optionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  dayButtonActive: {
    borderColor: '#0F1E12',
    backgroundColor: '#0F1E12',
  },
  dayButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
  },
  slotRow: {
    flexDirection: 'row',
    gap: 8,
  },
  slotButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  slotButtonActive: {
    borderColor: '#0F1E12',
    backgroundColor: '#0F1E12',
  },
  slotButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  slotButtonTextActive: {
    color: '#FFFFFF',
  },
  payoutCard: {
    backgroundColor: '#F1F8EE',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D5E8C8',
    alignItems: 'center',
    marginBottom: 14,
  },
  payoutLabel: {
    fontSize: 12,
    color: '#2D6A2E',
    fontWeight: '600',
  },
  payoutAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2D6A2E',
    marginVertical: 4,
  },
  payoutFormula: {
    fontSize: 12,
    color: '#64748B',
  },
  minaPromoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  minaPromoText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  submitBtn: {
    backgroundColor: '#0F1E12',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestIdText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  statusBadgeWaiting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeWaitingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#92400E',
  },
  statusBadgeAccepted: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusBadgeAcceptedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  trackingTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F1E12',
    marginBottom: 4,
  },
  trackingSub: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 16,
  },
  stepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  stepsCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 14,
  },
  stepItem: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  stepNumberCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F8EE',
    borderWidth: 1,
    borderColor: '#D5E8C8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2D6A2E',
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
  },
  stepDesc: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  autoMatchHighlightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#C7E4B2',
    marginBottom: 14,
  },
  autoMatchTopRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  sparkleCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EAF5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoMatchTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 4,
  },
  autoMatchDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  autoMatchActionBtn: {
    backgroundColor: '#2D6A2E',
    paddingVertical: 13,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  autoMatchActionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  secondaryChoiceBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryChoiceBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B91C1C',
  },
  stageProgressBar: {
    flexDirection: 'row',
    gap: 4,
    marginVertical: 12,
  },
  stagePill: {
    flex: 1,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    alignItems: 'center',
  },
  stagePillActive: {
    backgroundColor: '#2D6A2E',
  },
  stagePillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  stagePillTextActive: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  escrowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ECFDF5',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 20,
  },
  escrowTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#065F46',
  },
  escrowSub: {
    fontSize: 11.5,
    color: '#047857',
    marginTop: 2,
  },
  homeBtn: {
    backgroundColor: '#0F1E12',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  homeBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  sheetBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 30, 18, 0.45)',
    justifyContent: 'flex-end',
  },
  cancelSheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    paddingBottom: 32,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 16,
  },
  cancelSheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 8,
  },
  cancelSheetDesc: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 20,
  },
  confirmCancelRedBtn: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
  },
  confirmCancelRedBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  keepWaitingBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  keepWaitingBtnText: {
    color: '#0F1E12',
    fontSize: 14,
    fontWeight: '700',
  },
});
