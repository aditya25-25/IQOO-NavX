import React, { useState } from 'react';
import { Mic, MicOff, Send, X, Bot } from 'lucide-react';
import { AICommandResult, MapRegion, POI } from '../types';
import { parseAICommand } from '../ai/commandParser';
import { voiceEngine } from '../voice/voiceGuidance';

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
  const [isListening, setIsListening] = useState(false);
  const [lastResult, setLastResult] = useState<AICommandResult | null>(null);

  if (!isOpen) return null;

  const quickPrompts = [
    'Take me to college',
    'Navigate to saved location',
    'Go to iQOO Innovation Labs',
    'Start navigation',
    'Stop navigation',
  ];

  const handleProcessInput = (text: string) => {
    if (!text.trim()) return;

    const result = parseAICommand(text, activeRegion, savedLocations);
    setLastResult(result);
    voiceEngine.speak(result.responseVoiceText, true);
    onExecuteCommand(result);
  };

  const handleToggleVoice = () => {
    if (isListening) {
      voiceEngine.stopListening();
      setIsListening(false);
    } else {
      const started = voiceEngine.startListening(
        (transcript) => {
          setInputText(transcript);
          setIsListening(false);
          handleProcessInput(transcript);
        },
        () => setIsListening(false)
      );

      if (started) {
        setIsListening(true);
      } else {
        // Fallback simulation if browser speech recognition is not granted
        setIsListening(true);
        setTimeout(() => {
          const sample = 'Take me to college';
          setInputText(sample);
          setIsListening(false);
          handleProcessInput(sample);
        }, 1500);
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
              <Bot size={16} />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-white font-display">
                IQOO NavX AI Command Engine
              </span>
              <p className="text-[10px] text-neutral-400">Navigation-Only Natural Language Parser</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        {/* Voice Mic Pulsing Area */}
        <div className="flex flex-col items-center justify-center py-4 bg-[#141824] rounded-2xl border border-white/5 relative overflow-hidden">
          <button
            onClick={handleToggleVoice}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-[#ff4800] text-black shadow-[0_0_30px_#ff4800] scale-110 animate-pulse'
                : 'bg-white/10 hover:bg-[#ff4800]/20 text-white hover:text-[#ff4800] border border-white/10'
            }`}
          >
            {isListening ? <Mic size={28} /> : <MicOff size={26} />}
          </button>

          <span className="text-xs font-semibold text-neutral-300 mt-3 font-display">
            {isListening ? 'Listening for Navigation Command...' : 'Tap Mic for Voice Navigation'}
          </span>
        </div>

        {/* Text Input & Submit */}
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
          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
            Sample Natural Language Commands:
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

        {/* Structured Result Display */}
        {lastResult && (
          <div className="p-3 rounded-2xl bg-black/40 border border-white/10 space-y-1.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Parsed Intent:</span>
              <span className="font-mono font-bold text-[#ff4800] px-2 py-0.5 rounded bg-[#ff4800]/10 border border-[#ff4800]/30">
                {lastResult.intent}
              </span>
            </div>

            {lastResult.destinationName && (
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">Destination:</span>
                <span className="font-semibold text-white">
                  {lastResult.destinationName}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Confidence:</span>
              <span className="text-green-400 font-mono">
                {Math.round(lastResult.confidence * 100)}%
              </span>
            </div>

            <p className="text-[11px] text-neutral-300 italic pt-1 border-t border-white/5">
              🔊 "{lastResult.responseVoiceText}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
