import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Camera,
  CameraOff,
  Zap,
  Target,
  Sun,
  Square,
  Tag,
  Check,
  Lock,
} from 'lucide-react-native';
import { AppHeader } from '../../components/common/AppHeader';
import { BottomNavBar } from '../../components/common/BottomNavBar';

type ScanDemoStep = 'permission' | 'aiming' | 'locked' | 'analyzing';

export default function ScanScreen() {
  const router = useRouter();

  // Demo step switcher matching Content.png, Content-1.png, and Content-2.png
  const [step, setStep] = useState<ScanDemoStep>('aiming');
  const [flashOn, setFlashOn] = useState(false);

  const handleCapture = () => {
    if (step === 'aiming') {
      // Toggle to locked if user presses
      setStep('locked');
      return;
    }
    setStep('analyzing');
    setTimeout(() => {
      router.push('/scan/result');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader showBack={true} rightAction="bell" />

      {/* Demo Switcher */}
      <View style={styles.demoBar}>
        <Text style={styles.demoTitle}>Scan Design:</Text>
        <TouchableOpacity
          style={[styles.demoPill, step === 'permission' && styles.demoPillActive]}
          onPress={() => setStep('permission')}
        >
          <Text style={[styles.demoPillText, step === 'permission' && styles.demoPillTextActive]}>
            Content (Permission)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoPill, step === 'aiming' && styles.demoPillActive]}
          onPress={() => setStep('aiming')}
        >
          <Text style={[styles.demoPillText, step === 'aiming' && styles.demoPillTextActive]}>
            Content-1 (Aim)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.demoPill, step === 'locked' && styles.demoPillActive]}
          onPress={() => setStep('locked')}
        >
          <Text style={[styles.demoPillText, step === 'locked' && styles.demoPillTextActive]}>
            Content-2 (Locked)
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen Header Titles */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Scan your waste</Text>
          <Text style={styles.subTitle}>
            {step === 'permission'
              ? 'First, let EcoSmart use your camera.'
              : step === 'locked'
              ? 'Looks good. Take the photo.'
              : 'Point your camera at one item.'}
          </Text>
        </View>

        {/* ======================================================= */}
        {/* 1. Camera Viewport / Card Area                          */}
        {/* ======================================================= */}
        {step === 'permission' ? (
          /* Permission State (Content.png): Dashed Box with Camera Off icon */
          <View style={styles.dashedBox}>
            <View style={styles.cameraOffCircle}>
              <CameraOff size={28} color="#475569" />
            </View>
            <Text style={styles.cameraOffTitle}>Turn on your camera to scan</Text>
            <Text style={styles.cameraOffSub}>We only use it when you take a photo.</Text>
          </View>
        ) : (
          /* Live Camera Viewfinder (Content-1.png & Content-2.png) */
          <View style={styles.cameraCard}>
            {/* Real plastic bottle backdrop if locked */}
            {step === 'locked' || step === 'analyzing' ? (
              <Image
                source={require('../../assets/images/scanned-bottle.png')}
                style={styles.cameraBackdropImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.darkCameraBackground} />
            )}

            {/* Top Left: "Camera on" badge */}
            <View style={styles.cameraOnBadge}>
              <Camera size={13} color="#FFFFFF" />
              <Text style={styles.cameraOnText}>Camera on</Text>
            </View>

            {/* Top Right: Flash toggle */}
            <TouchableOpacity
              style={[styles.flashBtn, flashOn && styles.flashBtnActive]}
              onPress={() => setFlashOn(!flashOn)}
              activeOpacity={0.7}
            >
              <Zap size={15} color={flashOn ? '#FDE047' : '#FFFFFF'} />
            </TouchableOpacity>

            {/* Corner Framing Brackets */}
            <View
              style={[
                styles.cornerBracket,
                styles.cornerTL,
                step === 'locked' && styles.cornerLocked,
              ]}
            />
            <View
              style={[
                styles.cornerBracket,
                styles.cornerTR,
                step === 'locked' && styles.cornerLocked,
              ]}
            />
            <View
              style={[
                styles.cornerBracket,
                styles.cornerBL,
                step === 'locked' && styles.cornerLocked,
              ]}
            />
            <View
              style={[
                styles.cornerBracket,
                styles.cornerBR,
                step === 'locked' && styles.cornerLocked,
              ]}
            />

            {/* Center Reticle Content */}
            {step === 'aiming' && (
              <View style={styles.aimingCenter}>
                <View style={styles.targetIconWrap}>
                  <Target size={36} color="#FFFFFF" strokeWidth={2.2} />
                </View>
                <Text style={styles.targetTitle}>Point at one item</Text>
                <Text style={styles.targetSub}>Bottle, can, carton, paper…</Text>
              </View>
            )}

            {/* Bottom Centered Badge in Viewfinder (Content-2.png) */}
            {(step === 'locked' || step === 'analyzing') && (
              <View style={styles.lockedPillWrap}>
                <View style={styles.lockedPill}>
                  <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  <Text style={styles.lockedPillText}>Item in frame · take the photo</Text>
                </View>
              </View>
            )}

            {/* Analyzing Spinner Overlay */}
            {step === 'analyzing' && (
              <View style={styles.analyzingOverlay}>
                <ActivityIndicator size="large" color="#4ADE80" />
                <Text style={styles.analyzingText}>Identifying waste…</Text>
              </View>
            )}
          </View>
        )}

        {/* ======================================================= */}
        {/* 2. Side-by-Side Action Buttons Row                      */}
        {/* ======================================================= */}
        <View style={styles.actionsRow}>
          {/* Left Button: Upload photo */}
          <TouchableOpacity
            style={styles.uploadBtn}
            onPress={() => {
              setStep('locked');
            }}
            activeOpacity={0.75}
          >
            <Text style={styles.uploadBtnText}>Upload photo</Text>
          </TouchableOpacity>

          {/* Right Button: Allow camera OR Take photo */}
          {step === 'permission' ? (
            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={() => setStep('aiming')}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryActionBtnText}>Allow camera</Text>
            </TouchableOpacity>
          ) : step === 'aiming' ? (
            <TouchableOpacity
              style={styles.disabledActionBtn}
              onPress={() => setStep('locked')}
              activeOpacity={0.7}
            >
              <Text style={styles.disabledActionBtnText}>Take photo</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.primaryActionBtn}
              onPress={handleCapture}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryActionBtnText}>Take photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ======================================================= */}
        {/* 3. Footer Checklist / Privacy Note                      */}
        {/* ======================================================= */}
        {step === 'permission' ? (
          <View style={styles.privacyRow}>
            <Lock size={13} color="#64748B" />
            <Text style={styles.privacyText}>
              Your photos are only used to identify waste.
            </Text>
          </View>
        ) : (
          <View style={styles.tipsRow}>
            <View style={styles.tipPill}>
              <Sun size={13} color="#15803D" />
              <Text style={styles.tipText} numberOfLines={1}>
                Good light
              </Text>
            </View>
            <View style={styles.tipPill}>
              <Square size={13} color="#15803D" />
              <Text style={styles.tipText} numberOfLines={1}>
                One item
              </Text>
            </View>
            <View style={styles.tipPill}>
              <Tag size={13} color="#15803D" />
              <Text style={styles.tipText} numberOfLines={1}>
                Show the label
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <BottomNavBar activeTab="scan" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  demoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 6,
  },
  demoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
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
    color: '#475569',
  },
  demoPillTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  titleSection: {
    marginBottom: 12,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F1E12',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 14,
    color: '#475569',
  },

  /* Content.png: Dashed box */
  dashedBox: {
    height: 360,
    width: '100%',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FAFDF9',
  },
  cameraOffCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  cameraOffTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 6,
    textAlign: 'center',
  },
  cameraOffSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },

  /* Content-1 & Content-2: Camera Card */
  cameraCard: {
    height: 360,
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1E242B',
  },
  darkCameraBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1E242B',
  },
  cameraBackdropImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  cameraOnBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    zIndex: 5,
  },
  cameraOnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  flashBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  flashBtnActive: {
    backgroundColor: 'rgba(45, 106, 46, 0.85)',
  },

  /* Corner brackets */
  cornerBracket: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderColor: '#FFFFFF',
  },
  cornerTL: {
    top: 24,
    left: 24,
    borderTopWidth: 3.5,
    borderLeftWidth: 3.5,
    borderTopLeftRadius: 18,
  },
  cornerTR: {
    top: 24,
    right: 24,
    borderTopWidth: 3.5,
    borderRightWidth: 3.5,
    borderTopRightRadius: 18,
  },
  cornerBL: {
    bottom: 24,
    left: 24,
    borderBottomWidth: 3.5,
    borderLeftWidth: 3.5,
    borderBottomLeftRadius: 18,
  },
  cornerBR: {
    bottom: 24,
    right: 24,
    borderBottomWidth: 3.5,
    borderRightWidth: 3.5,
    borderBottomRightRadius: 18,
  },
  cornerLocked: {
    borderColor: '#4ADE80',
  },

  aimingCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  targetIconWrap: {
    marginBottom: 8,
  },
  targetTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  targetSub: {
    fontSize: 12,
    color: '#CBD5E1',
  },

  lockedPillWrap: {
    position: 'absolute',
    bottom: 22,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 4,
  },
  lockedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2D6A2E',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  lockedPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  analyzingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 30, 18, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    zIndex: 10,
  },
  analyzingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Buttons Row */
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  uploadBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2D6A2E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  primaryActionBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2D6A2E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2D6A2E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  disabledActionBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledActionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#94A3B8',
  },

  /* Footer Note */
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    marginBottom: 12,
  },
  privacyText: {
    fontSize: 12,
    color: '#64748B',
  },

  tipsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    marginBottom: 12,
  },
  tipPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 8,
    paddingVertical: 9,
    borderRadius: 20,
  },
  tipText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E293B',
  },
});
