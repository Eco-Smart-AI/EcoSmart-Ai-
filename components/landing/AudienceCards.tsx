import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, RefreshCw, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface Props {
  onSelectRole: (role: 'household' | 'recycler') => void;
}

export const AudienceCards: React.FC<Props> = ({ onSelectRole }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('landing.audience.title')}</Text>

      {/* For Households Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => onSelectRole('household')}
        activeOpacity={0.75}
      >
        <View style={styles.iconBoxGreenLight}>
          <Home size={22} color="#2D6A2E" />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{t('landing.audience.householdsTitle')}</Text>
          <Text style={styles.sub}>{t('landing.audience.householdsSub')}</Text>
        </View>
        <ChevronRight size={20} color="#94A3B8" />
      </TouchableOpacity>

      {/* For Recyclers Card */}
      <TouchableOpacity
        style={styles.card}
        onPress={() => onSelectRole('recycler')}
        activeOpacity={0.75}
      >
        <View style={styles.iconBoxGreenDark}>
          <RefreshCw size={20} color="#FFFFFF" />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{t('landing.audience.recyclersTitle')}</Text>
          <Text style={styles.sub}>{t('landing.audience.recyclersSub')}</Text>
        </View>
        <ChevronRight size={20} color="#94A3B8" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginVertical: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  iconBoxGreenLight: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxGreenDark: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#2D6A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F1E12',
  },
  sub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 18,
  },
});
