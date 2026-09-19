import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Send, 
  X, 
  Volume2, 
  CheckCircle2, 
  Compass
} from 'lucide-react';
import { AICommandResult, MapRegion, POI } from '../types';
import { parseAICommand } from '../ai/commandParser';
import { voiceEngine } from '../voice/voiceGuidance';

type VoiceState = 'idle' | 'listening' | 'processing' | 'confirmed';

interface VoiceAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeRegion: MapRegion;
  savedLocations: POI[];
  onExecuteCommand: (result: AICommandResult) => void;
}

export const VoiceAIPanel: React.FC<VoiceAIPanelProps> = ({
  isOpen,
  onClose,
  activeRegion,
  savedLocations,
  onExecuteCommand,
}) => {
  const [inputText, setInputText] = useState('');
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [lastResult, setLastResult] = useState<AICommandResult | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Take me to college',
    'Navigate home',
    'Go to iQOO Innovation Labs',
    'Find the nearest saved location',
    'Start navigation',
    'Cancel navigation',
    'Reroute',
  ];

  const handleProcessInput = (text: string) => {
    if (!text.trim()) return;

    setVoiceState('processing');

    setTimeout(() => {
      const result = parseAICommand(text, activeRegion, savedLocations);
      setLastResult(result);
      setVoiceState('confirmed');
      voiceEngine.speak(result.responseVoiceText, true);

      // Give visual confirmation before executing action
      setTimeout(() => {
        onExecuteCommand(result);
      }, 1000);
    }, 450);
  };

  const handleToggleVoice = () => {
    if (voiceState === 'listening') {
      voiceEngine.stopListening();
      setVoiceState('idle');
    } else {
      setVoiceState('listening');
      const started = voiceEngine.startListening(
        (transcript) => {
          setInputText(transcript);
          handleProcessInput(transcript);
        },
        () => setVoiceState('idle')
      );

      if (!started) {
        // Voice recognition simulation fallback if browser permission is blocked
        setTimeout(() => {
          const sample = 'Take me to college';
          setInputText(sample);
          handleProcessInput(sample);
        }, 1600);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-lg bg-[#0f131d] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#ff4800]/20 text-[#ff4800]">
              <Compass size={16} />
            </div>
            <div>
              <span className="text-sm font-bold uppercase tracking-wider text-white font-display">
                IQOO NavX AI Voice Engine
              </span>
              <p className="text-[10px] text-neutral-400">Navigation-Focused Natural Language Commands</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dynamic Voice State Visualizer */}
        <div className="flex flex-col items-center justify-center py-5 bg-[#141824] rounded-2xl border border-white/5 relative overflow-hidden space-y-3">
          <button
            onClick={handleToggleVoice}
            className={`w-18 h-18 rounded-full flex items-center justify-center transition-all ${
              voiceState === 'listening'
                ? 'bg-[#ff4800] text-black shadow-[0_0_35px_#ff4800] scale-110 animate-pulse'
                : voiceState === 'processing'
                ? 'bg-amber-500 text-black animate-spin'
                : voiceState === 'confirmed'
                ? 'bg-green-500 text-black shadow-[0_0_25px_#00e676]'
                : 'bg-white/10 hover:bg-[#ff4800]/20 text-white hover:text-[#ff4800] border border-white/10'
            }`}
          >
            {voiceState === 'listening' ? (
              <Mic size={30} />
            ) : voiceState === 'confirmed' ? (
              <CheckCircle2 size={30} />
            ) : (
              <MicOff size={28} />
            )}
          </button>

          {/* Status Label */}
          <div className="text-center font-display">
            <span className="text-xs font-bold text-white tracking-wide block">
              {voiceState === 'idle' && 'Tap Mic to Speak Navigation Command'}
              {voiceState === 'listening' && 'Listening... Speak now'}
              {voiceState === 'processing' && 'Processing navigation command...'}
              {voiceState === 'confirmed' && 'Command Confirmed & Interpreted'}
            </span>
            <span className="text-[10px] text-neutral-400">
              {voiceState === 'listening' ? 'e.g. "Take me home" or "Navigate to college"' : 'Hands-free offline speech processing'}
            </span>
          </div>

          {/* Listening Sound Wave Animation Bars */}
          {voiceState === 'listening' && (
            <div className="flex items-center gap-1 pt-1">
              {[40, 75, 100, 60, 90, 45, 80, 55].map((height, idx) => (
                <div
                  key={idx}
                  style={{ height: `${height * 0.25}px` }}
                  className="w-1 bg-[#ff4800] rounded-full animate-pulse"
                />
              ))}
            </div>
          )}
        </div>

        {/* Text Input & Submit Option */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type navigation command (e.g. Take me to college)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleProcessInput(inputText);
            }}
            className="flex-1 bg-[#181d2a] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff4800]"
          />

          <button
            onClick={() => handleProcessInput(inputText)}
            className="px-4 rounded-2xl bg-[#ff4800] text-black font-bold flex items-center justify-center hover:bg-[#ff6524] transition-colors"
          >
            <Send size={15} />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider font-display">
            Quick Navigation Phrases:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(prompt);
                  handleProcessInput(prompt);
                }}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-[#ff4800]/20 text-neutral-300 hover:text-[#ff4800] border border-white/5 text-[11px] font-medium transition-all"
              >
                "{prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Structured AI Command Result Card */}
        {lastResult && (
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Interpreted Intent:</span>
              <span className="font-mono font-bold text-[#ff4800] px-2 py-0.5 rounded bg-[#ff4800]/10 border border-[#ff4800]/30 font-display">
                {lastResult.intent}
              </span>
            </div>

            {lastResult.destinationName && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Destination:</span>
                <span className="font-bold text-white">
                  {lastResult.destinationName}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">Confidence Score:</span>
              <span className="text-green-400 font-mono font-bold">
                {Math.round(lastResult.confidence * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/5 text-xs text-neutral-300 italic">
              <Volume2 size={14} className="text-[#ff4800] flex-shrink-0" />
              <span>"{lastResult.responseVoiceText}"</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
