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
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  Star,
  Camera,
  Info,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomNavBar } from '../../components/common/BottomNavBar';
import { PickupStepper } from '../../components/pickup/PickupStepper';

type ReceiptDemoMode =
  | '10.1_paid'
  | '3.12_review'
  | '3.13_saved'
  | '3.11_sms_accepted'
  | '3.11_sms_receipt';

export default function PaidReceiptReviewScreen() {
  const router = useRouter();

  const [mode, setMode] = useState<ReceiptDemoMode>('10.1_paid');
  const [rating, setRating] = useState<number>(5);
  const [quickTags, setQuickTags] = useState<string[]>(['On time', 'Fair scale']);
  const [wentWell, setWentWell] = useState<string[]>([
    'On time',
    'Fair weighing',
    'Friendly',
    'Paid quickly',
  ]);
  const [couldBeBetter, setCouldBeBetter] = useState<string[]>([]);
  const [comment, setComment] = useState<string>(
    'Ibrahim arrived on time, showed me the weight clearly, and the payment reached my wallet quickly.'
  );
  const [photosAdded, setPhotosAdded] = useState<number>(0);

  const toggleItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    val: string
  ) => {
    if (list.includes(val)) {
      setList(list.filter((i) => i !== val));
    } else {
      setList([...list, val]);
    }
  };

  const RATING_LABELS: Record<number, string> = {
    1: '1 out of 5 · Poor',
    2: '2 out of 5 · Fair',
    3: '3 out of 5 · Okay',
    4: '4 out of 5 · Good',
    5: '5 out of 5 · Excellent',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader showBack={false} rightAction="bell" />

      {/* Demo Bar for all 5 screens in Screens · 10 */}
      <View style={styles.demoBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoScroll}
        >
          {(
            [
              { key: '10.1_paid', label: '10.1 Paid & Quick Rate' },
              { key: '3.12_review', label: '3.12 Full Review' },
              { key: '3.13_saved', label: '3.13 Review Saved Toast' },
              { key: '3.11_sms_accepted', label: '3.11a SMS · Accepted' },
              { key: '3.11_sms_receipt', label: '3.11b SMS · Receipt' },
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
        {/* 10.1 Paid · review                                    */}
        {/* ===================================================== */}
        {mode === '10.1_paid' && (
          <View>
            <View style={styles.topBackRow}>
              <TouchableOpacity
                style={styles.backBtnRow}
                onPress={() => router.back()}
                activeOpacity={0.7}
              >
                <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
                <Text style={styles.backTitle}>Your pickup</Text>
              </TouchableOpacity>
              <Text style={styles.reqIdText}>REQ-001</Text>
            </View>

            <PickupStepper currentStage="paid" />

            {/* Paid Hero Card */}
            <View style={styles.paidHeroCard}>
              <View style={styles.greenCheckCircle}>
                <Check size={24} color="#2D6A2E" strokeWidth={2.8} />
              </View>
              <Text style={styles.paidHeroTitle}>₦384 is in your wallet</Text>
              <Text style={styles.paidHeroMeta}>
                3.2 kg PET · Kubwa Green Hub · Today, 14:15
              </Text>

              <View style={styles.statsBoxesRow}>
                <View style={styles.statGreyBox}>
                  <Text style={styles.statBoxLabel}>Wallet now</Text>
                  <Text style={styles.statBoxVal}>₦1,624</Text>
                </View>
                <View style={styles.statGreyBox}>
                  <Text style={styles.statBoxLabel}>Recycled so far</Text>
                  <Text style={styles.statBoxVal}>9.6 kg</Text>
                </View>
              </View>
            </View>

            {/* Quick Inline Rating Card */}
            <View style={styles.quickRateCard}>
              <Text style={styles.quickRateTitle}>How was Kubwa Green Hub?</Text>

              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                  >
                    <Star
                      size={28}
                      color={star <= rating ? '#EAB308' : '#CBD5E1'}
                      fill={star <= rating ? '#EAB308' : 'none'}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.quickPillsRow}>
                {['On time', 'Fair scale', 'Polite'].map((tag) => {
                  const selected = quickTags.includes(tag);
                  return (
                    <TouchableOpacity
                      key={tag}
                      style={[
                        styles.quickTagPill,
                        selected && styles.quickTagPillSelected,
                      ]}
                      onPress={() => toggleItem(quickTags, setQuickTags, tag)}
                      activeOpacity={0.75}
                    >
                      {selected && (
                        <Check size={13} color="#2D6A2E" strokeWidth={2.6} />
                      )}
                      <Text
                        style={[
                          styles.quickTagText,
                          selected && styles.quickTagTextSelected,
                        ]}
                      >
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <TouchableOpacity
                style={styles.writeFullReviewLink}
                onPress={() => setMode('3.12_review')}
                activeOpacity={0.7}
              >
                <Text style={styles.writeFullReviewText}>
                  Write a detailed review →
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom CTAs */}
            <View style={{ marginTop: 18 }}>
              <TouchableOpacity
                style={styles.primaryGreenBtn}
                onPress={() => router.push('/wallet')}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryGreenBtnText}>Cash out to my bank</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryTextBtn}
                onPress={() => router.push('/scan')}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryTextBtnLabel}>Scan more waste</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 3.12 Leave a review                                   */}
        {/* ===================================================== */}
        {mode === '3.12_review' && (
          <View>
            <TouchableOpacity
              style={[styles.backBtnRow, { marginBottom: 14 }]}
              onPress={() => setMode('10.1_paid')}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
              <Text style={styles.backTitle}>Review</Text>
            </TouchableOpacity>

            <Text style={styles.pageTitle}>How was your handover?</Text>
            <Text style={styles.pageSubtitle}>
              Share your experience with Kubwa Green Hub.
            </Text>

            {/* Recycler Info Card */}
            <View style={styles.recyclerSummaryCard}>
              <Image
                source={require('../../assets/images/kubwa-yard.jpg')}
                style={styles.recyclerThumb}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.recyclerName}>Kubwa Green Hub</Text>
                <Text style={styles.recyclerPartnerText}>
                  Verified Eco Partner · Kubwa, Abuja
                </Text>
                <Text style={styles.recyclerMetaText}>
                  3.2 kg PET · Paid ₦384 · Sat 9 Nov, 14:15
                </Text>
              </View>
            </View>

            {/* Star Picker Card */}
            <View style={styles.bigRatingCard}>
              <Text style={styles.yourRatingLabel}>Your rating</Text>
              <View style={styles.bigStarsRow}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                  >
                    <Star
                      size={32}
                      color="#EAB308"
                      fill={star <= rating ? '#EAB308' : 'none'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingCaptionText}>
                {RATING_LABELS[rating]}
              </Text>
            </View>

            {/* What went well? */}
            <Text style={styles.sectionLabel}>What went well?</Text>
            <View style={styles.chipsWrapRow}>
              {['On time', 'Fair weighing', 'Friendly', 'Paid quickly'].map(
                (chip) => {
                  const selected = wentWell.includes(chip);
                  return (
                    <TouchableOpacity
                      key={chip}
                      style={[
                        styles.feedbackChip,
                        selected && styles.feedbackChipSelected,
                      ]}
                      onPress={() => toggleItem(wentWell, setWentWell, chip)}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[
                          styles.feedbackChipText,
                          selected && styles.feedbackChipTextSelected,
                        ]}
                      >
                        {chip}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>

            {/* What could be better? */}
            <Text style={[styles.sectionLabel, { marginTop: 14 }]}>
              What could be better?
            </Text>
            <View style={styles.chipsWrapRow}>
              {['Late', 'Weighing felt wrong', 'Rude'].map((chip) => {
                const selected = couldBeBetter.includes(chip);
                return (
                  <TouchableOpacity
                    key={chip}
                    style={[
                      styles.feedbackChip,
                      selected && styles.feedbackChipWarnSelected,
                    ]}
                    onPress={() =>
                      toggleItem(couldBeBetter, setCouldBeBetter, chip)
                    }
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[
                        styles.feedbackChipText,
                        selected && styles.feedbackChipWarnText,
                      ]}
                    >
                      {chip}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Comment Box */}
            <Text style={[styles.sectionLabel, { marginTop: 14 }]}>Comment</Text>
            <TextInput
              style={styles.commentInput}
              multiline
              numberOfLines={3}
              value={comment}
              onChangeText={setComment}
              placeholder="Tell others how the weighing and payment went..."
              placeholderTextColor="#94A3B8"
            />

            {/* Add photos dashed button */}
            <TouchableOpacity
              style={styles.addPhotoDashedBtn}
              onPress={() => setPhotosAdded((p) => (p < 2 ? p + 1 : 0))}
              activeOpacity={0.75}
            >
              <Camera size={16} color="#2D6A2E" />
              <Text style={styles.addPhotoDashedText}>
                {photosAdded > 0
                  ? `✓ ${photosAdded} photo${photosAdded > 1 ? 's' : ''} attached (tap to change)`
                  : 'Add photos (up to 2)'}
              </Text>
            </TouchableOpacity>

            {/* Submit Review CTA */}
            <TouchableOpacity
              style={styles.primaryGreenBtn}
              onPress={() => setMode('3.13_saved')}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryGreenBtnText}>Submit review</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryTextBtn}
              onPress={() => router.push('/home')}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryTextBtnLabel}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.reportPrivatelyBtn}
              onPress={() => router.push('/reports' as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.reportPrivatelyText}>
                Something serious? Report it privately
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ===================================================== */}
        {/* 3.13 Review · Saved (Toast over Home preview)         */}
        {/* ===================================================== */}
        {mode === '3.13_saved' && (
          <View>
            {/* Floating Submitted Toast */}
            <View style={styles.reviewSubmittedToast}>
              <View style={styles.toastCheckCircle}>
                <Check size={16} color="#2D6A2E" strokeWidth={2.8} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.toastTitle}>Thanks! Review submitted</Text>
                <Text style={styles.toastSub}>
                  It goes live in 7 days or when they review you.
                </Text>
              </View>
            </View>

            {/* Home Summary Cards below toast */}
            <View style={styles.homePreviewCard}>
              <View style={styles.homePreviewHeader}>
                <Text style={styles.homePreviewTag}>● Pickup today</Text>
                <Text style={styles.homePreviewTime}>10:00–11:00</Text>
              </View>
              <Text style={styles.homePreviewTitle}>
                Kubwa Green Hub is coming
              </Text>
              <Text style={styles.homePreviewSub}>PET bottles · ~3 kg</Text>
              <View style={styles.homePreviewEscrowStrip}>
                <Text style={styles.homePreviewEscrowText}>
                  🔒 ₦450 is safe with EcoSmart for this pickup
                </Text>
              </View>
              <TouchableOpacity
                style={styles.viewPickupOutlineBtn}
                onPress={() => router.push('/pickup/REQ-001')}
              >
                <Text style={styles.viewPickupOutlineText}>View pickup</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.homeQuickRowCard}
              onPress={() => router.push('/scan')}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.homeQuickRowTitle}>Have more waste?</Text>
                <Text style={styles.homeQuickRowSub}>
                  Scan it to see what it's worth
                </Text>
              </View>
              <Text style={styles.chevronArrow}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeQuickRowCard}
              onPress={() => router.push('/wanted')}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.homeQuickRowTitle}>
                  Buyers want PET near you
                </Text>
                <Text style={styles.homeQuickRowSub}>
                  3 recyclers already set money aside · up to ₦150/kg
                </Text>
              </View>
              <Text style={styles.chevronArrow}>›</Text>
            </TouchableOpacity>

            <View style={styles.homeQuickRowCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.homeQuickRowSub}>Your wallet</Text>
                <Text style={styles.homeWalletAmount}>₦1,240</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/home')}>
                <Text style={styles.cashOutGreenLink}>Cash out</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 3.11 SMS · Accepted & 3.11 SMS · Receipt              */}
        {/* ===================================================== */}
        {(mode === '3.11_sms_accepted' || mode === '3.11_sms_receipt') && (
          <View style={styles.smsScreenContainer}>
            <View style={styles.smsHeader}>
              <View style={styles.smsAvatarCircle}>
                <Text style={styles.smsAvatarLetter}>E</Text>
              </View>
              <Text style={styles.smsSenderName}>EcoSmart</Text>
              <Text style={styles.smsServiceLabel}>Text message</Text>
            </View>

            <Text style={styles.smsTimestamp}>
              {mode === '3.11_sms_accepted'
                ? 'Sat 9 Nov · 09:41'
                : 'Sat 9 Nov · 14:15'}
            </Text>

            <View style={styles.smsBubble}>
              <Text style={styles.smsBubbleText}>
                {mode === '3.11_sms_accepted'
                  ? 'EcoSmart: Kubwa Green Hub accepted your PET pickup, Sat 9 Nov, 2-3pm. N450 is set aside for you. Your code shows in the app after you accept the final amount.'
                  : 'EcoSmart: N384 paid to your wallet for 3.2kg PET (Kubwa Green Hub). Ref ES-2091. Problem? Report it in the app within 24 hours.'}
              </Text>
            </View>

            <View style={styles.smsFooterNote}>
              <Info size={14} color="#64748B" />
              <Text style={styles.smsFooterNoteText}>
                Preview of the SMS in the phone's own Messages app. Uses N instead of ₦ so it shows on every phone. Under 160 characters.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <BottomNavBar activeTab="requests" />
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
  topBackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1E12',
  },
  reqIdText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
  },
  paidHeroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  greenCheckCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  paidHeroTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 4,
  },
  paidHeroMeta: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 16,
  },
  statsBoxesRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  statGreyBox: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  statBoxLabel: {
    fontSize: 11.5,
    color: '#64748B',
    marginBottom: 4,
  },
  statBoxVal: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F1E12',
  },
  quickRateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickRateTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  quickPillsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  quickTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  quickTagPillSelected: {
    backgroundColor: '#E4F3D8',
    borderColor: '#2D6A2E',
    borderWidth: 1.5,
  },
  quickTagText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  quickTagTextSelected: {
    color: '#2D6A2E',
    fontWeight: '700',
  },
  writeFullReviewLink: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  writeFullReviewText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2D6A2E',
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

  /* 3.12 Full Review */
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    marginBottom: 14,
  },
  recyclerSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  recyclerThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  recyclerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1E12',
  },
  recyclerPartnerText: {
    fontSize: 12,
    color: '#2D6A2E',
    marginTop: 1,
  },
  recyclerMetaText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  bigRatingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  yourRatingLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 10,
  },
  bigStarsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  ratingCaptionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  sectionLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 8,
  },
  chipsWrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  feedbackChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  feedbackChipSelected: {
    backgroundColor: '#E4F3D8',
    borderColor: '#2D6A2E',
    borderWidth: 1.5,
  },
  feedbackChipWarnSelected: {
    backgroundColor: '#FEF3C7',
    borderColor: '#D97706',
    borderWidth: 1.5,
  },
  feedbackChipText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },
  feedbackChipTextSelected: {
    color: '#2D6A2E',
    fontWeight: '700',
  },
  feedbackChipWarnText: {
    color: '#92400E',
    fontWeight: '700',
  },
  commentInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    fontSize: 13.5,
    color: '#0F1E12',
    minHeight: 78,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  addPhotoDashedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 12,
    backgroundColor: '#FAFDF9',
    marginBottom: 18,
  },
  addPhotoDashedText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  reportPrivatelyBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  reportPrivatelyText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#2D6A2E',
  },

  /* 3.13 Review Submitted Toast */
  reviewSubmittedToast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
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
    fontSize: 14,
    fontWeight: '800',
    color: '#0F1E12',
  },
  toastSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  homePreviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  homePreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  homePreviewTag: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  homePreviewTime: {
    fontSize: 12,
    color: '#64748B',
  },
  homePreviewTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F1E12',
  },
  homePreviewSub: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 10,
  },
  homePreviewEscrowStrip: {
    backgroundColor: '#EAF5EA',
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },
  homePreviewEscrowText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E5D2E',
  },
  viewPickupOutlineBtn: {
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: '#2D6A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewPickupOutlineText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  homeQuickRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  homeQuickRowTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
  homeQuickRowSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  chevronArrow: {
    fontSize: 20,
    color: '#94A3B8',
  },
  homeWalletAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1E12',
    marginTop: 2,
  },
  cashOutGreenLink: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },

  /* 3.11 SMS Previews */
  smsScreenContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    minHeight: 420,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  smsHeader: {
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  smsAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  smsAvatarLetter: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  smsSenderName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
  smsServiceLabel: {
    fontSize: 11,
    color: '#94A3B8',
  },
  smsTimestamp: {
    fontSize: 11.5,
    color: '#94A3B8',
    textAlign: 'center',
    marginVertical: 14,
  },
  smsBubble: {
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 14,
    alignSelf: 'flex-start',
    maxWidth: '90%',
    marginBottom: 'auto',
  },
  smsBubbleText: {
    fontSize: 13.5,
    color: '#0F1E12',
    lineHeight: 20,
  },
  smsFooterNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginTop: 40,
  },
  smsFooterNoteText: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
    flex: 1,
  },
});
