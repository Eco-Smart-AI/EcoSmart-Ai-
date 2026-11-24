# EcoSmart AI — Mobile-First Web & React Native App Architecture

## 1. Executive Summary & Vision

**EcoSmart AI** is an AI-powered waste recycling and monetization platform launching initially in **Kubwa, Abuja, Nigeria**. The platform connects everyday households with verified local recyclers through real-time waste identification (computer vision), instant market valuation (₦/kg), escrow-secured payments (OPay, Paystack, bank transfers), and pickup logistics.

This technical blueprint outlines the architecture to build both the **cross-platform Native Mobile App (iOS & Android)** and the **Mobile-First Web App** using a unified **React Native** codebase.

---

## 2. Core Technology Stack

To achieve complete code sharing across **iOS, Android, and Web** with high performance, native gestures, and responsive web layouts, the recommended stack is:

```mermaid
graph TD
    A[Universal React Native Codebase] --> B[Expo SDK & Expo Router]
    B --> C[iOS App .ipa]
    B --> D[Android App .apk/.aab]
    B --> E[Mobile-First Web / PWA]
    
    subgraph UI & Styling
        F[NativeWind v4 / Tailwind CSS]
        G[Lucide React Native Icons]
        H[@gorhom/bottom-sheet]
    end
    
    subgraph State & Logic
        I[Zustand - Client State]
        J[TanStack Query - Server State]
        K[i18next - Multi-Language]
    end
    
    subgraph Device & AI
        L[Expo Camera & Image Picker]
        M[Mina AI Assistant / Vision API]
        N[Expo Secure Store / MMKV]
    end
    
    B --- F
    B --- I
    B --- L
```

### 2.1 Core Frameworks & Libraries
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **App Runtime** | **Expo SDK (Latest)** | Unified native toolchain, managed workflow, EAS (Expo Application Services) build pipeline |
| **Routing & Navigation** | **Expo Router (File-based)** | Universal nested navigation, deep linking, SEO & responsive URLs for web, native tab & stack navigators |
| **Styling Engine** | **NativeWind v4** (Tailwind CSS) | Universal atomic CSS styles running synchronously on native and compiling to CSS on web |
| **Language & i18n** | **i18next** + `react-i18next` | Localization across **English, Nigerian Pidgin, Hausa, Yoruba, and Igbo** |
| **Bottom Sheet & Gestures** | `@gorhom/bottom-sheet` + `react-native-gesture-handler` | Silky-smooth 60/120fps physics-driven modal bottom sheets (e.g. Language Selector) |
| **Client State** | **Zustand** | Minimalist global store for user session, language preference, wallet cache, cart/basket |
| **Server State & Caching**| **TanStack Query (React Query)** | Data fetching, offline caching, optimistic UI updates, auto-refetching on reconnect |
| **Local Persistence** | `react-native-mmkv` / `expo-secure-store` | Encrypted high-speed local storage for auth tokens and user preferences |
| **Hardware & Sensors** | `expo-camera`, `expo-location`, `expo-image-picker` | Camera waste scanning, geofenced recycler matching in Kubwa / Abuja |
| **Icons & Typography** | `lucide-react-native`, Inter / Plus Jakarta Sans | Clean, accessible design system icons and readable typography |

---

## 3. Project Directory Structure

```text
ecosmart-mobile/
├── app/                           # Expo Router file-based routes
│   ├── (auth)/                    # Authentication group (unauthenticated)
│   │   ├── _layout.tsx
│   │   ├── choose-account.tsx     # S-02: I am a... (Household vs Recycler)
│   │   ├── sign-up.tsx            # S-03: Sign up form
│   │   ├── verify-phone.tsx       # S-06: OTP verification
│   │   ├── sign-in.tsx            # S-08: Sign in
│   │   └── forgot-password.tsx    # S-09 - S-12: Password recovery flow
│   ├── (tabs)/                    # Authenticated Main App (G-H01, G-H02)
│   │   ├── _layout.tsx            # Bottom Tab Bar (Home, Scan, Requests, Profile)
│   │   ├── index.tsx              # G-H01: Dashboard / Home with Wallet & Active Pickup
│   │   ├── scan.tsx               # AI Camera Waste Scanning
│   │   ├── requests.tsx           # Active pickups, booking list
│   │   └── profile.tsx            # User settings, switch language, payouts
│   ├── index.tsx                  # S-01: Public Landing Page (Mobile-first web & entry)
│   ├── _layout.tsx                # Root layout with providers (i18n, Theme, Auth)
│   └── +not-found.tsx
├── components/                    # Reusable Universal Components
│   ├── ui/                        # Button, Card, Badge, Input, BottomSheet
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── BottomSheet.tsx
│   │   └── RadioOption.tsx
│   ├── landing/                   # S-01 landing-specific components
│   │   ├── HeroSection.tsx
│   │   ├── ScanDemoCard.tsx
│   │   ├── TrustMetrics.tsx
│   │   ├── AudienceCards.tsx
│   │   ├── HowItWorksSteps.tsx
│   │   ├── AiFeaturesGrid.tsx
│   │   ├── MinaBanner.tsx
│   │   ├── TestimonialCard.tsx
│   │   └── LandingFooter.tsx
│   ├── sheets/                    # Modal bottom sheets
│   │   └── LanguageBottomSheet.tsx # S-01b: Language selection
│   └── mina/                      # Mina 24/7 AI Assistant widget & chat
├── i18n/                          # Internationalization dictionaries
│   ├── index.ts
│   └── locales/
│       ├── en.json                # English
│       ├── pcm.json               # Nigerian Pidgin
│       ├── ha.json                # Hausa
│       ├── yo.json                # Yoruba
│       └── ig.json                # Igbo
├── services/                      # API integration & business logic
│   ├── api.ts                     # Axios / Ky client with interceptors
│   ├── authService.ts             # Auth & OTP handling
│   ├── wasteAiService.ts          # Computer vision waste detection endpoint
│   ├── walletService.ts           # Escrow & Nigerian payment gateways (OPay, Paystack)
│   └── locationService.ts         # Kubwa geofencing & GPS coordinates
├── stores/                        # Zustand stores
│   ├── useAuthStore.ts
│   ├── useLanguageStore.ts
│   └── useWalletStore.ts
├── theme/                         # Colors, spacing, radii, font definitions
│   └── colors.ts
├── tailwind.config.js
└── package.json
```

---

## 4. Multi-Language & Nigerian Localization Strategy

EcoSmart AI serves diverse demographics in Nigeria—from tech-forward urban households to grassroots recyclers and waste aggregators. Multilingual support from Day 1 is critical for adoption.

### Supported Languages:
1. **English (`en`)** — Official business & default interface language.
2. **Nigerian Pidgin (`pcm`)** — Broadly spoken lingua franca across all classes.
3. **Hausa (`ha`)** — Widely spoken throughout Abuja, Kubwa, and Northern Nigeria.
4. **Yoruba (`yo`)** — Spoken widely by commercial vendors and households.
5. **Igbo (`ig`)** — Spoken widely by traders and business recyclers.

### Implementation Pattern (`useLanguageStore.ts` & `i18n`):
```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import { MMKV } from 'react-native-mmkv';

import en from './locales/en.json';
import pcm from './locales/pcm.json';
import ha from './locales/ha.json';
import yo from './locales/yo.json';
import ig from './locales/ig.json';

const storage = new MMKV();
const LANGUAGE_KEY = 'user_selected_language';

const resources = { en: { translation: en }, pcm: { translation: pcm }, ha: { translation: ha }, yo: { translation: yo }, ig: { translation: ig } };

export const initI18n = () => {
  const savedLang = storage.getString(LANGUAGE_KEY);
  const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
  
  i18n.use(initReactI18next).init({
    resources,
    lng: savedLang || (['en', 'ha', 'yo', 'ig', 'pcm'].includes(deviceLocale) ? deviceLocale : 'en'),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
};
```

---

## 5. Mobile-First Web vs Native Cross-Platform Strategy

EcoSmart AI will run as both a **mobile app** (downloaded from Google Play Store & iOS App Store) and a **mobile-first responsive website** (`ecosmart.ai`):

| Capability | React Native (iOS / Android) | Mobile-First Web (Browser / PWA) |
| :--- | :--- | :--- |
| **Landing Page (`S-01`)** | App introduction / splash on first install | SEO-optimized responsive web page with deep-link CTA |
| **Language Sheet (`S-01b`)** | Native gesture bottom sheet (`@gorhom/bottom-sheet`) | Slide-up modal / dialog with backdrop blur |
| **Camera Waste Scan** | Native Camera2 / AVFoundation via `expo-camera` with live 60fps bounding boxes | HTML5 `<input type="file" capture="environment">` or WebRTC camera feed |
| **Geolocation** | Native GPS background location tracking for recycler arrival | HTML5 Geolocation API with Kubwa neighborhood selector |
| **Push Notifications** | APNs & FCM (Firebase Cloud Messaging) for instant pickup alerts | Web Push Notifications + SMS fallback via Termii / Twilio |
| **Wallet & Cashout** | In-app secure biometrics (FaceID/Fingerprint) before transfer to OPay/Bank | Web OTP confirmation via SMS/Email |

---

## 6. Nigerian Payment & Escrow Architecture

To solve trust deficits between households and recyclers:
1. **Pilot Region:** Kubwa, Abuja.
2. **Currency:** Nigerian Naira (`₦`).
3. **Escrow Guarantee:**
   - Household books pickup → Recycler arrives and verifies weight on calibrated scales.
   - Recycler confirms weight in app → Funds instantly unlocked from Escrow into the Household's **EcoSmart Wallet**.
   - Household can cash out at zero or low fee directly to **OPay**, **PalmPay**, **Moniepoint**, or commercial bank accounts via Paystack / Flutterwave transfers API.

---

## 7. Next Implementation Milestones

1. **Phase 1: Foundation & Design System**
   - Initialize Expo project with TypeScript, NativeWind v4, and Lucide Icons.
   - Configure EcoSmart Forest Green color tokens (`#2E7D32`, `#1E3A1E`, `#E8F5E9`).
   - Implement i18n dictionary for English and Nigerian Pidgin.
2. **Phase 2: Screen 01 (Landing & Language Selector)**
   - Build responsive `S-01` landing page with scan card demonstration.
   - Build `S-01b` language bottom sheet with persistent language toggle.
3. **Phase 3: Authentication Flow (`S-02` - `S-12`)**
   - Account selection (Household vs Recycler).
   - Phone number input & Nigerian OTP verification (+234 SMS).
4. **Phase 4: Dashboard & Pickup Management (`G-H01`, `G-H02`)**
   - EcoSmart Wallet balance, on-hold escrow tracker, and live pickup status card.
