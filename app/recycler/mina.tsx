import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  Globe,
  Sparkles,
  ChevronRight,
  Mic,
  Send,
  Square,
  WifiOff,
  Check,
  Clock,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import RecyclerBottomNavBar from '../../components/common/RecyclerBottomNavBar';

type MinaFrame =
  | 'start'
  | 'from_cash_out'
  | 'ans_set_aside'
  | 'ans_prices'
  | 'voice'
  | 'voice_typing'
  | 'typing'
  | 'human_handoff'
  | 'offline';

export default function RecyclerMinaScreen() {
  const router = useRouter();
  const [frame, setFrame] = useState<MinaFrame>('start');
  const [inputText, setInputText] = useState('');
  const [spokenLang, setSpokenLang] = useState<'English' | 'Pidgin' | 'Hausa'>('English');

  const cycleLanguage = () => {
    if (spokenLang === 'English') setSpokenLang('Pidgin');
    else if (spokenLang === 'Pidgin') setSpokenLang('Hausa');
    else setSpokenLang('English');
  };

  const frames: { id: MinaFrame; label: string }[] = [
    { id: 'start', label: '1. Start' },
    { id: 'from_cash_out', label: '2. From Cash Out' },
    { id: 'ans_set_aside', label: '3. Ans: Set Aside' },
    { id: 'ans_prices', label: '4. Ans: Prices' },
    { id: 'voice', label: '5. Listening Voice' },
    { id: 'voice_typing', label: '6. Voice Typing' },
    { id: 'typing', label: '7. Text Typing' },
    { id: 'human_handoff', label: '8. Talk to Person' },
    { id: 'offline', label: '9. Offline' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        showBack={true}
        rightAction="bell"
        onPressBell={() => router.push('/recycler/notifications' as any)}
      />

      {/* Sub-Header below green wave */}
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => router.push('/recycler/home' as any)}
            style={styles.backBtn}
          >
            <ArrowLeft size={20} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ask Mina</Text>
        </View>
      </View>

      {/* Demo Switcher Pills */}
      <View style={styles.demoPillsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoPillsScroll}
        >
          {frames.map((f) => (
            <TouchableOpacity
              key={f.id}
              style={[styles.demoPill, frame === f.id && styles.demoPillActive]}
              onPress={() => setFrame(f.id)}
            >
              <Text style={[styles.demoPillText, frame === f.id && styles.demoPillTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ================= FRAME 1: START ================= */}
        {frame === 'start' && (
          <View style={styles.contentWrap}>
            <TouchableOpacity style={styles.langPill} onPress={cycleLanguage}>
              <Globe size={13} color="#374151" />
              <Text style={styles.langPillText}>
                Mina speaks: {spokenLang} · <Text style={{ color: '#2E7D32' }}>Change</Text>
              </Text>
            </TouchableOpacity>

            <View style={styles.centerHero}>
              <View style={styles.minaAvatarLarge}>
                <Image
                  source={require('../../assets/images/mina-avatar.png')}
                  style={{ width: 52, height: 52, borderRadius: 26 }}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.heroGreeting}>Hi, I'm Mina 🌿</Text>
              <Text style={styles.heroSub}>
                Your EcoSmart helper. Ask me about requests, prices, payments or getting verified.
              </Text>
            </View>

            <Text style={styles.tryAskingLabel}>Try asking</Text>

            <TouchableOpacity
              style={styles.suggestionRow}
              onPress={() => setFrame('ans_set_aside')}
            >
              <Text style={styles.suggestionText}>How does money set aside work?</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.suggestionRow}
              onPress={() => setFrame('ans_prices')}
            >
              <Text style={styles.suggestionText}>How should I set my prices?</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.suggestionRow}
              onPress={() => router.push('/recycler/verification' as any)}
            >
              <Text style={styles.suggestionText}>How do I get verified?</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.suggestionRow}
              onPress={() => setFrame('human_handoff')}
            >
              <Text style={styles.suggestionText}>Talk to support</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        )}

        {/* ================= FRAME 2: FROM CASH OUT ================= */}
        {frame === 'from_cash_out' && (
          <View style={styles.contentWrap}>
            <TouchableOpacity style={styles.langPill} onPress={cycleLanguage}>
              <Globe size={13} color="#374151" />
              <Text style={styles.langPillText}>Mina speaks: {spokenLang} · Change</Text>
            </TouchableOpacity>

            <View style={styles.contextTag}>
              <Text style={styles.contextTagText}>↑ From: Cash out</Text>
            </View>

            <View style={styles.minaReplyRow}>
              <View style={styles.minaAvatarTiny}>
                <Image
                  source={require('../../assets/images/mina-avatar.png')}
                  style={{ width: 26, height: 26, borderRadius: 13 }}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.minaBubble}>
                <Text style={styles.minaBubbleText}>
                  Need help with your cash out? I can help with these:
                </Text>
              </View>
            </View>

            <Text style={styles.tryAskingLabel}>Try asking</Text>

            <TouchableOpacity
              style={styles.suggestionRow}
              onPress={() => setFrame('human_handoff')}
            >
              <Text style={styles.suggestionText}>Why hasn't my money arrived?</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.suggestionRow}
              onPress={() => router.push('/recycler/profile' as any)}
            >
              <Text style={styles.suggestionText}>Can I change my payout account?</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.suggestionRow}
              onPress={() => setFrame('start')}
            >
              <Text style={styles.suggestionText}>Ask something else</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        )}

        {/* ================= FRAME 3: ANSWER — MONEY SET ASIDE ================= */}
        {frame === 'ans_set_aside' && (
          <View style={styles.contentWrap}>
            <View style={styles.userBubbleRight}>
              <Text style={styles.userBubbleText}>How does money set aside work?</Text>
            </View>

            <View style={styles.minaReplyRow}>
              <View style={styles.minaAvatarTiny}>
                <Image
                  source={require('../../assets/images/mina-avatar.png')}
                  style={{ width: 26, height: 26, borderRadius: 13 }}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.minaAnswerCard}>
                <Text style={styles.minaAnswerPara}>
                  When you accept a request, its money moves from your wallet into "set aside". The
                  household sees it's ready.
                </Text>
                <Text style={[styles.minaAnswerPara, { marginTop: 10 }]}>
                  At pickup you pay for the real weight. Anything left comes back to your wallet
                  straight away.
                </Text>
                <TouchableOpacity
                  style={styles.outlineCtaBtn}
                  onPress={() => router.push('/recycler/wallet' as any)}
                >
                  <Text style={styles.outlineCtaBtnText}>Top up my wallet</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.tryAskingLabel}>Ask next</Text>
            <TouchableOpacity
              style={styles.suggestionRow}
              onPress={() => router.push('/recycler/pickup-what-ifs' as any)}
            >
              <Text style={styles.suggestionText}>What if the household isn't there?</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.suggestionRow}
              onPress={() => setFrame('human_handoff')}
            >
              <Text style={styles.suggestionText}>Talk to support</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        )}

        {/* ================= FRAME 4: ANSWER — SET MY PRICES ================= */}
        {frame === 'ans_prices' && (
          <View style={styles.contentWrap}>
            <View style={styles.userBubbleRight}>
              <Text style={styles.userBubbleText}>How should I set my prices?</Text>
            </View>

            <View style={styles.minaReplyRow}>
              <View style={styles.minaAvatarTiny}>
                <Image
                  source={require('../../assets/images/mina-avatar.png')}
                  style={{ width: 26, height: 26, borderRadius: 13 }}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.minaAnswerCard}>
                <Text style={styles.minaAnswerPara}>
                  Recyclers in Kubwa pay <Text style={{ fontWeight: '800' }}>₦80–₦150</Text> per kg
                  for plastic bottles. Most pay about <Text style={{ fontWeight: '800' }}>₦118</Text>.
                </Text>
                <Text style={[styles.minaAnswerPara, { marginTop: 10 }]}>
                  Pricing near the top of the range gets you more requests. You can change prices
                  any time in Listings.
                </Text>
                <TouchableOpacity
                  style={styles.solidCtaBtn}
                  onPress={() => router.push('/recycler/listings' as any)}
                >
                  <Text style={styles.solidCtaBtnText}>Edit my prices</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.tryAskingLabel}>Ask next</Text>
            <TouchableOpacity
              style={styles.suggestionRow}
              onPress={() => setFrame('ans_set_aside')}
            >
              <Text style={styles.suggestionText}>How does money set aside work?</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.suggestionRow}
              onPress={() => setFrame('human_handoff')}
            >
              <Text style={styles.suggestionText}>Talk to support</Text>
              <ChevronRight size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        )}

        {/* ================= FRAME 5: VOICE LISTENING ================= */}
        {frame === 'voice' && (
          <View style={[styles.centerHero, { paddingVertical: 100 }]}>
            <View style={styles.minaAvatarLarge}>
              <Image
                source={require('../../assets/images/mina-avatar.png')}
                style={{ width: 52, height: 52, borderRadius: 26 }}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.heroGreeting}>I'm listening...</Text>
            <Text style={styles.heroSub}>
              Speak in English, Pidgin, Hausa, Yoruba or Igbo.
            </Text>
          </View>
        )}

        {/* ================= FRAME 6: VOICE TRANSCRIBED + TYPING ================= */}
        {frame === 'voice_typing' && (
          <View style={styles.contentWrap}>
            <View style={styles.userBubbleRight}>
              <Text style={styles.userBubbleText}>How does money set aside work?</Text>
              <Text style={styles.voiceSubTag}>🎤 Voice · English</Text>
            </View>

            <View style={styles.minaReplyRow}>
              <View style={styles.minaAvatarTiny}>
                <Image
                  source={require('../../assets/images/mina-avatar.png')}
                  style={{ width: 26, height: 26, borderRadius: 13 }}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.typingPill}>
                <Text style={styles.typingDots}>• • •</Text>
                <Text style={styles.typingLabel}>Mina is typing...</Text>
              </View>
            </View>
          </View>
        )}

        {/* ================= FRAME 7: TEXT TYPING ================= */}
        {frame === 'typing' && (
          <View style={styles.contentWrap}>
            <View style={styles.userBubbleRight}>
              <Text style={styles.userBubbleText}>Why hasn't my money arrived?</Text>
            </View>

            <View style={styles.minaReplyRow}>
              <View style={styles.minaAvatarTiny}>
                <Image
                  source={require('../../assets/images/mina-avatar.png')}
                  style={{ width: 26, height: 26, borderRadius: 13 }}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.typingPill}>
                <Text style={styles.typingDots}>• • •</Text>
                <Text style={styles.typingLabel}>Mina is typing...</Text>
              </View>
            </View>
          </View>
        )}

        {/* ================= FRAME 8: CONNECT TO A PERSON ================= */}
        {frame === 'human_handoff' && (
          <View style={styles.contentWrap}>
            <View style={styles.userBubbleRight}>
              <Text style={styles.userBubbleText}>Why hasn't my money arrived?</Text>
            </View>

            <View style={styles.minaReplyRow}>
              <View style={styles.minaAvatarTiny}>
                <Image
                  source={require('../../assets/images/mina-avatar.png')}
                  style={{ width: 26, height: 26, borderRadius: 13 }}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.minaAnswerCard}>
                <Text style={styles.minaAnswerPara}>
                  Most cash outs arrive in a few minutes. Some banks take up to 24 hours.
                </Text>
                <Text style={[styles.minaAnswerPara, { marginTop: 10 }]}>
                  Your <Text style={{ fontWeight: '800' }}>₦1,550</Text> cash out to OPay ending
                  6789 was sent today and hasn't arrived yet. Let me connect you to a person to
                  check it.
                </Text>
                <TouchableOpacity
                  style={styles.solidCtaBtn}
                  onPress={() => router.push('/recycler/chat' as any)}
                >
                  <Text style={styles.solidCtaBtnText}>Talk to a person</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.handoffNoteCard}>
              <Check size={14} color="#2E7D32" />
              <Text style={styles.handoffNoteText}>
                Your question goes with you, so you won't need to repeat it.
              </Text>
            </View>
          </View>
        )}

        {/* ================= FRAME 9: OFFLINE ================= */}
        {frame === 'offline' && (
          <View style={styles.contentWrap}>
            <View style={styles.offlineBanner}>
              <WifiOff size={15} color="#4B5563" />
              <Text style={styles.offlineBannerText}>
                You're offline. Mina will answer when you're back.
              </Text>
            </View>

            <View style={styles.userBubbleRight}>
              <Text style={styles.userBubbleText}>Is my set-aside money safe?</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Clock size={11} color="#6B7280" />
                <Text style={styles.voiceSubTag}>Waiting to send</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.tryAgainPillBtn}
              onPress={() => setFrame('ans_set_aside')}
            >
              <Text style={styles.tryAgainPillText}>Try again</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Input / Voice Recording Bar */}
      <View style={styles.bottomComposerWrap}>
        {frame === 'voice' ? (
          <>
            <View style={styles.voiceRecordingBar}>
              <View style={styles.redDot} />
              <Text style={styles.voiceTimeText}>0:03</Text>
              <Text style={styles.voiceWaveBars}>| | ||||| ||| | ||</Text>
              <TouchableOpacity
                style={styles.stopVoiceBtn}
                onPress={() => setFrame('voice_typing')}
              >
                <Square size={14} color="#FFFFFF" fill="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.composerDisclaimer}>
              Tap the green button when you finish speaking.
            </Text>
          </>
        ) : (
          <>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="Ask Mina anything..."
                placeholderTextColor="#9CA3AF"
                value={inputText}
                onChangeText={setInputText}
              />
              <TouchableOpacity
                style={styles.micIconBtn}
                onPress={() => setFrame('voice')}
              >
                <Mic size={18} color="#2E7D32" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendCircleBtn}
                onPress={() => setFrame('ans_set_aside')}
              >
                <Send size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.composerDisclaimer}>
              Mina is AI and can make mistakes. For money problems, talk to a person.
            </Text>
          </>
        )}
      </View>

      {/* 5-Tab Bottom Navigation */}
      <RecyclerBottomNavBar activeTab="Profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFCF8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  bellBtn: {
    padding: 6,
  },
  demoPillsContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 8,
  },
  demoPillsScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  demoPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  demoPillActive: {
    backgroundColor: '#2E7D32',
  },
  demoPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  demoPillTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  contentWrap: {
    gap: 12,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  langPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  centerHero: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  minaAvatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroGreeting: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  heroSub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
  },
  tryAskingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 8,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  suggestionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  contextTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  contextTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  minaReplyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  minaAvatarTiny: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  minaBubble: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  minaBubbleText: {
    fontSize: 14,
    color: '#111827',
  },
  userBubbleRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: '82%',
  },
  userBubbleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  voiceSubTag: {
    fontSize: 11,
    color: '#4B5563',
    marginTop: 2,
  },
  minaAnswerCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
  },
  minaAnswerPara: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  outlineCtaBtn: {
    marginTop: 14,
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    borderRadius: 22,
    paddingVertical: 11,
    alignItems: 'center',
  },
  outlineCtaBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
  },
  solidCtaBtn: {
    marginTop: 14,
    backgroundColor: '#2E7D32',
    borderRadius: 22,
    paddingVertical: 12,
    alignItems: 'center',
  },
  solidCtaBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  typingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  typingDots: {
    fontSize: 14,
    fontWeight: '900',
    color: '#9CA3AF',
  },
  typingLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  handoffNoteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  handoffNoteText: {
    fontSize: 12,
    color: '#4B5563',
    flex: 1,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 12,
  },
  offlineBannerText: {
    fontSize: 12,
    color: '#374151',
    flex: 1,
  },
  tryAgainPillBtn: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#2E7D32',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
  },
  tryAgainPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  bottomComposerWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: '#FAFCF8',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 5,
    gap: 6,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    paddingVertical: 6,
  },
  micIconBtn: {
    padding: 6,
  },
  sendCircleBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceRecordingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    paddingLeft: 14,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 10,
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#DC2626',
  },
  voiceTimeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  voiceWaveBars: {
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    color: '#2E7D32',
    letterSpacing: 1,
  },
  stopVoiceBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerDisclaimer: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 6,
  },
});
