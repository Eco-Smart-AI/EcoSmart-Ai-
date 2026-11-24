import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

export const TrustMetrics: React.FC = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {/* Cell 1: Pilot Location */}
        <View style={[styles.cell, styles.borderRight, styles.borderBottom]}>
          <Text style={styles.value}>{t('landing.metrics.kubwa')}</Text>
          <Text style={styles.label}>{t('landing.metrics.kubwaSub')}</Text>
        </View>

        {/* Cell 2: Free to join */}
        <View style={[styles.cell, styles.borderBottom]}>
          <Text style={styles.value}>{t('landing.metrics.free')}</Text>
          <Text style={styles.label}>{t('landing.metrics.freeSub')}</Text>
        </View>

        {/* Cell 3: Recyclers ID Checked */}
        <View style={[styles.cell, styles.borderRight]}>
          <Text style={styles.value}>{t('landing.metrics.verified')}</Text>
          <Text style={styles.label}>{t('landing.metrics.verifiedSub')}</Text>
        </View>

        {/* Cell 4: Escrow Protection */}
        <View style={styles.cell}>
          <Text style={styles.value}>{t('landing.metrics.escrow')}</Text>
          <Text style={styles.label}>{t('landing.metrics.escrowSub')}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '50%',
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderRight: {
    borderRightWidth: 1,
    borderColor: '#F1F5F9',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  value: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F1E12',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
    textAlign: 'center',
  },
});
