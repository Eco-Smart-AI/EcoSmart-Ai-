# EcoSmart AI — Admin Portal (`Copy 9`) Implementation Blueprint

## 1. Why a Separate Web Application (Not React Native)?

Inspecting the 5 screen sheets in `Ecosmart Ai And Innovation Ltd (Copy) (9)` confirms that the **EcoSmart AI Admin Portal (`Admin · Abuja pilot`)** is a **desktop-first internal operations dashboard** designed for widescreen monitors (`1280px–1440px+`) with:
- A persistent **10-item left sidebar** (`Overview`, `Verifications 12`, `Disputes 3`, `Approvals 2`, `Payments`, `Support 4`, `Users`, `Market rates`, `Reports 2`, `Content`, `Audit log`).
- Dense **master-detail split panes** (e.g., 3-column support desk, side-by-side NIN vs in-app selfie face verification, multi-column financial tables with CSV export).
- High-security staff controls (**2-step TOTP authenticator code**, **two-admin maker-checker approval above ₦50,000**, and an **immutable append-only audit log**).

Keeping it as a **standalone Desktop Web App** (separate from the Household/Recycler React Native app) gives you:
1. **Security Isolation:** Staff credentials, NIMC/NIN photos, escrow release triggers, and audit logs live on a separate admin subdomain (`admin.ecosmart.ng`) behind staff 2FA—completely isolated from public mobile bundles.
2. **Zero Mobile Bundle Bloat:** Household and Recycler mobile users don't download desktop admin tables or moderation logic.
3. **Shared Backend on PythonAnywhere + Render Static Hosting:** The Admin Web App is still a pure static React/TypeScript SPA deployed for **₦0 on Render Static Site**, talking to the exact same **PythonAnywhere backend API & database**.

---

## 2. Recommended Tech Stack for the Admin App

| Layer | Choice | Why It Fits |
| :--- | :--- | :--- |
| **Framework** | **React 19 + TypeScript + Vite** (or Next.js Static Export) | Ultra-fast build, deploys as a free **Render Static Site** (`dist/`), zero server RAM cost |
| **Styling & UI** | **Tailwind CSS + Lucide Icons** | Matches EcoSmart's `#2E7D32` / `#E6F4D7` palette and clean card borders from `Copy 9` |
| **State & Data** | **TanStack Query (React Query) + Zustand** | Auto-refreshes live queue counts (`Verifications 12`, `Disputes 3`, `Approvals 2`, `Support 4`) |
| **Backend API** | **Same PythonAnywhere Flask/FastAPI Server** (`/api/admin/*`) | Shares the same database tables (`Users`, `Pickups`, `EscrowLedger`, `Disputes`, `AuditLog`) |
| **Auth & 2FA** | **JWT + TOTP (`pyotp` on PythonAnywhere)** | Works with Google Authenticator / Authy for the 6-digit staff login in `Screens · 00` |

---

## 3. Screen-by-Screen Mapping from `Copy (9)`

### **Screen 00 — Staff Sign In & 2-Step Verification (`Screens · 00 · Sign in.png`)**
1. **Frame 1 (`Sign in`):** Work email (`ifeoma@ecosmart.ng`) + password + notice: *"🔒 For EcoSmart staff only. Every sign-in is recorded."*
2. **Frame 2 (`Enter your 6-digit code`):** 6-box authenticator input (`4 8 2 0 3 _`), `Verify and continue`, and `Use a backup code instead`.

---

### **Screen 01 — Daily Operations (`Screens · 01 · Daily work.png`)**
1. **Overview Dashboard (`Good morning, Ifeoma`):**
   - Global search (`Search name, phone or REQ-...`).
   - 4 KPI cards: `Waiting for verification: 12` (*Oldest waiting 19h*), `Open disputes: 3` (*₦1,734 frozen*), `Held in escrow: ₦184,500` (*48 active pickups*), `Failed payouts: 1` (*Needs a retry*).
   - **`Needs your attention` queue (5 items):** Second approval (`REQ-0588 · ₦62,000`), Licence check (`Musa Waste`), Dispute (`REQ-0412`), Payout failed (`Bwari Renew · PAY-0871`), Code not entered (`REQ-0398`).
   - **`Today` summary:** Pickups completed (`38`), Paid to households (`₦41,820`), Returned to recyclers (`₦6,140`), New recyclers approved (`4`), No-shows (`2`).
2. **Verifications Queue (`Verifications · 12`):**
   - Filter tabs: `All 12`, `Business 3`, `Collector 9`.
   - Detail inspect pane for **Musa Waste Collection**:
     - **Automatic checks (`✓ 3 of 3 passed`):** NIN `1234 567 8901` found, Payout account name matches NIN, Phone verified by SMS.
     - **Face match (`Is this the same person?`):** Side-by-side `NIN photo · from NIMC` vs `Selfie · taken in app` with `[✓ OK]` / `[✕ Fix]` toggle.
     - **Work licence:** `AEPB` (`AEPB/RC/2025/0412`, expires `31 Dec 2026`) with `[✓ OK]` / `[✕ Fix]` toggle.
     - Footer actions: `Approve` or `Send back to fix` (*only marked items are sent back via SMS*).
3. **Dispute Resolution (`Dispute · REQ-0412 · Money frozen`):**
   - Halima B. (household) vs Bwari Renew (recycler).
   - **Money card:** Set aside `₦600`, Final amount sent `₦540 (6 kg × ₦90)`, Household accepted: `No`.
   - **Evidence:** `Request photo` vs `Scale photo · 6.0 kg` + recycler's note (*"Some cardboard was wet. I offered ₦90/kg instead of ₦110/kg"*).
   - **Timeline:** 12:05 Accepted → 12:31 Arrived (GPS inside area) → 12:40 Weighed 6.0 kg → 12:42 New rate proposed → 12:44 Household declined.
   - **Your decision panel (3 radio choices):**
     1. `Pay household` (at agreed ₦110/kg → ₦660)
     2. `Adjust the amount` (Set fair rate: `₦100/kg → ₦600 to household`, shared reason sent via SMS to both sides)
     3. `Refund recycler` (₦600 back to recycler, waste stays with household)
4. **Second Approvals (`Approvals · 2` — Maker-Checker Rule):**
   - *"Big money decisions need a second admin before they happen."* (Any decision or first cash-out above `₦50,000`).
   - Queue: `Dispute decision · REQ-0588` (`₦62,000`, asked by Tunde) & `Large cash out · Kubwa Green Hub` (`₦74,300`).
   - Rule enforced in UI & API: *"You can't approve your own decisions."* → `Approve · pay ₦62,000` or `Reject and send back`.
5. **Payments Ledger (`Payments`):**
   - *"Every naira that moves. Nothing can be edited — corrections are added as new entries."*
   - Tabs: `All`, `Set aside 48`, `Released 38`, `Returned 12`, `Payouts 9`, `Failed 1` + `Export CSV`.

---

### **Screen 02 — Look Up & Fix (`Screens · 02 · Look up and fix.png`)**
1. **Pickup Inspector (`Pickup · REQ-001 · Paid`):**
   - Full escrow breakdown (`Set aside ₦450`, `Paid ₦384`, `Returned ₦66`, `Fee ₦0`), 7-step timestamped timeline, Evidence cards (`Scan photo`, `Scale photo · 3.2 kg`, `Arrival GPS`), Household & Recycler profile cards, and privacy-guarded Messages preview (*"Admins can read pickup chats only when a pickup is reported or disputed"*).
2. **Failed Payout Troubleshooter (`Failed payout · PAY-0871`):**
   - Red banner: *"The bank rejected the transfer — Provider message: 'Account name does not match.' The money is back in Bwari Renew's wallet — nothing is lost."*
   - Compares `Name on bank account (BWARI RENEWABLE VENTURES)` vs `Name on EcoSmart account (Bwari Renew Ltd)`.
   - Actions: `Ask recycler to fix bank details` (green) or `Retry payout`.
3. **3-Pane Support Desk (`Support · 4`):**
   - Left column: `Open 4` / `Done` ticket list (Musa A., Kubwa Green Hub, Halima B., Dutse Circular).
   - Center column: Live support chat with `Mark as done` and message composer.
   - Right column: User context card (`About Musa A.`, Wallet balance `₦1,624`, Last cash out `₦1,000 · pending`, Recent pickups, `Open profile`, `See payments`).

---

### **Screen 03 — Accounts, Rates & Content (`Screens · 03 · Accounts, rates and content.png`)**
1. **Users Directory (`Users`):**
   - Tabs: `All 1,284`, `Households 1,166`, `Recyclers 118`, `Suspended 3`.
   - Right inspector drawer for selected user (`Halima B.`) with `See her payments` and `Suspend account`.
2. **Market Guide Rates (`Market rates`):**
   - Table of Kubwa & Bwari guide prices (`PET bottles: ₦80–₦150, avg ₦118`, `HDPE: ₦90–₦140`, `Aluminium cans: ₦500–₦800`, `Cardboard: ₦40–₦80`, `Glass: ₦20–₦40`, `E-waste: Not collected`).
   - Right editor drawer: Edit `Lowest ₦/kg`, `Highest ₦/kg`, live preview (*"Recyclers near you pay ₦80–₦150/kg"*), and required `Reason for the change` (saved to audit log).
3. **Private Reports (`Reports · 2`):**
   - Tabs: `Open 2`, `Being checked 1`, `Closed`.
   - Inspects confidential reports (`Asked to pay outside the app`, `Rude at pickup`, `Scale looked wrong`) with actions: `Warn recycler`, `Suspend recycler`, `Close report`.
4. **Multilingual App Content CMS (`Content`):**
   - Manages in-app scan tips & notices across all 5 languages (`EN`, `Pidgin`, `Hausa`, `Yoruba`, `Igbo`) — e.g., `Get it ready · PET` (*Tip 1: Empty, rinse and dry; Tip 2: Flatten to save space; Tip 3: Keep caps separate*) with `Publish` and `Save draft`.
5. **Immutable Audit Log (`Audit log`):**
   - *"Every admin action, with who did it and when. Nobody can edit this list."*
   - Filters: `All actions`, `Money`, `Accounts`, `Rates`, `Content` + `Export CSV`.

---

### **Screen 04 — Risky Action Confirmation Modals (`Screens · 04 · Confirmation pop-ups.png`)**
1. **`Send back to Musa Waste Collection?`** — Confirms SMS feedback for unclear licence photo while keeping NIN, selfie & payout approved.
2. **`Adjust REQ-0412 to ₦600?`** — Shows exact split (`To household: ₦600`, `Back to recycler: ₦0`, `New rate: ₦100/kg × 6 kg`) before releasing frozen escrow.
3. **`Suspend Halima B.?`** — Requires a mandatory reason (*"She'll see this"*) before suspending an account.

---

## 4. How We Should Build & Deploy It

1. **Folder / Repo Structure:**
   - Create an `ecosmart-admin/` web project (or a sibling repo) using **React + TypeScript + Vite + Tailwind CSS**.
   - Alternatively, if you want a live preview inside this workspace first, we can either spin up a dedicated `admin-web/` folder or an `/admin` desktop layout route.
2. **Deployment:**
   - Deploy `ecosmart-admin` as a second **Render Static Site** (`admin-ecosmart.onrender.com`), pointing its API calls to your **PythonAnywhere** backend (`/api/admin/...`).
