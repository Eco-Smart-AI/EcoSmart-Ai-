import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  Clock,
  MapPin,
  CheckCircle,
  XCircle,
  Sparkles,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import TopGreenWave from '../../components/common/TopGreenWave';
import RecyclerBottomNavBar from '../../components/common/RecyclerBottomNavBar';

type RequestTab = 'new' | 'active' | 'done';

export default function RecyclerRequestsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<RequestTab>('new');
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [selectedRequestName, setSelectedRequestName] = useState('Musa A.');

  return (
    <SafeAreaView style={styles.container}>
      <TopGreenWave />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Requests</Text>
        <TouchableOpacity
          style={styles.bellBtn}
          onPress={() => router.push('/recycler/notifications' as any)}
        >
          <Bell size={20} color="#1F2937" />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      {/* 3 Main Tabs: New (2) | Active (1) | Done */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'new' && styles.tabBtnActive]}
          onPress={() => setActiveTab('new')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'new' && styles.tabBtnTextActive]}>
            New
          </Text>
          <View style={[styles.badgePill, activeTab === 'new' && styles.badgePillActive]}>
            <Text style={[styles.badgePillText, activeTab === 'new' && styles.badgePillTextActive]}>
              2
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'active' && styles.tabBtnActive]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'active' && styles.tabBtnTextActive]}>
            Active
          </Text>
          <View style={[styles.badgePill, activeTab === 'active' && styles.badgePillActive]}>
            <Text style={[styles.badgePillText, activeTab === 'active' && styles.badgePillTextActive]}>
              1
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'done' && styles.tabBtnActive]}
          onPress={() => setActiveTab('done')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'done' && styles.tabBtnTextActive]}>
            Done
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => router.push('/recycler/system-states' as any)}
        >
          <Text style={styles.tabBtnText}>States →</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ================= TAB 1: NEW REQUESTS ================= */}
        {activeTab === 'new' && (
          <View style={styles.tabContent}>
            {/* Request Card 1: Musa A. */}
            <View style={styles.requestCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>MA</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardUserName}>Musa A.</Text>
                  <Text style={styles.cardLocation}>Household · Kubwa · 1.2 km</Text>
                </View>
                <Text style={styles.timeAgo}>5 min ago</Text>
              </View>

              <View style={styles.cardDetailsRow}>
                <View style={styles.materialBadge}>
                  <Text style={styles.materialBadgeText}>PET · ~3 kg</Text>
                </View>
                <Text style={styles.priceEstimateText}>₦300–₦450</Text>
              </View>

              <View style={styles.cardButtonsRow}>
                <TouchableOpacity
                  style={styles.viewRequestBtn}
                  onPress={() => router.push('/recycler/pickup' as any)}
                >
                  <Text style={styles.viewRequestBtnText}>View request</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cardDeclineBtn}
                  onPress={() => {
                    setSelectedRequestName('Musa A.');
                    setDeclineModalVisible(true);
                  }}
                >
                  <Text style={styles.cardDeclineBtnText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Request Card 2: Halima B. */}
            <View style={styles.requestCard}>
              <View style={styles.cardTopRow}>
                <View style={[styles.avatarCircle, { backgroundColor: '#FCE7F3' }]}>
                  <Text style={[styles.avatarText, { color: '#BE185D' }]}>HB</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardUserName}>Halima B.</Text>
                  <Text style={styles.cardLocation}>Dutse · 2.1 km</Text>
                </View>
                <Text style={styles.timeAgo}>22 min ago</Text>
              </View>

              <View style={styles.cardDetailsRow}>
                <View style={styles.materialBadge}>
                  <Text style={styles.materialBadgeText}>Cardboard · ~6 kg</Text>
                </View>
                <Text style={styles.priceEstimateText}>₦250–₦330</Text>
              </View>

              <View style={styles.cardButtonsRow}>
                <TouchableOpacity
                  style={styles.viewRequestBtn}
                  onPress={() => router.push('/recycler/pickup' as any)}
                >
                  <Text style={styles.viewRequestBtnText}>View request</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.cardDeclineBtn}
                  onPress={() => {
                    setSelectedRequestName('Halima B.');
                    setDeclineModalVisible(true);
                  }}
                >
                  <Text style={styles.cardDeclineBtnText}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Tip Banner */}
            <View style={styles.tipBanner}>
              <Clock size={16} color="#166534" />
              <Text style={styles.tipBannerText}>
                Replying within 30 minutes helps you get more requests.
              </Text>
            </View>
          </View>
        )}

        {/* ================= TAB 2: ACTIVE REQUESTS ================= */}
        {activeTab === 'active' && (
          <View style={styles.tabContent}>
            {/* Active Card 1: Musa A. - Pickup */}
            <View style={styles.requestCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>MA</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardUserName}>Musa A.</Text>
                  <Text style={styles.cardLocation}>Kubwa · 1.2 km</Text>
                </View>
                <Text style={styles.timeAgo}>Today, 10–11am</Text>
              </View>

              <View style={styles.cardDetailsRow}>
                <View style={styles.statusOnWayBadge}>
                  <Text style={styles.statusOnWayText}>On the way</Text>
                </View>
                <Text style={styles.priceEstimateText}>₦450 set aside</Text>
              </View>

              <TouchableOpacity
                style={[styles.viewRequestBtn, { marginTop: 14 }]}
                onPress={() => router.push('/recycler/pickup' as any)}
              >
                <Text style={styles.viewRequestBtnText}>Continue pickup</Text>
              </TouchableOpacity>
            </View>

            {/* Active Card 2: Amaka O. - Drop-off at yard */}
            <View style={styles.requestCard}>
              <View style={styles.cardTopRow}>
                <View style={[styles.avatarCircle, { backgroundColor: '#E0F2FE' }]}>
                  <Text style={[styles.avatarText, { color: '#0369A1' }]}>AO</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardUserName}>Amaka O.</Text>
                  <Text style={styles.cardLocation}>Dutse · drop-off at your yard</Text>
                </View>
                <Text style={styles.timeAgo}>Tomorrow, 9am</Text>
              </View>

              <View style={styles.cardDetailsRow}>
                <View style={[styles.statusOnWayBadge, { backgroundColor: '#E0F2FE' }]}>
                  <Text style={[styles.statusOnWayText, { color: '#0284C7' }]}>Drop-off · ~6 kg</Text>
                </View>
                <Text style={styles.priceEstimateText}>₦300 set aside</Text>
              </View>

              <TouchableOpacity
                style={[styles.viewRequestBtn, { marginTop: 14 }]}
                onPress={() => router.push('/recycler/drop-offs' as any)}
              >
                <Text style={styles.viewRequestBtnText}>View drop-off</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tipBanner}>
              <Clock size={16} color="#166534" />
              <Text style={styles.tipBannerText}>
                Money stays set aside until the household gives you their code.
              </Text>
            </View>
          </View>
        )}

        {/* ================= TAB 3: DONE REQUESTS ================= */}
        {activeTab === 'done' && (
          <View style={styles.tabContent}>
            {/* Done Card 1: Musa A. */}
            <View style={styles.requestCard}>
              <View style={styles.cardTopRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>MA</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardUserName}>Musa A.</Text>
                  <Text style={styles.cardLocation}>Kubwa · 3.2 kg PET</Text>
                </View>
                <Text style={styles.timeAgo}>Yesterday</Text>
              </View>

              <View style={styles.cardDetailsRow}>
                <View style={[styles.statusOnWayBadge, { backgroundColor: '#DCFCE7' }]}>
                  <Text style={[styles.statusOnWayText, { color: '#15803D' }]}>Paid</Text>
                </View>
                <Text style={styles.priceEstimateText}>₦384 paid</Text>
              </View>

              <TouchableOpacity
                style={[styles.viewRequestBtn, { marginTop: 14 }]}
                onPress={() => router.push('/recycler/pickup' as any)}
              >
                <Text style={styles.viewRequestBtnText}>View receipt</Text>
              </TouchableOpacity>
            </View>

            {/* Done Card 2: Ibrahim K. */}
            <View style={styles.requestCard}>
              <View style={styles.cardTopRow}>
                <View style={[styles.avatarCircle, { backgroundColor: '#FEF3C7' }]}>
                  <Text style={[styles.avatarText, { color: '#B45309' }]}>IK</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardUserName}>Ibrahim K.</Text>
                  <Text style={styles.cardLocation}>Kubwa · ~2 kg PET</Text>
                </View>
                <Text style={styles.timeAgo}>Mon</Text>
              </View>

              <View style={styles.cardDetailsRow}>
                <View style={[styles.statusOnWayBadge, { backgroundColor: '#F3F4F6' }]}>
                  <Text style={[styles.statusOnWayText, { color: '#6B7280' }]}>No-show · money back</Text>
                </View>
                <Text style={styles.priceEstimateText}>₦300 returned</Text>
              </View>

              <TouchableOpacity
                style={[styles.outlineSecondaryBtn, { marginTop: 14 }]}
                onPress={() => router.push('/recycler/pickup-what-ifs' as any)}
              >
                <Text style={styles.outlineSecondaryBtnText}>View details</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.tipBanner}>
              <Clock size={16} color="#166534" />
              <Text style={styles.tipBannerText}>
                Finished requests stay here for 90 days.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Floating Ask Mina Button */}
      <TouchableOpacity
        style={styles.floatingMinaBtn}
        onPress={() => router.push('/recycler/mina' as any)}
        activeOpacity={0.8}
      >
        <Image
          source={require('../../assets/images/mina-avatar.png')}
          style={{ width: 32, height: 32, borderRadius: 16 }}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Decline Modal (Screen 07 Frame 1) */}
      <Modal
        visible={declineModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeclineModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.declineModalBox}>
            <Text style={styles.declineModalTitle}>Decline {selectedRequestName}'s request?</Text>
            <Text style={styles.declineModalSub}>
              We'll tell {selectedRequestName} so they can choose another recycler. Nothing is taken from your wallet.
            </Text>

            <TouchableOpacity
              style={styles.keepRequestBtn}
              onPress={() => setDeclineModalVisible(false)}
            >
              <Text style={styles.keepRequestBtnText}>Keep request</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmDeclineBtn}
              onPress={() => setDeclineModalVisible(false)}
            >
              <Text style={styles.confirmDeclineBtnText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Recycler 5-tab Bottom Navigation */}
      <RecyclerBottomNavBar activeTab="Requests" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFCF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  bellBtn: {
    padding: 6,
    position: 'relative',
  },
  bellDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    position: 'absolute',
    top: 6,
    right: 6,
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 10,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    gap: 6,
  },
  tabBtnActive: {
    backgroundColor: '#2E7D32',
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  tabBtnTextActive: {
    color: '#FFFFFF',
  },
  badgePill: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgePillActive: {
    backgroundColor: '#FFFFFF',
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  badgePillTextActive: {
    color: '#2E7D32',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  tabContent: {
    gap: 14,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E7D32',
  },
  cardUserName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  cardLocation: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  timeAgo: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },
  materialBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  materialBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  priceEstimateText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  cardButtonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  viewRequestBtn: {
    flex: 1,
    backgroundColor: '#2E7D32',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewRequestBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardDeclineBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDeclineBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  outlineSecondaryBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  outlineSecondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  statusOnWayBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  statusOnWayText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  tipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginTop: 6,
  },
  tipBannerText: {
    fontSize: 12,
    color: '#166534',
    flex: 1,
  },
  floatingMinaBtn: {
    position: 'absolute',
    bottom: 82,
    right: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  declineModalBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  declineModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  declineModalSub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  keepRequestBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  keepRequestBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  confirmDeclineBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  confirmDeclineBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
});
