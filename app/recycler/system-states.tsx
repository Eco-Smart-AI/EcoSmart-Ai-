import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bell,
  Inbox,
  WifiOff,
  AlertCircle,
  MapPin,
} from 'lucide-react-native';
import TopGreenWave from '../../components/common/TopGreenWave';
import RecyclerBottomNavBar from '../../components/common/RecyclerBottomNavBar';

type SystemStateMode = 'empty' | 'loading' | 'offline' | 'error';

export default function RecyclerSystemStatesScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<SystemStateMode>('empty');

  const states: { id: SystemStateMode; label: string }[] = [
    { id: 'empty', label: '1. Empty' },
    { id: 'loading', label: '2. Loading' },
    { id: 'offline', label: '3. Offline' },
    { id: 'error', label: '4. Error' },
  ];

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
        </TouchableOpacity>
      </View>

      {/* Demo Switcher Pills */}
      <View style={styles.demoPillsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoPillsScroll}
        >
          {states.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[styles.demoPill, mode === s.id && styles.demoPillActive]}
              onPress={() => setMode(s.id)}
            >
              <Text style={[styles.demoPillText, mode === s.id && styles.demoPillTextActive]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ================= FRAME 1: EMPTY ================= */}
        {mode === 'empty' && (
          <View style={styles.centerBox}>
            <View style={styles.greenIconCircle}>
              <Inbox size={30} color="#2E7D32" />
            </View>
            <Text style={styles.centerTitle}>No requests yet</Text>
            <Text style={styles.centerSub}>
              New pickup requests near you will show here. Keep your prices fair to get more.
            </Text>
            <TouchableOpacity
              style={styles.outlineBtn}
              onPress={() => router.push('/recycler/listings' as any)}
            >
              <Text style={styles.outlineBtnText}>Check my listings</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= FRAME 2: LOADING ================= */}
        {mode === 'loading' && (
          <View style={styles.loadingWrap}>
            {[1, 2, 3].map((idx) => (
              <View key={idx} style={styles.skeletonCard}>
                <View style={styles.skeletonTopRow}>
                  <View style={styles.skeletonAvatar} />
                  <View style={{ flex: 1, marginLeft: 12, gap: 6 }}>
                    <View style={styles.skeletonLineMedium} />
                    <View style={styles.skeletonLineShort} />
                  </View>
                </View>
                <View style={styles.skeletonLineLong} />
                <View style={styles.skeletonBtnBlock} />
              </View>
            ))}
            <Text style={styles.loadingCaption}>Loading requests...</Text>
          </View>
        )}

        {/* ================= FRAME 3: OFFLINE ================= */}
        {mode === 'offline' && (
          <View style={styles.offlineWrap}>
            <View style={styles.offlineBanner}>
              <WifiOff size={16} color="#374151" />
              <Text style={styles.offlineBannerText}>
                You're offline. Showing what was saved at 10:12.
              </Text>
            </View>

            <View style={styles.savedRequestCard}>
              <Text style={styles.savedTitle}>Musa A. · PET ~3 kg</Text>
              <View style={styles.savedLocRow}>
                <MapPin size={13} color="#6B7280" />
                <Text style={styles.savedLocText}>Kubwa · 1.2 km</Text>
              </View>
              <Text style={styles.savedBody}>
                Accepting needs a connection. Chat messages and codes will send when you're back
                online.
              </Text>
            </View>
          </View>
        )}

        {/* ================= FRAME 4: ERROR ================= */}
        {mode === 'error' && (
          <View style={styles.centerBox}>
            <View style={styles.redIconCircle}>
              <AlertCircle size={30} color="#DC2626" />
            </View>
            <Text style={styles.centerTitle}>We couldn't load your requests</Text>
            <Text style={styles.centerSub}>
              It's not your fault. Check your connection and try again.
            </Text>
            <TouchableOpacity
              style={styles.solidGreenBtn}
              onPress={() => router.push('/recycler/requests' as any)}
            >
              <Text style={styles.solidGreenBtnText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* 5-Tab Bottom Navigation */}
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
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  bellBtn: {
    padding: 6,
  },
  demoPillsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 8,
  },
  demoPillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  demoPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  demoPillActive: {
    backgroundColor: '#2E7D32',
  },
  demoPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  demoPillTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 90,
    paddingHorizontal: 20,
  },
  greenIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  redIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  centerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  centerSub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
    marginBottom: 20,
  },
  outlineBtn: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  outlineBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E7D32',
  },
  solidGreenBtn: {
    width: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  solidGreenBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  loadingWrap: {
    gap: 14,
  },
  skeletonCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
    gap: 12,
  },
  skeletonTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
  },
  skeletonLineMedium: {
    width: '55%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  skeletonLineShort: {
    width: '35%',
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
  },
  skeletonLineLong: {
    width: '45%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  skeletonBtnBlock: {
    width: '100%',
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F3F4F6',
  },
  loadingCaption: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  offlineWrap: {
    gap: 12,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  offlineBannerText: {
    fontSize: 13,
    color: '#111827',
    fontWeight: '500',
  },
  savedRequestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  savedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  savedLocRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  savedLocText: {
    fontSize: 12,
    color: '#6B7280',
  },
  savedBody: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
    lineHeight: 18,
  },
});
