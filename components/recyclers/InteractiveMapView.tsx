import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Path,
  G,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { ShieldCheck, Star, MapPin, ChevronRight, Clock, Navigation } from 'lucide-react-native';
import { Recycler } from '../../types/recycler';

interface Props {
  recyclers: Recycler[];
  selectedRecycler: Recycler;
  onSelectRecycler: (recycler: Recycler) => void;
  onViewDetails: (recycler: Recycler) => void;
  userWeightKg?: number;
}

export const InteractiveMapView: React.FC<Props> = ({
  recyclers,
  selectedRecycler,
  onSelectRecycler,
  onViewDetails,
  userWeightKg = 3,
}) => {
  const estimatedPay = Math.round(selectedRecycler.rates.pet * userWeightKg);
  const belowPickupMin = userWeightKg < selectedRecycler.minPickupKg;

  return (
    <View style={styles.container}>
      {/* Map Header Instruction */}
      <View style={styles.mapHeaderBanner}>
        <Text style={styles.mapHeaderText}>
          Pins show what each recycler pays per kg for PET.
        </Text>
      </View>

      {/* Interactive Graphic Map Canvas */}
      <View style={styles.mapCanvasContainer}>
        <Svg width="100%" height={320} viewBox="0 0 380 320">
          <Defs>
            <LinearGradient id="mapBgGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#EBF4E5" stopOpacity="1" />
              <Stop offset="50%" stopColor="#EEF6E8" stopOpacity="1" />
              <Stop offset="100%" stopColor="#E2EFE0" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#C4E0E5" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#A8D0D9" stopOpacity="0.9" />
            </LinearGradient>
          </Defs>

          {/* Background Landmass */}
          <Rect width="380" height="320" fill="url(#mapBgGrad)" />

          {/* District Greenery / Parks */}
          <Path
            d="M 20,40 Q 60,10 110,35 Q 160,60 140,110 Q 110,140 50,120 Z"
            fill="#D5E8C8"
            opacity={0.7}
          />
          <Path
            d="M 260,180 Q 320,160 360,200 Q 380,260 320,290 Q 270,300 250,240 Z"
            fill="#D5E8C8"
            opacity={0.7}
          />

          {/* Waterway / Stream */}
          <Path
            d="M 0,160 Q 80,180 160,130 T 300,160 T 380,120"
            stroke="url(#riverGrad)"
            strokeWidth="12"
            fill="none"
            opacity={0.6}
          />

          {/* Road Network (Kubwa / Abuja expressway & grid) */}
          {/* Main Expressway (Bwari - Kubwa Expressway) */}
          <Path
            d="M 30,0 L 350,320"
            stroke="#FFFFFF"
            strokeWidth="10"
            fill="none"
          />
          <Path
            d="M 30,0 L 350,320"
            stroke="#CBD5E1"
            strokeWidth="2"
            strokeDasharray="6,6"
            fill="none"
          />

          {/* Gado Nasko Road */}
          <Path
            d="M 0,120 Q 180,100 380,140"
            stroke="#FFFFFF"
            strokeWidth="8"
            fill="none"
          />
          <Path
            d="M 0,120 Q 180,100 380,140"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Byazhin Road */}
          <Path
            d="M 120,320 Q 160,200 200,40"
            stroke="#FFFFFF"
            strokeWidth="7"
            fill="none"
          />

          {/* Arab Road / Inner Arteries */}
          <Path
            d="M 60,260 L 280,240"
            stroke="#FFFFFF"
            strokeWidth="5"
            fill="none"
          />
          <Path
            d="M 220,20 L 360,80"
            stroke="#FFFFFF"
            strokeWidth="5"
            fill="none"
          />

          {/* Road Labels */}
          <SvgText x="190" y="98" fill="#64748B" fontSize="9" fontWeight="600">
            GADO NASKO ROAD
          </SvgText>
          <SvgText x="60" y="190" fill="#64748B" fontSize="9" fontWeight="600">
            KUBWA DISTRICT
          </SvgText>
          <SvgText x="270" y="60" fill="#64748B" fontSize="9" fontWeight="600">
            BWARI WAY
          </SvgText>

          {/* User Location Pulse Indicator (Home · Kubwa) */}
          <G x="145" y="160">
            <Circle r="18" fill="#15803D" opacity={0.15} />
            <Circle r="10" fill="#15803D" opacity={0.35} />
            <Circle r="5" fill="#15803D" />
            <Circle r="2.5" fill="#FFFFFF" />
          </G>
          <SvgText x="130" y="190" fill="#15803D" fontSize="10" fontWeight="700">
            You (Kubwa)
          </SvgText>
        </Svg>

        {/* Floating Interactive Price Pins overlay */}
        {recyclers.map((recycler) => {
          const isSelected = selectedRecycler.id === recycler.id;
          return (
            <TouchableOpacity
              key={recycler.id}
              style={[
                styles.mapPin,
                {
                  left: `${recycler.coordinates.x}%`,
                  top: `${recycler.coordinates.y}%`,
                },
                isSelected && styles.mapPinActive,
                !recycler.openToday && styles.mapPinClosed,
              ]}
              onPress={() => onSelectRecycler(recycler)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.mapPinPrice,
                  isSelected && styles.mapPinPriceActive,
                  !recycler.openToday && styles.mapPinPriceClosed,
                ]}
              >
                ₦{recycler.rates.pet}
              </Text>
              {isSelected && <View style={styles.pinArrow} />}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Recycler Sliding Preview Card (matching G-F01m) */}
      <View style={styles.previewCard}>
        {selectedRecycler.id === 'kubwa-green-hub' && (
          <View style={styles.bestMatchTag}>
            <Text style={styles.bestMatchTagText}>Best match for you</Text>
          </View>
        )}

        <View style={styles.previewHeaderRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <Text style={styles.recyclerName}>{selectedRecycler.name}</Text>
              {selectedRecycler.verified && (
                <View style={styles.verifiedBadge}>
                  <ShieldCheck size={13} color="#15803D" />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
              )}
            </View>

            <View style={styles.metaRow}>
              <View style={styles.ratingBadge}>
                <Star size={12} color="#EAB308" fill="#EAB308" />
                <Text style={styles.ratingText}>
                  {selectedRecycler.rating} ({selectedRecycler.reviewCount})
                </Text>
              </View>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{selectedRecycler.distanceKm} km</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>{selectedRecycler.replyTime}</Text>
            </View>
          </View>

          {/* Price Tag */}
          <View style={styles.priceContainer}>
            <Text style={styles.rateHighlight}>
              ₦{selectedRecycler.rates.pet}/kg
            </Text>
            <Text style={styles.estimatedTotal}>
              ~₦{estimatedPay} for {userWeightKg} kg
            </Text>
          </View>
        </View>

        {/* Feature Badges */}
        <View style={styles.badgeRow}>
          {selectedRecycler.pickupAvailable && (
            <View style={styles.pillBadge}>
              <Text style={styles.pillBadgeText}>
                Home pickup from {selectedRecycler.minPickupKg} kg
              </Text>
            </View>
          )}
          {selectedRecycler.dropoffAvailable && (
            <View style={styles.pillBadge}>
              <Text style={styles.pillBadgeText}>
                Drop-off from {selectedRecycler.minDropoffKg} kg
              </Text>
            </View>
          )}
          {selectedRecycler.openToday ? (
            <View style={styles.openBadge}>
              <Clock size={11} color="#15803D" />
              <Text style={styles.openBadgeText}>Available today</Text>
            </View>
          ) : (
            <View style={styles.closedBadge}>
              <Text style={styles.closedBadgeText}>
                {selectedRecycler.openingHours.split('\n')[0]}
              </Text>
            </View>
          )}
        </View>

        {/* Minimum Alert if applicable */}
        {belowPickupMin && (
          <View style={styles.belowMinNotice}>
            <Text style={styles.belowMinNoticeText}>
              Your ~{userWeightKg} kg is below their {selectedRecycler.minPickupKg} kg
              pickup minimum. You can drop it off at their yard instead.
            </Text>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity
          style={styles.viewDetailsBtn}
          onPress={() => onViewDetails(selectedRecycler)}
          activeOpacity={0.85}
        >
          <Text style={styles.viewDetailsBtnText}>View details</Text>
          <ChevronRight size={17} color="#0F1E12" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapHeaderBanner: {
    backgroundColor: '#F1F8EE',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  mapHeaderText: {
    fontSize: 13,
    color: '#2D6A2E',
    fontWeight: '600',
    textAlign: 'center',
  },
  mapCanvasContainer: {
    height: 320,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#EBF4E5',
  },
  mapPin: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#0F1E12',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 5,
    elevation: 4,
    transform: [{ translateX: -24 }, { translateY: -16 }],
  },
  mapPinActive: {
    backgroundColor: '#0F1E12',
    borderColor: '#0F1E12',
    transform: [{ translateX: -28 }, { translateY: -22 }, { scale: 1.15 }],
    zIndex: 10,
  },
  mapPinClosed: {
    backgroundColor: '#F8FAFC',
    borderColor: '#94A3B8',
    opacity: 0.85,
  },
  mapPinPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F1E12',
  },
  mapPinPriceActive: {
    color: '#FFFFFF',
  },
  mapPinPriceClosed: {
    color: '#64748B',
  },
  pinArrow: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#0F1E12',
  },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 18,
    borderTopWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  bestMatchTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#EAF5EA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  bestMatchTagText: {
    color: '#2D6A2E',
    fontSize: 11,
    fontWeight: '700',
  },
  previewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  recyclerName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F1E12',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
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
    flexWrap: 'wrap',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  metaDot: {
    marginHorizontal: 5,
    color: '#94A3B8',
    fontSize: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  rateHighlight: {
    fontSize: 18,
    fontWeight: '900',
    color: '#2D6A2E',
  },
  estimatedTotal: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  pillBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillBadgeText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  openBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAF5EA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  openBadgeText: {
    fontSize: 11,
    color: '#15803D',
    fontWeight: '700',
  },
  closedBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  closedBadgeText: {
    fontSize: 11,
    color: '#B91C1C',
    fontWeight: '600',
  },
  belowMinNotice: {
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: 12,
  },
  belowMinNoticeText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16,
  },
  viewDetailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F4F9F2',
    borderWidth: 1.2,
    borderColor: '#0F1E12',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  viewDetailsBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
});
