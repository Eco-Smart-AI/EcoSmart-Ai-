import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import {
  ArrowLeft,
  Bell,
  Check,
  Clock,
  Star,
  MapPin,
  MessageSquare,
  Phone,
  Lock,
  ExternalLink,
  Info,
} from 'lucide-react-native';

import { BottomNavBar } from '../../components/common/BottomNavBar';
import { DropOffBottomSheet } from '../../components/sheets/DropOffBottomSheet';
import { LanguageBottomSheet } from '../../components/sheets/LanguageBottomSheet';
import { MOCK_RECYCLERS } from '../../data/mockRecyclers';
import { Recycler } from '../../types/recycler';

export default function RecyclerDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const recyclerId = (params.id as string) || 'kubwa-green-hub';
  const userWeightKg = Number(params.weight) || 3;

  const [langSheetVisible, setLangSheetVisible] = useState(false);
  const [dropOffSheetVisible, setDropOffSheetVisible] = useState(false);

  const recycler: Recycler =
    MOCK_RECYCLERS.find((r) => r.id === recyclerId) || MOCK_RECYCLERS[0];

  const estimatedPay = Math.round(recycler.rates.pet * userWeightKg);
  const isBelowPickupMin = userWeightKg < recycler.minPickupKg;

  const handleAction = () => {
    if (isBelowPickupMin) {
      setDropOffSheetVisible(true);
    } else {
      router.push({
        pathname: '/recyclers/request-pickup' as any,
        params: {
          id: recycler.id,
          name: recycler.name,
          weight: userWeightKg.toString(),
          rate: recycler.rates.pet.toString(),
        },
      });
    }
  };

  const handleSeeAllReviews = () => {
    router.push({
      pathname: `/recyclers/[id]/reviews` as any,
      params: { id: recycler.id },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 1. Top White Navigation Bar (Brand Logo + Notification Bell) */}
        <View style={styles.topWhiteNav}>
          <TouchableOpacity
            style={styles.logoRow}
            onPress={() => router.push('/home' as any)}
            activeOpacity={0.8}
            accessibilityLabel="EcoSmart AI Home"
          >
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => alert('No new notifications')}
            activeOpacity={0.7}
            accessibilityLabel="Notifications"
          >
            <Bell size={21} color="#0F1E12" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* 2. Small Green Tint Wave Strip directly under the white nav */}
        <View style={styles.waveStrip} pointerEvents="none">
          <Svg width="100%" height={24} viewBox="0 0 400 24" preserveAspectRatio="none">
            <Path
              d="M 0,0 L 400,0 L 400,10 C 310,22 210,6 120,18 C 60,24 0,12 0,12 Z"
              fill="#E6F4D7"
            />
          </Svg>
        </View>

        {/* 3. Sub-header Bar: ← Recycler details */}
        <View style={styles.subHeaderBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
            accessibilityLabel="Go back"
          >
            <ArrowLeft size={21} color="#0F1E12" strokeWidth={2.4} />
          </TouchableOpacity>
          <Text style={styles.subHeaderTitle}>Recycler details</Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 4. Hero Card with Image on Top & Light Green Badges */}
          <View style={styles.heroCard}>
            {/* Yard Image at top of card */}
            <Image
              source={require('../../assets/images/kubwa-yard.jpg')}
              style={styles.yardImage}
              resizeMode="cover"
            />

            {/* Card Body */}
            <View style={styles.heroBody}>
              {/* Title */}
              <Text style={styles.recyclerName}>{recycler.name}</Text>

              {/* Light Green Verification Badges */}
              <View style={styles.badgesRow}>
                {recycler.verified && (
                  <View style={styles.lightGreenBadge}>
                    <Check size={13} color="#15803D" strokeWidth={2.8} />
                    <Text style={styles.lightGreenBadgeText}>ID verified</Text>
                  </View>
                )}
                {recycler.licensed && (
                  <View style={styles.lightGreenBadge}>
                    <Check size={13} color="#15803D" strokeWidth={2.8} />
                    <Text style={styles.lightGreenBadgeText}>Licensed</Text>
                  </View>
                )}
                <View style={styles.lightGreenBadge}>
                  <Clock size={13} color="#15803D" strokeWidth={2.2} />
                  <Text style={styles.lightGreenBadgeText}>Open now</Text>
                </View>
              </View>

              {/* Stats Row: 3 separate rounded boxes */}
              <View style={styles.statsRow}>
                <TouchableOpacity
                  style={styles.statBox}
                  onPress={handleSeeAllReviews}
                  activeOpacity={0.7}
                >
                  <View style={styles.statRatingRow}>
                    <Text style={styles.statValueBold}>{recycler.rating}</Text>
                    <Star size={13} color="#EAB308" fill="#EAB308" />
                  </View>
                  <Text style={styles.statLabelMuted}>{recycler.reviewCount} reviews</Text>
                </TouchableOpacity>

                <View style={styles.statBox}>
                  <Text style={styles.statValueBold}>{recycler.distanceKm} km</Text>
                  <Text style={styles.statLabelMuted}>from you</Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statValueBold}>{recycler.replyTime.split(' ')[0]} min</Text>
                  <Text style={styles.statLabelMuted}>usual reply</Text>
                </View>
              </View>

              {/* Completed pickups social proof */}
              <Text style={styles.completedProofText}>
                {recycler.completedPickups} pickups done on EcoSmart
              </Text>

              {/* Chat & Call Pill Buttons */}
              <View style={styles.contactRow}>
                <TouchableOpacity
                  style={styles.pillContactBtn}
                  activeOpacity={0.75}
                  onPress={() => router.push(`/chat/${recycler.id}`)}
                >
                  <MessageSquare size={17} color="#2D6A2E" />
                  <Text style={styles.pillContactBtnText}>Chat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.pillContactBtn}
                  activeOpacity={0.75}
                  onPress={() => router.push(`/call/${recycler.id}`)}
                >
                  <Phone size={17} color="#2D6A2E" />
                  <Text style={styles.pillContactBtnText}>Call</Text>
                </TouchableOpacity>
              </View>

              {/* Private security note with lock */}
              <View style={styles.privacyRow}>
                <Lock size={12} color="#64748B" />
                <Text style={styles.privacyText}>
                  Chats and calls stay in EcoSmart. Your number stays private.
                </Text>
              </View>
            </View>
          </View>

          {/* Section: What they pay */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>What they pay</Text>

            {/* Highlighted PET row */}
            <View style={styles.rateHighlightRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.rateNameRow}>
                  <Text style={styles.highlightName}>PET bottles</Text>
                  <View style={styles.yourItemTag}>
                    <Text style={styles.yourItemTagText}>Your item</Text>
                  </View>
                </View>
                <Text style={styles.highlightEstimate}>
                  Your ~{userWeightKg} kg ≈ ₦{estimatedPay}
                </Text>
              </View>
              <Text style={styles.highlightRate}>₦{recycler.rates.pet}/kg</Text>
            </View>

            {/* Other materials */}
            <View style={styles.otherRateRow}>
              <Text style={styles.otherRateName}>HDPE plastic</Text>
              <Text style={styles.otherRateValue}>₦{recycler.rates.hdpe}/kg</Text>
            </View>

            <View style={styles.otherRateRow}>
              <Text style={styles.otherRateName}>Aluminium cans</Text>
              <Text style={styles.otherRateValue}>₦{recycler.rates.cans}/kg</Text>
            </View>

            <View style={styles.otherRateRow}>
              <Text style={styles.otherRateName}>Cardboard</Text>
              <Text style={styles.otherRateValue}>₦{recycler.rates.carton}/kg</Text>
            </View>

            <View style={styles.weighNotice}>
              <Info size={13} color="#64748B" />
              <Text style={styles.weighNoticeText}>
                Not final. They weigh your waste in front of you at handover.
              </Text>
            </View>
          </View>

          {/* Section: How they collect */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>How they collect</Text>

            <View style={styles.collectItem}>
              <Text style={styles.collectTitle}>Home pickup</Text>
              <Text style={styles.collectSub}>
                From {recycler.minPickupKg} kg · Available today
              </Text>
            </View>

            <View style={styles.collectItem}>
              <Text style={styles.collectTitle}>Drop-off at their yard</Text>
              <Text style={styles.collectSub}>
                From {recycler.minDropoffKg} kg · Bring clean, dry bottles
              </Text>
            </View>

            <Text style={styles.serviceAreasText}>
              Picks up in {recycler.serviceAreas.join(', ')}.
            </Text>
          </View>

          {/* Section: Opening hours */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Opening hours</Text>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Monday – Saturday</Text>
              <Text style={styles.hoursTime}>6am – 6pm</Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Sunday</Text>
              <Text style={[styles.hoursTime, { color: '#94A3B8' }]}>Closed</Text>
            </View>
          </View>

          {/* Section: Find the yard */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Find the yard</Text>
            <View style={styles.yardRow}>
              <MapPin size={18} color="#2D6A2E" />
              <View style={{ flex: 1 }}>
                <Text style={styles.yardAddress}>{recycler.address}</Text>
                <Text style={styles.yardDistrict}>{recycler.name}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.openMapsBtn}
              activeOpacity={0.7}
              onPress={() => alert(`Opening ${recycler.address} in Maps...`)}
            >
              <ExternalLink size={14} color="#0F1E12" />
              <Text style={styles.openMapsBtnText}>Open in Maps</Text>
            </TouchableOpacity>
          </View>

          {/* Section: Reviews Snippet */}
          <View style={styles.sectionCard}>
            <View style={styles.reviewHeaderRow}>
              <Text style={styles.sectionTitle}>
                Reviews · {recycler.rating}
              </Text>
              <TouchableOpacity onPress={handleSeeAllReviews} activeOpacity={0.7}>
                <Text style={styles.seeAllReviewsText}>
                  See all {recycler.reviewCount}
                </Text>
              </TouchableOpacity>
            </View>

            {recycler.reviews.slice(0, 2).map((rev) => (
              <View key={rev.id} style={styles.reviewItem}>
                <View style={styles.reviewTopRow}>
                  <Text style={styles.reviewerName}>
                    {rev.author} · {rev.activityType}
                  </Text>
                  <View style={styles.ratingStars}>
                    <Star size={11} color="#EAB308" fill="#EAB308" />
                    <Text style={styles.ratingVal}>{rev.rating}.0</Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{rev.comment}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Sticky Action Bar */}
        <View style={styles.stickyFooter}>
          {isBelowPickupMin ? (
            <View>
              <Text style={styles.footerWarningText}>
                Your ~{userWeightKg} kg is below their {recycler.minPickupKg} kg pickup minimum, so drop-off is the best option.
              </Text>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={handleAction}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryActionBtnText}>Drop off here</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.footerPickupText}>
                {recycler.name} picks up from {recycler.minPickupKg} kg, so they can come to you.
              </Text>
              <TouchableOpacity
                style={styles.primaryActionBtn}
                onPress={handleAction}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryActionBtnText}>Request pickup</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <BottomNavBar activeTab="requests" />

      {/* Drop-Off Bottom Sheet (G-F07) */}
      <DropOffBottomSheet
        visible={dropOffSheetVisible}
        recycler={recycler}
        onClose={() => setDropOffSheetVisible(false)}
        onSubmit={(data) => {
          alert(`Drop-off scheduled with ${recycler.name} for ${data.day} (${data.timeSlot})!`);
        }}
        weightKg={userWeightKg}
      />

      {/* Language Switcher Sheet */}
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
  subHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
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
  subHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1E12',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 120,
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  yardImage: {
    width: '100%',
    height: 195,
  },
  heroBody: {
    padding: 16,
  },
  recyclerName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F1E12',
    marginBottom: 10,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  lightGreenBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAF5EA',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
  },
  lightGreenBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803D',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  statValueBold: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F1E12',
  },
  statLabelMuted: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  completedProofText: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '500',
    marginBottom: 14,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  pillContactBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#2D6A2E',
    backgroundColor: '#FFFFFF',
  },
  pillContactBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  privacyText: {
    fontSize: 11,
    color: '#64748B',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 12,
  },
  rateHighlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F1F8EE',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5E8C8',
    marginBottom: 10,
  },
  rateNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  highlightName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F1E12',
  },
  yourItemTag: {
    backgroundColor: '#2D6A2E',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  yourItemTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  highlightEstimate: {
    fontSize: 12,
    color: '#2D6A2E',
    fontWeight: '600',
    marginTop: 2,
  },
  highlightRate: {
    fontSize: 17,
    fontWeight: '900',
    color: '#2D6A2E',
  },
  otherRateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  otherRateName: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  otherRateValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  weighNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
  },
  weighNoticeText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  collectItem: {
    marginBottom: 10,
  },
  collectTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
  },
  collectSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  serviceAreasText: {
    fontSize: 12,
    color: '#2D6A2E',
    fontWeight: '600',
    marginTop: 6,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  hoursDay: {
    fontSize: 13,
    color: '#334155',
  },
  hoursTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
  },
  yardRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  yardAddress: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
  },
  yardDistrict: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  openMapsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#0F1E12',
    backgroundColor: '#FFFFFF',
  },
  openMapsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F1E12',
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeAllReviewsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  reviewItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  reviewTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  ratingStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingVal: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
  },
  reviewComment: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  stickyFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  footerWarningText: {
    fontSize: 11.5,
    color: '#92400E',
    marginBottom: 8,
    textAlign: 'center',
  },
  footerPickupText: {
    fontSize: 11.5,
    color: '#15803D',
    marginBottom: 8,
    textAlign: 'center',
  },
  primaryActionBtn: {
    backgroundColor: '#0F1E12',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
