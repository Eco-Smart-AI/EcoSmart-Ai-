import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  MessageSquare,
  ShieldCheck,
  Lock,
  WifiOff,
  PhoneMissed,
  RotateCcw,
} from 'lucide-react-native';

type CallDemoState = 'G-K01' | 'G-K02' | 'G-K03' | 'G-K04' | 'G-K05';

export default function CallScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const recyclerName = 'Kubwa Green Hub';

  // Demo call states:
  // G-K01 (Calling), G-K02 (Connected), G-K03 (Incoming), G-K04 (No answer), G-K05 (Poor connection)
  const [callState, setCallState] = useState<CallDemoState>('G-K01');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [seconds, setSeconds] = useState(42);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (callState === 'G-K02' || callState === 'G-K05') {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    router.back();
  };

  const handleAcceptIncoming = () => {
    setCallState('G-K02');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Demo State Switcher */}
      <View style={styles.demoBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoScroll}
        >
          <Text style={styles.demoTitle}>Call State:</Text>
          {(
            [
              { key: 'G-K01', label: 'G-K01 Calling' },
              { key: 'G-K02', label: 'G-K02 Connected' },
              { key: 'G-K03', label: 'G-K03 Incoming' },
              { key: 'G-K04', label: 'No answer' },
              { key: 'G-K05', label: 'Poor signal' },
            ] as const
          ).map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.demoPill, callState === item.key && styles.demoPillActive]}
              onPress={() => setCallState(item.key)}
            >
              <Text
                style={[
                  styles.demoPillText,
                  callState === item.key && styles.demoPillTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Call View */}
      <View style={styles.container}>
        {/* Numbers Hidden / Privacy Header */}
        <View style={styles.privacyHeader}>
          <Lock size={14} color="#64748B" />
          <Text style={styles.privacyHeaderText}>EcoSmart call · numbers hidden</Text>
        </View>

        {/* Poor connection banner (G-K05) */}
        {callState === 'G-K05' && (
          <View style={styles.poorSignalBanner}>
            <WifiOff size={15} color="#B45309" />
            <Text style={styles.poorSignalText}>
              Weak connection · Trying to keep your call clear...
            </Text>
          </View>
        )}

        {/* Center Recycler Information */}
        <View style={styles.centerInfo}>
          <View
            style={[
              styles.avatarWrap,
              callState === 'G-K04' && { borderColor: '#FECACA', backgroundColor: '#FEF2F2' },
            ]}
          >
            <View
              style={[
                styles.avatarInner,
                callState === 'G-K04' && { backgroundColor: '#DC2626' },
              ]}
            >
              {callState === 'G-K04' ? (
                <PhoneMissed size={36} color="#FFFFFF" />
              ) : (
                <Text style={styles.avatarText}>KG</Text>
              )}
            </View>
          </View>

          <Text style={styles.callerName}>{recyclerName}</Text>

          {callState === 'G-K01' && <Text style={styles.callStatusText}>Calling…</Text>}

          {(callState === 'G-K02' || callState === 'G-K05') && (
            <Text style={styles.callTimerText}>{formatTimer(seconds)}</Text>
          )}

          {callState === 'G-K03' && (
            <Text style={styles.callStatusText}>Incoming call · Pickup REQ-001</Text>
          )}

          {callState === 'G-K04' && (
            <View style={styles.noAnswerBox}>
              <Text style={styles.noAnswerTitle}>No answer</Text>
              <Text style={styles.noAnswerSub}>
                They might be driving or weighing waste. Send a message so they see it straight away.
              </Text>
            </View>
          )}

          <View style={styles.shieldPill}>
            <ShieldCheck size={14} color="#2D6A2E" />
            <Text style={styles.shieldPillText}>End-to-end masked call</Text>
          </View>

          {callState === 'G-K05' && (
            <TouchableOpacity
              style={styles.switchToChatPill}
              onPress={() => router.replace(`/chat/${id || 'kubwa-green-hub'}`)}
              activeOpacity={0.8}
            >
              <MessageSquare size={14} color="#2D6A2E" />
              <Text style={styles.switchToChatText}>Switch to chat instead</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom Controls */}
        <View style={styles.controlsArea}>
          {callState === 'G-K03' ? (
            /* Incoming Call Controls: Decline, Message, Accept */
            <View style={styles.incomingControlsRow}>
              <View style={styles.controlBtnWrapper}>
                <TouchableOpacity
                  style={[styles.roundActionBtn, styles.declineBtn]}
                  onPress={handleEndCall}
                  activeOpacity={0.8}
                >
                  <PhoneOff size={26} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.controlLabel}>Decline</Text>
              </View>

              <View style={styles.controlBtnWrapper}>
                <TouchableOpacity
                  style={[styles.roundActionBtn, styles.messageBtn]}
                  onPress={() => router.replace(`/chat/${id || 'kubwa-green-hub'}`)}
                  activeOpacity={0.8}
                >
                  <MessageSquare size={24} color="#0F1E12" />
                </TouchableOpacity>
                <Text style={styles.controlLabel}>Message</Text>
              </View>

              <View style={styles.controlBtnWrapper}>
                <TouchableOpacity
                  style={[styles.roundActionBtn, styles.acceptBtn]}
                  onPress={handleAcceptIncoming}
                  activeOpacity={0.8}
                >
                  <Phone size={26} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.controlLabel}>Accept</Text>
              </View>
            </View>
          ) : callState === 'G-K04' ? (
            /* No Answer Controls: Call Again, Send Message, Close */
            <View style={styles.noAnswerActionsCol}>
              <TouchableOpacity
                style={styles.sendMessagePrimaryBtn}
                onPress={() => router.replace(`/chat/${id || 'kubwa-green-hub'}`)}
                activeOpacity={0.85}
              >
                <MessageSquare size={18} color="#FFFFFF" />
                <Text style={styles.sendMessagePrimaryText}>Send a message</Text>
              </TouchableOpacity>

              <View style={styles.noAnswerBottomRow}>
                <TouchableOpacity
                  style={styles.callAgainOutlineBtn}
                  onPress={() => setCallState('G-K01')}
                  activeOpacity={0.75}
                >
                  <RotateCcw size={16} color="#0F1E12" />
                  <Text style={styles.callAgainOutlineText}>Call again</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeTextBtn}
                  onPress={handleEndCall}
                  activeOpacity={0.75}
                >
                  <Text style={styles.closeTextBtnLabel}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* Active Call Controls: Mute, End, Speaker */
            <View style={styles.activeControlsRow}>
              <View style={styles.controlBtnWrapper}>
                <TouchableOpacity
                  style={[styles.roundActionBtn, isMuted && styles.activeToggleBtn]}
                  onPress={() => setIsMuted(!isMuted)}
                  activeOpacity={0.8}
                >
                  {isMuted ? (
                    <MicOff size={24} color="#FFFFFF" />
                  ) : (
                    <Mic size={24} color="#0F1E12" />
                  )}
                </TouchableOpacity>
                <Text style={styles.controlLabel}>{isMuted ? 'Muted' : 'Mute'}</Text>
              </View>

              <View style={styles.controlBtnWrapper}>
                <TouchableOpacity
                  style={[styles.roundActionBtn, styles.endCallBtn]}
                  onPress={handleEndCall}
                  activeOpacity={0.8}
                >
                  <PhoneOff size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.controlLabel}>End</Text>
              </View>

              <View style={styles.controlBtnWrapper}>
                <TouchableOpacity
                  style={[styles.roundActionBtn, isSpeaker && styles.activeToggleBtn]}
                  onPress={() => setIsSpeaker(!isSpeaker)}
                  activeOpacity={0.8}
                >
                  {isSpeaker ? (
                    <Volume2 size={24} color="#FFFFFF" />
                  ) : (
                    <VolumeX size={24} color="#0F1E12" />
                  )}
                </TouchableOpacity>
                <Text style={styles.controlLabel}>{isSpeaker ? 'Speaker On' : 'Speaker'}</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  demoBar: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 8,
    zIndex: 10,
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
    color: '#334155',
    marginRight: 4,
  },
  demoPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  demoPillActive: {
    backgroundColor: '#2D6A2E',
    borderColor: '#2D6A2E',
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  demoPillTextActive: {
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EDF2F7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  privacyHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  poorSignalBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginTop: 8,
  },
  poorSignalText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  centerInfo: {
    alignItems: 'center',
    marginTop: 12,
  },
  avatarWrap: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EAF5EA',
    borderWidth: 4,
    borderColor: '#C7E4B2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#2D6A2E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 4,
  },
  avatarInner: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2D6A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  callerName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 6,
  },
  callStatusText: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 14,
  },
  callTimerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2D6A2E',
    marginBottom: 14,
    fontVariant: ['tabular-nums'],
  },
  noAnswerBox: {
    alignItems: 'center',
    maxWidth: 280,
    marginBottom: 16,
  },
  noAnswerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#DC2626',
    marginBottom: 4,
  },
  noAnswerSub: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
  },
  shieldPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EAF5EA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  shieldPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2D6A2E',
  },
  switchToChatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7E4B2',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  switchToChatText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  controlsArea: {
    width: '100%',
    paddingBottom: 20,
  },
  incomingControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  activeControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  controlBtnWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  roundActionBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  activeToggleBtn: {
    backgroundColor: '#0F1E12',
    borderColor: '#0F1E12',
  },
  endCallBtn: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  declineBtn: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  messageBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
  },
  acceptBtn: {
    backgroundColor: '#2D6A2E',
    borderColor: '#2D6A2E',
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  noAnswerActionsCol: {
    width: '100%',
    gap: 12,
  },
  sendMessagePrimaryBtn: {
    backgroundColor: '#2D6A2E',
    paddingVertical: 15,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  sendMessagePrimaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  noAnswerBottomRow: {
    flexDirection: 'row',
    gap: 10,
  },
  callAgainOutlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingVertical: 13,
    borderRadius: 24,
  },
  callAgainOutlineText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
  closeTextBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2E8F0',
    paddingVertical: 13,
    borderRadius: 24,
  },
  closeTextBtnLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
});
