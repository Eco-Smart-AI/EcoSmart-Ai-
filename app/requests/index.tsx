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
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  Clock,
  Inbox,
  X,
  Lock,
  Info,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomNavBar } from '../../components/common/BottomNavBar';

type RequestsDemoMode =
  | '12.1_active'
  | '4.04_completed'
  | '4.04_closed'
  | '6.05_active_empty'
  | '6.06_completed_empty'
  | '6.07_closed_empty'
  | '12.3_cancelled'
  | '4.02_time_passed';

export default function RequestsScreen() {
  const router = useRouter();

  const [mode, setMode] = useState<RequestsDemoMode>('12.1_active');

  const activeTabFilter: 'active' | 'completed' | 'closed' =
    mode === '4.04_completed' || mode === '6.06_completed_empty'
      ? 'completed'
      : mode === '4.04_closed' || mode === '6.07_closed_empty'
      ? 'closed'
      : 'active';

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        showBack={false}
        rightAction="bell"
        onPressBell={() => router.push('/profile?tab=notifications' as any)}
      />

      {/* Demo Switcher for all 8 Request states in Screens · 12 */}
      <View style={styles.demoBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoScroll}
        >
          {(
            [
              { key: '12.1_active', label: '12.1 Active' },
              { key: '4.04_completed', label: '4.04 Completed' },
              { key: '4.04_closed', label: '4.04 Closed' },
              { key: '6.05_active_empty', label: '6.05 Active Empty' },
              { key: '6.06_completed_empty', label: '6.06 Completed Empty' },
              { key: '6.07_closed_empty', label: '6.07 Closed Empty' },
              { key: '12.3_cancelled', label: '12.3 Recycler Cancelled' },
              { key: '4.02_time_passed', label: '4.02 Time Passed' },
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
        {/* 12.3 Recycler cancelled                               */}
        {/* ===================================================== */}
        {mode === '12.3_cancelled' && (
          <View>
            <View style={styles.topBackRow}>
              <TouchableOpacity
                style={styles.backBtnRow}
                onPress={() => setMode('12.1_active')}
              >
                <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
                <Text style={styles.backTitle}>Your pickup</Text>
              </TouchableOpacity>
              <Text style={styles.reqIdText}>REQ-001</Text>
            </View>

            <View style={styles.cancelledCard}>
              <View style={styles.cancelledXCircle}>
                <X size={22} color="#475569" />
              </View>
              <Text style={styles.cancelledTitle}>Kubwa Green Hub cancelled</Text>
              <Text style={styles.cancelledDesc}>
                Sorry about that. Your waste is still worth money — other recyclers near you can take it.
              </Text>
              <View style={styles.reliabilityNoteBox}>
                <Text style={styles.reliabilityNoteText}>
                  This counts against their reliability score.
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 190 }}>
              <TouchableOpacity
                style={styles.primaryGreenBtn}
                onPress={() => router.push('/recyclers')}
                activeOpacity={0.85}
              >
                <Text style={styles.primaryGreenBtnText}>Find another recycler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.secondaryTextBtn}
                onPress={() => router.push('/home')}
              >
                <Text style={styles.secondaryTextBtnLabel}>Back to home</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 4.02 Request · Time passed                            */}
        {/* ===================================================== */}
        {mode === '4.02_time_passed' && (
          <View>
            <TouchableOpacity
              style={[styles.backBtnRow, { marginBottom: 14 }]}
              onPress={() => setMode('12.1_active')}
            >
              <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
              <Text style={styles.backTitle}>Your request</Text>
            </TouchableOpacity>

            <View style={styles.timePassedCard}>
              <View style={styles.timePassedHeader}>
                <View style={styles.amberClockCircle}>
                  <Clock size={18} color="#B45309" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.timePassedTitle}>Pickup time has passed</Text>
                  <Text style={styles.timePassedSub}>
                    Your window was Sat 10–11am. It's now 11:15.
                  </Text>
                </View>
              </View>

              <View style={styles.recyclerMiniRow}>
                <Image
                  source={require('../../assets/images/kubwa-yard.jpg')}
                  style={styles.recyclerMiniThumb}
                />
                <View>
                  <Text style={styles.recyclerMiniName}>Kubwa Green Hub</Text>
                  <Text style={styles.recyclerMiniSub}>
                    PET · ~3 kg · Pickup at home
                  </Text>
                </View>
              </View>

              <View style={styles.darkGreenEscrowBox}>
                <View>
                  <Text style={styles.darkGreenLabel}>Set aside for you</Text>
                  <Text style={styles.darkGreenAmount}>₦450</Text>
                  <Text style={styles.darkGreenMeta}>
                    Your request is still active
                  </Text>
                </View>
                <View style={styles.darkGreenLockCircle}>
                  <Lock size={18} color="#DCFCE7" />
                </View>
              </View>
            </View>

            <View style={styles.infoHintRow}>
              <Info size={14} color="#64748B" />
              <Text style={styles.infoHintText}>
                Ask them what happened, or pick a new time.
              </Text>
            </View>

            <View style={{ marginTop: 150 }}>
              <View style={styles.twoButtonsRow}>
                <TouchableOpacity
                  style={styles.outlineHalfBtn}
                  onPress={() => router.push('/chat/kubwa-green-hub')}
                >
                  <Text style={styles.outlineHalfBtnText}>Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.primaryHalfBtn}
                  onPress={() => router.push('/chat/kubwa-green-hub')}
                >
                  <Text style={styles.primaryHalfBtnText}>Pick a new time</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.secondaryTextBtn}
                onPress={() => setMode('4.04_closed')}
              >
                <Text style={styles.secondaryTextBtnLabel}>Cancel request</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* Requests Hub (Active / Completed / Closed + Empties)  */}
        {/* ===================================================== */}
        {mode !== '12.3_cancelled' && mode !== '4.02_time_passed' && (
          <View>
            <View style={styles.headerTitleRow}>
              <Text style={styles.pageTitle}>Requests</Text>
              <TouchableOpacity onPress={() => router.push('/messages')}>
                <Text style={styles.messagesGreenLink}>Messages</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.pageSubtitle}>
              {activeTabFilter === 'closed'
                ? 'Closed includes cancelled and expired requests.'
                : 'Track your recycling requests in one place.'}
            </Text>

            {/* 3 Segmented Tabs */}
            <View style={styles.segmentedBar}>
              <TouchableOpacity
                style={[
                  styles.segmentTab,
                  activeTabFilter === 'active' && styles.segmentTabActive,
                ]}
                onPress={() => setMode('12.1_active')}
              >
                <Text
                  style={[
                    styles.segmentTabText,
                    activeTabFilter === 'active' && styles.segmentTabTextActive,
                  ]}
                >
                  Active
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentTab,
                  activeTabFilter === 'completed' && styles.segmentTabActive,
                ]}
                onPress={() => setMode('4.04_completed')}
              >
                <Text
                  style={[
                    styles.segmentTabText,
                    activeTabFilter === 'completed' && styles.segmentTabTextActive,
                  ]}
                >
                  Completed
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.segmentTab,
                  activeTabFilter === 'closed' && styles.segmentTabActive,
                ]}
                onPress={() => setMode('4.04_closed')}
              >
                <Text
                  style={[
                    styles.segmentTabText,
                    activeTabFilter === 'closed' && styles.segmentTabTextActive,
                  ]}
                >
                  Closed
                </Text>
              </TouchableOpacity>
            </View>

            {/* 12.1 Active Requests List */}
            {mode === '12.1_active' && (
              <View style={{ gap: 12 }}>
                <TouchableOpacity
                  style={styles.requestCard}
                  onPress={() => router.push('/pickup/REQ-001')}
                  activeOpacity={0.8}
                >
                  <View style={styles.requestCardRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.requestRecyclerName}>
                        Kubwa Green Hub
                      </Text>
                      <Text style={styles.requestMetaText}>
                        PET · ~3 kg · Today, 10:00–11:00
                      </Text>
                    </View>
                    <View style={styles.acceptedBadge}>
                      <Check size={12} color="#2D6A2E" strokeWidth={2.8} />
                      <Text style={styles.acceptedBadgeText}>Accepted</Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.requestCard}
                  onPress={() => router.push('/recyclers/request-pickup')}
                  activeOpacity={0.8}
                >
                  <View style={styles.requestCardRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.requestRecyclerName}>Bwari Renew</Text>
                      <Text style={styles.requestMetaText}>
                        Cardboard · ~6 kg · Tomorrow
                      </Text>
                    </View>
                    <View style={styles.waitingBadge}>
                      <Clock size={12} color="#B45309" />
                      <Text style={styles.waitingBadgeText}>Waiting</Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* 4.04 Completed List */}
            {mode === '4.04_completed' && (
              <View style={styles.detailRequestCard}>
                <View style={styles.completedPill}>
                  <Text style={styles.completedPillText}>Completed · Paid</Text>
                </View>

                <View style={styles.recyclerMiniRow}>
                  <Image
                    source={require('../../assets/images/kubwa-yard.jpg')}
                    style={styles.recyclerMiniThumb}
                  />
                  <View>
                    <Text style={styles.recyclerMiniName}>Kubwa Green Hub</Text>
                    <Text style={styles.recyclerPartnerSub}>
                      Verified Eco Partner · Kubwa, Abuja
                    </Text>
                  </View>
                </View>

                <View style={styles.itemBreakdownBox}>
                  <Text style={styles.itemBreakdownTitle}>PET · 3.2 kg</Text>
                  <Text style={styles.itemBreakdownSub}>
                    3.2 kg × ₦120/kg = ₦384 · Final weight and amount
                  </Text>
                </View>

                <View style={styles.kvRow}>
                  <Text style={styles.kvLabel}>Method</Text>
                  <Text style={styles.kvVal}>Pickup</Text>
                </View>
                <View style={styles.kvRow}>
                  <Text style={styles.kvLabel}>Paid to your wallet</Text>
                  <Text style={styles.kvValGreen}>₦384</Text>
                </View>
                <Text style={styles.dateFooterText}>Sat 9 Nov · 14:15</Text>

                <TouchableOpacity
                  style={[styles.primaryGreenBtn, { marginTop: 12 }]}
                  onPress={() => router.push('/pickup/receipt')}
                >
                  <Text style={styles.primaryGreenBtnText}>Leave a review</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryTextBtn}
                  onPress={() => router.push('/recyclers/kubwa-green-hub')}
                >
                  <Text style={styles.secondaryTextBtnLabel}>Repeat request</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* 4.04 Closed List */}
            {mode === '4.04_closed' && (
              <View style={{ gap: 14 }}>
                <View style={styles.detailRequestCard}>
                  <View style={styles.closedNeutralPill}>
                    <Text style={styles.closedNeutralPillText}>Cancelled</Text>
                  </View>
                  <View style={styles.recyclerMiniRow}>
                    <Image
                      source={require('../../assets/images/kubwa-yard.jpg')}
                      style={styles.recyclerMiniThumb}
                    />
                    <View>
                      <Text style={styles.recyclerMiniName}>Kubwa Green Hub</Text>
                      <Text style={styles.recyclerPartnerSub}>
                        Verified Eco Partner · Kubwa, Abuja
                      </Text>
                    </View>
                  </View>
                  <View style={styles.itemBreakdownBox}>
                    <Text style={styles.itemBreakdownTitle}>PET · ~3 kg</Text>
                    <Text style={styles.itemBreakdownSub}>
                      AI scan · Photo attached · One material per request
                    </Text>
                  </View>
                  <Text style={styles.closedReasonText}>
                    Pickup · Cancelled by recycler · Vehicle issue
                  </Text>
                  <TouchableOpacity
                    style={styles.outlineFullBtn}
                    onPress={() => router.push('/recyclers')}
                  >
                    <Text style={styles.outlineFullBtnText}>
                      Find another recycler
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.detailRequestCard}>
                  <View style={styles.closedNeutralPill}>
                    <Text style={styles.closedNeutralPillText}>Expired</Text>
                  </View>
                  <View style={styles.recyclerMiniRow}>
                    <Image
                      source={require('../../assets/images/kubwa-yard.jpg')}
                      style={styles.recyclerMiniThumb}
                    />
                    <View>
                      <Text style={styles.recyclerMiniName}>Bwari Renew</Text>
                      <Text style={styles.recyclerPartnerSub}>
                        Verified Eco Partner · Bwari, Abuja
                      </Text>
                    </View>
                  </View>
                  <View style={styles.itemBreakdownBox}>
                    <Text style={styles.itemBreakdownTitle}>PET · ~3 kg</Text>
                    <Text style={styles.itemBreakdownSub}>
                      AI scan · Photo attached · One material per request
                    </Text>
                  </View>
                  <Text style={styles.closedReasonText}>
                    Pickup · No reply before this request expired
                  </Text>
                  <TouchableOpacity
                    style={styles.outlineFullBtn}
                    onPress={() => router.push('/recyclers')}
                  >
                    <Text style={styles.outlineFullBtnText}>Try again</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* 6.05, 6.06, 6.07 Empty States */}
            {(mode === '6.05_active_empty' ||
              mode === '6.06_completed_empty' ||
              mode === '6.07_closed_empty') && (
              <View style={styles.emptyCard}>
                <View style={styles.emptyIconCircle}>
                  <Inbox size={26} color="#2D6A2E" />
                </View>
                <Text style={styles.emptyTitle}>
                  {mode === '6.05_active_empty'
                    ? 'No active requests'
                    : mode === '6.06_completed_empty'
                    ? 'No completed sales yet'
                    : 'No closed requests'}
                </Text>
                <Text style={styles.emptyDesc}>
                  {mode === '6.05_active_empty'
                    ? 'Scan an item to find verified recyclers near you. Your active pickups and drop-offs will appear here.'
                    : mode === '6.06_completed_empty'
                    ? 'Your completed recycling sales and payment receipts will appear here after handover.'
                    : "Closed contains Cancelled and Expired requests. You don't have any in either state."}
                </Text>
                <TouchableOpacity
                  style={[styles.primaryGreenBtn, { width: '100%' }]}
                  onPress={() => router.push('/scan')}
                >
                  <Text style={styles.primaryGreenBtnText}>Scan an item</Text>
                </TouchableOpacity>
                {mode === '6.05_active_empty' && (
                  <TouchableOpacity
                    style={styles.secondaryTextBtn}
                    onPress={() => router.push('/recyclers')}
                  >
                    <Text style={styles.secondaryTextBtnLabel}>
                      Find recyclers
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
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
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F1E12',
    letterSpacing: -0.4,
  },
  messagesGreenLink: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 14,
  },
  segmentedBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 18,
    alignItems: 'center',
  },
  segmentTabActive: {
    backgroundColor: '#E4F3D8',
  },
  segmentTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTabTextActive: {
    color: '#2D6A2E',
    fontWeight: '700',
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  requestCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  requestRecyclerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 2,
  },
  requestMetaText: {
    fontSize: 12.5,
    color: '#64748B',
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E4F3D8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  acceptedBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  waitingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  waitingBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#B45309',
  },
  chevron: {
    fontSize: 18,
    color: '#94A3B8',
  },

  /* 4.04 Completed & Closed Detail Cards */
  detailRequestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  completedPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#E4F3D8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 12,
  },
  completedPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  closedNeutralPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 12,
  },
  closedNeutralPillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  recyclerMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  recyclerMiniThumb: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  recyclerMiniName: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F1E12',
  },
  recyclerPartnerSub: {
    fontSize: 12,
    color: '#2D6A2E',
  },
  recyclerMiniSub: {
    fontSize: 12,
    color: '#64748B',
  },
  itemBreakdownBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  itemBreakdownTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F1E12',
  },
  itemBreakdownSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  kvRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  kvLabel: {
    fontSize: 12.5,
    color: '#64748B',
  },
  kvVal: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#0F1E12',
  },
  kvValGreen: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2D6A2E',
  },
  dateFooterText: {
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 4,
  },
  closedReasonText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  outlineFullBtn: {
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineFullBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E4F3D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 18,
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
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryTextBtnLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },

  /* 12.3 Cancelled & 4.02 Time Passed */
  topBackRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
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
    color: '#64748B',
  },
  cancelledCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cancelledXCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cancelledTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 6,
  },
  cancelledDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 14,
  },
  reliabilityNoteBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    width: '100%',
  },
  reliabilityNoteText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  timePassedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  timePassedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  amberClockCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timePassedTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F1E12',
  },
  timePassedSub: {
    fontSize: 12.5,
    color: '#64748B',
  },
  darkGreenEscrowBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E5D2E',
    borderRadius: 16,
    padding: 16,
  },
  darkGreenLabel: {
    fontSize: 12,
    color: '#DCFCE7',
  },
  darkGreenAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FCD34D',
    marginVertical: 2,
  },
  darkGreenMeta: {
    fontSize: 11.5,
    color: '#DCFCE7',
  },
  darkGreenLockCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoHintText: {
    fontSize: 12,
    color: '#64748B',
  },
  twoButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  outlineHalfBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineHalfBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  primaryHalfBtn: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#38762B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryHalfBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
