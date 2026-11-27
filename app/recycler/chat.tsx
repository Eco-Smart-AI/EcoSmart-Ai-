import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Phone,
  Camera,
  Mic,
  Send,
  Lock,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';

export default function RecyclerChatScreen() {
  const router = useRouter();
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'stamp1',
      type: 'stamp',
      text: 'Pickup accepted · ₦450 set aside · 10:05',
    },
    {
      id: 'm1',
      sender: 'recycler',
      text: "Good morning. I'm coming at 10, is that okay?",
      time: '10:06',
    },
    {
      id: 'm2',
      sender: 'musa',
      text: "Yes, I'm at home. Blue gate opposite the pharmacy.",
      time: '10:07',
    },
    {
      id: 'stamp2',
      type: 'stamp',
      text: "You're on your way · 10:08",
    },
    {
      id: 'm3',
      sender: 'musa',
      text: "I'm at the blue gate",
      time: '10:12',
    },
  ]);

  const quickReplies = ["I'm outside", '5 minutes away', 'Please come out'];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'recycler',
        text: text.trim(),
        time: 'Just now',
      },
    ]);
    if (!textToSend) setInputText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        showBack={true}
        rightAction="bell"
        onPressBell={() => router.push('/recycler/notifications' as any)}
      />

      {/* Sub-Header below green wave */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/recycler/requests' as any)}
          style={styles.backBtn}
        >
          <ArrowLeft size={22} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>Musa A.</Text>
          <Text style={styles.headerSub}>
            PET · ~3 kg · Today 10:00–11:00 · ₦450 set aside
          </Text>
        </View>
        <TouchableOpacity
          style={styles.callIconBtn}
          onPress={() => router.push('/recycler/call' as any)}
        >
          <Phone size={18} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.chatScroll} showsVerticalScrollIndicator={false}>
          {messages.map((item) => {
            if (item.type === 'stamp') {
              return (
                <View key={item.id} style={styles.stampWrap}>
                  <Text style={styles.stampText}>{item.text}</Text>
                </View>
              );
            }

            const isRecycler = item.sender === 'recycler';
            return (
              <View
                key={item.id}
                style={[
                  styles.msgRow,
                  isRecycler ? styles.msgRowRight : styles.msgRowLeft,
                ]}
              >
                <View
                  style={[
                    styles.msgBubble,
                    isRecycler ? styles.bubbleRecycler : styles.bubbleHousehold,
                  ]}
                >
                  <Text
                    style={[
                      styles.msgText,
                      isRecycler ? styles.msgTextRecycler : styles.msgTextHousehold,
                    ]}
                  >
                    {item.text}
                  </Text>
                  <Text
                    style={[
                      styles.msgTime,
                      isRecycler ? styles.msgTimeRecycler : styles.msgTimeHousehold,
                    ]}
                  >
                    {item.time}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Quick Replies Bar */}
        <View style={styles.quickRepliesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRepliesScroll}>
            {quickReplies.map((reply, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.quickReplyChip}
                onPress={() => handleSend(reply)}
              >
                <Text style={styles.quickReplyText}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Bottom Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachBtn}>
            <Camera size={22} color="#6B7280" />
          </TouchableOpacity>

          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message Musa"
            placeholderTextColor="#9CA3AF"
          />

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={() => handleSend()}
          >
            {inputText.trim() ? (
              <Send size={18} color="#FFFFFF" />
            ) : (
              <Mic size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        {/* Footnote */}
        <View style={styles.footnoteRow}>
          <Lock size={11} color="#9CA3AF" />
          <Text style={styles.footnoteText}>
            Calls and messages stay in EcoSmart · numbers are private
          </Text>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backBtn: {
    padding: 6,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  headerSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  callIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatScroll: {
    padding: 16,
    gap: 12,
  },
  stampWrap: {
    alignItems: 'center',
    marginVertical: 6,
  },
  stampText: {
    fontSize: 11,
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  msgRow: {
    flexDirection: 'row',
  },
  msgRowLeft: {
    justifyContent: 'flex-start',
  },
  msgRowRight: {
    justifyContent: 'flex-end',
  },
  msgBubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleRecycler: {
    backgroundColor: '#E8F5E9',
    borderBottomRightRadius: 4,
  },
  bubbleHousehold: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  msgTextRecycler: {
    color: '#111827',
  },
  msgTextHousehold: {
    color: '#111827',
  },
  msgTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  msgTimeRecycler: {
    color: '#166534',
  },
  msgTimeHousehold: {
    color: '#9CA3AF',
  },
  quickRepliesContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  quickRepliesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickReplyChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickReplyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 10,
  },
  attachBtn: {
    padding: 6,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: '#111827',
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footnoteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#FFFFFF',
    paddingBottom: 8,
  },
  footnoteText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
});
