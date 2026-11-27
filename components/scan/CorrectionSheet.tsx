import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
} from 'react-native';
import { X, Sparkles, Tag } from 'lucide-react-native';
import {
  NIGERIAN_WASTE_HEURISTICS,
  submitCustomNigerianLabel,
} from '../../services/wasteAiService';

export interface WasteCategory {
  id: string;
  name: string;
  sub: string;
  unitPrice: number;
  unitsPer1Kg: number;
  unitPlural: string;
}

const CATEGORIES: WasteCategory[] = [
  {
    id: 'pet',
    name: 'Clear PET Plastic bottles',
    sub: '50 bottles ≈ 1 kg · Eva, Coke, Pepsi, Bigi bottles',
    unitPrice: 120,
    unitsPer1Kg: 50,
    unitPlural: 'bottles',
  },
  {
    id: 'hdpe',
    name: 'Hard, heavy plastic (HDPE)',
    sub: '17 containers ≈ 1 kg · Hypo, detergent, gallon jugs',
    unitPrice: 105,
    unitsPer1Kg: 17,
    unitPlural: 'containers',
  },
  {
    id: 'cans',
    name: 'Aluminium Cans',
    sub: '67 cans ≈ 1 kg · Maltina, Amstel, soda cans (Gongon)',
    unitPrice: 600,
    unitsPer1Kg: 67,
    unitPlural: 'cans',
  },
  {
    id: 'carton',
    name: 'Cardboard & Paper',
    sub: '8 cartons ≈ 1 kg · Indomie cartons, brown boxes',
    unitPrice: 60,
    unitsPer1Kg: 8,
    unitPlural: 'cartons',
  },
  {
    id: 'sachet',
    name: 'Pure Water Sachets / Nylon (LDPE)',
    sub: '333 sachets ≈ 1 kg · Pure water leather, sachet bags',
    unitPrice: 50,
    unitsPer1Kg: 333,
    unitPlural: 'sachets',
  },
  {
    id: 'glass',
    name: 'Glass Bottles & Jars',
    sub: '4 bottles ≈ 1 kg · Beverage bottles, jars',
    unitPrice: 30,
    unitsPer1Kg: 4,
    unitPlural: 'glass bottles',
  },
];

const POPULAR_NIGERIAN_NAMES = [
  { label: 'Pure water nylon', bucket: 'sachet' },
  { label: 'Eva rubber', bucket: 'pet' },
  { label: 'La Casera bottle', bucket: 'pet' },
  { label: 'Hypo gallon', bucket: 'hdpe' },
  { label: 'Maltina pan / Gongon', bucket: 'cans' },
  { label: 'Indomie carton', bucket: 'carton' },
];

interface Props {
  visible: boolean;
  currentCategory: string;
  currentWeight: number;
  currentCustomName?: string;
  onClose: () => void;
  onApply: (
    selectedCat: WasteCategory,
    weight: number,
    customNigerianName?: string,
    itemCount?: number
  ) => void;
}

export const CorrectionSheet: React.FC<Props> = ({
  visible,
  currentCategory,
  currentWeight,
  currentCustomName = '',
  onClose,
  onApply,
}) => {
  const [selectedId, setSelectedId] = useState<string>(currentCategory || 'pet');
  const [weight, setWeight] = useState<number>(currentWeight || 3.2);
  const [customName, setCustomName] = useState<string>(currentCustomName);

  const activeCat = CATEGORIES.find((c) => c.id === selectedId) || CATEGORIES[0];
  const heuristic = NIGERIAN_WASTE_HEURISTICS[selectedId] || NIGERIAN_WASTE_HEURISTICS.pet;
  const approxItems = Math.max(1, Math.round(weight / heuristic.unitWeightKg));

  const handleApply = () => {
    if (customName.trim()) {
      submitCustomNigerianLabel({
        customName: customName.trim(),
        bucketId: activeCat.id,
        itemCount: approxItems,
      });
    }
    onApply(activeCat, weight, customName.trim() || undefined, approxItems);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Not right? Teach EcoSmart AI</Text>
              <Text style={styles.subtitle}>
                Add the local Nigerian name or adjust the bottle count & material
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            {/* NEW: Custom Nigerian Name Active-Learning Box */}
            <View style={styles.customNameBox}>
              <View style={styles.customNameHeader}>
                <Sparkles size={15} color="#2D6A2E" />
                <Text style={styles.customNameTitle}>
                  Custom Nigerian Name (helps AI learn local terms)
                </Text>
              </View>
              <TextInput
                style={styles.customNameInput}
                placeholder="e.g. Pure water nylon, Eva rubber, Maltina pan, Gongon..."
                placeholderTextColor="#94A3B8"
                value={customName}
                onChangeText={setCustomName}
              />
              <View style={styles.chipsWrap}>
                {POPULAR_NIGERIAN_NAMES.map((chip) => (
                  <TouchableOpacity
                    key={chip.label}
                    style={[
                      styles.nameChip,
                      customName === chip.label && styles.nameChipActive,
                    ]}
                    onPress={() => {
                      setCustomName(chip.label);
                      setSelectedId(chip.bucket);
                    }}
                  >
                    <Tag size={11} color={customName === chip.label ? '#166534' : '#475569'} />
                    <Text
                      style={[
                        styles.nameChipText,
                        customName === chip.label && styles.nameChipTextActive,
                      ]}
                    >
                      {chip.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Weight & Bottle Count Stepper */}
            <View style={styles.weightSection}>
              <Text style={styles.sectionLabel}>
                Estimated Weight & Unit Count ({activeCat.unitsPer1Kg} {activeCat.unitPlural} = 1 kg)
              </Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() =>
                    setWeight((w) => Math.max(0.04, parseFloat((w - 0.5).toFixed(2))))
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>−</Text>
                </TouchableOpacity>

                <View style={styles.stepperValueBox}>
                  <Text style={styles.stepperValueText}>{weight} kg</Text>
                  <Text style={styles.stepperSubtext}>
                    ≈ {approxItems} {activeCat.unitPlural} (₦{Math.round(weight * activeCat.unitPrice)})
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setWeight((w) => parseFloat((w + 0.5).toFixed(2)))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Quick Bottle Count Presets */}
              <View style={styles.presetRow}>
                {[
                  { label: `2 ${activeCat.unitPlural}`, kg: parseFloat((2 * heuristic.unitWeightKg).toFixed(2)) },
                  { label: `1 kg (${activeCat.unitsPer1Kg})`, kg: 1.0 },
                  { label: `3 kg (${activeCat.unitsPer1Kg * 3})`, kg: 3.0 },
                ].map((p) => (
                  <TouchableOpacity
                    key={p.label}
                    style={[styles.presetBtn, weight === p.kg && styles.presetBtnActive]}
                    onPress={() => setWeight(p.kg)}
                  >
                    <Text
                      style={[
                        styles.presetBtnText,
                        weight === p.kg && styles.presetBtnTextActive,
                      ]}
                    >
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Material Categories */}
            <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Base Material Category</Text>
            <View style={styles.catList}>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedId === cat.id;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.catCard, isSelected && styles.catCardSelected]}
                    onPress={() => setSelectedId(cat.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.catLeft}>
                      <View style={[styles.radioCircle, isSelected && styles.radioCircleSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.catName, isSelected && styles.catNameSelected]}>
                          {cat.name}
                        </Text>
                        <Text style={styles.catSub}>{cat.sub}</Text>
                      </View>
                    </View>
                    <Text style={styles.catRate}>₦{cat.unitPrice}/kg</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.applyBtn}
            onPress={handleApply}
            activeOpacity={0.8}
          >
            <Text style={styles.applyBtnText}>
              {customName.trim() ? `Save "${customName.trim()}" & update` : 'Update item'}
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    maxHeight: '88%',
  },
  handle: {
    width: 44,
    height: 5,
    backgroundColor: '#CBD5E1',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F1E12',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentScroll: {
    marginBottom: 14,
  },
  customNameBox: {
    backgroundColor: '#F4FBF0',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#C8E6C9',
    padding: 12,
    marginBottom: 14,
  },
  customNameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  customNameTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1B431C',
  },
  customNameInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  nameChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 14,
  },
  nameChipActive: {
    backgroundColor: '#E6F4D7',
    borderColor: '#2E7D32',
  },
  nameChipText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  nameChipTextActive: {
    color: '#166534',
    fontWeight: '700',
  },
  weightSection: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F1E12',
  },
  stepperValueBox: {
    alignItems: 'center',
  },
  stepperValueText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F1E12',
  },
  stepperSubtext: {
    fontSize: 12,
    color: '#2D6A2E',
    fontWeight: '700',
    marginTop: 2,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  presetBtn: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
  },
  presetBtnActive: {
    backgroundColor: '#E6F4D7',
    borderColor: '#2E7D32',
  },
  presetBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  presetBtnTextActive: {
    color: '#166534',
    fontWeight: '800',
  },
  catList: {
    gap: 8,
  },
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  catCardSelected: {
    borderColor: '#2D6A2E',
    backgroundColor: '#F4FBF0',
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#2D6A2E',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2D6A2E',
  },
  catName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  catNameSelected: {
    color: '#1B431C',
  },
  catSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  catRate: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2D6A2E',
    marginLeft: 8,
  },
  applyBtn: {
    backgroundColor: '#2D6A2E',
    paddingVertical: 15,
    borderRadius: 999,
    alignItems: 'center',
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
