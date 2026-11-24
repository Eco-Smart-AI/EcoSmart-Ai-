import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
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
  HelpCircle,
  Bell,
  Check,
  Clock,
  Sun,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomNavBar } from '../../components/common/BottomNavBar';
import { CorrectionSheet, WasteCategory } from '../../components/scan/CorrectionSheet';

type ScanResultMode = 'recyclable' | 'not_sure' | 'not_recyclable' | 'not_collected_yet';

export default function ScanResultScreen() {
  const router = useRouter();

  // 4 Set-D Result Modes: Recyclable, Not sure, Not recyclable, Not collected yet
  const [resultMode, setResultMode] = useState<ScanResultMode>('recyclable');
  const [sheetVisible, setSheetVisible] = useState(false);
  const [notifySubscribed, setNotifySubscribed] = useState(false);

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
    setResultMode('recyclable');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader showBack={true} rightAction="bell" />

      {/* Demo State Switcher */}
      <View style={styles.demoBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoScroll}
        >
          <Text style={styles.demoTitle}>Scan Result:</Text>
          <TouchableOpacity
            style={[styles.demoPill, resultMode === 'recyclable' && styles.demoPillActive]}
            onPress={() => setResultMode('recyclable')}
          >
            <Text
              style={[
                styles.demoPillText,
                resultMode === 'recyclable' && styles.demoPillTextActive,
              ]}
            >
              Recyclable
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoPill, resultMode === 'not_sure' && styles.demoPillActive]}
            onPress={() => setResultMode('not_sure')}
          >
            <Text
              style={[
                styles.demoPillText,
                resultMode === 'not_sure' && styles.demoPillTextActive,
              ]}
            >
              Not sure
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoPill, resultMode === 'not_recyclable' && styles.demoPillActive]}
            onPress={() => setResultMode('not_recyclable')}
          >
            <Text
              style={[
                styles.demoPillText,
                resultMode === 'not_recyclable' && styles.demoPillTextActive,
              ]}
            >
              Not recyclable
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.demoPill, resultMode === 'not_collected_yet' && styles.demoPillActive]}
            onPress={() => setResultMode('not_collected_yet')}
          >
            <Text
              style={[
                styles.demoPillText,
                resultMode === 'not_collected_yet' && styles.demoPillTextActive,
              ]}
            >
              Not collected yet
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ======================================================= */}
        {/* 1. Scan result · Recyclable                             */}
        {/* ======================================================= */}
        {resultMode === 'recyclable' && (
          <View>
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

            <View style={styles.materialCard}>
              <View style={styles.materialIconCircle}>
                <Scale size={28} color="#2D6A2E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.materialHeadline}>{material.title}</Text>
                <Text style={styles.materialSubtype}>{material.name}</Text>
              </View>
            </View>

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

            <TouchableOpacity
              style={styles.changeLink}
              onPress={() => setSheetVisible(true)}
              activeOpacity={0.7}
            >
              <Edit3 size={15} color="#2D6A2E" />
              <Text style={styles.changeLinkText}>Not right? Change it</Text>
            </TouchableOpacity>

            <View style={styles.escrowBanner}>
              <ShieldCheck size={16} color="#2D6A2E" />
              <Text style={styles.escrowBannerText}>
                EcoSmart holds your payment safe in escrow until bottles are weighed.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.primaryCtaBtn}
              onPress={() => router.push('/recyclers')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryCtaBtnText}>Find recyclers for this</Text>
              <ArrowRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================= */}
        {/* 2. Scan result · Not sure                               */}
        {/* ======================================================= */}
        {resultMode === 'not_sure' && (
          <View>
            <View style={styles.notSureIconWrap}>
              <HelpCircle size={38} color="#D97706" />
            </View>

            <View style={styles.amberPillSelf}>
              <AlertTriangle size={13} color="#B45309" />
              <Text style={styles.amberPillText}>Low light or blurry photo</Text>
            </View>

            <Text style={styles.rejectTitle}>We're not quite sure</Text>
            <Text style={styles.rejectSubhead}>
              We couldn't see the label clearly. Retake in good light, or pick what you scanned below:
            </Text>

            {/* Quick Pick Material Options */}
            <View style={styles.quickPickSection}>
              <Text style={styles.quickPickLabel}>WHICH ONE IS IT?</Text>

              <TouchableOpacity
                style={styles.quickPickCard}
                onPress={() => {
                  setMaterial({
                    id: 'pet',
                    name: 'Clear PET Plastic',
                    title: 'Clear drink bottle (PET)',
                    weight: 3.0,
                    rate: 120,
                  });
                  setResultMode('recyclable');
                }}
                activeOpacity={0.75}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.quickPickTitle}>Clear drink bottle (PET)</Text>
                  <Text style={styles.quickPickSub}>Water or soda bottle · ₦100–150/kg</Text>
                </View>
                <ArrowRight size={18} color="#2D6A2E" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickPickCard}
                onPress={() => {
                  setMaterial({
                    id: 'hdpe',
                    name: 'HDPE Rigid Plastic',
                    title: 'Hard, heavy bottle',
                    weight: 3.0,
                    rate: 130,
                  });
                  setResultMode('recyclable');
                }}
                activeOpacity={0.75}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.quickPickTitle}>Thick plastic container (HDPE)</Text>
                  <Text style={styles.quickPickSub}>Shampoo, detergent, jerrycan · ₦110–140/kg</Text>
                </View>
                <ArrowRight size={18} color="#2D6A2E" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.quickPickCard}
                onPress={() => {
                  setMaterial({
                    id: 'cans',
                    name: 'Aluminium Drink Cans',
                    title: 'Aluminium cans',
                    weight: 2.5,
                    rate: 220,
                  });
                  setResultMode('recyclable');
                }}
                activeOpacity={0.75}
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.quickPickTitle}>Drink can (Aluminium)</Text>
                  <Text style={styles.quickPickSub}>Malt, soda, energy drink cans · ₦180–250/kg</Text>
                </View>
                <ArrowRight size={18} color="#2D6A2E" />
              </TouchableOpacity>
            </View>

            {/* Light tip */}
            <View style={styles.tipBoxAmber}>
              <Sun size={16} color="#B45309" />
              <Text style={styles.tipBoxAmberText}>
                Tip: Put one item on a plain surface and show the recycling triangle or label.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.primaryCtaBtn}
              onPress={() => router.push('/scan')}
              activeOpacity={0.8}
            >
              <RotateCcw size={18} color="#FFFFFF" />
              <Text style={styles.primaryCtaBtnText}>Retake photo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================= */}
        {/* 3. Scan result · Not recyclable                         */}
        {/* ======================================================= */}
        {resultMode === 'not_recyclable' && (
          <View>
            <View style={styles.rejectIconWrap}>
              <Ban size={40} color="#DC2626" />
            </View>

            <View style={styles.redPillSelf}>
              <Text style={styles.redPillText}>Not recyclable</Text>
            </View>

            <Text style={styles.rejectTitle}>This item can't be recycled</Text>
            <Text style={styles.rejectSubhead}>
              Single-use food wrappers, takeaway styrofoam, and soiled nylons cannot be reprocessed.
            </Text>

            <View style={styles.rejectReasonsCard}>
              <Text style={styles.rejectSectionTitle}>Why it can't be recycled:</Text>
              <Text style={styles.rejectReasonItem}>
                • Mixed plastic-foil layers or expanded polystyrene (takeaway packs) break recycling machines.
              </Text>
              <Text style={styles.rejectReasonItem}>
                • Food oil and grease contaminate clean plastic batches.
              </Text>
            </View>

            <View style={styles.properDisposalCard}>
              <Text style={styles.properDisposalTitle}>What to do with it:</Text>
              <Text style={styles.properDisposalText}>
                Put it in your general household waste bin for AEPB collection. Keep it separate from your clean PET bottles and cans.
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

        {/* ======================================================= */}
        {/* 4. Scan result · Not collected yet                      */}
        {/* ======================================================= */}
        {resultMode === 'not_collected_yet' && (
          <View>
            <View style={styles.notCollectedIconWrap}>
              <Clock size={38} color="#2563EB" />
            </View>

            <View style={styles.bluePillSelf}>
              <Text style={styles.bluePillText}>Not collected in Kubwa yet</Text>
            </View>

            <Text style={styles.rejectTitle}>Recyclable, but no buyer near you yet</Text>
            <Text style={styles.rejectSubhead}>
              Carton juice packs (Tetra Pak) and glass jars can be recycled, but no verified recycler in Kubwa is buying them this week.
            </Text>

            <View style={styles.rejectReasonsCard}>
              <Text style={styles.rejectSectionTitle}>What recyclers in Kubwa buy right now:</Text>
              <Text style={styles.rejectReasonItem}>• Clear PET drink bottles (₦100–150/kg)</Text>
              <Text style={styles.rejectReasonItem}>• Hard HDPE containers & jerrycans (₦110–140/kg)</Text>
              <Text style={styles.rejectReasonItem}>• Aluminium drink cans (₦180–250/kg)</Text>
              <Text style={styles.rejectReasonItem}>• Clean brown cardboard boxes (₦50–80/kg)</Text>
            </View>

            {/* Notify Me Card */}
            <View style={styles.notifyCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifyCardTitle}>Want to know when a buyer starts?</Text>
                <Text style={styles.notifyCardSub}>
                  We'll send you one notification when a recycler in Kubwa starts collecting this item.
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.notifyToggleBtn, notifySubscribed && styles.notifyToggleBtnDone]}
                onPress={() => setNotifySubscribed(!notifySubscribed)}
                activeOpacity={0.8}
              >
                {notifySubscribed ? (
                  <>
                    <Check size={14} color="#15803D" strokeWidth={2.8} />
                    <Text style={styles.notifyToggleTextDone}>Saved</Text>
                  </>
                ) : (
                  <>
                    <Bell size={14} color="#0F1E12" />
                    <Text style={styles.notifyToggleText}>Notify me</Text>
                  </>
                )}
              </TouchableOpacity>
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
    backgroundColor: '#EFF6FF',
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
    paddingVertical: 8,
  },
  demoScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 6,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E3A8A',
    marginRight: 4,
  },
  demoPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    fontSize: 12,
    fontWeight: '600',
    color: '#2D6A2E',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
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
  },
  weightBadge: {
    backgroundColor: '#EAF5EA',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  weightBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  valuationFormula: {
    fontSize: 13,
    color: '#64748B',
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
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 10,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
    paddingVertical: 10,
    marginBottom: 12,
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
    gap: 10,
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
  },
  primaryCtaBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Not Sure / Not Recyclable / Not Collected Yet Shared Styles */
  notSureIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  notCollectedIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  rejectIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  amberPillSelf: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  amberPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  redPillSelf: {
    alignSelf: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  redPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  bluePillSelf: {
    alignSelf: 'center',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  bluePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  rejectTitle: {
    fontSize: 22,
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
    marginBottom: 20,
  },
  quickPickSection: {
    marginBottom: 16,
    gap: 10,
  },
  quickPickLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  quickPickCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  quickPickTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 2,
  },
  quickPickSub: {
    fontSize: 12,
    color: '#64748B',
  },
  tipBoxAmber: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  tipBoxAmberText: {
    fontSize: 12.5,
    color: '#92400E',
    lineHeight: 18,
    flex: 1,
  },
  rejectReasonsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  rejectSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 10,
  },
  rejectReasonItem: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
    marginBottom: 8,
  },
  properDisposalCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 24,
  },
  properDisposalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 6,
  },
  properDisposalText: {
    fontSize: 13,
    color: '#B45309',
    lineHeight: 19,
  },
  notifyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 24,
  },
  notifyCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E3A8A',
    marginBottom: 4,
  },
  notifyCardSub: {
    fontSize: 12,
    color: '#1E40AF',
    lineHeight: 17,
  },
  notifyToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  notifyToggleBtnDone: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  notifyToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F1E12',
  },
  notifyToggleTextDone: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
});
