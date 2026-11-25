import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  Camera,
  ShieldCheck,
  Lock,
  FileText,
  Landmark,
  UserCheck,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { RecyclerBottomNavBar } from '../../components/common/RecyclerBottomNavBar';

type VerificationFrame =
  | 'home_checklist'
  | 'before_you_start'
  | 'nin_step'
  | 'selfie_step'
  | 'licence_question'
  | 'add_licence'
  | 'no_licence_saved'
  | 'cac_registration'
  | 'payout_account'
  | 'check_submit'
  | 'in_review'
  | 'verified_success'
  | 'needs_fixing'
  | 'licence_expiring'
  | 'account_paused';

export default function RecyclerVerificationScreen() {
  const router = useRouter();

  const [frame, setFrame] = useState<VerificationFrame>('before_you_start');
  const [isCacRegistered, setIsCacRegistered] = useState(false);
  const [ninValue, setNinValue] = useState('1234 567 8901');
  const [hasLicence, setHasLicence] = useState(true);
  const [issuer, setIssuer] = useState<'AEPB' | 'Area council' | 'Association' | 'Other'>('AEPB');
  const [licenceNum, setLicenceNum] = useState('AEPB/RC/2025/0412');
  const [expiryDate, setExpiryDate] = useState('31 / 12 / 2026');
  const [cacType, setCacType] = useState<'BN' | 'RC'>('BN');
  const [cacNumber, setCacNumber] = useState('BN 3456789');
  const [payoutProvider, setPayoutProvider] = useState<
    'Bank' | 'OPay' | 'PalmPay' | 'Moniepoint' | 'Business bank'
  >('OPay');
  const [accountNumber, setAccountNumber] = useState('812 345 6789');
  const [agreedTerms, setAgreedTerms] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader showBack={false} rightAction="bell" />

      {/* Top Demo State Switcher covering all 16 frames of Screens · 02 · Verification.png */}
      <View style={styles.demoBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoScroll}
        >
          <Text style={styles.demoBarLabel}>Verify 02:</Text>
          {(
            [
              { key: 'home_checklist', label: '1. Checklist' },
              { key: 'before_you_start', label: '2. Before start' },
              { key: 'nin_step', label: '3. NIN' },
              { key: 'selfie_step', label: '4. Selfie' },
              { key: 'licence_question', label: '5. Licence?' },
              { key: 'add_licence', label: '6. Add licence' },
              { key: 'no_licence_saved', label: '7. No licence' },
              { key: 'cac_registration', label: '8. CAC (Biz)' },
              { key: 'payout_account', label: '9. Payout' },
              { key: 'check_submit', label: '10. Check & submit' },
              { key: 'in_review', label: '11. In review' },
              { key: 'verified_success', label: '12. Verified!' },
              { key: 'needs_fixing', label: '13. Needs fixing' },
              { key: 'licence_expiring', label: '14. Expiring 30d' },
              { key: 'account_paused', label: '15. Paused' },
            ] as const
          ).map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.demoPill, frame === item.key && styles.demoPillActive]}
              onPress={() => setFrame(item.key)}
            >
              <Text
                style={[
                  styles.demoPillText,
                  frame === item.key && styles.demoPillTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ======================================================= */}
        {/* 1. Home Checklist Card ("Get verified to start earning")*/}
        {/* ======================================================= */}
        {frame === 'home_checklist' && (
          <View>
            <Text style={styles.pageTitle}>Hi Musa</Text>
            <Text style={styles.pageSub}>Kubwa, Abuja</Text>

            <View style={styles.whiteCard}>
              <Text style={styles.cardMainTitle}>Get verified to start earning</Text>
              <Text style={styles.cardSubHint}>About 5 minutes · 1 of 5 done</Text>

              <View style={styles.checkRow}>
                <CheckCircle2 size={18} color="#2D6A2E" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkRowTitle}>Business profile</Text>
                  <Text style={styles.checkRowSub}>Done</Text>
                </View>
              </View>

              <View style={styles.checkRow}>
                <View style={styles.emptyCircle} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkRowTitle}>National ID (NIN)</Text>
                  <Text style={styles.checkRowSub}>About 1 minute</Text>
                </View>
              </View>

              <View style={styles.checkRow}>
                <View style={styles.emptyCircle} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkRowTitle}>Selfie</Text>
                  <Text style={styles.checkRowSub}>Matches your face to your NIN</Text>
                </View>
              </View>

              <View style={styles.checkRow}>
                <View style={styles.emptyCircle} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkRowTitle}>Work licence or permit</Text>
                  <Text style={styles.checkRowSub}>Photo of your licence</Text>
                </View>
              </View>

              <View style={styles.checkRow}>
                <View style={styles.emptyCircle} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkRowTitle}>Payout account</Text>
                  <Text style={styles.checkRowSub}>Where we send your money</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.primaryGreenBtn, { marginTop: 14 }]}
                onPress={() => setFrame('before_you_start')}
              >
                <Text style={styles.primaryGreenBtnText}>Continue verification</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ======================================================= */}
        {/* 2. Before you start                                     */}
        {/* ======================================================= */}
        {frame === 'before_you_start' && (
          <View>
            <TouchableOpacity
              style={styles.backNavRow}
              onPress={() => router.back()}
            >
              <ArrowLeft size={18} color="#0F1E12" />
              <Text style={styles.backNavTitle}>Get verified</Text>
            </TouchableOpacity>

            <Text style={styles.pageTitle}>Before you start</Text>
            <Text style={styles.pageSub}>
              Have these ready. You can stop any time — we save as you go.
            </Text>

            <View style={styles.whiteCard}>
              <View style={styles.prepItemRow}>
                <View style={styles.prepIconCircle}>
                  <UserCheck size={16} color="#2D6A2E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.prepTitle}>Your NIN</Text>
                  <Text style={styles.prepSub}>
                    11 digits. Dial *346# if you don't know it.
                  </Text>
                </View>
              </View>

              <View style={styles.prepItemRow}>
                <View style={styles.prepIconCircle}>
                  <Camera size={16} color="#2D6A2E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.prepTitle}>Your face</Text>
                  <Text style={styles.prepSub}>For a quick selfie</Text>
                </View>
              </View>

              <View style={styles.prepItemRow}>
                <View style={styles.prepIconCircle}>
                  <FileText size={16} color="#2D6A2E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.prepTitle}>Your work licence or permit</Text>
                  <Text style={styles.prepSub}>
                    State permit, area council permit or association ID
                  </Text>
                </View>
              </View>

              <View style={styles.prepItemRow}>
                <View style={styles.prepIconCircle}>
                  <Landmark size={16} color="#2D6A2E" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.prepTitle}>An account for payouts</Text>
                  <Text style={styles.prepSub}>
                    Bank, OPay, PalmPay or Moniepoint
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.fieldLabel}>
              Is your business registered with CAC?
            </Text>
            <View style={styles.twoOptionRow}>
              <TouchableOpacity
                style={[
                  styles.choicePill,
                  !isCacRegistered && styles.choicePillActive,
                ]}
                onPress={() => setIsCacRegistered(false)}
              >
                {!isCacRegistered && (
                  <Check size={13} color="#2D6A2E" strokeWidth={2.8} />
                )}
                <Text
                  style={[
                    styles.choicePillText,
                    !isCacRegistered && styles.choicePillTextActive,
                  ]}
                >
                  No, I'm a collector
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.choicePill,
                  isCacRegistered && styles.choicePillActive,
                ]}
                onPress={() => setIsCacRegistered(true)}
              >
                {isCacRegistered && (
                  <Check size={13} color="#2D6A2E" strokeWidth={2.8} />
                )}
                <Text
                  style={[
                    styles.choicePillText,
                    isCacRegistered && styles.choicePillTextActive,
                  ]}
                >
                  Yes, registered
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.fieldHint}>
              Registered businesses add a CAC certificate and get higher limits.
            </Text>

            <View style={styles.greenPrivacyNotice}>
              <Lock size={14} color="#2D6A2E" />
              <Text style={styles.greenPrivacyText}>
                Your NIN, selfie and documents are only seen by EcoSmart. Households never see them.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.primaryGreenBtn}
              onPress={() => setFrame('nin_step')}
            >
              <Text style={styles.primaryGreenBtnText}>Start</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================= */}
        {/* 3. Step 1 of 4: Enter your NIN                          */}
        {/* ======================================================= */}
        {frame === 'nin_step' && (
          <View>
            <View style={styles.stepTopBar}>
              <TouchableOpacity
                style={styles.backNavRow}
                onPress={() => setFrame('before_you_start')}
              >
                <ArrowLeft size={18} color="#0F1E12" />
                <Text style={styles.backNavTitle}>Get verified</Text>
              </TouchableOpacity>
              <Text style={styles.stepCountLabel}>Step 1 of 4</Text>
            </View>

            <Text style={styles.pageTitle}>Enter your NIN</Text>
            <Text style={styles.pageSub}>
              Your 11-digit National Identification Number. We check it with NIMC.
            </Text>

            <Text style={styles.fieldLabel}>NIN</Text>
            <TextInput
              style={styles.textInput}
              value={ninValue}
              onChangeText={setNinValue}
              keyboardType="numeric"
            />
            <Text style={styles.fieldHint}>
              Don't know it? Dial *346# from the phone linked to your NIN.
            </Text>

            <View style={styles.ninMatchedCard}>
              <CheckCircle2 size={18} color="#2D6A2E" />
              <View style={{ flex: 1 }}>
                <Text style={styles.ninMatchedTitle}>
                  NIN found: MUSA ABDULLAHI
                </Text>
                <Text style={styles.ninMatchedSub}>
                  Is this you? If not, check the number.
                </Text>
              </View>
            </View>

            <View style={styles.greenPrivacyNotice}>
              <Lock size={14} color="#2D6A2E" />
              <Text style={styles.greenPrivacyText}>
                Only EcoSmart sees your NIN. It's never shown to households.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.primaryGreenBtn}
              onPress={() => setFrame('selfie_step')}
            >
              <Text style={styles.primaryGreenBtnText}>Yes, that's me</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================= */}
        {/* 4. Step 2 of 4: Take a selfie                           */}
        {/* ======================================================= */}
        {frame === 'selfie_step' && (
          <View>
            <View style={styles.stepTopBar}>
              <TouchableOpacity
                style={styles.backNavRow}
                onPress={() => setFrame('nin_step')}
              >
                <ArrowLeft size={18} color="#0F1E12" />
                <Text style={styles.backNavTitle}>Get verified</Text>
              </TouchableOpacity>
              <Text style={styles.stepCountLabel}>Step 2 of 4</Text>
            </View>

            <Text style={styles.pageTitle}>Take a selfie</Text>
            <Text style={styles.pageSub}>
              We compare it with your NIN photo to make sure it's really you.
            </Text>

            <View style={styles.selfieDarkCard}>
              <View style={styles.selfieOvalFrame} />
              <Text style={styles.selfieFrameCaption}>Fit your face in the oval</Text>
            </View>

            <View style={styles.whiteCard}>
              <Text style={styles.fieldLabel}>For a clear selfie</Text>
              <Text style={styles.tipItem}>• Stand in good light, facing the light</Text>
              <Text style={styles.tipItem}>• Remove cap and dark glasses</Text>
              <Text style={styles.tipItem}>• Look straight at the camera</Text>
            </View>

            <TouchableOpacity
              style={styles.primaryGreenBtn}
              onPress={() => setFrame('licence_question')}
            >
              <Text style={styles.primaryGreenBtnText}>Take selfie</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================= */}
        {/* 5. Step 3a: Do you have a recycling licence or permit?  */}
        {/* ======================================================= */}
        {frame === 'licence_question' && (
          <View>
            <View style={styles.stepTopBar}>
              <TouchableOpacity
                style={styles.backNavRow}
                onPress={() => setFrame('selfie_step')}
              >
                <ArrowLeft size={18} color="#0F1E12" />
                <Text style={styles.backNavTitle}>Get verified</Text>
              </TouchableOpacity>
              <Text style={styles.stepCountLabel}>Step 3 of 4</Text>
            </View>

            <Text style={styles.pageTitle}>
              Do you have a recycling licence or permit?
            </Text>
            <Text style={styles.pageSub}>
              Households trust licensed recyclers more, and it's needed to go live.
            </Text>

            <TouchableOpacity
              style={[
                styles.radioOptionCard,
                hasLicence && styles.radioOptionCardActive,
              ]}
              onPress={() => setHasLicence(true)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.radioOptionTitle}>Yes, I have one</Text>
                <Text style={styles.radioOptionSub}>
                  I'll take a photo of it now
                </Text>
              </View>
              <View style={[styles.radioDot, hasLicence && styles.radioDotActive]} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.radioOptionCard,
                !hasLicence && styles.radioOptionCardActive,
              ]}
              onPress={() => setHasLicence(false)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.radioOptionTitle}>Not yet</Text>
                <Text style={styles.radioOptionSub}>
                  Save my progress and get help
                </Text>
              </View>
              <View style={[styles.radioDot, !hasLicence && styles.radioDotActive]} />
            </TouchableOpacity>

            <View style={styles.greenPrivacyNotice}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.fieldLabel, { color: '#1E6B24' }]}>
                  We accept
                </Text>
                <Text style={styles.greenPrivacyText}>
                  ✓ State environmental permit (e.g. AEPB){'\n'}✓ Area council permit{'\n'}✓ Recyclers' association ID card or letter
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryGreenBtn}
              onPress={() =>
                setFrame(hasLicence ? 'add_licence' : 'no_licence_saved')
              }
            >
              <Text style={styles.primaryGreenBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================= */}
        {/* 6. Step 3b: Add your licence                            */}
        {/* ======================================================= */}
        {frame === 'add_licence' && (
          <View>
            <View style={styles.stepTopBar}>
              <TouchableOpacity
                style={styles.backNavRow}
                onPress={() => setFrame('licence_question')}
              >
                <ArrowLeft size={18} color="#0F1E12" />
                <Text style={styles.backNavTitle}>Get verified</Text>
              </TouchableOpacity>
              <Text style={styles.stepCountLabel}>Step 3 of 4</Text>
            </View>

            <Text style={styles.pageTitle}>Add your licence</Text>

            <View style={styles.ninMatchedCard}>
              <CheckCircle2 size={18} color="#2D6A2E" />
              <View style={{ flex: 1 }}>
                <Text style={styles.ninMatchedTitle}>Photo added</Text>
                <Text style={styles.ninMatchedSub}>Clear and readable</Text>
              </View>
              <Text style={{ fontSize: 12, fontWeight: '700', color: '#2D6A2E' }}>
                Retake
              </Text>
            </View>

            <Text style={styles.fieldLabel}>Who issued it?</Text>
            <View style={styles.chipsWrap}>
              {(['AEPB', 'Area council', 'Association', 'Other'] as const).map(
                (item) => {
                  const active = issuer === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[styles.choicePill, active && styles.choicePillActive]}
                      onPress={() => setIssuer(item)}
                    >
                      {active && <Check size={12} color="#2D6A2E" strokeWidth={2.8} />}
                      <Text
                        style={[
                          styles.choicePillText,
                          active && styles.choicePillTextActive,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                }
              )}
            </View>

            <Text style={styles.fieldLabel}>Licence or permit number</Text>
            <TextInput
              style={styles.textInput}
              value={licenceNum}
              onChangeText={setLicenceNum}
            />

            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
              Expiry date (if it has one)
            </Text>
            <TextInput
              style={styles.textInput}
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
            <Text style={styles.fieldHint}>
              We'll remind you 30 days before it expires.
            </Text>

            <TouchableOpacity
              style={styles.primaryGreenBtn}
              onPress={() =>
                setFrame(isCacRegistered ? 'cac_registration' : 'payout_account')
              }
            >
              <Text style={styles.primaryGreenBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================= */}
        {/* 7. Step 3c: No licence yet? Your progress is saved.     */}
        {/* ======================================================= */}
        {frame === 'no_licence_saved' && (
          <View>
            <View style={styles.whiteCard}>
              <Text style={styles.cardMainTitle}>
                No licence yet? Your progress is saved.
              </Text>
              <Text style={styles.cardSubHint}>
                You can finish your profile and listings now. You'll go live once your licence is added.
              </Text>

              <Text style={styles.fieldLabel}>How to get one</Text>
              <Text style={styles.tipItem}>
                1. Ask your association — Your chairman can give you an ID card or letter
              </Text>
              <Text style={styles.tipItem}>
                2. Or apply for a permit — At your area council or AEPB office
              </Text>
              <Text style={styles.tipItem}>
                3. Take a photo of it here — We'll check it within 24 hours
              </Text>

              <TouchableOpacity
                style={[styles.primaryGreenBtn, { marginTop: 14 }]}
                onPress={() => router.push('/mina' as any)}
              >
                <Text style={styles.primaryGreenBtnText}>
                  Ask an agent for help
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.secondaryOutlineBtn}
                onPress={() => router.push('/recycler/home' as any)}
              >
                <Text style={styles.secondaryOutlineText}>Go to home</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ======================================================= */}
        {/* 8. Step 4 (Business): Add your CAC registration         */}
        {/* ======================================================= */}
        {frame === 'cac_registration' && (
          <View>
            <View style={styles.stepTopBar}>
              <TouchableOpacity
                style={styles.backNavRow}
                onPress={() => setFrame('add_licence')}
              >
                <ArrowLeft size={18} color="#0F1E12" />
                <Text style={styles.backNavTitle}>Get verified</Text>
              </TouchableOpacity>
              <Text style={styles.stepCountLabel}>Step 4 of 5</Text>
            </View>

            <Text style={styles.pageTitle}>Add your CAC registration</Text>
            <Text style={styles.pageSub}>
              This gives you the Registered business badge and higher limits.
            </Text>

            <Text style={styles.fieldLabel}>Registration type</Text>
            <View style={styles.twoOptionRow}>
              <TouchableOpacity
                style={[
                  styles.choicePill,
                  cacType === 'BN' && styles.choicePillActive,
                ]}
                onPress={() => setCacType('BN')}
              >
                {cacType === 'BN' && <Check size={12} color="#2D6A2E" />}
                <Text
                  style={[
                    styles.choicePillText,
                    cacType === 'BN' && styles.choicePillTextActive,
                  ]}
                >
                  Business name (BN)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.choicePill,
                  cacType === 'RC' && styles.choicePillActive,
                ]}
                onPress={() => setCacType('RC')}
              >
                {cacType === 'RC' && <Check size={12} color="#2D6A2E" />}
                <Text
                  style={[
                    styles.choicePillText,
                    cacType === 'RC' && styles.choicePillTextActive,
                  ]}
                >
                  Company (RC)
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>CAC number</Text>
            <TextInput
              style={styles.textInput}
              value={cacNumber}
              onChangeText={setCacNumber}
            />

            <View style={[styles.whiteCard, { marginTop: 14, alignItems: 'center' }]}>
              <Camera size={24} color="#2D6A2E" />
              <Text style={[styles.fieldLabel, { marginTop: 8 }]}>
                Photo of your CAC certificate
              </Text>
              <View style={styles.twoOptionRow}>
                <TouchableOpacity
                  style={styles.choicePill}
                  onPress={() => alert('Camera opened')}
                >
                  <Text style={styles.choicePillText}>Take photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.choicePill}
                  onPress={() => alert('File picker opened')}
                >
                  <Text style={styles.choicePillText}>Upload file</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryGreenBtn}
              onPress={() => setFrame('payout_account')}
            >
              <Text style={styles.primaryGreenBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================= */}
        {/* 9. Step 4/5: Where should we send your money?           */}
        {/* ======================================================= */}
        {frame === 'payout_account' && (
          <View>
            <View style={styles.stepTopBar}>
              <TouchableOpacity
                style={styles.backNavRow}
                onPress={() => setFrame('add_licence')}
              >
                <ArrowLeft size={18} color="#0F1E12" />
                <Text style={styles.backNavTitle}>Get verified</Text>
              </TouchableOpacity>
              <Text style={styles.stepCountLabel}>Step 4 of 4</Text>
            </View>

            <Text style={styles.pageTitle}>Where should we send your money?</Text>
            <Text style={styles.pageSub}>
              When you cash out your wallet, it goes here.
            </Text>

            <Text style={styles.fieldLabel}>Account type</Text>
            <View style={styles.chipsWrap}>
              {(
                ['Bank', 'OPay', 'PalmPay', 'Moniepoint', 'Business bank'] as const
              ).map((prov) => {
                const active = payoutProvider === prov;
                return (
                  <TouchableOpacity
                    key={prov}
                    style={[styles.choicePill, active && styles.choicePillActive]}
                    onPress={() => setPayoutProvider(prov)}
                  >
                    {active && <Check size={12} color="#2D6A2E" strokeWidth={2.8} />}
                    <Text
                      style={[
                        styles.choicePillText,
                        active && styles.choicePillTextActive,
                      ]}
                    >
                      {prov}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.fieldLabel}>Account number</Text>
            <TextInput
              style={styles.textInput}
              value={accountNumber}
              onChangeText={setAccountNumber}
              keyboardType="numeric"
            />

            <View style={[styles.ninMatchedCard, { marginTop: 12 }]}>
              <CheckCircle2 size={18} color="#2D6A2E" />
              <View style={{ flex: 1 }}>
                <Text style={styles.ninMatchedTitle}>
                  {payoutProvider === 'Business bank'
                    ? 'MUSA WASTE COLLECTION'
                    : 'MUSA ABDULLAHI'}
                </Text>
                <Text style={styles.ninMatchedSub}>
                  {payoutProvider === 'Business bank'
                    ? 'Matches your CAC registered name'
                    : 'Matches the name on your NIN'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.primaryGreenBtn}
              onPress={() => setFrame('check_submit')}
            >
              <Text style={styles.primaryGreenBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================= */}
        {/* 10. Check and submit                                    */}
        {/* ======================================================= */}
        {frame === 'check_submit' && (
          <View>
            <Text style={styles.pageTitle}>Check and submit</Text>
            <Text style={[styles.pageSub, { color: '#2D6A2E', fontWeight: '700' }]}>
              ✓ All 4 steps done
            </Text>

            <View style={styles.whiteCard}>
              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.summaryTitle}>National ID (NIN)</Text>
                  <Text style={styles.summarySub}>MUSA ABDULLAHI · ending 8901</Text>
                </View>
                <TouchableOpacity onPress={() => setFrame('nin_step')}>
                  <Text style={styles.editGreenText}>Edit</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.summaryTitle}>Selfie</Text>
                  <Text style={styles.summarySub}>Taken today</Text>
                </View>
                <TouchableOpacity onPress={() => setFrame('selfie_step')}>
                  <Text style={styles.editGreenText}>Edit</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.summaryRow}>
                <View>
                  <Text style={styles.summaryTitle}>Work licence</Text>
                  <Text style={styles.summarySub}>AEPB · expires 31 Dec 2026</Text>
                </View>
                <TouchableOpacity onPress={() => setFrame('add_licence')}>
                  <Text style={styles.editGreenText}>Edit</Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
                <View>
                  <Text style={styles.summaryTitle}>Payout account</Text>
                  <Text style={styles.summarySub}>OPay · ending 6789</Text>
                </View>
                <TouchableOpacity onPress={() => setFrame('payout_account')}>
                  <Text style={styles.editGreenText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.termsCheckboxRow}
              onPress={() => setAgreedTerms(!agreedTerms)}
            >
              <View style={[styles.checkbox, agreedTerms && styles.checkboxChecked]}>
                {agreedTerms && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
              </View>
              <Text style={styles.termsText}>
                I confirm these details are mine and true. I agree to the Recycler terms.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryGreenBtn}
              onPress={() => setFrame('in_review')}
            >
              <Text style={styles.primaryGreenBtnText}>Submit for review</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================= */}
        {/* 11. We're checking your details (In review)             */}
        {/* ======================================================= */}
        {frame === 'in_review' && (
          <View style={styles.whiteCard}>
            <View style={styles.amberClockCircle}>
              <Clock size={26} color="#B45309" />
            </View>
            <Text style={[styles.cardMainTitle, { textAlign: 'center' }]}>
              We're checking your details
            </Text>
            <Text style={[styles.cardSubHint, { textAlign: 'center' }]}>
              Usually within 24 hours. We'll send you an SMS when it's done.
            </Text>

            <View style={styles.checkRow}>
              <Clock size={16} color="#D97706" />
              <Text style={styles.checkRowTitle}>National ID (NIN) · Checking</Text>
            </View>
            <View style={styles.checkRow}>
              <Clock size={16} color="#D97706" />
              <Text style={styles.checkRowTitle}>Selfie · Checking</Text>
            </View>
            <View style={styles.checkRow}>
              <Clock size={16} color="#D97706" />
              <Text style={styles.checkRowTitle}>Work licence · Checking</Text>
            </View>
            <View style={styles.checkRow}>
              <CheckCircle2 size={16} color="#2D6A2E" />
              <Text style={styles.checkRowTitle}>Payout account · OPay **** 6789</Text>
            </View>

            <TouchableOpacity
              style={[styles.secondaryOutlineBtn, { marginTop: 14 }]}
              onPress={() => router.push('/recycler/listings' as any)}
            >
              <Text style={styles.secondaryOutlineText}>Set up my listings</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================= */}
        {/* 12. You're verified!                                    */}
        {/* ======================================================= */}
        {frame === 'verified_success' && (
          <View style={[styles.whiteCard, { alignItems: 'center' }]}>
            <View style={styles.greenSuccessCircle}>
              <Check size={28} color="#2D6A2E" strokeWidth={3} />
            </View>
            <Text style={styles.cardMainTitle}>You're verified!</Text>
            <Text style={[styles.cardSubHint, { textAlign: 'center' }]}>
              Households near Kubwa can now find you and send you pickup requests.
            </Text>

            <View style={styles.twoOptionRow}>
              <View style={styles.choicePillActive}>
                <Text style={styles.choicePillTextActive}>✓ ID verified</Text>
              </View>
              <View style={styles.choicePillActive}>
                <Text style={styles.choicePillTextActive}>✓ Licensed</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryGreenBtn, { width: '100%', marginTop: 12 }]}
              onPress={() => router.push('/recycler/wallet' as any)}
            >
              <Text style={styles.primaryGreenBtnText}>Top up wallet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryOutlineBtn}
              onPress={() => router.push('/recycler/home' as any)}
            >
              <Text style={styles.secondaryOutlineText}>Go to home</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================= */}
        {/* 13. One thing needs fixing                              */}
        {/* ======================================================= */}
        {frame === 'needs_fixing' && (
          <View style={styles.whiteCard}>
            <View style={styles.redAlertCircle}>
              <AlertCircle size={26} color="#DC2626" />
            </View>
            <Text style={[styles.cardMainTitle, { textAlign: 'center' }]}>
              One thing needs fixing
            </Text>
            <Text style={[styles.cardSubHint, { textAlign: 'center' }]}>
              Everything else is fine. Fix this and we'll check again.
            </Text>

            <View style={styles.checkRow}>
              <CheckCircle2 size={18} color="#2D6A2E" />
              <Text style={styles.checkRowTitle}>National ID (NIN) · Checked</Text>
            </View>
            <View style={styles.checkRow}>
              <CheckCircle2 size={18} color="#2D6A2E" />
              <Text style={styles.checkRowTitle}>Selfie · Checked</Text>
            </View>

            <View style={styles.redErrorBox}>
              <AlertCircle size={18} color="#DC2626" />
              <View style={{ flex: 1 }}>
                <Text style={styles.redErrorTitle}>Work licence</Text>
                <Text style={styles.redErrorSub}>
                  Photo is blurry. Take it again in good light.
                </Text>
              </View>
            </View>

            <View style={styles.checkRow}>
              <CheckCircle2 size={18} color="#2D6A2E" />
              <Text style={styles.checkRowTitle}>Payout account · Checked</Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryGreenBtn, { marginTop: 14 }]}
              onPress={() => setFrame('add_licence')}
            >
              <Text style={styles.primaryGreenBtnText}>Retake licence photo</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ======================================================= */}
        {/* 14 & 15. Licence expires in 30 days & Account paused    */}
        {/* ======================================================= */}
        {(frame === 'licence_expiring' || frame === 'account_paused') && (
          <View>
            <Text style={styles.pageTitle}>Hi Musa</Text>
            <Text style={styles.pageSub}>Kubwa, Abuja</Text>

            {frame === 'licence_expiring' ? (
              <View style={styles.amberExpiryCard}>
                <AlertTriangle size={20} color="#B45309" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.amberExpiryTitle}>
                    Your licence expires in 30 days
                  </Text>
                  <Text style={styles.amberExpirySub}>
                    Upload your new licence before 31 Dec so your account isn't paused.
                  </Text>
                  <TouchableOpacity
                    style={[styles.secondaryOutlineBtn, { marginTop: 12 }]}
                    onPress={() => setFrame('add_licence')}
                  >
                    <Text style={styles.secondaryOutlineText}>
                      Upload new licence
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.redPausedCard}>
                <AlertCircle size={20} color="#DC2626" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.redErrorTitle}>Your account is paused</Text>
                  <Text style={styles.redErrorSub}>
                    Your licence expired on 31 Dec. Upload the new one to accept requests again. Your wallet and history are safe.
                  </Text>
                  <TouchableOpacity
                    style={[styles.primaryGreenBtn, { marginTop: 12 }]}
                    onPress={() => setFrame('add_licence')}
                  >
                    <Text style={styles.primaryGreenBtnText}>
                      Upload new licence
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <RecyclerBottomNavBar activeTab="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  demoBar: {
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 7,
  },
  demoScroll: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 6,
  },
  demoBarLabel: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#2D6A2E',
    marginRight: 2,
  },
  demoPill: {
    paddingHorizontal: 10,
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
    color: '#475569',
  },
  demoPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 36,
  },
  stepTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  backNavTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F1E12',
  },
  stepCountLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  pageTitle: {
    fontSize: 21,
    fontWeight: '900',
    color: '#0F1E12',
    marginBottom: 4,
  },
  pageSub: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 16,
  },
  whiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  cardMainTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F1E12',
    marginBottom: 4,
  },
  cardSubHint: {
    fontSize: 12.5,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 18,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  emptyCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  checkRowTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F1E12',
  },
  checkRowSub: {
    fontSize: 11.5,
    color: '#64748B',
  },
  prepItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  prepIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E6F4D7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prepTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F1E12',
  },
  prepSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 8,
  },
  fieldHint: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 14,
  },
  twoOptionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  choicePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  choicePillActive: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#E6F4D7',
    borderWidth: 1.5,
    borderColor: '#2D6A2E',
  },
  choicePillText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },
  choicePillTextActive: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E6B24',
  },
  greenPrivacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E6F4D7',
    borderRadius: 14,
    padding: 12,
    marginBottom: 18,
  },
  greenPrivacyText: {
    flex: 1,
    fontSize: 12,
    color: '#1E6B24',
    lineHeight: 17,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
  ninMatchedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E6F4D7',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#C7E4B2',
    marginBottom: 14,
  },
  ninMatchedTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#1E6B24',
  },
  ninMatchedSub: {
    fontSize: 11.5,
    color: '#2D6A2E',
    marginTop: 1,
  },
  selfieDarkCard: {
    height: 250,
    borderRadius: 18,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  selfieOvalFrame: {
    width: 130,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#94A3B8',
    marginBottom: 12,
  },
  selfieFrameCaption: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  tipItem: {
    fontSize: 12.5,
    color: '#475569',
    marginBottom: 6,
    lineHeight: 18,
  },
  radioOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  radioOptionCardActive: {
    backgroundColor: '#E6F4D7',
    borderColor: '#2D6A2E',
  },
  radioOptionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F1E12',
  },
  radioOptionSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#94A3B8',
  },
  radioDotActive: {
    borderColor: '#2D6A2E',
    backgroundColor: '#2D6A2E',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  summaryTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F1E12',
  },
  summarySub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  editGreenText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  termsCheckboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E6F4D7',
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2D6A2E',
    borderColor: '#2D6A2E',
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#0F1E12',
    lineHeight: 17,
  },
  amberClockCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  greenSuccessCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F4D7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  redAlertCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  redErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginVertical: 6,
  },
  redErrorTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#991B1B',
  },
  redErrorSub: {
    fontSize: 12,
    color: '#B91C1C',
    marginTop: 2,
    lineHeight: 17,
  },
  amberExpiryCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 16,
    padding: 16,
  },
  amberExpiryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#92400E',
  },
  amberExpirySub: {
    fontSize: 12.5,
    color: '#B45309',
    marginTop: 4,
    lineHeight: 18,
  },
  redPausedCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 16,
    padding: 16,
  },
  primaryGreenBtn: {
    backgroundColor: '#2D6A2E',
    paddingVertical: 15,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryGreenBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  secondaryOutlineBtn: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    paddingVertical: 13,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    width: '100%',
  },
  secondaryOutlineText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
});
