import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Star,
  MapPin,
  MessageSquare,
  Phone,
  AlertTriangle,
  ZoomIn,
  Wallet,
  Sparkles,
  Scale,
  Maximize2,
} from 'lucide-react-native';

import { PickupStepper, PickupStage } from '../../components/pickup/PickupStepper';
import { BottomNavBar } from '../../components/common/BottomNavBar';
import { LiveDriverMap } from '../../components/pickup/LiveDriverMap';
import { AcceptAmountModal } from '../../components/pickup/AcceptAmountModal';
import { DisputeSheet } from '../../components/pickup/DisputeSheet';

export default function PickupDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const requestId = (params.id as string) || 'REQ-001';

  // Demo state: g_p01, g_p02, g_p03, g_p04, g_p05
  const [currentStep, setCurrentStep] = useState<'g_p01' | 'g_p02' | 'g_p03' | 'g_p04' | 'g_p05'>('g_p01');

  // Modals
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [disputeSheetVisible, setDisputeSheetVisible] = useState(false);
  const [scalePhotoEnlarged, setScalePhotoEnlarged] = useState(false);
  const [payoutCelebrated, setPayoutCelebrated] = useState(false);

  // Data
  const recyclerName = 'Kubwa Green Hub';
  const recyclerRating = 4.8;
  const initialWeightKg = 3.0;
  const actualWeightKg = 3.2;
  const agreedRate = 120;
  const finalPayout = Math.round(actualWeightKg * agreedRate); // ₦384
  const verificationCode = '4 8 2 7';

  // Map step to stepper stage
  const getStepperStage = (): PickupStage => {
    switch (currentStep) {
      case 'g_p01':
        return 'on_the_way';
      case 'g_p02':
        return 'arrived';
      case 'g_p03':
      case 'g_p04':
        return 'arrived';
      case 'g_p05':
        return payoutCelebrated ? 'paid' : 'agreed';
      default:
        return 'on_the_way';
    }
  };

  const handleConfirmAcceptance = () => {
    setAcceptModalVisible(false);
    setCurrentStep('g_p05');
  };

  const handleSimulatePayment = () => {
    setPayoutCelebrated(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 1. Top White Navigation Bar (Logo + Bell) */}
        <View style={styles.topWhiteNav}>
          <TouchableOpacity
            style={styles.logoRow}
            onPress={() => router.push('/home' as any)}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => alert('Notifications')}
            activeOpacity={0.7}
          >
            <Bell size={21} color="#0F1E12" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* 2. Small Green Tint Wave Strip directly under white nav */}
        <View style={styles.waveStrip} pointerEvents="none">
          <Svg width="100%" height={24} viewBox="0 0 400 24" preserveAspectRatio="none">
            <Path
              d="M 0,0 L 400,0 L 400,10 C 310,22 210,6 120,18 C 60,24 0,12 0,12 Z"
              fill="#E6F4D7"
            />
          </Svg>
        </View>

        {/* 3. Demo Switcher Bar (G-P01 to G-P05) */}
        <View style={styles.demoBar}>
          <Text style={styles.demoBarLabel}>Demo Step:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.demoScroll}>
            {(['g_p01', 'g_p02', 'g_p03', 'g_p04', 'g_p05'] as const).map((stepKey) => {
              const label =
                stepKey === 'g_p01'
                  ? 'G-P01 On the way'
                  : stepKey === 'g_p02'
                  ? 'G-P02 Arrived'
                  : stepKey === 'g_p03'
                  ? 'G-P03 Check amount'
                  : stepKey === 'g_p04'
                  ? 'G-P04 Modal'
                  : 'G-P05 Give code';
              const isSelected = currentStep === stepKey;

              return (
                <TouchableOpacity
                  key={stepKey}
                  style={[styles.demoPill, isSelected && styles.demoPillActive]}
                  onPress={() => {
                    setCurrentStep(stepKey);
                    if (stepKey === 'g_p04') {
                      setAcceptModalVisible(true);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.demoPillText, isSelected && styles.demoPillTextActive]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* 4. Request Header Bar */}
        <View style={styles.requestHeader}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.4} />
          </TouchableOpacity>
          <Text style={styles.requestTitle}>Your pickup {requestId}</Text>
        </View>

        {/* 5. 5-Stage Stepper Bar */}
        <View style={{ paddingHorizontal: 16 }}>
          <PickupStepper currentStage={getStepperStage()} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ============================================================== */}
          {/* STAGE 1: G-P01 · Recycler on the way                           */}
          {/* ============================================================== */}
          {currentStep === 'g_p01' && (
            <View>
              <View style={styles.headlineBox}>
                <Text style={styles.mainHeadline}>{recyclerName} is on the way</Text>
                <Text style={styles.subHeadline}>
                  About 8 minutes. Get your bottles ready by the gate.
                </Text>
              </View>

              {/* Live Vector Driver Map */}
              <LiveDriverMap distanceKm={0.6} etaMinutes={8} />

              {/* Recycler Profile Card */}
              <View style={styles.recyclerInfoCard}>
                <View style={styles.recyclerInfoRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardRecyclerName}>{recyclerName}</Text>
                    <View style={styles.cardMetaRow}>
                      <View style={styles.verifiedBadge}>
                        <Check size={11} color="#15803D" strokeWidth={3} />
                        <Text style={styles.verifiedBadgeText}>Verified</Text>
                      </View>
                      <Text style={styles.dot}>•</Text>
                      <View style={styles.ratingRow}>
                        <Star size={12} color="#EAB308" fill="#EAB308" />
                        <Text style={styles.ratingText}>{recyclerRating}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Quick Contact Buttons */}
                  <View style={styles.quickContactRow}>
                    <TouchableOpacity
                      style={styles.quickBtn}
                      activeOpacity={0.7}
                      onPress={() => router.push('/chat/kubwa-green-hub')}
                    >
                      <MessageSquare size={16} color="#0F1E12" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.quickBtn}
                      activeOpacity={0.7}
                      onPress={() => router.push('/call/kubwa-green-hub')}
                    >
                      <Phone size={16} color="#0F1E12" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Next Stage Simulation CTA */}
              <TouchableOpacity
                style={styles.nextStageBtn}
                onPress={() => setCurrentStep('g_p02')}
                activeOpacity={0.85}
              >
                <Text style={styles.nextStageBtnText}>
                  Simulate: Driver arrived at your gate →
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ============================================================== */}
          {/* STAGE 2: G-P02 · Recycler arrived                             */}
          {/* ============================================================== */}
          {currentStep === 'g_p02' && (
            <View>
              <View style={styles.headlineBox}>
                <Text style={styles.mainHeadline}>{recyclerName} has arrived</Text>
                <Text style={styles.subHeadline}>Here's what happens now.</Text>
              </View>

              {/* 3-Step Handover Protocol Card */}
              <View style={styles.protocolCard}>
                {/* Step 1 */}
                <View style={styles.protocolStepRow}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeNum}>1</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.actorRow}>
                      <Text style={styles.protocolStepTitle}>They weigh your bottles</Text>
                      <View style={styles.themTag}>
                        <Text style={styles.themTagText}>Them</Text>
                      </View>
                    </View>
                    <Text style={styles.protocolStepDesc}>Watch the scale</Text>
                  </View>
                </View>

                <View style={styles.protocolDivider} />

                {/* Step 2 */}
                <View style={styles.protocolStepRow}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeNum}>2</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.actorRow}>
                      <Text style={styles.protocolStepTitle}>Check the amount on your phone</Text>
                      <View style={styles.youTag}>
                        <Text style={styles.youTagText}>You</Text>
                      </View>
                    </View>
                    <Text style={styles.protocolStepDesc}>With their scale photo</Text>
                  </View>
                </View>

                <View style={styles.protocolDivider} />

                {/* Step 3 */}
                <View style={styles.protocolStepRow}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepBadgeNum}>3</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <View style={styles.actorRow}>
                      <Text style={styles.protocolStepTitle}>Accept, then give your code</Text>
                      <View style={styles.youTag}>
                        <Text style={styles.youTagText}>You</Text>
                      </View>
                    </View>
                    <Text style={styles.protocolStepDesc}>Only after you agree</Text>
                  </View>
                </View>
              </View>

              {/* Recycler Profile Card */}
              <View style={styles.recyclerInfoCard}>
                <View style={styles.recyclerInfoRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardRecyclerName}>{recyclerName}</Text>
                    <View style={styles.cardMetaRow}>
                      <View style={styles.verifiedBadge}>
                        <Check size={11} color="#15803D" strokeWidth={3} />
                        <Text style={styles.verifiedBadgeText}>Verified</Text>
                      </View>
                      <Text style={styles.dot}>•</Text>
                      <View style={styles.ratingRow}>
                        <Star size={12} color="#EAB308" fill="#EAB308" />
                        <Text style={styles.ratingText}>{recyclerRating}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.quickContactRow}>
                    <TouchableOpacity
                      style={styles.quickBtn}
                      activeOpacity={0.7}
                      onPress={() => router.push('/chat/kubwa-green-hub')}
                    >
                      <MessageSquare size={16} color="#0F1E12" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.quickBtn}
                      activeOpacity={0.7}
                      onPress={() => router.push('/call/kubwa-green-hub')}
                    >
                      <Phone size={16} color="#0F1E12" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Next Stage Simulation CTA */}
              <TouchableOpacity
                style={styles.nextStageBtn}
                onPress={() => setCurrentStep('g_p03')}
                activeOpacity={0.85}
              >
                <Text style={styles.nextStageBtnText}>
                  Simulate: Driver took scale photo & sent amount →
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ============================================================== */}
          {/* STAGE 3 & 4: G-P03 & G-P04 · Check final amount                */}
          {/* ============================================================== */}
          {(currentStep === 'g_p03' || currentStep === 'g_p04') && (
            <View>
              <View style={styles.headlineBox}>
                <Text style={styles.mainHeadline}>Check your final amount</Text>
                <Text style={styles.subHeadline}>
                  {recyclerName} weighed your bottles. Check the scale photo.
                </Text>
              </View>

              {/* Scale Photo Container Card (Light Green Card as in G-P03 screenshot) */}
              <TouchableOpacity
                style={styles.scalePhotoGreenCard}
                onPress={() => setScalePhotoEnlarged(true)}
                activeOpacity={0.85}
              >
                <View style={styles.scaleIconCircle}>
                  <Scale size={34} color="#2D6A2E" strokeWidth={1.8} />
                </View>
                <Text style={styles.scalePhotoGreenTitle}>
                  Scale photo · {actualWeightKg} kg
                </Text>
                <View style={styles.tapToEnlargeRow}>
                  <Maximize2 size={13} color="#2D6A2E" strokeWidth={2.4} />
                  <Text style={styles.tapToEnlargeText}>Tap to enlarge</Text>
                </View>
              </TouchableOpacity>

              {/* White Payout Calculation Card (as in G-P03 screenshot) */}
              <View style={styles.payoutCardWhite}>
                <Text style={styles.youGetTitle}>You get</Text>
                <Text style={styles.finalPayoutNumber}>₦{finalPayout}</Text>
                <Text style={styles.formulaLine}>
                  {actualWeightKg} kg PET × ₦{agreedRate}/kg (agreed)
                </Text>
              </View>

              {/* Escrow Guarantee Note */}
              <View style={styles.escrowSafeBox}>
                <ShieldCheck size={16} color="#15803D" />
                <Text style={styles.escrowSafeText}>
                  ₦450 is safe with EcoSmart. You'll see your code after you accept.
                </Text>
              </View>

              {/* Action Buttons */}
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.acceptPrimaryBtn}
                  onPress={() => setAcceptModalVisible(true)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.acceptPrimaryBtnText}>
                    Accept ₦{finalPayout}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.somethingWrongBtn}
                  onPress={() => setDisputeSheetVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.somethingWrongBtnText}>
                    Something's wrong
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ============================================================== */}
          {/* STAGE 5: G-P05 · Give your code                                */}
          {/* ============================================================== */}
          {currentStep === 'g_p05' && (
            <View>
              <View style={styles.headlineBox}>
                <View style={styles.acceptedTagRow}>
                  <CheckCircle2 size={16} color="#15803D" />
                  <Text style={styles.acceptedTagText}>
                    You accepted ₦{finalPayout} for {actualWeightKg} kg PET
                  </Text>
                </View>
              </View>

              {/* The 4-digit Code Box */}
              <View style={styles.codeCard}>
                <Text style={styles.codePromptText}>
                  Tell {recyclerName} this code
                </Text>

                <View style={styles.codeDigitBox}>
                  <Text style={styles.codeDigits}>{verificationCode}</Text>
                </View>

                <View style={styles.offlineRow}>
                  <Check size={12} color="#15803D" strokeWidth={3} />
                  <Text style={styles.offlineText}>
                    Works without network · also sent by SMS
                  </Text>
                </View>
              </View>

              {/* Payout Release Confirmation Card */}
              <View style={styles.releaseCard}>
                <Text style={styles.releaseLabel}>
                  Paid to you when they enter the code
                </Text>
                <Text style={styles.releaseAmount}>₦{finalPayout}</Text>
                <Text style={styles.releaseRule}>
                  Give the code yourself. EcoSmart never shares it.
                </Text>
              </View>

              {/* Payment Success Card (when simulated) */}
              {payoutCelebrated && (
                <View style={styles.celebrationCard}>
                  <View style={styles.sparkleCircle}>
                    <Sparkles size={24} color="#15803D" />
                  </View>
                  <Text style={styles.celebrationTitle}>₦{finalPayout} credited!</Text>
                  <Text style={styles.celebrationSub}>
                    Sent to your EcoSmart Wallet. Thank you for recycling!
                  </Text>
                  <TouchableOpacity
                    style={styles.walletBtn}
                    onPress={() => router.push('/pickup/receipt' as any)}
                    activeOpacity={0.85}
                  >
                    <Wallet size={16} color="#FFFFFF" />
                    <Text style={styles.walletBtnText}>View Receipt & Leave Review →</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Action Buttons */}
              <View style={styles.actionsContainer}>
                {!payoutCelebrated && (
                  <TouchableOpacity
                    style={styles.simulateCodeEnteredBtn}
                    onPress={handleSimulatePayment}
                    activeOpacity={0.85}
                  >
                    <Check size={16} color="#FFFFFF" strokeWidth={2.6} />
                    <Text style={styles.simulateCodeEnteredText}>
                      Simulate: Driver enters code 4827
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.somethingWrongBtn}
                  onPress={() => setDisputeSheetVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.somethingWrongBtnText}>
                    Something's wrong
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </View>

      <BottomNavBar activeTab="requests" />

      {/* G-P04 Modal Popup */}
      <AcceptAmountModal
        visible={acceptModalVisible}
        amount={finalPayout}
        weightKg={actualWeightKg}
        itemType="PET"
        ratePerKg={agreedRate}
        onAccept={handleConfirmAcceptance}
        onGoBack={() => setAcceptModalVisible(false)}
      />

      {/* Dispute Sheet ("Something's wrong") */}
      <DisputeSheet
        visible={disputeSheetVisible}
        onClose={() => setDisputeSheetVisible(false)}
        onSubmitIssue={(issue) => {
          alert(`Issue submitted: "${issue}". EcoSmart support has been alerted.`);
        }}
      />

      {/* Enlarged Scale Photo Modal */}
      <Modal
        visible={scalePhotoEnlarged}
        transparent
        animationType="fade"
        onRequestClose={() => setScalePhotoEnlarged(false)}
      >
        <View style={styles.enlargedModalContainer}>
          <TouchableOpacity
            style={styles.closeEnlargedBtn}
            onPress={() => setScalePhotoEnlarged(false)}
            activeOpacity={0.8}
          >
            <Text style={styles.closeEnlargedText}>Close ✕</Text>
          </TouchableOpacity>
          <Image
            source={require('../../assets/images/scale-photo.jpg')}
            style={styles.enlargedImage}
            resizeMode="contain"
          />
          <Text style={styles.enlargedCaption}>
            Kubwa Green Hub Scale Photo · 3.2 kg electronic reading
          </Text>
        </View>
      </Modal>
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
    backgroundColor: '#F4F6F8',
  },
  topWhiteNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandLogo: {
    width: 118,
    height: 32,
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveStrip: {
    width: '100%',
    height: 24,
    backgroundColor: 'transparent',
  },
  demoBar: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  demoBarLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
  },
  demoScroll: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  demoPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  demoPillActive: {
    backgroundColor: '#0F1E12',
    borderColor: '#0F1E12',
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  demoPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    gap: 10,
  },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1E12',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 40,
  },
  headlineBox: {
    marginBottom: 12,
  },
  mainHeadline: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F1E12',
    lineHeight: 28,
  },
  subHeadline: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 18,
  },
  recyclerInfoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  recyclerInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardRecyclerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F1E12',
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803D',
  },
  dot: {
    color: '#CBD5E1',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  quickContactRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  nextStageBtn: {
    backgroundColor: '#0F1E12',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  nextStageBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  protocolCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  protocolStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EAF5EA',
    borderWidth: 1.5,
    borderColor: '#C8E6C9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeNum: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2D6A2E',
  },
  actorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  protocolStepTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F1E12',
    flex: 1,
  },
  themTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  themTagText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  youTag: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  youTagText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#15803D',
  },
  protocolStepDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  protocolDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  scalePhotoGreenCard: {
    backgroundColor: '#EAF5EA',
    borderRadius: 18,
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  scaleIconCircle: {
    marginBottom: 8,
  },
  scalePhotoGreenTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2D6A2E',
    marginBottom: 6,
  },
  tapToEnlargeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  tapToEnlargeText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  payoutCardWhite: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  youGetTitle: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  finalPayoutNumber: {
    fontSize: 40,
    fontWeight: '900',
    color: '#0F1E12',
    marginVertical: 4,
  },
  formulaLine: {
    fontSize: 13,
    color: '#64748B',
  },
  escrowSafeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginBottom: 16,
  },
  escrowSafeText: {
    fontSize: 12,
    color: '#065F46',
    flex: 1,
    lineHeight: 16,
  },
  actionsContainer: {
    gap: 10,
    marginBottom: 20,
  },
  acceptPrimaryBtn: {
    backgroundColor: '#0F1E12',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptPrimaryBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  somethingWrongBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  somethingWrongBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  acceptedTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  acceptedTagText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
  codeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  codePromptText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 12,
  },
  codeDigitBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginBottom: 12,
  },
  codeDigits: {
    fontSize: 38,
    fontWeight: '900',
    color: '#0F1E12',
    letterSpacing: 10,
  },
  offlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  offlineText: {
    fontSize: 11.5,
    color: '#64748B',
  },
  releaseCard: {
    backgroundColor: '#F1F8EE',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D5E8C8',
    alignItems: 'center',
    marginBottom: 16,
  },
  releaseLabel: {
    fontSize: 12,
    color: '#2D6A2E',
    fontWeight: '600',
  },
  releaseAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2D6A2E',
    marginVertical: 4,
  },
  releaseRule: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
  },
  simulateCodeEnteredBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#15803D',
    paddingVertical: 14,
    borderRadius: 14,
  },
  simulateCodeEnteredText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  celebrationCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    marginBottom: 14,
  },
  sparkleCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  celebrationTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#065F46',
  },
  celebrationSub: {
    fontSize: 12.5,
    color: '#047857',
    textAlign: 'center',
    marginVertical: 6,
  },
  walletBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#065F46',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginTop: 6,
  },
  walletBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  enlargedModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closeEnlargedBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  closeEnlargedText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  enlargedImage: {
    width: '100%',
    height: 300,
  },
  enlargedCaption: {
    color: '#E2E8F0',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 14,
  },
});
