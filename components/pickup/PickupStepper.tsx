import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check } from 'lucide-react-native';

export type PickupStage = 'accepted' | 'on_the_way' | 'arrived' | 'agreed' | 'paid';

interface Props {
  currentStage: PickupStage;
}

const STAGES: { key: PickupStage; label: string }[] = [
  { key: 'accepted', label: 'Accepted' },
  { key: 'on_the_way', label: 'On the way' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'agreed', label: 'Agreed' },
  { key: 'paid', label: 'Paid' },
];

export const PickupStepper: React.FC<Props> = ({ currentStage }) => {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage);

  return (
    <View style={styles.container}>
      <View style={styles.stepperRow}>
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentIndex;
          const isActive = index === currentIndex;

          return (
            <React.Fragment key={stage.key}>
              {/* Step indicator circle / pill */}
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

              {/* Connector line between steps */}
              {index < STAGES.length - 1 && (
                <View
                  style={[
                    styles.line,
                    index < currentIndex && styles.lineCompleted,
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
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    gap: 4,
    minWidth: 46,
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  circleActive: {
    backgroundColor: '#2D6A2E',
    borderColor: '#2D6A2E',
  },
  circleCompleted: {
    backgroundColor: '#15803D',
    borderColor: '#15803D',
  },
  circleNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  circleNumberActive: {
    color: '#FFFFFF',
  },
  stageLabel: {
    fontSize: 9.5,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
  },
  stageLabelActive: {
    color: '#0F1E12',
    fontWeight: '800',
  },
  stageLabelCompleted: {
    color: '#15803D',
    fontWeight: '700',
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginTop: -14,
    marginHorizontal: 2,
  },
  lineCompleted: {
    backgroundColor: '#15803D',
  },
});
