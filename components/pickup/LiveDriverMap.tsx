import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
import { Truck, MapPin, Navigation } from 'lucide-react-native';

interface Props {
  distanceKm?: number;
  etaMinutes?: number;
}

export const LiveDriverMap: React.FC<Props> = ({
  distanceKm = 0.6,
  etaMinutes = 8,
}) => {
  return (
    <View style={styles.cardContainer}>
      {/* Top Banner with Distance Pill */}
      <View style={styles.mapTopBar}>
        <View style={styles.etaBox}>
          <Text style={styles.etaText}>About {etaMinutes} minutes</Text>
          <Text style={styles.etaSubText}>Get your bottles ready by the gate</Text>
        </View>
        <View style={styles.distanceBadge}>
          <Navigation size={12} color="#15803D" />
          <Text style={styles.distanceBadgeText}>{distanceKm} km away</Text>
        </View>
      </View>

      {/* SVG Canvas Map */}
      <View style={styles.mapCanvas}>
        <Svg width="100%" height={190} viewBox="0 0 380 190">
          <Defs>
            <LinearGradient id="mapBgGradLive" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor="#EBF4E5" stopOpacity="1" />
              <Stop offset="100%" stopColor="#E3EFE0" stopOpacity="1" />
            </LinearGradient>
            <LinearGradient id="routeLineGrad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0%" stopColor="#2D6A2E" stopOpacity="1" />
              <Stop offset="100%" stopColor="#15803D" stopOpacity="1" />
            </LinearGradient>
          </Defs>

          {/* Background Land */}
          <Rect width="380" height="190" fill="url(#mapBgGradLive)" />

          {/* District greenery patches */}
          <Path
            d="M 10,20 Q 60,5 110,30 Q 150,60 120,90 Q 70,110 30,80 Z"
            fill="#D5E8C8"
            opacity={0.6}
          />
          <Path
            d="M 260,90 Q 320,80 360,110 Q 370,160 310,170 Q 250,170 240,130 Z"
            fill="#D5E8C8"
            opacity={0.6}
          />

          {/* Road Network */}
          {/* Main Gado Nasko Road */}
          <Path
            d="M 0,80 Q 190,60 380,95"
            stroke="#FFFFFF"
            strokeWidth="10"
            fill="none"
          />
          <Path
            d="M 0,80 Q 190,60 380,95"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            strokeDasharray="5,5"
            fill="none"
          />

          {/* Byazhin Cross Road */}
          <Path
            d="M 150,190 Q 170,100 200,0"
            stroke="#FFFFFF"
            strokeWidth="8"
            fill="none"
          />

          {/* Inner Connector Road */}
          <Path
            d="M 200,100 L 330,160"
            stroke="#FFFFFF"
            strokeWidth="6"
            fill="none"
          />

          {/* Road labels */}
          <SvgText x="60" y="72" fill="#64748B" fontSize="9" fontWeight="600">
            GADO NASKO ROAD
          </SvgText>
          <SvgText x="195" y="45" fill="#64748B" fontSize="9" fontWeight="600">
            BYAZHIN ROAD
          </SvgText>

          {/* Animated Route Line from Recycler Van to User House */}
          <Path
            d="M 80,78 Q 160,65 178,125"
            stroke="url(#routeLineGrad)"
            strokeWidth="4"
            strokeDasharray="6,4"
            fill="none"
          />

          {/* Destination Marker (User House · 12 Byazhin Road) */}
          <G x="178" y="125">
            <Circle r="14" fill="#15803D" opacity={0.2} />
            <Circle r="7" fill="#15803D" />
            <Circle r="3" fill="#FFFFFF" />
          </G>
          <SvgText x="155" y="152" fill="#15803D" fontSize="10" fontWeight="700">
            Your Gate
          </SvgText>

          {/* Moving Recycler Truck Marker */}
          <G x="80" y="78">
            <Circle r="18" fill="#F59E0B" opacity={0.25} />
            <Circle r="12" fill="#F59E0B" />
          </G>
        </Svg>

        {/* Floating Truck Badge Overlay */}
        <View style={styles.truckIconBadge}>
          <Truck size={14} color="#FFFFFF" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  mapTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  etaBox: {
    flex: 1,
  },
  etaText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F1E12',
  },
  etaSubText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
  },
  distanceBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  mapCanvas: {
    height: 190,
    width: '100%',
    position: 'relative',
    backgroundColor: '#EBF4E5',
  },
  truckIconBadge: {
    position: 'absolute',
    left: '21%',
    top: '34%',
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
});
