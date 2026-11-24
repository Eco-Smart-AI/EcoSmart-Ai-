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
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  MapPin,
  Truck,
  Clock,
  Info,
  Lock,
  X,
  AlertCircle,
  Tag,
  Package,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomNavBar } from '../../components/common/BottomNavBar';
import { WANTED_OFFERS } from './index';

type DetailDemoState =
  | '5.02_detail'
  | '5.03_sheet'
  | '5.03_below_min'
  | '5.04_sold'
  | '5.05_mismatch'
  | '5.05_full';

export default function WantedDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const offer =
    WANTED_OFFERS.find((o) => o.id === id) || WANTED_OFFERS[0];

  const [demoState, setDemoState] = useState<DetailDemoState>('5.02_detail');
  const [sellSheetVisible, setSellSheetVisible] = useState(false);
  const [weightKg, setWeightKg] = useState<number>(3);
  const [handoverMode, setHandoverMode] = useState<'dropoff' | 'pickup'>('dropoff');

  const minRequiredKg =
    handoverMode === 'dropoff' ? offer.minDropOffKg : offer.minPickupKg;
  const isBelowMin = weightKg < minRequiredKg;
  const estimatedPayout = Math.round(weightKg * offer.ratePerKg);

  const selectDemoState = (next: DetailDemoState) => {
    setDemoState(next);
    if (next === '5.03_sheet') {
      setWeightKg(3);
      setHandoverMode('dropoff');
      setSellSheetVisible(true);
    } else if (next === '5.03_below_min') {
      setWeightKg(0.5);
      setHandoverMode('dropoff');
      setSellSheetVisible(true);
    } else {
      setSellSheetVisible(false);
    }
  };

  const handleStepWeight = (delta: number) => {
    setWeightKg((prev) => {
      const next = Math.max(0.5, parseFloat((prev + delta).toFixed(1)));
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader showBack={false} rightAction="bell" />

      {/* Demo Switcher for all 6 states in Screens · 05 */}
      <View style={styles.demoBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoScroll}
        >
          {(
            [
              { key: '5.02_detail', label: '5.02 Detail' },
              { key: '5.03_sheet', label: '5.03 Sell Sheet' },
              { key: '5.03_below_min', label: '5.03 Below Min' },
              { key: '5.04_sold', label: '5.04 Sold' },
              { key: '5.05_mismatch', label: '5.05 Mismatch' },
              { key: '5.05_full', label: '5.05 Offer Full' },
            ] as const
          ).map((item) => {
            const active = demoState === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.demoPill, active && styles.demoPillActive]}
                onPress={() => selectDemoState(item.key)}
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
        {/* Back Row */}
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
          <Text style={styles.backText}>Buy request</Text>
        </TouchableOpacity>

        {/* ===================================================== */}
        {/* 5.04 Sell · Sold                                      */}
        {/* ===================================================== */}
        {demoState === '5.04_sold' && (
          <View>
            <View style={styles.statusHeroRow}>
              <View style={styles.greenCheckCircle}>
                <Check size={24} color="#FFFFFF" strokeWidth={3} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.statusHeroTitle}>Sale confirmed</Text>
                <Text style={styles.statusHeroSub}>
                  {offer.recyclerName} is expecting your PET.
                </Text>
              </View>
            </View>

            {/* Dark Green Set Aside Card */}
            <View style={styles.darkGreenEscrowCard}>
              <View style={styles.darkGreenEscrowRow}>
                <View>
                  <Text style={styles.darkGreenLabel}>Set aside for you</Text>
                  <Text style={styles.darkGreenAmount}>₦450</Text>
                  <Text style={styles.darkGreenMeta}>
                    Paid after weighing and your code
                  </Text>
                </View>
                <View style={styles.darkGreenLockCircle}>
                  <Lock size={20} color="#DCFCE7" />
                </View>
              </View>
            </View>

            {/* What happens next */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>What happens next</Text>

              <View style={styles.timelineItem}>
                <View style={styles.timelineCircleDark}>
                  <Text style={styles.timelineNumDark}>1</Text>
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineStepTitle}>
                    Take your bottles to the yard
                  </Text>
                  <Text style={styles.timelineStepSub}>
                    {offer.address} · open until 6pm
                  </Text>
                </View>
              </View>

              <View style={styles.timelineLine} />

              <View style={styles.timelineItem}>
                <View style={styles.timelineCircleLight}>
                  <Text style={styles.timelineNumLight}>2</Text>
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineStepTitle}>
                    They weigh it, you accept the amount
                  </Text>
                  <Text style={styles.timelineStepSub}>
                    About ₦{estimatedPayout} for {weightKg} kg at ₦{offer.ratePerKg} per kg
                  </Text>
                </View>
              </View>

              <View style={styles.timelineLine} />

              <View style={styles.timelineItem}>
                <View style={styles.timelineCircleLight}>
                  <Text style={styles.timelineNumLight}>3</Text>
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineStepTitle}>Give your code</Text>
                  <Text style={styles.timelineStepSub}>
                    The money goes into your wallet
                  </Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 28 }}>
              <TouchableOpacity
                style={styles.primaryGreenBtn}
                onPress={() => router.push('/drop-off/REQ-001')}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryGreenBtnText}>View my drop-off</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryTextBtn}
                onPress={() => router.push(`/chat/${offer.recyclerId}`)}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryTextBtnLabel}>
                  Chat with {offer.recyclerName}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 5.05 Sell · Material mismatch                         */}
        {/* ===================================================== */}
        {demoState === '5.05_mismatch' && (
          <View>
            <View style={styles.statusHeroRow}>
              <View style={styles.amberWarnCircle}>
                <AlertCircle size={24} color="#B45309" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.statusHeroTitle}>This looks like glass</Text>
                <Text style={styles.statusHeroSub}>
                  {offer.recyclerName} only wants PET bottles.
                </Text>
              </View>
            </View>

            <View style={styles.comparisonCard}>
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>Your scan</Text>
                <Text style={styles.comparisonValue}>Glass</Text>
              </View>
              <View style={styles.comparisonDivider} />
              <View style={styles.comparisonRow}>
                <Text style={styles.comparisonLabel}>This buyer wants</Text>
                <Text style={styles.comparisonValue}>PET</Text>
              </View>
            </View>

            <View style={styles.noteRow}>
              <Tag size={14} color="#64748B" />
              <Text style={styles.noteText}>
                Nothing has been sold. Scan again if the result looks wrong.
              </Text>
            </View>

            <View style={{ marginTop: 120 }}>
              <TouchableOpacity
                style={styles.primaryGreenBtn}
                onPress={() => router.push('/recyclers')}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryGreenBtnText}>Find buyers for glass</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryTextBtn}
                onPress={() => router.push('/scan')}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryTextBtnLabel}>Scan again</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 5.05 Buy request · Filled while viewing               */}
        {/* ===================================================== */}
        {demoState === '5.05_full' && (
          <View>
            <View style={styles.statusHeroRow}>
              <View style={styles.neutralCheckCircle}>
                <Check size={22} color="#334155" strokeWidth={2.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.statusHeroTitle}>This offer is full</Text>
                <Text style={styles.statusHeroSub}>
                  {offer.recyclerName} has all the PET they need.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.otherBuyersCard}
              onPress={() => router.push('/wanted')}
              activeOpacity={0.8}
            >
              <View style={styles.otherBuyersIcon}>
                <Tag size={18} color="#2D6A2E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.otherBuyersTitle}>2 other buyers want PET</Text>
                <Text style={styles.otherBuyersSub}>
                  Up to ₦150 per kg near you
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.noteRow}>
              <Lock size={14} color="#64748B" />
              <Text style={styles.noteText}>Nothing was sold or paid.</Text>
            </View>

            <View style={{ marginTop: 150 }}>
              <TouchableOpacity
                style={styles.primaryGreenBtn}
                onPress={() => router.push('/wanted')}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryGreenBtnText}>See other buyers</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 5.02 Buy request · Detail                             */}
        {/* ===================================================== */}
        {(demoState === '5.02_detail' ||
          demoState === '5.03_sheet' ||
          demoState === '5.03_below_min') && (
          <View>
            <Text style={styles.pageTitle}>Buy request</Text>
            <Text style={styles.pageSubtitle}>
              A funded offer for your PET bottles.
            </Text>

            {/* Yard Hero Card */}
            <View style={styles.heroCard}>
              <Image
                source={require('../../assets/images/kubwa-yard.jpg')}
                style={styles.yardHeroImage}
                resizeMode="cover"
              />
              <View style={styles.heroCardBody}>
                <View style={styles.heroAvatarRow}>
                  <Image
                    source={require('../../assets/images/kubwa-yard.jpg')}
                    style={styles.heroThumb}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.heroRecyclerName}>{offer.recyclerName}</Text>
                    <Text style={styles.heroRecyclerMeta}>
                      Verified Eco Partner · Kubwa, Abuja
                    </Text>
                  </View>
                </View>

                <Text style={styles.heroReviewsLine}>
                  {offer.rating} ({offer.reviewCount} reviews) · {offer.distanceKm} km away
                </Text>

                <View style={styles.fundedBadgePill}>
                  <Text style={styles.fundedBadgeText}>Funded</Text>
                </View>
              </View>
            </View>

            {/* WHAT THEY PAY Card */}
            <View style={styles.sectionCard}>
              <Text style={styles.microTag}>WHAT THEY PAY</Text>
              <View style={styles.bigPriceRow}>
                <Text style={styles.bigPriceText}>₦{offer.ratePerKg}</Text>
                <Text style={styles.perKgText}>per kg</Text>
              </View>

              <View style={styles.matchRow}>
                <Text style={styles.materialLabel}>PET bottles</Text>
                <View style={styles.matchesScanBadge}>
                  <Check size={12} color="#2D6A2E" strokeWidth={2.8} />
                  <Text style={styles.matchesScanText}>Matches your scan</Text>
                </View>
              </View>

              <View style={styles.estimateBar}>
                <Text style={styles.estimateBarLeft}>Your ~3 kg</Text>
                <Text style={styles.estimateBarRight}>
                  ≈ ₦{offer.ratePerKg * 3}
                </Text>
              </View>

              <View style={styles.twoStatsRow}>
                <View style={styles.statGreyBox}>
                  <Text style={styles.statGreyTitle}>{offer.availableKg} kg</Text>
                  <Text style={styles.statGreySub}>still wanted</Text>
                </View>
                <View style={styles.statGreyBox}>
                  <Text style={styles.statGreyTitle}>{offer.endsShort}</Text>
                  <Text style={styles.statGreySub}>offer ends 6pm</Text>
                </View>
              </View>

              <View style={styles.promisedInfoRow}>
                <Info size={14} color="#64748B" />
                <Text style={styles.promisedInfoText}>
                  {offer.promisedKg} kg is already promised to other sellers.
                </Text>
              </View>
            </View>

            {/* How to hand over */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>How to hand over</Text>

              <View style={styles.handoverOptionRow}>
                <View style={styles.handoverIconGreen}>
                  <MapPin size={18} color="#2D6A2E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.handoverOptTitle}>Drop-off at their yard</Text>
                  <Text style={styles.handoverOptSub}>
                    From {offer.minDropOffKg} kg · {offer.address}
                  </Text>
                </View>
                <View style={styles.fitsBadge}>
                  <Check size={12} color="#2D6A2E" strokeWidth={2.8} />
                  <Text style={styles.fitsBadgeText}>Fits your 3 kg</Text>
                </View>
              </View>

              <View style={styles.handoverDivider} />

              <View style={styles.handoverOptionRow}>
                <View style={styles.handoverIconGrey}>
                  <Truck size={18} color="#64748B" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.handoverOptTitleMuted}>
                    Pickup from your home
                  </Text>
                  <Text style={styles.handoverOptSub}>
                    From {offer.minPickupKg} kg
                  </Text>
                </View>
                <View style={styles.needsBadge}>
                  <Text style={styles.needsBadgeText}>
                    Needs {offer.minPickupKg} kg
                  </Text>
                </View>
              </View>

              <View style={styles.hoursFooterRow}>
                <Clock size={14} color="#64748B" />
                <Text style={styles.hoursFooterText}>
                  Open Mon–Sat 6am–6pm · Closed Sunday
                </Text>
              </View>
            </View>

            {/* How you get paid */}
            <View style={styles.sectionCard}>
              <Text style={styles.sectionTitle}>How you get paid</Text>

              <View style={styles.timelineItem}>
                <View style={styles.timelineCircleDark}>
                  <Text style={styles.timelineNumDark}>1</Text>
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineStepTitle}>Confirm the sale</Text>
                  <Text style={styles.timelineStepSub}>
                    ₦450 is set aside for you straight away.
                  </Text>
                </View>
              </View>

              <View style={styles.timelineLine} />

              <View style={styles.timelineItem}>
                <View style={styles.timelineCircleLight}>
                  <Text style={styles.timelineNumLight}>2</Text>
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineStepTitle}>
                    Hand over and check the weight
                  </Text>
                  <Text style={styles.timelineStepSub}>
                    You agree the final amount in the app.
                  </Text>
                </View>
              </View>

              <View style={styles.timelineLine} />

              <View style={styles.timelineItem}>
                <View style={styles.timelineCircleLight}>
                  <Text style={styles.timelineNumLight}>3</Text>
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineStepTitle}>Give your code</Text>
                  <Text style={styles.timelineStepSub}>
                    The money goes into your wallet.
                  </Text>
                </View>
              </View>
            </View>

            {/* Chat & Call Pills */}
            <View style={styles.contactPillsRow}>
              <TouchableOpacity
                style={styles.contactOutlinePill}
                onPress={() => router.push(`/chat/${offer.recyclerId}`)}
                activeOpacity={0.75}
              >
                <Text style={styles.contactOutlineText}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.contactOutlinePill}
                onPress={() => router.push(`/call/${offer.recyclerId}`)}
                activeOpacity={0.75}
              >
                <Text style={styles.contactOutlineText}>Call</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.privateCaption}>
              In-app contact · Your numbers stay private
            </Text>

            {/* Primary CTA */}
            <TouchableOpacity
              style={styles.primaryGreenBtn}
              onPress={() => {
                setDemoState('5.03_sheet');
                setWeightKg(3);
                setSellSheetVisible(true);
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryGreenBtnText}>Sell to this buyer</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ===================================================== */}
      {/* 5.03 Sell · Sheet & 5.03 Sell · Below minimum         */}
      {/* ===================================================== */}
      <Modal
        visible={sellSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSellSheetVisible(false)}
      >
        <Pressable
          style={styles.sheetScrim}
          onPress={() => setSellSheetVisible(false)}
        >
          <Pressable style={styles.sheetCard} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHandle} />

            <View style={styles.sheetHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetTitle}>Sell to {offer.recyclerName}</Text>
                <Text style={styles.sheetSubtitle}>
                  PET · ₦{offer.ratePerKg} per kg · ends Sat 6pm
                </Text>
              </View>
              <TouchableOpacity
                style={styles.sheetCloseCircle}
                onPress={() => setSellSheetVisible(false)}
              >
                <X size={18} color="#334155" />
              </TouchableOpacity>
            </View>

            {/* Scanned Item Box */}
            <View style={styles.scannedItemBox}>
              <View style={styles.scannedItemIcon}>
                <Package size={18} color="#2D6A2E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.scannedItemName}>PET bottles</Text>
                <Text style={styles.scannedItemMeta}>From your scan</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/scan/result')}>
                <Text style={styles.changeGreenLink}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* How much? Stepper */}
            <Text style={styles.sheetSectionLabel}>How much?</Text>
            <View
              style={[
                styles.weightStepperContainer,
                isBelowMin && styles.weightStepperContainerError,
              ]}
            >
              <TouchableOpacity
                style={styles.weightStepBtn}
                onPress={() => handleStepWeight(-0.5)}
                activeOpacity={0.7}
              >
                <Text style={styles.weightStepBtnSign}>−</Text>
              </TouchableOpacity>

              <Text style={styles.weightDisplayValue}>{weightKg} kg</Text>

              <TouchableOpacity
                style={styles.weightStepBtn}
                onPress={() => handleStepWeight(0.5)}
                activeOpacity={0.7}
              >
                <Text style={styles.weightStepBtnSign}>+</Text>
              </TouchableOpacity>
            </View>

            {isBelowMin ? (
              <View style={styles.belowMinErrorRow}>
                <AlertCircle size={14} color="#B91C1C" />
                <Text style={styles.belowMinErrorText}>
                  {handoverMode === 'dropoff'
                    ? `Drop-off starts at ${offer.minDropOffKg} kg. Add more to sell.`
                    : `Home pickup starts at ${offer.minPickupKg} kg. Add more to sell.`}
                </Text>
              </View>
            ) : (
              <Text style={styles.wantUpToText}>
                They want up to {offer.availableKg} kg
              </Text>
            )}

            {/* How to hand over */}
            <Text style={[styles.sheetSectionLabel, { marginTop: 14 }]}>
              How to hand over
            </Text>
            <View style={styles.handoverPillsRow}>
              <TouchableOpacity
                style={[
                  styles.handoverSelectPill,
                  handoverMode === 'dropoff' && styles.handoverSelectPillActive,
                ]}
                onPress={() => setHandoverMode('dropoff')}
                activeOpacity={0.75}
              >
                {handoverMode === 'dropoff' && (
                  <Check size={14} color="#2D6A2E" strokeWidth={2.6} />
                )}
                <Text
                  style={[
                    styles.handoverSelectText,
                    handoverMode === 'dropoff' && styles.handoverSelectTextActive,
                  ]}
                >
                  Drop-off · from {offer.minDropOffKg} kg
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.handoverSelectPill,
                  handoverMode === 'pickup' && styles.handoverSelectPillActive,
                ]}
                onPress={() => setHandoverMode('pickup')}
                activeOpacity={0.75}
              >
                {handoverMode === 'pickup' && (
                  <Check size={14} color="#2D6A2E" strokeWidth={2.6} />
                )}
                <Text
                  style={[
                    styles.handoverSelectText,
                    handoverMode === 'pickup' && styles.handoverSelectTextActive,
                  ]}
                >
                  Pickup · from {offer.minPickupKg} kg
                </Text>
              </TouchableOpacity>
            </View>

            {/* You'll get about bar (shown when valid weight) */}
            {!isBelowMin && (
              <View style={styles.youGetBar}>
                <Text style={styles.youGetLabel}>You'll get about</Text>
                <Text style={styles.youGetValue}>₦{estimatedPayout}</Text>
              </View>
            )}

            {/* Escrow lock notice */}
            <View style={styles.sheetEscrowRow}>
              <Lock size={14} color="#64748B" />
              <Text style={styles.sheetEscrowText}>
                ₦450 is set aside when you confirm. You're paid after handover and your code.
              </Text>
            </View>

            {/* Confirm sale button */}
            <TouchableOpacity
              style={[
                styles.confirmSaleBtn,
                isBelowMin && styles.confirmSaleBtnDisabled,
              ]}
              disabled={isBelowMin}
              onPress={() => {
                setSellSheetVisible(false);
                setDemoState('5.04_sold');
              }}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.confirmSaleBtnText,
                  isBelowMin && styles.confirmSaleBtnTextDisabled,
                ]}
              >
                Confirm sale
              </Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

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
    marginBottom: 14,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  yardHeroImage: {
    width: '100%',
    height: 155,
  },
  heroCardBody: {
    padding: 14,
  },
  heroAvatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  heroThumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  heroRecyclerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1E12',
  },
  heroRecyclerMeta: {
    fontSize: 12,
    color: '#2D6A2E',
    marginTop: 1,
  },
  heroReviewsLine: {
    fontSize: 12.5,
    color: '#1E293B',
    marginBottom: 8,
  },
  fundedBadgePill: {
    alignSelf: 'flex-start',
    backgroundColor: '#E4F3D8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  fundedBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  microTag: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  bigPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 8,
  },
  bigPriceText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0F1E12',
  },
  perKgText: {
    fontSize: 14,
    color: '#64748B',
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  materialLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
  matchesScanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E4F3D8',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  matchesScanText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  estimateBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EAF5EA',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    marginBottom: 12,
  },
  estimateBarLeft: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E5D2E',
  },
  estimateBarRight: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1E5D2E',
  },
  twoStatsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  statGreyBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  statGreyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 2,
  },
  statGreySub: {
    fontSize: 12,
    color: '#64748B',
  },
  promisedInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  promisedInfoText: {
    fontSize: 12,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 12,
  },
  handoverOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  handoverIconGreen: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handoverIconGrey: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  handoverOptTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F1E12',
  },
  handoverOptTitleMuted: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#475569',
  },
  handoverOptSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  fitsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E4F3D8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  fitsBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  needsBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  needsBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  handoverDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  hoursFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  hoursFooterText: {
    fontSize: 12,
    color: '#64748B',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  timelineCircleDark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#38762B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineNumDark: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timelineCircleLight: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timelineNumLight: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  timelineContent: {
    flex: 1,
  },
  timelineStepTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F1E12',
  },
  timelineStepSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  timelineLine: {
    width: 2,
    height: 14,
    backgroundColor: '#E4F3D8',
    marginLeft: 11,
    marginVertical: 2,
  },
  contactPillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  contactOutlinePill: {
    flex: 1,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactOutlineText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  privateCaption: {
    fontSize: 11.5,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 14,
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
    justifyContent: 'center',
  },
  secondaryTextBtnLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D6A2E',
  },

  /* 5.04 Sold & 5.05 Mismatch / Full states */
  statusHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  greenCheckCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#38762B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amberWarnCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  neutralCheckCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusHeroTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F1E12',
  },
  statusHeroSub: {
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 2,
  },
  darkGreenEscrowCard: {
    backgroundColor: '#1E5D2E',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
  },
  darkGreenEscrowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkGreenLabel: {
    fontSize: 12.5,
    color: '#DCFCE7',
    marginBottom: 4,
  },
  darkGreenAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FCD34D',
    marginBottom: 4,
  },
  darkGreenMeta: {
    fontSize: 12,
    color: '#DCFCE7',
  },
  darkGreenLockCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  comparisonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  comparisonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  comparisonLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  comparisonValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F1E12',
  },
  comparisonDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  noteText: {
    fontSize: 12.5,
    color: '#64748B',
    flex: 1,
  },
  otherBuyersCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  otherBuyersIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otherBuyersTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F1E12',
  },
  otherBuyersSub: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },

  /* 5.03 Sell · Sheet Modal */
  sheetScrim: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  sheetHandle: {
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1E12',
  },
  sheetSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  sheetCloseCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannedItemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 12,
    marginBottom: 16,
  },
  scannedItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scannedItemName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
  scannedItemMeta: {
    fontSize: 12,
    color: '#64748B',
  },
  changeGreenLink: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  sheetSectionLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 8,
  },
  weightStepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 8,
  },
  weightStepperContainerError: {
    borderColor: '#B91C1C',
  },
  weightStepBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  weightStepBtnSign: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0F1E12',
  },
  weightDisplayValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F1E12',
  },
  wantUpToText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
  },
  belowMinErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  belowMinErrorText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B91C1C',
  },
  handoverPillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  handoverSelectPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  handoverSelectPillActive: {
    backgroundColor: '#E4F3D8',
    borderColor: '#2D6A2E',
    borderWidth: 1.5,
  },
  handoverSelectText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  handoverSelectTextActive: {
    color: '#2D6A2E',
    fontWeight: '700',
  },
  youGetBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EAF5EA',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  youGetLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E5D2E',
  },
  youGetValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E5D2E',
  },
  sheetEscrowRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  sheetEscrowText: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    flex: 1,
  },
  confirmSaleBtn: {
    backgroundColor: '#38762B',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmSaleBtnDisabled: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  confirmSaleBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  confirmSaleBtnTextDisabled: {
    color: '#64748B',
  },
});
