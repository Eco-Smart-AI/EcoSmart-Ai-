import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { MapPin, Package, X, Check, Clock, Calendar } from 'lucide-react-native';
import { Recycler } from '../../types/recycler';

interface Props {
  visible: boolean;
  recycler: Recycler;
  onClose: () => void;
  onSubmit: (data: { day: string; timeSlot: string }) => void;
  weightKg?: number;
}

export const DropOffBottomSheet: React.FC<Props> = ({
  visible,
  recycler,
  onClose,
  onSubmit,
  weightKg = 3,
}) => {
  const [selectedDay, setSelectedDay] = useState<'today' | 'tomorrow' | 'pick_day'>('today');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [submitted, setSubmitted] = useState(false);

  const estimatedPay = Math.round(recycler.rates.pet * weightKg);

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
          <View style={styles.handle} />

          <View style={styles.headerRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sheetTitle}>Drop off at {recycler.name}</Text>
              <Text style={styles.sheetSub}>
                Tell them when you're coming. They accept, then you take your bottles to the yard.
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Recycler summary box */}
          <View style={styles.yardInfoCard}>
            <View style={styles.yardInfoRow}>
              <Package size={16} color="#2D6A2E" />
              <Text style={styles.itemBold}>PET bottles · ~{weightKg} kg</Text>
              <Text style={styles.itemPayout}>
                ₦{recycler.rates.pet}/kg · about ₦{estimatedPay}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.yardInfoRow}>
              <MapPin size={16} color="#64748B" />
              <View style={{ flex: 1 }}>
                <Text style={styles.yardAddress}>{recycler.address}</Text>
                <Text style={styles.yardHours}>
                  Mon – Sat 6am – 6pm · {recycler.distanceKm} km away
                </Text>
              </View>
            </View>
          </View>

          {/* When will you come? */}
          <Text style={styles.sectionLabel}>When will you come?</Text>
          <View style={styles.optionsRow}>
            {(['today', 'tomorrow', 'pick_day'] as const).map((day) => {
              const label =
                day === 'today'
                  ? 'Today'
                  : day === 'tomorrow'
                  ? 'Tomorrow'
                  : 'Pick a day';
              const isSelected = selectedDay === day;
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayBtn, isSelected && styles.dayBtnActive]}
                  onPress={() => setSelectedDay(day)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dayBtnText,
                      isSelected && styles.dayBtnTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* What time? */}
          <Text style={styles.sectionLabel}>What time?</Text>
          <View style={styles.optionsRow}>
            {(['morning', 'afternoon', 'evening'] as const).map((slot) => {
              const label =
                slot === 'morning'
                  ? 'Morning'
                  : slot === 'afternoon'
                  ? 'Afternoon'
                  : 'Evening';
              const isSelected = selectedTimeSlot === slot;
              return (
                <TouchableOpacity
                  key={slot}
                  style={[styles.slotBtn, isSelected && styles.slotBtnActive]}
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

          {/* Payout guarantee note */}
          <View style={styles.guaranteeBox}>
            <Clock size={13} color="#2D6A2E" />
            <Text style={styles.guaranteeText}>
              When they accept, they set aside about ₦{estimatedPay} for you. You're paid at the yard after they weigh it and you give your code.
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.actionBtn, submitted && styles.actionBtnSuccess]}
            onPress={handleSubmit}
            disabled={submitted}
            activeOpacity={0.85}
          >
            {submitted ? (
              <View style={styles.btnRow}>
                <Check size={18} color="#FFFFFF" strokeWidth={3} />
                <Text style={styles.actionBtnText}>Drop-off request booked!</Text>
              </View>
            ) : (
              <Text style={styles.actionBtnText}>Send drop-off request</Text>
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
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1E12',
  },
  sheetSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
  closeBtn: {
    padding: 4,
  },
  yardInfoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  yardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemBold: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
  },
  itemPayout: {
    fontSize: 12,
    color: '#2D6A2E',
    fontWeight: '700',
    marginLeft: 'auto',
  },
  yardAddress: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  yardHours: {
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
  dayBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  dayBtnActive: {
    borderColor: '#0F1E12',
    backgroundColor: '#0F1E12',
  },
  dayBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  dayBtnTextActive: {
    color: '#FFFFFF',
  },
  slotBtn: {
    flex: 1,
    paddingVertical: 10,
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
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  slotBtnTextActive: {
    color: '#FFFFFF',
  },
  guaranteeBox: {
    backgroundColor: '#F1F8EE',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCF0D5',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 18,
  },
  guaranteeText: {
    fontSize: 11.5,
    color: '#2D6A2E',
    flex: 1,
    lineHeight: 16,
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
