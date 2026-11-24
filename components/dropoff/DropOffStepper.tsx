import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

export type DropOffStage = 'accepted' | 'on_my_way' | 'at_yard' | 'paid';

interface Props {
  currentStage: DropOffStage;
}

const STAGES: { key: DropOffStage; label: string }[] = [
  { key: 'accepted', label: 'Accepted' },
  { key: 'on_my_way', label: 'On my way' },
  { key: 'at_yard', label: 'At the yard' },
  { key: 'paid', label: 'Paid' },
];

export const DropOffStepper: React.FC<Props> = ({ currentStage }) => {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage);

  return (
    <View style={styles.container}>
      <View style={styles.stepperRow}>
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <React.Fragment key={stage.key}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.circle,
                    isCompleted && styles.circleCompleted,
                    isActive && styles.circleActive,
                  ]}
                >
                  {isCompleted ? (
                    <Check size={12} color="#FFFFFF" strokeWidth={3} />
                  ) : (
                    <Text
                      style={[
                        styles.circleNumber,
                        isActive && styles.circleNumberActive,
                      ]}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>

                <Text
                  style={[
                    styles.stageLabel,
                    isCompleted && styles.stageLabelCompleted,
                    isActive && styles.stageLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {stage.label}
                </Text>
              </View>

              {index < STAGES.length - 1 && (
                <View
                  style={[
                    styles.connectingLine,
                    index < currentIndex && styles.connectingLineCompleted,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    zIndex: 2,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  circleActive: {
    backgroundColor: '#2D6A2E',
    borderWidth: 2,
    borderColor: '#C7E4B2',
  },
  circleCompleted: {
    backgroundColor: '#2D6A2E',
  },
  circleNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  circleNumberActive: {
    color: '#FFFFFF',
  },
  stageLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  stageLabelActive: {
    color: '#2D6A2E',
    fontWeight: '700',
  },
  stageLabelCompleted: {
    color: '#0F1E12',
    fontWeight: '600',
  },
  connectingLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
    marginBottom: 16,
  },
  connectingLineCompleted: {
    backgroundColor: '#2D6A2E',
  },
});
