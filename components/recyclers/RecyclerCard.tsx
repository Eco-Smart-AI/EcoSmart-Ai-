import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ShieldCheck, Star, Clock, ChevronRight } from 'lucide-react-native';
import { Recycler } from '../../types/recycler';

interface Props {
  recycler: Recycler;
  isBestMatch?: boolean;
  userWeightKg?: number;
  onViewDetails: (recycler: Recycler) => void;
}

export const RecyclerCard: React.FC<Props> = ({
  recycler,
  isBestMatch = false,
  userWeightKg = 3,
  onViewDetails,
}) => {
  const estimatedPayout = Math.round(recycler.rates.pet * userWeightKg);
  const isBelowPickupMin = userWeightKg < recycler.minPickupKg;

  return (
    <View style={[styles.card, isBestMatch && styles.bestMatchCard]}>
      {/* Best match flag */}
      {isBestMatch && (
        <View style={styles.bestMatchHeader}>
          <Text style={styles.bestMatchHeaderText}>Best match for you</Text>
        </View>
      )}

      {/* Main card info */}
      <View style={styles.cardBody}>
        {/* Top row: Name & Payout */}
        <View style={styles.topRow}>
          <View style={styles.nameBlock}>
            <View style={styles.titleWithBadge}>
              <Text style={styles.recyclerName}>{recycler.name}</Text>
              {recycler.verified && (
                <View style={styles.verifiedTag}>
                  <ShieldCheck size={12} color="#15803D" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>

            <View style={styles.metaRow}>
              <View style={styles.ratingBox}>
                <Star size={11} color="#EAB308" fill="#EAB308" />
                <Text style={styles.ratingNumber}>{recycler.rating}</Text>
                <Text style={styles.reviewCount}>({recycler.reviewCount})</Text>
              </View>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.distanceText}>{recycler.distanceKm} km</Text>
            </View>
          </View>

          {/* Pricing Box */}
          <View style={styles.pricingBox}>
            <Text style={styles.rateValue}>₦{recycler.rates.pet}/kg</Text>
            <Text style={styles.totalEstimate}>
              ~₦{estimatedPayout} for {userWeightKg} kg
            </Text>
          </View>
        </View>

        {/* Collection & Availability badges */}
        <View style={styles.badgesRow}>
          {recycler.pickupAvailable && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Home pickup</Text>
            </View>
          )}
          {recycler.dropoffAvailable && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Drop-off</Text>
            </View>
          )}
          {recycler.openToday ? (
            <View style={styles.openBadge}>
              <Clock size={11} color="#15803D" />
              <Text style={styles.openBadgeText}>Available today</Text>
            </View>
          ) : (
            <View style={styles.closedBadge}>
              <Text style={styles.closedBadgeText}>
                {recycler.openingHours.split('\n')[0]}
              </Text>
            </View>
          )}
        </View>

        {/* Pickup minimum detail */}
        <Text style={styles.minDetailText}>
          {recycler.pickupAvailable && `Picks up from ${recycler.minPickupKg} kg`}
          {recycler.pickupAvailable && recycler.dropoffAvailable && ' · '}
          {recycler.dropoffAvailable && `Drop-off from ${recycler.minDropoffKg} kg`}
        </Text>

        {/* Warning if below pickup min */}
        {recycler.pickupAvailable && isBelowPickupMin && (
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Your ~{userWeightKg} kg is below their {recycler.minPickupKg} kg pickup
              minimum. You can drop it off at their yard instead.
            </Text>
          </View>
        )}

        {/* View Details Button */}
        <TouchableOpacity
          style={styles.detailsBtn}
          onPress={() => onViewDetails(recycler)}
          activeOpacity={0.8}
        >
          <Text style={styles.detailsBtnText}>View details</Text>
          <ChevronRight size={16} color="#0F1E12" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  bestMatchCard: {
    borderColor: '#C8E6C9',
    backgroundColor: '#FAFCF8',
    borderWidth: 1.5,
  },
  bestMatchHeader: {
    backgroundColor: '#EAF5EA',
    paddingVertical: 5,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#D5E8C8',
  },
  bestMatchHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2D6A2E',
    letterSpacing: 0.3,
  },
  cardBody: {
    padding: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  nameBlock: {
    flex: 1,
    paddingRight: 8,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  recyclerName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F1E12',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 2,
  },
  reviewCount: {
    fontSize: 11,
    color: '#64748B',
  },
  dot: {
    marginHorizontal: 5,
    color: '#94A3B8',
  },
  distanceText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  pricingBox: {
    alignItems: 'flex-end',
  },
  rateValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#2D6A2E',
  },
  totalEstimate: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  badge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  openBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#EAF5EA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  openBadgeText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '700',
  },
  closedBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  closedBadgeText: {
    fontSize: 11,
    color: '#B91C1C',
    fontWeight: '600',
  },
  minDetailText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  warningBox: {
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: 10,
  },
  warningText: {
    fontSize: 11.5,
    color: '#92400E',
    lineHeight: 16,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F9F2',
    borderWidth: 1.2,
    borderColor: '#0F1E12',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 4,
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
  },
});
