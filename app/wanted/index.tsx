import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Star,
  MessageCircle,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomNavBar } from '../../components/common/BottomNavBar';

export interface WantedOffer {
  id: string;
  recyclerId: string;
  recyclerName: string;
  rating: number;
  reviewCount: number;
  distanceKm: number;
  material: 'PET' | 'HDPE';
  ratePerKg: number;
  availableKg: number;
  promisedKg: number;
  endsText: string;
  endsShort: string;
  minDropOffKg: number;
  minPickupKg: number;
  address: string;
  avatarType: 'yard' | 'bales' | 'worker';
}

export const WANTED_OFFERS: WantedOffer[] = [
  {
    id: 'kubwa-green-hub',
    recyclerId: 'kubwa-green-hub',
    recyclerName: 'Kubwa Green Hub',
    rating: 4.8,
    reviewCount: 124,
    distanceKm: 1.2,
    material: 'PET',
    ratePerKg: 120,
    availableKg: 600,
    promisedKg: 400,
    endsText: 'Ends Sat 9 Nov, 18:00',
    endsShort: 'Sat 9 Nov',
    minDropOffKg: 1,
    minPickupKg: 5,
    address: '18 Gado Nasko Road',
    avatarType: 'yard',
  },
  {
    id: 'bwari-renew',
    recyclerId: 'bwari-renew',
    recyclerName: 'Bwari Renew',
    rating: 4.7,
    reviewCount: 86,
    distanceKm: 2.1,
    material: 'PET',
    ratePerKg: 150,
    availableKg: 250,
    promisedKg: 150,
    endsText: 'Ends Sun 10 Nov, 18:00',
    endsShort: 'Sun 10 Nov',
    minDropOffKg: 1,
    minPickupKg: 3,
    address: 'Bwari Road, Bwari',
    avatarType: 'bales',
  },
  {
    id: 'savanna-recycle',
    recyclerId: 'savanna-recycle',
    recyclerName: 'Savanna Recycle',
    rating: 4.6,
    reviewCount: 52,
    distanceKm: 2.8,
    material: 'PET',
    ratePerKg: 135,
    availableKg: 180,
    promisedKg: 120,
    endsText: 'Ends Mon 11 Nov, 18:00',
    endsShort: 'Mon 11 Nov',
    minDropOffKg: 1,
    minPickupKg: 3,
    address: 'Phase 4, Kubwa',
    avatarType: 'worker',
  },
];

export default function WantedListScreen() {
  const router = useRouter();

  // Demo mode: '5.01' (List) | '6.08' (Empty)
  const [demoMode, setDemoMode] = useState<'5.01' | '6.08'>('5.01');
  const [materialFilter, setMaterialFilter] = useState<'All' | 'PET' | 'HDPE'>('PET');
  const [sortBy, setSortBy] = useState<'Price' | 'Distance' | 'Ending soon'>('Distance');
  const [notified, setNotified] = useState(false);

  const filteredOffers = useMemo(() => {
    if (demoMode === '6.08') return [];
    let list = [...WANTED_OFFERS];
    if (materialFilter === 'HDPE') {
      return [];
    }
    if (sortBy === 'Price') {
      list.sort((a, b) => b.ratePerKg - a.ratePerKg);
    } else if (sortBy === 'Distance') {
      list.sort((a, b) => a.distanceKm - b.distanceKm);
    }
    return list;
  }, [demoMode, materialFilter, sortBy]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader showBack={false} rightAction="bell" />

      {/* Demo Switcher */}
      <View style={styles.demoBar}>
        <Text style={styles.demoTitle}>Screen 05:</Text>
        <TouchableOpacity
          style={[styles.demoPill, demoMode === '5.01' && styles.demoPillActive]}
          onPress={() => {
            setDemoMode('5.01');
            setMaterialFilter('PET');
          }}
        >
          <Text style={[styles.demoPillText, demoMode === '5.01' && styles.demoPillTextActive]}>
            5.01 Wanted · List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoPill, demoMode === '6.08' && styles.demoPillActive]}
          onPress={() => setDemoMode('6.08')}
        >
          <Text style={[styles.demoPillText, demoMode === '6.08' && styles.demoPillTextActive]}>
            6.08 Wanted · Empty
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.demoPill}
          onPress={() => router.push('/wanted/kubwa-green-hub')}
        >
          <Text style={styles.demoPillText}>5.02–5.05 Detail & Sell →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back navigation row */}
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
          <Text style={styles.backText}>Wanted</Text>
        </TouchableOpacity>

        {/* Main Header */}
        <Text style={styles.pageTitle}>Wanted near you</Text>
        <Text style={styles.pageSubtitle}>
          Funded buy requests from local recyclers. Scan your item to sell instantly.
        </Text>

        {/* Filter & Sort Card */}
        <View style={styles.filterCard}>
          <Text style={styles.filterHeaderMeta}>
            {filteredOffers.length > 0
              ? `Kubwa, Abuja · ${filteredOffers.length} funded ${materialFilter === 'All' ? '' : materialFilter + ' '}offers`
              : 'Kubwa, Abuja · Funded offers'}
          </Text>

          <Text style={styles.filterSectionLabel}>Material filter</Text>
          <View style={styles.pillRow}>
            {(['All', 'PET', 'HDPE'] as const).map((mat) => {
              const isSelected = materialFilter === mat;
              return (
                <TouchableOpacity
                  key={mat}
                  style={[styles.filterPill, isSelected && styles.filterPillSelected]}
                  onPress={() => {
                    setMaterialFilter(mat);
                    if (mat === 'HDPE') setDemoMode('6.08');
                    else setDemoMode('5.01');
                  }}
                  activeOpacity={0.75}
                >
                  {isSelected && <Check size={14} color="#2D6A2E" strokeWidth={2.6} />}
                  <Text
                    style={[
                      styles.filterPillText,
                      isSelected && styles.filterPillTextSelected,
                    ]}
                  >
                    {mat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.filterHelperText}>
            Filters Wanted offers only. Your scanned material stays unchanged.
          </Text>

          <Text style={[styles.filterSectionLabel, { marginTop: 12 }]}>Sort by</Text>
          <View style={styles.pillRow}>
            {(['Price', 'Distance', 'Ending soon'] as const).map((s) => {
              const isSelected = sortBy === s;
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.filterPill, isSelected && styles.filterPillSelected]}
                  onPress={() => setSortBy(s)}
                  activeOpacity={0.75}
                >
                  {isSelected && <Check size={14} color="#2D6A2E" strokeWidth={2.6} />}
                  <Text
                    style={[
                      styles.filterPillText,
                      isSelected && styles.filterPillTextSelected,
                    ]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {filteredOffers.length > 0 ? (
          <>
            <Text style={styles.sortedCaption}>
              {sortBy === 'Distance'
                ? 'Sorted by distance · Nearest first'
                : sortBy === 'Price'
                ? 'Sorted by price · Highest rate first'
                : 'Sorted by ending time · Ending soonest'}
            </Text>

            {filteredOffers.map((offer) => (
              <View key={offer.id} style={styles.offerCard}>
                {/* Recycler Row */}
                <View style={styles.recyclerRow}>
                  <Image
                    source={require('../../assets/images/kubwa-yard.jpg')}
                    style={styles.recyclerThumb}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.recyclerName}>{offer.recyclerName}</Text>
                    <View style={styles.verifiedRow}>
                      <CheckCircle2 size={13} color="#2D6A2E" />
                      <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                  </View>
                </View>

                {/* Rating & Distance */}
                <View style={styles.ratingRow}>
                  <Star size={14} color="#D97706" fill="#D97706" />
                  <Text style={styles.ratingBold}>{offer.rating}</Text>
                  <Text style={styles.ratingMeta}>
                    ({offer.reviewCount}) · {offer.distanceKm} km away
                  </Text>
                </View>

                {/* Green Rate & Available Kg Bar */}
                <View style={styles.rateHighlightBar}>
                  <Text style={styles.rateHighlightPrice}>₦{offer.ratePerKg}/kg</Text>
                  <Text style={styles.rateHighlightAvail}>
                    {offer.availableKg} kg available
                  </Text>
                </View>

                {/* Collection Tags */}
                <View style={styles.modeTagsRow}>
                  <View style={styles.modeTagGreen}>
                    <Text style={styles.modeTagGreenText}>Home pickup</Text>
                  </View>
                  <View style={styles.modeTagNeutral}>
                    <Text style={styles.modeTagNeutralText}>Drop-off</Text>
                  </View>
                </View>

                {/* Expiry & Funded Status */}
                <View style={styles.expiryRow}>
                  <Text style={styles.expiryText}>{offer.endsText}</Text>
                  <Text style={styles.fundedText}>Funded</Text>
                </View>

                {/* CTA */}
                <TouchableOpacity
                  style={styles.viewDetailsBtn}
                  onPress={() => router.push(`/wanted/${offer.id}`)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.viewDetailsBtnText}>View details</Text>
                </TouchableOpacity>
              </View>
            ))}

            <Text style={styles.bottomDisclaimer}>
              The recycler has already funded each offer. Payment goes to your wallet after you agree the final amount and the recycler enters your handover code.
            </Text>
          </>
        ) : (
          /* 6.08 Wanted · Empty State */
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <MessageCircle size={30} color="#2D6A2E" />
            </View>
            <Text style={styles.emptyTitle}>No matching Wanted offers</Text>
            <Text style={styles.emptyDesc}>
              There are no funded PET buy requests matching these filters right now. We can notify you when one appears near Kubwa.
            </Text>
            <TouchableOpacity
              style={styles.notifyBtn}
              onPress={() => setNotified(true)}
              activeOpacity={0.85}
            >
              <Text style={styles.notifyBtnText}>
                {notified ? '✓ Alert saved for Kubwa' : 'Notify me'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#EAF5EA',
    borderBottomWidth: 1,
    borderBottomColor: '#C7E4B2',
    gap: 6,
    flexWrap: 'wrap',
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E5D2E',
  },
  demoPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    paddingBottom: 32,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
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
    color: '#475569',
    lineHeight: 19,
    marginBottom: 16,
  },
  filterCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  filterHeaderMeta: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D6A2E',
    marginBottom: 12,
  },
  filterSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 8,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  filterPillSelected: {
    backgroundColor: '#E4F3D8',
    borderColor: '#2D6A2E',
    borderWidth: 1.5,
  },
  filterPillText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  filterPillTextSelected: {
    color: '#2D6A2E',
    fontWeight: '700',
  },
  filterHelperText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
    lineHeight: 17,
  },
  sortedCaption: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 10,
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  recyclerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  recyclerThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  recyclerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 2,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2D6A2E',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  ratingBold: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F1E12',
  },
  ratingMeta: {
    fontSize: 12.5,
    color: '#64748B',
  },
  rateHighlightBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E4F3D8',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    marginBottom: 10,
  },
  rateHighlightPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E5D2E',
  },
  rateHighlightAvail: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#2D6A2E',
  },
  modeTagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  modeTagGreen: {
    backgroundColor: '#EAF5EA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  modeTagGreenText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  modeTagNeutral: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  modeTagNeutralText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#475569',
  },
  expiryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  expiryText: {
    fontSize: 12,
    color: '#64748B',
  },
  fundedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  viewDetailsBtn: {
    backgroundColor: '#38762B',
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewDetailsBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomDisclaimer: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 13.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 22,
  },
  notifyBtn: {
    backgroundColor: '#38762B',
    width: '100%',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
