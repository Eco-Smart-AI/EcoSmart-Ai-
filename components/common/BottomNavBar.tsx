import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, Scan, Inbox, User } from 'lucide-react-native';

interface Props {
  activeTab?: 'home' | 'scan' | 'requests' | 'messages' | 'profile';
}

export const BottomNavBar: React.FC<Props> = ({ activeTab }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Determine active tab if not explicitly passed
  let current = activeTab;
  if (!current) {
    if (pathname.includes('/home') || pathname.includes('/wallet') || pathname.includes('/wanted') || pathname === '/') current = 'home';
    else if (pathname.includes('/scan')) current = 'scan';
    else if (
      pathname.includes('/requests') ||
      pathname.includes('/pickup') ||
      pathname.includes('/drop-off') ||
      pathname.includes('/recyclers') ||
      pathname.includes('/negotiation') ||
      pathname.includes('/chat')
    ) {
      current = 'requests';
    } else if (pathname.includes('/messages') || pathname.includes('/profile')) {
      current = 'profile';
    } else {
      current = 'home';
    }
  }

  // Map 5-value prop to the 4 visual tabs matching BottomNav · Household.png
  const resolvedTab: 'home' | 'scan' | 'requests' | 'profile' =
    current === 'messages' ? 'profile' : current;

  const isHome = resolvedTab === 'home';
  const isScan = resolvedTab === 'scan';
  const isRequests = resolvedTab === 'requests';
  const isProfile = resolvedTab === 'profile';

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push('/home')}
        activeOpacity={0.7}
      >
        <View style={[styles.iconPill, isHome && styles.iconPillActive]}>
          <Home size={20} color={isHome ? '#2D6A2E' : '#64748B'} strokeWidth={2.2} />
        </View>
        <Text style={[styles.navText, isHome && styles.navTextActive]}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push('/scan')}
        activeOpacity={0.7}
      >
        <View style={[styles.iconPill, isScan && styles.iconPillActive]}>
          <Scan size={20} color={isScan ? '#2D6A2E' : '#64748B'} strokeWidth={2.2} />
        </View>
        <Text style={[styles.navText, isScan && styles.navTextActive]}>Scan</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push('/requests')}
        activeOpacity={0.7}
      >
        <View style={[styles.iconPill, isRequests && styles.iconPillActive]}>
          <Inbox size={20} color={isRequests ? '#2D6A2E' : '#64748B'} strokeWidth={2.2} />
        </View>
        <Text style={[styles.navText, isRequests && styles.navTextActive]}>Requests</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push('/profile')}
        activeOpacity={0.7}
      >
        <View style={[styles.iconPill, isProfile && styles.iconPillActive]}>
          <User size={20} color={isProfile ? '#2D6A2E' : '#64748B'} strokeWidth={2.2} />
        </View>
        <Text style={[styles.navText, isProfile && styles.navTextActive]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    height: 68,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 6,
    paddingTop: 6,
    zIndex: 50,
    ...(Platform.OS === 'web'
      ? {
          position: 'sticky' as any,
          bottom: 0,
          left: 0,
          right: 0,
        }
      : {}),
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconPill: {
    width: 56,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconPillActive: {
    backgroundColor: '#E4F3D8',
  },
  navText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  navTextActive: {
    color: '#2D6A2E',
    fontWeight: '700',
  },
});
