import React, { useState, useEffect, useMemo } from 'react';
import { REGIONS } from './data/regions';
import { Coordinates, MapRegion, POI, PositionState, BatteryState, AICommandResult } from './types';
import { PositionFusionManager } from './sensors/positionFusion';
import { NavigationController, NavigationProgress } from './engine/navigationController';
import { RouteManager } from './engine/routeManager';
import { batteryManager } from './battery/batteryManager';
import { voiceEngine } from './voice/voiceGuidance';
import { OriginIsland } from './components/OriginIsland';
import { MapView } from './components/MapView';
import { TurnGuidanceHUD } from './components/TurnGuidanceHUD';
import { RouteContextCard } from './components/RouteContextCard';
import { RoutePreviewCard } from './components/RoutePreviewCard';
import { HomeScreenOverlay } from './components/HomeScreenOverlay';
import { UltraNavOverlay } from './components/UltraNavOverlay';
import { DemoSimulationBar } from './components/DemoSimulationBar';
import { SearchAndSavedModal } from './components/SearchAndSavedModal';
import { VoiceAIPanel } from './components/VoiceAIPanel';
import { SettingsModal } from './components/SettingsModal';
import { BottomNavBar, TabType } from './components/BottomNavBar';
import { 
  Smartphone, 
  Monitor, 
  Sparkles,
  Zap
} from 'lucide-react';

export const App: React.FC = () => {
  // Region & Saved Places
  const [activeRegion, setActiveRegion] = useState<MapRegion>(REGIONS[0]);
  const [savedLocations, setSavedLocations] = useState<POI[]>(
    REGIONS[0].pois.filter((p) => p.isSaved)
  );

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('map');

  // Initial Origin (Home) & Destination (College)
  const homePoi = activeRegion.pois.find((p) => p.category === 'home') || activeRegion.pois[0];
  const collegePoi = activeRegion.pois.find((p) => p.category === 'college') || activeRegion.pois[1];

  const [originCoord, setOriginCoord] = useState<Coordinates>(homePoi.coordinate);
  const [originName, setOriginName] = useState<string>(homePoi.name);
  const [selectedDestination, setSelectedDestination] = useState<POI | null>(collegePoi);

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

  // Modal Dialogs & Screens
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchModalTab, setSearchModalTab] = useState<'places' | 'offline_maps'>('places');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
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
      showToast('Navigation stopped via AI voice command');
    } else if (result.intent === 'REROUTE') {
      navCtrl.simulateMissedTurn();
      showToast('Offline reroute triggered via AI voice command');
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

  // Tab switcher router
  const handleSelectTab = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'saved') {
      setSearchModalTab('places');
      setIsSearchModalOpen(true);
    } else if (tab === 'regions') {
      setSearchModalTab('offline_maps');
      setIsSearchModalOpen(true);
    } else if (tab === 'settings') {
      setIsSettingsModalOpen(true);
    }
  };

  // Step-by-Step Hackathon Demo Dispatcher
  const handleRunDemoStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        showToast('Step 1: Opened IQOO NavX');
        break;
      case 2:
        setSearchModalTab('offline_maps');
        setIsSearchModalOpen(true);
        showToast('Step 2: Viewing Regional Offline Map Packages');
        break;
      case 3:
        if (collegePoi) setSelectedDestination(collegePoi);
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
  const isIdle = navProgress.status === 'idle';

  return (
    <div className="min-h-screen bg-[#07080b] text-neutral-100 flex flex-col items-center justify-start relative overflow-x-hidden font-sans">
      {/* Top Header & Viewport Switcher */}
      <header className="w-full max-w-6xl px-4 py-2.5 flex items-center justify-between border-b border-white/5 z-30 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-[#ff4800] flex items-center justify-center font-black text-black font-display shadow-[0_0_15px_#ff4800]">
            iQ
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm tracking-wider text-white font-display">
                IQOO NavX
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff4800]/15 text-[#ff4800] border border-[#ff4800]/30 font-display">
                OFFLINE ENGINE
              </span>
            </div>
            <p className="text-[10px] text-neutral-400">Offline-First Sensor-Assisted Navigation System</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Frame View Toggle */}
          <button
            onClick={() => setIsPhoneFrameView(!isPhoneFrameView)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300 transition-colors"
          >
            {isPhoneFrameView ? <Monitor size={14} /> : <Smartphone size={14} />}
            <span>{isPhoneFrameView ? 'Full Width' : 'Phone Frame'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area: Responsive Container */}
      <main className={`w-full flex-1 flex flex-col items-center justify-start p-0 sm:py-3 transition-all ${
        isPhoneFrameView ? 'max-w-md' : 'max-w-6xl'
      }`}>
        <div className={`w-full flex-1 flex flex-col bg-[#0b0e17] sm:rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden ${
          isPhoneFrameView ? 'min-h-[820px] max-h-[880px]' : 'min-h-[720px]'
        }`}>
          {/* 1. Origin Island floating widget */}
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
          />

          {/* 3. Interactive Map View (Hero Element) */}
          <div className="flex-1 w-full relative min-h-[380px]">
            <MapView
              currentPosition={posState.currentPosition}
              positionState={posState}
              activeRoute={navProgress.activeRoute}
              activeRegion={activeRegion}
              savedLocations={savedLocations}
              isUltraMode={batteryState.isUltraMode}
              onSelectPOI={(poi) => handleCalculateRoute(poi)}
            />

            {/* Float Route Context Card if Navigating */}
            {isNavigating && navProgress.activeRoute && (
              <div className="absolute bottom-3 left-0 right-0 z-30">
                <RouteContextCard context={navProgress.activeRoute.context} />
              </div>
            )}
          </div>

          {/* 4. Home Screen Overlay (When Idle) */}
          {isIdle && (
            <HomeScreenOverlay
              activeRegion={activeRegion}
              savedLocations={savedLocations}
              posState={posState}
              batteryState={batteryState}
              isOffline={isOfflineForced}
              onOpenSearch={() => {
                setSearchModalTab('places');
                setIsSearchModalOpen(true);
              }}
              onOpenVoice={() => setIsVoiceModalOpen(true)}
              onOpenRegions={() => {
                setSearchModalTab('offline_maps');
                setIsSearchModalOpen(true);
              }}
              onSelectDestination={(poi) => handleCalculateRoute(poi)}
              onToggleUltraMode={() => batteryManager.toggleUltraMode()}
            />
          )}

          {/* 5. Route Preview Card (When Previewing Route) */}
          {isPreviewing && navProgress.activeRoute && (
            <RoutePreviewCard
              route={navProgress.activeRoute}
              onStartNavigation={handleStartNavigation}
              onCancel={() => navCtrl.stopNavigation()}
            />
          )}

          {/* 6. Low Battery Warning Prompt Banner */}
          {batteryState.isLowBattery && !batteryState.isUltraMode && (
            <div className="mx-4 my-2 p-3 rounded-2xl bg-amber-950/80 border border-amber-500/40 text-amber-200 flex items-center justify-between z-30 select-none">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-amber-400 animate-pulse" />
                <span className="text-xs font-semibold">
                  Battery low ({Math.round(batteryState.level * 100)}%) — Enable Ultra Nav Mode?
                </span>
              </div>
              <button
                onClick={() => batteryManager.toggleUltraMode(true)}
                className="px-3 py-1 rounded-xl bg-[#ff4800] text-black font-extrabold text-xs hover:bg-[#ff6524] transition-colors font-display"
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

          {/* 8. Demo Simulation Bar for Judges & Testing */}
          <div className="w-full bg-[#0b0e17] border-t border-white/5 pt-1">
            <DemoSimulationBar
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
          </div>

          {/* Toast Notification Banner */}
          {toastMessage && (
            <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#ff4800] text-black font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200 font-display">
              <Sparkles size={14} />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Ultra Navigation Mode Minimalist High-Power-Saving Overlay */}
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

      {/* Modals */}
      <SearchAndSavedModal
        isOpen={isSearchModalOpen}
        initialTab={searchModalTab}
        onClose={() => {
          setIsSearchModalOpen(false);
          setActiveTab('map');
        }}
        activeRegion={activeRegion}
        onSelectRegion={(reg) => {
          setActiveRegion(reg);
          showToast(`Active map switched to: ${reg.name}`);
        }}
        onSelectDestination={(poi) => {
          setSelectedDestination(poi);
          handleCalculateRoute(poi);
        }}
        onOpenVoice={() => setIsVoiceModalOpen(true)}
        savedLocations={savedLocations}
      />

      <VoiceAIPanel
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        activeRegion={activeRegion}
        savedLocations={savedLocations}
        onExecuteCommand={handleExecuteAICommand}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => {
          setIsSettingsModalOpen(false);
          setActiveTab('map');
        }}
        posState={posState}
        batteryState={batteryState}
        activeRegion={activeRegion}
        onToggleUltraMode={() => batteryManager.toggleUltraMode()}
      />
    </div>
  );
};

export default App;
