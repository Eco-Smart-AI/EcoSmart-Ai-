import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Scan, ChevronRight } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface Props {
  onFindRecycler?: () => void;
}

export const ScanPreviewCard: React.FC<Props> = ({ onFindRecycler }) => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      {/* Browser Bar / URL simulation */}
      <View style={styles.browserBar}>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
          <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
          <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
        </View>
        <Text style={styles.browserUrl}>{t('landing.scanPreview.url')}</Text>
      </View>

      {/* Card Content */}
      <View style={styles.body}>
        {/* Header: Scan result & Status Pill */}
        <View style={styles.resultHeader}>
          <View style={styles.resultTitleRow}>
            <Scan size={18} color="#2D6A2E" />
            <Text style={styles.resultTitle}>{t('landing.scanPreview.scanResult')}</Text>
          </View>
          <View style={styles.identifiedPill}>
            <Text style={styles.identifiedText}>{t('landing.scanPreview.identified')}</Text>
          </View>
        </View>

        {/* Identified Item Box */}
        <View style={styles.detectedBox}>
          <View style={styles.scanIconFrame}>
            <Scan size={22} color="#15803D" />
          </View>
          <View style={styles.detectedInfo}>
            <Text style={styles.detectedName}>{t('landing.scanPreview.plasticBottle')}</Text>
            <View style={styles.tagRow}>
              <View style={styles.tagPill}>
                <Text style={styles.tagText}>{t('landing.scanPreview.pet')}</Text>
              </View>
              <View style={styles.tagPill}>
                <Text style={styles.tagText}>{t('landing.scanPreview.recyclable')}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Metrics: Worth & Matched */}
        <View style={styles.metricRow}>
          <View style={styles.metricCol}>
            <Text style={styles.metricLabel}>{t('landing.scanPreview.worthAbout')}</Text>
            <Text style={styles.metricValue}>{t('landing.scanPreview.priceRange')}</Text>
          </View>
          <View style={styles.metricDivider} />
          <View style={styles.metricCol}>
            <Text style={styles.metricLabel}>{t('landing.scanPreview.recyclersNearYou')}</Text>
            <Text style={styles.metricValue}>{t('landing.scanPreview.matchedCount')}</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onFindRecycler}
          activeOpacity={0.85}
        >
          <Text style={styles.actionBtnText}>{t('landing.scanPreview.findRecycler')}</Text>
        </TouchableOpacity>
      </View>

      {/* Pagination Dots indicator */}
      <View style={styles.dotsRow}>
        <View style={styles.activeDot} />
        <View style={styles.inactiveDot} />
        <View style={styles.inactiveDot} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F1E12',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 16,
    elevation: 4,
    overflow: 'hidden',
    marginTop: 24,
  },
  browserBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  dots: {
    flexDirection: 'row',
    gap: 5,
    marginRight: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  browserUrl: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  body: {
    padding: 18,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  resultTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  identifiedPill: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  identifiedText: {
    color: '#15803D',
    fontSize: 12,
    fontWeight: '700',
  },
  detectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF7EE',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
    gap: 12,
  },
  scanIconFrame: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectedInfo: {
    flex: 1,
  },
  detectedName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#14532D',
    marginBottom: 4,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 6,
  },
  tagPill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#15803D',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  metricCol: {
    flex: 1,
  },
  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 12,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionBtn: {
    backgroundColor: '#2D6A2E',
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingBottom: 12,
  },
  activeDot: {
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2D6A2E',
  },
  inactiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
  },
});
