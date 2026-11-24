import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { ShieldCheck, Check, ArrowLeft, AlertCircle } from 'lucide-react-native';

interface Props {
  visible: boolean;
  amount: number;
  weightKg: number;
  itemType: string;
  ratePerKg: number;
  onAccept: () => void;
  onGoBack: () => void;
}

export const AcceptAmountModal: React.FC<Props> = ({
  visible,
  amount,
  weightKg,
  itemType,
  ratePerKg,
  onAccept,
  onGoBack,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onGoBack}
    >
      <Pressable style={styles.scrim} onPress={onGoBack}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          {/* Header Icon */}
          <View style={styles.iconCircle}>
            <ShieldCheck size={28} color="#15803D" />
          </View>

          {/* Modal Title */}
          <Text style={styles.modalTitle}>
            Accept ₦{amount} for {weightKg} kg {itemType}?
          </Text>

          {/* Caution Explainer */}
          <View style={styles.explainerBox}>
            <Text style={styles.explainerText}>
              Next, you'll see your <Text style={{ fontWeight: '800' }}>4-digit code</Text>.
              Only give it when you hand over your bottles.
            </Text>
          </View>

          {/* Amount Breakdown Tile */}
          <View style={styles.amountTile}>
            <Text style={styles.youGetLabel}>You get</Text>
            <Text style={styles.bigAmount}>₦{amount}</Text>
            <Text style={styles.formulaText}>
              {weightKg} kg {itemType} × ₦{ratePerKg}/kg (agreed)
            </Text>
          </View>

          {/* Buttons Row */}
          <View style={styles.buttonsCol}>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={onAccept}
              activeOpacity={0.85}
            >
              <Text style={styles.acceptBtnText}>Yes, accept</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backBtn}
              onPress={onGoBack}
              activeOpacity={0.7}
            >
              <Text style={styles.backBtnText}>Go back</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EAF5EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F1E12',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
  explainerBox: {
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: 16,
    width: '100%',
  },
  explainerText: {
    fontSize: 12.5,
    color: '#92400E',
    textAlign: 'center',
    lineHeight: 18,
  },
  amountTile: {
    width: '100%',
    backgroundColor: '#F1F8EE',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D5E8C8',
    alignItems: 'center',
    marginBottom: 20,
  },
  youGetLabel: {
    fontSize: 12,
    color: '#2D6A2E',
    fontWeight: '600',
  },
  bigAmount: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F1E12',
    marginVertical: 4,
  },
  formulaText: {
    fontSize: 12,
    color: '#64748B',
  },
  buttonsCol: {
    width: '100%',
    gap: 10,
  },
  acceptBtn: {
    width: '100%',
    backgroundColor: '#0F1E12',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  backBtn: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748B',
  },
});
