import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Globe,
  Mic,
  Send,
  Square,
  WifiOff,
  Check,
  Clock,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomNavBar } from '../../components/common/BottomNavBar';

type MinaDemoMode =
  | '14.1_welcome'
  | '14.2_cashout_ctx'
  | '14.3_get_paid'
  | '14.4_what_recycle'
  | '14.5_listening'
  | '14.6_voice_typing'
  | '14.8_money_delayed'
  | '14.9_offline';

const MINA_LANGS = ['English', 'Pidgin', 'Hausa', 'Yoruba', 'Igbo'];

export default function AskMinaScreen() {
  const router = useRouter();

  const [mode, setMode] = useState<MinaDemoMode>('14.1_welcome');
  const [langIndex, setLangIndex] = useState<number>(0);
  const [inputText, setInputText] = useState<string>('');
  const [customThread, setCustomThread] = useState<
    { id: string; sender: 'user' | 'mina'; text: string }[]
  >([]);

  const currentLang = MINA_LANGS[langIndex];

  const cycleLanguage = () => {
    setLangIndex((prev) => (prev + 1) % MINA_LANGS.length);
  };

  const handleSendCustom = () => {
    if (!inputText.trim()) return;
    const q = inputText.trim();
    setInputText('');

    if (q.toLowerCase().includes('recycle') || q.toLowerCase().includes('bottle')) {
      setMode('14.4_what_recycle');
      return;
    }
    if (q.toLowerCase().includes('paid') || q.toLowerCase().includes('code')) {
      setMode('14.3_get_paid');
      return;
    }
    if (q.toLowerCase().includes('money') || q.toLowerCase().includes('cash')) {
      setMode('14.8_money_delayed');
      return;
    }

    setCustomThread((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: 'user', text: q },
      {
        id: (Date.now() + 1).toString(),
        sender: 'mina',
        text: 'In Kubwa, verified recyclers pay ₦120–₦150/kg for clean PET bottles. Your payout is held safely in EcoSmart escrow until you confirm the scale weight and give your 4-digit code.',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader
        showBack={false}
        rightAction="bell"
        onPressBell={() => router.push('/profile')}
      />

      {/* Demo Switcher for all 9 screens in Screens · 14 */}
      <View style={styles.demoBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoScroll}
        >
          {(
            [
              { key: '14.1_welcome', label: '14.1 Welcome' },
              { key: '14.2_cashout_ctx', label: '14.2 From Cash-out' },
              { key: '14.3_get_paid', label: '14.3 How I Get Paid' },
              { key: '14.4_what_recycle', label: '14.4 What to Recycle' },
              { key: '14.5_listening', label: '14.5 Voice Listening' },
              { key: '14.6_voice_typing', label: '14.6/7 Mina Typing' },
              { key: '14.8_money_delayed', label: '14.8 Talk to Person' },
              { key: '14.9_offline', label: '14.9 Offline' },
            ] as const
          ).map((item) => {
            const active = mode === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.demoPill, active && styles.demoPillActive]}
                onPress={() => setMode(item.key)}
              >
                <Text style={[styles.demoPillText, active && styles.demoPillTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Back Row */}
        <TouchableOpacity
          style={styles.backRow}
          onPress={() => router.back()}
        >
          <ArrowLeft size={20} color="#0F1E12" strokeWidth={2.3} />
          <Text style={styles.backText}>Ask Mina</Text>
        </TouchableOpacity>

        {/* Language Pill (shown on welcome & cash-out context) */}
        {(mode === '14.1_welcome' || mode === '14.2_cashout_ctx') && (
          <TouchableOpacity
            style={styles.langSelectorPill}
            onPress={cycleLanguage}
            activeOpacity={0.75}
          >
            <Globe size={13} color="#2D6A2E" />
            <Text style={styles.langSelectorText}>
              Mina speaks: {currentLang} · <Text style={{ fontWeight: '800' }}>Change</Text>
            </Text>
          </TouchableOpacity>
        )}

        {/* ===================================================== */}
        {/* 14.1 Welcome Screen                                   */}
        {/* ===================================================== */}
        {mode === '14.1_welcome' && (
          <View>
            <View style={styles.minaHeroCenter}>
              <View style={styles.minaAvatarWrap}>
                <Image
                  source={require('../../assets/images/mina-avatar.png')}
                  style={styles.minaAvatarImg}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.minaGreetingTitle}>Hi, I'm Mina 🌿</Text>
              <Text style={styles.minaGreetingSub}>
                Your EcoSmart helper. Ask me about recycling, prices or your money — any time.
              </Text>
            </View>

            <Text style={styles.tryAskingLabel}>Try asking</Text>
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                style={styles.promptCard}
                onPress={() => setMode('14.4_what_recycle')}
              >
                <Text style={styles.promptCardText}>What can I recycle?</Text>
                <Text style={styles.promptChevron}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.promptCard}
                onPress={() => setMode('14.3_get_paid')}
              >
                <Text style={styles.promptCardText}>How do I get paid?</Text>
                <Text style={styles.promptChevron}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 14.2 Contextual Entry From Cash-Out                   */}
        {/* ===================================================== */}
        {mode === '14.2_cashout_ctx' && (
          <View>
            <View style={styles.fromCashoutPill}>
              <Text style={styles.fromCashoutText}>↑ From: Cash out</Text>
            </View>

            <View style={styles.minaReplyRow}>
              <Image
                source={require('../../assets/images/mina-avatar.png')}
                style={styles.smallMinaAvatar}
              />
              <View style={styles.minaWhiteBubble}>
                <Text style={styles.minaBubbleText}>
                  Need help with your cash out? I can help with these:
                </Text>
              </View>
            </View>

            <Text style={[styles.tryAskingLabel, { marginTop: 14 }]}>
              Try asking
            </Text>
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                style={styles.promptCard}
                onPress={() => setMode('14.8_money_delayed')}
              >
                <Text style={styles.promptCardText}>
                  Why hasn't my money arrived?
                </Text>
                <Text style={styles.promptChevron}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.promptCard}
                onPress={() => router.push('/wallet')}
              >
                <Text style={styles.promptCardText}>Can I change my bank?</Text>
                <Text style={styles.promptChevron}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.promptCard}
                onPress={() => setMode('14.1_welcome')}
              >
                <Text style={styles.promptCardText}>Ask something else</Text>
                <Text style={styles.promptChevron}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 14.3 Q&A: How do I get paid?                          */}
        {/* ===================================================== */}
        {mode === '14.3_get_paid' && (
          <View>
            <View style={styles.userGreenBubble}>
              <Text style={styles.userGreenBubbleText}>How do I get paid?</Text>
            </View>

            <View style={styles.minaReplyRow}>
              <Image
                source={require('../../assets/images/mina-avatar.png')}
                style={styles.smallMinaAvatar}
              />
              <View style={styles.minaWhiteCardBubble}>
                <Text style={styles.minaBubbleText}>
                  When the recycler weighs your waste, you check the final amount on your phone.
                </Text>
                <Text style={[styles.minaBubbleText, { marginTop: 8 }]}>
                  If it's right, give them your 4-digit code. The money goes straight into your EcoSmart wallet. No cash.
                </Text>

                <TouchableOpacity
                  style={styles.inlineOutlineBtn}
                  onPress={() => router.push('/wallet')}
                >
                  <Text style={styles.inlineOutlineBtnText}>Open my wallet</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.tryAskingLabel, { marginTop: 18 }]}>
              Ask next
            </Text>
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                style={styles.promptCard}
                onPress={() => setMode('14.2_cashout_ctx')}
              >
                <Text style={styles.promptCardText}>
                  How do I cash out to my bank?
                </Text>
                <Text style={styles.promptChevron}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.promptCard}
                onPress={() => setMode('14.8_money_delayed')}
              >
                <Text style={styles.promptCardText}>Talk to a person</Text>
                <Text style={styles.promptChevron}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 14.4 Q&A: What can I recycle?                         */}
        {/* ===================================================== */}
        {mode === '14.4_what_recycle' && (
          <View>
            <View style={styles.userGreenBubble}>
              <Text style={styles.userGreenBubbleText}>What can I recycle?</Text>
            </View>

            <View style={styles.minaReplyRow}>
              <Image
                source={require('../../assets/images/mina-avatar.png')}
                style={styles.smallMinaAvatar}
              />
              <View style={styles.minaWhiteCardBubble}>
                <Text style={styles.minaBubbleText}>
                  In Kubwa, recyclers buy plastic bottles, thick bottles (oil, bleach), drink cans, cardboard and paper.
                </Text>
                <Text style={[styles.minaBubbleText, { marginTop: 8 }]}>
                  Not collected yet: e-waste and batteries. Keep them safe and dry for now.
                </Text>

                <TouchableOpacity
                  style={styles.inlineSolidGreenBtn}
                  onPress={() => router.push('/scan')}
                >
                  <Text style={styles.inlineSolidGreenBtnText}>
                    Scan an item to check
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.tryAskingLabel, { marginTop: 18 }]}>
              Ask next
            </Text>
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                style={styles.promptCard}
                onPress={() => setMode('14.3_get_paid')}
              >
                <Text style={styles.promptCardText}>How do I get paid?</Text>
                <Text style={styles.promptChevron}>›</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.promptCard}
                onPress={() => setMode('14.8_money_delayed')}
              >
                <Text style={styles.promptCardText}>Talk to a person</Text>
                <Text style={styles.promptChevron}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 14.5 Voice Listening Mode                             */}
        {/* ===================================================== */}
        {mode === '14.5_listening' && (
          <View style={styles.listeningCenterContainer}>
            <View style={styles.minaAvatarWrap}>
              <Image
                source={require('../../assets/images/mina-avatar.png')}
                style={styles.minaAvatarImg}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.listeningTitle}>I'm listening...</Text>
            <Text style={styles.listeningSub}>
              Speak in English, Pidgin, Hausa, Yoruba or Igbo.
            </Text>
          </View>
        )}

        {/* ===================================================== */}
        {/* 14.6 / 14.7 Voice Question & Mina is typing...        */}
        {/* ===================================================== */}
        {mode === '14.6_voice_typing' && (
          <View>
            <View style={styles.userGreenBubble}>
              <Text style={styles.userGreenBubbleText}>How do I get paid?</Text>
              <View style={styles.voiceMetaRow}>
                <Mic size={11} color="#2D6A2E" />
                <Text style={styles.voiceMetaText}>Voice · {currentLang}</Text>
              </View>
            </View>

            <View style={styles.minaReplyRow}>
              <Image
                source={require('../../assets/images/mina-avatar.png')}
                style={styles.smallMinaAvatar}
              />
              <TouchableOpacity
                style={styles.typingPill}
                onPress={() => setMode('14.3_get_paid')}
              >
                <Text style={styles.typingDots}>• • •</Text>
                <Text style={styles.typingLabel}>Mina is typing...</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 14.8 Cash-Out Escalation: Talk to a person            */}
        {/* ===================================================== */}
        {mode === '14.8_money_delayed' && (
          <View>
            <View style={styles.userGreenBubble}>
              <Text style={styles.userGreenBubbleText}>
                Why hasn't my money arrived?
              </Text>
            </View>

            <View style={styles.minaReplyRow}>
              <Image
                source={require('../../assets/images/mina-avatar.png')}
                style={styles.smallMinaAvatar}
              />
              <View style={styles.minaWhiteCardBubble}>
                <Text style={styles.minaBubbleText}>
                  Most cash outs arrive in a few minutes. Some banks take up to 24 hours.
                </Text>
                <Text style={[styles.minaBubbleText, { marginTop: 8 }]}>
                  Your ₦2,000 cash out to OPay ending 4421 was sent on Friday and is still pending. Let me connect you to a person to check it.
                </Text>

                <TouchableOpacity
                  style={styles.inlineSolidGreenBtn}
                  onPress={() => router.push('/reports' as any)}
                >
                  <Text style={styles.inlineSolidGreenBtnText}>
                    Talk to a person
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.questionGoesWithYouPill}>
              <Check size={13} color="#2D6A2E" strokeWidth={2.8} />
              <Text style={styles.questionGoesWithYouText}>
                Your question goes with you, so you won't need to repeat it.
              </Text>
            </View>
          </View>
        )}

        {/* ===================================================== */}
        {/* 14.9 Offline State                                    */}
        {/* ===================================================== */}
        {mode === '14.9_offline' && (
          <View>
            <View style={styles.offlineBanner}>
              <WifiOff size={14} color="#475569" />
              <Text style={styles.offlineBannerText}>
                You're offline. Mina will answer when you're back.
              </Text>
            </View>

            <View style={styles.userGreenBubble}>
              <Text style={styles.userGreenBubbleText}>Is my money safe?</Text>
              <View style={styles.voiceMetaRow}>
                <Clock size={11} color="#2D6A2E" />
                <Text style={styles.voiceMetaText}>Waiting to send</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.tryAgainOutlinePill}
              onPress={() => setMode('14.3_get_paid')}
            >
              <Text style={styles.tryAgainOutlineText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Custom interactive messages */}
        {customThread.map((msg) =>
          msg.sender === 'user' ? (
            <View key={msg.id} style={styles.userGreenBubble}>
              <Text style={styles.userGreenBubbleText}>{msg.text}</Text>
            </View>
          ) : (
            <View key={msg.id} style={styles.minaReplyRow}>
              <Image
                source={require('../../assets/images/mina-avatar.png')}
                style={styles.smallMinaAvatar}
              />
              <View style={styles.minaWhiteCardBubble}>
                <Text style={styles.minaBubbleText}>{msg.text}</Text>
              </View>
            </View>
          )
        )}
      </ScrollView>

      {/* Bottom Input / Voice Recording Bar */}
      <View style={styles.inputSection}>
        {mode === '14.5_listening' ? (
          <View>
            <View style={styles.recordingBarRow}>
              <View style={styles.recordingWaveformBox}>
                <View style={styles.redDot} />
                <Text style={styles.recordingTimerText}>0:03</Text>
                <View style={styles.waveformBarsRow}>
                  {[8, 16, 22, 12, 24, 18, 10, 20, 14, 8].map((h, idx) => (
                    <View
                      key={idx}
                      style={[styles.waveBar, { height: h }]}
                    />
                  ))}
                </View>
              </View>
              <TouchableOpacity
                style={styles.stopRecordingBtn}
                onPress={() => setMode('14.6_voice_typing')}
              >
                <Square size={14} color="#FFFFFF" fill="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.tapStopCaption}>
              Tap the green button when you finish speaking.
            </Text>
          </View>
        ) : (
          <View>
            <View style={styles.textInputRow}>
              <View style={styles.textInputBox}>
                <TextInput
                  style={styles.textInput}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Ask Mina anything..."
                  placeholderTextColor="#94A3B8"
                  onSubmitEditing={handleSendCustom}
                />
                <TouchableOpacity
                  onPress={() => setMode('14.5_listening')}
                  style={styles.micBtn}
                >
                  <Mic size={18} color="#2D6A2E" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.sendCircleBtn}
                onPress={handleSendCustom}
              >
                <Send size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.aiDisclaimerText}>
              Mina is AI and can make mistakes. For money problems, talk to a person.
            </Text>
          </View>
        )}
      </View>

      <BottomNavBar activeTab="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F4',
  },
  demoBar: {
    backgroundColor: '#EAF5EA',
    borderBottomWidth: 1,
    borderBottomColor: '#C7E4B2',
  },
  demoScroll: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  demoPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#C7E4B2',
  },
  demoPillActive: {
    backgroundColor: '#2D6A2E',
    borderColor: '#2D6A2E',
  },
  demoPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2D6A2E',
  },
  demoPillTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 28,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F1E12',
  },
  langSelectorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  langSelectorText: {
    fontSize: 12,
    color: '#0F1E12',
    fontWeight: '600',
  },
  minaHeroCenter: {
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  minaAvatarWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E4F3D8',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  minaAvatarImg: {
    width: '100%',
    height: '100%',
  },
  minaGreetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 6,
  },
  minaGreetingSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
  },
  tryAskingLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
  },
  promptCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  promptCardText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  promptChevron: {
    fontSize: 18,
    color: '#94A3B8',
  },
  fromCashoutPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 12,
  },
  fromCashoutText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  minaReplyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginTop: 8,
  },
  smallMinaAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginTop: 2,
  },
  minaWhiteBubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  minaWhiteCardBubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  minaBubbleText: {
    fontSize: 13.5,
    color: '#0F1E12',
    lineHeight: 19,
  },
  userGreenBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#E4F3D8',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '82%',
    marginBottom: 8,
  },
  userGreenBubbleText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#1E5D2E',
  },
  inlineOutlineBtn: {
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#2D6A2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  inlineOutlineBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  inlineSolidGreenBtn: {
    height: 42,
    borderRadius: 21,
    backgroundColor: '#38762B',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  inlineSolidGreenBtnText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* 14.5 Voice Listening */
  listeningCenterContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 90,
  },
  listeningTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 6,
  },
  listeningSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },
  voiceMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  voiceMetaText: {
    fontSize: 11,
    color: '#2D6A2E',
  },
  typingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  typingDots: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748B',
  },
  typingLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  questionGoesWithYouPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  questionGoesWithYouText: {
    fontSize: 12,
    color: '#64748B',
    flex: 1,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  offlineBannerText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
  },
  tryAgainOutlinePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#2D6A2E',
    backgroundColor: '#FFFFFF',
    marginTop: 6,
  },
  tryAgainOutlineText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D6A2E',
  },

  /* Bottom Input Bar */
  inputSection: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#F4F6F4',
  },
  textInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F1E12',
  },
  micBtn: {
    padding: 4,
  },
  sendCircleBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#38762B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiDisclaimerText: {
    fontSize: 10.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },
  recordingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recordingWaveformBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1.5,
    borderColor: '#2D6A2E',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  recordingTimerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
  },
  waveformBarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 6,
  },
  waveBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: '#2D6A2E',
  },
  stopRecordingBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#38762B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapStopCaption: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
  },
});
