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
import { UltraNavOverlay } from './components/UltraNavOverlay';
import { DemoSimulationBar } from './components/DemoSimulationBar';
import { SearchAndSavedModal } from './components/SearchAndSavedModal';
import { VoiceAIPanel } from './components/VoiceAIPanel';
import { 
  Navigation, 
  Search, 
  Mic, 
  Layers, 
  Smartphone, 
  Monitor, 
  Play,
  Sparkles
} from 'lucide-react';

export const App: React.FC = () => {
  // Region & Saved Places
  const [activeRegion, setActiveRegion] = useState<MapRegion>(REGIONS[0]);
  const [savedLocations, setSavedLocations] = useState<POI[]>(
    REGIONS[0].pois.filter((p) => p.isSaved)
  );

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

  // Modal Dialogs
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
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

  // Sync region change to nav controller
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
          ? `Calculated offline route: ${(result.route.totalDistanceMeters / 1000).toFixed(1)} km`
          : `Calculated online route: ${(result.route.totalDistanceMeters / 1000).toFixed(1)} km`
      );
    } else {
      showToast('Could not calculate route for this destination.');
    }
  };

  // Start Active Navigation
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
      showToast('Navigation stopped via AI command');
    } else if (result.intent === 'REROUTE') {
      navCtrl.simulateMissedTurn();
      showToast('Offline reroute triggered via AI command');
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

  // Hackathon Step-by-Step Demo Dispatcher
  const handleRunDemoStep = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        showToast('Step 1: Opened IQOO NavX');
        break;
      case 2:
        setIsSearchModalOpen(true);
        showToast('Step 2: Viewing Regional Offline Map Packages');
        break;
      case 3:
        if (collegePoi) setSelectedDestination(collegePoi);
        showToast('Step 3: Selected Destination (College)');
        break;
      case 4:
        if (collegePoi) handleCalculateRoute(collegePoi);
        showToast('Step 4: Calculated Offline Route');
        break;
      case 5:
        handleStartNavigation();
        showToast('Step 5: Started Turn-by-Turn Navigation');
        break;
      case 6:
      case 7:
        setIsOfflineForced(true);
        routeManager.setOfflineSimulation(true);
        showToast('Step 6 & 7: Internet Disabled — Offline Mode Active');
        break;
      case 9:
      case 10:
        positionManager.setGpsQuality('weak');
        showToast('Step 9 & 10: Simulated Weak GPS — Sensor-Assisted Mode Active');
        break;
      case 11:
      case 12:
        navCtrl.simulateMissedTurn();
        showToast('Step 11 & 12: Simulated Missed Turn — Instant Offline Rerouting');
        break;
      case 13:
      case 14:
        positionManager.setGpsQuality('strong');
        showToast('Step 13 & 14: Restored GPS — Position Smoothly Corrected');
        break;
      case 15:
        setIsVoiceModalOpen(true);
        showToast('Step 15: AI Navigation Command Engine Ready');
        break;
      case 17:
        showToast('Step 17: Origin Island Live Status Component Active');
        break;
      case 18:
      case 19:
        batteryManager.toggleUltraMode(true);
        showToast('Step 18 & 19: Low Battery Simulated — Ultra Navigation Mode ON');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-neutral-100 flex flex-col items-center justify-start relative overflow-x-hidden font-sans">
      {/* Top Banner & Viewport Switcher */}
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
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ff4800]/15 text-[#ff4800] border border-[#ff4800]/30">
                PROTOTYPE
              </span>
            </div>
            <p className="text-[10px] text-neutral-400">Offline-First Sensor-Assisted Navigation</p>
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

          {/* 2. Top Maneuver HUD (When Navigating) */}
          <TurnGuidanceHUD
            progress={navProgress}
            posState={posState}
            activeRoute={navProgress.activeRoute}
            isMuted={isVoiceMuted}
            onToggleMute={() => {
              const muted = !isVoiceMuted;
              setIsVoiceMuted(muted);
              voiceEngine.setMuted(muted);
            }}
            onStopNav={() => navCtrl.stopNavigation()}
            onReroute={() => navCtrl.simulateMissedTurn()}
          />

          {/* 3. Interactive Map View */}
          <div className="flex-1 w-full relative min-h-[360px]">
            <MapView
              currentPosition={posState.currentPosition}
              positionState={posState}
              activeRoute={navProgress.activeRoute}
              activeRegion={activeRegion}
              savedLocations={savedLocations}
              isUltraMode={batteryState.isUltraMode}
              onSelectPOI={(poi) => handleCalculateRoute(poi)}
            />

            {/* Float Route Context Card if Route Available */}
            {navProgress.activeRoute && (
              <div className="absolute bottom-3 left-0 right-0 z-30">
                <RouteContextCard context={navProgress.activeRoute.context} />
              </div>
            )}
          </div>

          {/* 4. Bottom Action Bar & Navigation Triggers */}
          <div className="w-full p-4 bg-[#0e121d]/95 backdrop-blur-xl border-t border-white/10 z-30 space-y-2.5 select-none">
            {/* Destination Selection Pill if Idle */}
            {navProgress.status === 'idle' && (
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-[#151a28] border border-white/5">
                <div 
                  onClick={() => setIsSearchModalOpen(true)}
                  className="flex items-center gap-2.5 flex-1 cursor-pointer overflow-hidden"
                >
                  <div className="p-2 rounded-xl bg-[#ff4800]/20 text-[#ff4800]">
                    <Search size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Target Destination:
                    </span>
                    <span className="text-xs font-bold text-white truncate block">
                      {selectedDestination ? selectedDestination.name : 'Select Destination...'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (selectedDestination) {
                      handleCalculateRoute(selectedDestination);
                    } else {
                      setIsSearchModalOpen(true);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-[#ff4800] text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-[#ff6220] transition-colors shadow-lg shadow-[#ff4800]/20 font-display"
                >
                  <Navigation size={14} />
                  <span>Route</span>
                </button>
              </div>
            )}

            {/* Route Preview Action Bar */}
            {navProgress.status === 'previewing' && navProgress.activeRoute && (
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#151a28] border border-white/5">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-black text-white font-display">
                      {(navProgress.activeRoute.totalDistanceMeters / 1000).toFixed(1)} km
                    </span>
                    <span className="text-xs text-neutral-400">
                      • {Math.ceil(navProgress.activeRoute.totalDurationSeconds / 60)} min
                    </span>
                  </div>
                  <span className="text-[11px] text-green-400 font-semibold">
                    {navProgress.activeRoute.isOffline ? 'Offline Graph Route Ready' : 'Online Route Ready'}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navCtrl.stopNavigation()}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-neutral-300"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => navCtrl.startNavigation()}
                    className="px-5 py-2 rounded-xl bg-[#ff4800] text-black font-extrabold text-xs flex items-center gap-1.5 hover:bg-[#ff6220] transition-colors shadow-lg shadow-[#ff4800]/25 font-display"
                  >
                    <Play size={14} />
                    <span>Start Nav</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quick Action Dock: AI Voice, Search, Regions, Demo */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setIsVoiceModalOpen(true)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-[#ff4800]/20 text-neutral-200 hover:text-[#ff4800] border border-white/5 text-xs font-semibold transition-all"
              >
                <Mic size={15} className="text-[#ff4800]" />
                <span>AI Voice</span>
              </button>

              <button
                onClick={() => setIsSearchModalOpen(true)}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/5 text-xs font-semibold transition-all"
              >
                <Search size={15} />
                <span>Destinations</span>
              </button>

              <button
                onClick={() => {
                  setIsSearchModalOpen(true);
                }}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-200 border border-white/5 text-xs font-semibold transition-all"
              >
                <Layers size={15} />
                <span>Offline Maps</span>
              </button>
            </div>

            {/* 5. Demo Simulation Controls for Judges */}
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

      {/* Modals */}
      <SearchAndSavedModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        activeRegion={activeRegion}
        onSelectRegion={(reg) => {
          setActiveRegion(reg);
          showToast(`Active map switched to: ${reg.name}`);
        }}
        onSelectDestination={(poi) => {
          setSelectedDestination(poi);
          handleCalculateRoute(poi);
        }}
        savedLocations={savedLocations}
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
