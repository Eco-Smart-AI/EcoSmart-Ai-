import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  List,
  Map as MapIcon,
  Filter,
  Sparkles,
  MapPin,
  ChevronDown,
  ChevronUp,
  Package,
  Search,
  Bell,
  Check,
  AlertCircle,
  Home as HomeIcon,
  Scan,
  Inbox,
  User,
} from 'lucide-react-native';

import { AppHeader } from '../../components/common/AppHeader';
import { TopGreenWave } from '../../components/common/TopGreenWave';
import { BottomNavBar } from '../../components/common/BottomNavBar';
import { RecyclerCard } from '../../components/recyclers/RecyclerCard';
import { InteractiveMapView } from '../../components/recyclers/InteractiveMapView';
import { AutoMatchBottomSheet } from '../../components/sheets/AutoMatchBottomSheet';
import { LanguageBottomSheet } from '../../components/sheets/LanguageBottomSheet';
import { MOCK_RECYCLERS } from '../../data/mockRecyclers';
import { Recycler, RecyclerFilter, RecyclerSort } from '../../types/recycler';

export default function RecyclersScreen() {
  const router = useRouter();
  const { t } = useTranslation();

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filter, setFilter] = useState<RecyclerFilter>('all');
  const [sortBy, setSortBy] = useState<RecyclerSort>('best_match');
  const [showClosed, setShowClosed] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false); // Demo switcher for "No local match"
  const [selectedRecycler, setSelectedRecycler] = useState<Recycler>(MOCK_RECYCLERS[0]);
  const [autoMatchSheetVisible, setAutoMatchSheetVisible] = useState(false);
  const [langSheetVisible, setLangSheetVisible] = useState(false);
  const [userWeightKg, setUserWeightKg] = useState<number>(3);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter recyclers
  const filteredRecyclers = useMemo(() => {
    let list = [...MOCK_RECYCLERS];

    if (filter === 'pickup') {
      list = list.filter((r) => r.pickupAvailable);
    } else if (filter === 'dropoff') {
      list = list.filter((r) => r.dropoffAvailable);
    } else if (filter === 'open') {
      list = list.filter((r) => r.openToday);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.address.toLowerCase().includes(q) ||
          r.serviceAreas.some((a) => a.toLowerCase().includes(q))
      );
    }

    // Sort
    if (sortBy === 'best_rate') {
      list.sort((a, b) => b.rates.pet - a.rates.pet);
    } else if (sortBy === 'nearest') {
      list.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return list;
  }, [filter, sortBy, searchQuery]);

  const openRecyclers = filteredRecyclers.filter((r) => r.openToday);
  const closedRecyclers = filteredRecyclers.filter((r) => !r.openToday);

  const handleViewDetails = (recycler: Recycler) => {
    router.push({
      pathname: `/recyclers/[id]` as any,
      params: { id: recycler.id, weight: userWeightKg.toString() },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 1. Header (White Nav Bar + Small Green Wave Strip) */}
      <AppHeader
        showBack
        onOpenLanguage={() => setLangSheetVisible(true)}
      />

      {/* Content wrapper with max-width phone frame */}
      <View style={styles.container}>
        {/* Context Bar: Item & Location */}
        <View style={styles.contextBar}>
          <View style={styles.contextRow}>
            <View style={styles.contextLeft}>
              <Package size={15} color="#2D6A2E" />
              <Text style={styles.contextTitle}>PET bottles · ~{userWeightKg} kg</Text>
              <Text style={styles.contextSub}>From your scan</Text>
            </View>
            <TouchableOpacity
              style={styles.editPill}
              onPress={() => setUserWeightKg(userWeightKg === 3 ? 6 : 3)}
              activeOpacity={0.7}
            >
              <Text style={styles.editPillText}>
                {userWeightKg === 3 ? 'Set 6kg' : 'Set 3kg'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contextDivider} />

          <View style={styles.contextRow}>
            <View style={styles.contextLeft}>
              <MapPin size={15} color="#64748B" />
              <Text style={styles.contextLocation}>Kubwa, Abuja</Text>
              <Text style={styles.contextSub}>Saved address</Text>
            </View>
            <TouchableOpacity style={styles.editPill} activeOpacity={0.7}>
              <Text style={styles.editPillText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* View Mode Toggle: List vs Map */}
        <View style={styles.toggleRow}>
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[
                styles.segmentBtn,
                viewMode === 'list' && styles.segmentBtnActive,
              ]}
              onPress={() => setViewMode('list')}
              activeOpacity={0.8}
            >
              <List
                size={16}
                color={viewMode === 'list' ? '#0F1E12' : '#64748B'}
              />
              <Text
                style={[
                  styles.segmentText,
                  viewMode === 'list' && styles.segmentTextActive,
                ]}
              >
                List
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentBtn,
                viewMode === 'map' && styles.segmentBtnActive,
              ]}
              onPress={() => setViewMode('map')}
              activeOpacity={0.8}
            >
              <MapIcon
                size={16}
                color={viewMode === 'map' ? '#0F1E12' : '#64748B'}
              />
              <Text
                style={[
                  styles.segmentText,
                  viewMode === 'map' && styles.segmentTextActive,
                ]}
              >
                Map
              </Text>
            </TouchableOpacity>
          </View>

          {/* Demo toggle for "No match" state */}
          <TouchableOpacity
            style={styles.demoTogglePill}
            onPress={() => setShowEmptyState(!showEmptyState)}
            activeOpacity={0.7}
          >
            <Text style={styles.demoToggleText}>
              {showEmptyState ? 'Demo: Matches' : 'Demo: No Match'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={styles.filtersWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            <TouchableOpacity
              style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
              onPress={() => setFilter('all')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter === 'all' && styles.filterChipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, filter === 'pickup' && styles.filterChipActive]}
              onPress={() => setFilter('pickup')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter === 'pickup' && styles.filterChipTextActive,
                ]}
              >
                Pickup
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, filter === 'dropoff' && styles.filterChipActive]}
              onPress={() => setFilter('dropoff')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter === 'dropoff' && styles.filterChipTextActive,
                ]}
              >
                Drop-off
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, filter === 'open' && styles.filterChipActive]}
              onPress={() => setFilter('open')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filter === 'open' && styles.filterChipTextActive,
                ]}
              >
                Open now
              </Text>
            </TouchableOpacity>

            {/* Sort Switcher */}
            <TouchableOpacity
              style={styles.sortPill}
              onPress={() =>
                setSortBy(
                  sortBy === 'best_match'
                    ? 'best_rate'
                    : sortBy === 'best_rate'
                    ? 'nearest'
                    : 'best_match'
                )
              }
              activeOpacity={0.7}
            >
              <Filter size={12} color="#15803D" />
              <Text style={styles.sortPillText}>
                {sortBy === 'best_match'
                  ? 'Best match'
                  : sortBy === 'best_rate'
                  ? 'Best rate'
                  : 'Nearest'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* MAIN BODY: NO MATCH STATE OR NORMAL (LIST / MAP) */}
        {showEmptyState ? (
          /* Recyclers near you · No local match [ref 94_26174] */
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.emptyScroll}
          >
            <View style={styles.noMatchCard}>
              <View style={styles.alertIconBox}>
                <AlertCircle size={24} color="#B45309" />
              </View>
              <Text style={styles.noMatchTitle}>
                No recyclers for PET in Kubwa yet
              </Text>
              <Text style={styles.noMatchDesc}>
                No local match for this search right now. Try a wider area or a drop-off hub.
              </Text>

              <TouchableOpacity
                style={styles.widenSearchBtn}
                onPress={() => setShowEmptyState(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.widenSearchBtnText}>Widen search to 10 km</Text>
              </TouchableOpacity>

              <View style={styles.emptyActionsRow}>
                <TouchableOpacity
                  style={styles.notifyBtn}
                  activeOpacity={0.7}
                  onPress={() => alert('We will notify you via SMS when a recycler is in your area!')}
                >
                  <Bell size={14} color="#1E293B" />
                  <Text style={styles.notifyBtnText}>Notify me</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.seeHubsBtn}
                  activeOpacity={0.7}
                  onPress={() => setShowEmptyState(false)}
                >
                  <Text style={styles.seeHubsBtnText}>See drop-off hubs in Abuja</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Keep your PET ready advice */}
            <View style={styles.adviceBox}>
              <Text style={styles.adviceTitle}>Keep your PET ready</Text>
              <Text style={styles.adviceText}>
                Keep bottles clean and dry while we find a recycler. Your scan is saved.
              </Text>
            </View>
          </ScrollView>
        ) : viewMode === 'map' ? (
          /* G-F01m: Map View */
          <InteractiveMapView
            recyclers={MOCK_RECYCLERS}
            selectedRecycler={selectedRecycler}
            onSelectRecycler={(r) => setSelectedRecycler(r)}
            onViewDetails={handleViewDetails}
            userWeightKg={userWeightKg}
          />
        ) : (
          /* G-F01: List View */
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listScroll}
          >
            {/* Counter */}
            <Text style={styles.counterText}>
              {MOCK_RECYCLERS.length} recyclers buy PET within 5 km
            </Text>

            {/* Recycler Cards */}
            {openRecyclers.map((recycler, index) => (
              <RecyclerCard
                key={recycler.id}
                recycler={recycler}
                isBestMatch={index === 0 && sortBy === 'best_match'}
                userWeightKg={userWeightKg}
                onViewDetails={handleViewDetails}
              />
            ))}

            {/* Closed Recyclers Accordion */}
            {closedRecyclers.length > 0 && (
              <View style={styles.accordionSection}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() => setShowClosed(!showClosed)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.accordionHeaderText}>
                    {closedRecyclers.length} more recyclers are closed today
                  </Text>
                  <Text style={styles.accordionActionText}>
                    {showClosed ? 'Hide' : 'Show'}
                  </Text>
                  {showClosed ? (
                    <ChevronUp size={16} color="#2D6A2E" />
                  ) : (
                    <ChevronDown size={16} color="#2D6A2E" />
                  )}
                </TouchableOpacity>

                {showClosed && (
                  <View style={{ marginTop: 10 }}>
                    {closedRecyclers.map((recycler) => (
                      <RecyclerCard
                        key={recycler.id}
                        recycler={recycler}
                        userWeightKg={userWeightKg}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* "Not sure who to pick?" Card (G-F08 trigger) */}
            <View style={styles.matchPromptCard}>
              <View style={styles.matchIconCircle}>
                <Sparkles size={20} color="#15803D" />
              </View>
              <Text style={styles.matchPromptTitle}>Not sure who to pick?</Text>
              <Text style={styles.matchPromptDesc}>
                Send one request to nearby recyclers who pick up ~{userWeightKg} kg. The first to accept takes it.
              </Text>
              <TouchableOpacity
                style={styles.matchPromptBtn}
                onPress={() => setAutoMatchSheetVisible(true)}
                activeOpacity={0.85}
              >
                <Sparkles size={16} color="#FFFFFF" />
                <Text style={styles.matchPromptBtnText}>Let EcoSmart match me</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* Global Bottom Navigation Tabs */}
        <BottomNavBar activeTab="requests" />
      </View>

      {/* Auto-Match Modal Sheet (G-F08) */}
      <AutoMatchBottomSheet
        visible={autoMatchSheetVisible}
        onClose={() => setAutoMatchSheetVisible(false)}
        onSubmit={(data) => {
          alert(`Match request sent for ${data.day} (${data.timeSlot})! Recyclers are reviewing.`);
        }}
        weightKg={userWeightKg}
      />

      {/* Language Switcher Sheet */}
      <LanguageBottomSheet
        visible={langSheetVisible}
        onClose={() => setLangSheetVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  contextBar: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 5,
  },
  contextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contextLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  contextTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F1E12',
  },
  contextLocation: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F1E12',
  },
  contextSub: {
    fontSize: 11,
    color: '#64748B',
  },
  contextDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  editPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  editPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2D6A2E',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    zIndex: 5,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  segmentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  segmentTextActive: {
    fontWeight: '800',
    color: '#0F1E12',
  },
  demoTogglePill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: '#EAF5EA',
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  demoToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1B5E20',
  },
  filtersWrapper: {
    marginBottom: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#0F1E12',
    borderColor: '#0F1E12',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#334155',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    backgroundColor: '#EAF5EA',
    borderWidth: 1,
    borderColor: '#D5E8C8',
  },
  sortPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
  listScroll: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  counterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  accordionSection: {
    marginBottom: 16,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  accordionHeaderText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#475569',
    flex: 1,
  },
  accordionActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2D6A2E',
    marginRight: 4,
  },
  matchPromptCard: {
    backgroundColor: '#F1F8EE',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#D5E8C8',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  matchIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  matchPromptTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F1E12',
    marginBottom: 4,
  },
  matchPromptDesc: {
    fontSize: 12.5,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  matchPromptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0F1E12',
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 12,
  },
  matchPromptBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyScroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  noMatchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FED7AA',
    alignItems: 'center',
    marginBottom: 16,
  },
  alertIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  noMatchTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#92400E',
    textAlign: 'center',
    marginBottom: 6,
  },
  noMatchDesc: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  widenSearchBtn: {
    backgroundColor: '#0F1E12',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  widenSearchBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyActionsRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  notifyBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  notifyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  seeHubsBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
  },
  seeHubsBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  adviceBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  adviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F1E12',
    marginBottom: 4,
  },
  adviceText: {
    fontSize: 12.5,
    color: '#64748B',
    lineHeight: 17,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    paddingHorizontal: 12,
  },
  navItemText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    fontWeight: '600',
  },
  navItemTextActive: {
    color: '#2D6A2E',
    fontWeight: '700',
  },
});
