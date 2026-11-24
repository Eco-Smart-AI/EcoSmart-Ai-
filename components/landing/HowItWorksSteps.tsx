import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Scan, Zap, TrendingUp } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export const HowItWorksSteps: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('landing.howItWorks.title')}</Text>

      {/* Step 1 */}
      <View style={styles.stepCard}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>1</Text>
        </View>
        <View style={styles.iconBox}>
          <Scan size={20} color="#2D6A2E" />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{t('landing.howItWorks.step1Title')}</Text>
          <Text style={styles.sub}>{t('landing.howItWorks.step1Sub')}</Text>
        </View>
      </View>

      {/* Step 2 */}
      <View style={styles.stepCard}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>2</Text>
        </View>
        <View style={styles.iconBox}>
          <Zap size={20} color="#2D6A2E" />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{t('landing.howItWorks.step2Title')}</Text>
          <Text style={styles.sub}>{t('landing.howItWorks.step2Sub')}</Text>
        </View>
      </View>

      {/* Step 3 */}
      <View style={styles.stepCard}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>3</Text>
        </View>
        <View style={styles.iconBox}>
          <TrendingUp size={20} color="#2D6A2E" />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{t('landing.howItWorks.step3Title')}</Text>
          <Text style={styles.sub}>{t('landing.howItWorks.step3Sub')}</Text>
        </View>
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
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2D6A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
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
