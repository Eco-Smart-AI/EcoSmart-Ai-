import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
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
} from 'lucide-react-native';

export default function CallScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const recyclerName = 'Kubwa Green Hub';

  // Demo call state: 'G-K01' (Calling), 'G-K02' (Connected), 'G-K03' (Incoming)
  const [callState, setCallState] = useState<'G-K01' | 'G-K02' | 'G-K03'>('G-K01');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [seconds, setSeconds] = useState(42);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (callState === 'G-K02') {
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
        <Text style={styles.demoTitle}>Call State:</Text>
        <TouchableOpacity
          style={[styles.demoPill, callState === 'G-K01' && styles.demoPillActive]}
          onPress={() => setCallState('G-K01')}
        >
          <Text style={[styles.demoPillText, callState === 'G-K01' && styles.demoPillTextActive]}>
            G-K01 (Calling)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoPill, callState === 'G-K02' && styles.demoPillActive]}
          onPress={() => setCallState('G-K02')}
        >
          <Text style={[styles.demoPillText, callState === 'G-K02' && styles.demoPillTextActive]}>
            G-K02 (Connected)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoPill, callState === 'G-K03' && styles.demoPillActive]}
          onPress={() => setCallState('G-K03')}
        >
          <Text style={[styles.demoPillText, callState === 'G-K03' && styles.demoPillTextActive]}>
            G-K03 (Incoming)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Call View */}
      <View style={styles.container}>
        {/* Numbers Hidden / Privacy Header */}
        <View style={styles.privacyHeader}>
          <Lock size={14} color="#64748B" />
          <Text style={styles.privacyHeaderText}>EcoSmart call · numbers hidden</Text>
        </View>

        {/* Center Recycler Information */}
        <View style={styles.centerInfo}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatarInner}>
              <Text style={styles.avatarText}>KG</Text>
            </View>
          </View>

          <Text style={styles.callerName}>{recyclerName}</Text>

          {callState === 'G-K01' && (
            <Text style={styles.callStatusText}>Calling…</Text>
          )}

          {callState === 'G-K02' && (
            <Text style={styles.callTimerText}>{formatTimer(seconds)}</Text>
          )}

          {callState === 'G-K03' && (
            <Text style={styles.callStatusText}>Incoming call · Pickup REQ-001</Text>
          )}

          <View style={styles.shieldPill}>
            <ShieldCheck size={14} color="#2D6A2E" />
            <Text style={styles.shieldPillText}>End-to-end masked call</Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E2E8F0',
    gap: 6,
    zIndex: 10,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  demoPill: {
    paddingHorizontal: 8,
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
    paddingVertical: 32,
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
  centerInfo: {
    alignItems: 'center',
    marginTop: 20,
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
  controlsArea: {
    width: '100%',
    paddingBottom: 24,
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
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  activeToggleBtn: {
    backgroundColor: '#334155',
  },
  endCallBtn: {
    backgroundColor: '#DC2626',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  declineBtn: {
    backgroundColor: '#DC2626',
  },
  messageBtn: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  acceptBtn: {
    backgroundColor: '#2D6A2E',
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
});
