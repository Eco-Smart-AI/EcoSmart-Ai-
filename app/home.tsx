import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  Bell,
  MapPin,
  Wallet,
  ArrowUp,
  Truck,
  Scan,
  Tag,
  Leaf,
  Check,
  ChevronRight,
  Home as HomeIcon,
  Inbox,
  User as UserIcon,
} from 'lucide-react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

import { TopGreenWave } from '../components/common/TopGreenWave';
import { BottomNavBar } from '../components/common/BottomNavBar';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  // Toggle between G-H01 (Pickup in progress) and G-H02 (First visit)
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [minaModalVisible, setMinaModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'scan' | 'requests' | 'profile'>('home');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar: Logo, View Toggle Pill, Notification Bell */}
      <View style={styles.topHeader}>
        <View style={styles.logoRow}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Demo state switch (G-H01 vs G-H02) */}
        <TouchableOpacity
          style={styles.stateTogglePill}
          onPress={() => setIsFirstVisit(!isFirstVisit)}
          activeOpacity={0.7}
        >
          <Text style={styles.stateToggleText}>
            {isFirstVisit ? 'View: G-H02 (First)' : 'View: G-H01 (Active)'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bellBtn}
          activeOpacity={0.7}
          onPress={() => router.push('/profile' as any)}
        >
          <Bell size={20} color="#0F1E12" />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      {/* Small Green Wave Strip directly under topHeader */}
      <TopGreenWave height={22} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* User Greeting and Location */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>
            {isFirstVisit ? t('home.welcome') : t('home.goodMorning')}
          </Text>
          <View style={styles.locationRow}>
            <MapPin size={14} color="#64748B" />
            <Text style={styles.locationText}>{t('home.location')}</Text>
          </View>
        </View>

        {/* G-H02: First Visit "Start by scanning" Card */}
        {isFirstVisit && (
          <View style={styles.firstScanCard}>
            <View style={styles.scanIconCircle}>
              <Scan size={26} color="#2D6A2E" />
            </View>
            <Text style={styles.firstScanTitle}>{t('home.startScanning')}</Text>
            <Text style={styles.firstScanSub}>{t('home.startScanningSub')}</Text>
            <TouchableOpacity
              style={styles.firstScanBtn}
              activeOpacity={0.85}
              onPress={() => router.push('/scan')}
            >
              <Text style={styles.firstScanBtnText}>{t('home.scanMyWaste')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* EcoSmart Wallet Card */}
        <View style={styles.walletCard}>
          <Svg
            style={StyleSheet.absoluteFill}
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          >
            <Defs>
              <LinearGradient id="walletGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor="#1E5D2E" />
                <Stop offset="100%" stopColor="#2E7D3E" />
              </LinearGradient>
            </Defs>
            <Path
              d="M0,0 L400,0 L400,240 C300,210 100,270 0,240 Z"
              fill="url(#walletGrad)"
            />
          </Svg>

          {/* Wallet Header */}
          <View style={styles.walletHeader}>
            <Wallet size={15} color="#A7D7A9" />
            <Text style={styles.walletTag}>ECOSMART WALLET</Text>
          </View>

          {/* Available balance */}
          <Text style={styles.availableLabel}>
            {isFirstVisit ? 'Your money will show here' : t('home.available')}
          </Text>
          <Text style={styles.availableValue}>
            {isFirstVisit ? '₦0' : '₦1,624'}
          </Text>

          {/* Sub balances row */}
          <View style={styles.walletSubRow}>
            <View style={styles.walletSubBox}>
              <Text style={styles.subBoxLabel}>🔒 {t('home.onHold')}</Text>
              <Text style={styles.subBoxValue}>
                {isFirstVisit ? '₦0' : '₦450'}
              </Text>
              <Text style={styles.subBoxMeta}>
                {isFirstVisit ? t('home.nothingOnHold') : t('home.paidAfterPickup')}
              </Text>
            </View>

            <View style={styles.walletSubBox}>
              <Text style={styles.subBoxLabel}>{t('home.earnedSoFar')}</Text>
              <Text style={styles.subBoxValue}>
                {isFirstVisit ? '₦0' : '₦2,624'}
              </Text>
              <Text style={styles.subBoxMeta}>
                {isFirstVisit ? t('home.sellFirstItem') : t('home.fromPickups')}
              </Text>
            </View>
          </View>

          {/* Cash Out Button (shown when funds available) */}
          {!isFirstVisit && (
            <TouchableOpacity
              style={styles.cashOutBtn}
              activeOpacity={0.85}
              onPress={() => router.push('/wallet' as any)}
            >
              <ArrowUp size={16} color="#1E5D2E" />
              <Text style={styles.cashOutText}>{t('home.cashOut')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* G-H01: Active Pickup in Progress Card */}
        {!isFirstVisit && (
          <View style={styles.pickupCard}>
            <View style={styles.pickupTimeRow}>
              <View style={styles.pickupStatusDot} />
              <Text style={styles.pickupTimeText}>{t('home.pickupToday')}</Text>
            </View>

            <View style={styles.pickupMainRow}>
              <View style={styles.truckIconBox}>
                <Truck size={22} color="#D97706" />
              </View>
              <View style={styles.pickupInfo}>
                <Text style={styles.pickupTitle}>{t('home.hubComing')}</Text>
                <Text style={styles.pickupSub}>{t('home.petBottles')}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <TouchableOpacity
                style={[styles.viewPickupBtn, { flex: 1, marginTop: 0 }]}
                activeOpacity={0.8}
                onPress={() => router.push('/pickup/REQ-001' as any)}
              >
                <Text style={styles.viewPickupText}>{t('home.viewPickup')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewPickupBtn, { flex: 1, marginTop: 0, backgroundColor: '#EAF5EA' }]}
                activeOpacity={0.8}
                onPress={() => router.push('/drop-off/REQ-001' as any)}
              >
                <Text style={[styles.viewPickupText, { color: '#2D6A2E' }]}>Yard Drop-Off</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Quick Action Tiles (Scan waste, Find recyclers, Buyers want) */}
        {!isFirstVisit && (
          <View style={styles.actionTilesRow}>
            <TouchableOpacity
              style={styles.actionTile}
              activeOpacity={0.8}
              onPress={() => router.push('/scan')}
            >
              <View style={styles.actionTileIcon}>
                <Scan size={22} color="#15803D" />
              </View>
              <Text style={styles.actionTileLabel}>{t('home.scanWaste')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionTile}
              activeOpacity={0.8}
              onPress={() => router.push('/recyclers')}
            >
              <View style={styles.actionTileIcon}>
                <MapPin size={22} color="#15803D" />
              </View>
              <Text style={styles.actionTileLabel}>{t('home.findRecyclers')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionTile}
              activeOpacity={0.8}
              onPress={() => router.push('/wanted' as any)}
            >
              <View style={styles.actionTileIcon}>
                <Tag size={22} color="#15803D" />
              </View>
              <Text style={styles.actionTileLabel}>{t('home.buyersWant')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* G-H02: How It Works section */}
        {isFirstVisit && (
          <View style={styles.howItWorksCard}>
            <Text style={styles.sectionHeaderTitle}>How it works</Text>

            <View style={styles.howStepRow}>
              <View style={styles.howBadge}><Text style={styles.howBadgeText}>1</Text></View>
              <View style={styles.howInfo}>
                <Text style={styles.howTitle}>Scan</Text>
                <Text style={styles.howSub}>See what it is and what it's worth</Text>
              </View>
            </View>

            <View style={styles.howStepRow}>
              <View style={styles.howBadge}><Text style={styles.howBadgeText}>2</Text></View>
              <View style={styles.howInfo}>
                <Text style={styles.howTitle}>Choose a recycler</Text>
                <Text style={styles.howSub}>They come to you, or you drop off</Text>
              </View>
            </View>

            <View style={styles.howStepRow}>
              <View style={styles.howBadge}><Text style={styles.howBadgeText}>3</Text></View>
              <View style={styles.howInfo}>
                <Text style={styles.howTitle}>Get paid</Text>
                <Text style={styles.howSub}>Money goes to your EcoSmart wallet</Text>
              </View>
            </View>
          </View>
        )}

        {/* Demand Banner: Buyers want PET near you */}
        <TouchableOpacity
          style={styles.demandBanner}
          activeOpacity={0.8}
          onPress={() => router.push('/wanted' as any)}
        >
          <View style={styles.demandIconBox}>
            <Tag size={18} color="#2D6A2E" />
          </View>
          <View style={styles.demandInfo}>
            <Text style={styles.demandTitle}>Buyers want PET near you</Text>
            <Text style={styles.demandSub}>
              3 recyclers already set money aside · up to ₦150/kg
            </Text>
          </View>
          <ChevronRight size={18} color="#94A3B8" />
        </TouchableOpacity>

        {/* G-H01: Milestone / Weight Recycled Tile */}
        {!isFirstVisit && (
          <View style={styles.milestoneTile}>
            <View style={styles.milestoneLeaf}>
              <Leaf size={18} color="#15803D" />
            </View>
            <View style={styles.milestoneInfo}>
              <Text style={styles.milestoneTitle}>{t('home.recycledSoFar')}</Text>
              <Text style={styles.milestoneSub}>{t('home.keepItUp')}</Text>
            </View>
          </View>
        )}

        {/* G-H01: Recent Activity List */}
        {!isFirstVisit && (
          <View style={styles.activitySection}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>{t('home.recentActivity')}</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAllText}>{t('home.seeAll')}</Text>
              </TouchableOpacity>
            </View>

            {/* Activity Item 1 */}
            <View style={styles.activityItem}>
              <View style={styles.activityIconCircleGreen}>
                <Check size={16} color="#15803D" strokeWidth={2.5} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>PET · 3.2 kg sold</Text>
                <Text style={styles.activityDate}>Kubwa Green Hub · Sat</Text>
              </View>
              <Text style={styles.activityAmountPositive}>+₦384</Text>
            </View>

            {/* Activity Item 2 */}
            <View style={styles.activityItem}>
              <View style={styles.activityIconCircleBlue}>
                <ArrowUp size={16} color="#2563EB" strokeWidth={2.5} />
              </View>
              <View style={styles.activityInfo}>
                <Text style={styles.activityName}>Cash out to OPay</Text>
                <Text style={styles.activityDate}>Fri</Text>
              </View>
              <Text style={styles.activityAmountNegative}>-₦1,000</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Mina Mascot Avatar Button */}
      <TouchableOpacity
        style={styles.floatingMinaBtn}
        onPress={() => setMinaModalVisible(true)}
        activeOpacity={0.85}
      >
        <Image
          source={require('../assets/images/mina-avatar.png')}
          style={styles.floatingMinaAvatar}
          resizeMode="cover"
        />
        <View style={styles.minaOnlineDot} />
      </TouchableOpacity>

      {/* G-H02: Meet Mina Modal Popup */}
      <Modal
        visible={minaModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMinaModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setMinaModalVisible(false)}
        >
          <View style={styles.minaPopupCard} onStartShouldSetResponder={() => true}>
            <View style={styles.minaPopupHeader}>
              <View style={styles.minaPopupAvatar}>
                <Image
                  source={require('../assets/images/mina-avatar.png')}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.minaPopupTitle}>{t('home.meetMinaTitle')}</Text>
            </View>

            <Text style={styles.minaPopupDesc}>{t('home.meetMinaDesc')}</Text>

            <View style={styles.minaPopupActions}>
              <TouchableOpacity
                style={styles.minaNotNowBtn}
                onPress={() => setMinaModalVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.minaNotNowText}>{t('home.notNow')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.minaTryItBtn}
                onPress={() => setMinaModalVisible(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.minaTryItText}>{t('home.tryIt')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF', position: 'relative' },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    zIndex: 10,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoImage: { width: 120, height: 32 },
  floatingMinaAvatar: { width: 54, height: 54, borderRadius: 27 },
  stateTogglePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#EAF5EA',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  stateToggleText: { fontSize: 11, fontWeight: '700', color: '#1B5E20' },
  bellBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  scrollContent: { paddingBottom: 100, paddingHorizontal: 20 },
  greetingSection: { marginTop: 8, marginBottom: 16 },
  greetingTitle: { fontSize: 26, fontWeight: '800', color: '#0F1E12', letterSpacing: -0.4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  locationText: { fontSize: 13, color: '#64748B' },

  firstScanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  scanIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EAF5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  firstScanTitle: { fontSize: 17, fontWeight: '800', color: '#0F1E12', marginBottom: 4 },
  firstScanSub: { fontSize: 13, color: '#64748B', textAlign: 'center', lineHeight: 18, marginBottom: 14 },
  firstScanBtn: {
    backgroundColor: '#2D6A2E',
    width: '100%',
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstScanBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },

  walletCard: {
    backgroundColor: '#1E5D2E',
    borderRadius: 24,
    padding: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#1E5D2E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  walletHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  walletTag: { fontSize: 11, fontWeight: '800', color: '#A7D7A9', letterSpacing: 0.8 },
  availableLabel: { fontSize: 13, color: '#DCFCE7' },
  availableValue: { fontSize: 36, fontWeight: '800', color: '#FFFFFF', marginVertical: 4, letterSpacing: -0.5 },
  walletSubRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  walletSubBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 14,
    padding: 12,
  },
  subBoxLabel: { fontSize: 12, color: '#DCFCE7', fontWeight: '600' },
  subBoxValue: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', marginVertical: 2 },
  subBoxMeta: { fontSize: 11, color: '#BBF7D0' },
  cashOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    height: 44,
    borderRadius: 22,
    marginTop: 16,
  },
  cashOutText: { color: '#1E5D2E', fontWeight: '700', fontSize: 15 },

  pickupCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#2D6A2E',
    marginBottom: 16,
  },
  pickupTimeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  pickupStatusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#15803D' },
  pickupTimeText: { fontSize: 12, fontWeight: '700', color: '#15803D' },
  pickupMainRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  truckIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  pickupInfo: { flex: 1 },
  pickupTitle: { fontSize: 16, fontWeight: '800', color: '#0F1E12' },
  pickupSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  viewPickupBtn: {
    borderWidth: 1.2,
    borderColor: '#2D6A2E',
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewPickupText: { color: '#2D6A2E', fontWeight: '700', fontSize: 14 },

  actionTilesRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  actionTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  actionTileIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionTileLabel: { fontSize: 12, fontWeight: '700', color: '#0F1E12', textAlign: 'center' },

  howItWorksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  sectionHeaderTitle: { fontSize: 16, fontWeight: '800', color: '#0F1E12', marginBottom: 14 },
  howStepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  howBadge: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#EAF5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  howBadgeText: { fontSize: 12, fontWeight: '800', color: '#2D6A2E' },
  howInfo: { flex: 1 },
  howTitle: { fontSize: 14, fontWeight: '700', color: '#0F1E12' },
  howSub: { fontSize: 12, color: '#64748B', marginTop: 1 },

  demandBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  demandIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  demandInfo: { flex: 1 },
  demandTitle: { fontSize: 14, fontWeight: '700', color: '#0F1E12' },
  demandSub: { fontSize: 12, color: '#64748B', marginTop: 2 },

  milestoneTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF5EA',
    borderRadius: 16,
    padding: 14,
    marginBottom: 18,
    gap: 12,
  },
  milestoneLeaf: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneInfo: { flex: 1 },
  milestoneTitle: { fontSize: 14, fontWeight: '700', color: '#15803D' },
  milestoneSub: { fontSize: 12, color: '#166534', marginTop: 1 },

  activitySection: { marginBottom: 20 },
  activityHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  activityTitle: { fontSize: 16, fontWeight: '800', color: '#0F1E12' },
  seeAllText: { fontSize: 13, fontWeight: '700', color: '#2D6A2E' },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 8,
  },
  activityIconCircleGreen: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityIconCircleBlue: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: { flex: 1 },
  activityName: { fontSize: 14, fontWeight: '700', color: '#0F1E12' },
  activityDate: { fontSize: 12, color: '#64748B', marginTop: 2 },
  activityAmountPositive: { fontSize: 15, fontWeight: '800', color: '#15803D' },
  activityAmountNegative: { fontSize: 15, fontWeight: '800', color: '#0F1E12' },

  floatingMinaBtn: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#DCFCE7',
  },
  minaOnlineDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#15803D',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  minaPopupCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 8,
  },
  minaPopupHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  minaPopupAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  minaPopupTitle: { fontSize: 18, fontWeight: '800', color: '#0F1E12' },
  minaPopupDesc: { fontSize: 14, color: '#475569', lineHeight: 20, marginBottom: 20 },
  minaPopupActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  minaNotNowBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20 },
  minaNotNowText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  minaTryItBtn: {
    backgroundColor: '#2D6A2E',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 20,
  },
  minaTryItText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navItem: { alignItems: 'center', justifyContent: 'center' },
  navItemText: { fontSize: 11, fontWeight: '600', color: '#94A3B8', marginTop: 3 },
  navItemTextActive: { color: '#2D6A2E' },
});
