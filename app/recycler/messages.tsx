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
  Search,
  MessageSquare,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import RecyclerBottomNavBar from '../../components/common/RecyclerBottomNavBar';

export default function RecyclerMessagesScreen() {
  const router = useRouter();

  const conversations = [
    {
      id: 'musa-a',
      name: 'Musa A.',
      initials: 'MA',
      avatarBg: '#E8F5E9',
      avatarColor: '#2E7D32',
      lastMessage: "I'm at the blue gate",
      time: '10:12',
      badge: 2,
      subtitle: 'Pickup today',
    },
    {
      id: 'halima-b',
      name: 'Halima B.',
      initials: 'HB',
      avatarBg: '#FCE7F3',
      avatarColor: '#BE185D',
      lastMessage: 'Okay, see you tomorrow',
      time: 'Yesterday',
      subtitle: 'Pickup tomorrow',
    },
    {
      id: 'amaka-o',
      name: 'Amaka O.',
      initials: 'AO',
      avatarBg: '#E0F2FE',
      avatarColor: '#0369A1',
      lastMessage: 'Thank you!',
      time: 'Mon',
      subtitle: 'Completed',
    },
  ];

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
          onPress={() => router.push('/recycler/requests' as any)}
          style={styles.backBtn}
        >
          <ArrowLeft size={20} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {conversations.map((conv) => (
          <TouchableOpacity
            key={conv.id}
            style={styles.convCard}
            onPress={() => router.push('/recycler/chat' as any)}
            activeOpacity={0.7}
          >
            <View style={[styles.avatarCircle, { backgroundColor: conv.avatarBg }]}>
              <Text style={[styles.avatarText, { color: conv.avatarColor }]}>{conv.initials}</Text>
            </View>

            <View style={styles.convInfo}>
              <View style={styles.convTopRow}>
                <Text style={styles.convName}>{conv.name}</Text>
                <Text style={styles.convTime}>{conv.time}</Text>
              </View>

              <View style={styles.convBottomRow}>
                <Text style={styles.convLastMsg} numberOfLines={1}>
                  {conv.lastMessage}
                </Text>
                {conv.badge ? (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{conv.badge}</Text>
                  </View>
                ) : null}
              </View>

              <Text style={styles.convSubtitle}>{conv.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
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
    gap: 12,
    paddingBottom: 100,
  },
  convCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
  },
  convInfo: {
    flex: 1,
    marginLeft: 12,
  },
  convTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  convName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  convTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  convBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  convLastMsg: {
    fontSize: 13,
    color: '#4B5563',
    flex: 1,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  convSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
});
