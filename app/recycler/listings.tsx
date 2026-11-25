import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  Plus,
  MoreVertical,
  Check,
  MapPin,
  Package,
  ShieldCheck,
  Lock,
  Info,
  Edit3,
  PauseCircle,
  Trash2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react-native';
import TopGreenWave from '../../components/common/TopGreenWave';
import RecyclerBottomNavBar from '../../components/common/RecyclerBottomNavBar';

type ListingsViewMode =
  | 'list'
  | 'new_listing'
  | 'empty'
  | 'buy_offer'
  | 'action_sheet'
  | 'delete_modal'
  | 'published_toast';

export default function RecyclerListingsScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ListingsViewMode>('list');

  // New listing form state
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['PET', 'Glass']);
  const [petPrice, setPetPrice] = useState('120');
  const [glassPrice, setGlassPrice] = useState('60');
  const [homePickup, setHomePickup] = useState(true);
  const [yardDropoff, setYardDropoff] = useState(true);

  // Buy offer form state
  const [offerMaterial, setOfferMaterial] = useState('PET');
  const [offerPrice, setOfferPrice] = useState('120');
  const [offerQty, setOfferQty] = useState('800');
  const [offerEnds, setOfferEnds] = useState('Sat 21 Nov');

  const materialsGrid = [
    { id: 'PET', label: 'PET', emoji: '🧴' },
    { id: 'HDPE', label: 'HDPE', emoji: '🛢️' },
    { id: 'Glass', label: 'Glass', emoji: '🍾' },
    { id: 'Aluminium', label: 'Aluminium', emoji: '🥫' },
    { id: 'Cardboard', label: 'Cardboard', emoji: '📦' },
    { id: 'Paper', label: 'Paper', emoji: '📄' },
    { id: 'Electronics', label: 'Electronics', emoji: '🔌' },
    { id: 'Textile', label: 'Textile', emoji: '👕' },
  ];

  const toggleMaterial = (id: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const offerTotal = (parseFloat(offerPrice) || 0) * (parseFloat(offerQty) || 0);

  const demoTabs: { id: ListingsViewMode; label: string }[] = [
    { id: 'list', label: '1. Active Listings' },
    { id: 'new_listing', label: '2. New Listing' },
    { id: 'empty', label: '3. Empty State' },
    { id: 'buy_offer', label: '4. Post Buy Offer' },
    { id: 'action_sheet', label: '5. Action Sheet' },
    { id: 'delete_modal', label: '6. Delete Modal' },
    { id: 'published_toast', label: '7. Published Toast' },
  ];

  const renderListingsBody = (showPublishedBanner = false) => (
    <View style={styles.contentWrap}>
      {showPublishedBanner && (
        <View style={styles.toastBanner}>
          <CheckCircle2 size={20} color="#166534" />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={styles.toastTitle}>Listing published</Text>
            <Text style={styles.toastSub}>Households near you can see it now.</Text>
          </View>
        </View>
      )}

      {/* Top 3 Stat Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>3</Text>
          <Text style={styles.statLabel}>listings</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>263</Text>
          <Text style={styles.statLabel}>views this week</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>31</Text>
          <Text style={styles.statLabel}>requests</Text>
        </View>
      </View>

      {/* Listing Card 1: Plastic and glass */}
      <View style={styles.listingCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardIconCircle}>
            <Package size={18} color="#2E7D32" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.cardTitle}>Plastic and glass</Text>
            <Text style={styles.cardCode}>COL-01</Text>
          </View>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>✓ Active</Text>
          </View>
          <TouchableOpacity
            style={styles.moreBtn}
            onPress={() => setViewMode('action_sheet')}
          >
            <MoreVertical size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.chipsRow}>
          <View style={styles.matChip}>
            <Text style={styles.matChipText}>PET</Text>
          </View>
          <View style={styles.matChip}>
            <Text style={styles.matChipText}>Glass</Text>
          </View>
        </View>

        <View style={styles.locRow}>
          <MapPin size={13} color="#6B7280" />
          <Text style={styles.locText}>Kubwa · 5 km around</Text>
        </View>

        <View style={styles.cardFooterRow}>
          <Text style={styles.pricePerKgText}>₦120/kg</Text>
          <Text style={styles.viewsReqText}>87 views · 9 requests</Text>
        </View>
      </View>

      {/* Listing Card 2: Paper and cardboard */}
      <View style={styles.listingCard}>
        <View style={styles.cardHeaderRow}>
          <View style={styles.cardIconCircle}>
            <Package size={18} color="#2E7D32" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.cardTitle}>Paper and cardboard</Text>
            <Text style={styles.cardCode}>COL-02</Text>
          </View>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>✓ Active</Text>
          </View>
          <TouchableOpacity
            style={styles.moreBtn}
            onPress={() => setViewMode('action_sheet')}
          >
            <MoreVertical size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.chipsRow}>
          <View style={styles.matChip}>
            <Text style={styles.matChipText}>Paper</Text>
          </View>
          <View style={styles.matChip}>
            <Text style={styles.matChipText}>Cardboard</Text>
          </View>
        </View>

        <View style={styles.locRow}>
          <MapPin size={13} color="#6B7280" />
          <Text style={styles.locText}>Kubwa · drop-off only</Text>
        </View>

        <View style={styles.cardFooterRow}>
          <Text style={styles.pricePerKgText}>₦50/kg</Text>
          <Text style={styles.viewsReqText}>64 views · 6 requests</Text>
        </View>
      </View>

      {/* Listing Card 3: Aluminium cans (Paused) */}
      <View style={styles.listingCard}>
        <View style={styles.cardHeaderRow}>
          <View style={[styles.cardIconCircle, { backgroundColor: '#F3F4F6' }]}>
            <Package size={18} color="#6B7280" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.cardTitle}>Aluminium cans</Text>
            <Text style={styles.cardCode}>COL-03</Text>
          </View>
          <View style={styles.pausedBadge}>
            <Text style={styles.pausedBadgeText}>⏸ Paused</Text>
          </View>
          <TouchableOpacity
            style={styles.moreBtn}
            onPress={() => setViewMode('action_sheet')}
          >
            <MoreVertical size={18} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View style={styles.chipsRow}>
          <View style={styles.matChip}>
            <Text style={styles.matChipText}>Aluminium</Text>
          </View>
        </View>

        <View style={styles.locRow}>
          <MapPin size={13} color="#6B7280" />
          <Text style={styles.locText}>Dutse · 3 km around</Text>
        </View>

        <View style={styles.cardFooterRow}>
          <Text style={[styles.pricePerKgText, { color: '#374151' }]}>₦600/kg</Text>
          <Text style={styles.viewsReqText}>34 views · 4 requests</Text>
        </View>
      </View>

      {/* Dashed Add Collection Box */}
      <TouchableOpacity
        style={styles.dashedAddBox}
        onPress={() => setViewMode('new_listing')}
      >
        <View style={styles.dashedPlusCircle}>
          <Plus size={18} color="#2E7D32" />
        </View>
        <Text style={styles.dashedAddTitle}>Add new collection</Text>
        <Text style={styles.dashedAddSub}>More listings reach more households</Text>
      </TouchableOpacity>

      {/* Post a Funded Wanted Buy Offer Button */}
      <TouchableOpacity
        style={styles.buyOfferPromoBtn}
        onPress={() => setViewMode('buy_offer')}
      >
        <ShieldCheck size={18} color="#2E7D32" />
        <Text style={styles.buyOfferPromoText}>Post a bulk Wanted Buy Offer →</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopGreenWave />

      {/* Top Header */}
      <View style={styles.header}>
        {viewMode === 'new_listing' || viewMode === 'buy_offer' ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity onPress={() => setViewMode('list')} style={styles.backBtn}>
              <ArrowLeft size={22} color="#1F2937" />
            </TouchableOpacity>
            <Text style={styles.headerTitleSmall}>
              {viewMode === 'new_listing' ? 'New listing' : 'Buy offer'}
            </Text>
          </View>
        ) : (
          <Text style={styles.headerTitle}>Listings</Text>
        )}

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          {(viewMode === 'list' || viewMode === 'published_toast') && (
            <TouchableOpacity
              onPress={() => setViewMode('new_listing')}
              style={styles.addHeaderLink}
            >
              <Text style={styles.addHeaderLinkText}>+ Add</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => router.push('/recycler/notifications' as any)}
          >
            <Bell size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Demo Switcher Pills */}
      <View style={styles.demoPillsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.demoPillsScroll}
        >
          {demoTabs.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.demoPill, viewMode === t.id && styles.demoPillActive]}
              onPress={() => setViewMode(t.id)}
            >
              <Text style={[styles.demoPillText, viewMode === t.id && styles.demoPillTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ================= FRAME 1 & 7: LISTINGS DASHBOARD ================= */}
        {viewMode === 'list' && renderListingsBody(false)}
        {viewMode === 'published_toast' && renderListingsBody(true)}

        {/* ================= FRAME 2: NEW LISTING FORM ================= */}
        {viewMode === 'new_listing' && (
          <View style={styles.contentWrap}>
            <Text style={styles.sectionTitle}>What do you buy?</Text>

            <View style={styles.gridWrap}>
              {materialsGrid.map((mat) => {
                const isSelected = selectedMaterials.includes(mat.id);
                return (
                  <TouchableOpacity
                    key={mat.id}
                    style={[styles.gridTile, isSelected && styles.gridTileSelected]}
                    onPress={() => toggleMaterial(mat.id)}
                  >
                    {isSelected && (
                      <View style={styles.tileCheckBadge}>
                        <Check size={10} color="#FFFFFF" />
                      </View>
                    )}
                    <Text style={styles.tileEmoji}>{mat.emoji}</Text>
                    <Text style={[styles.tileLabel, isSelected && styles.tileLabelSelected]}>
                      {mat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Pricing Box */}
            <View style={styles.pricingCard}>
              <Text style={styles.pricingCardTitle}>Your price per kg · tap to change</Text>

              <Text style={styles.inputMatLabel}>PET</Text>
              <View style={styles.currencyInputWrap}>
                <Text style={styles.currencyPrefix}>₦</Text>
                <TextInput
                  style={styles.currencyTextInput}
                  keyboardType="numeric"
                  value={petPrice}
                  onChangeText={setPetPrice}
                />
                <Text style={styles.currencySuffix}>per kg</Text>
              </View>
              <Text style={styles.marketHint}>Market in Kubwa: ₦80–₦150</Text>

              <Text style={[styles.inputMatLabel, { marginTop: 14 }]}>Glass</Text>
              <View style={[styles.currencyInputWrap, { borderColor: '#E5E7EB' }]}>
                <Text style={styles.currencyPrefix}>₦</Text>
                <TextInput
                  style={styles.currencyTextInput}
                  keyboardType="numeric"
                  value={glassPrice}
                  onChangeText={setGlassPrice}
                />
                <Text style={styles.currencySuffix}>per kg</Text>
              </View>
              <Text style={styles.marketHint}>Market in Kubwa: ₦30–₦70</Text>
            </View>

            <Text style={styles.sectionTitle}>How do you collect?</Text>
            <View style={styles.collectPillsRow}>
              <TouchableOpacity
                style={[styles.collectPill, homePickup && styles.collectPillActive]}
                onPress={() => setHomePickup(!homePickup)}
              >
                <Text style={[styles.collectPillText, homePickup && styles.collectPillTextActive]}>
                  {homePickup ? '✓ ' : ''}Home pickup
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.collectPill, yardDropoff && styles.collectPillActive]}
                onPress={() => setYardDropoff(!yardDropoff)}
              >
                <Text style={[styles.collectPillText, yardDropoff && styles.collectPillTextActive]}>
                  {yardDropoff ? '✓ ' : ''}Drop-off at my yard
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Minimum for home pickup</Text>
            <View style={styles.minWeightBox}>
              <Text style={styles.minWeightText}>3 kg minimum</Text>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 12 }]}
              onPress={() => setViewMode('published_toast')}
            >
              <Text style={styles.primaryBtnText}>Save listing</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= FRAME 3: EMPTY STATE ================= */}
        {viewMode === 'empty' && (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconCircle}>
              <Package size={32} color="#2E7D32" />
            </View>
            <Text style={styles.emptyTitle}>Add what you buy</Text>
            <Text style={styles.emptySub}>
              Households can only find you once you list the materials you buy and your prices.
            </Text>
            <TouchableOpacity
              style={[styles.primaryBtn, { width: '100%', marginTop: 20 }]}
              onPress={() => setViewMode('new_listing')}
            >
              <Text style={styles.primaryBtnText}>Add your first listing</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= FRAME 4: POST A BUY OFFER ================= */}
        {viewMode === 'buy_offer' && (
          <View style={styles.contentWrap}>
            <View style={styles.trustedPill}>
              <ShieldCheck size={14} color="#2E7D32" />
              <Text style={styles.trustedPillText}>Trusted and business recyclers</Text>
            </View>

            <Text style={styles.offerMainTitle}>Post a buy offer</Text>
            <Text style={styles.offerMainSub}>
              Tell households exactly what you want. It shows in "Wanted near you" as Funded.
            </Text>

            <Text style={styles.sectionTitle}>Material</Text>
            <View style={styles.offerMatRow}>
              {['PET', 'HDPE', 'Cardboard', 'Aluminium'].map((m) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.collectPill, offerMaterial === m && styles.collectPillActive]}
                  onPress={() => setOfferMaterial(m)}
                >
                  <Text
                    style={[
                      styles.collectPillText,
                      offerMaterial === m && styles.collectPillTextActive,
                    ]}
                  >
                    {offerMaterial === m ? '✓ ' : ''}
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.twoColRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Price</Text>
                <View style={[styles.currencyInputWrap, { borderColor: '#E5E7EB', marginTop: 6 }]}>
                  <Text style={styles.currencyPrefix}>₦</Text>
                  <TextInput
                    style={styles.currencyTextInput}
                    keyboardType="numeric"
                    value={offerPrice}
                    onChangeText={setOfferPrice}
                  />
                  <Text style={styles.currencySuffix}>per kg</Text>
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>How much</Text>
                <View style={[styles.currencyInputWrap, { borderColor: '#E5E7EB', marginTop: 6 }]}>
                  <TextInput
                    style={styles.currencyTextInput}
                    keyboardType="numeric"
                    value={offerQty}
                    onChangeText={setOfferQty}
                  />
                  <Text style={styles.currencySuffix}>kg</Text>
                </View>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Offer ends</Text>
            <View style={[styles.currencyInputWrap, { borderColor: '#E5E7EB' }]}>
              <TextInput
                style={styles.currencyTextInput}
                value={offerEnds}
                onChangeText={setOfferEnds}
              />
            </View>

            {/* Escrow Set-aside Card */}
            <View style={styles.offerEscrowCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Lock size={14} color="#6B7280" />
                <Text style={styles.offerEscrowLabel}>Set aside from your wallet now</Text>
              </View>
              <Text style={styles.offerEscrowTotal}>
                ₦{offerTotal.toLocaleString()}
              </Text>
              <Text style={styles.offerEscrowFormula}>
                {offerQty} kg × ₦{offerPrice} per kg
              </Text>
              <View style={styles.divider} />
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
                <Info size={14} color="#6B7280" style={{ marginTop: 2 }} />
                <Text style={styles.offerEscrowNote}>
                  Households see your offer as Funded. Unused money comes back when the offer ends.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, { marginTop: 12 }]}
              onPress={() => setViewMode('published_toast')}
            >
              <Text style={styles.primaryBtnText}>
                Set aside ₦{offerTotal.toLocaleString()} and post
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ================= FRAME 5 & 6: ACTION SHEET / DELETE MODAL PREVIEWS ================= */}
        {(viewMode === 'action_sheet' || viewMode === 'delete_modal') && renderListingsBody(false)}
      </ScrollView>

      {/* Floating Ask Mina Button */}
      <TouchableOpacity
        style={styles.floatingMinaBtn}
        onPress={() => router.push('/recycler/mina' as any)}
        activeOpacity={0.85}
      >
        <Sparkles size={18} color="#2E7D32" />
      </TouchableOpacity>

      {/* Action Bottom Sheet Modal (Frame 5) */}
      <Modal
        visible={viewMode === 'action_sheet'}
        transparent
        animationType="slide"
        onRequestClose={() => setViewMode('list')}
      >
        <View style={styles.modalBackdropBottom}>
          <View style={styles.bottomSheetCard}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Plastic and glass</Text>
            <Text style={styles.sheetSub}>COL-01 · Active</Text>

            <TouchableOpacity
              style={styles.sheetRow}
              onPress={() => setViewMode('new_listing')}
            >
              <Edit3 size={18} color="#374151" />
              <Text style={styles.sheetRowText}>Edit listing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetRow}
              onPress={() => setViewMode('list')}
            >
              <PauseCircle size={18} color="#374151" />
              <Text style={styles.sheetRowText}>Pause listing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetRow}
              onPress={() => setViewMode('delete_modal')}
            >
              <Trash2 size={18} color="#DC2626" />
              <Text style={[styles.sheetRowText, { color: '#DC2626' }]}>Delete listing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Listing Confirmation Modal (Frame 6) */}
      <Modal
        visible={viewMode === 'delete_modal'}
        transparent
        animationType="fade"
        onRequestClose={() => setViewMode('list')}
      >
        <View style={styles.modalBackdropCenter}>
          <View style={styles.deleteDialogCard}>
            <View style={styles.deleteTrashCircle}>
              <Trash2 size={24} color="#DC2626" />
            </View>
            <Text style={styles.deleteDialogTitle}>Delete this listing?</Text>
            <Text style={styles.deleteDialogSub}>
              Households won't see "Plastic and glass" any more. Pickups you already accepted stay.
            </Text>

            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={() => setViewMode('list')}
            >
              <Text style={styles.primaryBtnText}>Keep listing</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteTextBtn}
              onPress={() => setViewMode('list')}
            >
              <Text style={styles.deleteTextBtnLabel}>Delete listing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 5-Tab Bottom Navigation */}
      <RecyclerBottomNavBar activeTab="Listings" />
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
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  headerTitleSmall: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },
  addHeaderLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  addHeaderLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
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
    paddingBottom: 110,
  },
  contentWrap: {
    gap: 14,
  },
  toastBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  toastTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  toastSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  listingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  cardCode: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 1,
  },
  activeBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2E7D32',
  },
  pausedBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pausedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  moreBtn: {
    padding: 6,
    marginLeft: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
  },
  matChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  matChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  locText: {
    fontSize: 12,
    color: '#6B7280',
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  pricePerKgText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#2E7D32',
  },
  viewsReqText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  dashedAddBox: {
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  dashedPlusCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dashedAddTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2E7D32',
  },
  dashedAddSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  buyOfferPromoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E8F5E9',
    paddingVertical: 12,
    borderRadius: 10,
  },
  buyOfferPromoText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2E7D32',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridTile: {
    width: '23%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gridTileSelected: {
    borderColor: '#2E7D32',
    borderWidth: 1.5,
    backgroundColor: '#E8F5E9',
  },
  tileCheckBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileEmoji: {
    fontSize: 20,
    marginBottom: 6,
  },
  tileLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  tileLabelSelected: {
    color: '#166534',
    fontWeight: '700',
  },
  pricingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  pricingCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  inputMatLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 6,
  },
  currencyInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  currencyPrefix: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6B7280',
    marginRight: 8,
  },
  currencyTextInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  currencySuffix: {
    fontSize: 13,
    color: '#6B7280',
  },
  marketHint: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  collectPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  collectPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  collectPillActive: {
    borderColor: '#2E7D32',
    backgroundColor: '#E8F5E9',
  },
  collectPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  collectPillTextActive: {
    color: '#2E7D32',
    fontWeight: '700',
  },
  minWeightBox: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 12,
  },
  minWeightText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  primaryBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 70,
    paddingHorizontal: 20,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  emptySub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 19,
  },
  trustedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  trustedPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2E7D32',
  },
  offerMainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  offerMainSub: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  offerMatRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
  },
  offerEscrowCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginTop: 6,
  },
  offerEscrowLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  offerEscrowTotal: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginTop: 6,
  },
  offerEscrowFormula: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  offerEscrowNote: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
    lineHeight: 17,
  },
  floatingMinaBtn: {
    position: 'absolute',
    bottom: 82,
    right: 16,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  modalBackdropBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  bottomSheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 34,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
  },
  sheetSub: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
    marginBottom: 14,
  },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  sheetRowText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  modalBackdropCenter: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    padding: 20,
  },
  deleteDialogCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
  },
  deleteTrashCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 14,
  },
  deleteDialogTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  deleteDialogSub: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 19,
  },
  deleteTextBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  deleteTextBtnLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
});
