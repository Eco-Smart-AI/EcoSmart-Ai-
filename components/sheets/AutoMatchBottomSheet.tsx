import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Sparkles, MapPin, Package, X, Check, Clock } from 'lucide-react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { day: string; timeSlot: string }) => void;
  weightKg?: number;
  itemType?: string;
  address?: string;
}

export const AutoMatchBottomSheet: React.FC<Props> = ({
  visible,
  onClose,
  onSubmit,
  weightKg = 3,
  itemType = 'PET bottles',
  address = '12 Byazhin Road, Kubwa',
}) => {
  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow'>('today');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onSubmit({ day: selectedDay, timeSlot: selectedTimeSlot });
      onClose();
    }, 1200);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.scrim} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          {/* Header Drag Handle */}
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <View style={styles.iconWithTitle}>
              <View style={styles.sparkleIconBox}>
                <Sparkles size={18} color="#15803D" />
              </View>
              <Text style={styles.sheetTitle}>Let EcoSmart match me</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sheetDesc}>
            We send your request to nearby recyclers who pick up about {weightKg} kg. The first one to accept takes it.
          </Text>

          {/* Details Pill Box */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Package size={16} color="#2D6A2E" />
              <Text style={styles.summaryTextBold}>
                {itemType} · ~{weightKg} kg
              </Text>
              <Text style={styles.summaryTag}>From your scan</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <MapPin size={16} color="#64748B" />
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryTextBold}>Home · {address}</Text>
                <Text style={styles.summarySub}>
                  Landmark: opposite the pharmacy, blue gate
                </Text>
              </View>
            </View>
          </View>

          {/* When can they come? */}
          <Text style={styles.sectionLabel}>When can they come?</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[
                styles.optionBtn,
                selectedDay === 'today' && styles.optionBtnActive,
              ]}
              onPress={() => setSelectedDay('today')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionBtnText,
                  selectedDay === 'today' && styles.optionBtnTextActive,
                ]}
              >
                Today
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionBtn,
                selectedDay === 'tomorrow' && styles.optionBtnActive,
              ]}
              onPress={() => setSelectedDay('tomorrow')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.optionBtnText,
                  selectedDay === 'tomorrow' && styles.optionBtnTextActive,
                ]}
              >
                Tomorrow
              </Text>
            </TouchableOpacity>
          </View>

          {/* What time? */}
          <Text style={styles.sectionLabel}>What time?</Text>
          <View style={styles.optionsRow}>
            {(['morning', 'afternoon', 'evening'] as const).map((slot) => {
              const label =
                slot === 'morning'
                  ? 'Morning (8am-12pm)'
                  : slot === 'afternoon'
                  ? 'Afternoon (12-4pm)'
                  : 'Evening (4-6pm)';
              const isSelected = selectedTimeSlot === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[
                    styles.slotBtn,
                    isSelected && styles.slotBtnActive,
                  ]}
                  onPress={() => setSelectedTimeSlot(slot)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.slotBtnText,
                      isSelected && styles.slotBtnTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.footnoteRow}>
            <Clock size={13} color="#64748B" />
            <Text style={styles.footnoteText}>
              Pickup only. We'll notify you who accepts, their rate and when they're coming.
            </Text>
          </View>

          {/* Send Match Request Button */}
          <TouchableOpacity
            style={[styles.actionBtn, submitted && styles.actionBtnSuccess]}
            onPress={handleSubmit}
            disabled={submitted}
            activeOpacity={0.85}
          >
            {submitted ? (
              <View style={styles.btnRow}>
                <Check size={18} color="#FFFFFF" strokeWidth={3} />
                <Text style={styles.actionBtnText}>Broadcast sent to 4 recyclers!</Text>
              </View>
            ) : (
              <Text style={styles.actionBtnText}>Send match request</Text>
            )}
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    maxHeight: '90%',
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
    alignItems: 'center',
    marginBottom: 8,
  },
  iconWithTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sparkleIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EAF5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1E12',
  },
  closeBtn: {
    padding: 6,
  },
  sheetDesc: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  summaryTextBold: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
  },
  summaryTag: {
    fontSize: 11,
    color: '#2D6A2E',
    backgroundColor: '#EAF5EA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 'auto',
  },
  summarySub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  optionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  optionBtnActive: {
    borderColor: '#0F1E12',
    backgroundColor: '#0F1E12',
  },
  optionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  optionBtnTextActive: {
    color: '#FFFFFF',
  },
  slotBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  slotBtnActive: {
    borderColor: '#0F1E12',
    backgroundColor: '#0F1E12',
  },
  slotBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  slotBtnTextActive: {
    color: '#FFFFFF',
  },
  footnoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 18,
  },
  footnoteText: {
    fontSize: 11.5,
    color: '#64748B',
    flex: 1,
    lineHeight: 15,
  },
  actionBtn: {
    backgroundColor: '#0F1E12',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnSuccess: {
    backgroundColor: '#15803D',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  btnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
