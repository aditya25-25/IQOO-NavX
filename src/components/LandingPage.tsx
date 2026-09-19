import React, { useState } from 'react';
import { 
  WifiOff, 
  Radio, 
  RotateCcw, 
  BatteryMedium, 
  Mic, 
  Compass, 
  Activity, 
  ChevronRight, 
  ArrowUpRight, 
  Cpu, 
  Zap, 
  Layers,
  Sparkles,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

interface LandingPageProps {
  onLaunchApp: () => void;
}

type SimulationState = 'NORMAL' | 'INTERNET_OFF' | 'GPS_LOSS' | 'MISSED_TURN' | 'LOW_BATTERY';

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  // Mobile Nav Drawer Toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Section 4 Reroute Animation State
  const [rerouteAnimState, setRerouteAnimState] = useState<'normal' | 'missed' | 'rerouted'>('normal');

  // Section 30 Interactive Demo Simulation State
  const [simState, setSimState] = useState<SimulationState>('NORMAL');

  const triggerRerouteDemo = () => {
    setRerouteAnimState('missed');
    setTimeout(() => {
      setRerouteAnimState('rerouted');
      setTimeout(() => {
        setRerouteAnimState('normal');
      }, 4000);
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-[#08090A] text-[#F5F7F8] font-sans selection:bg-[#FFD400] selection:text-black overflow-x-hidden">
      
      {/* 1. Header Navigation (Section 22) */}
      <nav className="w-full border-b border-[#2B2F33] sticky top-0 z-50 bg-[#08090A]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFD400] flex items-center justify-center font-black text-black text-sm font-display shadow-[0_0_15px_rgba(255,212,0,0.35)]">
              iQ
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider text-[#F5F7F8] font-display">
                iQOO NavX
              </span>
              <span className="ml-2 text-[9px] font-black px-2 py-0.5 rounded-full bg-[#FFD400]/15 text-[#FFD400] border border-[#FFD400]/30 font-display uppercase tracking-widest hidden sm:inline-block">
                Hackathon 2026
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A4A9AE]">
            <a href="#offline" className="hover:text-[#FFD400] transition-colors">Features</a>
            <a href="#technology" className="hover:text-[#FFD400] transition-colors">Technology</a>
            <a href="#experience" className="hover:text-[#FFD400] transition-colors">Experience</a>
            <a href="#demo" className="hover:text-[#FFD400] transition-colors">Demo</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchApp}
              className="px-4 py-2 rounded-xl bg-[#FFD400] hover:bg-[#ffe033] text-black font-extrabold text-xs tracking-wider transition-all transform active:scale-95 shadow-[0_0_20px_rgba(255,212,0,0.25)] flex items-center gap-1.5 font-display cursor-pointer"
            >
              <span>TRY NAVX</span>
              <ArrowUpRight size={14} className="stroke-[3]" />
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#191C1F] border border-[#2B2F33] text-[#A4A9AE]"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#111315] border-b border-[#2B2F33] px-4 py-4 space-y-3 animate-in fade-in duration-200">
            <a 
              href="#offline" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#A4A9AE] hover:text-[#FFD400]"
            >
              Features
            </a>
            <a 
              href="#technology" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#A4A9AE] hover:text-[#FFD400]"
            >
              Technology
            </a>
            <a 
              href="#experience" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#A4A9AE] hover:text-[#FFD400]"
            >
              Experience
            </a>
            <a 
              href="#demo" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-[#A4A9AE] hover:text-[#FFD400]"
            >
              Demo
            </a>
          </div>
        )}
      </nav>

      {/* 2. Hero Section (Section 23 & 24) */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD400]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#191C1F] border border-[#2B2F33] mb-6">
                <span className="w-2 h-2 rounded-full bg-[#FFD400] animate-pulse" />
                <span className="text-[11px] font-bold tracking-widest text-[#A4A9AE] uppercase font-display">
                  iQOO NAVX • OFFLINE-FIRST NAVIGATION
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F7F8] font-display leading-[1.08] mb-6">
                Navigate.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F7F8] via-[#FFD400] to-[#F5F7F8]">
                  Even when it's not perfect.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-[#A4A9AE] max-w-xl font-normal leading-relaxed mb-8">
                Offline-first navigation with sensor-assisted positioning, intelligent rerouting, voice navigation and battery-aware navigation built for the iQOO experience.
              </p>

              {/* Action CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={onLaunchApp}
                  className="px-7 py-3.5 rounded-2xl bg-[#FFD400] hover:bg-[#ffe033] text-black font-extrabold text-sm tracking-wide transition-all transform active:scale-95 shadow-[0_0_30px_rgba(255,212,0,0.35)] flex items-center justify-center gap-2 font-display cursor-pointer"
                >
                  <span>TRY NAVX</span>
                  <ChevronRight size={16} className="stroke-[3]" />
                </button>
                <a
                  href="#technology"
                  className="px-6 py-3.5 rounded-2xl bg-[#191C1F] hover:bg-[#22262A] text-[#F5F7F8] border border-[#2B2F33] font-semibold text-sm transition-all flex items-center justify-center gap-2 font-display"
                >
                  <span>EXPLORE TECHNOLOGY</span>
                </a>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-6 pt-10 mt-10 border-t border-[#2B2F33]/80 w-full max-w-lg">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#F5F7F8] font-display">&lt; 50ms</div>
                  <div className="text-xs text-[#6F757B] font-medium mt-0.5">Offline Reroute</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#FFD400] font-display">6-DOF</div>
                  <div className="text-xs text-[#6F757B] font-medium mt-0.5">Sensor Fusion</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#22C55E] font-display">100%</div>
                  <div className="text-xs text-[#6F757B] font-medium mt-0.5">Offline Continuity</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Smartphone Mockup & Technical Sensor Overlay (Section 24) */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* Sensor Nodes Connected Around Phone: GPS ↓, Accelerometer → NAVX ← Gyroscope, ↓ Compass */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-[#111315] border border-[#3B82F6]/60 text-[#3B82F6] text-[10px] font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                <Radio size={12} className="animate-pulse" />
                <span>GPS SATELLITE (L1/L5)</span>
              </div>

              <div className="absolute top-1/3 -left-8 sm:-left-10 z-20 px-2.5 py-1 rounded-xl bg-[#111315] border border-[#2B2F33] text-[#A4A9AE] text-[9px] font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md hidden sm:flex">
                <Activity size={12} className="text-[#FFD400]" />
                <span>ACCELEROMETER</span>
              </div>

              <div className="absolute top-1/3 -right-8 sm:-right-10 z-20 px-2.5 py-1 rounded-xl bg-[#111315] border border-[#2B2F33] text-[#A4A9AE] text-[9px] font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md hidden sm:flex">
                <RotateCcw size={12} className="text-[#3B82F6]" />
                <span>GYROSCOPE</span>
              </div>

              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-[#111315] border border-[#2B2F33] text-[#A4A9AE] text-[10px] font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                <Compass size={12} className="text-[#22C55E]" />
                <span>COMPASS ➔ NAVX POSITION</span>
              </div>

              {/* 3D Smartphone Device Mockup */}
              <div className="w-[300px] sm:w-[320px] h-[600px] sm:h-[640px] bg-[#111315] rounded-[42px] p-3 border-4 border-[#2B2F33] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(255,212,0,0.12)] relative flex flex-col overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
                
                {/* Speaker Notch / Origin Island Pill */}
                <div className="w-full flex items-center justify-center pt-1 pb-2 z-30">
                  <div className="px-4 py-1.5 rounded-full bg-black/95 border border-[#2B2F33] flex items-center gap-2 shadow-md">
                    <div className="w-2 h-2 rounded-full bg-[#FFD400] animate-pulse" />
                    <span className="text-[10px] font-bold text-[#F5F7F8] font-display">Turn right in 200m</span>
                    <span className="text-[9px] text-[#A4A9AE]">12:42</span>
                  </div>
                </div>

                {/* Inner Screen: Dark Map Navigation */}
                <div className="flex-1 w-full bg-[#08090A] rounded-[32px] border border-[#2B2F33]/60 relative overflow-hidden flex flex-col justify-between p-3">
                  
                  {/* Top Turn Instruction HUD */}
                  <div className="w-full bg-[#111315]/95 backdrop-blur-md border border-[#2B2F33] rounded-2xl p-3 shadow-lg z-20">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                        <span className="text-[9px] font-extrabold tracking-wider text-[#FFD400] uppercase font-display">
                          ● OFFLINE NAVIGATION
                        </span>
                      </div>
                      <span className="text-[9px] text-[#A4A9AE] font-mono">87%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FFD400] flex items-center justify-center text-black font-black text-lg font-display">
                        ↱
                      </div>
                      <div>
                        <div className="text-xs font-black text-[#F5F7F8] uppercase tracking-wide font-display">
                          TURN RIGHT
                        </div>
                        <div className="text-[11px] text-[#A4A9AE]">
                          in 200 m on University Road
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SVG Navigation Map Canvas */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none opacity-90">
                    <svg className="w-full h-full" viewBox="0 0 300 500" fill="none">
                      {/* Roads */}
                      <path d="M-20 180 H320" stroke="#191C1F" strokeWidth="12" />
                      <path d="M-20 320 H320" stroke="#191C1F" strokeWidth="8" />
                      <path d="M150 -20 V520" stroke="#191C1F" strokeWidth="12" />
                      <path d="M60 -20 V520" stroke="#191C1F" strokeWidth="6" />
                      <path d="M240 -20 V520" stroke="#191C1F" strokeWidth="6" />

                      {/* Active Yellow Navigation Route */}
                      <path 
                        d="M 150 420 L 150 240 Q 150 200 190 200 L 260 200" 
                        stroke="#FFD400" 
                        strokeWidth="6" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="drop-shadow-[0_0_8px_rgba(255,212,0,0.6)]"
                      />

                      {/* Origin & Destination */}
                      <circle cx="150" cy="420" r="6" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="260" cy="200" r="8" fill="#FFD400" stroke="#000000" strokeWidth="2" />

                      {/* Vehicle Marker */}
                      <g transform="translate(150, 310)">
                        <circle cx="0" cy="0" r="16" fill="rgba(255,212,0,0.2)" />
                        <circle cx="0" cy="0" r="8" fill="#FFD400" stroke="#000000" strokeWidth="2" />
                        <polygon points="0,-12 4,-5 -4,-5" fill="#000000" />
                      </g>
                    </svg>
                  </div>

                  {/* Bottom ETA & Status */}
                  <div className="w-full bg-[#111315]/95 backdrop-blur-md border border-[#2B2F33] rounded-2xl p-3 z-20 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base font-extrabold text-[#F5F7F8] font-display">12 min</div>
                        <div className="text-[10px] text-[#A4A9AE]">4.8 km • ETA 12:42 PM</div>
                      </div>
                      <div className="px-2.5 py-1 rounded-xl bg-[#FFD400]/15 border border-[#FFD400]/30 text-[#FFD400] text-[10px] font-bold font-display">
                        LOCAL GRAPH
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SECTION: Offline Navigation (Section 25) */}
      <section id="offline" className="py-20 bg-[#111315] border-y border-[#2B2F33] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 text-left">
              <span className="text-xs font-extrabold text-[#FFD400] uppercase tracking-widest font-display">
                01 • ZERO DATA DEPENDENCY
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7F8] font-display mt-2">
                Navigation without the network.
              </h2>
              <p className="text-base text-[#A4A9AE] mt-4 leading-relaxed">
                Standard navigation applications freeze when mobile data cuts out. NavX packages high-density vector road topology directly on-device, enabling instantaneous Dijkstra and A* path computation with zero internet connectivity.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                <div className="p-4 rounded-2xl bg-[#08090A] border border-[#2B2F33]">
                  <div className="w-8 h-8 rounded-lg bg-[#191C1F] flex items-center justify-center text-[#FFD400] mb-3">
                    <Layers size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-[#F5F7F8] font-display">Downloaded maps</h4>
                  <p className="text-xs text-[#A4A9AE] mt-1">Lightweight vector road graphs compressed for rapid parsing.</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#08090A] border border-[#2B2F33]">
                  <div className="w-8 h-8 rounded-lg bg-[#191C1F] flex items-center justify-center text-[#3B82F6] mb-3">
                    <Cpu size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-[#F5F7F8] font-display">Local route calculation</h4>
                  <p className="text-xs text-[#A4A9AE] mt-1">Full pathfinding executed directly on device silicon.</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#08090A] border border-[#2B2F33]">
                  <div className="w-8 h-8 rounded-lg bg-[#191C1F] flex items-center justify-center text-[#22C55E] mb-3">
                    <RotateCcw size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-[#F5F7F8] font-display">Offline rerouting</h4>
                  <p className="text-xs text-[#A4A9AE] mt-1">Sub-50ms recalculation when you make a detour.</p>
                </div>

                <div className="p-4 rounded-2xl bg-[#08090A] border border-[#2B2F33]">
                  <div className="w-8 h-8 rounded-lg bg-[#191C1F] flex items-center justify-center text-[#FFD400] mb-3">
                    <Mic size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-[#F5F7F8] font-display">Voice guidance</h4>
                  <p className="text-xs text-[#A4A9AE] mt-1">Local text-to-speech engine speaks turn instructions offline.</p>
                </div>
              </div>
            </div>

            {/* Right: Large Phone Map Showcase Mockup */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-md h-[480px] bg-[#08090A] rounded-3xl border-2 border-[#2B2F33] p-5 relative overflow-hidden shadow-2xl flex flex-col justify-between">
                <div className="flex items-center justify-between z-20">
                  <div className="flex items-center gap-2">
                    <WifiOff size={16} className="text-[#F59E0B]" />
                    <span className="text-xs font-bold text-[#F5F7F8] font-display">OFFLINE ENGINE ACTIVE</span>
                  </div>
                  <span className="text-xs font-mono text-[#22C55E]">0 KB Data Used</span>
                </div>

                {/* SVG Visual Regional Graph */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                    <path d="M40 200 H360" stroke="#191C1F" strokeWidth="12" />
                    <path d="M200 40 V360" stroke="#191C1F" strokeWidth="12" />
                    <path d="M100 100 L300 300" stroke="#191C1F" strokeWidth="8" />
                    <path d="M40 200 H200 V320" stroke="#FFD400" strokeWidth="5" strokeLinecap="round" />
                    <circle cx="40" cy="200" r="6" fill="#3B82F6" />
                    <circle cx="200" cy="320" r="8" fill="#FFD400" />
                  </svg>
                </div>

                <div className="z-20 p-3 rounded-2xl bg-[#111315]/95 border border-[#2B2F33] flex items-center justify-between">
                  <div className="text-xs font-bold text-[#F5F7F8]">Gujarat Regional Package</div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#22C55E]/15 text-[#22C55E]">Ready (248 MB)</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SECTION: Sensor Fusion (Section 26) */}
      <section id="technology" className="py-20 bg-[#08090A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 text-left">
              <span className="text-xs font-extrabold text-[#3B82F6] uppercase tracking-widest font-display">
                02 • SENSOR ASSISTED POSITIONING
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7F8] font-display mt-2">
                GPS isn't the only signal.
              </h2>
              <p className="text-base text-[#A4A9AE] mt-4 leading-relaxed">
                In tunnels, dense urban canyons, and multi-level flyovers, satellite signals frequently drop. NavX continuously fuses raw IMU accelerometer, gyroscope, and compass data with map topology constraints to project dead-reckoning position continuity.
              </p>

              {/* Technical Signal Flow Diagram */}
              <div className="mt-8 p-6 rounded-3xl bg-[#111315] border border-[#2B2F33] space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#08090A] border border-[#2B2F33]">
                  <span className="text-xs font-bold text-[#F5F7F8]">GPS Satellite Fix</span>
                  <span className="text-[10px] font-mono text-[#3B82F6]">Dual Band L1/L5</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#08090A] border border-[#2B2F33]">
                  <span className="text-xs font-bold text-[#F5F7F8]">Accelerometer & Gyroscope</span>
                  <span className="text-[10px] font-mono text-[#FFD400]">IMU Velocity & Heading</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#08090A] border border-[#2B2F33]">
                  <span className="text-xs font-bold text-[#F5F7F8]">Magnetic Compass & Map Data</span>
                  <span className="text-[10px] font-mono text-[#22C55E]">Road Graph Snapping</span>
                </div>

                <div className="text-center pt-2">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD400] text-black font-extrabold text-xs font-display">
                    <span>↓ FUSED ESTIMATED POSITION</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Sensor Confidence HUD Telemetry */}
            <div className="lg:col-span-6">
              <div className="p-8 rounded-3xl bg-[#111315] border border-[#2B2F33] shadow-2xl relative">
                <div className="flex items-center justify-between pb-6 border-b border-[#2B2F33]">
                  <div>
                    <div className="text-xs font-black uppercase text-[#A4A9AE] tracking-wider font-display">
                      POSITIONING TELEMETRY
                    </div>
                    <div className="text-lg font-black text-[#F5F7F8] font-display mt-0.5">
                      Sensor Fusion Status
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30 text-xs font-bold font-display">
                    SYNCHRONIZED
                  </span>
                </div>

                <div className="py-6 space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1.5">
                      <span className="text-[#A4A9AE]">Position Confidence Score</span>
                      <span className="text-[#FFD400] font-mono font-bold">92%</span>
                    </div>
                    <div className="w-full h-3 bg-[#191C1F] rounded-full overflow-hidden p-0.5 border border-[#2B2F33]">
                      <div className="h-full bg-gradient-to-r from-[#3B82F6] via-[#FFD400] to-[#22C55E] rounded-full w-[92%]" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-[#08090A] border border-[#2B2F33]">
                      <div className="text-[10px] text-[#6F757B] uppercase font-bold">GPS Anchor</div>
                      <div className="text-xs font-black text-[#3B82F6] font-display mt-1">Dual-Frequency</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#08090A] border border-[#2B2F33]">
                      <div className="text-[10px] text-[#6F757B] uppercase font-bold">IMU Sampling</div>
                      <div className="text-xs font-black text-[#FFD400] font-display mt-1">60 Hz Realtime</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#191C1F] border border-[#2B2F33] text-xs text-[#A4A9AE] leading-relaxed">
                  <span className="text-[#F5F7F8] font-bold">Continuous Track:</span> Sensor dead reckoning smoothly bridges navigation during temporary GPS dropouts without erratic position snapping.
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SECTION: Rerouting (Section 27) */}
      <section className="py-20 bg-[#111315] border-y border-[#2B2F33]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 text-left">
              <span className="text-xs font-extrabold text-[#FFD400] uppercase tracking-widest font-display">
                03 • INSTANT DETOUR SOLVER
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7F8] font-display mt-2">
                Missed the turn?<br />
                Keep moving.
              </h2>
              <p className="text-base text-[#A4A9AE] mt-4 leading-relaxed">
                Cloud-based navigation leaves you waiting with a loading spinner. NavX recalculates the optimal alternative route instantly using its local topological memory in less than 50ms.
              </p>

              {/* Reroute Sequence */}
              <div className="mt-8 flex flex-col gap-2.5 font-display text-xs">
                <div className="p-2.5 rounded-xl bg-[#08090A] border border-[#2B2F33] flex items-center justify-between">
                  <span className="text-[#A4A9AE]">1. Original Route Active</span>
                  <span className="text-[#22C55E]">✓ Running</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#08090A] border border-[#2B2F33] flex items-center justify-between">
                  <span className="text-[#A4A9AE]">2. Missed Turn Detected</span>
                  <span className="text-amber-400">⚠ Off-Route</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#08090A] border border-[#2B2F33] flex items-center justify-between">
                  <span className="text-[#A4A9AE]">3. Local Graph Recalculation</span>
                  <span className="text-[#FFD400] font-bold">&lt; 50ms</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FFD400]/15 border border-[#FFD400]/40 flex items-center justify-between">
                  <span className="text-[#FFD400] font-bold">4. New Route Seamlessly Applied</span>
                  <span className="text-[#FFD400] font-bold">Active</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={triggerRerouteDemo}
                  className="px-5 py-2.5 rounded-xl bg-[#191C1F] hover:bg-[#22262A] text-xs font-bold text-[#FFD400] border border-[#FFD400]/40 transition-all active:scale-95 font-display flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw size={14} className={rerouteAnimState === 'missed' ? 'animate-spin' : ''} />
                  <span>Simulate Missed Turn Animation</span>
                </button>
              </div>
            </div>

            {/* Interactive SVG Animation Diagram */}
            <div className="lg:col-span-7">
              <div className="w-full h-80 bg-[#08090A] rounded-3xl border border-[#2B2F33] p-6 relative flex flex-col justify-between overflow-hidden shadow-2xl">
                
                {/* Status Bar */}
                <div className="flex items-center justify-between z-20">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      rerouteAnimState === 'normal' ? 'bg-[#22C55E]' : rerouteAnimState === 'missed' ? 'bg-[#EF4444] animate-ping' : 'bg-[#FFD400]'
                    }`} />
                    <span className="text-xs font-black tracking-wider uppercase font-display">
                      {rerouteAnimState === 'normal' && 'Navigation Active'}
                      {rerouteAnimState === 'missed' && 'Missed Turn Detected — Recalculating...'}
                      {rerouteAnimState === 'rerouted' && 'Offline Route Updated'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#6F757B]">Local Graph</span>
                </div>

                {/* SVG Visual */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 500 300" fill="none">
                    <path d="M 50 150 H 450" stroke="#191C1F" strokeWidth="16" />
                    <path d="M 250 50 V 250" stroke="#191C1F" strokeWidth="16" />
                    <path d="M 380 50 V 250" stroke="#191C1F" strokeWidth="12" />

                    {rerouteAnimState === 'normal' && (
                      <path d="M 60 150 H 250 V 70" stroke="#FFD400" strokeWidth="6" strokeLinecap="round" className="animate-pulse" />
                    )}

                    {rerouteAnimState === 'missed' && (
                      <>
                        <path d="M 60 150 H 320" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
                        <circle cx="320" cy="150" r="8" fill="#EF4444" />
                      </>
                    )}

                    {rerouteAnimState === 'rerouted' && (
                      <path d="M 60 150 H 380 V 70 H 260" stroke="#FFD400" strokeWidth="6" strokeLinecap="round" strokeDasharray="8 8" className="animate-pulse" />
                    )}

                    <circle cx="250" cy="70" r="10" fill="#FFD400" stroke="#000000" strokeWidth="3" />
                  </svg>
                </div>

                {/* Bottom Bar */}
                <div className="z-20 bg-[#111315]/95 border border-[#2B2F33] rounded-xl p-3 flex items-center justify-between">
                  <div className="text-xs font-bold text-[#F5F7F8] font-display">
                    {rerouteAnimState === 'normal' && 'Turn right in 200 m on Cross Road'}
                    {rerouteAnimState === 'missed' && '⚠ Rerouting locally...'}
                    {rerouteAnimState === 'rerouted' && '✓ Continue straight 450 m then turn right'}
                  </div>
                  <span className="text-[10px] text-[#A4A9AE] font-mono">0.04s latency</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. SECTION: iQOO Experience (Section 28) */}
      <section id="experience" className="py-20 bg-[#08090A] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16 text-left">
            <span className="text-xs font-extrabold text-[#FFD400] uppercase tracking-widest font-display">
              04 • SYSTEM INTEGRATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7F8] font-display mt-2">
              Built for the iQOO experience.
            </h2>
            <p className="text-base text-[#A4A9AE] mt-4 leading-relaxed">
              Designed as an intuitive smartphone mobility suite with Origin Island-style status, natural voice navigation, and battery-aware Ultra Navigation Mode.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 1. Origin Island-style Navigation */}
            <div className="p-8 rounded-3xl bg-[#111315] border border-[#2B2F33] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#FFD400] mb-6">
                  <Sparkles size={22} />
                </div>
                <h3 className="text-xl font-bold text-[#F5F7F8] font-display mb-3">
                  Origin Island-style Navigation
                </h3>
                <p className="text-xs text-[#A4A9AE] leading-relaxed mb-6">
                  Compact floating navigation status that expands into turn guidance without interrupting active tasks.
                </p>
              </div>

              {/* UI Preview */}
              <div className="w-full p-2.5 rounded-full bg-black border border-[#2B2F33] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FFD400]" />
                  <span className="text-[11px] font-bold text-[#F5F7F8] font-display">200m Turn Right</span>
                </div>
                <span className="text-[10px] font-mono text-[#A4A9AE]">12:42</span>
              </div>
            </div>

            {/* 2. Voice Navigation */}
            <div className="p-8 rounded-3xl bg-[#111315] border border-[#2B2F33] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#3B82F6] mb-6">
                  <Mic size={22} />
                </div>
                <h3 className="text-xl font-bold text-[#F5F7F8] font-display mb-3">
                  Voice Navigation
                </h3>
                <p className="text-xs text-[#A4A9AE] leading-relaxed mb-6">
                  Hands-free natural navigation commands. Say <em>"Take me to college"</em> or <em>"Reroute"</em> without tapping screens.
                </p>
              </div>

              {/* UI Preview */}
              <div className="w-full p-2.5 rounded-2xl bg-[#191C1F] border border-[#2B2F33] flex items-center gap-2">
                <Mic size={14} className="text-[#3B82F6]" />
                <span className="text-[11px] text-[#A4A9AE] font-mono">"Take me to Hackathon Venue"</span>
              </div>
            </div>

            {/* 3. Battery-aware Navigation */}
            <div className="p-8 rounded-3xl bg-[#111315] border border-[#2B2F33] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#22C55E] mb-6">
                  <Zap size={22} />
                </div>
                <h3 className="text-xl font-bold text-[#F5F7F8] font-display mb-3">
                  Battery-aware Navigation
                </h3>
                <p className="text-xs text-[#A4A9AE] leading-relaxed mb-6">
                  Ultra Navigation Mode disables heavy graphics and renders OLED pitch black for power conservation.
                </p>
              </div>

              {/* UI Preview */}
              <div className="w-full p-2.5 rounded-2xl bg-black border border-amber-500/30 flex items-center justify-between text-amber-400">
                <span className="text-[11px] font-bold font-display">⚡ Ultra Mode</span>
                <span className="text-[10px] font-mono">20% OLED</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. SECTION: Failure States (Section 29) */}
      <section className="py-20 bg-[#111315] border-y border-[#2B2F33]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-[#FFD400] uppercase tracking-widest font-display">
              FAIL-SAFE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7F8] font-display mt-2">
              When navigation gets difficult, NavX keeps going.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Situation 1 */}
            <div className="p-6 rounded-2xl bg-[#08090A] border border-[#2B2F33] hover:border-[#FFD400] transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mb-4">
                  <WifiOff size={20} />
                </div>
                <h3 className="text-sm font-black text-[#F5F7F8] uppercase tracking-wider font-display mb-2">
                  NO INTERNET
                </h3>
                <p className="text-xs text-[#A4A9AE] leading-relaxed">
                  Basements, remote highways, or network outages. NavX routes locally from downloaded regional maps.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2B2F33] text-[10px] font-bold text-[#FFD400] font-display">
                ✓ 100% OFFLINE CONTINUITY
              </div>
            </div>

            {/* Situation 2 */}
            <div className="p-6 rounded-2xl bg-[#08090A] border border-[#2B2F33] hover:border-[#3B82F6] transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                  <Radio size={20} />
                </div>
                <h3 className="text-sm font-black text-[#F5F7F8] uppercase tracking-wider font-display mb-2">
                  GPS LOSS
                </h3>
                <p className="text-xs text-[#A4A9AE] leading-relaxed">
                  Tunnels and urban canyons. IMU dead-reckoning maintains position and heading without signal jumps.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2B2F33] text-[10px] font-bold text-[#3B82F6] font-display">
                ✓ 6-DOF SENSOR FUSION
              </div>
            </div>

            {/* Situation 3 */}
            <div className="p-6 rounded-2xl bg-[#08090A] border border-[#2B2F33] hover:border-[#22C55E] transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                  <RotateCcw size={20} />
                </div>
                <h3 className="text-sm font-black text-[#F5F7F8] uppercase tracking-wider font-display mb-2">
                  MISSED TURN
                </h3>
                <p className="text-xs text-[#A4A9AE] leading-relaxed">
                  Instant calculated alternative route in under 50ms without waiting for cloud response.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2B2F33] text-[10px] font-bold text-[#22C55E] font-display">
                ✓ LOCAL INSTANT REROUTE
              </div>
            </div>

            {/* Situation 4 */}
            <div className="p-6 rounded-2xl bg-[#08090A] border border-[#2B2F33] hover:border-[#FFD400] transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-center justify-center mb-4">
                  <BatteryMedium size={20} />
                </div>
                <h3 className="text-sm font-black text-[#F5F7F8] uppercase tracking-wider font-display mb-2">
                  LOW BATTERY
                </h3>
                <p className="text-xs text-[#A4A9AE] leading-relaxed">
                  Ultra Navigation Mode renders OLED pitch black for power conservation on critical trips.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2B2F33] text-[10px] font-bold text-[#FFD400] font-display">
                ✓ ULTRA NAVIGATION MODE
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. SECTION: Interactive Demo with 5 States (Section 30) */}
      <section id="demo" className="py-20 bg-[#08090A] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-extrabold text-[#FFD400] uppercase tracking-widest font-display">
              LIVE INTERACTIVE SIMULATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7F8] font-display mt-2">
              SEE NAVX IN ACTION
            </h2>
            <p className="text-sm text-[#A4A9AE] mt-3">
              Select a simulated condition to test how the NavX engine responds in real-time.
            </p>
          </div>

          {/* Interactive Simulation Switchers */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 font-display">
            <button
              onClick={() => setSimState('NORMAL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                simState === 'NORMAL'
                  ? 'bg-[#22C55E] text-black shadow-lg shadow-[rgba(34,197,94,0.3)]'
                  : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33] hover:text-[#F5F7F8]'
              }`}
            >
              [ NORMAL ]
            </button>

            <button
              onClick={() => setSimState('INTERNET_OFF')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                simState === 'INTERNET_OFF'
                  ? 'bg-[#F59E0B] text-black shadow-lg shadow-[rgba(245,158,11,0.3)]'
                  : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33] hover:text-[#F5F7F8]'
              }`}
            >
              [ INTERNET OFF ]
            </button>

            <button
              onClick={() => setSimState('GPS_LOSS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                simState === 'GPS_LOSS'
                  ? 'bg-[#3B82F6] text-white shadow-lg shadow-[rgba(59,130,246,0.3)]'
                  : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33] hover:text-[#F5F7F8]'
              }`}
            >
              [ GPS LOSS ]
            </button>

            <button
              onClick={() => setSimState('MISSED_TURN')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                simState === 'MISSED_TURN'
                  ? 'bg-purple-600 text-white shadow-lg shadow-[rgba(168,85,247,0.3)]'
                  : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33] hover:text-[#F5F7F8]'
              }`}
            >
              [ MISSED TURN ]
            </button>

            <button
              onClick={() => setSimState('LOW_BATTERY')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                simState === 'LOW_BATTERY'
                  ? 'bg-[#FFD400] text-black shadow-lg shadow-[rgba(255,212,0,0.3)]'
                  : 'bg-[#191C1F] text-[#A4A9AE] border border-[#2B2F33] hover:text-[#F5F7F8]'
              }`}
            >
              [ LOW BATTERY ]
            </button>
          </div>

          {/* Dynamic Interactive Phone Screen Displaying Selected State */}
          <div className="w-full max-w-lg mx-auto bg-[#111315] border border-[#2B2F33] rounded-3xl p-6 shadow-2xl relative">
            
            {/* Header Telemetry */}
            <div className="flex items-center justify-between pb-4 border-b border-[#2B2F33]">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  simState === 'NORMAL' ? 'bg-[#22C55E]' :
                  simState === 'INTERNET_OFF' ? 'bg-[#F59E0B]' :
                  simState === 'GPS_LOSS' ? 'bg-[#3B82F6]' :
                  simState === 'MISSED_TURN' ? 'bg-purple-400' : 'bg-[#EF4444]'
                }`} />
                <span className="text-xs font-black uppercase text-[#F5F7F8] font-display">
                  {simState === 'NORMAL' && 'Standard Navigation (GPS + Online)'}
                  {simState === 'INTERNET_OFF' && 'Offline Navigation (Local Graph)'}
                  {simState === 'GPS_LOSS' && 'Sensor Fusion Active (IMU Dead Reckoning)'}
                  {simState === 'MISSED_TURN' && 'Instant Offline Recalculation (<50ms)'}
                  {simState === 'LOW_BATTERY' && 'Ultra Navigation Mode (OLED Power Saver)'}
                </span>
              </div>
            </div>

            {/* Inner Simulated Screen Canvas */}
            <div className={`mt-4 p-5 rounded-2xl border transition-all ${
              simState === 'LOW_BATTERY'
                ? 'bg-black border-amber-500/30'
                : 'bg-[#08090A] border-[#2B2F33]'
            }`}>
              {/* State Specific UI Display */}
              {simState === 'NORMAL' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#22C55E]">
                      <Radio size={16} />
                      <span>GPS Satellite Fix: Strong (L1 + L5)</span>
                    </div>
                    <span className="text-[10px] text-[#A4A9AE]">Confidence 98%</span>
                  </div>
                  <div className="text-xs text-[#A4A9AE]">
                    Turn right in 200 m on University Road. ETA 12:42 PM (4.8 km remaining).
                  </div>
                </div>
              )}

              {simState === 'INTERNET_OFF' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-[#191C1F] border border-[#F59E0B]/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#F59E0B]">
                      <WifiOff size={16} />
                      <span>● OFFLINE GRAPH ACTIVE</span>
                    </div>
                    <span className="text-[10px] text-[#F59E0B]">0 KB Cellular Data</span>
                  </div>
                  <div className="text-xs text-[#A4A9AE]">
                    Internet connection lost. Turn-by-turn guidance and speech synthesis continue locally without interruption.
                  </div>
                </div>
              )}

              {simState === 'GPS_LOSS' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-[#191C1F] border border-[#3B82F6]/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#3B82F6]">
                      <Activity size={16} />
                      <span>GPS LOST ➔ IMU DEAD RECKONING</span>
                    </div>
                    <span className="text-[10px] text-[#3B82F6]">60 Hz IMU</span>
                  </div>
                  <div className="text-xs text-[#A4A9AE]">
                    Tunnel/underpass detected. Accelerometer + Gyroscope + Compass maintaining heading and velocity smoothly.
                  </div>
                </div>
              )}

              {simState === 'MISSED_TURN' && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-[#191C1F] border border-purple-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                      <RotateCcw size={16} />
                      <span>MISSED TURN ➔ RECALCULATED</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#22C55E]">Latency: 0.04s</span>
                  </div>
                  <div className="text-xs text-[#A4A9AE]">
                    Vehicle passed University Road turn. Alternative path solved locally via Dijkstra graph: Proceed 450m and take next right.
                  </div>
                </div>
              )}

              {simState === 'LOW_BATTERY' && (
                <div className="space-y-4 text-amber-400">
                  <div className="p-3 rounded-xl bg-black border border-amber-500/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold">
                      <Zap size={16} />
                      <span>ULTRA NAVIGATION MODE</span>
                    </div>
                    <span className="text-[10px] font-mono">15% Battery</span>
                  </div>
                  <div className="text-xs text-amber-200">
                    OLED pure black interface active. Visual effects reduced to minimize battery consumption while retaining navigation.
                  </div>
                </div>
              )}
            </div>

            {/* Launch Prototype CTA inside simulation card */}
            <div className="mt-6 pt-4 border-t border-[#2B2F33] flex items-center justify-between">
              <span className="text-xs text-[#A4A9AE]">Experience the full app prototype:</span>
              <button
                onClick={onLaunchApp}
                className="px-5 py-2.5 rounded-xl bg-[#FFD400] hover:bg-[#ffe033] text-black font-extrabold text-xs tracking-wider transition-all transform active:scale-95 font-display flex items-center gap-1.5 cursor-pointer"
              >
                <span>OPEN PROTOTYPE</span>
                <ArrowRight size={14} />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 9. SECTION: Final CTA (Section 31) */}
      <section className="py-24 bg-[#111315] border-t border-[#2B2F33] text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-6xl font-black text-[#F5F7F8] font-display tracking-tight leading-tight">
            Navigation shouldn't stop<br />
            <span className="text-[#FFD400]">when the network does.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#A4A9AE] mt-4 font-normal">
            Experience IQOO NavX.
          </p>

          <div className="mt-8">
            <button
              onClick={onLaunchApp}
              className="px-9 py-4 rounded-2xl bg-[#FFD400] hover:bg-[#ffe033] text-black font-black text-sm tracking-wider transition-all transform active:scale-95 shadow-[0_0_35px_rgba(255,212,0,0.35)] inline-flex items-center gap-2 font-display cursor-pointer"
            >
              <span>TRY NAVX</span>
              <ChevronRight size={16} className="stroke-[3]" />
            </button>
          </div>
        </div>
      </section>

      {/* 10. Landing Footer (Section 32) */}
      <footer className="w-full py-12 bg-[#08090A] border-t border-[#2B2F33] text-center text-xs text-[#6F757B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#FFD400] flex items-center justify-center font-black text-black text-xs font-display">
              iQ
            </div>
            <span className="font-bold text-[#F5F7F8] font-display">iQOO NavX</span>
          </div>

          <p className="text-[11px] text-[#A4A9AE]">
            Offline-first navigation prototype. Built for iQOO Hackathon 2026.
          </p>

          <div className="flex items-center gap-5 text-[11px] text-[#A4A9AE]">
            <a href="#offline" className="hover:text-[#FFD400] transition-colors">Features</a>
            <a href="#technology" className="hover:text-[#FFD400] transition-colors">Technology</a>
            <a href="#demo" className="hover:text-[#FFD400] transition-colors">Demo</a>
            <a href="https://github.com/aditya25-25/IQOO-NavX" target="_blank" rel="noreferrer" className="hover:text-[#FFD400] transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
