import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Scan, Sparkles, Banknote, MapPin, Calendar, MessageSquare } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export const AiFeaturesGrid: React.FC = () => {
  const { t } = useTranslation();

  const features = [
    { key: 'wasteId', label: t('landing.aiFeatures.wasteId'), icon: <Scan size={18} color="#2D6A2E" /> },
    { key: 'materialType', label: t('landing.aiFeatures.materialType'), icon: <Sparkles size={18} color="#2D6A2E" /> },
    { key: 'valueEstimate', label: t('landing.aiFeatures.valueEstimate'), icon: <Banknote size={18} color="#2D6A2E" /> },
    { key: 'recyclerMatch', label: t('landing.aiFeatures.recyclerMatch'), icon: <MapPin size={18} color="#2D6A2E" /> },
    { key: 'pickupScheduling', label: t('landing.aiFeatures.pickupScheduling'), icon: <Calendar size={18} color="#2D6A2E" /> },
    { key: 'aiAssistant', label: t('landing.aiFeatures.aiAssistant'), icon: <MessageSquare size={18} color="#2D6A2E" /> },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('landing.aiFeatures.title')}</Text>
      <View style={styles.grid}>
        {features.map((item) => (
          <View key={item.key} style={styles.chip}>
            <View style={styles.iconBox}>{item.icon}</View>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))}
      </View>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
    flexShrink: 1,
  },
});
