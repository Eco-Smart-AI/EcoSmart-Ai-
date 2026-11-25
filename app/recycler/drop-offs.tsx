import React from 'react';
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
  Clock,
  Info,
} from 'lucide-react-native';
import TopGreenWave from '../../components/common/TopGreenWave';
import RecyclerBottomNavBar from '../../components/common/RecyclerBottomNavBar';

export default function RecyclerDropOffsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <TopGreenWave />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/recycler/requests' as any)}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Drop-offs today</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.mainTitle}>2 people are coming</Text>
        <Text style={styles.mainSub}>Weigh in front of them, then send the amount.</Text>

        {/* Person 1: Musa A. */}
        <View style={styles.dropOffCard}>
          <View style={styles.personHeaderRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>MA</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.personName}>Musa A.</Text>
              <Text style={styles.wasteDetail}>PET bottles · ~3 kg</Text>
            </View>
          </View>

          <View style={styles.timeTagRow}>
            <Clock size={14} color="#D97706" />
            <Text style={styles.timeTagText}>On the way · about 2:30pm</Text>
          </View>

          <TouchableOpacity
            style={styles.primaryWeighBtn}
            onPress={() => router.push('/recycler/pickup' as any)}
          >
            <Text style={styles.primaryWeighBtnText}>They're here · weigh now</Text>
          </TouchableOpacity>
        </View>

        {/* Person 2: Amaka O. */}
        <View style={styles.dropOffCard}>
          <View style={styles.personHeaderRow}>
            <View style={[styles.avatarCircle, { backgroundColor: '#E0F2FE' }]}>
              <Text style={[styles.avatarText, { color: '#0369A1' }]}>AO</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.personName}>Amaka O.</Text>
              <Text style={styles.wasteDetail}>Cardboard · ~6 kg</Text>
            </View>
          </View>

          <View style={styles.timeTagRow}>
            <Clock size={14} color="#6B7280" />
            <Text style={[styles.timeTagText, { color: '#6B7280' }]}>Coming this afternoon</Text>
          </View>

          <TouchableOpacity
            style={styles.outlineHereBtn}
            onPress={() => router.push('/recycler/pickup' as any)}
          >
            <Text style={styles.outlineHereBtnText}>They're here</Text>
          </TouchableOpacity>
        </View>

        {/* Footer tip */}
        <View style={styles.footerNoteRow}>
          <Info size={14} color="#6B7280" />
          <Text style={styles.footerNoteText}>
            Money for each drop-off is already set aside from your wallet.
          </Text>
        </View>
      </ScrollView>

      {/* Recycler 5-tab Bottom Navigation */}
      <RecyclerBottomNavBar activeTab="Requests" />
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
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  mainSub: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16,
  },
  dropOffCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 14,
  },
  personHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  personName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  wasteDetail: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  timeTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  timeTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D97706',
  },
  primaryWeighBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryWeighBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  outlineHereBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  outlineHereBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  footerNoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  footerNoteText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
});
