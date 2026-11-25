import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Home, Inbox, Package, Wallet, User } from 'lucide-react-native';

interface Props {
  activeTab?:
    | 'home'
    | 'requests'
    | 'listings'
    | 'wallet'
    | 'profile'
    | 'Home'
    | 'Requests'
    | 'Listings'
    | 'Wallet'
    | 'Profile';
}

export const RecyclerBottomNavBar: React.FC<Props> = ({ activeTab }) => {
  const router = useRouter();
  const pathname = usePathname();

  let current = activeTab ? (activeTab.toLowerCase() as 'home' | 'requests' | 'listings' | 'wallet' | 'profile') : undefined;
  if (!current) {
    if (pathname.includes('/recycler/requests') || pathname.includes('/recycler/pickup')) {
      current = 'requests';
    } else if (pathname.includes('/recycler/listings')) {
      current = 'listings';
    } else if (pathname.includes('/recycler/wallet')) {
      current = 'wallet';
    } else if (
      pathname.includes('/recycler/profile') ||
      pathname.includes('/recycler/setup') ||
      pathname.includes('/recycler/verification') ||
      pathname.includes('/recycler/mina') ||
      pathname.includes('/recycler/analytics')
    ) {
      current = 'profile';
    } else {
      current = 'home';
    }
  }

  const tabs: {
    key: 'home' | 'requests' | 'listings' | 'wallet' | 'profile';
    label: string;
    route: string;
    Icon: any;
  }[] = [
    { key: 'home', label: 'Home', route: '/recycler/home', Icon: Home },
    { key: 'requests', label: 'Requests', route: '/recycler/requests', Icon: Inbox },
    { key: 'listings', label: 'Listings', route: '/recycler/listings', Icon: Package },
    { key: 'wallet', label: 'Wallet', route: '/recycler/wallet', Icon: Wallet },
    { key: 'profile', label: 'Profile', route: '/recycler/profile', Icon: User },
  ];

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const isActive = current === tab.key;
        const IconComp = tab.Icon;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.navItem}
            onPress={() => router.push(tab.route as any)}
            activeOpacity={0.75}
          >
            <View style={[styles.iconCapsule, isActive && styles.iconCapsuleActive]}>
              <IconComp
                size={19}
                color={isActive ? '#245825' : '#64748B'}
                strokeWidth={isActive ? 2.3 : 1.9}
              />
            </View>
            <Text style={[styles.navText, isActive && styles.navTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 22 : 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    width: '100%',
    zIndex: 50,
    ...(Platform.OS === 'web'
      ? ({
          position: 'sticky',
          bottom: 0,
        } as any)
      : {}),
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCapsule: {
    width: 44,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
    backgroundColor: 'transparent',
  },
  iconCapsuleActive: {
    backgroundColor: '#E4F3D8',
  },
  navText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  navTextActive: {
    color: '#245825',
    fontWeight: '700',
  },
});

export default RecyclerBottomNavBar;
