import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  Lock,
  Phone,
  MessageSquare,
} from 'lucide-react-native';

type CallState = 'calling' | 'active' | 'incoming';

export default function RecyclerCallScreen() {
  const router = useRouter();
  const [callState, setCallState] = useState<CallState>('calling');
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [seconds, setSeconds] = useState(252); // 04:12

  useEffect(() => {
    let timer: any;
    if (callState === 'active') {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Demo Switcher Pill Bar for the 3 visual artboards */}
      <View style={styles.demoSwitcher}>
        {[
          { id: 'calling', label: '1. Calling' },
          { id: 'active', label: '2. Active (04:12)' },
          { id: 'incoming', label: '3. Incoming Call' },
        ].map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.switcherPill, callState === item.id && styles.switcherPillActive]}
            onPress={() => setCallState(item.id as any)}
          >
            <Text style={[styles.switcherPillText, callState === item.id && styles.switcherPillTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Header security notice */}
      <View style={styles.securityHeader}>
        <Lock size={14} color="#A7F3D0" />
        <Text style={styles.securityHeaderText}>EcoSmart call · numbers hidden</Text>
      </View>

      {/* Caller Info */}
      <View style={styles.centerInfo}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>MA</Text>
        </View>

        <Text style={styles.callerName}>Musa A.</Text>

        {callState === 'calling' && (
          <>
            <Text style={styles.callSubStatus}>Calling...</Text>
            <Text style={styles.dataNotice}>Free in-app call · uses your data</Text>
          </>
        )}

        {callState === 'active' && (
          <Text style={styles.callTimerText}>{formatTimer(seconds)}</Text>
        )}

        {callState === 'incoming' && (
          <>
            <Text style={styles.callSubStatus}>is calling you</Text>
            <Text style={styles.dataNotice}>About his PET pickup today</Text>
          </>
        )}
      </View>

      {/* Bottom Controls */}
      <View style={styles.bottomControlsArea}>
        {callState !== 'incoming' ? (
          <View style={styles.controlsRow}>
            {/* Mute Button */}
            <View style={styles.controlItem}>
              <TouchableOpacity
                style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
                onPress={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <MicOff size={24} color="#111827" /> : <Mic size={24} color="#FFFFFF" />}
              </TouchableOpacity>
              <Text style={styles.controlLabel}>Mute</Text>
            </View>

            {/* End Call Button */}
            <View style={styles.controlItem}>
              <TouchableOpacity
                style={styles.endCallBtn}
                onPress={() => router.push('/recycler/requests' as any)}
              >
                <PhoneOff size={26} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.controlLabel}>End</Text>
            </View>

            {/* Speaker Button */}
            <View style={styles.controlItem}>
              <TouchableOpacity
                style={[styles.controlBtn, isSpeaker && styles.controlBtnActive]}
                onPress={() => setIsSpeaker(!isSpeaker)}
              >
                <Volume2 size={24} color={isSpeaker ? '#111827' : '#FFFFFF'} />
              </TouchableOpacity>
              <Text style={styles.controlLabel}>Speaker</Text>
            </View>
          </View>
        ) : (
          <View style={styles.incomingControlsRow}>
            {/* Decline */}
            <View style={styles.controlItem}>
              <TouchableOpacity
                style={styles.endCallBtn}
                onPress={() => router.push('/recycler/requests' as any)}
              >
                <PhoneOff size={26} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.controlLabel}>Decline</Text>
            </View>

            {/* Message */}
            <View style={styles.controlItem}>
              <TouchableOpacity
                style={styles.controlBtn}
                onPress={() => router.push('/recycler/chat' as any)}
              >
                <MessageSquare size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.controlLabel}>Message</Text>
            </View>

            {/* Accept */}
            <View style={styles.controlItem}>
              <TouchableOpacity
                style={styles.acceptCallBtn}
                onPress={() => setCallState('active')}
              >
                <Phone size={26} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.controlLabel}>Accept</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C5B28',
    justifyContent: 'space-between',
  },
  demoSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  switcherPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  switcherPillActive: {
    backgroundColor: '#FFFFFF',
  },
  switcherPillText: {
    fontSize: 12,
    color: '#D1FAE5',
    fontWeight: '600',
  },
  switcherPillTextActive: {
    color: '#1C5B28',
    fontWeight: '700',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 14,
  },
  securityHeaderText: {
    fontSize: 13,
    color: '#A7F3D0',
    fontWeight: '500',
  },
  centerInfo: {
    alignItems: 'center',
    marginTop: -40,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1C5B28',
  },
  callerName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  callSubStatus: {
    fontSize: 16,
    color: '#D1FAE5',
    marginTop: 8,
  },
  dataNotice: {
    fontSize: 13,
    color: '#A7F3D0',
    marginTop: 4,
  },
  callTimerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#A7F3D0',
    marginTop: 8,
  },
  bottomControlsArea: {
    paddingBottom: 50,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  incomingControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
  },
  controlItem: {
    alignItems: 'center',
  },
  controlBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  endCallBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptCallBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    marginTop: 8,
    fontWeight: '500',
  },
});
