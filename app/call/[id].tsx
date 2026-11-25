import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
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
  Lock,
  ArrowLeft,
  RotateCcw,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomNavBar } from '../../components/common/BottomNavBar';

type CallDemoState = 'G-K01' | 'G-K02' | 'G-K03' | '2.11_ended' | '2.12_missed';

export default function CallScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const recyclerName = 'Kubwa Green Hub';

  // Matches Screens · 07 · Private in-app calls.png:
  // G-K01 (Call · Calling), G-K02 (Call · Connected), G-K03 (Call · Incoming),
  // 2.11_ended (2.11 Call · Ended), 2.12_missed (2.12 Call · Missed)
  const [callState, setCallState] = useState<CallDemoState>('G-K01');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [seconds, setSeconds] = useState(252); // 04:12

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

  const isGreenFullScreen =
    callState === 'G-K01' || callState === 'G-K02' || callState === 'G-K03';

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isGreenFullScreen ? '#1E6B24' : '#FFFFFF' },
      ]}
    >
      {/* Top Demo State Switcher */}
      <View style={styles.demoBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoScroll}
        >
          <Text style={styles.demoTitle}>Screen 07:</Text>
          {(
            [
              { key: 'G-K01', label: 'Calling' },
              { key: 'G-K02', label: 'Connected' },
              { key: 'G-K03', label: 'Incoming' },
              { key: '2.11_ended', label: '2.11 Call · Ended' },
              { key: '2.12_missed', label: '2.12 Call · Missed' },
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

      {isGreenFullScreen ? (
        /* ============================================================== */
        /* SOLID GREEN IN-APP CALL SCREENS (Calling / Connected / Incoming) */
        /* ============================================================== */
        <View style={styles.greenContainer}>
          <View style={styles.topSection}>
            {/* Translucent Privacy Pill */}
            <View style={styles.greenPrivacyPill}>
              <Lock size={12} color="#E6F4D7" />
              <Text style={styles.greenPrivacyText}>EcoSmart call · numbers hidden</Text>
            </View>

            {/* White Circle KG Avatar */}
            <View style={styles.whiteAvatarCircle}>
              <Text style={styles.whiteAvatarText}>KG</Text>
            </View>

            <Text style={styles.greenCallerName}>{recyclerName}</Text>

            {callState === 'G-K01' && (
              <>
                <Text style={styles.greenStatusText}>Calling...</Text>
                <Text style={styles.greenSubHint}>Free in-app call · uses your data</Text>
              </>
            )}

            {callState === 'G-K02' && (
              <Text style={styles.greenTimerText}>{formatTimer(seconds)}</Text>
            )}

            {callState === 'G-K03' && (
              <>
                <Text style={styles.greenStatusText}>is calling you</Text>
                <Text style={styles.greenSubHint}>About your pickup today</Text>
              </>
            )}
          </View>

          {/* Bottom Call Controls */}
          <View style={styles.controlsArea}>
            {callState === 'G-K03' ? (
              /* Incoming Controls: Decline, Message, Accept */
              <View style={styles.controlsRow}>
                <View style={styles.controlCol}>
                  <TouchableOpacity
                    style={[styles.circleBtn, styles.redEndBtn]}
                    onPress={() => setCallState('2.12_missed')}
                    activeOpacity={0.85}
                  >
                    <PhoneOff size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.greenControlLabel}>Decline</Text>
                </View>

                <View style={styles.controlCol}>
                  <TouchableOpacity
                    style={[styles.circleBtn, styles.translucentGreenBtn]}
                    onPress={() => router.replace(`/chat/${id || 'kubwa-green-hub'}`)}
                    activeOpacity={0.85}
                  >
                    <MessageSquare size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.greenControlLabel}>Message</Text>
                </View>

                <View style={styles.controlCol}>
                  <TouchableOpacity
                    style={[styles.circleBtn, styles.whiteAcceptBtn]}
                    onPress={() => setCallState('G-K02')}
                    activeOpacity={0.85}
                  >
                    <Phone size={24} color="#1E6B24" />
                  </TouchableOpacity>
                  <Text style={styles.greenControlLabel}>Accept</Text>
                </View>
              </View>
            ) : (
              /* Calling / Connected Controls: Mute, End, Speaker */
              <View style={styles.controlsRow}>
                <View style={styles.controlCol}>
                  <TouchableOpacity
                    style={[
                      styles.circleBtn,
                      styles.translucentGreenBtn,
                      isMuted && styles.translucentActiveBtn,
                    ]}
                    onPress={() => setIsMuted(!isMuted)}
                    activeOpacity={0.85}
                  >
                    {isMuted ? (
                      <MicOff size={22} color="#1E6B24" />
                    ) : (
                      <Mic size={22} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.greenControlLabel}>Mute</Text>
                </View>

                <View style={styles.controlCol}>
                  <TouchableOpacity
                    style={[styles.circleBtn, styles.redEndBtn]}
                    onPress={() =>
                      setCallState(callState === 'G-K01' ? '2.12_missed' : '2.11_ended')
                    }
                    activeOpacity={0.85}
                  >
                    <PhoneOff size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                  <Text style={styles.greenControlLabel}>End</Text>
                </View>

                <View style={styles.controlCol}>
                  <TouchableOpacity
                    style={[
                      styles.circleBtn,
                      styles.translucentGreenBtn,
                      isSpeaker && styles.translucentActiveBtn,
                    ]}
                    onPress={() => setIsSpeaker(!isSpeaker)}
                    activeOpacity={0.85}
                  >
                    {isSpeaker ? (
                      <Volume2 size={22} color="#1E6B24" />
                    ) : (
                      <VolumeX size={22} color="#FFFFFF" />
                    )}
                  </TouchableOpacity>
                  <Text style={styles.greenControlLabel}>Speaker</Text>
                </View>
              </View>
            )}
          </View>
        </View>
      ) : (
        /* ============================================================== */
        /* 2.11 CALL · ENDED & 2.12 CALL · MISSED (White Screens)          */
        /* ============================================================== */
        <View style={styles.whiteContainer}>
          <AppHeader showBack={false} rightAction="bell" />

          <ScrollView
            contentContainerStyle={styles.whiteScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* ← Call Back Header */}
            <TouchableOpacity
              style={styles.backNavRow}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={18} color="#2D6A2E" strokeWidth={2.4} />
              <Text style={styles.backNavText}>Call</Text>
            </TouchableOpacity>

            <Text style={styles.pageMainTitle}>EcoSmart call</Text>

            {/* Center Recycler Summary */}
            <View style={styles.whiteCenterBlock}>
              <View style={styles.lightGreenSquareAvatar}>
                <Text style={styles.lightGreenSquareText}>KG</Text>
              </View>

              <Text style={styles.whiteCallerName}>{recyclerName}</Text>
              <Text style={styles.whiteCallerMeta}>Verified · 4.8 · Kubwa, Abuja</Text>

              <Text style={styles.whiteCallOutcomeText}>
                {callState === '2.11_ended'
                  ? 'Call ended · 2 min'
                  : "Kubwa Green Hub didn't answer"}
              </Text>
              <Text style={styles.whitePrivacyNote}>
                Private in-app call · Your numbers stay private
              </Text>
            </View>

            {/* Pickup Context Card */}
            <View style={styles.pickupContextBox}>
              <Image
                source={require('../../assets/images/scanned-bottle.png')}
                style={styles.pickupThumb}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.pickupContextTitle}>
                  Accepted · PET bottles · ~3 kg
                </Text>
                <Text style={styles.pickupContextSub}>
                  Musa · Call any time after acceptance, even when the hub is closed
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            {callState === '2.11_ended' ? (
              <View style={styles.whiteActionsCol}>
                <TouchableOpacity
                  style={styles.primaryGreenFullBtn}
                  onPress={() => setCallState('G-K01')}
                  activeOpacity={0.85}
                >
                  <Phone size={16} color="#FFFFFF" />
                  <Text style={styles.primaryGreenFullBtnText}>Call again</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryWhiteFullBtn}
                  onPress={() => router.replace(`/chat/${id || 'kubwa-green-hub'}`)}
                  activeOpacity={0.75}
                >
                  <MessageSquare size={16} color="#0F1E12" />
                  <Text style={styles.secondaryWhiteFullBtnText}>Back to chat</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.whiteActionsCol}>
                <TouchableOpacity
                  style={styles.secondaryWhiteFullBtn}
                  onPress={() => router.replace(`/chat/${id || 'kubwa-green-hub'}`)}
                  activeOpacity={0.75}
                >
                  <MessageSquare size={16} color="#2D6A2E" />
                  <Text style={[styles.secondaryWhiteFullBtnText, { color: '#2D6A2E' }]}>
                    Send a message in chat
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.tryAgainGhostBtn}
                  onPress={() => setCallState('G-K01')}
                  activeOpacity={0.75}
                >
                  <Phone size={15} color="#2D6A2E" />
                  <Text style={styles.tryAgainGhostText}>Try again</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <BottomNavBar activeTab="requests" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  demoBar: {
    backgroundColor: '#0F1E12',
    paddingVertical: 8,
    zIndex: 20,
  },
  demoScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 6,
  },
  demoTitle: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#A7F3D0',
    marginRight: 4,
  },
  demoPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  demoPillActive: {
    backgroundColor: '#4ADE80',
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  demoPillTextActive: {
    color: '#0F1E12',
    fontWeight: '800',
  },

  /* Solid Green Full-Screen Styles (Calling, Connected, Incoming) */
  greenContainer: {
    flex: 1,
    backgroundColor: '#1E6B24',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 42,
  },
  topSection: {
    alignItems: 'center',
  },
  greenPrivacyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 28,
  },
  greenPrivacyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F0FDF4',
  },
  whiteAvatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#E6F4D7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  whiteAvatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E6B24',
  },
  greenCallerName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  greenStatusText: {
    fontSize: 14,
    color: '#DCFCE7',
    marginBottom: 8,
  },
  greenTimerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DCFCE7',
    fontVariant: ['tabular-nums'],
  },
  greenSubHint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.72)',
  },
  controlsArea: {
    width: '100%',
    paddingHorizontal: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  controlCol: {
    alignItems: 'center',
    gap: 8,
  },
  circleBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
  },
  translucentGreenBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  translucentActiveBtn: {
    backgroundColor: '#FFFFFF',
  },
  redEndBtn: {
    backgroundColor: '#DC2626',
  },
  whiteAcceptBtn: {
    backgroundColor: '#FFFFFF',
  },
  greenControlLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F0FDF4',
  },

  /* 2.11 Call Ended & 2.12 Call Missed White Screen Styles */
  whiteContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  whiteScroll: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 32,
  },
  backNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  backNavText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  pageMainTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F1E12',
    marginBottom: 24,
  },
  whiteCenterBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  lightGreenSquareAvatar: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: '#E6F4D7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  lightGreenSquareText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2D6A2E',
  },
  whiteCallerName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 4,
  },
  whiteCallerMeta: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 14,
  },
  whiteCallOutcomeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#2D6A2E',
    marginBottom: 4,
  },
  whitePrivacyNote: {
    fontSize: 12,
    color: '#64748B',
  },
  pickupContextBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  pickupThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
  },
  pickupContextTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 2,
  },
  pickupContextSub: {
    fontSize: 11.5,
    color: '#64748B',
    lineHeight: 16,
  },
  whiteActionsCol: {
    gap: 10,
  },
  primaryGreenFullBtn: {
    backgroundColor: '#2D6A2E',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 26,
  },
  primaryGreenFullBtnText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryWhiteFullBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 26,
  },
  secondaryWhiteFullBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
  tryAgainGhostBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  tryAgainGhostText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2D6A2E',
  },
});
