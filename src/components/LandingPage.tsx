import React, { useState } from 'react';
import { 
  WifiOff, 
  Radio, 
  RotateCcw, 
  BatteryMedium, 
  Mic, 
  ShieldCheck, 
  Compass, 
  Activity, 
  ChevronRight, 
  ArrowUpRight, 
  Cpu, 
  Zap, 
  Smartphone,
  Layers,
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onLaunchApp: () => void;
  onLaunchDemoScenario?: (scenario: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const [demoState, setDemoState] = useState<'normal' | 'missed' | 'rerouted'>('normal');

  const triggerRerouteDemo = () => {
    setDemoState('missed');
    setTimeout(() => {
      setDemoState('rerouted');
      setTimeout(() => {
        setDemoState('normal');
      }, 3500);
    }, 1500);
  };

  return (
    <div className="w-full min-h-screen bg-[#08090A] text-[#F5F7F8] font-sans selection:bg-[#FFD400] selection:text-black">
      {/* 1. Header Navigation */}
      <nav className="w-full border-b border-[#2B2F33] sticky top-0 z-50 bg-[#08090A]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FFD400] flex items-center justify-center font-black text-black text-sm font-display shadow-[0_0_15px_rgba(255,212,0,0.35)]">
              iQ
            </div>
            <div>
              <span className="font-extrabold text-base tracking-wider text-[#F5F7F8] font-display">
                IQOO NavX
              </span>
              <span className="ml-2 text-[9px] font-black px-2 py-0.5 rounded-full bg-[#FFD400]/15 text-[#FFD400] border border-[#FFD400]/30 font-display uppercase tracking-widest hidden sm:inline-block">
                Hackathon 2026
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A4A9AE]">
            <a href="#features" className="hover:text-[#FFD400] transition-colors">Features</a>
            <a href="#technology" className="hover:text-[#FFD400] transition-colors">Sensor Fusion</a>
            <a href="#moments" className="hover:text-[#FFD400] transition-colors">Why NavX</a>
            <a href="#demo" className="hover:text-[#FFD400] transition-colors">Live Demo</a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchApp}
              className="px-4 py-2 rounded-xl bg-[#FFD400] hover:bg-[#ffe033] text-black font-extrabold text-xs tracking-wider transition-all transform active:scale-95 shadow-[0_0_20px_rgba(255,212,0,0.25)] flex items-center gap-1.5 font-display"
            >
              <span>TRY NAVX</span>
              <ArrowUpRight size={14} className="stroke-[3]" />
            </button>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FFD400]/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#3B82F6]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Copy */}
            <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
              {/* Product Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#191C1F] border border-[#2B2F33] mb-6">
                <span className="w-2 h-2 rounded-full bg-[#FFD400] animate-pulse" />
                <span className="text-[11px] font-bold tracking-widest text-[#A4A9AE] uppercase font-display">
                  iQOO NAVX • OFFLINE-FIRST NAVIGATION
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F5F7F8] font-display leading-[1.08] mb-6">
                Navigate.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F5F7F8] via-[#FFD400] to-[#F5F7F8]">
                  Even when it's not perfect.
                </span>
              </h1>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-[#A4A9AE] max-w-xl font-normal leading-relaxed mb-8">
                Offline-first navigation with sensor-assisted positioning, intelligent rerouting, voice control, and battery-aware navigation built for the iQOO experience.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <button
                  onClick={onLaunchApp}
                  className="px-7 py-3.5 rounded-2xl bg-[#FFD400] hover:bg-[#ffe033] text-black font-extrabold text-sm tracking-wide transition-all transform active:scale-95 shadow-[0_0_30px_rgba(255,212,0,0.35)] flex items-center justify-center gap-2 font-display cursor-pointer"
                >
                  <span>Explore NavX</span>
                  <ChevronRight size={16} className="stroke-[3]" />
                </button>
                <a
                  href="#demo"
                  className="px-6 py-3.5 rounded-2xl bg-[#191C1F] hover:bg-[#22262A] text-[#F5F7F8] border border-[#2B2F33] font-semibold text-sm transition-all flex items-center justify-center gap-2 font-display"
                >
                  <span>View Navigation Demo</span>
                </a>
              </div>

              {/* Mini Technical Metrics Grid */}
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
                  <div className="text-xs text-[#6F757B] font-medium mt-0.5">Offline Ready</div>
                </div>
              </div>
            </div>

            {/* Right Column: 3D CSS Smartphone Mockup & Technical Sensor Nodes */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              
              {/* Sensor Nodes Connected Around Phone */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-[#111315] border border-[#3B82F6]/50 text-[#3B82F6] text-[10px] font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                <Radio size={12} className="animate-pulse" />
                <span>GPS SATELLITE (L1/L5)</span>
              </div>

              <div className="absolute top-1/3 -left-8 sm:-left-12 z-20 px-2.5 py-1 rounded-xl bg-[#111315] border border-[#2B2F33] text-[#A4A9AE] text-[9px] font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md hidden sm:flex">
                <Activity size={12} className="text-[#FFD400]" />
                <span>ACCELEROMETER</span>
              </div>

              <div className="absolute top-1/3 -right-8 sm:-right-12 z-20 px-2.5 py-1 rounded-xl bg-[#111315] border border-[#2B2F33] text-[#A4A9AE] text-[9px] font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md hidden sm:flex">
                <RotateCcw size={12} className="text-[#3B82F6]" />
                <span>GYROSCOPE</span>
              </div>

              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-20 px-3 py-1 rounded-full bg-[#111315] border border-[#2B2F33] text-[#A4A9AE] text-[10px] font-semibold flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                <Compass size={12} className="text-[#22C55E]" />
                <span>MAGNETIC COMPASS</span>
              </div>

              {/* 3D Smartphone Device Mockup Container */}
              <div className="w-[300px] sm:w-[320px] h-[600px] sm:h-[640px] bg-[#111315] rounded-[42px] p-3 border-4 border-[#2B2F33] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(255,212,0,0.1)] relative flex flex-col overflow-hidden transition-transform duration-500 hover:scale-[1.02]">
                
                {/* Phone Speaker Notch / Origin Island Pill */}
                <div className="w-full flex items-center justify-center pt-1 pb-2 z-30">
                  <div className="px-4 py-1.5 rounded-full bg-black/95 border border-[#2B2F33] flex items-center gap-2 shadow-md">
                    <div className="w-2 h-2 rounded-full bg-[#FFD400] animate-pulse" />
                    <span className="text-[10px] font-bold text-[#F5F7F8] font-display">Turn right in 200m</span>
                    <span className="text-[9px] text-[#A4A9AE]">12:42</span>
                  </div>
                </div>

                {/* Inner Screen Visual: Dark Map Navigation */}
                <div className="flex-1 w-full bg-[#08090A] rounded-[32px] border border-[#2B2F33]/60 relative overflow-hidden flex flex-col justify-between p-3">
                  
                  {/* Top HUD Card */}
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

                  {/* Visual Map Canvas Representation */}
                  <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none opacity-90">
                    <svg className="w-full h-full" viewBox="0 0 300 500" fill="none">
                      {/* Grid Roads */}
                      <path d="M-20 180 H320" stroke="#191C1F" strokeWidth="12" />
                      <path d="M-20 320 H320" stroke="#191C1F" strokeWidth="8" />
                      <path d="M150 -20 V520" stroke="#191C1F" strokeWidth="12" />
                      <path d="M60 -20 V520" stroke="#191C1F" strokeWidth="6" />
                      <path d="M240 -20 V520" stroke="#191C1F" strokeWidth="6" />

                      {/* Active Navigation Route (iQOO Yellow Glow) */}
                      <path 
                        d="M 150 420 L 150 240 Q 150 200 190 200 L 260 200" 
                        stroke="#FFD400" 
                        strokeWidth="6" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="drop-shadow-[0_0_8px_rgba(255,212,0,0.6)]"
                      />

                      {/* Origin and Destination Markers */}
                      <circle cx="150" cy="420" r="6" fill="#3B82F6" stroke="#FFFFFF" strokeWidth="2" />
                      <circle cx="260" cy="200" r="8" fill="#FFD400" stroke="#000000" strokeWidth="2" />

                      {/* Vehicle Marker with animated pulse */}
                      <g transform="translate(150, 310)">
                        <circle cx="0" cy="0" r="16" fill="rgba(255,212,0,0.2)" />
                        <circle cx="0" cy="0" r="8" fill="#FFD400" stroke="#000000" strokeWidth="2" />
                        <polygon points="0,-12 4,-5 -4,-5" fill="#000000" />
                      </g>
                    </svg>
                  </div>

                  {/* Bottom ETA & Status Card */}
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

      {/* 3. SECTION 2: "Navigation without the network" */}
      <section id="features" className="py-20 bg-[#111315] border-y border-[#2B2F33] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16 text-left">
            <span className="text-xs font-extrabold text-[#FFD400] uppercase tracking-widest font-display">
              01 • ZERO DATA DEPENDENCY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7F8] font-display mt-2">
              Navigation without the network.
            </h2>
            <p className="text-base text-[#A4A9AE] mt-4 leading-relaxed">
              Standard navigation apps freeze when cellular towers drop out. IQOO NavX packages high-density vector road topology directly on-device, enabling instantaneous Dijkstra and A* path computation with zero internet connectivity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="p-6 rounded-2xl bg-[#08090A] border border-[#2B2F33] hover:border-[#FFD400]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#FFD400] mb-5 group-hover:scale-110 transition-transform">
                <Layers size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#F5F7F8] font-display mb-2">
                Downloaded Regions
              </h3>
              <p className="text-xs text-[#A4A9AE] leading-relaxed">
                Lightweight vector road graphs compressed for rapid parsing without consuming heavy device storage.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 rounded-2xl bg-[#08090A] border border-[#2B2F33] hover:border-[#FFD400]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#3B82F6] mb-5 group-hover:scale-110 transition-transform">
                <Cpu size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#F5F7F8] font-display mb-2">
                Offline Route Calculation
              </h3>
              <p className="text-xs text-[#A4A9AE] leading-relaxed">
                Local pathfinding algorithm calculates complete turn-by-turn geometry directly on your phone's processor.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 rounded-2xl bg-[#08090A] border border-[#2B2F33] hover:border-[#FFD400]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#22C55E] mb-5 group-hover:scale-110 transition-transform">
                <RotateCcw size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#F5F7F8] font-display mb-2">
                Instant Offline Rerouting
              </h3>
              <p className="text-xs text-[#A4A9AE] leading-relaxed">
                Miss a turn and the local engine calculates a clean alternative in under 50ms without waiting for a server.
              </p>
            </div>

            {/* Card 4 */}
            <div className="p-6 rounded-2xl bg-[#08090A] border border-[#2B2F33] hover:border-[#FFD400]/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#FFD400] mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck size={22} />
              </div>
              <h3 className="text-lg font-bold text-[#F5F7F8] font-display mb-2">
                Navigation Continuity
              </h3>
              <p className="text-xs text-[#A4A9AE] leading-relaxed">
                Seamless transition between online mapping and offline local fallback without interrupting guidance.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SECTION 3: "GPS isn't the only signal." (Sensor Fusion) */}
      <section id="technology" className="py-20 bg-[#08090A] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 text-left">
              <span className="text-xs font-extrabold text-[#3B82F6] uppercase tracking-widest font-display">
                02 • 6-DOF POSITION FUSION
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7F8] font-display mt-2">
                GPS isn't the only signal.
              </h2>
              <p className="text-base text-[#A4A9AE] mt-4 leading-relaxed">
                In tunnels, dense urban high-rises, and underpasses, satellite reception frequently degrades. IQOO NavX continuously fuses raw IMU accelerometer, gyroscope, and compass data with map topology constraints to project dead reckoning positioning.
              </p>

              {/* Technical Signal Fusion Flow */}
              <div className="mt-8 space-y-3">
                <div className="p-3.5 rounded-xl bg-[#111315] border border-[#2B2F33] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Radio size={18} className="text-[#3B82F6]" />
                    <span className="text-xs font-bold text-[#F5F7F8] font-display">GPS Satellite Fix</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#3B82F6]/15 text-[#3B82F6] border border-[#3B82F6]/30">
                    Primary Anchor
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#111315] border border-[#2B2F33] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Activity size={18} className="text-[#FFD400]" />
                    <span className="text-xs font-bold text-[#F5F7F8] font-display">Accelerometer & Gyroscope</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFD400]/15 text-[#FFD400] border border-[#FFD400]/30">
                    Velocity & Heading
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#111315] border border-[#2B2F33] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Compass size={18} className="text-[#22C55E]" />
                    <span className="text-xs font-bold text-[#F5F7F8] font-display">Magnetic Sensor & Map Match</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
                    Graph Snapping
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Sensor Confidence Box */}
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
                      <div className="text-[10px] text-[#6F757B] uppercase font-bold">GPS Mode</div>
                      <div className="text-xs font-black text-[#3B82F6] font-display mt-1">L1 + L5 Dual Band</div>
                    </div>
                    <div className="p-3 rounded-xl bg-[#08090A] border border-[#2B2F33]">
                      <div className="text-[10px] text-[#6F757B] uppercase font-bold">IMU Refresh</div>
                      <div className="text-xs font-black text-[#FFD400] font-display mt-1">60 Hz Realtime</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#191C1F] border border-[#2B2F33] text-xs text-[#A4A9AE] leading-relaxed">
                  <span className="text-[#F5F7F8] font-bold">Hackathon Demo Note:</span> Sensor assisted positioning smoothly bridges navigation continuity during temporary GPS degradation without sudden erratic position jumps.
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SECTION 4: "Missed a turn?" (Animated Rerouting) */}
      <section className="py-20 bg-[#111315] border-y border-[#2B2F33]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 text-left">
              <span className="text-xs font-extrabold text-[#FFD400] uppercase tracking-widest font-display">
                03 • INSTANT RECOVERY
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F7F8] font-display mt-2">
                Missed a turn?
              </h2>
              <p className="text-base text-[#A4A9AE] mt-4 leading-relaxed">
                Traditional cloud navigation leaves you waiting seconds with a loading spinner while you drive in the wrong direction. NavX recalculates the optimal path immediately using its local topological memory.
              </p>

              {/* Reroute Step Sequence */}
              <div className="mt-8 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#22262A] text-xs font-bold flex items-center justify-center font-mono">1</div>
                  <span className="text-xs font-semibold text-[#A4A9AE]">ORIGINAL ROUTE ACTIVE</span>
                </div>
                <div className="w-0.5 h-4 bg-[#2B2F33] ml-3.5" />
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-bold flex items-center justify-center font-mono">2</div>
                  <span className="text-xs font-semibold text-amber-400">MISSED TURN DETECTED</span>
                </div>
                <div className="w-0.5 h-4 bg-[#2B2F33] ml-3.5" />
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#FFD400] text-black text-xs font-black flex items-center justify-center font-mono">3</div>
                  <span className="text-xs font-bold text-[#FFD400]">NEW OFFLINE ROUTE CALCULATED (&lt;50ms)</span>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={triggerRerouteDemo}
                  className="px-5 py-2.5 rounded-xl bg-[#191C1F] hover:bg-[#22262A] text-xs font-bold text-[#FFD400] border border-[#FFD400]/40 transition-all active:scale-95 font-display flex items-center gap-2"
                >
                  <RotateCcw size={14} className={demoState === 'missed' ? 'animate-spin' : ''} />
                  <span>Simulate Missed Turn Animation</span>
                </button>
              </div>
            </div>

            {/* Interactive Animated Route Transition Diagram */}
            <div className="lg:col-span-7">
              <div className="w-full h-80 bg-[#08090A] rounded-3xl border border-[#2B2F33] p-6 relative flex flex-col justify-between overflow-hidden shadow-2xl">
                
                {/* State Badge */}
                <div className="flex items-center justify-between z-20">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      demoState === 'normal' ? 'bg-[#22C55E]' : demoState === 'missed' ? 'bg-[#EF4444] animate-ping' : 'bg-[#FFD400]'
                    }`} />
                    <span className="text-xs font-black tracking-wider uppercase font-display">
                      {demoState === 'normal' && 'Navigation Active'}
                      {demoState === 'missed' && 'Missed Turn Detected — Recalculating...'}
                      {demoState === 'rerouted' && 'Offline Route Updated'}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#6F757B]">Dijkstra Local Graph</span>
                </div>

                {/* SVG Visual Road & Route Simulation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 500 300" fill="none">
                    {/* Background Roads */}
                    <path d="M 50 150 H 450" stroke="#191C1F" strokeWidth="16" />
                    <path d="M 250 50 V 250" stroke="#191C1F" strokeWidth="16" />
                    <path d="M 380 50 V 250" stroke="#191C1F" strokeWidth="12" />

                    {/* Original Path */}
                    {demoState === 'normal' && (
                      <path 
                        d="M 60 150 H 250 V 70" 
                        stroke="#FFD400" 
                        strokeWidth="6" 
                        strokeLinecap="round"
                        className="animate-pulse" 
                      />
                    )}

                    {/* Missed Turn Overrun */}
                    {demoState === 'missed' && (
                      <>
                        <path d="M 60 150 H 320" stroke="#EF4444" strokeWidth="6" strokeLinecap="round" />
                        <circle cx="320" cy="150" r="8" fill="#EF4444" />
                      </>
                    )}

                    {/* New Rerouted Path */}
                    {demoState === 'rerouted' && (
                      <path 
                        d="M 60 150 H 380 V 70 H 260" 
                        stroke="#FFD400" 
                        strokeWidth="6" 
                        strokeLinecap="round"
                        strokeDasharray="8 8"
                        className="animate-pulse" 
                      />
                    )}

                    {/* Destination Marker */}
                    <circle cx="250" cy="70" r="10" fill="#FFD400" stroke="#000000" strokeWidth="3" />
                  </svg>
                </div>

                {/* Bottom Instruction Display */}
                <div className="z-20 bg-[#111315]/95 border border-[#2B2F33] rounded-xl p-3 flex items-center justify-between">
                  <div className="text-xs font-bold text-[#F5F7F8] font-display">
                    {demoState === 'normal' && 'Turn right in 200 m on Cross Road'}
                    {demoState === 'missed' && '⚠ Rerouting locally...'}
                    {demoState === 'rerouted' && '✓ Continue straight 450 m then turn right'}
                  </div>
                  <span className="text-[10px] text-[#A4A9AE] font-mono">0.04s latency</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. SECTION 5: "Built for the iQOO experience" */}
      <section className="py-20 bg-[#08090A] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-16 text-left">
            <span className="text-xs font-extrabold text-[#FFD400] uppercase tracking-widest font-display">
              04 • SYSTEM INTEGRATION
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7F8] font-display mt-2">
              Built for the iQOO experience.
            </h2>
            <p className="text-base text-[#A4A9AE] mt-4 leading-relaxed">
              Designed to feel like an intuitive system-level mobility suite. Seamless Origin Island-style status, offline AI voice navigation, and battery-optimized Ultra Navigation Mode.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1: Origin Island */}
            <div className="p-8 rounded-3xl bg-[#111315] border border-[#2B2F33] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#FFD400] mb-6">
                  <Sparkles size={22} />
                </div>
                <h3 className="text-xl font-bold text-[#F5F7F8] font-display mb-3">
                  Origin Island-Style Status
                </h3>
                <p className="text-xs text-[#A4A9AE] leading-relaxed mb-6">
                  Compact floating navigation status that expands into active turn guidance without interrupting whatever else you're doing.
                </p>
              </div>

              {/* Mini Origin Island Pill Preview */}
              <div className="w-full p-2.5 rounded-full bg-black border border-[#2B2F33] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FFD400]" />
                  <span className="text-[11px] font-bold text-[#F5F7F8] font-display">200m Turn Right</span>
                </div>
                <span className="text-[10px] font-mono text-[#A4A9AE]">12:42</span>
              </div>
            </div>

            {/* Feature 2: Natural Voice AI */}
            <div className="p-8 rounded-3xl bg-[#111315] border border-[#2B2F33] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#3B82F6] mb-6">
                  <Mic size={22} />
                </div>
                <h3 className="text-xl font-bold text-[#F5F7F8] font-display mb-3">
                  AI Voice Guidance
                </h3>
                <p className="text-xs text-[#A4A9AE] leading-relaxed mb-6">
                  Hands-free natural navigation commands. Say <em>"Take me to college"</em> or <em>"Reroute"</em> without tapping menus while driving.
                </p>
              </div>

              {/* Mini Voice Command Pill */}
              <div className="w-full p-2.5 rounded-2xl bg-[#191C1F] border border-[#2B2F33] flex items-center gap-2">
                <Mic size={14} className="text-[#3B82F6]" />
                <span className="text-[11px] text-[#A4A9AE] font-mono">"Take me to Hackathon Venue"</span>
              </div>
            </div>

            {/* Feature 3: Ultra Navigation Mode */}
            <div className="p-8 rounded-3xl bg-[#111315] border border-[#2B2F33] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#191C1F] border border-[#2B2F33] flex items-center justify-center text-[#22C55E] mb-6">
                  <Zap size={22} />
                </div>
                <h3 className="text-xl font-bold text-[#F5F7F8] font-display mb-3">
                  Ultra Navigation Mode
                </h3>
                <p className="text-xs text-[#A4A9AE] leading-relaxed mb-6">
                  OLED pitch-black high contrast UI. Maximizes battery life on long trips when your phone drops below 20%.
                </p>
              </div>

              {/* Mini Battery Pill */}
              <div className="w-full p-2.5 rounded-2xl bg-black border border-amber-500/30 flex items-center justify-between text-amber-400">
                <span className="text-[11px] font-bold font-display">⚡ Ultra Mode Ready</span>
                <span className="text-[10px] font-mono">20% OLED</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. SECTION 6: "Designed for the moments navigation usually fails" */}
      <section id="moments" className="py-20 bg-[#111315] border-y border-[#2B2F33]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-[#FFD400] uppercase tracking-widest font-display">
              FAIL-SAFE ARCHITECTURE
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7F8] font-display mt-2">
              Designed for the moments navigation usually fails.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Moment 1 */}
            <div className="p-6 rounded-2xl bg-[#08090A] border border-[#2B2F33] hover:border-[#FFD400] transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mb-4">
                  <WifiOff size={20} />
                </div>
                <h3 className="text-sm font-black text-[#F5F7F8] uppercase tracking-wider font-display mb-2">
                  NO INTERNET
                </h3>
                <p className="text-xs text-[#A4A9AE] leading-relaxed">
                  Deep basements, remote highways, or dead zones. NavX routes locally from downloaded regional graphs.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2B2F33] text-[10px] font-bold text-[#FFD400] font-display">
                ✓ 100% OFFLINE CONTINUITY
              </div>
            </div>

            {/* Moment 2 */}
            <div className="p-6 rounded-2xl bg-[#08090A] border border-[#2B2F33] hover:border-[#3B82F6] transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4">
                  <Radio size={20} />
                </div>
                <h3 className="text-sm font-black text-[#F5F7F8] uppercase tracking-wider font-display mb-2">
                  WEAK GPS
                </h3>
                <p className="text-xs text-[#A4A9AE] leading-relaxed">
                  Tunnels, urban skyscrapers, and multi-level flyovers. Sensor dead-reckoning maintains your track.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2B2F33] text-[10px] font-bold text-[#3B82F6] font-display">
                ✓ 6-DOF SENSOR FUSION
              </div>
            </div>

            {/* Moment 3 */}
            <div className="p-6 rounded-2xl bg-[#08090A] border border-[#2B2F33] hover:border-[#22C55E] transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4">
                  <RotateCcw size={20} />
                </div>
                <h3 className="text-sm font-black text-[#F5F7F8] uppercase tracking-wider font-display mb-2">
                  MISSED TURN
                </h3>
                <p className="text-xs text-[#A4A9AE] leading-relaxed">
                  Instant recalculated offline alternative path in sub-50ms without waiting for a server timeout.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2B2F33] text-[10px] font-bold text-[#22C55E] font-display">
                ✓ LOCAL INSTANT REROUTE
              </div>
            </div>

            {/* Moment 4 */}
            <div className="p-6 rounded-2xl bg-[#08090A] border border-[#2B2F33] hover:border-[#FFD400] transition-colors flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 flex items-center justify-center mb-4">
                  <BatteryMedium size={20} />
                </div>
                <h3 className="text-sm font-black text-[#F5F7F8] uppercase tracking-wider font-display mb-2">
                  LOW BATTERY
                </h3>
                <p className="text-xs text-[#A4A9AE] leading-relaxed">
                  Ultra Navigation Mode disables heavy shaders & renders OLED pitch black for maximum power savings.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-[#2B2F33] text-[10px] font-bold text-[#FFD400] font-display">
                ✓ ULTRA NAVIGATION MODE
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 8. SECTION 7: Interactive Live Demo Preview CTA */}
      <section id="demo" className="py-20 bg-[#08090A] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="p-8 sm:p-12 rounded-3xl bg-[#111315] border border-[#2B2F33] text-center relative overflow-hidden shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#FFD400] flex items-center justify-center text-black mx-auto mb-6 shadow-[0_0_25px_rgba(255,212,0,0.35)]">
              <Smartphone size={28} />
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F5F7F8] font-display">
              Ready to test IQOO NavX?
            </h2>

            <p className="text-base text-[#A4A9AE] max-w-xl mx-auto mt-4 leading-relaxed">
              Launch the live interactive navigation prototype. Experience turn-by-turn routing, offline simulation, sensor dead reckoning, and Origin Island HUD.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onLaunchApp}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#FFD400] hover:bg-[#ffe033] text-black font-extrabold text-sm tracking-wider transition-all transform active:scale-95 shadow-[0_0_30px_rgba(255,212,0,0.35)] flex items-center justify-center gap-2 font-display cursor-pointer"
              >
                <span>LAUNCH NAVIGATION APP</span>
                <ArrowUpRight size={16} className="stroke-[3]" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 9. SECTION 8: Final CTA */}
      <section className="py-20 bg-[#111315] border-t border-[#2B2F33] text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-black text-[#F5F7F8] font-display tracking-tight leading-tight">
            Navigation shouldn't stop<br />
            <span className="text-[#FFD400]">when the network does.</span>
          </h2>

          <div className="mt-8">
            <button
              onClick={onLaunchApp}
              className="px-8 py-4 rounded-2xl bg-[#FFD400] hover:bg-[#ffe033] text-black font-black text-sm tracking-wider transition-all transform active:scale-95 shadow-[0_0_30px_rgba(255,212,0,0.35)] inline-flex items-center gap-2 font-display cursor-pointer"
            >
              <span>EXPLORE NAVX</span>
              <ChevronRight size={16} className="stroke-[3]" />
            </button>
          </div>
        </div>
      </section>

      {/* 10. Landing Page Footer */}
      <footer className="w-full py-12 bg-[#08090A] border-t border-[#2B2F33] text-center text-xs text-[#6F757B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#FFD400] flex items-center justify-center font-black text-black text-xs font-display">
              iQ
            </div>
            <span className="font-bold text-[#F5F7F8] font-display">IQOO NAVX</span>
          </div>

          <p className="text-[11px] text-[#A4A9AE]">
            Offline-first navigation prototype • Built for iQOO Hackathon 2026
          </p>

          <div className="flex items-center gap-4 text-[11px] text-[#A4A9AE]">
            <button onClick={onLaunchApp} className="hover:text-[#FFD400] transition-colors">
              App Prototype
            </button>
            <a href="https://github.com/aditya25-25/IQOO-NavX" target="_blank" rel="noreferrer" className="hover:text-[#FFD400] transition-colors">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
