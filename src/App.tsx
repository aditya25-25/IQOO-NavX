import React, { useState, useEffect, useMemo } from 'react';
import { REGIONS } from './data/regions';
import { Coordinates, MapRegion, POI, PositionState, BatteryState, AICommandResult } from './types';
import { PositionFusionManager } from './sensors/positionFusion';
import { NavigationController, NavigationProgress } from './engine/navigationController';
import { RouteManager } from './engine/routeManager';
import { batteryManager } from './battery/batteryManager';
import { voiceEngine } from './voice/voiceGuidance';
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
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { 
  Sparkles,
  Zap
} from 'lucide-react';

export const App: React.FC = () => {
  // Main View State: default to 'app' for immediate navigation experience
  const [viewMode, setViewMode] = useState<'app' | 'landing'>('app');

  // App Launch Splash State
  const [showSplash, setShowSplash] = useState(false);

  // Region & Saved Places
  const [activeRegion, setActiveRegion] = useState<MapRegion>(REGIONS[0]);
  const [savedLocations, setSavedLocations] = useState<POI[]>(
    REGIONS[0].pois.filter((p) => p.isSaved)
  );

  // Active Bottom Tab
  const [activeTab, setActiveTab] = useState<TabType>('map');

  // Initial Origin (Home) & Destination (College)
  const homePoi = activeRegion.pois.find((p) => p.category === 'home') || activeRegion.pois[0];
  const collegePoi = activeRegion.pois.find((p) => p.category === 'college') || activeRegion.pois[1];

  const [originCoord, setOriginCoord] = useState<Coordinates>(homePoi.coordinate);
  const [originName, setOriginName] = useState<string>(homePoi.name);
  const [selectedDestination, setSelectedDestination] = useState<POI | null>(collegePoi);
  const [detailedPoi, setDetailedPoi] = useState<POI | null>(null);

  // Position Manager & Fusion Instance
  const positionManager = useMemo(() => new PositionFusionManager(homePoi.coordinate), []);
  const [posState, setPosState] = useState<PositionState>(positionManager.getState());

  // Route Manager Instance
  const routeManager = useMemo(() => new RouteManager(true), []);
  const [isOfflineForced, setIsOfflineForced] = useState<boolean>(true);

  // Navigation Controller Instance
  const navCtrl = useMemo(
    () => new NavigationController(activeRegion, positionManager),
    [activeRegion, positionManager]
  );
  const [navProgress, setNavProgress] = useState<NavigationProgress>(navCtrl.getProgress());

  // Battery Manager State
  const [batteryState, setBatteryState] = useState<BatteryState>(batteryManager.getState());
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);

  // Mobile Screen Overlays & Modals
  const [isSearchScreenOpen, setIsSearchScreenOpen] = useState(false);
  const [isSavedLocationsOpen, setIsSavedLocationsOpen] = useState(false);
  const [isDownloadRegionOpen, setIsDownloadRegionOpen] = useState(false);
  const [isSettingsScreenOpen, setIsSettingsScreenOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isDestinationDetailsOpen, setIsDestinationDetailsOpen] = useState(false);
  const [isEngineDrawerOpen, setIsEngineDrawerOpen] = useState(false);
  const [isPhoneFrameView, setIsPhoneFrameView] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscriptions to Reactive Engines
  useEffect(() => {
    const unsubPos = positionManager.subscribe((st) => setPosState(st));
    const unsubNav = navCtrl.subscribe((pr) => setNavProgress(pr));
    const unsubBat = batteryManager.subscribe((bt) => {
      setBatteryState(bt);
      if (bt.isUltraMode) {
        document.body.classList.add('ultra-mode');
      } else {
        document.body.classList.remove('ultra-mode');
      }
    });

    return () => {
      unsubPos();
      unsubNav();
      unsubBat();
    };
  }, [positionManager, navCtrl]);

  // Sync region changes
  useEffect(() => {
    navCtrl.setRegion(activeRegion);
    setSavedLocations(activeRegion.pois.filter((p) => p.isSaved));
    const newHome = activeRegion.pois.find((p) => p.category === 'home') || activeRegion.pois[0];
    const newDest = activeRegion.pois.find((p) => p.category === 'college') || activeRegion.pois[1];
    setOriginCoord(newHome.coordinate);
    setOriginName(newHome.name);
    setSelectedDestination(newDest);
  }, [activeRegion, navCtrl]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Launch App from Landing Page
  const handleLaunchApp = () => {
    setShowSplash(true);
    setViewMode('app');
  };

  // Calculate Route Handler
  const handleCalculateRoute = async (dest: POI) => {
    setSelectedDestination(dest);
    const result = await routeManager.calculateRoute(
      originCoord,
      originName,
      dest.coordinate,
      dest.name,
      activeRegion
    );

    if (result) {
      navCtrl.startPreview(result.route);
      showToast(
        result.source === 'offline'
          ? `Calculated offline graph route: ${(result.route.totalDistanceMeters / 1000).toFixed(1)} km`
          : `Calculated online route: ${(result.route.totalDistanceMeters / 1000).toFixed(1)} km`
      );
    } else {
      showToast('Could not calculate route for this destination.');
    }
  };

  // Start Active Turn-by-Turn Navigation
  const handleStartNavigation = async () => {
    if (!navProgress.activeRoute && selectedDestination) {
      const result = await routeManager.calculateRoute(
        originCoord,
        originName,
        selectedDestination.coordinate,
        selectedDestination.name,
        activeRegion
      );
      if (result) {
        navCtrl.startNavigation(result.route);
      }
    } else if (navProgress.activeRoute) {
      navCtrl.startNavigation();
    }
  };

  // Handle AI Command Execution
  const handleExecuteAICommand = (result: AICommandResult) => {
    setIsVoiceModalOpen(false);
    if (result.intent === 'STOP_NAV') {
      navCtrl.stopNavigation();
      showToast('Navigation stopped via voice command');
    } else if (result.intent === 'REROUTE') {
      navCtrl.simulateMissedTurn();
      showToast('Offline reroute triggered via voice command');
    } else if (result.intent === 'NAVIGATE' || result.intent === 'GO_HOME' || result.intent === 'GO_SAVED') {
      if (result.matchedPOI) {
        handleCalculateRoute(result.matchedPOI);
        setTimeout(() => navCtrl.startNavigation(), 600);
      } else if (selectedDestination) {
        handleCalculateRoute(selectedDestination);
        setTimeout(() => navCtrl.startNavigation(), 600);
      }
    }
  };

  // Tab Navigation Router
  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'saved') {
      setIsSavedLocationsOpen(true);
    } else if (tab === 'regions') {
      setIsDownloadRegionOpen(true);
    } else if (tab === 'settings') {
      setIsSettingsScreenOpen(true);
    }
  };

  // Toggle Saved POI
  const handleToggleSavePOI = (poi: POI) => {
    setSavedLocations((prev) => {
      const exists = prev.some((p) => p.id === poi.id);
      if (exists) {
        showToast(`Removed "${poi.name}" from saved places`);
        return prev.filter((p) => p.id !== poi.id);
      } else {
        showToast(`Saved "${poi.name}" to favorites`);
        return [...prev, { ...poi, isSaved: true }];
      }
    });
  };

  // Simulation Scenario Dispatcher
  const handleRunDemoStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        setShowSplash(true);
        break;
      case 2:
        setIsDownloadRegionOpen(true);
        showToast('Step 2: Viewing Regional Offline Map Packages');
        break;
      case 3:
        if (collegePoi) {
          setSelectedDestination(collegePoi);
          setDetailedPoi(collegePoi);
          setIsDestinationDetailsOpen(true);
        }
        showToast('Step 3: Selected Destination (College)');
        break;
      case 4:
        if (collegePoi) handleCalculateRoute(collegePoi);
        showToast('Step 4: Calculated Offline Graph Route');
        break;
      case 5:
        handleStartNavigation();
        showToast('Step 5: Started Turn-by-Turn Navigation');
        break;
      case 6:
      case 7:
        setIsOfflineForced(true);
        routeManager.setOfflineSimulation(true);
        showToast('Step 6 & 7: Internet Disabled — Offline Navigation Active');
        break;
      case 9:
      case 10:
        positionManager.setGpsQuality('weak');
        showToast('Step 9 & 10: GPS Weak — 6-DOF Sensor Dead Reckoning Active');
        break;
      case 11:
      case 12:
        navCtrl.simulateMissedTurn();
        showToast('Step 11 & 12: Missed Turn Detected — Instant Offline Reroute');
        break;
      case 13:
      case 14:
        positionManager.setGpsQuality('strong');
        showToast('Step 13 & 14: Restored GPS — Position Corrected Smoothly');
        break;
      case 15:
        setIsVoiceModalOpen(true);
        showToast('Step 15: AI Voice Navigation Engine Ready');
        break;
      case 17:
        showToast('Step 17: Origin Island Live Status Component Active');
        break;
      case 18:
      case 19:
        batteryManager.toggleUltraMode(true);
        showToast('Step 18 & 19: Low Battery — Ultra Navigation Mode Active');
        break;
      default:
        break;
    }
  };

  const isNavigating = navProgress.status === 'navigating' || navProgress.status === 'rerouting';
  const isPreviewing = navProgress.status === 'previewing' && navProgress.activeRoute !== null;
  const isIdle =
  navProgress.status === 'idle' ||
  navProgress.status === 'arrived';

  // If user explicitly switched to 'landing' overview
  if (viewMode === 'landing') {
    return <LandingPage onLaunchApp={handleLaunchApp} />;
  }

  return (
    <div className="min-h-screen bg-[#08090A] text-[#F5F7F8] flex flex-col items-center justify-start relative overflow-x-hidden font-sans">
      {/* 1. App Launch Splash Screen */}
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}

      {/* Reusable Application Header Shell (Section 5) */}
      <NavigationHeader
        isNavigating={isNavigating}
        isOffline={isOfflineForced}
        posState={posState}
        batteryState={batteryState}
        onBackOrStopNav={() => navCtrl.stopNavigation()}
        onToggleViewMode={() => setViewMode('landing')}
        isPhoneFrameView={isPhoneFrameView}
        onTogglePhoneFrame={() => setIsPhoneFrameView(!isPhoneFrameView)}
      />

      {/* Main Content Container: Mobile-First Viewport */}
      <main className={`w-full flex-1 flex flex-col items-center justify-start p-0 sm:py-2 transition-all ${
        isPhoneFrameView ? 'max-w-md' : 'max-w-6xl'
      }`}>
        <div className={`w-full flex-1 flex flex-col bg-[#08090A] sm:rounded-3xl border border-[#2B2F33] shadow-2xl relative overflow-hidden ${
          isPhoneFrameView ? 'min-h-[820px] max-h-[880px]' : 'min-h-[720px]'
        }`}>
          {/* 1. Origin Island floating status component */}
          <OriginIsland
            navProgress={navProgress}
            posState={posState}
            batteryState={batteryState}
            isOffline={isOfflineForced}
            onToggleUltraMode={() => batteryManager.toggleUltraMode()}
          />

          {/* 2. Top Turn Guidance HUD (When Navigating) */}
          <TurnGuidanceHUD
            progress={navProgress}
            posState={posState}
            activeRoute={navProgress.activeRoute}
            isMuted={isVoiceMuted}
            isOffline={isOfflineForced}
            onToggleMute={() => {
              const muted = !isVoiceMuted;
              setIsVoiceMuted(muted);
              voiceEngine.setMuted(muted);
            }}
            onStopNav={() => navCtrl.stopNavigation()}
            onReroute={() => navCtrl.simulateMissedTurn()}
            onOpenVoice={() => setIsVoiceModalOpen(true)}
          />

          {/* 3. Interactive Map View (Dominating Viewport) */}
          <div className="flex-1 w-full relative min-h-[420px]">
            <MapView
              currentPosition={posState.currentPosition}
              positionState={posState}
              activeRoute={navProgress.activeRoute}
              activeRegion={activeRegion}
              savedLocations={savedLocations}
              isUltraMode={batteryState.isUltraMode}
              onSelectPOI={(poi) => {
                setDetailedPoi(poi);
                setIsDestinationDetailsOpen(true);
              }}
            />

            {/* 4. Home Screen Overlay (When Idle: floating search & quick chips) */}
            {isIdle && (
              <HomeScreenOverlay
                activeRegion={activeRegion}
                savedLocations={savedLocations}
                posState={posState}
                batteryState={batteryState}
                isOffline={isOfflineForced}
                onOpenSearch={() => setIsSearchScreenOpen(true)}
                onOpenVoice={() => setIsVoiceModalOpen(true)}
                onOpenSavedLocations={() => setIsSavedLocationsOpen(true)}
                onOpenDownloadRegion={() => setIsDownloadRegionOpen(true)}
                onSelectDestination={(poi) => {
                  setDetailedPoi(poi);
                  setIsDestinationDetailsOpen(true);
                }}
                onOpenEngineDrawer={() => setIsEngineDrawerOpen(true)}
              />
            )}

            {/* Float Route Context Card if Navigating */}
            {isNavigating && navProgress.activeRoute && (
              <div className="absolute bottom-3 left-0 right-0 z-30 pointer-events-none">
                <RouteContextCard context={navProgress.activeRoute.context} />
              </div>
            )}
          </div>

          {/* 5. Route Preview Screen (When Previewing Route) */}
          {isPreviewing && navProgress.activeRoute && (
            <RoutePreviewCard
              route={navProgress.activeRoute}
              onStartNavigation={handleStartNavigation}
              onCancel={() => navCtrl.stopNavigation()}
            />
          )}

          {/* 6. Battery Warning Banner (< 20%) */}
          {batteryState.isLowBattery && !batteryState.isUltraMode && (
            <div className="mx-4 my-2 p-3 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-200 flex items-center justify-between z-30 select-none">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-[#FFD400] animate-pulse" />
                <span className="text-xs font-semibold">
                  Battery low ({Math.round(batteryState.level * 100)}%) — Ultra Navigation Mode recommended
                </span>
              </div>
              <button
                onClick={() => batteryManager.toggleUltraMode(true)}
                className="px-3 py-1 rounded-xl bg-[#FFD400] text-black font-extrabold text-xs hover:bg-[#e6bf00] transition-colors font-display"
              >
                Enable
              </button>
            </div>
          )}

          {/* 7. Bottom Navigation Bar */}
          <BottomNavBar
            activeTab={activeTab}
            onChangeTab={handleSelectTab}
            isNavigating={isNavigating}
          />

          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#FFD400] text-black font-extrabold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 font-display">
              <Sparkles size={14} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Ultra Navigation Mode Minimalist Overlay */}
          {batteryState.isUltraMode && (
            <UltraNavOverlay
              navProgress={navProgress}
              posState={posState}
              batteryState={batteryState}
              isVoiceMuted={isVoiceMuted}
              onToggleMute={() => {
                const muted = !isVoiceMuted;
                setIsVoiceMuted(muted);
                voiceEngine.setMuted(muted);
              }}
              onExitUltraMode={() => batteryManager.toggleUltraMode(false)}
            />
          )}
        </div>
      </main>

      {/* NavX Technology & Simulation Drawer */}
      <NavXEngineDrawer
        isOpen={isEngineDrawerOpen}
        onClose={() => setIsEngineDrawerOpen(false)}
        isOffline={isOfflineForced}
        onToggleInternet={() => {
          const nextState = !isOfflineForced;
          setIsOfflineForced(nextState);
          routeManager.setOfflineSimulation(nextState);
          showToast(nextState ? 'Simulating Offline Mode (No Internet)' : 'Simulating Online Mode');
        }}
        posState={posState}
        onSetGpsQuality={(quality) => {
          positionManager.setGpsQuality(quality, collegePoi.coordinate);
          showToast(
            quality === 'weak'
              ? 'GPS Weak — Position Fusion switched to IMU Dead Reckoning'
              : 'GPS Restored — Position smoothly corrected'
          );
        }}
        onSimulateMissedTurn={() => {
          navCtrl.simulateMissedTurn();
          showToast('Missed turn simulated! Calculating offline alternative route...');
        }}
        batteryState={batteryState}
        onSetBatteryLevel={(lvl) => batteryManager.setSimulatedBatteryLevel(lvl)}
        onToggleUltraMode={() => batteryManager.toggleUltraMode()}
        navProgress={navProgress}
        onRunAutoDemoStep={(step) => handleRunDemoStep(step)}
      />

      {/* Mobile Screens & Modals */}
      <SearchScreen
        isOpen={isSearchScreenOpen}
        onClose={() => setIsSearchScreenOpen(false)}
        activeRegion={activeRegion}
        currentCoord={posState.currentPosition}
        savedLocations={savedLocations}
        onSelectDestination={(poi) => {
          setIsSearchScreenOpen(false);
          setDetailedPoi(poi);
          setIsDestinationDetailsOpen(true);
        }}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
      />

      <DestinationDetailsModal
        isOpen={isDestinationDetailsOpen}
        poi={detailedPoi}
        onClose={() => setIsDestinationDetailsOpen(false)}
        currentCoord={posState.currentPosition}
        onStartRoute={(poi) => {
          setIsDestinationDetailsOpen(false);
          handleCalculateRoute(poi);
        }}
        onToggleSave={handleToggleSavePOI}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
      />

      <SavedLocationsScreen
        isOpen={isSavedLocationsOpen}
        onClose={() => {
          setIsSavedLocationsOpen(false);
          setActiveTab('map');
        }}
        savedLocations={savedLocations}
        currentCoord={posState.currentPosition}
        onSelectDestination={(poi) => {
          setIsSavedLocationsOpen(false);
          handleCalculateRoute(poi);
        }}
        onAddLocation={(newPoi) => {
          setSavedLocations((prev) => [...prev, newPoi]);
          showToast(`Added "${newPoi.name}" to saved locations`);
        }}
        onDeleteLocation={(id) => {
          setSavedLocations((prev) => prev.filter((p) => p.id !== id));
          showToast('Removed saved location');
        }}
      />

      <DownloadRegionScreen
        isOpen={isDownloadRegionOpen}
        onClose={() => {
          setIsDownloadRegionOpen(false);
          setActiveTab('map');
        }}
        activeRegion={activeRegion}
        onSelectRegion={(reg) => {
          setActiveRegion(reg);
          showToast(`Active offline region set to: ${reg.name}`);
        }}
      />

      <SettingsScreen
        isOpen={isSettingsScreenOpen}
        onClose={() => {
          setIsSettingsScreenOpen(false);
          setActiveTab('map');
        }}
        batteryState={batteryState}
        onToggleUltraMode={() => batteryManager.toggleUltraMode()}
        isVoiceMuted={isVoiceMuted}
        onToggleMute={() => {
          const muted = !isVoiceMuted;
          setIsVoiceMuted(muted);
          voiceEngine.setMuted(muted);
        }}
      />

      <VoiceAIPanel
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        activeRegion={activeRegion}
        savedLocations={savedLocations}
        onExecuteCommand={handleExecuteAICommand}
      />
    </div>
  );
};

export default App;
