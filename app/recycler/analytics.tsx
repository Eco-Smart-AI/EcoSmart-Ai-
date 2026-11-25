import React, { useState } from 'react';
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
  TrendingUp,
  Star,
  Award,
  Package,
} from 'lucide-react-native';
import TopGreenWave from '../../components/common/TopGreenWave';
import RecyclerBottomNavBar from '../../components/common/RecyclerBottomNavBar';

type AnalyticsFilter = 'week' | 'month' | '3months';

export default function RecyclerAnalyticsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<AnalyticsFilter>('month');

  const chartBars = [
    { label: 'W1', height: 45 },
    { label: 'W2', height: 60 },
    { label: 'W3', height: 40 },
    { label: 'W4', height: 75 },
    { label: 'W5', height: 90 },
    { label: 'W6', height: 65 },
    { label: 'W7', height: 85 },
    { label: 'W8', height: 100 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <TopGreenWave />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/recycler/home' as any)}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={styles.sampleDataBadge}>
          <Text style={styles.sampleDataText}>Sample data</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Time Filter Pills */}
        <View style={styles.filtersRow}>
          {[
            { id: 'week', label: 'This week' },
            { id: 'month', label: 'This month' },
            { id: '3months', label: '3 months' },
          ].map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.filterPill, filter === item.id && styles.filterPillActive]}
              onPress={() => setFilter(item.id as any)}
            >
              <Text style={[styles.filterPillText, filter === item.id && styles.filterPillTextActive]}>
                {filter === item.id ? '✓ ' : ''}{item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Big Earnings Card */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsSub}>You earned</Text>
          <Text style={styles.earningsAmount}>₦166,600</Text>
          <View style={styles.trendRow}>
            <TrendingUp size={16} color="#166534" />
            <Text style={styles.trendText}>Up ₦12,400 on last month</Text>
          </View>
        </View>

        {/* Weekly Bar Chart */}
        <View style={styles.chartCard}>
          <View style={styles.barsContainer}>
            {chartBars.map((bar, i) => (
              <View key={i} style={styles.barCol}>
                <View style={[styles.barFill, { height: bar.height }]} />
                <Text style={styles.barLabel}>{bar.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 3 Metric Tiles: Pickups, Weight, Rating */}
        <View style={styles.statsRow}>
          <View style={styles.statTile}>
            <Text style={styles.statNumber}>27</Text>
            <Text style={styles.statLabel}>pickups done</Text>
          </View>

          <View style={styles.statTile}>
            <Text style={styles.statNumber}>2,340 kg</Text>
            <Text style={styles.statLabel}>collected</Text>
          </View>

          <View style={styles.statTile}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Text style={styles.statNumber}>4.8</Text>
              <Star size={18} color="#EAB308" fill="#EAB308" />
            </View>
            <Text style={styles.statLabel}>rating</Text>
          </View>
        </View>

        {/* Top Materials Collected */}
        <View style={styles.materialsCard}>
          <Text style={styles.materialsHeader}>Top materials</Text>

          {/* Material 1: Plastic */}
          <View style={styles.materialRow}>
            <View style={styles.materialNameRow}>
              <Text style={styles.materialName}>Plastic</Text>
              <Text style={styles.materialWeight}>890 kg</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: '85%' }]} />
            </View>
          </View>

          {/* Material 2: Aluminium */}
          <View style={styles.materialRow}>
            <View style={styles.materialNameRow}>
              <Text style={styles.materialName}>Aluminium</Text>
              <Text style={styles.materialWeight}>620 kg</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: '60%' }]} />
            </View>
          </View>

          {/* Material 3: Paper */}
          <View style={styles.materialRow}>
            <View style={styles.materialNameRow}>
              <Text style={styles.materialName}>Paper</Text>
              <Text style={styles.materialWeight}>430 kg</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: '42%' }]} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Recycler 5-tab Bottom Navigation */}
      <RecyclerBottomNavBar activeTab="Profile" />
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
    flex: 1,
  },
  sampleDataBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  sampleDataText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 14,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterPillActive: {
    backgroundColor: '#E8F5E9',
    borderColor: '#2E7D32',
  },
  filterPillText: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '500',
  },
  filterPillTextActive: {
    color: '#2E7D32',
    fontWeight: '700',
  },
  earningsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 18,
  },
  earningsSub: {
    fontSize: 13,
    color: '#6B7280',
  },
  earningsAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111827',
    marginTop: 4,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  trendText: {
    fontSize: 13,
    color: '#166534',
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    height: 160,
    justifyContent: 'flex-end',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
    paddingHorizontal: 8,
  },
  barCol: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
  },
  barFill: {
    width: 20,
    backgroundColor: '#86EFAC',
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statTile: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  materialsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 18,
  },
  materialsHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 14,
  },
  materialRow: {
    marginBottom: 14,
  },
  materialNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  materialName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  materialWeight: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 4,
  },
});
