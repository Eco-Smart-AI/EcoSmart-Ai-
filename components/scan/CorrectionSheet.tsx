import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { X, Check, Package, Sparkles } from 'lucide-react-native';

export interface WasteCategory {
  id: string;
  name: string;
  sub: string;
  unitPrice: number;
}

const CATEGORIES: WasteCategory[] = [
  { id: 'pet', name: 'Clear PET Plastic bottles', sub: 'Water, soda, drink bottles', unitPrice: 120 },
  { id: 'hdpe', name: 'Hard, heavy plastic (HDPE)', sub: 'Detergent, shampoo, gallon jugs', unitPrice: 100 },
  { id: 'cans', name: 'Aluminum Cans', sub: 'Soda cans, energy drinks', unitPrice: 350 },
  { id: 'carton', name: 'Cardboard & Paper', sub: 'Packaging cartons, brown boxes', unitPrice: 80 },
  { id: 'glass', name: 'Glass Bottles & Jars', sub: 'Beverage bottles, condiment jars', unitPrice: 40 },
  { id: 'metals', name: 'Scrap Metal & Iron', sub: 'Tins, metal fixtures, scrap parts', unitPrice: 200 },
];

interface Props {
  visible: boolean;
  currentCategory: string;
  currentWeight: number;
  onClose: () => void;
  onApply: (selectedCat: WasteCategory, weight: number) => void;
}

export const CorrectionSheet: React.FC<Props> = ({
  visible,
  currentCategory,
  currentWeight,
  onClose,
  onApply,
}) => {
  const [selectedId, setSelectedId] = useState<string>(currentCategory || 'pet');
  const [weight, setWeight] = useState<number>(currentWeight || 3.2);

  const handleApply = () => {
    const found = CATEGORIES.find((c) => c.id === selectedId) || CATEGORIES[0];
    onApply(found, weight);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.scrim} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <View>
              <Text style={styles.title}>Not right? Change it</Text>
              <Text style={styles.subtitle}>Choose the correct material and estimated weight</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
            {/* Weight Stepper */}
            <View style={styles.weightSection}>
              <Text style={styles.sectionLabel}>Estimated Weight</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setWeight((w) => Math.max(0.5, parseFloat((w - 0.5).toFixed(1))))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>−</Text>
                </TouchableOpacity>

                <View style={styles.stepperValueBox}>
                  <Text style={styles.stepperValueText}>{weight} kg</Text>
                  <Text style={styles.stepperSubtext}>
                    ~{Math.round(weight * 22)} standard bottles
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.stepperBtn}
                  onPress={() => setWeight((w) => parseFloat((w + 0.5).toFixed(1)))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.stepperBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Material Categories */}
            <Text style={[styles.sectionLabel, { marginTop: 16 }]}>Material Type</Text>
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
            <Text style={styles.applyBtnText}>Update item</Text>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    maxHeight: '85%',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1E12',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
  },
  contentScroll: {
    maxHeight: 380,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  weightSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 4,
  },
  stepperBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0F1E12',
    lineHeight: 28,
  },
  stepperValueBox: {
    alignItems: 'center',
    minWidth: 100,
  },
  stepperValueText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F1E12',
  },
  stepperSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  catList: {
    gap: 8,
    marginBottom: 14,
  },
  catCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  catCardSelected: {
    borderColor: '#2D6A2E',
    backgroundColor: '#F0FDF4',
  },
  catLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
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
    color: '#0F1E12',
  },
  catNameSelected: {
    color: '#2D6A2E',
  },
  catSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  catRate: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  applyBtn: {
    backgroundColor: '#2D6A2E',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    shadowColor: '#2D6A2E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
