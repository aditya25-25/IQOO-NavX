import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';

import { REGIONS } from './data/regions';

import {
  Coordinates,
  MapRegion,
  POI,
  PositionState,
  BatteryState,
  AICommandResult,
} from './types';

import {
  NavigationController,
  NavigationProgress,
} from './engine/navigationController';

import { PositionFusionManager } from './sensors/positionFusion';
import { RouteManager } from './engine/routeManager';
import { batteryManager } from './battery/batteryManager';
import { voiceEngine } from './voice/voiceGuidance';

import { authService } from './services/supabase/authService';
import { savedPlacesService } from './services/supabase/savedPlacesService';
import { preferencesService } from './services/supabase/preferencesService';
import { recentRoutesService } from './services/supabase/recentRoutesService';
import { User } from '@supabase/supabase-js';

import { SplashScreen } from './components/SplashScreen';
import { LandingPage } from './components/LandingPage';
import { NavigationHeader } from './components/NavigationHeader';
import { OriginIsland } from './components/OriginIsland';
import { MapView } from './components/MapView';
import { TurnGuidanceHUD } from './components/TurnGuidanceHUD';
import { RouteContextCard } from './components/RouteContextCard';
import { RoutePreviewCard } from './components/RoutePreviewCard';
import { HomeScreenOverlay } from './components/HomeScreenOverlay';
import { SearchScreen } from './components/SearchScreen';
import { DestinationDetailsModal } from './components/DestinationDetailsModal';
import { SavedLocationsScreen } from './components/SavedLocationsScreen';
import { DownloadRegionScreen } from './components/DownloadRegionScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { UltraNavOverlay } from './components/UltraNavOverlay';
import { VoiceAIPanel } from './components/VoiceAIPanel';
import { NavXEngineDrawer } from './components/NavXEngineDrawer';
import {
  BottomNavBar,
  TabType,
} from './components/BottomNavBar';
import { AuthModal } from './components/AuthModal';

import { Sparkles, Zap } from 'lucide-react';

export const App: React.FC = () => {
  // =========================================================
  // MAIN VIEW STATE
  // =========================================================

  const [viewMode, setViewMode] =
    useState<'app' | 'landing'>('app');

  const [showSplash, setShowSplash] =
    useState(false);

  // =========================================================
  // SUPABASE AUTHENTICATION & CLOUD STATE
  // =========================================================

  const [currentUser, setCurrentUser] =
    useState<User | null>(null);

  const [isAuthModalOpen, setIsAuthModalOpen] =
    useState(false);

  const [isSavedPlacesLoading, setIsSavedPlacesLoading] =
    useState(false);

  const [savedPlacesError, setSavedPlacesError] =
    useState<string | null>(null);

  // =========================================================
  // REGION & SAVED LOCATIONS
  // =========================================================

  const [activeRegion, setActiveRegion] =
    useState<MapRegion>(REGIONS[0]);

  const [savedLocations, setSavedLocations] =
    useState<POI[]>(
      REGIONS[0].pois.filter(
        (p) => p.isSaved
      )
    );

  const [activeTab, setActiveTab] =
    useState<TabType>('map');

  // =========================================================
  // INITIAL ORIGIN & DESTINATION
  // =========================================================

  const homePoi =
    activeRegion.pois.find(
      (p) => p.category === 'home'
    ) || activeRegion.pois[0];

  const collegePoi =
    activeRegion.pois.find(
      (p) => p.category === 'college'
    ) || activeRegion.pois[1];

  const [originCoord, setOriginCoord] =
    useState<Coordinates>(
      homePoi.coordinate
    );

  const [originName, setOriginName] =
    useState<string>(
      homePoi.name
    );

  const [selectedDestination, setSelectedDestination] =
    useState<POI | null>(
      collegePoi
    );

  const [detailedPoi, setDetailedPoi] =
    useState<POI | null>(null);

  // =========================================================
  // POSITION FUSION
  // =========================================================

  const positionManager = useMemo(
    () =>
      new PositionFusionManager(
        REGIONS[0].pois.find(
          (p) => p.category === 'home'
        )?.coordinate ||
          REGIONS[0].pois[0].coordinate
      ),
    []
  );

  const [posState, setPosState] =
    useState<PositionState>(
      positionManager.getState()
    );

  // =========================================================
  // ROUTE MANAGER
  // =========================================================

  // Start ONLINE.
  // Demo switches to offline at Step 6.
  const routeManager = useMemo(
    () => new RouteManager(false),
    []
  );

  const [isOfflineForced, setIsOfflineForced] =
    useState<boolean>(false);

  // =========================================================
  // NAVIGATION CONTROLLER
  // =========================================================

  // Keep ONE NavigationController instance alive.
  // Region changes are synchronized through setRegion().
  const navCtrl = useMemo(
    () =>
      new NavigationController(
        activeRegion,
        positionManager
      ),
    [positionManager]
  );

  const [navProgress, setNavProgress] =
    useState<NavigationProgress>(
      navCtrl.getProgress()
    );

  // =========================================================
  // BATTERY & AUDIO
  // =========================================================

  const [batteryState, setBatteryState] =
    useState<BatteryState>(
      batteryManager.getState()
    );

  const [isVoiceMuted, setIsVoiceMuted] =
    useState<boolean>(false);

  // =========================================================
  // MODALS & OVERLAYS
  // =========================================================

  const [isSearchScreenOpen, setIsSearchScreenOpen] =
    useState(false);

  const [isSavedLocationsOpen, setIsSavedLocationsOpen] =
    useState(false);

  const [isDownloadRegionOpen, setIsDownloadRegionOpen] =
    useState(false);

  const [isSettingsScreenOpen, setIsSettingsScreenOpen] =
    useState(false);

  const [isVoiceModalOpen, setIsVoiceModalOpen] =
    useState(false);

  const [isDestinationDetailsOpen, setIsDestinationDetailsOpen] =
    useState(false);

  const [isEngineDrawerOpen, setIsEngineDrawerOpen] =
    useState(false);

  const [isPhoneFrameView, setIsPhoneFrameView] =
    useState(true);

  const [toastMessage, setToastMessage] =
    useState<string | null>(null);

  const toastTimeoutRef =
    useRef<number | null>(null);

  // =========================================================
  // TOAST HELPER
  // =========================================================

  const showToast = useCallback(
    (message: string) => {
      if (
        toastTimeoutRef.current !== null
      ) {
        clearTimeout(
          toastTimeoutRef.current
        );

        toastTimeoutRef.current = null;
      }

      setToastMessage(message);

      toastTimeoutRef.current =
        window.setTimeout(() => {
          setToastMessage(null);
          toastTimeoutRef.current = null;
        }, 3500);
    },
    []
  );

  // =========================================================
  // SUPABASE CLOUD SYNC HELPERS
  // =========================================================

  const loadCloudSavedPlaces = useCallback(
    async (user: User | null) => {
      if (!user) {
        setSavedLocations(
          activeRegion.pois.filter(
            (p) => p.isSaved
          )
        );
        return;
      }

      try {
        setIsSavedPlacesLoading(true);
        setSavedPlacesError(null);

        const { data, error } =
          await savedPlacesService.fetchSavedPlaces();

        setIsSavedPlacesLoading(false);

        if (error) {
          setSavedPlacesError(error);
          showToast(`Cloud Sync: ${error}`);
        } else if (data && data.length > 0) {
          const cloudPois: POI[] = data.map((row) => ({
            id: row.id,
            name: row.name,
            category: 'work',
            coordinate: {
              lat: Number(row.latitude),
              lng: Number(row.longitude),
            },
            address: 'Supabase Cloud Saved Place',
            regionId: activeRegion.id,
            isSaved: true,
          }));

          setSavedLocations(cloudPois);
          showToast(`Synced ${cloudPois.length} saved place(s) from Supabase`);
        } else {
          setSavedLocations(
            activeRegion.pois.filter(
              (p) => p.isSaved
            )
          );
        }
      } catch (err) {
        setIsSavedPlacesLoading(false);
        console.warn('[IQOO NavX] Cloud saved places sync error:', err);
      }
    },
    [activeRegion, showToast]
  );

  const loadCloudPreferences = useCallback(
    async (user: User | null) => {
      if (!user) return;
      try {
        const { data } =
          await preferencesService.fetchPreferences();

        if (data && data.voice_enabled !== undefined) {
          const muted = !data.voice_enabled;
          setIsVoiceMuted(muted);
          voiceEngine.setMuted(muted);
        }
      } catch (err) {
        console.warn('[IQOO NavX] Cloud preferences sync error:', err);
      }
    },
    []
  );

  // =========================================================
  // SUPABASE AUTH INITIALIZATION & SUBSCRIPTION
  // =========================================================

  useEffect(() => {
    try {
      authService
        .getCurrentUser()
        .then((user) => {
          setCurrentUser(user);
          if (user) {
            loadCloudSavedPlaces(user);
            loadCloudPreferences(user);
          }
        })
        .catch((err) => {
          console.warn('[IQOO NavX] Auth check fallback:', err);
        });

      const { data: authListener } = authService.onAuthStateChange(
        (_event, session) => {
          const user = session?.user ?? null;
          setCurrentUser(user);
          if (user) {
            loadCloudSavedPlaces(user);
            loadCloudPreferences(user);
          }
        }
      );

      return () => {
        authListener?.subscription?.unsubscribe?.();
      };
    } catch (err) {
      console.warn('[IQOO NavX] Auth listener initialization fallback:', err);
    }
  }, [loadCloudSavedPlaces, loadCloudPreferences]);

  // =========================================================
  // SUBSCRIPTIONS
  // =========================================================

  useEffect(() => {
    const unsubPos =
      positionManager.subscribe((state) => {
        setPosState(state);
      });

    const unsubNav =
      navCtrl.subscribe((progress) => {
        setNavProgress(progress);
      });

    const unsubBat =
      batteryManager.subscribe((battery) => {
        setBatteryState(battery);

        if (battery.isUltraMode) {
          document.body.classList.add(
            'ultra-mode'
          );
        } else {
          document.body.classList.remove(
            'ultra-mode'
          );
        }
      });

    return () => {
      unsubPos();
      unsubNav();
      unsubBat();
    };
  }, [positionManager, navCtrl]);

  useEffect(() => {
    return () => {
      positionManager.destroy();
    };
  }, [positionManager]);

  useEffect(() => {
    return () => {
      if (
        toastTimeoutRef.current !== null
      ) {
        clearTimeout(
          toastTimeoutRef.current
        );

        toastTimeoutRef.current = null;
      }
    };
  }, []);

  // =========================================================
  // REGION SYNC
  // =========================================================

  useEffect(() => {
    navCtrl.setRegion(activeRegion);

    if (!currentUser) {
      setSavedLocations(
        activeRegion.pois.filter(
          (p) => p.isSaved
        )
      );
    }

    const newHome =
      activeRegion.pois.find(
        (p) => p.category === 'home'
      ) || activeRegion.pois[0];

    const newDest =
      activeRegion.pois.find(
        (p) => p.category === 'college'
      ) || activeRegion.pois[1];

    setOriginCoord(newHome.coordinate);
    setOriginName(newHome.name);
    setSelectedDestination(newDest);
  }, [activeRegion, navCtrl, currentUser]);

  // =========================================================
  // HANDLERS
  // =========================================================

  const handleLaunchApp = () => {
    setShowSplash(true);
    setViewMode('app');
  };

  const handleCalculateRoute =
    async (destination: POI) => {
      setSelectedDestination(destination);

      const result =
        await routeManager.calculateRoute(
          originCoord,
          originName,
          destination.coordinate,
          destination.name,
          activeRegion
        );

      if (result) {
        navCtrl.startPreview(result.route);

        showToast(
          result.source === 'offline'
            ? `Calculated offline graph route: ${(
                result.route
                  .totalDistanceMeters /
                1000
              ).toFixed(1)} km`
            : `Calculated online route: ${(
                result.route
                  .totalDistanceMeters /
                1000
              ).toFixed(1)} km`
        );

        if (currentUser) {
          recentRoutesService.recordRecentRoute(
            destination.name,
            result.route.totalDistanceMeters,
            result.route.totalDurationSeconds
          );
        }
      } else {
        showToast(
          'Could not calculate route for this destination.'
        );
      }
    };

  const handleStartNavigation =
    async () => {
      if (
        !navProgress.activeRoute &&
        selectedDestination
      ) {
        const result =
          await routeManager.calculateRoute(
            originCoord,
            originName,
            selectedDestination.coordinate,
            selectedDestination.name,
            activeRegion
          );

        if (result) {
          navCtrl.startNavigation(
            result.route
          );

          if (currentUser) {
            recentRoutesService.recordRecentRoute(
              selectedDestination.name,
              result.route.totalDistanceMeters,
              result.route.totalDurationSeconds
            );
          }
        }
      } else if (
        navProgress.activeRoute
      ) {
        navCtrl.startNavigation();

        if (currentUser && selectedDestination) {
          recentRoutesService.recordRecentRoute(
            selectedDestination.name,
            navProgress.activeRoute.totalDistanceMeters,
            navProgress.activeRoute.totalDurationSeconds
          );
        }
      }
    };

  const handleExecuteAICommand =
    (result: AICommandResult) => {
      setIsVoiceModalOpen(false);

      if (result.intent === 'STOP_NAV') {
        navCtrl.stopNavigation();
        showToast(
          'Navigation stopped via voice command'
        );
      } else if (
        result.intent === 'REROUTE'
      ) {
        navCtrl.simulateMissedTurn();
        showToast(
          'Offline reroute triggered via voice command'
        );
      } else if (
        result.intent === 'NAVIGATE' ||
        result.intent === 'GO_HOME' ||
        result.intent === 'GO_SAVED'
      ) {
        if (result.matchedPOI) {
          handleCalculateRoute(
            result.matchedPOI
          );

          window.setTimeout(() => {
            navCtrl.startNavigation();
          }, 600);
        } else if (
          selectedDestination
        ) {
          handleCalculateRoute(
            selectedDestination
          );

          window.setTimeout(() => {
            navCtrl.startNavigation();
          }, 600);
        }
      }
    };

  const handleSelectTab = (
    tab: TabType
  ) => {
    setActiveTab(tab);

    if (tab === 'saved') {
      setIsSavedLocationsOpen(true);
    } else if (tab === 'regions') {
      setIsDownloadRegionOpen(true);
    } else if (tab === 'settings') {
      setIsSettingsScreenOpen(true);
    }
  };

  const handleAddSavedLocation = async (newPoi: POI) => {
    setSavedLocations((prev) => [newPoi, ...prev]);

    if (currentUser) {
      const { data, error } = await savedPlacesService.createSavedPlace(
        newPoi.name,
        newPoi.coordinate.lat,
        newPoi.coordinate.lng
      );

      if (error) {
        showToast(`Saved locally (Cloud sync failed: ${error})`);
      } else if (data) {
        setSavedLocations((prev) =>
          prev.map((p) => (p.id === newPoi.id ? { ...p, id: data.id } : p))
        );
        showToast(`Saved "${newPoi.name}" to Supabase cloud`);
      }
    } else {
      showToast(`Added "${newPoi.name}" to offline saved places`);
    }
  };

  const handleDeleteSavedLocation = async (id: string) => {
    setSavedLocations((prev) => prev.filter((p) => p.id !== id));

    if (currentUser) {
      const { error } = await savedPlacesService.deleteSavedPlace(id);
      if (error) {
        showToast(`Deleted locally (Cloud sync error: ${error})`);
      } else {
        showToast('Deleted place from Supabase cloud');
      }
    } else {
      showToast('Removed saved location');
    }
  };

  const handleToggleSavePOI = (poi: POI) => {
    const exists = savedLocations.some(
      (p) => p.id === poi.id || p.name === poi.name
    );

    if (exists) {
      const existing = savedLocations.find(
        (p) => p.id === poi.id || p.name === poi.name
      );
      if (existing) {
        handleDeleteSavedLocation(existing.id);
      }
    } else {
      handleAddSavedLocation({ ...poi, isSaved: true });
    }
  };

  const handleUpdatePreferences = async (prefs: {
    voice_enabled?: boolean;
    dark_mode?: boolean;
  }) => {
    if (currentUser) {
      await preferencesService.savePreferences(prefs);
    }
  };

  // =========================================================
  // DEMO DISPATCHER
  // =========================================================

  const handleRunDemoStep = (
    stepNumber: number
  ) => {
    switch (stepNumber) {
      case 1:
        setShowSplash(true);
        break;

      case 2:
        setIsDownloadRegionOpen(true);
        showToast(
          'Step 2: Viewing Regional Offline Map Packages'
        );
        break;

      case 3:
        if (collegePoi) {
          setSelectedDestination(
            collegePoi
          );
          setDetailedPoi(collegePoi);
          setIsDestinationDetailsOpen(
            true
          );
        }
        showToast(
          'Step 3: Selected Destination (College)'
        );
        break;

      case 4:
        if (collegePoi) {
          handleCalculateRoute(
            collegePoi
          );
        }
        showToast(
          'Step 4: Calculated Route'
        );
        break;

      case 5:
        handleStartNavigation();
        showToast(
          'Step 5: Started Turn-by-Turn Navigation'
        );
        break;

      case 6:
      case 7:
        setIsOfflineForced(true);
        routeManager.setOfflineSimulation(
          true
        );
        showToast(
          'Step 6 & 7: Internet Disabled — Offline Navigation Active'
        );
        break;

      case 9:
      case 10:
        positionManager.setGpsQuality(
          'weak'
        );
        showToast(
          'Step 9 & 10: GPS Weak — 6-DOF Sensor Dead Reckoning Active'
        );
        break;

      case 11:
      case 12:
        navCtrl.simulateMissedTurn();
        showToast(
          'Step 11 & 12: Missed Turn Detected — Instant Offline Reroute'
        );
        break;

      case 13:
      case 14:
        positionManager.setGpsQuality(
          'strong'
        );
        showToast(
          'Step 13 & 14: Restored GPS — Position Corrected Smoothly'
        );
        break;

      case 15:
        setIsVoiceModalOpen(true);
        showToast(
          'Step 15: AI Voice Navigation Engine Ready'
        );
        break;

      case 17:
        showToast(
          'Step 17: Origin Island Live Status Component Active'
        );
        break;

      case 18:
      case 19:
        batteryManager.toggleUltraMode(
          true
        );
        showToast(
          'Step 18 & 19: Low Battery — Ultra Navigation Mode Active'
        );
        break;

      default:
        break;
    }
  };

  // =========================================================
  // DERIVED STATE
  // =========================================================

  const isNavigating =
    navProgress.status ===
      'navigating' ||
    navProgress.status === 'rerouting';

  const isPreviewing =
    navProgress.status ===
      'previewing' &&
    navProgress.activeRoute !== null;

  const isIdle =
    navProgress.status === 'idle';

  // =========================================================
  // RENDER: LANDING PAGE
  // =========================================================

  if (viewMode === 'landing') {
    return (
      <LandingPage
        onLaunchApp={handleLaunchApp}
      />
    );
  }

  // =========================================================
  // RENDER: MAIN APPLICATION
  // =========================================================

  return (
    <div className="min-h-screen bg-[#08090A] text-[#F5F7F8] flex flex-col items-center justify-start relative overflow-x-hidden font-sans">
      {/* 1. App Launch Splash Screen */}
      {showSplash && (
        <SplashScreen
          onComplete={() =>
            setShowSplash(false)
          }
        />
      )}

      {/* Header */}
      <NavigationHeader
        isNavigating={isNavigating}
        isOffline={isOfflineForced}
        posState={posState}
        batteryState={batteryState}
        currentUser={currentUser}
        onOpenAuth={() =>
          setIsAuthModalOpen(true)
        }
        onBackOrStopNav={() =>
          navCtrl.stopNavigation()
        }
        onToggleViewMode={() =>
          setViewMode('landing')
        }
        isPhoneFrameView={
          isPhoneFrameView
        }
        onTogglePhoneFrame={() =>
          setIsPhoneFrameView(
            !isPhoneFrameView
          )
        }
      />

      {/* Main Content */}
      <main
        className={`w-full flex-1 flex flex-col items-center justify-start p-0 sm:py-2 transition-all ${
          isPhoneFrameView
            ? 'max-w-md'
            : 'max-w-6xl'
        }`}
      >
        <div
          className={`w-full flex-1 flex flex-col bg-[#08090A] sm:rounded-3xl border border-[#2B2F33] shadow-2xl relative overflow-hidden ${
            isPhoneFrameView
              ? 'min-h-[820px] max-h-[880px]'
              : 'min-h-[720px]'
          }`}
        >
          {/* Origin Island */}
          <OriginIsland
            navProgress={navProgress}
            posState={posState}
            batteryState={batteryState}
            isOffline={isOfflineForced}
            onToggleUltraMode={() =>
              batteryManager.toggleUltraMode()
            }
          />

          {/* Turn Guidance HUD */}
          <TurnGuidanceHUD
            progress={navProgress}
            posState={posState}
            activeRoute={
              navProgress.activeRoute
            }
            isMuted={isVoiceMuted}
            isOffline={isOfflineForced}
            onToggleMute={() => {
              const muted =
                !isVoiceMuted;

              setIsVoiceMuted(muted);
              voiceEngine.setMuted(
                muted
              );
              handleUpdatePreferences({
                voice_enabled: !muted,
              });
            }}
            onStopNav={() =>
              navCtrl.stopNavigation()
            }
            onReroute={() =>
              navCtrl.simulateMissedTurn()
            }
            onOpenVoice={() =>
              setIsVoiceModalOpen(true)
            }
          />

          {/* Interactive Map */}
          <div className="flex-1 w-full relative min-h-[420px]">
            <MapView
              currentPosition={
                posState.currentPosition
              }
              positionState={posState}
              activeRoute={
                navProgress.activeRoute
              }
              activeRegion={
                activeRegion
              }
              savedLocations={
                savedLocations
              }
              isUltraMode={
                batteryState.isUltraMode
              }
              onSelectPOI={(poi) => {
                setDetailedPoi(poi);
                setIsDestinationDetailsOpen(
                  true
                );
              }}
            />

            {/* Home Screen Overlay */}
            {isIdle && (
              <HomeScreenOverlay
                activeRegion={
                  activeRegion
                }
                savedLocations={
                  savedLocations
                }
                posState={posState}
                batteryState={
                  batteryState
                }
                isOffline={
                  isOfflineForced
                }
                onOpenSearch={() =>
                  setIsSearchScreenOpen(
                    true
                  )
                }
                onOpenVoice={() =>
                  setIsVoiceModalOpen(
                    true
                  )
                }
                onOpenSavedLocations={() =>
                  setIsSavedLocationsOpen(
                    true
                  )
                }
                onOpenDownloadRegion={() =>
                  setIsDownloadRegionOpen(
                    true
                  )
                }
                onSelectDestination={(
                  poi
                ) => {
                  setDetailedPoi(poi);
                  setIsDestinationDetailsOpen(
                    true
                  );
                }}
                onOpenEngineDrawer={() =>
                  setIsEngineDrawerOpen(
                    true
                  )
                }
              />
            )}

            {/* Route Context Card */}
            {isNavigating &&
              navProgress.activeRoute && (
                <div className="absolute bottom-3 left-0 right-0 z-30 pointer-events-none">
                  <RouteContextCard
                    context={
                      navProgress
                        .activeRoute
                        .context
                    }
                  />
                </div>
              )}
          </div>

          {/* Route Preview Card */}
          {isPreviewing &&
            navProgress.activeRoute && (
              <RoutePreviewCard
                route={
                  navProgress.activeRoute
                }
                onStartNavigation={
                  handleStartNavigation
                }
                onCancel={() =>
                  navCtrl.stopNavigation()
                }
              />
            )}

          {/* Low Battery Warning */}
          {batteryState.isLowBattery &&
            !batteryState.isUltraMode && (
              <div className="mx-4 my-2 p-3 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-200 flex items-center justify-between z-30 select-none">
                <div className="flex items-center gap-2">
                  <Zap
                    size={16}
                    className="text-[#FFD400] animate-pulse"
                  />
                  <span className="text-xs font-semibold">
                    Battery low (
                    {Math.round(
                      batteryState.level *
                        100
                    )}
                    %) — Ultra Navigation
                    Mode recommended
                  </span>
                </div>
                <button
                  onClick={() =>
                    batteryManager.toggleUltraMode(
                      true
                    )
                  }
                  className="px-3 py-1 rounded-xl bg-[#FFD400] text-black font-extrabold text-xs hover:bg-[#e6bf00] transition-colors font-display"
                >
                  Enable
                </button>
              </div>
            )}

          {/* Bottom Bar */}
          <BottomNavBar
            activeTab={activeTab}
            onChangeTab={
              handleSelectTab
            }
            isNavigating={
              isNavigating
            }
          />

          {/* Toast Notification */}
          {toastMessage && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#FFD400] text-black font-extrabold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 font-display">
              <Sparkles size={14} />
              <span>
                {toastMessage}
              </span>
            </div>
          )}

          {/* Ultra Navigation Overlay */}
          {batteryState.isUltraMode && (
            <UltraNavOverlay
              navProgress={
                navProgress
              }
              posState={posState}
              batteryState={
                batteryState
              }
              isVoiceMuted={
                isVoiceMuted
              }
              onToggleMute={() => {
                const muted =
                  !isVoiceMuted;

                setIsVoiceMuted(muted);
                voiceEngine.setMuted(
                  muted
                );
                handleUpdatePreferences({
                  voice_enabled: !muted,
                });
              }}
              onExitUltraMode={() =>
                batteryManager.toggleUltraMode(
                  false
                )
              }
            />
          )}
        </div>
      </main>

      {/* NavX Engine Drawer */}
      <NavXEngineDrawer
        isOpen={isEngineDrawerOpen}
        onClose={() =>
          setIsEngineDrawerOpen(false)
        }
        isOffline={isOfflineForced}
        onToggleInternet={() => {
          const nextState =
            !isOfflineForced;

          setIsOfflineForced(
            nextState
          );

          routeManager.setOfflineSimulation(
            nextState
          );

          showToast(
            nextState
              ? 'Simulating Offline Mode (No Internet)'
              : 'Simulating Online Mode'
          );
        }}
        posState={posState}
        onSetGpsQuality={(quality) => {
          positionManager.setGpsQuality(
            quality,
            collegePoi.coordinate
          );

          showToast(
            quality === 'weak'
              ? 'GPS Weak — Position Fusion switched to IMU Dead Reckoning'
              : 'GPS Restored — Position smoothly corrected'
          );
        }}
        onSimulateMissedTurn={() => {
          navCtrl.simulateMissedTurn();
          showToast(
            'Missed turn simulated! Calculating offline alternative route...'
          );
        }}
        batteryState={batteryState}
        onSetBatteryLevel={(lvl) =>
          batteryManager.setSimulatedBatteryLevel(
            lvl
          )
        }
        onToggleUltraMode={() =>
          batteryManager.toggleUltraMode()
        }
        navProgress={navProgress}
        onRunAutoDemoStep={(step) =>
          handleRunDemoStep(step)
        }
      />

      {/* Overlays & Modals */}
      <SearchScreen
        isOpen={isSearchScreenOpen}
        onClose={() =>
          setIsSearchScreenOpen(false)
        }
        activeRegion={activeRegion}
        currentCoord={
          posState.currentPosition
        }
        savedLocations={savedLocations}
        onSelectDestination={(poi) => {
          setIsSearchScreenOpen(false);
          setDetailedPoi(poi);
          setIsDestinationDetailsOpen(
            true
          );
        }}
        onOpenVoice={() =>
          setIsVoiceModalOpen(true)
        }
      />

      <DestinationDetailsModal
        isOpen={
          isDestinationDetailsOpen
        }
        poi={detailedPoi}
        onClose={() =>
          setIsDestinationDetailsOpen(
            false
          )
        }
        currentCoord={
          posState.currentPosition
        }
        onStartRoute={(poi) => {
          setIsDestinationDetailsOpen(
            false
          );
          handleCalculateRoute(poi);
        }}
        onToggleSave={handleToggleSavePOI}
        onOpenVoice={() =>
          setIsVoiceModalOpen(true)
        }
      />

      <SavedLocationsScreen
        isOpen={isSavedLocationsOpen}
        onClose={() => {
          setIsSavedLocationsOpen(
            false
          );
          setActiveTab('map');
        }}
        savedLocations={savedLocations}
        currentCoord={
          posState.currentPosition
        }
        currentUser={currentUser}
        isLoading={isSavedPlacesLoading}
        errorMessage={savedPlacesError}
        onRefresh={() =>
          loadCloudSavedPlaces(
            currentUser
          )
        }
        onOpenAuth={() =>
          setIsAuthModalOpen(true)
        }
        onSelectDestination={(poi) => {
          setIsSavedLocationsOpen(
            false
          );
          handleCalculateRoute(poi);
        }}
        onAddLocation={
          handleAddSavedLocation
        }
        onDeleteLocation={
          handleDeleteSavedLocation
        }
      />

      <DownloadRegionScreen
        isOpen={isDownloadRegionOpen}
        onClose={() => {
          setIsDownloadRegionOpen(
            false
          );
          setActiveTab('map');
        }}
        activeRegion={activeRegion}
        onSelectRegion={(reg) => {
          setActiveRegion(reg);
          showToast(
            `Active offline region set to: ${reg.name}`
          );
        }}
      />

      <SettingsScreen
        isOpen={isSettingsScreenOpen}
        onClose={() => {
          setIsSettingsScreenOpen(
            false
          );
          setActiveTab('map');
        }}
        batteryState={batteryState}
        currentUser={currentUser}
        onOpenAuth={() =>
          setIsAuthModalOpen(true)
        }
        onUpdatePreferences={
          handleUpdatePreferences
        }
        onToggleUltraMode={() =>
          batteryManager.toggleUltraMode()
        }
        isVoiceMuted={isVoiceMuted}
        onToggleMute={() => {
          const muted =
            !isVoiceMuted;

          setIsVoiceMuted(muted);
          voiceEngine.setMuted(
            muted
          );
          handleUpdatePreferences({
            voice_enabled: !muted,
          });
        }}
      />

      <VoiceAIPanel
        isOpen={isVoiceModalOpen}
        onClose={() =>
          setIsVoiceModalOpen(false)
        }
        activeRegion={activeRegion}
        savedLocations={savedLocations}
        onExecuteCommand={
          handleExecuteAICommand
        }
      />

      {/* Supabase Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() =>
          setIsAuthModalOpen(false)
        }
        currentUser={currentUser}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          loadCloudSavedPlaces(user);
          loadCloudPreferences(user);
        }}
      />
    </div>
  );
};

export default App;
