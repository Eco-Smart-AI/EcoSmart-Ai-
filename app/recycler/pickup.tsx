import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  Check,
  Phone,
  MessageSquare,
  Navigation,
  MapPin,
  Camera,
  RefreshCw,
  Clock,
  AlertTriangle,
  Wallet,
  Star,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import RecyclerBottomNavBar from '../../components/common/RecyclerBottomNavBar';

type PickupStage =
  | 'new_request'
  | 'insufficient_funds'
  | 'accepted'
  | 'on_the_way'
  | 'arrived'
  | 'weigh'
  | 'checking'
  | 'enter_code'
  | 'confirm_pay'
  | 'paid_receipt';

export default function RecyclerPickupScreen() {
  const router = useRouter();

  // Active Stage
  const [stage, setStage] = useState<PickupStage>('new_request');

  // Input states
  const [scaleWeight, setScaleWeight] = useState('3.2');
  const [code, setCode] = useState(['4', '8', '2', '7']);
  const [rating, setRating] = useState(5);
  const [topUpAmount, setTopUpAmount] = useState('250');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'ussd' | 'pos'>('bank');

  // Helper calculations
  const weightNum = parseFloat(scaleWeight) || 0;
  const ratePerKg = 120;
  const finalAmount = Math.round(weightNum * ratePerKg);
  const setAsideAmount = 450;
  const refundToWallet = Math.max(0, setAsideAmount - finalAmount);

  const stagesList: { id: PickupStage; label: string }[] = [
    { id: 'new_request', label: '1. New Request' },
    { id: 'insufficient_funds', label: '2. Top Up' },
    { id: 'accepted', label: '3. Accepted' },
    { id: 'on_the_way', label: '4. On Way' },
    { id: 'arrived', label: '5. Arrived' },
    { id: 'weigh', label: '6. Weigh' },
    { id: 'checking', label: '7. Checking' },
    { id: 'enter_code', label: '8. Enter Code' },
    { id: 'confirm_pay', label: '9. Confirm Pay' },
    { id: 'paid_receipt', label: '10. Receipt' },
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
        <TouchableOpacity
          onPress={() => router.push('/recycler/requests' as any)}
          style={styles.headerBackBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color="#1F2937" />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>
            {stage === 'new_request'
              ? 'New request'
              : stage === 'paid_receipt'
              ? 'Pickup complete'
              : 'Pickup · Musa A.'}
          </Text>
        </View>
        <Text style={styles.headerSub}>
          {stage === 'new_request' ? '5 min ago' : 'REQ-001'}
        </Text>
      </View>

      {/* Demo Stage Switcher Pill Bar */}
      <View style={styles.demoPillsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.demoPillsScroll}>
          {stagesList.map((st) => (
            <TouchableOpacity
              key={st.id}
              style={[styles.demoPill, stage === st.id && styles.demoPillActive]}
              onPress={() => setStage(st.id)}
            >
              <Text style={[styles.demoPillText, stage === st.id && styles.demoPillTextActive]}>
                {st.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Stepper (Only visible during active pickup steps) */}
      {stage !== 'new_request' && stage !== 'insufficient_funds' && (
        <View style={styles.stepperContainer}>
          {[
            { key: 'accepted', label: 'Accepted', done: true },
            { key: 'on_the_way', label: 'On the way', done: ['on_the_way', 'arrived', 'weigh', 'checking', 'enter_code', 'confirm_pay', 'paid_receipt'].includes(stage) },
            { key: 'arrived', label: 'Arrived', done: ['arrived', 'weigh', 'checking', 'enter_code', 'confirm_pay', 'paid_receipt'].includes(stage) },
            { key: 'weigh', label: 'Weighed', done: ['weigh', 'checking', 'enter_code', 'confirm_pay', 'paid_receipt'].includes(stage) },
            { key: 'paid', label: 'Paid', done: stage === 'paid_receipt' },
          ].map((step, idx) => (
            <View key={step.key} style={styles.stepItem}>
              <View style={[styles.stepDot, step.done ? styles.stepDotActive : styles.stepDotInactive]}>
                {step.done ? <Check size={10} color="#FFFFFF" /> : <View style={styles.stepInnerDot} />}
              </View>
              <Text style={[styles.stepLabel, step.done && styles.stepLabelActive]}>{step.label}</Text>
            </View>
          ))}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ================= STAGE 1: NEW REQUEST ================= */}
        {stage === 'new_request' && (
          <View style={styles.contentWrap}>
            {/* User Details */}
            <View style={styles.userCard}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>MA</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Musa A.</Text>
                <Text style={styles.userSubtitle}>Household · Kubwa · 1.2 km away</Text>
              </View>
            </View>

            {/* Material Card */}
            <View style={styles.materialCard}>
              <View style={styles.matIconWrap}>
                <Text style={styles.matIconEmoji}>📦</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.matTitle}>PET bottles · ~3 kg</Text>
                <View style={styles.aiTag}>
                  <ShieldCheck size={13} color="#2E7D32" />
                  <Text style={styles.aiTagText}>AI verified · High confidence</Text>
                </View>
              </View>
            </View>

            {/* Escrow Set Aside Card */}
            <View style={styles.priceCard}>
              <Text style={styles.priceSubLabel}>Set aside when you accept</Text>
              <Text style={styles.priceMainText}>₦450</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceDetailText}>Your rate</Text>
                <Text style={styles.priceDetailValue}>₦120 per kg</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceDetailText}>Estimate for ~3 kg</Text>
                <Text style={styles.priceDetailValue}>~₦360</Text>
              </View>
              <View style={styles.priceDivider} />
              <View style={styles.priceNoticeRow}>
                <Info size={14} color="#6B7280" />
                <Text style={styles.priceNoticeText}>
                  You pay for the real weight. Unused money comes back to you.
                </Text>
              </View>
            </View>

            {/* Logistics Timing Card */}
            <View style={styles.metaCard}>
              <View style={styles.metaRow}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.metaText}>Pickup time: <Text style={styles.metaBold}>Today, morning</Text></Text>
              </View>
              <View style={[styles.metaRow, { marginTop: 8 }]}>
                <MapPin size={16} color="#6B7280" />
                <Text style={styles.metaText}>Area: <Text style={styles.metaBold}>Kubwa, Abuja</Text></Text>
              </View>
            </View>

            <View style={styles.privacyNote}>
              <Text style={styles.privacyNoteText}>
                🔒 The full address and chat open after you accept.
              </Text>
            </View>

            {/* Actions */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setStage('accepted')}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryBtnText}>Accept · set aside ₦450</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => setStage('insufficient_funds')}
              activeOpacity={0.7}
            >
              <Text style={styles.secondaryBtnText}>Check insufficient balance flow</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.declineBtn}
              onPress={() => router.push('/recycler/requests' as any)}
              activeOpacity={0.7}
            >
              <Text style={styles.declineBtnText}>Decline request</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STAGE 2: INSUFFICIENT FUNDS MODAL / SHEET ================= */}
        {stage === 'insufficient_funds' && (
          <View style={styles.contentWrap}>
            <View style={styles.sheetBox}>
              <Text style={styles.sheetTitle}>Add ₦250 to accept</Text>
              <Text style={styles.sheetSub}>
                You have ₦200. This pickup needs ₦450 set aside.
              </Text>

              <View style={styles.holdingBanner}>
                <Clock size={15} color="#B45309" />
                <Text style={styles.holdingBannerText}>
                  We're holding this request for you · <Text style={{ fontWeight: '700' }}>9:42 left</Text>
                </Text>
              </View>

              {/* Amount Quick Pills */}
              <View style={styles.pillsRow}>
                {['250', '1,000', '5,000'].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={[styles.amtPill, topUpAmount === amt && styles.amtPillActive]}
                    onPress={() => setTopUpAmount(amt)}
                  >
                    <Text style={[styles.amtPillText, topUpAmount === amt && styles.amtPillTextActive]}>
                      {topUpAmount === amt ? '✓ ' : ''}₦{amt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionHeaderLabel}>Pay with</Text>

              {/* Payment Option: Bank */}
              <TouchableOpacity
                style={[styles.payOption, paymentMethod === 'bank' && styles.payOptionActive]}
                onPress={() => setPaymentMethod('bank')}
              >
                <View style={styles.payIconCircle}>
                  <Wallet size={18} color="#2E7D32" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.payOptionTitle}>Bank transfer</Text>
                  <Text style={styles.payOptionSub}>Instant · to your EcoSmart account number</Text>
                </View>
                <View style={[styles.radioCircle, paymentMethod === 'bank' && styles.radioCircleSelected]}>
                  {paymentMethod === 'bank' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              {/* Payment Option: USSD */}
              <TouchableOpacity
                style={[styles.payOption, paymentMethod === 'ussd' && styles.payOptionActive]}
                onPress={() => setPaymentMethod('ussd')}
              >
                <View style={styles.payIconCircle}>
                  <Text style={{ fontWeight: '700', color: '#4B5563' }}>#</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.payOptionTitle}>USSD</Text>
                  <Text style={styles.payOptionSub}>Dial a code from your bank</Text>
                </View>
                <View style={[styles.radioCircle, paymentMethod === 'ussd' && styles.radioCircleSelected]}>
                  {paymentMethod === 'ussd' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              {/* Payment Option: POS Cash */}
              <TouchableOpacity
                style={[styles.payOption, paymentMethod === 'pos' && styles.payOptionActive]}
                onPress={() => setPaymentMethod('pos')}
              >
                <View style={styles.payIconCircle}>
                  <Text style={{ fontWeight: '700', color: '#4B5563' }}>₦</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.payOptionTitle}>Cash at a POS agent</Text>
                  <Text style={styles.payOptionSub}>Give cash, agent tops you up</Text>
                </View>
                <View style={[styles.radioCircle, paymentMethod === 'pos' && styles.radioCircleSelected]}>
                  {paymentMethod === 'pos' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryBtn, { marginTop: 20 }]}
                onPress={() => setStage('accepted')}
              >
                <Text style={styles.primaryBtnText}>Top up ₦{topUpAmount} and accept</Text>
              </TouchableOpacity>

              <Text style={styles.autoAcceptNote}>
                Once the money arrives, the request is accepted automatically.
              </Text>
            </View>
          </View>
        )}

        {/* ================= STAGE 3: ACCEPTED ================= */}
        {stage === 'accepted' && (
          <View style={styles.contentWrap}>
            {/* Green Notification Banner */}
            <View style={styles.greenBanner}>
              <Check size={18} color="#2E7D32" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.greenBannerTitle}>Accepted · ₦450 set aside</Text>
                <Text style={styles.greenBannerSub}>Musa can see the money is ready.</Text>
              </View>
            </View>

            {/* Household Contact Card */}
            <View style={styles.contactCard}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>MA</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.userName}>Musa A.</Text>
                <Text style={styles.userSubtitle}>Household · Kubwa</Text>
              </View>
              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => router.push('/recycler/chat' as any)}
              >
                <MessageSquare size={18} color="#2E7D32" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionIconBtn, { marginLeft: 8 }]}
                onPress={() => router.push('/recycler/call' as any)}
              >
                <Phone size={18} color="#2E7D32" />
              </TouchableOpacity>
            </View>

            {/* Address & Landmark Card */}
            <View style={styles.addressCard}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <MapPin size={20} color="#2E7D32" style={{ marginTop: 2 }} />
                <View style={{ marginLeft: 10, flex: 1 }}>
                  <Text style={styles.addressTitle}>12 Byazhin Road, Kubwa</Text>
                  <Text style={styles.landmarkText}>Landmark: opposite the pharmacy, blue gate</Text>
                </View>
              </View>

              {/* Map Preview Area */}
              <View style={styles.mapMockWrap}>
                <View style={styles.mapRoadLine} />
                <View style={styles.mapPinBadge}>
                  <MapPin size={16} color="#FFFFFF" />
                  <Text style={styles.mapPinText}>1.2 km · about 8 min</Text>
                </View>
              </View>

              <View style={styles.pickupTimeBox}>
                <Clock size={16} color="#4B5563" />
                <Text style={styles.pickupTimeText}>Pickup time: <Text style={{ fontWeight: '700' }}>Today, 10:00–11:00</Text></Text>
              </View>
            </View>

            {/* CTA Buttons */}
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setStage('on_the_way')}
            >
              <Text style={styles.primaryBtnText}>I'm on my way</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.outlineBtn}>
              <Navigation size={18} color="#2E7D32" />
              <Text style={styles.outlineBtnText}>Get directions</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STAGE 4: ON THE WAY ================= */}
        {stage === 'on_the_way' && (
          <View style={styles.contentWrap}>
            <View style={styles.wayIconWrap}>
              <Navigation size={32} color="#2E7D32" />
            </View>
            <Text style={styles.wayTitle}>You're on your way</Text>
            <Text style={styles.waySub}>
              Musa has been told. Tap "I've arrived" when you get there.
            </Text>

            {/* Distance Preview */}
            <View style={styles.distanceBadge}>
              <MapPin size={18} color="#2E7D32" />
              <Text style={styles.distanceText}>12 Byazhin Road · 0.6 km left</Text>
            </View>

            {/* Contact Musa */}
            <View style={[styles.contactCard, { marginTop: 16 }]}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>MA</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.userName}>Musa A.</Text>
                <Text style={styles.userSubtitle}>Household · Kubwa</Text>
              </View>
              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => router.push('/recycler/chat' as any)}
              >
                <MessageSquare size={18} color="#2E7D32" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionIconBtn, { marginLeft: 8 }]}
                onPress={() => router.push('/recycler/call' as any)}
              >
                <Phone size={18} color="#2E7D32" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 30 }]}
              onPress={() => setStage('arrived')}
            >
              <Text style={styles.primaryBtnText}>I've arrived</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.textLinkBtn}
              onPress={() => router.push('/recycler/pickup-what-ifs' as any)}
            >
              <Text style={styles.textLinkDanger}>Can't make it? Cancel pickup</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STAGE 5: ARRIVED ================= */}
        {stage === 'arrived' && (
          <View style={styles.contentWrap}>
            <Text style={styles.arrivedHeading}>You've arrived</Text>
            <Text style={styles.arrivedSub}>
              Weigh the waste in front of Musa and take a photo of the scale.
            </Text>

            {/* Checklist Guide */}
            <View style={styles.guideCard}>
              <View style={styles.guideItem}>
                <View style={styles.guideNumBadge}>
                  <Text style={styles.guideNumText}>1</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.guideItemTitle}>Weigh the bottles</Text>
                  <Text style={styles.guideItemSub}>Use your scale, in front of Musa</Text>
                </View>
                <View style={styles.guideRoleBadge}>
                  <Text style={styles.guideRoleText}>You</Text>
                </View>
              </View>

              <View style={styles.guideItem}>
                <View style={styles.guideNumBadge}>
                  <Text style={styles.guideNumText}>2</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.guideItemTitle}>Photo the scale</Text>
                  <Text style={styles.guideItemSub}>Make sure the number is easy to read</Text>
                </View>
                <View style={styles.guideRoleBadge}>
                  <Text style={styles.guideRoleText}>You</Text>
                </View>
              </View>

              <View style={styles.guideItem}>
                <View style={styles.guideNumBadge}>
                  <Text style={styles.guideNumText}>3</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.guideItemTitle}>Musa accepts the amount</Text>
                  <Text style={styles.guideItemSub}>He checks it on his phone</Text>
                </View>
                <View style={[styles.guideRoleBadge, { backgroundColor: '#F3F4F6' }]}>
                  <Text style={[styles.guideRoleText, { color: '#4B5563' }]}>Musa</Text>
                </View>
              </View>

              <View style={styles.guideItem}>
                <View style={styles.guideNumBadge}>
                  <Text style={styles.guideNumText}>4</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.guideItemTitle}>Enter Musa's code</Text>
                  <Text style={styles.guideItemSub}>This pays him. Then take the bottles.</Text>
                </View>
                <View style={styles.guideRoleBadge}>
                  <Text style={styles.guideRoleText}>You</Text>
                </View>
              </View>
            </View>

            {/* Contact Musa */}
            <View style={styles.contactCard}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>MA</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.userName}>Musa A.</Text>
                <Text style={styles.userSubtitle}>Household · Kubwa</Text>
              </View>
              <TouchableOpacity
                style={styles.actionIconBtn}
                onPress={() => router.push('/recycler/chat' as any)}
              >
                <MessageSquare size={18} color="#2E7D32" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionIconBtn, { marginLeft: 8 }]}
                onPress={() => router.push('/recycler/call' as any)}
              >
                <Phone size={18} color="#2E7D32" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 24 }]}
              onPress={() => setStage('weigh')}
            >
              <Text style={styles.primaryBtnText}>Weigh the waste</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.textLinkBtn}
              onPress={() => router.push('/recycler/pickup-what-ifs' as any)}
            >
              <Text style={styles.textLinkDanger}>Household not here?</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STAGE 6: WEIGH THE WASTE ================= */}
        {stage === 'weigh' && (
          <View style={styles.contentWrap}>
            <Text style={styles.arrivedHeading}>Weigh the waste</Text>
            <Text style={styles.arrivedSub}>
              Enter what the scale shows and take a photo of it.
            </Text>

            {/* Photo Preview Container */}
            <View style={styles.scalePhotoBox}>
              <View style={styles.scalePhotoCheck}>
                <Check size={18} color="#2E7D32" />
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.scalePhotoTitle}>Scale photo added</Text>
                  <Text style={styles.scalePhotoSub}>Reading is clear</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.retakeBtn}>
                <RefreshCw size={14} color="#2E7D32" />
                <Text style={styles.retakeBtnText}>Retake</Text>
              </TouchableOpacity>
            </View>

            {/* Weight Input */}
            <Text style={styles.inputFieldLabel}>Weight on the scale</Text>
            <View style={styles.weightInputRow}>
              <TextInput
                style={styles.weightTextInput}
                keyboardType="numeric"
                value={scaleWeight}
                onChangeText={setScaleWeight}
                placeholder="0.0"
              />
              <Text style={styles.weightUnit}>kg</Text>
            </View>
            <Text style={styles.inputHelperText}>Type the number the scale shows</Text>

            {/* Amount Calculation Box */}
            <View style={styles.calcBox}>
              <Text style={styles.calcLabel}>Final amount</Text>
              <Text style={styles.calcValue}>₦{finalAmount}</Text>

              <View style={styles.calcDetailRow}>
                <View>
                  <Text style={styles.calcDetailHeader}>Weight</Text>
                  <Text style={styles.calcDetailBody}>{scaleWeight} kg</Text>
                </View>
                <View>
                  <Text style={styles.calcDetailHeader}>Agreed rate</Text>
                  <Text style={styles.calcDetailBody}>₦{ratePerKg} per kg</Text>
                </View>
              </View>

              <View style={styles.priceDivider} />
              <View style={styles.calcRefundRow}>
                <Info size={14} color="#6B7280" />
                <Text style={styles.calcRefundText}>
                  From ₦450 set aside. ₦{refundToWallet} comes back to you.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.rateProposalLink}
              onPress={() => router.push('/recycler/pickup-what-ifs' as any)}
            >
              <Text style={styles.rateProposalLinkText}>
                ✏️ Need a different rate? Propose a new rate
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 20 }]}
              onPress={() => setStage('checking')}
            >
              <Text style={styles.primaryBtnText}>Send to Musa to check</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STAGE 7: MUSA IS CHECKING ================= */}
        {stage === 'checking' && (
          <View style={styles.contentWrap}>
            <View style={styles.checkingClockWrap}>
              <Clock size={36} color="#D97706" />
            </View>
            <Text style={styles.checkingTitle}>Musa is checking the amount</Text>
            <Text style={styles.checkingSub}>
              He sees your scale photo and ₦{finalAmount} on his phone. Ask him to tap Accept.
            </Text>

            <View style={styles.summaryCard}>
              <Text style={styles.summarySmallLabel}>Final amount</Text>
              <Text style={styles.summaryBigAmount}>₦{finalAmount}</Text>

              <View style={styles.calcDetailRow}>
                <View>
                  <Text style={styles.calcDetailHeader}>Weight</Text>
                  <Text style={styles.calcDetailBody}>{scaleWeight} kg</Text>
                </View>
                <View>
                  <Text style={styles.calcDetailHeader}>Agreed rate</Text>
                  <Text style={styles.calcDetailBody}>₦{ratePerKg} per kg</Text>
                </View>
              </View>
              <View style={styles.priceDivider} />
              <Text style={styles.calcRefundText}>
                From ₦450 set aside. ₦{refundToWallet} comes back to you.
              </Text>
            </View>

            <View style={styles.warningYellowBox}>
              <AlertTriangle size={18} color="#B45309" />
              <Text style={styles.warningYellowText}>
                Don't take the waste until Musa accepts and gives you his code.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 24 }]}
              onPress={() => setStage('enter_code')}
            >
              <Text style={styles.primaryBtnText}>Enter Musa's code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.textLinkBtn}
              onPress={() => router.push('/recycler/pickup-what-ifs' as any)}
            >
              <Text style={styles.textLinkDanger}>Something's wrong</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STAGE 8: ENTER MUSA'S CODE ================= */}
        {stage === 'enter_code' && (
          <View style={styles.contentWrap}>
            <View style={styles.greenBanner}>
              <Check size={18} color="#2E7D32" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.greenBannerTitle}>Musa accepted ₦{finalAmount}</Text>
                <Text style={styles.greenBannerSub}>Ask him for his 4-digit code.</Text>
              </View>
            </View>

            <Text style={[styles.arrivedHeading, { marginTop: 20 }]}>Enter Musa's code</Text>
            <Text style={styles.arrivedSub}>Only take the waste once the code is entered.</Text>

            {/* 4 Digit OTP Code Blocks */}
            <View style={styles.codeRow}>
              {code.map((digit, i) => (
                <View key={i} style={styles.codeBox}>
                  <Text style={styles.codeDigit}>{digit}</Text>
                </View>
              ))}
            </View>

            <View style={styles.offlineTipRow}>
              <Info size={14} color="#6B7280" />
              <Text style={styles.offlineTipText}>
                No network? Enter the code anyway. We'll send it as soon as you're back online.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 32 }]}
              onPress={() => setStage('confirm_pay')}
            >
              <Text style={styles.primaryBtnText}>Release ₦{finalAmount} to Musa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.textLinkBtn}
              onPress={() => router.push('/recycler/pickup-what-ifs' as any)}
            >
              <Text style={styles.textLinkDanger}>Something's wrong</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= STAGE 9: CONFIRMATION MODAL ================= */}
        {stage === 'confirm_pay' && (
          <View style={styles.contentWrap}>
            <View style={styles.modalSimBox}>
              <View style={styles.modalIconWrap}>
                <Wallet size={28} color="#2E7D32" />
              </View>
              <Text style={styles.modalTitle}>Release ₦{finalAmount} to Musa?</Text>

              <View style={styles.modalBreakdown}>
                <View style={styles.modalRow}>
                  <Text style={styles.modalRowLeft}>{scaleWeight} kg PET × ₦{ratePerKg}/kg</Text>
                  <Text style={styles.modalRowRight}>₦{finalAmount}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalRowLeft}>Returns to your wallet</Text>
                  <Text style={styles.modalRowRight}>₦{refundToWallet}</Text>
                </View>
              </View>

              <Text style={styles.modalUndone}>This can't be undone.</Text>

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => setStage('paid_receipt')}
              >
                <Text style={styles.primaryBtnText}>Confirm and pay</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryBtn}
                onPress={() => setStage('enter_code')}
              >
                <Text style={styles.secondaryBtnText}>Go back</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ================= STAGE 10: PAID & RECEIPT ================= */}
        {stage === 'paid_receipt' && (
          <View style={styles.contentWrap}>
            <View style={styles.receiptSuccessCircle}>
              <Check size={36} color="#2E7D32" />
            </View>
            <Text style={styles.receiptTitle}>₦{finalAmount} paid to Musa</Text>
            <Text style={styles.receiptSub}>
              Pickup complete · {scaleWeight} kg PET · Today, 10:24
            </Text>

            {/* Wallet summary card */}
            <View style={styles.receiptWalletBox}>
              <View style={styles.walletStatRow}>
                <View>
                  <Text style={styles.walletStatLabel}>Returned to you</Text>
                  <Text style={styles.walletStatGreen}>+₦{refundToWallet}</Text>
                </View>
                <View>
                  <Text style={styles.walletStatLabel}>Wallet now</Text>
                  <Text style={styles.walletStatBody}>₦{refundToWallet + 200}</Text>
                </View>
              </View>
              <View style={styles.priceDivider} />
              <Text style={styles.walletExplainText}>
                From ₦450 set aside: ₦{finalAmount} to Musa, ₦{refundToWallet} back to you.
              </Text>
            </View>

            {/* 5-star rating */}
            <View style={styles.reviewBox}>
              <Text style={styles.reviewPrompt}>How was the pickup with Musa?</Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((starIdx) => (
                  <TouchableOpacity
                    key={starIdx}
                    onPress={() => setRating(starIdx)}
                    style={{ padding: 4 }}
                  >
                    <Star
                      size={28}
                      color={starIdx <= rating ? '#EAB308' : '#D1D5DB'}
                      fill={starIdx <= rating ? '#EAB308' : 'none'}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 24 }]}
              onPress={() => router.push('/recycler/requests' as any)}
            >
              <Text style={styles.primaryBtnText}>Back to requests</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Recycler 5-tab Bottom Navigation */}
      <RecyclerBottomNavBar activeTab="Requests" />
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
  headerBackBtn: {
    padding: 6,
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  headerSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  bellBtn: {
    padding: 6,
    position: 'relative',
  },
  bellDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    position: 'absolute',
    top: 6,
    right: 6,
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
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  stepItem: {
    alignItems: 'center',
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: {
    backgroundColor: '#2E7D32',
  },
  stepDotInactive: {
    backgroundColor: '#E5E7EB',
  },
  stepInnerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#9CA3AF',
  },
  stepLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  stepLabelActive: {
    color: '#2E7D32',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  contentWrap: {
    gap: 14,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  userSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  materialCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  matIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  matIconEmoji: {
    fontSize: 20,
  },
  matTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  aiTagText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  priceSubLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceMainText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  priceDetailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  priceNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceNoticeText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  metaCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaText: {
    fontSize: 14,
    color: '#4B5563',
  },
  metaBold: {
    fontWeight: '700',
    color: '#111827',
  },
  privacyNote: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  privacyNoteText: {
    fontSize: 12,
    color: '#6B7280',
  },
  primaryBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryBtn: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 13,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  declineBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  declineBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2E7D32',
    paddingVertical: 14,
    borderRadius: 10,
  },
  outlineBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E7D32',
  },
  sheetBox: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  sheetSub: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  holdingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },
  holdingBannerText: {
    fontSize: 12,
    color: '#92400E',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  amtPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  amtPillActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  amtPillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
  amtPillTextActive: {
    color: '#2E7D32',
    fontWeight: '700',
  },
  sectionHeaderLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginTop: 18,
    marginBottom: 8,
  },
  payOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  payOptionActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#F8FDF7',
  },
  payIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  payOptionSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: '#2E7D32',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2E7D32',
  },
  autoAcceptNote: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
  },
  greenBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  greenBannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
  },
  greenBannerSub: {
    fontSize: 12,
    color: '#15803D',
    marginTop: 2,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  addressTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  landmarkText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  mapMockWrap: {
    height: 110,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  mapRoadLine: {
    position: 'absolute',
    width: '120%',
    height: 4,
    backgroundColor: '#9CA3AF',
    transform: [{ rotate: '-15deg' }],
  },
  mapPinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  mapPinText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  pickupTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  pickupTimeText: {
    fontSize: 13,
    color: '#4B5563',
  },
  wayIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 16,
  },
  wayTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginTop: 12,
  },
  waySub: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  distanceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  textLinkBtn: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  textLinkDanger: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  arrivedHeading: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  arrivedSub: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  guideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
  },
  guideItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  guideNumBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guideNumText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  guideItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  guideItemSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  guideRoleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
  },
  guideRoleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  scalePhotoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E8F5E9',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  scalePhotoCheck: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scalePhotoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
  },
  scalePhotoSub: {
    fontSize: 12,
    color: '#15803D',
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  retakeBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  inputFieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  weightInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  weightTextInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  weightUnit: {
    fontSize: 20,
    fontWeight: '700',
    color: '#6B7280',
  },
  inputHelperText: {
    fontSize: 12,
    color: '#6B7280',
  },
  calcBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  calcLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  calcValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2E7D32',
    marginTop: 2,
    marginBottom: 10,
  },
  calcDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  calcDetailHeader: {
    fontSize: 12,
    color: '#6B7280',
  },
  calcDetailBody: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginTop: 2,
  },
  calcRefundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calcRefundText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  rateProposalLink: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  rateProposalLinkText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
  },
  checkingClockWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  checkingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginTop: 12,
  },
  checkingSub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginTop: 10,
  },
  summarySmallLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  summaryBigAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
    marginBottom: 8,
  },
  warningYellowBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    padding: 14,
    borderRadius: 10,
    gap: 10,
    marginTop: 10,
  },
  warningYellowText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    flex: 1,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 16,
  },
  codeBox: {
    width: 56,
    height: 64,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2E7D32',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codeDigit: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  offlineTipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F9FAFB',
    padding: 10,
    borderRadius: 8,
  },
  offlineTipText: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  modalSimBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  modalIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  modalBreakdown: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 14,
    marginVertical: 16,
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  modalRowLeft: {
    fontSize: 13,
    color: '#6B7280',
  },
  modalRowRight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  modalUndone: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  receiptSuccessCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  receiptTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginTop: 12,
  },
  receiptSub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  receiptWalletBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginTop: 16,
  },
  walletStatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  walletStatLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  walletStatGreen: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2E7D32',
    marginTop: 2,
  },
  walletStatBody: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  walletExplainText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  reviewBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  reviewPrompt: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
});
