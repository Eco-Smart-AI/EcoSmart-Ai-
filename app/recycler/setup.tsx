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
  Camera,
  User,
  Users,
  Building2,
  MapPin,
  Navigation,
  Check,
  Sparkles,
  Wallet,
  Package,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { RecyclerBottomNavBar } from '../../components/common/RecyclerBottomNavBar';

type SetupStep = 'step1' | 'step2' | 'step3' | 'step4' | 'live';
type OperationSize = 'just_me' | 'small_team' | 'facility';

const MATERIAL_OPTIONS = [
  { id: 'plastic', title: 'Plastic', sub: 'PET, HDPE' },
  { id: 'glass', title: 'Glass', sub: 'Bottles, jars' },
  { id: 'paper', title: 'Paper', sub: 'Office, news' },
  { id: 'cardboard', title: 'Cardboard', sub: 'Boxes' },
  { id: 'aluminium', title: 'Aluminium', sub: 'Cans, foil' },
  { id: 'steel', title: 'Steel', sub: 'Scrap metal' },
  { id: 'electronics', title: 'Electronics', sub: 'E-waste' },
  { id: 'batteries', title: 'Batteries', sub: 'All types' },
  { id: 'textiles', title: 'Textiles', sub: 'Clothes' },
];

export default function RecyclerSetupScreen() {
  const router = useRouter();

  const [step, setStep] = useState<SetupStep>('step1');

  // Step 1 state
  const [photoAdded, setPhotoAdded] = useState(false);
  const [operationSize, setOperationSize] = useState<OperationSize>('just_me');
  const [businessName, setBusinessName] = useState('Musa Waste Collection');
  const [description, setDescription] = useState(
    'We buy PET, cardboard and cans across Kubwa. Mon–Sat.'
  );

  // Step 2 state
  const [yardAddress, setYardAddress] = useState('12 Gado Nasko Road, Kubwa');
  const [coveredAreas, setCoveredAreas] = useState<string[]>([
    'Kubwa',
    'Dutse',
    'Byazhin',
  ]);
  const [workDays, setWorkDays] = useState<string[]>([
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
  ]);
  const [opensAt, setOpensAt] = useState('6:00 am');
  const [closesAt, setClosesAt] = useState('6:00 pm');
  const [takingPickupsNow, setTakingPickupsNow] = useState(true);

  // Step 3 state
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([
    'plastic',
    'cardboard',
    'aluminium',
  ]);
  const [homePickup, setHomePickup] = useState(true);
  const [yardDropoff, setYardDropoff] = useState(true);
  const [bulkCollection, setBulkCollection] = useState(false);
  const [minPickupKg, setMinPickupKg] = useState('5');
  const [sameDayPickup, setSameDayPickup] = useState(false);

  // Step 4 state
  const [petRate, setPetRate] = useState('120');
  const [cardboardRate, setCardboardRate] = useState('60');
  const [cansRate, setCansRate] = useState('600');
  const [agreeAtPickup, setAgreeAtPickup] = useState(false);

  const toggleArea = (area: string) => {
    setCoveredAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const toggleDay = (d: string) => {
    setWorkDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );
  };

  const toggleMaterial = (id: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const getStepNumber = (): number => {
    if (step === 'step1') return 1;
    if (step === 'step2') return 2;
    if (step === 'step3') return 3;
    return 4;
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        step === 'live' && { backgroundColor: '#E6F4D7' },
      ]}
    >
      {step !== 'live' && <AppHeader showBack={false} rightAction="bell" />}

      {/* Demo Switcher (Screens · 03 · Business profile setup.png) */}
      <View style={styles.demoBar}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoScroll}
        >
          <Text style={styles.demoBarLabel}>Setup 03:</Text>
          {(
            [
              { key: 'step1', label: 'Step 1 Business' },
              { key: 'step2', label: 'Step 2 Where' },
              { key: 'step3', label: 'Step 3 Materials' },
              { key: 'step4', label: 'Step 4 Prices' },
              { key: 'live', label: 'Profile is live' },
            ] as const
          ).map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.demoPill, step === item.key && styles.demoPillActive]}
              onPress={() => setStep(item.key)}
            >
              <Text
                style={[
                  styles.demoPillText,
                  step === item.key && styles.demoPillTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {step === 'live' ? (
        /* ============================================================== */
        /* FRAME 5: YOUR PROFILE IS LIVE (Full Light-Green Screen)         */
        /* ============================================================== */
        <View style={styles.liveFullScreen}>
          <View style={styles.liveIconCircle}>
            <Package size={30} color="#FFFFFF" />
          </View>
          <Text style={styles.liveHeadline}>Your profile is live</Text>
          <Text style={styles.liveSub}>
            Households near you can now find {businessName}.
          </Text>

          <TouchableOpacity
            style={styles.livePrimaryBtn}
            onPress={() => router.push('/recycler/verification' as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.livePrimaryBtnText}>Next: get verified</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.liveSecondaryLink}
            onPress={() => router.push('/recycler/home' as any)}
            activeOpacity={0.75}
          >
            <Text style={styles.liveSecondaryText}>Preview my profile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {/* Sub-header + 4-Segment Progress Bar */}
          <View style={styles.wizardHeader}>
            <View style={styles.wizardTopRow}>
              <TouchableOpacity
                style={styles.backRow}
                onPress={() => {
                  if (step === 'step2') setStep('step1');
                  else if (step === 'step3') setStep('step2');
                  else if (step === 'step4') setStep('step3');
                  else router.back();
                }}
                activeOpacity={0.7}
              >
                <ArrowLeft size={18} color="#0F1E12" strokeWidth={2.4} />
                <Text style={styles.wizardHeaderTitle}>Your business profile</Text>
              </TouchableOpacity>

              <Text style={styles.stepCounterText}>Step {getStepNumber()} of 4</Text>
            </View>

            <View style={styles.progressSegments}>
              {[1, 2, 3, 4].map((num) => (
                <View
                  key={num}
                  style={[
                    styles.progressBarSeg,
                    num <= getStepNumber() && styles.progressBarSegActive,
                  ]}
                />
              ))}
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* ======================================================= */}
            {/* STEP 1 OF 4: TELL US ABOUT YOUR BUSINESS                */}
            {/* ======================================================= */}
            {step === 'step1' && (
              <View>
                <Text style={styles.pageTitle}>Tell us about your business</Text>
                <Text style={styles.pageSub}>
                  Households see this when they look for a recycler.
                </Text>

                {/* Add Photo Row */}
                <TouchableOpacity
                  style={styles.photoUploadRow}
                  onPress={() => setPhotoAdded(!photoAdded)}
                  activeOpacity={0.8}
                >
                  <View style={styles.photoDashedCircle}>
                    <Camera size={20} color="#2D6A2E" />
                    <Text style={styles.addPhotoMicro}>
                      {photoAdded ? 'Added ✓' : 'Add photo'}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.photoTitle}>Photo of you or your yard</Text>
                    <Text style={styles.photoSub}>
                      Profiles with a photo get about 3× more requests.
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* How big is your operation? (3 frames in Screen 03: Just me / Small team / A facility) */}
                <Text style={styles.fieldLabel}>How big is your operation?</Text>
                <View style={styles.opSizeGrid}>
                  {(
                    [
                      { key: 'just_me', label: 'Just me', Icon: User },
                      { key: 'small_team', label: 'Small team', Icon: Users },
                      { key: 'facility', label: 'A facility', Icon: Building2 },
                    ] as const
                  ).map((op) => {
                    const active = operationSize === op.key;
                    const IconComp = op.Icon;
                    return (
                      <TouchableOpacity
                        key={op.key}
                        style={[styles.opSizeCard, active && styles.opSizeCardActive]}
                        onPress={() => setOperationSize(op.key)}
                        activeOpacity={0.8}
                      >
                        <View
                          style={[
                            styles.opIconCircle,
                            active && styles.opIconCircleActive,
                          ]}
                        >
                          <IconComp
                            size={18}
                            color={active ? '#FFFFFF' : '#2D6A2E'}
                          />
                        </View>
                        <Text
                          style={[
                            styles.opSizeLabel,
                            active && styles.opSizeLabelActive,
                          ]}
                        >
                          {op.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Business Name */}
                <Text style={styles.fieldLabel}>Business name</Text>
                <TextInput
                  style={styles.textInput}
                  value={businessName}
                  onChangeText={setBusinessName}
                />
                <Text style={styles.fieldHint}>
                  {operationSize === 'just_me'
                    ? 'This is the name households search for.'
                    : operationSize === 'small_team'
                    ? 'This is the name households search for. You can add team members later.'
                    : "Use the name on your CAC certificate. We'll ask for it when you get verified."}
                </Text>

                {/* Short description */}
                <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
                  Short description
                </Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  maxLength={200}
                />
                <Text style={styles.fieldHint}>{description.length} / 200</Text>

                {/* Ask Mina bar */}
                <TouchableOpacity
                  style={styles.askMinaRow}
                  onPress={() => router.push('/mina' as any)}
                  activeOpacity={0.8}
                >
                  <Sparkles size={15} color="#2D6A2E" />
                  <Text style={styles.askMinaLeft}>Need help filling this in?</Text>
                  <Text style={styles.askMinaRight}>Ask Mina →</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryCtaBtn}
                  onPress={() => setStep('step2')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryCtaBtnText}>Next: where you work</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ======================================================= */}
            {/* STEP 2 OF 4: WHERE DO YOU WORK?                         */}
            {/* ======================================================= */}
            {step === 'step2' && (
              <View>
                <Text style={styles.pageTitle}>Where do you work?</Text>
                <Text style={styles.pageSub}>
                  We show you to households in these areas.
                </Text>

                <Text style={styles.fieldLabel}>Your yard or base</Text>
                <View style={styles.inputWithIcon}>
                  <MapPin size={16} color="#64748B" />
                  <TextInput
                    style={styles.inputInner}
                    value={yardAddress}
                    onChangeText={setYardAddress}
                  />
                </View>

                <TouchableOpacity
                  style={styles.useCurrentLocLink}
                  onPress={() => setYardAddress('12 Gado Nasko Road, Kubwa')}
                  activeOpacity={0.7}
                >
                  <Navigation size={13} color="#2D6A2E" />
                  <Text style={styles.useCurrentLocText}>Use my current location</Text>
                </TouchableOpacity>

                <Text style={styles.fieldLabel}>Areas you cover</Text>
                <Text style={styles.fieldHint}>Pick up to 10.</Text>

                <View style={styles.chipsWrap}>
                  {['Kubwa', 'Dutse', 'Byazhin', 'Bwari', 'Gwagwalada'].map((area) => {
                    const active = coveredAreas.includes(area);
                    return (
                      <TouchableOpacity
                        key={area}
                        style={[styles.areaChip, active && styles.areaChipActive]}
                        onPress={() => toggleArea(area)}
                      >
                        {active && <Check size={12} color="#2D6A2E" strokeWidth={2.8} />}
                        <Text
                          style={[
                            styles.areaChipText,
                            active && styles.areaChipTextActive,
                          ]}
                        >
                          {area}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                  <TouchableOpacity
                    style={styles.areaChip}
                    onPress={() => alert('Add custom Abuja area')}
                  >
                    <Text style={styles.areaChipText}>+ Add area</Text>
                  </TouchableOpacity>
                </View>

                <Text style={[styles.fieldLabel, { marginTop: 14 }]}>Days you work</Text>
                <View style={styles.chipsWrap}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => {
                    const active = workDays.includes(d);
                    return (
                      <TouchableOpacity
                        key={d}
                        style={[styles.areaChip, active && styles.areaChipActive]}
                        onPress={() => toggleDay(d)}
                      >
                        {active && <Check size={12} color="#2D6A2E" strokeWidth={2.8} />}
                        <Text
                          style={[
                            styles.areaChipText,
                            active && styles.areaChipTextActive,
                          ]}
                        >
                          {d}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View style={styles.hoursGrid}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Opens</Text>
                    <TextInput
                      style={styles.textInput}
                      value={opensAt}
                      onChangeText={setOpensAt}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.fieldLabel}>Closes</Text>
                    <TextInput
                      style={styles.textInput}
                      value={closesAt}
                      onChangeText={setClosesAt}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.toggleCard}
                  onPress={() => setTakingPickupsNow(!takingPickupsNow)}
                  activeOpacity={0.8}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.toggleTitle}>Taking pickups now</Text>
                    <Text style={styles.toggleSub}>
                      Turn off when you're busy or closed.
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.switchTrack,
                      takingPickupsNow && styles.switchTrackOn,
                    ]}
                  >
                    <View
                      style={[
                        styles.switchThumb,
                        takingPickupsNow && styles.switchThumbOn,
                      ]}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.askMinaRow}
                  onPress={() => router.push('/mina' as any)}
                  activeOpacity={0.8}
                >
                  <Sparkles size={15} color="#2D6A2E" />
                  <Text style={styles.askMinaLeft}>Need help filling this in?</Text>
                  <Text style={styles.askMinaRight}>Ask Mina →</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryCtaBtn}
                  onPress={() => setStep('step3')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryCtaBtnText}>Next: what you collect</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ======================================================= */}
            {/* STEP 3 OF 4: WHAT DO YOU COLLECT?                       */}
            {/* ======================================================= */}
            {step === 'step3' && (
              <View>
                <Text style={styles.pageTitle}>What do you collect?</Text>
                <Text style={styles.pageSub}>
                  Tap everything you buy. You can change this later.
                </Text>

                {/* 3x3 Material Grid */}
                <View style={styles.materialsGrid}>
                  {MATERIAL_OPTIONS.map((mat) => {
                    const active = selectedMaterials.includes(mat.id);
                    return (
                      <TouchableOpacity
                        key={mat.id}
                        style={[styles.matTile, active && styles.matTileActive]}
                        onPress={() => toggleMaterial(mat.id)}
                        activeOpacity={0.8}
                      >
                        {active && (
                          <View style={styles.matCheckBadge}>
                            <Check size={10} color="#FFFFFF" strokeWidth={3} />
                          </View>
                        )}
                        <Text
                          style={[
                            styles.matTileTitle,
                            active && styles.matTileTitleActive,
                          ]}
                        >
                          {mat.title}
                        </Text>
                        <Text style={styles.matTileSub}>{mat.sub}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <Text style={styles.fieldLabel}>
                  How do households give it to you?
                </Text>
                <View style={styles.collectionMethodsCard}>
                  <TouchableOpacity
                    style={styles.methodRow}
                    onPress={() => setHomePickup(!homePickup)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.methodTitle}>I pick up at their home</Text>
                      <Text style={styles.methodSub}>From your minimum weight</Text>
                    </View>
                    <View style={[styles.checkbox, homePickup && styles.checkboxChecked]}>
                      {homePickup && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                    </View>
                  </TouchableOpacity>

                  <View style={styles.methodDivider} />

                  <TouchableOpacity
                    style={styles.methodRow}
                    onPress={() => setYardDropoff(!yardDropoff)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.methodTitle}>They drop off at my yard</Text>
                      <Text style={styles.methodSub}>Any amount from 1 kg</Text>
                    </View>
                    <View
                      style={[styles.checkbox, yardDropoff && styles.checkboxChecked]}
                    >
                      {yardDropoff && (
                        <Check size={13} color="#FFFFFF" strokeWidth={3} />
                      )}
                    </View>
                  </TouchableOpacity>

                  <View style={styles.methodDivider} />

                  <TouchableOpacity
                    style={styles.methodRow}
                    onPress={() => setBulkCollection(!bulkCollection)}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={styles.methodTitle}>Bulk collection</Text>
                      <Text style={styles.methodSub}>Offices, schools, events</Text>
                    </View>
                    <View
                      style={[
                        styles.checkbox,
                        bulkCollection && styles.checkboxChecked,
                      ]}
                    >
                      {bulkCollection && (
                        <Check size={13} color="#FFFFFF" strokeWidth={3} />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>

                <Text style={styles.fieldLabel}>Smallest home pickup</Text>
                <View style={styles.unitInputBox}>
                  <TextInput
                    style={styles.unitInputField}
                    value={minPickupKg}
                    onChangeText={setMinPickupKg}
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitSuffix}>kg</Text>
                </View>
                <Text style={styles.fieldHint}>
                  Smaller amounts can still be dropped off at your yard.
                </Text>

                <TouchableOpacity
                  style={[styles.toggleCard, { marginTop: 14 }]}
                  onPress={() => setSameDayPickup(!sameDayPickup)}
                  activeOpacity={0.8}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.toggleTitle}>Same-day pickup</Text>
                    <Text style={styles.toggleSub}>Households can book for today.</Text>
                  </View>
                  <View
                    style={[
                      styles.switchTrack,
                      sameDayPickup && styles.switchTrackOn,
                    ]}
                  >
                    <View
                      style={[
                        styles.switchThumb,
                        sameDayPickup && styles.switchThumbOn,
                      ]}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.askMinaRow}
                  onPress={() => router.push('/mina' as any)}
                  activeOpacity={0.8}
                >
                  <Sparkles size={15} color="#2D6A2E" />
                  <Text style={styles.askMinaLeft}>Need help filling this in?</Text>
                  <Text style={styles.askMinaRight}>Ask Mina →</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryCtaBtn}
                  onPress={() => setStep('step4')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryCtaBtnText}>Next: your prices</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ======================================================= */}
            {/* STEP 4 OF 4: SET YOUR PRICES                            */}
            {/* ======================================================= */}
            {step === 'step4' && (
              <View>
                <Text style={styles.pageTitle}>Set your prices</Text>
                <Text style={styles.pageSub}>
                  What you pay per kg. You can change prices any time.
                </Text>

                <View style={styles.priceItemCard}>
                  <Text style={styles.priceItemTitle}>Plastic bottles (PET)</Text>
                  <View style={styles.priceInputWrap}>
                    <Text style={styles.nairaPrefix}>₦</Text>
                    <TextInput
                      style={styles.priceInputField}
                      value={petRate}
                      onChangeText={setPetRate}
                      keyboardType="numeric"
                    />
                    <Text style={styles.unitSuffix}>per kg</Text>
                  </View>
                  <Text style={styles.marketHintText}>
                    Market in Kubwa: ₦80–₦150
                  </Text>
                </View>

                <View style={styles.priceItemCard}>
                  <Text style={styles.priceItemTitle}>Cardboard</Text>
                  <View style={styles.priceInputWrap}>
                    <Text style={styles.nairaPrefix}>₦</Text>
                    <TextInput
                      style={styles.priceInputField}
                      value={cardboardRate}
                      onChangeText={setCardboardRate}
                      keyboardType="numeric"
                    />
                    <Text style={styles.unitSuffix}>per kg</Text>
                  </View>
                  <Text style={styles.marketHintText}>Market in Kubwa: ₦40–₦70</Text>
                </View>

                <View style={styles.priceItemCard}>
                  <Text style={styles.priceItemTitle}>Aluminium cans</Text>
                  <View style={styles.priceInputWrap}>
                    <Text style={styles.nairaPrefix}>₦</Text>
                    <TextInput
                      style={styles.priceInputField}
                      value={cansRate}
                      onChangeText={setCansRate}
                      keyboardType="numeric"
                    />
                    <Text style={styles.unitSuffix}>per kg</Text>
                  </View>
                  <Text style={styles.marketHintText}>
                    Market in Kubwa: ₦500–₦800
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.toggleCard}
                  onPress={() => setAgreeAtPickup(!agreeAtPickup)}
                  activeOpacity={0.8}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.toggleTitle}>
                      Agree prices at pickup instead
                    </Text>
                    <Text style={styles.toggleSub}>
                      Households see "Price agreed at pickup".
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.switchTrack,
                      agreeAtPickup && styles.switchTrackOn,
                    ]}
                  >
                    <View
                      style={[
                        styles.switchThumb,
                        agreeAtPickup && styles.switchThumbOn,
                      ]}
                    />
                  </View>
                </TouchableOpacity>

                <View style={styles.walletInfoBanner}>
                  <Wallet size={16} color="#2D6A2E" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.walletInfoTitle}>
                      Payments go through your EcoSmart wallet
                    </Text>
                    <Text style={styles.walletInfoSub}>
                      No cash. It keeps you and the household safe.
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.askMinaRow}
                  onPress={() => router.push('/mina' as any)}
                  activeOpacity={0.8}
                >
                  <Sparkles size={15} color="#2D6A2E" />
                  <Text style={styles.askMinaLeft}>Not sure what to charge?</Text>
                  <Text style={styles.askMinaRight}>Ask Mina →</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.primaryCtaBtn}
                  onPress={() => setStep('live')}
                  activeOpacity={0.85}
                >
                  <Text style={styles.primaryCtaBtnText}>Publish my profile</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>

          <RecyclerBottomNavBar activeTab="profile" />
        </>
      )}
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
  wizardHeader: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: '#F8FAFC',
  },
  wizardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  wizardHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
  stepCounterText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  progressSegments: {
    flexDirection: 'row',
    gap: 6,
  },
  progressBarSeg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
  },
  progressBarSegActive: {
    backgroundColor: '#2D6A2E',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
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
    marginBottom: 16,
  },
  photoUploadRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  photoDashedCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#2D6A2E',
    backgroundColor: '#E6F4D7',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  addPhotoMicro: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F1E12',
  },
  photoSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 17,
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
    marginBottom: 10,
  },
  opSizeGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  opSizeCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  opSizeCardActive: {
    backgroundColor: '#E6F4D7',
    borderColor: '#2D6A2E',
  },
  opIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#F1F8EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  opIconCircleActive: {
    backgroundColor: '#2D6A2E',
  },
  opSizeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  opSizeLabelActive: {
    color: '#0F1E12',
    fontWeight: '800',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13.5,
    color: '#0F1E12',
    fontWeight: '600',
  },
  textArea: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputInner: {
    flex: 1,
    fontSize: 13.5,
    color: '#0F1E12',
    fontWeight: '600',
  },
  useCurrentLocLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 16,
  },
  useCurrentLocText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  areaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  areaChipActive: {
    backgroundColor: '#E6F4D7',
    borderColor: '#2D6A2E',
  },
  areaChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  areaChipTextActive: {
    color: '#0F1E12',
    fontWeight: '700',
  },
  hoursGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    marginBottom: 14,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  toggleTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F1E12',
  },
  toggleSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  switchTrack: {
    width: 38,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchTrackOn: {
    backgroundColor: '#2D6A2E',
  },
  switchThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
  },
  switchThumbOn: {
    alignSelf: 'flex-end',
  },
  materialsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  matTile: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  matTileActive: {
    backgroundColor: '#E6F4D7',
    borderColor: '#2D6A2E',
  },
  matCheckBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2D6A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matTileTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 2,
  },
  matTileTitleActive: {
    color: '#1E6B24',
  },
  matTileSub: {
    fontSize: 10.5,
    color: '#64748B',
    textAlign: 'center',
  },
  collectionMethodsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
    overflow: 'hidden',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  methodDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  methodTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F1E12',
  },
  methodSub: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
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
  unitInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  unitInputField: {
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
  },
  unitSuffix: {
    fontSize: 12.5,
    color: '#64748B',
    fontWeight: '600',
  },
  priceItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  priceItemTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 8,
  },
  priceInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  nairaPrefix: {
    fontSize: 14,
    fontWeight: '800',
    color: '#64748B',
    marginRight: 8,
  },
  priceInputField: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#0F1E12',
  },
  marketHintText: {
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 6,
  },
  walletInfoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E6F4D7',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  walletInfoTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E6B24',
  },
  walletInfoSub: {
    fontSize: 11.5,
    color: '#2D6A2E',
    marginTop: 1,
  },
  askMinaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4D7',
    borderRadius: 14,
    paddingVertical: 11,
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 16,
  },
  askMinaLeft: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F1E12',
  },
  askMinaRight: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#2D6A2E',
  },
  primaryCtaBtn: {
    backgroundColor: '#2D6A2E',
    paddingVertical: 15,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryCtaBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  /* Live Profile Full Screen */
  liveFullScreen: {
    flex: 1,
    backgroundColor: '#E6F4D7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  liveIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#1E6B24',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  liveHeadline: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F1E12',
    marginBottom: 6,
  },
  liveSub: {
    fontSize: 13.5,
    color: '#334155',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  livePrimaryBtn: {
    backgroundColor: '#2D6A2E',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 26,
    alignItems: 'center',
    marginBottom: 14,
  },
  livePrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  liveSecondaryLink: {
    paddingVertical: 8,
  },
  liveSecondaryText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#2D6A2E',
  },
});
