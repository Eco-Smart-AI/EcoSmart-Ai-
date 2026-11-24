import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export const TestimonialCard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <Text style={styles.quoteIcon}>“</Text>
      <Text style={styles.quoteText}>{t('landing.testimonial.quote')}</Text>

      <View style={styles.authorRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>A</Text>
        </View>
        <View style={styles.authorDetails}>
          <Text style={styles.authorName}>{t('landing.testimonial.name')}</Text>
          <Text style={styles.authorMeta}>{t('landing.testimonial.meta')}</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.chevronBtn} activeOpacity={0.7}>
            <ChevronLeft size={18} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.chevronBtn} activeOpacity={0.7}>
            <ChevronRight size={18} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    marginVertical: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  quoteIcon: {
    fontSize: 34,
    color: '#2D6A2E',
    fontWeight: '900',
    lineHeight: 34,
  },
  quoteText: {
    fontSize: 15,
    color: '#1E293B',
    lineHeight: 22,
    marginVertical: 8,
    fontWeight: '400',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: '#15803D',
    fontWeight: '800',
    fontSize: 16,
  },
  authorDetails: {
    flex: 1,
    marginLeft: 12,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
  authorMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  controls: {
    flexDirection: 'row',
    gap: 6,
  },
  chevronBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
