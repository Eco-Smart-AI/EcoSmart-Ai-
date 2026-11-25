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
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import {
  Bell,
  MapPin,
  Wallet,
  Lock,
  Check,
  Navigation,
  ChevronRight,
  Inbox,
  Sparkles,
} from 'lucide-react-native';
import { RecyclerBottomNavBar } from '../../components/common/RecyclerBottomNavBar';

type RecyclerHomeDemoMode = 'busy_day' | 'first_day' | 'meet_mina';

export default function RecyclerHomeScreen() {
  const router = useRouter();

  const [demoMode, setDemoMode] = useState<RecyclerHomeDemoMode>('busy_day');
  const [isOpen, setIsOpen] = useState(true);
  const [minaPopupVisible, setMinaPopupVisible] = useState(false);

  const handleSelectMode = (mode: RecyclerHomeDemoMode) => {
    setDemoMode(mode);
    setMinaPopupVisible(mode === 'meet_mina');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top White Header with Brand Logo & Bell */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.brandRow}
          onPress={() => router.push('/choose-account' as any)}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bellBtn}
          onPress={() => router.push('/recycler/requests' as any)}
          activeOpacity={0.7}
        >
          <Bell size={21} color="#0F1E12" strokeWidth={2} />
          {demoMode === 'busy_day' && <View style={styles.bellRedDot} />}
        </TouchableOpacity>
      </View>

      {/* 22px Light Green Wave Strip */}
      <View style={styles.waveStrip} pointerEvents="none">
        <Svg width="100%" height={22} viewBox="0 0 400 22" preserveAspectRatio="none">
          <Path
            d="M 0,0 L 400,0 L 400,10 C 310,20 210,6 120,16 C 60,22 0,11 0,11 Z"
            fill="#E6F4D7"
          />
        </Svg>
      </View>

      {/* Demo State Switcher (Screens · 01 · Home.png) */}
      <View style={styles.demoBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoScroll}
        >
          <Text style={styles.demoBarLabel}>Recycler 01:</Text>
          {(
            [
              { key: 'busy_day', label: 'Busy day' },
              { key: 'first_day', label: 'First day live' },
              { key: 'meet_mina', label: 'Meet Mina' },
            ] as const
          ).map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.demoPill, demoMode === item.key && styles.demoPillActive]}
              onPress={() => handleSelectMode(item.key)}
            >
              <Text
                style={[
                  styles.demoPillText,
                  demoMode === item.key && styles.demoPillTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.demoPill}
            onPress={() => router.push('/recycler/verification' as any)}
          >
            <Text style={styles.demoPillText}>02 Verification →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoPill}
            onPress={() => router.push('/recycler/setup' as any)}
          >
            <Text style={styles.demoPillText}>03 Setup →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoPill}
            onPress={() => router.push('/recycler/requests' as any)}
          >
            <Text style={styles.demoPillText}>06 Requests →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoPill}
            onPress={() => router.push('/recycler/pickup' as any)}
          >
            <Text style={styles.demoPillText}>04 Pickup →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoPill}
            onPress={() => router.push('/recycler/pickup-what-ifs' as any)}
          >
            <Text style={styles.demoPillText}>05 What-ifs →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoPill}
            onPress={() => router.push('/recycler/drop-offs' as any)}
          >
            <Text style={styles.demoPillText}>07 Drop-offs →</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.demoPill}
            onPress={() => router.push('/recycler/analytics' as any)}
          >
            <Text style={styles.demoPillText}>07 Analytics →</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting + Open/Closed Toggle Pill */}
        <View style={styles.greetingRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingTitle}>
              {demoMode === 'busy_day' ? 'Good morning, Musa' : 'Welcome, Musa'}
            </Text>
            <View style={styles.locationRow}>
              <MapPin size={13} color="#64748B" />
              <Text style={styles.locationText}>Kubwa, Abuja</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.openTogglePill}
            onPress={() => setIsOpen(!isOpen)}
            activeOpacity={0.8}
          >
            <Text style={styles.openToggleLabel}>{isOpen ? 'Open' : 'Closed'}</Text>
            <View style={[styles.switchTrack, isOpen && styles.switchTrackOn]}>
              <View style={[styles.switchThumb, isOpen && styles.switchThumbOn]} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Dark Green EcoSmart Wallet Card */}
        <TouchableOpacity
          style={styles.walletCard}
          onPress={() => router.push('/recycler/wallet' as any)}
          activeOpacity={0.9}
        >
          <View style={styles.walletTopRow}>
            <View style={styles.walletTitleRow}>
              <Wallet size={14} color="#E6F4D7" />
              <Text style={styles.walletBrandLabel}>ECOSMART WALLET</Text>
            </View>
            <View style={styles.verifiedTag}>
              <Check size={11} color="#FFFFFF" strokeWidth={2.8} />
              <Text style={styles.verifiedTagText}>Verified</Text>
            </View>
          </View>

          <Text style={styles.availableCaption}>Available</Text>
          <Text style={styles.availableAmount}>
            {demoMode === 'busy_day' ? '₦1,550' : '₦0'}
          </Text>

          <View style={styles.walletStatsGrid}>
            {/* Sub-box 1: Set aside */}
            <View style={styles.walletStatBox}>
              <View style={styles.statHeaderRow}>
                <Lock size={12} color="#FDE047" />
                <Text style={styles.statHeaderText}>Set aside</Text>
              </View>
              <Text style={[styles.statAmount, { color: '#FDE047' }]}>
                {demoMode === 'busy_day' ? '₦450' : '₦0'}
              </Text>
              <Text style={styles.statSubText}>
                {demoMode === 'busy_day'
                  ? 'Locked for 1 active pickup'
                  : 'Nothing locked'}
              </Text>
            </View>

            {/* Sub-box 2: Paid this week */}
            <View style={styles.walletStatBox}>
              <Text style={styles.statHeaderText}>Paid this week</Text>
              <Text style={styles.statAmount}>
                {demoMode === 'busy_day' ? '₦24,800' : '₦0'}
              </Text>
              <Text style={styles.statSubText}>
                {demoMode === 'busy_day' ? 'To 31 households' : 'No pickups yet'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {demoMode === 'busy_day' ? (
          /* ======================================================= */
          /* BUSY DAY MODE: Happening Now + 2 New Requests           */
          /* ======================================================= */
          <>
            {/* Happening Now Card */}
            <View style={styles.happeningCard}>
              <View style={styles.happeningHeaderRow}>
                <View style={styles.liveDotRow}>
                  <View style={styles.greenLiveDot} />
                  <Text style={styles.happeningLabel}>Happening now</Text>
                </View>
                <Text style={styles.happeningTimeWindow}>10:00–11:00</Text>
              </View>

              <View style={styles.happeningInfoRow}>
                <View style={styles.navIconCircle}>
                  <Navigation size={16} color="#475569" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.happeningTitle}>On your way to Musa A.</Text>
                  <Text style={styles.happeningSub}>
                    PET ~3 kg · 12 Byazhin Road · 0.6 km
                  </Text>
                </View>
              </View>

              {/* 5-segment progress bar */}
              <View style={styles.progressSegmentsRow}>
                <View style={[styles.progressSegment, styles.progressSegmentFilled]} />
                <View style={[styles.progressSegment, styles.progressSegmentFilled]} />
                <View style={styles.progressSegment} />
                <View style={styles.progressSegment} />
                <View style={styles.progressSegment} />
              </View>

              <TouchableOpacity
                style={styles.continuePickupBtn}
                onPress={() => router.push('/recycler/pickup' as any)}
                activeOpacity={0.85}
              >
                <Text style={styles.continuePickupBtnText}>Continue pickup</Text>
              </TouchableOpacity>
            </View>

            {/* New requests · 2 */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>New requests · 2</Text>
              <TouchableOpacity
                onPress={() => router.push('/recycler/requests' as any)}
                activeOpacity={0.7}
              >
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.requestsCardList}>
              <TouchableOpacity
                style={styles.requestRow}
                onPress={() => router.push('/recycler/requests' as any)}
                activeOpacity={0.75}
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.reqNameRow}>
                    <Text style={styles.reqName}>Halima B.</Text>
                    <Text style={styles.reqTimeAgo}>22 min</Text>
                  </View>
                  <View style={styles.reqMetaRow}>
                    <View style={styles.cardboardTag}>
                      <Text style={styles.cardboardTagText}>Cardboard · ~6 kg</Text>
                    </View>
                    <Text style={styles.reqLocationText}>Dutse · 2.1 km</Text>
                  </View>
                </View>
                <Text style={styles.reqPriceRange}>₦250–₦330</Text>
                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>

              <View style={styles.requestDivider} />

              <TouchableOpacity
                style={styles.requestRow}
                onPress={() => router.push('/recycler/requests' as any)}
                activeOpacity={0.75}
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.reqNameRow}>
                    <Text style={styles.reqName}>Ibrahim K.</Text>
                    <Text style={styles.reqTimeAgo}>40 min</Text>
                  </View>
                  <View style={styles.reqMetaRow}>
                    <View style={styles.petTag}>
                      <Text style={styles.petTagText}>PET · ~2 kg</Text>
                    </View>
                    <Text style={styles.reqLocationText}>Kubwa · 0.9 km</Text>
                  </View>
                </View>
                <Text style={styles.reqPriceRange}>₦200–₦300</Text>
                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          /* ======================================================= */
          /* FIRST DAY LIVE MODE: Top Up Prompt + Empty Requests     */
          /* ======================================================= */
          <>
            <View style={styles.topUpPromptCard}>
              <View style={styles.topUpTopRow}>
                <View style={styles.amberWalletCircle}>
                  <Wallet size={18} color="#B45309" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.topUpTitle}>Add money to accept pickups</Text>
                  <Text style={styles.topUpSub}>
                    Money is set aside each time you accept, and unused money comes back.
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.continuePickupBtn}
                onPress={() => router.push('/recycler/wallet' as any)}
                activeOpacity={0.85}
              >
                <Text style={styles.continuePickupBtnText}>Top up wallet</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>New requests</Text>
            </View>

            <View style={styles.emptyRequestsCard}>
              <Inbox size={24} color="#64748B" />
              <Text style={styles.emptyRequestsTitle}>
                Requests near Kubwa will show here
              </Text>
              <Text style={styles.emptyRequestsSub}>
                Households see you because you're live. Fair prices bring more requests.
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Floating Mina AI Helper Button */}
      <TouchableOpacity
        style={styles.minaFab}
        onPress={() => setMinaPopupVisible(true)}
        activeOpacity={0.85}
      >
        <View style={styles.minaAvatarCircle}>
          <Sparkles size={18} color="#2D6A2E" />
        </View>
      </TouchableOpacity>

      {/* Meet Mina Popup Modal (Frame 3 of Screens · 01 · Home.png) */}
      <Modal
        visible={minaPopupVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMinaPopupVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setMinaPopupVisible(false)}
        >
          <View style={styles.minaModalCard}>
            <View style={styles.minaModalHeader}>
              <View style={styles.minaModalAvatar}>
                <Sparkles size={16} color="#2D6A2E" />
              </View>
              <Text style={styles.minaModalTitle}>Meet Mina 👋</Text>
            </View>

            <Text style={styles.minaModalDesc}>
              Ask me about requests, prices, payments or getting verified. You can type or speak.
            </Text>

            <View style={styles.minaModalActions}>
              <TouchableOpacity
                style={styles.notNowBtn}
                onPress={() => setMinaPopupVisible(false)}
              >
                <Text style={styles.notNowText}>Not now</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.tryItGreenBtn}
                onPress={() => {
                  setMinaPopupVisible(false);
                  router.push('/mina' as any);
                }}
              >
                <Text style={styles.tryItGreenText}>Try it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <RecyclerBottomNavBar activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 125,
    height: 32,
  },
  bellBtn: {
    padding: 6,
    position: 'relative',
  },
  bellRedDot: {
    position: 'absolute',
    top: 5,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  waveStrip: {
    width: '100%',
    height: 22,
    backgroundColor: '#FFFFFF',
  },
  demoBar: {
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 7,
  },
  demoScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 6,
  },
  demoBarLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#2D6A2E',
    marginRight: 2,
  },
  demoPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
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
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F1E12',
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '500',
  },
  openTogglePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 20,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 5,
  },
  openToggleLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  switchTrack: {
    width: 34,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchTrackOn: {
    backgroundColor: '#2D6A2E',
  },
  switchThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  switchThumbOn: {
    alignSelf: 'flex-end',
  },
  walletCard: {
    backgroundColor: '#1E6B24',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#1E6B24',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  walletTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  walletBrandLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DCFCE7',
    letterSpacing: 0.7,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 10,
  },
  verifiedTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  availableCaption: {
    fontSize: 12,
    color: '#DCFCE7',
  },
  availableAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 2,
  },
  walletStatsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  walletStatBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.13)',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  statHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statHeaderText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#DCFCE7',
  },
  statAmount: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 3,
  },
  statSubText: {
    fontSize: 10.5,
    color: '#DCFCE7',
  },
  happeningCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#2D6A2E',
    marginBottom: 18,
  },
  happeningHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  liveDotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenLiveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#16A34A',
  },
  happeningLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  happeningTimeWindow: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  happeningInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  navIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  happeningTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F1E12',
  },
  happeningSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  progressSegmentsRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 14,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  progressSegmentFilled: {
    backgroundColor: '#2D6A2E',
  },
  continuePickupBtn: {
    backgroundColor: '#2D6A2E',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continuePickupBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F1E12',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  requestsCardList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  requestDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  reqNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  reqName: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F1E12',
  },
  reqTimeAgo: {
    fontSize: 12,
    color: '#94A3B8',
  },
  reqMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardboardTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  cardboardTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  petTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  petTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  reqLocationText: {
    fontSize: 12,
    color: '#64748B',
  },
  reqPriceRange: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F1E12',
  },
  topUpPromptCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  topUpTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  amberWalletCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topUpTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 2,
  },
  topUpSub: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 17,
  },
  emptyRequestsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  emptyRequestsTitle: {
    fontSize: 14.5,
    fontWeight: '800',
    color: '#0F1E12',
    marginTop: 10,
    marginBottom: 4,
    textAlign: 'center',
  },
  emptyRequestsSub: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  minaFab: {
    position: 'absolute',
    right: 18,
    bottom: 84,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2D6A2E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 40,
  },
  minaAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E6F4D7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 30, 18, 0.35)',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 18,
    paddingBottom: 145,
  },
  minaModalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    width: 290,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  minaModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  minaModalAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E6F4D7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  minaModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F1E12',
  },
  minaModalDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 14,
  },
  minaModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
  },
  notNowBtn: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  notNowText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  tryItGreenBtn: {
    backgroundColor: '#2D6A2E',
    paddingVertical: 9,
    paddingHorizontal: 18,
    borderRadius: 18,
  },
  tryItGreenText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
