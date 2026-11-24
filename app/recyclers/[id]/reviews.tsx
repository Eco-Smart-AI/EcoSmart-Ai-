import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Star, ShieldCheck, Check, MessageSquarePlus } from 'lucide-react-native';

import { AppHeader } from '../../../components/common/AppHeader';
import { BottomNavBar } from '../../../components/common/BottomNavBar';
import { LanguageBottomSheet } from '../../../components/sheets/LanguageBottomSheet';
import { MOCK_RECYCLERS } from '../../../data/mockRecyclers';
import { Recycler } from '../../../types/recycler';

export default function RecyclerReviewsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const recyclerId = (params.id as string) || 'kubwa-green-hub';

  const [langSheetVisible, setLangSheetVisible] = useState(false);
  const [showEmptyReviews, setShowEmptyReviews] = useState(false);

  const recycler: Recycler =
    MOCK_RECYCLERS.find((r) => r.id === recyclerId) || MOCK_RECYCLERS[0];

  const metrics = recycler.reviewMetrics || {
    fairWeighingPct: 98,
    onTimePct: 87,
    politePct: 91,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        showBack
        onOpenLanguage={() => setLangSheetVisible(true)}
      />

      {/* Demo State Switcher: Populated Reviews vs Reviews · None */}
      <View style={styles.demoBar}>
        <Text style={styles.demoTitle}>Reviews State:</Text>
        <TouchableOpacity
          style={[styles.demoPill, !showEmptyReviews && styles.demoPillActive]}
          onPress={() => setShowEmptyReviews(false)}
        >
          <Text style={[styles.demoPillText, !showEmptyReviews && styles.demoPillTextActive]}>
            Reviews ({recycler.reviewCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoPill, showEmptyReviews && styles.demoPillActive]}
          onPress={() => setShowEmptyReviews(true)}
        >
          <Text style={[styles.demoPillText, showEmptyReviews && styles.demoPillTextActive]}>
            State · Reviews · None
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Subtitle */}
          <View style={styles.titleHeader}>
            <Text style={styles.titleText}>Reviews</Text>
            <Text style={styles.recyclerSub}>{recycler.name}</Text>
          </View>

          {!showEmptyReviews ? (
            <>
              {/* Overall Rating Card */}
              <View style={styles.ratingCard}>
                <View style={styles.scoreRow}>
                  <Text style={styles.bigScore}>{recycler.rating}</Text>
                  <View style={styles.scoreStarsCol}>
                    <View style={styles.starsRow}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={18}
                          color="#EAB308"
                          fill={s <= Math.floor(recycler.rating) ? '#EAB308' : 'none'}
                        />
                      ))}
                    </View>
                    <Text style={styles.reviewCountText}>
                      {recycler.reviewCount} verified reviews
                    </Text>
                  </View>
                </View>

                {/* Quality Progress Bars */}
                <View style={styles.metricBarsWrapper}>
                  <View style={styles.metricItem}>
                    <View style={styles.metricLabelRow}>
                      <Text style={styles.metricLabel}>Fair weighing</Text>
                      <Text style={styles.metricPct}>{metrics.fairWeighingPct}%</Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${metrics.fairWeighingPct}%` },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.metricItem}>
                    <View style={styles.metricLabelRow}>
                      <Text style={styles.metricLabel}>On time</Text>
                      <Text style={styles.metricPct}>{metrics.onTimePct}%</Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${metrics.onTimePct}%` },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.metricItem}>
                    <View style={styles.metricLabelRow}>
                      <Text style={styles.metricLabel}>Polite</Text>
                      <Text style={styles.metricPct}>{metrics.politePct}%</Text>
                    </View>
                    <View style={styles.progressBarTrack}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${metrics.politePct}%` },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Reviews List */}
              <View style={styles.reviewsListSection}>
                {recycler.reviews.map((rev) => (
                  <View key={rev.id} style={styles.reviewCard}>
                    <View style={styles.reviewHeadRow}>
                      <View>
                        <Text style={styles.reviewAuthor}>{rev.author}</Text>
                        <Text style={styles.reviewActivity}>{rev.activityType}</Text>
                      </View>
                      <View style={styles.reviewMetaRight}>
                        <View style={styles.starsRowSmall}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={12}
                              color="#EAB308"
                              fill={s <= rev.rating ? '#EAB308' : 'none'}
                            />
                          ))}
                        </View>
                        <Text style={styles.reviewTimeAgo}>{rev.timeAgo}</Text>
                      </View>
                    </View>
                    <Text style={styles.reviewBody}>{rev.comment}</Text>
                  </View>
                ))}
              </View>
            </>
          ) : (
            /* ===================================================== */
            /* Household · State · Reviews · None                    */
            /* ===================================================== */
            <View style={styles.emptyReviewsCard}>
              <View style={styles.emptyIconCircle}>
                <MessageSquarePlus size={28} color="#2D6A2E" />
              </View>

              <View style={styles.newPartnerBadge}>
                <Check size={12} color="#15803D" strokeWidth={2.8} />
                <Text style={styles.newPartnerBadgeText}>New on EcoSmart · ID verified</Text>
              </View>

              <Text style={styles.emptyReviewsTitle}>No reviews yet</Text>
              <Text style={styles.emptyReviewsDesc}>
                {recycler.name} recently joined the Kubwa pilot. Their scale, ID, and business license have been verified by EcoSmart.
              </Text>

              <View style={styles.protectionBox}>
                <ShieldCheck size={18} color="#2D6A2E" />
                <Text style={styles.protectionText}>
                  Your payment is still 100% protected in EcoSmart escrow before they come to your gate.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.bookFirstBtn}
                onPress={() => router.back()}
                activeOpacity={0.85}
              >
                <Text style={styles.bookFirstBtnText}>Back to recycler profile</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Trust Guarantee Note */}
          <View style={styles.trustFooter}>
            <ShieldCheck size={16} color="#15803D" />
            <Text style={styles.trustFooterText}>
              Only people who finished a pickup or drop-off can leave a review.
            </Text>
          </View>
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
  demoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 6,
  },
  demoTitle: {
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
    padding: 16,
    paddingBottom: 40,
  },
  titleHeader: {
    marginBottom: 14,
  },
  titleText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F1E12',
  },
  recyclerSub: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  ratingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 14,
  },
  bigScore: {
    fontSize: 42,
    fontWeight: '900',
    color: '#0F1E12',
  },
  scoreStarsCol: {
    gap: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 3,
  },
  reviewCountText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  metricBarsWrapper: {
    gap: 12,
  },
  metricItem: {
    gap: 4,
  },
  metricLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  metricPct: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#15803D',
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#15803D',
    borderRadius: 4,
  },
  reviewsListSection: {
    gap: 12,
    marginBottom: 16,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reviewHeadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reviewAuthor: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F1E12',
  },
  reviewActivity: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  reviewMetaRight: {
    alignItems: 'flex-end',
    gap: 3,
  },
  starsRowSmall: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewTimeAgo: {
    fontSize: 10.5,
    color: '#94A3B8',
  },
  reviewBody: {
    fontSize: 12.5,
    color: '#334155',
    lineHeight: 18,
  },
  emptyReviewsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EAF5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  newPartnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  newPartnerBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#15803D',
  },
  emptyReviewsTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 6,
  },
  emptyReviewsDesc: {
    fontSize: 13.5,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  protectionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EAF5EA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    width: '100%',
  },
  protectionText: {
    fontSize: 12,
    color: '#2D6A2E',
    fontWeight: '600',
    lineHeight: 17,
    flex: 1,
  },
  bookFirstBtn: {
    backgroundColor: '#2D6A2E',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  bookFirstBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F1F8EE',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D5E8C8',
  },
  trustFooterText: {
    flex: 1,
    fontSize: 11.5,
    color: '#1E293B',
    lineHeight: 16,
  },
});
