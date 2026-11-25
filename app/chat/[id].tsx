import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  Phone,
  Send,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Clock,
  PhoneMissed,
  Check,
  CheckCheck,
  RefreshCw,
  ExternalLink,
} from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { BottomNavBar } from '../../components/common/BottomNavBar';

type ChatMode = 'G-C01' | 'G-C02' | '2.01' | '2.05' | '2.04' | '2.06' | '2.07' | '2.14';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const recyclerName = 'Kubwa Green Hub';

  const [mode, setMode] = useState<ChatMode>('G-C01');
  const [inputText, setInputText] = useState('');
  const [timeAccepted, setTimeAccepted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Dynamic user-sent messages
  const [customMessages, setCustomMessages] = useState<
    { id: string; text: string; time: string; sender: 'user' | 'recycler' }[]
  >([]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      text: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: 'user' as const,
    };

    setCustomMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputText('');

    // Simulate auto-reply after 1 sec
    setTimeout(() => {
      setCustomMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: 'Thanks! We are on it. Feel free to call us if urgent.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: 'recycler' as const,
        },
      ]);
    }, 1200);
  };

  const handleAcceptTime = () => {
    setTimeAccepted(true);
    setShowToast(true);
    setMode('2.04');
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar with Recycler Info & Call CTA */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.4} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>{recyclerName}</Text>
            <Text style={styles.headerSubtitle}>Verified · usually replies in 15 min</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.callHeaderBtn}
          onPress={() => router.push(`/call/${id || 'kubwa-green-hub'}`)}
          activeOpacity={0.7}
        >
          <Phone size={18} color="#2D6A2E" />
        </TouchableOpacity>
      </View>

      {/* Small Green Wave Strip */}
      <View style={styles.waveContainer} pointerEvents="none">
        <Svg width="100%" height={18} viewBox="0 0 400 18" preserveAspectRatio="none">
          <Path
            d="M 0,0 L 400,0 L 400,8 C 310,16 210,4 120,13 C 60,18 0,9 0,9 Z"
            fill="#E6F4D7"
          />
        </Svg>
      </View>

      {/* Demo State Switcher */}
      <View style={styles.modeBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modeScroll}>
          <TouchableOpacity
            style={[styles.modePill, mode === 'G-C01' && styles.modePillActive]}
            onPress={() => setMode('G-C01')}
          >
            <Text style={[styles.modePillText, mode === 'G-C01' && styles.modePillTextActive]}>
              G-C01 (Enquiry)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modePill, mode === 'G-C02' && styles.modePillActive]}
            onPress={() => setMode('G-C02')}
          >
            <Text style={[styles.modePillText, mode === 'G-C02' && styles.modePillTextActive]}>
              G-C02 (New time)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modePill, mode === '2.01' && styles.modePillActive]}
            onPress={() => setMode('2.01')}
          >
            <Text style={[styles.modePillText, mode === '2.01' && styles.modePillTextActive]}>
              2.01 (Closed)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modePill, mode === '2.05' && styles.modePillActive]}
            onPress={() => setMode('2.05')}
          >
            <Text style={[styles.modePillText, mode === '2.05' && styles.modePillTextActive]}>
              2.05 (Time picker)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modePill, mode === '2.04' && styles.modePillActive]}
            onPress={() => setMode('2.04')}
          >
            <Text style={[styles.modePillText, mode === '2.04' && styles.modePillTextActive]}>
              2.04 (Confirmed)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modePill, mode === '2.06' && styles.modePillActive]}
            onPress={() => setMode('2.06')}
          >
            <Text style={[styles.modePillText, mode === '2.06' && styles.modePillTextActive]}>
              2.06 (Live status)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modePill, mode === '2.07' && styles.modePillActive]}
            onPress={() => setMode('2.07')}
          >
            <Text style={[styles.modePillText, mode === '2.07' && styles.modePillTextActive]}>
              2.07 (Upload/Retry)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modePill, mode === '2.14' && styles.modePillActive]}
            onPress={() => setMode('2.14')}
          >
            <Text style={[styles.modePillText, mode === '2.14' && styles.modePillTextActive]}>
              2.14 (Call log)
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Floating Success Toast (6.20 / 2.04) */}
      {showToast && (
        <View style={styles.floatingToast}>
          <Check size={16} color="#FFFFFF" strokeWidth={3} />
          <View>
            <Text style={styles.toastTitle}>New time confirmed</Text>
            <Text style={styles.toastSubtitle}>Sat 9 Nov, 2–3pm</Text>
          </View>
        </View>
      )}

      {/* Context Bar */}
      {mode === 'G-C01' ? (
        <View style={styles.contextCard}>
          <View style={styles.contextLeft}>
            <Text style={styles.contextTag}>Asking about</Text>
            <Text style={styles.contextTitle}>PET bottles, ~3 kg</Text>
          </View>
          <TouchableOpacity
            style={styles.contextCtaBtn}
            onPress={() => router.push('/recyclers/request-pickup')}
            activeOpacity={0.8}
          >
            <Text style={styles.contextCtaBtnText}>Book ₦120/kg</Text>
          </TouchableOpacity>
        </View>
      ) : mode === '2.06' ? (
        <View style={styles.contextCard}>
          <View style={styles.contextLeft}>
            <Text style={styles.contextTag}>Your pickup · Paid</Text>
            <Text style={styles.contextTitle}>PET 3.2 kg · ₦384 paid to wallet</Text>
          </View>
          <TouchableOpacity
            style={styles.viewPickupBtn}
            onPress={() => router.push('/pickup/REQ-001')}
            activeOpacity={0.8}
          >
            <Text style={styles.viewPickupBtnText}>View</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.contextCard}>
          <View style={styles.contextLeft}>
            <Text style={styles.contextTag}>
              Your pickup · {mode === '2.04' ? 'Sat 2–3pm' : 'Sat 10:00–11:00'}
            </Text>
            <Text style={styles.contextTitle}>Pickup accepted · PET ~3 kg</Text>
            <Text style={styles.escrowSub}>
              ₦450 set aside for you · your code shows after you accept
            </Text>
          </View>
          <TouchableOpacity
            style={styles.viewPickupBtn}
            onPress={() => router.push('/pickup/REQ-001')}
            activeOpacity={0.8}
          >
            <Text style={styles.viewPickupBtnText}>View</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Privacy note */}
      <View style={styles.privacyStrip}>
        <ShieldCheck size={14} color="#2D6A2E" />
        <Text style={styles.privacyStripText}>
          Chats and calls stay in EcoSmart. Your number is hidden.
        </Text>
      </View>

      {/* Chat Messages Body */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.chatScroll} showsVerticalScrollIndicator={false}>
          {/* 2.01 Contact choice · Closed */}
          {mode === '2.01' && (
            <View style={{ gap: 12 }}>
              <View style={styles.timeProposalCard}>
                <Text style={styles.timeProposalTitle}>Contact recycler</Text>
                <Text style={[styles.timeProposalDesc, { marginTop: 4 }]}>
                  {recyclerName} · Verified · 4.8 · Kubwa, Abuja{'\n'}
                  Monday–Saturday · 6am–6pm · Sunday closed
                </Text>
                <View
                  style={{
                    backgroundColor: '#EAF5EA',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 12,
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '800', color: '#166534' }}>
                    {recyclerName} is closed now — send a chat instead
                  </Text>
                  <Text style={{ fontSize: 12, color: '#2D6A2E', marginTop: 4 }}>
                    You can send an enquiry now. Calling is unavailable outside opening hours before a request.
                  </Text>
                </View>
                <View style={styles.proposalActions}>
                  <TouchableOpacity
                    style={styles.proposalAcceptBtn}
                    onPress={() => setMode('G-C01')}
                  >
                    <Text style={styles.proposalAcceptText}>Chat</Text>
                  </TouchableOpacity>
                  <View style={[styles.proposalSuggestBtn, { opacity: 0.45 }]}>
                    <Text style={styles.proposalSuggestText}>Call (closed)</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* 2.05 Chat · Suggest time picker */}
          {mode === '2.05' && (
            <View style={{ gap: 12 }}>
              <View style={styles.bubblePartner}>
                <Text style={styles.bubblePartnerText}>
                  Proposed pickup: Sat 9 Nov, 14:00–15:00. Does this work for you?
                </Text>
                <Text style={styles.bubbleTimePartner}>10:06</Text>
              </View>

              <View style={[styles.timeProposalCard, { width: '100%', maxWidth: '100%' }]}>
                <Text style={styles.timeProposalTitle}>Suggest another time</Text>
                <Text style={[styles.timeProposalDesc, { marginTop: 4 }]}>
                  Choose a date and a 1-hour pickup window. The hub will need to confirm your suggestion.
                </Text>

                <View
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderWidth: 1,
                    borderColor: '#CBD5E1',
                    borderRadius: 12,
                    padding: 10,
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#2D6A2E' }}>
                    📅 Sat 9 Nov
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#F8FAFC',
                      borderWidth: 1,
                      borderColor: '#CBD5E1',
                      borderRadius: 12,
                      padding: 10,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F1E12' }}>
                      🕒 15:00
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: '#F8FAFC',
                      borderWidth: 1,
                      borderColor: '#CBD5E1',
                      borderRadius: 12,
                      padding: 10,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#0F1E12' }}>
                      🕒 16:00
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.proposalAcceptBtn}
                  onPress={handleAcceptTime}
                >
                  <Text style={styles.proposalAcceptText}>Suggest time</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* G-C01 Stream */}
          {mode === 'G-C01' && (
            <View>
              <View style={styles.dateSeparator}>
                <Text style={styles.dateSeparatorText}>Today</Text>
              </View>

              <View style={styles.bubbleUser}>
                <Text style={styles.bubbleUserText}>
                  Hello, I have about 3 kg of PET bottles. Do you buy this?
                </Text>
                <Text style={styles.bubbleTimeUser}>10:00</Text>
              </View>

              <View style={styles.bubblePartner}>
                <Text style={styles.bubblePartnerText}>
                  Yes, we buy PET. ₦120/kg today. We pick up from 5 kg, but you can drop off any amount from 1 kg at our yard.
                </Text>
                <Text style={styles.bubbleTimePartner}>10:00</Text>
              </View>
            </View>
          )}

          {/* G-C02 & 2.04 Stream */}
          {(mode === 'G-C02' || mode === '2.04') && (
            <View>
              <View style={styles.systemEventPill}>
                <Text style={styles.systemEventText}>
                  Kubwa Green Hub accepted your pickup · 09:41
                </Text>
              </View>

              <View style={styles.dateSeparator}>
                <Text style={styles.dateSeparatorText}>Today</Text>
              </View>

              <View style={styles.bubblePartner}>
                <Text style={styles.bubblePartnerText}>
                  Good morning! Our van is delayed. Can we come at 2pm instead?
                </Text>
                <Text style={styles.bubbleTimePartner}>10:06</Text>
              </View>

              {/* Proposed Time Box */}
              <View style={styles.timeProposalCard}>
                <View style={styles.timeProposalHeader}>
                  <Calendar size={18} color="#2D6A2E" />
                  <Text style={styles.timeProposalTitle}>New time: Sat 9 Nov, 2–3pm</Text>
                </View>
                <Text style={styles.timeProposalDesc}>
                  Was 10–11am. Nothing changes until you accept.
                </Text>

                {mode === '2.04' || timeAccepted ? (
                  <View style={styles.timeAcceptedBadge}>
                    <Check size={14} color="#2D6A2E" />
                    <Text style={styles.timeAcceptedText}>You accepted 2–3pm</Text>
                  </View>
                ) : (
                  <View style={styles.proposalActions}>
                    <TouchableOpacity
                      style={styles.proposalSuggestBtn}
                      onPress={() => alert('Type a suggested time in the chat below.')}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.proposalSuggestText}>Suggest another</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.proposalAcceptBtn}
                      onPress={handleAcceptTime}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.proposalAcceptText}>Accept time</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Missed call note */}
              <TouchableOpacity
                style={styles.missedCallPill}
                onPress={() => router.push('/call/kubwa-green-hub')}
                activeOpacity={0.7}
              >
                <PhoneMissed size={16} color="#DC2626" />
                <Text style={styles.missedCallText}>
                  Missed call from Kubwa Green Hub · 10:05 · <Text style={{ textDecorationLine: 'underline' }}>Call back</Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 2.06 Stream: Live updates */}
          {mode === '2.06' && (
            <View>
              <View style={styles.dateSeparator}>
                <Text style={styles.dateSeparatorText}>Sat 9 Nov</Text>
              </View>

              <View style={styles.systemEventPill}>
                <Clock size={12} color="#64748B" />
                <Text style={styles.systemEventText}>Pickup time: 2–3pm · 09:20</Text>
              </View>

              <View style={styles.systemEventPill}>
                <Text style={styles.systemEventText}>Kubwa Green Hub is on the way · 13:35</Text>
              </View>

              <View style={styles.systemEventPill}>
                <Text style={styles.systemEventText}>They've arrived · 13:58</Text>
              </View>

              <View style={styles.systemEventPillGreen}>
                <Check size={12} color="#166534" />
                <Text style={styles.systemEventGreenText}>You accepted ₦384 · 14:08</Text>
              </View>

              <View style={styles.systemEventPillGreen}>
                <CheckCheck size={12} color="#166534" />
                <Text style={styles.systemEventGreenText}>₦384 paid to your wallet · 14:15</Text>
              </View>
            </View>
          )}

          {/* 2.07 Stream: Photo uploading & failed message */}
          {mode === '2.07' && (
            <View>
              <View style={styles.bubblePartner}>
                <Text style={styles.bubblePartnerText}>Please send a photo of the bags.</Text>
                <Text style={styles.bubbleTimePartner}>10:20</Text>
              </View>

              {/* Uploading photo progress card */}
              <View style={styles.uploadingBubble}>
                <View style={styles.uploadingHeader}>
                  <Text style={styles.uploadingTitle}>Sending photo…</Text>
                  <Text style={styles.uploadingPercent}>60%</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: '60%' }]} />
                </View>
                <Text style={styles.bubbleTimeUser}>10:21</Text>
              </View>

              {/* Failed Message bubble */}
              <View style={styles.failedBubble}>
                <Text style={styles.failedText}>Yes, see you then.</Text>
                <TouchableOpacity
                  style={styles.retryRow}
                  onPress={() => alert('Retrying message delivery…')}
                  activeOpacity={0.7}
                >
                  <AlertCircle size={14} color="#DC2626" />
                  <Text style={styles.retryText}>Not sent · Tap to try again</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* 2.14 Stream: Call Logs */}
          {mode === '2.14' && (
            <View>
              <TouchableOpacity
                style={styles.callLogCard}
                onPress={() => router.push('/call/kubwa-green-hub')}
                activeOpacity={0.7}
              >
                <PhoneMissed size={18} color="#DC2626" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.callLogTitle}>Missed call</Text>
                  <Text style={styles.callLogSub}>Tap to call back</Text>
                </View>
                <Text style={styles.callLogTime}>10:05</Text>
              </TouchableOpacity>

              <View style={styles.bubbleUser}>
                <Text style={styles.bubbleUserText}>Sorry I missed you. Call me now?</Text>
                <Text style={styles.bubbleTimeUser}>10:07</Text>
              </View>

              <View style={styles.callLogCardGreen}>
                <Phone size={18} color="#2D6A2E" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.callLogTitleGreen}>Outgoing call</Text>
                  <Text style={styles.callLogSubGreen}>Call · 2 min</Text>
                </View>
                <Text style={styles.callLogTime}>10:12</Text>
              </View>
            </View>
          )}

          {/* Custom Interactive User Messages */}
          {customMessages.map((m) => (
            <View
              key={m.id}
              style={m.sender === 'user' ? styles.bubbleUser : styles.bubblePartner}
            >
              <Text style={m.sender === 'user' ? styles.bubbleUserText : styles.bubblePartnerText}>
                {m.text}
              </Text>
              <Text style={m.sender === 'user' ? styles.bubbleTimeUser : styles.bubbleTimePartner}>
                {m.time}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Quick Suggestion Chips (G-C01) */}
        {mode === 'G-C01' && (
          <View style={styles.quickChipsBar}>
            <TouchableOpacity
              style={styles.chip}
              onPress={() => handleSendMessage('Are you open today?')}
              activeOpacity={0.7}
            >
              <Text style={styles.chipText}>Are you open today?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.chip}
              onPress={() => handleSendMessage('Can you pick up?')}
              activeOpacity={0.7}
            >
              <Text style={styles.chipText}>Can you pick up?</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message…"
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={() => handleSendMessage()}
          />
          <TouchableOpacity
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
            onPress={() => handleSendMessage()}
            disabled={!inputText.trim()}
            activeOpacity={0.8}
          >
            <Send size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <BottomNavBar activeTab="requests" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F1E12',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  callHeaderBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EAF5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveContainer: {
    width: '100%',
    height: 18,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  modeBar: {
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modeScroll: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
  },
  modePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  modePillActive: {
    backgroundColor: '#2D6A2E',
    borderColor: '#2D6A2E',
  },
  modePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  modePillTextActive: {
    color: '#FFFFFF',
  },
  floatingToast: {
    position: 'absolute',
    top: 90,
    left: 20,
    right: 20,
    zIndex: 99,
    backgroundColor: '#2D6A2E',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  toastTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  toastSubtitle: {
    fontSize: 11,
    color: '#EAF5EA',
  },
  contextCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  contextLeft: {
    flex: 1,
    marginRight: 10,
  },
  contextTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2D6A2E',
  },
  contextTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
    marginTop: 2,
  },
  escrowSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  contextCtaBtn: {
    backgroundColor: '#2D6A2E',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
  },
  contextCtaBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  viewPickupBtn: {
    backgroundColor: '#EAF5EA',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
  },
  viewPickupBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  privacyStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
    backgroundColor: '#F0FDF4',
    borderBottomWidth: 1,
    borderBottomColor: '#DCFCE7',
  },
  privacyStripText: {
    fontSize: 11,
    color: '#2D6A2E',
    fontWeight: '500',
  },
  chatScroll: {
    padding: 16,
    gap: 12,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 8,
  },
  dateSeparatorText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: '#2D6A2E',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    padding: 12,
    maxWidth: '80%',
  },
  bubbleUserText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 19,
  },
  bubbleTimeUser: {
    fontSize: 10,
    color: '#C7E4B2',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  bubblePartner: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 12,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bubblePartnerText: {
    fontSize: 14,
    color: '#0F1E12',
    lineHeight: 19,
  },
  bubbleTimePartner: {
    fontSize: 10,
    color: '#94A3B8',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  timeProposalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#C7E4B2',
    alignSelf: 'flex-start',
    maxWidth: '88%',
    marginTop: 4,
  },
  timeProposalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  timeProposalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
  timeProposalDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
  },
  proposalActions: {
    flexDirection: 'row',
    gap: 8,
  },
  proposalSuggestBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  proposalSuggestText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  proposalAcceptBtn: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#2D6A2E',
    alignItems: 'center',
  },
  proposalAcceptText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timeAcceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EAF5EA',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  timeAcceptedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  missedCallPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'center',
    backgroundColor: '#FEE2E2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginVertical: 6,
  },
  missedCallText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#B91C1C',
  },
  systemEventPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 4,
  },
  systemEventText: {
    fontSize: 11,
    color: '#475569',
  },
  systemEventPillGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    alignSelf: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 4,
  },
  systemEventGreenText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#166534',
  },
  uploadingBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    width: 220,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  uploadingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  uploadingTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F1E12',
  },
  uploadingPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2D6A2E',
  },
  failedBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 12,
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  failedText: {
    fontSize: 14,
    color: '#0F1E12',
    marginBottom: 6,
  },
  retryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  retryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#DC2626',
  },
  callLogCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  callLogTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  callLogSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  callLogTime: {
    fontSize: 11,
    color: '#94A3B8',
  },
  callLogCardGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  callLogTitleGreen: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  callLogSubGreen: {
    fontSize: 11,
    color: '#64748B',
  },
  quickChipsBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  chipText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F1E12',
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2D6A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
});
