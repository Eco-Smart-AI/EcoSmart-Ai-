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
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  ShieldCheck,
  Star,
  MessageSquare,
  Phone,
  AlertTriangle,
  Wallet,
  Sparkles,
  Scale,
  Maximize2,
  Camera,
  Lock,
  WifiOff,
  X,
} from 'lucide-react-native';

import { PickupStepper, PickupStage } from '../../components/pickup/PickupStepper';
import { BottomNavBar } from '../../components/common/BottomNavBar';
import { LiveDriverMap } from '../../components/pickup/LiveDriverMap';
import { AcceptAmountModal } from '../../components/pickup/AcceptAmountModal';
import { DisputeSheet } from '../../components/pickup/DisputeSheet';

type PickupDemoStep =
  | 'g_p01'
  | 'g_p02'
  | 'g_p03'
  | 'g_p04'
  | 'g_p05'
  | '3.04_scale_photo'
  | '3.06_somethings_wrong'
  | '3.08_on_hold'
  | '3.07_code_offline'
  | '3.09_paying_you';

export default function PickupDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const requestId = (params.id as string) || 'REQ-001';

  const [currentStep, setCurrentStep] = useState<PickupDemoStep>('g_p01');

  // Modals
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [disputeSheetVisible, setDisputeSheetVisible] = useState(false);
  const [scalePhotoEnlarged, setScalePhotoEnlarged] = useState(false);
  const [payoutCelebrated, setPayoutCelebrated] = useState(false);

  // 3.06 Something's wrong state
  const [disputeReason, setDisputeReason] = useState<'weight' | 'rate' | 'other'>('weight');
  const [disputeNote, setDisputeNote] = useState(
    "The scale wasn't set to zero before weighing."
  );

  // Data
  const recyclerName = 'Kubwa Green Hub';
  const recyclerRating = 4.8;
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
      case 'g_p03':
      case 'g_p04':
      case '3.04_scale_photo':
      case '3.06_somethings_wrong':
      case '3.08_on_hold':
        return 'arrived';
      case 'g_p05':
      case '3.07_code_offline':
        return payoutCelebrated ? 'paid' : 'agreed';
      case '3.09_paying_you':
        return 'paid';
      default:
        return 'on_the_way';
    }
  };

  const handleConfirmAcceptance = () => {
    setAcceptModalVisible(false);
    setCurrentStep('g_p05');
  };

  const handleSimulatePayment = () => {
    setCurrentStep('3.09_paying_you');
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        currentStep === '3.09_paying_you' && { backgroundColor: '#E6F4D7' },
      ]}
    >
      <View
        style={[
          styles.container,
          currentStep === '3.09_paying_you' && { backgroundColor: '#E6F4D7' },
        ]}
      >
        {/* Top White Navigation Bar + Wave Strip (hidden on full-screen 3.09 Paying you) */}
        {currentStep !== '3.09_paying_you' && (
          <>
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
                onPress={() => router.push('/profile' as any)}
                activeOpacity={0.7}
              >
                <Bell size={21} color="#0F1E12" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={styles.waveStrip} pointerEvents="none">
              <Svg width="100%" height={24} viewBox="0 0 400 24" preserveAspectRatio="none">
                <Path
                  d="M 0,0 L 400,0 L 400,10 C 310,22 210,6 120,18 C 60,24 0,12 0,12 Z"
                  fill="#E6F4D7"
                />
              </Svg>
            </View>
          </>
        )}

        {/* Demo Switcher Bar (Screens 08 & 09) */}
        <View style={styles.demoBar}>
          <Text style={styles.demoBarLabel}>Screen 08/09:</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.demoScroll}
          >
            {(
              [
                { key: 'g_p01', label: '08 On the way' },
                { key: 'g_p02', label: '08 Arrived' },
                { key: 'g_p03', label: '09 Check amount' },
                { key: 'g_p04', label: '09 Accept pop-up' },
                { key: 'g_p05', label: '09 Give code' },
                { key: '3.04_scale_photo', label: '3.04 Scale photo' },
                { key: '3.06_somethings_wrong', label: "3.06 What's wrong" },
                { key: '3.08_on_hold', label: '3.08 On hold' },
                { key: '3.07_code_offline', label: '3.07 Code · Offline' },
                { key: '3.09_paying_you', label: '3.09 Paying you' },
              ] as const
            ).map((item) => {
              const isSelected = currentStep === item.key;
              return (
                <TouchableOpacity
                  key={item.key}
                  style={[styles.demoPill, isSelected && styles.demoPillActive]}
                  onPress={() => {
                    setCurrentStep(item.key);
                    if (item.key === 'g_p04') {
                      setAcceptModalVisible(true);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.demoPillText, isSelected && styles.demoPillTextActive]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ============================================================== */}
        {/* 3.09 Payment · Processing (Full Light-Green Screen)             */}
        {/* ============================================================== */}
        {currentStep === '3.09_paying_you' ? (
          <View style={styles.payingFullScreen}>
            <View style={styles.payingWalletCircle}>
              <Wallet size={28} color="#FFFFFF" />
            </View>
            <Text style={styles.payingHeadline}>Paying you</Text>
            <Text style={styles.payingSub}>
              Code confirmed. Kubwa Green Hub's money is moving to your wallet.
            </Text>
            <Text style={styles.payingBigAmount}>₦{finalPayout}</Text>
            <Text style={styles.payingRedirectHint}>Taking you to your receipt...</Text>
            <ActivityIndicator size="small" color="#2D6A2E" style={{ marginTop: 12 }} />

            <TouchableOpacity
              style={styles.openReceiptNowBtn}
              onPress={() => router.push('/pickup/receipt' as any)}
              activeOpacity={0.85}
            >
              <Text style={styles.openReceiptNowText}>Open receipt now →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Request Header Bar */}
            <View style={styles.requestHeader}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.4} />
              </TouchableOpacity>
              <Text style={styles.requestTitle}>
                {currentStep === '3.04_scale_photo' ||
                currentStep === '3.06_somethings_wrong' ||
                currentStep === '3.08_on_hold' ||
                currentStep === '3.07_code_offline'
                  ? 'Handover'
                  : `Your pickup ${requestId}`}
              </Text>
            </View>

            {/* 5-Stage Stepper Bar (shown on standard G-P01..G-P05 stages) */}
            {(currentStep === 'g_p01' ||
              currentStep === 'g_p02' ||
              currentStep === 'g_p03' ||
              currentStep === 'g_p04' ||
              currentStep === 'g_p05') && (
              <View style={{ paddingHorizontal: 16 }}>
                <PickupStepper currentStage={getStepperStage()} />
              </View>
            )}

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

                  <LiveDriverMap distanceKm={0.6} etaMinutes={8} />

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
              {/* STAGE 2: G-P02 · Recycler arrived                              */}
              {/* ============================================================== */}
              {currentStep === 'g_p02' && (
                <View>
                  <View style={styles.headlineBox}>
                    <Text style={styles.mainHeadline}>{recyclerName} has arrived</Text>
                    <Text style={styles.subHeadline}>Here's what happens now.</Text>
                  </View>

                  <View style={styles.protocolCard}>
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

                    <View style={styles.protocolStepRow}>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepBadgeNum}>2</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.actorRow}>
                          <Text style={styles.protocolStepTitle}>
                            Check the amount on your phone
                          </Text>
                          <View style={styles.youTag}>
                            <Text style={styles.youTagText}>You</Text>
                          </View>
                        </View>
                        <Text style={styles.protocolStepDesc}>With their scale photo</Text>
                      </View>
                    </View>

                    <View style={styles.protocolDivider} />

                    <View style={styles.protocolStepRow}>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepBadgeNum}>3</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.actorRow}>
                          <Text style={styles.protocolStepTitle}>
                            Accept, then give your code
                          </Text>
                          <View style={styles.youTag}>
                            <Text style={styles.youTagText}>You</Text>
                          </View>
                        </View>
                        <Text style={styles.protocolStepDesc}>Only after you agree</Text>
                      </View>
                    </View>
                  </View>

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

                  <TouchableOpacity
                    style={styles.scalePhotoGreenCard}
                    onPress={() => setCurrentStep('3.04_scale_photo')}
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

                  <View style={styles.payoutCardWhite}>
                    <Text style={styles.youGetTitle}>You get</Text>
                    <Text style={styles.finalPayoutNumber}>₦{finalPayout}</Text>
                    <Text style={styles.formulaLine}>
                      {actualWeightKg} kg PET × ₦{agreedRate}/kg (agreed)
                    </Text>
                  </View>

                  <View style={styles.escrowSafeBox}>
                    <ShieldCheck size={16} color="#15803D" />
                    <Text style={styles.escrowSafeText}>
                      ₦450 is safe with EcoSmart. You'll see your code after you accept.
                    </Text>
                  </View>

                  <View style={styles.actionsContainer}>
                    <TouchableOpacity
                      style={styles.acceptPrimaryBtn}
                      onPress={() => setAcceptModalVisible(true)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.acceptPrimaryBtnText}>Accept ₦{finalPayout}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.somethingWrongBtn}
                      onPress={() => setCurrentStep('3.06_somethings_wrong')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.somethingWrongBtnText}>Something's wrong</Text>
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

                  <View style={styles.codeCard}>
                    <Text style={styles.codePromptText}>Tell {recyclerName} this code</Text>

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

                  <View style={styles.releaseCard}>
                    <Text style={styles.releaseLabel}>
                      Paid to you when they enter the code
                    </Text>
                    <Text style={styles.releaseAmount}>₦{finalPayout}</Text>
                    <Text style={styles.releaseRule}>
                      Give the code yourself. EcoSmart never shares it.
                    </Text>
                  </View>

                  <View style={styles.actionsContainer}>
                    <TouchableOpacity
                      style={styles.simulateCodeEnteredBtn}
                      onPress={handleSimulatePayment}
                      activeOpacity={0.85}
                    >
                      <Check size={16} color="#FFFFFF" strokeWidth={2.6} />
                      <Text style={styles.simulateCodeEnteredText}>
                        Simulate: Driver enters code 4827 →
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.somethingWrongBtn}
                      onPress={() => setCurrentStep('3.06_somethings_wrong')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.somethingWrongBtnText}>Something's wrong</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* ============================================================== */}
              {/* 3.04 Handover · Scale photo enlarged                           */}
              {/* ============================================================== */}
              {currentStep === '3.04_scale_photo' && (
                <View>
                  <View style={styles.headlineBox}>
                    <Text style={styles.mainHeadline}>Scale photo</Text>
                    <Text style={styles.subHeadline}>Check the reading before you accept.</Text>
                  </View>

                  <View style={styles.scaleEnlargedCard}>
                    <Image
                      source={require('../../assets/images/scale-photo.jpg')}
                      style={styles.scaleEnlargedPhoto}
                      resizeMode="cover"
                    />
                    <View style={styles.scaleEnlargedFooter}>
                      <View>
                        <Text style={styles.scaleEnlargedTitle}>
                          Recycler scale · 3.2 kg PET
                        </Text>
                        <Text style={styles.scaleEnlargedSub}>
                          Scale photo from this handover · {recyclerName}
                        </Text>
                      </View>
                      <Check size={18} color="#15803D" />
                    </View>
                  </View>

                  <View style={styles.measuredWeightBox}>
                    <View style={styles.measuredWeightRow}>
                      <Text style={styles.measuredWeightLabel}>Measured PET weight</Text>
                      <Text style={styles.measuredWeightVal}>3.2 kg</Text>
                    </View>
                    <Text style={styles.measuredWeightHint}>
                      Review the photo, then return to confirm the amount. No payment has been released.
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.closePhotoOutlineBtn}
                    onPress={() => setCurrentStep('g_p03')}
                    activeOpacity={0.8}
                  >
                    <X size={15} color="#2D6A2E" />
                    <Text style={styles.closePhotoOutlineText}>Close photo</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* ============================================================== */}
              {/* 3.06 Handover · Something's wrong                              */}
              {/* ============================================================== */}
              {currentStep === '3.06_somethings_wrong' && (
                <View>
                  <View style={styles.headlineBox}>
                    <Text style={styles.mainHeadline}>What's wrong?</Text>
                    <Text style={styles.subHeadline}>Tell us before you give your code.</Text>
                  </View>

                  <View style={styles.sentDetailsCard}>
                    <Text style={styles.sentDetailsTitle}>What the recycler sent</Text>
                    <View style={styles.sentDetailRow}>
                      <Text style={styles.sentDetailLabel}>Weight</Text>
                      <Text style={styles.sentDetailVal}>3.2 kg</Text>
                    </View>
                    <View style={styles.sentDetailRow}>
                      <Text style={styles.sentDetailLabel}>Rate</Text>
                      <Text style={styles.sentDetailVal}>₦120 per kg</Text>
                    </View>
                    <View style={styles.sentDetailRow}>
                      <Text style={styles.sentDetailLabel}>Amount</Text>
                      <Text style={styles.sentDetailValBold}>₦384</Text>
                    </View>
                  </View>

                  <Text style={styles.fieldSectionLabel}>Choose a reason</Text>
                  <View style={styles.reasonPillsRow}>
                    {(
                      [
                        { key: 'weight', label: 'Weight looks wrong' },
                        { key: 'rate', label: 'Rate changed' },
                        { key: 'other', label: 'Other' },
                      ] as const
                    ).map((r) => {
                      const active = disputeReason === r.key;
                      return (
                        <TouchableOpacity
                          key={r.key}
                          style={[styles.reasonPill, active && styles.reasonPillActive]}
                          onPress={() => setDisputeReason(r.key)}
                        >
                          {active && <Check size={13} color="#2D6A2E" strokeWidth={2.8} />}
                          <Text
                            style={[
                              styles.reasonPillText,
                              active && styles.reasonPillTextActive,
                            ]}
                          >
                            {r.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  <Text style={styles.fieldSectionLabel}>Add a short note</Text>
                  <TextInput
                    style={styles.disputeNoteInput}
                    value={disputeNote}
                    onChangeText={setDisputeNote}
                    multiline
                  />

                  <TouchableOpacity
                    style={styles.addPhotoOutlineBtn}
                    onPress={() => alert('Camera opened to attach scale photo')}
                    activeOpacity={0.75}
                  >
                    <Camera size={15} color="#2D6A2E" />
                    <Text style={styles.addPhotoOutlineText}>Add a photo</Text>
                  </TouchableOpacity>

                  <View style={styles.dontGiveCodeBox}>
                    <AlertTriangle size={16} color="#B45309" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dontGiveCodeTitle}>Don't give your code yet</Text>
                      <Text style={styles.dontGiveCodeSub}>
                        Your ₦450 stays set aside while we check.
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.sendToEcosmartBtn}
                    onPress={() => setCurrentStep('3.08_on_hold')}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.sendToEcosmartBtnText}>Send to EcoSmart</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.somethingWrongBtn}
                    onPress={() => router.push('/chat/kubwa-green-hub')}
                  >
                    <Text style={[styles.somethingWrongBtnText, { color: '#2D6A2E' }]}>
                      Chat with {recyclerName}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* ============================================================== */}
              {/* 3.08 Handover · On hold                                        */}
              {/* ============================================================== */}
              {currentStep === '3.08_on_hold' && (
                <View>
                  <View style={styles.headlineBox}>
                    <Text style={styles.mainHeadline}>Handover on hold</Text>
                    <Text style={styles.subHeadline}>
                      We're checking the weight with you both.
                    </Text>
                  </View>

                  {/* Dark Green Frozen Escrow Card */}
                  <View style={styles.darkGreenEscrowCard}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.darkGreenSmallLabel}>Set aside for you</Text>
                      <Text style={styles.darkGreenBigAmount}>₦450</Text>
                      <Text style={styles.darkGreenSubText}>
                        Frozen until we decide · not paid yet
                      </Text>
                    </View>
                    <View style={styles.darkGreenLockCircle}>
                      <Lock size={18} color="#FFFFFF" />
                    </View>
                  </View>

                  <View style={styles.sentDetailsCard}>
                    <View style={styles.sentDetailRow}>
                      <Text style={styles.sentDetailLabel}>Issue</Text>
                      <Text style={styles.sentDetailValBold}>Weight looks wrong</Text>
                    </View>
                    <View style={styles.sentDetailRow}>
                      <Text style={styles.sentDetailLabel}>Reported</Text>
                      <Text style={styles.sentDetailVal}>Sat 9 Nov, 14:22</Text>
                    </View>
                    <View style={styles.sentDetailRow}>
                      <Text style={styles.sentDetailLabel}>Reference</Text>
                      <Text style={styles.sentDetailValBold}>ES-1048</Text>
                    </View>
                  </View>

                  <View style={styles.protocolCard}>
                    <Text style={[styles.sentDetailsTitle, { marginBottom: 12 }]}>
                      What happens next
                    </Text>
                    <View style={styles.protocolStepRow}>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepBadgeNum}>1</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.protocolStepTitle}>
                          We review the scale photo and chat
                        </Text>
                        <Text style={styles.protocolStepDesc}>Today</Text>
                      </View>
                    </View>
                    <View style={styles.protocolDivider} />
                    <View style={styles.protocolStepRow}>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepBadgeNum}>2</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.protocolStepTitle}>We decide</Text>
                        <Text style={styles.protocolStepDesc}>Within 24 hours</Text>
                      </View>
                    </View>
                    <View style={styles.protocolDivider} />
                    <View style={styles.protocolStepRow}>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepBadgeNum}>3</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.protocolStepTitle}>
                          The money goes to the right person
                        </Text>
                        <Text style={styles.protocolStepDesc}>You'll get a message</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.closePhotoOutlineBtn}
                    onPress={() => router.push('/reports' as any)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.closePhotoOutlineText}>Contact EcoSmart support</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.somethingWrongBtn, { marginTop: 6 }]}
                    onPress={() => router.push('/chat/kubwa-green-hub')}
                  >
                    <Text style={[styles.somethingWrongBtnText, { color: '#2D6A2E' }]}>
                      Chat with {recyclerName}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* ============================================================== */}
              {/* 3.07 Handover · Give your code · Offline                       */}
              {/* ============================================================== */}
              {currentStep === '3.07_code_offline' && (
                <View>
                  <View style={styles.offlineAmberBanner}>
                    <WifiOff size={16} color="#B45309" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.offlineAmberTitle}>You're offline</Text>
                      <Text style={styles.offlineAmberSub}>
                        Your code still works without internet.
                      </Text>
                    </View>
                  </View>

                  {/* Dark Green Offline Code Card */}
                  <View style={styles.darkGreenCodeCard}>
                    <Text style={styles.darkGreenCodeLabel}>Your code</Text>
                    <Text style={styles.darkGreenCodeDigits}>4 8 2 7</Text>
                    <Text style={styles.darkGreenCodeSub}>
                      Read it out to {recyclerName}
                    </Text>
                  </View>

                  <View style={styles.sentDetailsCard}>
                    <View style={styles.sentDetailRow}>
                      <Text style={styles.sentDetailLabel}>You agreed</Text>
                      <Text style={styles.sentDetailValBold}>₦384</Text>
                    </View>
                    <View style={styles.sentDetailRow}>
                      <Text style={styles.sentDetailLabel}>Weight</Text>
                      <Text style={styles.sentDetailVal}>3.2 kg</Text>
                    </View>
                    <View style={styles.sentDetailRow}>
                      <Text style={styles.sentDetailLabel}>Rate</Text>
                      <Text style={styles.sentDetailVal}>₦120 per kg</Text>
                    </View>
                  </View>

                  <View style={styles.escrowSafeBox}>
                    <ShieldCheck size={16} color="#15803D" />
                    <Text style={styles.escrowSafeText}>
                      The same code is in your SMS. Your receipt appears when you're back online.
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.somethingWrongBtn}
                    onPress={() => setCurrentStep('3.06_somethings_wrong')}
                  >
                    <Text style={styles.somethingWrongBtnText}>Something's wrong</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </>
        )}
      </View>

      {currentStep !== '3.09_paying_you' && <BottomNavBar activeTab="requests" />}

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
    backgroundColor: '#2D6A2E',
    paddingVertical: 15,
    borderRadius: 26,
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
    backgroundColor: '#2D6A2E',
    paddingVertical: 15,
    borderRadius: 26,
  },
  simulateCodeEnteredText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* 3.04 Scale photo enlarged screen */
  scaleEnlargedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  scaleEnlargedPhoto: {
    width: '100%',
    height: 240,
  },
  scaleEnlargedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  scaleEnlargedTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F1E12',
  },
  scaleEnlargedSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  measuredWeightBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  measuredWeightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  measuredWeightLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  measuredWeightVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F1E12',
  },
  measuredWeightHint: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
  closePhotoOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2D6A2E',
    paddingVertical: 14,
    borderRadius: 26,
  },
  closePhotoOutlineText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D6A2E',
  },

  /* 3.06 Something's wrong & 3.08 Handover on hold */
  sentDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    gap: 8,
  },
  sentDetailsTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 4,
  },
  sentDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sentDetailLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  sentDetailVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F1E12',
  },
  sentDetailValBold: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F1E12',
  },
  fieldSectionLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 8,
  },
  reasonPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  reasonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  reasonPillActive: {
    backgroundColor: '#E6F4D7',
    borderColor: '#2D6A2E',
  },
  reasonPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  reasonPillTextActive: {
    color: '#2D6A2E',
    fontWeight: '700',
  },
  disputeNoteInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    padding: 12,
    fontSize: 13,
    color: '#0F1E12',
    minHeight: 68,
    marginBottom: 12,
  },
  addPhotoOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 11,
    borderRadius: 14,
    marginBottom: 14,
  },
  addPhotoOutlineText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  dontGiveCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  dontGiveCodeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  dontGiveCodeSub: {
    fontSize: 12,
    color: '#B45309',
    marginTop: 2,
  },
  sendToEcosmartBtn: {
    backgroundColor: '#2D6A2E',
    paddingVertical: 15,
    borderRadius: 26,
    alignItems: 'center',
    marginBottom: 6,
  },
  sendToEcosmartBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  darkGreenEscrowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E6B24',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },
  darkGreenSmallLabel: {
    fontSize: 11.5,
    color: '#DCFCE7',
  },
  darkGreenBigAmount: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 2,
  },
  darkGreenSubText: {
    fontSize: 11.5,
    color: '#DCFCE7',
  },
  darkGreenLockCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* 3.07 Offline Code Card */
  offlineAmberBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  offlineAmberTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
  },
  offlineAmberSub: {
    fontSize: 12,
    color: '#B45309',
  },
  darkGreenCodeCard: {
    backgroundColor: '#1E6B24',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 14,
  },
  darkGreenCodeLabel: {
    fontSize: 12,
    color: '#DCFCE7',
    marginBottom: 6,
  },
  darkGreenCodeDigits: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 6,
    marginBottom: 6,
  },
  darkGreenCodeSub: {
    fontSize: 12,
    color: '#DCFCE7',
  },

  /* 3.09 Paying you full screen */
  payingFullScreen: {
    flex: 1,
    backgroundColor: '#E6F4D7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  payingWalletCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1E6B24',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  payingHeadline: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F1E12',
    marginBottom: 6,
  },
  payingSub: {
    fontSize: 13.5,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
  },
  payingBigAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: '#1E6B24',
    marginBottom: 8,
  },
  payingRedirectHint: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E6B24',
  },
  openReceiptNowBtn: {
    marginTop: 28,
    backgroundColor: '#1E6B24',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 22,
  },
  openReceiptNowText: {
    fontSize: 13.5,
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
