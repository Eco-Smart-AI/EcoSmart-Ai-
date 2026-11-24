import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { AlertTriangle, X, Check, MessageSquare, PhoneCall, Scale } from 'lucide-react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubmitIssue: (issue: string) => void;
}

export const DisputeSheet: React.FC<Props> = ({
  visible,
  onClose,
  onSubmitIssue,
}) => {
  const [selectedIssue, setSelectedIssue] = useState<string>('');

  const ISSUES = [
    'The scale reading does not match my bottles',
    'Driver offered a lower rate than agreed',
    'Driver did not bring an electronic scale',
    'Driver requested cash payment outside EcoSmart',
    'Other issue',
  ];

  const handleSend = () => {
    if (!selectedIssue) return;
    onSubmitIssue(selectedIssue);
    onClose();
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
            <View style={styles.iconWithTitle}>
              <View style={styles.iconCircle}>
                <AlertTriangle size={18} color="#B45309" />
              </View>
              <Text style={styles.title}>Something's wrong</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.desc}>
            Tell us what happened. Your money is protected in EcoSmart Escrow until you are satisfied.
          </Text>

          {/* Options */}
          <View style={styles.optionsList}>
            {ISSUES.map((issue) => {
              const isSelected = selectedIssue === issue;
              return (
                <TouchableOpacity
                  key={issue}
                  style={[styles.issueItem, isSelected && styles.issueItemActive]}
                  onPress={() => setSelectedIssue(issue)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleActive,
                    ]}
                  >
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                  <Text
                    style={[
                      styles.issueText,
                      isSelected && styles.issueTextActive,
                    ]}
                  >
                    {issue}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, !selectedIssue && styles.submitBtnDisabled]}
            onPress={handleSend}
            disabled={!selectedIssue}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>Submit report</Text>
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
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1E12',
  },
  closeBtn: {
    padding: 6,
  },
  desc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  optionsList: {
    gap: 10,
    marginBottom: 20,
  },
  issueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  issueItemActive: {
    borderColor: '#2D6A2E',
    backgroundColor: '#F1F8EE',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#2D6A2E',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2D6A2E',
  },
  issueText: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
    fontWeight: '500',
  },
  issueTextActive: {
    color: '#0F1E12',
    fontWeight: '700',
  },
  submitBtn: {
    backgroundColor: '#0F1E12',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
