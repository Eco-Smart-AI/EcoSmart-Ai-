import React from 'react';
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
  ArrowLeft,
  Package,
  MessageSquare,
  Wallet,
  ShieldCheck,
  Star,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import RecyclerBottomNavBar from '../../components/common/RecyclerBottomNavBar';

export default function RecyclerNotificationsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        showBack={true}
        rightAction="bell"
        onPressBell={() => router.push('/recycler/notifications' as any)}
      />

      {/* Sub-Header below green wave */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/recycler/home' as any)}
          style={styles.backBtn}
        >
          <ArrowLeft size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* TODAY */}
        <Text style={styles.sectionHeader}>TODAY</Text>

        {/* Item 1: New request from Musa A. */}
        <TouchableOpacity
          style={styles.notifCard}
          onPress={() => router.push('/recycler/pickup' as any)}
        >
          <View style={[styles.notifIconWrap, { backgroundColor: '#E8F5E9' }]}>
            <Package size={20} color="#2E7D32" />
          </View>
          <View style={styles.notifInfo}>
            <View style={styles.notifTitleRow}>
              <Text style={styles.notifTitle}>New request from Musa A.</Text>
              <View style={styles.greenUnreadDot} />
            </View>
            <Text style={styles.notifBody}>PET · ~3 kg · Kubwa · 1.2 km</Text>
            <Text style={styles.notifTime}>5 min ago</Text>
          </View>
        </TouchableOpacity>

        {/* Item 2: Musa A. sent a message */}
        <TouchableOpacity
          style={styles.notifCard}
          onPress={() => router.push('/recycler/chat' as any)}
        >
          <View style={[styles.notifIconWrap, { backgroundColor: '#F3E8FF' }]}>
            <MessageSquare size={20} color="#9333EA" />
          </View>
          <View style={styles.notifInfo}>
            <View style={styles.notifTitleRow}>
              <Text style={styles.notifTitle}>Musa A. sent a message</Text>
              <View style={styles.greenUnreadDot} />
            </View>
            <Text style={styles.notifBody}>"I'm at the blue gate"</Text>
            <Text style={styles.notifTime}>10:12</Text>
          </View>
        </TouchableOpacity>

        {/* Item 3: ₦66 returned to your wallet */}
        <TouchableOpacity
          style={styles.notifCard}
          onPress={() => router.push('/recycler/pickup' as any)}
        >
          <View style={[styles.notifIconWrap, { backgroundColor: '#FEF3C7' }]}>
            <Wallet size={20} color="#D97706" />
          </View>
          <View style={styles.notifInfo}>
            <Text style={styles.notifTitle}>₦66 returned to your wallet</Text>
            <Text style={styles.notifBody}>Unused money from Amaka O.'s pickup</Text>
            <Text style={styles.notifTime}>9:40</Text>
          </View>
        </TouchableOpacity>

        {/* EARLIER */}
        <Text style={[styles.sectionHeader, { marginTop: 24 }]}>EARLIER</Text>

        {/* Item 4: You're verified */}
        <View style={styles.notifCard}>
          <View style={[styles.notifIconWrap, { backgroundColor: '#E8F5E9' }]}>
            <ShieldCheck size={20} color="#2E7D32" />
          </View>
          <View style={styles.notifInfo}>
            <Text style={styles.notifTitle}>You're verified</Text>
            <Text style={styles.notifBody}>You can now accept pickups</Text>
            <Text style={styles.notifTime}>Mon</Text>
          </View>
        </View>

        {/* Item 5: Amaka O. rated you 5 stars */}
        <View style={styles.notifCard}>
          <View style={[styles.notifIconWrap, { backgroundColor: '#FEF3C7' }]}>
            <Star size={20} color="#EAB308" fill="#EAB308" />
          </View>
          <View style={styles.notifInfo}>
            <Text style={styles.notifTitle}>Amaka O. rated you 5 stars</Text>
            <Text style={styles.notifBody}>"Quick and fair"</Text>
            <Text style={styles.notifTime}>Mon</Text>
          </View>
        </View>
      </ScrollView>

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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginLeft: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 10,
    alignItems: 'center',
  },
  notifIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifInfo: {
    flex: 1,
    marginLeft: 12,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  greenUnreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
  },
  notifBody: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },
  notifTime: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
