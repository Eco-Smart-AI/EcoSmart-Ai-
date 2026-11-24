import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, ChevronRight, MessageSquare } from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomNavBar } from '../../components/common/BottomNavBar';

interface MessageThread {
  id: string;
  name: string;
  avatarInitials: string;
  avatarBg: string;
  time: string;
  lastMessage: string;
  tag: string;
  tagType: 'pickup' | 'question' | 'done';
  unread?: boolean;
}

const THREADS: MessageThread[] = [
  {
    id: 'kubwa-green-hub',
    name: 'Kubwa Green Hub',
    avatarInitials: 'KG',
    avatarBg: '#EAF5EA',
    time: '10:06',
    lastMessage: 'Good morning! Our van is delayed. Can we come at 2pm?',
    tag: 'Pickup · Accepted',
    tagType: 'pickup',
    unread: true,
  },
  {
    id: 'bwari-renew',
    name: 'Bwari Renew',
    avatarInitials: 'BR',
    avatarBg: '#EFF6FF',
    time: 'Yesterday',
    lastMessage: 'Yes, we buy PET. ₦150/kg today.',
    tag: 'Question',
    tagType: 'question',
  },
  {
    id: 'dutse-circular',
    name: 'Dutse Circular',
    avatarInitials: 'DC',
    avatarBg: '#F1F5F9',
    time: 'Mon',
    lastMessage: 'Thanks! Your ₦300 is in your wallet.',
    tag: 'Done',
    tagType: 'done',
  },
];

export default function MessagesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader showBack={true} rightAction="bell" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title & Privacy Subtitle */}
        <View style={styles.titleSection}>
          <Text style={styles.screenTitle}>Messages</Text>
          <Text style={styles.screenSubtitle}>
            Your private chats with recyclers. Numbers stay hidden.
          </Text>
        </View>

        {/* Privacy Note Banner */}
        <View style={styles.privacyBanner}>
          <ShieldCheck size={18} color="#2D6A2E" />
          <Text style={styles.privacyText}>
            EcoSmart masks your personal phone number on all calls and messages.
          </Text>
        </View>

        {/* Chat Thread List */}
        <View style={styles.threadList}>
          {THREADS.map((thread) => {
            return (
              <TouchableOpacity
                key={thread.id}
                style={[styles.threadCard, thread.unread && styles.threadCardUnread]}
                onPress={() => router.push(`/chat/${thread.id}`)}
                activeOpacity={0.7}
              >
                <View style={[styles.avatar, { backgroundColor: thread.avatarBg }]}>
                  <Text style={styles.avatarText}>{thread.avatarInitials}</Text>
                  {thread.unread && <View style={styles.unreadDot} />}
                </View>

                <View style={styles.threadBody}>
                  <View style={styles.threadHeader}>
                    <Text style={styles.threadName}>{thread.name}</Text>
                    <Text style={styles.threadTime}>{thread.time}</Text>
                  </View>

                  <Text
                    style={[styles.lastMessage, thread.unread && styles.lastMessageUnread]}
                    numberOfLines={1}
                  >
                    {thread.lastMessage}
                  </Text>

                  <View style={styles.tagRow}>
                    <View
                      style={[
                        styles.tagPill,
                        thread.tagType === 'pickup' && styles.tagPickup,
                        thread.tagType === 'question' && styles.tagQuestion,
                        thread.tagType === 'done' && styles.tagDone,
                      ]}
                    >
                      <Text
                        style={[
                          styles.tagText,
                          thread.tagType === 'pickup' && styles.tagTextPickup,
                          thread.tagType === 'question' && styles.tagTextQuestion,
                          thread.tagType === 'done' && styles.tagTextDone,
                        ]}
                      >
                        {thread.tag}
                      </Text>
                    </View>
                  </View>
                </View>

                <ChevronRight size={18} color="#94A3B8" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom Nav with Messages tab highlighted */}
      <BottomNavBar activeTab="messages" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 32,
  },
  titleSection: {
    marginBottom: 14,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  screenSubtitle: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  privacyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#EAF5EA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#C7E4B2',
  },
  privacyText: {
    fontSize: 12,
    color: '#2D6A2E',
    fontWeight: '500',
    flex: 1,
  },
  threadList: {
    gap: 10,
  },
  threadCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  threadCardUnread: {
    borderColor: '#C7E4B2',
    backgroundColor: '#FAFDF9',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    position: 'relative',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#2D6A2E',
  },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2D6A2E',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  threadBody: {
    flex: 1,
    marginRight: 8,
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  threadName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1E12',
  },
  threadTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  lastMessage: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },
  lastMessageUnread: {
    color: '#0F1E12',
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tagPickup: {
    backgroundColor: '#EAF5EA',
  },
  tagQuestion: {
    backgroundColor: '#EFF6FF',
  },
  tagDone: {
    backgroundColor: '#F1F5F9',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tagTextPickup: {
    color: '#2D6A2E',
  },
  tagTextQuestion: {
    color: '#2563EB',
  },
  tagTextDone: {
    color: '#64748B',
  },
});
