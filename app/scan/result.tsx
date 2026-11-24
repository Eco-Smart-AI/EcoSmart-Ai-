import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Edit3,
  Scale,
  Ban,
  ChevronRight,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomNavBar } from '../../components/common/BottomNavBar';
import { CorrectionSheet, WasteCategory } from '../../components/scan/CorrectionSheet';

export default function ScanResultScreen() {
  const router = useRouter();

  // State
  const [isRejectedMode, setIsRejectedMode] = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);

  // Dynamic scanned material details
  const [material, setMaterial] = useState<{
    id: string;
    name: string;
    title: string;
    weight: number;
    rate: number;
  }>({
    id: 'pet',
    name: 'Clear PET Plastic',
    title: 'Hard, heavy bottle',
    weight: 3.2,
    rate: 120,
  });

  const estimatedTotal = Math.round(material.weight * material.rate);

  const handleApplyCorrection = (cat: WasteCategory, newWeight: number) => {
    setMaterial({
      id: cat.id,
      name: cat.name,
      title: cat.id === 'hdpe' ? 'Hard, heavy bottle' : cat.name,
      weight: newWeight,
      rate: cat.unitPrice,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader showBack={true} rightAction="bell" />

      {/* Demo State Switcher */}
      <View style={styles.demoBar}>
        <Text style={styles.demoTitle}>Result Mode:</Text>
        <TouchableOpacity
          style={[styles.demoPill, !isRejectedMode && styles.demoPillActive]}
          onPress={() => setIsRejectedMode(false)}
        >
          <Text style={[styles.demoPillText, !isRejectedMode && styles.demoPillTextActive]}>
            Hard, heavy bottle
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoPill, isRejectedMode && styles.demoPillActive]}
          onPress={() => setIsRejectedMode(true)}
        >
          <Text style={[styles.demoPillText, isRejectedMode && styles.demoPillTextActive]}>
            Not collected
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ======================================================= */}
        {/* State A: Accepted Material (Hard, heavy bottle)         */}
        {/* ======================================================= */}
        {!isRejectedMode ? (
          <View>
            {/* Header Badge */}
            <View style={styles.headerRow}>
              <View style={styles.verifiedBadge}>
                <Sparkles size={14} color="#2D6A2E" />
                <Text style={styles.verifiedBadgeText}>AI Identified · 98% match</Text>
              </View>
              <TouchableOpacity
                style={styles.retakeSmallBtn}
                onPress={() => router.push('/scan')}
                activeOpacity={0.7}
              >
                <RotateCcw size={14} color="#64748B" />
                <Text style={styles.retakeSmallText}>Retake</Text>
              </TouchableOpacity>
            </View>

            {/* Material Identification Card */}
            <View style={styles.materialCard}>
              <View style={styles.materialIconCircle}>
                <Scale size={28} color="#2D6A2E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.materialHeadline}>{material.title}</Text>
                <Text style={styles.materialSubtype}>{material.name}</Text>
              </View>
            </View>

            {/* Valuation Card ("You could get") */}
            <View style={styles.valuationCard}>
              <Text style={styles.valuationLabel}>You could get</Text>
              <View style={styles.valuationRow}>
                <Text style={styles.valuationAmount}>₦{estimatedTotal}</Text>
                <View style={styles.weightBadge}>
                  <Text style={styles.weightBadgeText}>{material.weight} kg</Text>
                </View>
              </View>
              <Text style={styles.valuationFormula}>
                {material.weight} kg × ₦{material.rate}/kg (Kubwa current average)
              </Text>
            </View>

            {/* Quality Checklist */}
            <View style={styles.checklistCard}>
              <Text style={styles.checklistTitle}>Quick checklist for top price</Text>
              <View style={styles.checkItem}>
                <CheckCircle2 size={16} color="#2D6A2E" />
                <Text style={styles.checkItemText}>Empty and rinse bottles</Text>
              </View>
              <View style={styles.checkItem}>
                <CheckCircle2 size={16} color="#2D6A2E" />
                <Text style={styles.checkItemText}>Keep caps in a separate bag</Text>
              </View>
            </View>

            {/* "Not right? Change it" Link */}
            <TouchableOpacity
              style={styles.changeLink}
              onPress={() => setSheetVisible(true)}
              activeOpacity={0.7}
            >
              <Edit3 size={15} color="#2D6A2E" />
              <Text style={styles.changeLinkText}>Not right? Change it</Text>
            </TouchableOpacity>

            {/* Escrow note */}
            <View style={styles.escrowBanner}>
              <ShieldCheck size={16} color="#2D6A2E" />
              <Text style={styles.escrowBannerText}>
                EcoSmart holds your payment safe in escrow until bottles are weighed.
              </Text>
            </View>

            {/* CTA Button */}
            <TouchableOpacity
              style={styles.primaryCtaBtn}
              onPress={() => router.push('/recyclers')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryCtaBtnText}>Find recyclers for this</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ) : (
          /* ======================================================= */
          /* State B: Not Collected / Rejection Guide                */
          /* ======================================================= */
          <View>
            <View style={styles.rejectIconWrap}>
              <Ban size={40} color="#DC2626" />
            </View>

            <Text style={styles.rejectTitle}>Not collected</Text>
            <Text style={styles.rejectSubhead}>
              EcoSmart partners in Kubwa cannot purchase this material.
            </Text>

            <View style={styles.rejectReasonsCard}>
              <Text style={styles.rejectSectionTitle}>Why this item is not accepted:</Text>
              <Text style={styles.rejectReasonItem}>
                • Single-use thin nylon/polythene bags are not recyclable at our partner facilities.
              </Text>
              <Text style={styles.rejectReasonItem}>
                • Items contaminated with food grease, medical chemicals, or hazardous solvents.
              </Text>
            </View>

            <View style={styles.properDisposalCard}>
              <Text style={styles.properDisposalTitle}>Recommended disposal:</Text>
              <Text style={styles.properDisposalText}>
                Please bag this item securely and dispose via your scheduled municipal waste collector (AEPB in Abuja).
              </Text>
            </View>

            <TouchableOpacity
              style={styles.primaryCtaBtn}
              onPress={() => router.push('/scan')}
              activeOpacity={0.8}
            >
              <RotateCcw size={18} color="#FFFFFF" />
              <Text style={styles.primaryCtaBtnText}>Scan another item</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Manual Correction Bottom Sheet */}
      <CorrectionSheet
        visible={sheetVisible}
        currentCategory={material.id}
        currentWeight={material.weight}
        onClose={() => setSheetVisible(false)}
        onApply={handleApplyCorrection}
      />

      {/* Bottom Navigation */}
      <BottomNavBar activeTab="scan" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  demoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#EFF6FF',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    gap: 6,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  demoPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  demoPillActive: {
    backgroundColor: '#2D6A2E',
    borderColor: '#2D6A2E',
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E3A8A',
  },
  demoPillTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 18,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
  retakeSmallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  retakeSmallText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  materialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  materialIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EAF5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  materialHeadline: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1E12',
    letterSpacing: -0.2,
  },
  materialSubtype: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  valuationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#C7E4B2',
    marginBottom: 14,
    shadowColor: '#2D6A2E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  valuationLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  valuationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  valuationAmount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#0F1E12',
    letterSpacing: -0.5,
  },
  weightBadge: {
    backgroundColor: '#EAF5EA',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  weightBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2D6A2E',
  },
  valuationFormula: {
    fontSize: 13,
    color: '#475569',
  },
  checklistCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  checklistTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 10,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  checkItemText: {
    fontSize: 13,
    color: '#334155',
  },
  changeLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    marginBottom: 14,
  },
  changeLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D6A2E',
    textDecorationLine: 'underline',
  },
  escrowBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EAF5EA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  escrowBannerText: {
    fontSize: 12,
    color: '#2D6A2E',
    fontWeight: '500',
    flex: 1,
  },
  primaryCtaBtn: {
    backgroundColor: '#2D6A2E',
    paddingVertical: 15,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#2D6A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  primaryCtaBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  rejectIconWrap: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 16,
  },
  rejectTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F1E12',
    textAlign: 'center',
    marginBottom: 6,
  },
  rejectSubhead: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  rejectReasonsCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 14,
  },
  rejectSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 8,
  },
  rejectReasonItem: {
    fontSize: 13,
    color: '#B45309',
    lineHeight: 18,
    marginBottom: 6,
  },
  properDisposalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  properDisposalTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 6,
  },
  properDisposalText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
});
