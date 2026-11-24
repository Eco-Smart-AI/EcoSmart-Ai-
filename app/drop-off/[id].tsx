import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Linking,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  MapPin,
  ExternalLink,
  Phone,
  MessageSquare,
  CheckCircle2,
  ShieldCheck,
  Scale,
  Navigation,
  Clock,
  AlertCircle,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomNavBar } from '../../components/common/BottomNavBar';
import { DropOffStepper, DropOffStage } from '../../components/dropoff/DropOffStepper';

export default function DropOffScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const requestId = (id as string) || 'REQ-001';

  // Demo state switcher: 'G-T01' | 'G-T02' | 'G-T03'
  const [demoState, setDemoState] = useState<'G-T01' | 'G-T02' | 'G-T03'>('G-T01');

  // Map demoState to stepper stage
  const currentStage: DropOffStage =
    demoState === 'G-T01' ? 'accepted' : demoState === 'G-T02' ? 'on_my_way' : 'at_yard';

  const handleOpenMaps = () => {
    const address = '18 Gado Nasko Road, Kubwa, Abuja';
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
      default: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
    });
    Linking.openURL(url).catch(() => alert('Could not open map'));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader showBack={true} rightAction="bell" />

      {/* Demo Switcher */}
      <View style={styles.demoBar}>
        <Text style={styles.demoTitle}>Demo Flow:</Text>
        <TouchableOpacity
          style={[styles.demoPill, demoState === 'G-T01' && styles.demoPillActive]}
          onPress={() => setDemoState('G-T01')}
        >
          <Text style={[styles.demoPillText, demoState === 'G-T01' && styles.demoPillTextActive]}>
            G-T01 (Accepted)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoPill, demoState === 'G-T02' && styles.demoPillActive]}
          onPress={() => setDemoState('G-T02')}
        >
          <Text style={[styles.demoPillText, demoState === 'G-T02' && styles.demoPillTextActive]}>
            G-T02 (On way)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoPill, demoState === 'G-T03' && styles.demoPillActive]}
          onPress={() => setDemoState('G-T03')}
        >
          <Text style={[styles.demoPillText, demoState === 'G-T03' && styles.demoPillTextActive]}>
            G-T03 (At yard)
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Bar */}
        <View style={styles.screenHeader}>
          <Text style={styles.badgeText}>
            Drop-off · {demoState === 'G-T01' ? 'Accepted' : demoState === 'G-T02' ? 'On my way' : 'At the yard'}
          </Text>
          <Text style={styles.reqCode}>{requestId}</Text>
        </View>

        {/* Stepper */}
        <DropOffStepper currentStage={currentStage} />

        {/* Hero Title & Subtitle */}
        {demoState === 'G-T01' && (
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Get ready for your drop-off</Text>
            <Text style={styles.subTitle}>
              Today, afternoon. Kubwa Green Hub is expecting you.
            </Text>
          </View>
        )}

        {demoState === 'G-T02' && (
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>You're on your way</Text>
            <Text style={styles.subTitle}>
              We told Kubwa Green Hub you're coming. Tap below when you get there.
            </Text>
          </View>
        )}

        {demoState === 'G-T03' && (
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>You're at the yard</Text>
            <Text style={styles.subTitle}>
              Watch them weigh your bottles. Next, you'll check the amount in the app.
            </Text>
          </View>
        )}

        {/* Escrow Card: Set aside for you */}
        <View style={styles.escrowCard}>
          <View style={styles.escrowRow}>
            <View>
              <Text style={styles.escrowLabel}>Set aside for you</Text>
              <Text style={styles.escrowAmount}>₦450</Text>
            </View>
            <View style={styles.escrowShield}>
              <ShieldCheck size={26} color="#2D6A2E" />
            </View>
          </View>
          <Text style={styles.escrowSubtext}>Paid after weighing and your code</Text>
        </View>

        {/* G-T02: Mini Route Tracker Map visual */}
        {demoState === 'G-T02' && (
          <View style={styles.liveNavCard}>
            <View style={styles.liveNavHeader}>
              <View style={styles.liveNavLeft}>
                <Navigation size={18} color="#2D6A2E" />
                <Text style={styles.liveNavTitle}>Heading to Kubwa Green Hub</Text>
              </View>
              <View style={styles.liveNavEtaBadge}>
                <Clock size={12} color="#1E3A8A" />
                <Text style={styles.liveNavEtaText}>~8 mins</Text>
              </View>
            </View>
            <Text style={styles.liveNavDistance}>1.2 km away · Gado Nasko Road</Text>
          </View>
        )}

        {/* Yard Location & Details Card */}
        <View style={styles.yardCard}>
          <View style={styles.yardTopRow}>
            <View style={styles.yardInfo}>
              <Text style={styles.yardName}>Kubwa Green Hub</Text>
              <Text style={styles.yardAddress}>18 Gado Nasko Road, Kubwa · open until 6pm</Text>
            </View>
            <TouchableOpacity
              style={styles.openMapBtn}
              onPress={handleOpenMaps}
              activeOpacity={0.7}
            >
              <MapPin size={16} color="#2D6A2E" />
              <Text style={styles.openMapText}>Open in Maps</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* G-T01: "Before you go" Checklist */}
        {demoState === 'G-T01' && (
          <View style={styles.checklistCard}>
            <Text style={styles.checklistSectionTitle}>Before you go</Text>
            <View style={styles.checkItem}>
              <CheckCircle2 size={18} color="#2D6A2E" />
              <Text style={styles.checkItemText}>Empty and rinse the bottles</Text>
            </View>
            <View style={styles.checkItem}>
              <CheckCircle2 size={18} color="#2D6A2E" />
              <Text style={styles.checkItemText}>Keep caps in a separate bag</Text>
            </View>
          </View>
        )}

        {/* G-T03: 3-step Instructions at the yard */}
        {demoState === 'G-T03' && (
          <View style={styles.yardStepsCard}>
            <View style={styles.yardStepRow}>
              <View style={styles.yardStepNum}>
                <Text style={styles.yardStepNumText}>1</Text>
              </View>
              <Text style={styles.yardStepText}>They weigh your bottles in front of you</Text>
            </View>

            <View style={styles.yardStepDivider} />

            <View style={styles.yardStepRow}>
              <View style={styles.yardStepNum}>
                <Text style={styles.yardStepNumText}>2</Text>
              </View>
              <Text style={styles.yardStepText}>
                You check the weight and amount here, then accept
              </Text>
            </View>

            <View style={styles.yardStepDivider} />

            <View style={styles.yardStepRow}>
              <View style={styles.yardStepNum}>
                <Text style={styles.yardStepNumText}>3</Text>
              </View>
              <Text style={styles.yardStepText}>Only then you give them your code</Text>
            </View>
          </View>
        )}

        {/* Secondary Communication Pills: Chat & Call */}
        <View style={styles.commRow}>
          <TouchableOpacity
            style={styles.commPill}
            onPress={() => router.push('/chat/kubwa-green-hub')}
            activeOpacity={0.7}
          >
            <MessageSquare size={16} color="#2D6A2E" />
            <Text style={styles.commPillText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.commPill}
            onPress={() => router.push('/call/kubwa-green-hub')}
            activeOpacity={0.7}
          >
            <Phone size={16} color="#2D6A2E" />
            <Text style={styles.commPillText}>Call</Text>
          </TouchableOpacity>
        </View>

        {/* Primary CTA according to stage */}
        {demoState === 'G-T01' && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setDemoState('G-T02')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>I'm on my way</Text>
          </TouchableOpacity>
        )}

        {demoState === 'G-T02' && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => setDemoState('G-T03')}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryBtnText}>I've arrived</Text>
          </TouchableOpacity>
        )}

        {demoState === 'G-T03' && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push('/pickup/REQ-001')}
            activeOpacity={0.8}
          >
            <Scale size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryBtnText}>See the weight and amount</Text>
          </TouchableOpacity>
        )}

        {/* Dispute / Exceptions link */}
        <TouchableOpacity
          style={styles.issueLink}
          onPress={() => router.push('/negotiation')}
          activeOpacity={0.7}
        >
          <AlertCircle size={14} color="#64748B" />
          <Text style={styles.issueLinkText}>Issues or counter-rate offered?</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="requests" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  demoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#EFF6FF',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    gap: 6,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  demoPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  demoPillActive: {
    backgroundColor: '#2D6A2E',
    borderColor: '#2D6A2E',
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  demoPillTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 32,
  },
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D6A2E',
    backgroundColor: '#EAF5EA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reqCode: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  titleSection: {
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subTitle: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  escrowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  escrowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  escrowLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  escrowAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F1E12',
  },
  escrowShield: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EAF5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  escrowSubtext: {
    fontSize: 12,
    color: '#64748B',
  },
  liveNavCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  liveNavHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  liveNavLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liveNavTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
  },
  liveNavEtaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  liveNavEtaText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },
  liveNavDistance: {
    fontSize: 12,
    color: '#0284C7',
    marginLeft: 26,
  },
  yardCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  yardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  yardInfo: {
    flex: 1,
    marginRight: 10,
  },
  yardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 4,
  },
  yardAddress: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  openMapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#EAF5EA',
    borderRadius: 12,
  },
  openMapText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  checklistSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 12,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  checkItemText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  yardStepsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  yardStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  yardStepNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EAF5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  yardStepNumText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2D6A2E',
  },
  yardStepText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
  },
  yardStepDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  commRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  commPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2D6A2E',
    borderRadius: 24,
  },
  commPillText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  primaryBtn: {
    backgroundColor: '#2D6A2E',
    paddingVertical: 15,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D6A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  issueLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  issueLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textDecorationLine: 'underline',
  },
});
