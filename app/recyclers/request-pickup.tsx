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
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  ShieldCheck,
  Check,
} from 'lucide-react-native';

import { AppHeader } from '../../components/common/AppHeader';
import { TopGreenWave } from '../../components/common/TopGreenWave';
import { BottomNavBar } from '../../components/common/BottomNavBar';
import { LanguageBottomSheet } from '../../components/sheets/LanguageBottomSheet';

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
  const [step, setStep] = useState<'form' | 'waiting' | 'accepted'>('form');
  const [langSheetVisible, setLangSheetVisible] = useState(false);

  const handleSendRequest = () => {
    setStep('waiting');
    // Simulate recycler acceptance after 3 seconds for demonstration
    setTimeout(() => {
      setStep('accepted');
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header (White Nav Bar + Small Green Wave Strip) */}
      <AppHeader
        showBack
        onOpenLanguage={() => setLangSheetVisible(true)}
      />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {step === 'form' ? (
            /* =================== FORM STATE (G-F03) =================== */
            <View>
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
                  <TouchableOpacity activeOpacity={0.7}>
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

                {/* Day selector */}
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

                {/* Time slot selector */}
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
                onPress={() => alert('Mina AI says: "Keep your bottles dry and bagged. The driver will weigh on arrival!"')}
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
                <Text style={styles.submitBtnText}>Send request</Text>
              </TouchableOpacity>
            </View>
          ) : step === 'waiting' ? (
            /* =================== WAITING STATE (G-F04) =================== */
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

              {/* Simulation Banner */}
              <View style={styles.simNotice}>
                <Sparkles size={14} color="#15803D" />
                <Text style={styles.simNoticeText}>
                  Auto-accept simulation in progress (3s)...
                </Text>
              </View>

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

              {/* Cancel Request Button */}
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setStep('form')}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelBtnText}>Cancel request</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* =================== ACCEPTED STATE (G-F05) =================== */
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
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 40,
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
  simNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  simNoticeText: {
    fontSize: 11.5,
    color: '#15803D',
    fontWeight: '600',
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
  cancelBtn: {
    alignItems: 'center',
    paddingVertical: 12,
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
});
