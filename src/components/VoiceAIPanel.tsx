import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Send,
  X,
  Volume2,
  CheckCircle2,
  AlertCircle,
  Compass,
  Sparkles,
  Radio,
} from 'lucide-react';
import { AICommandResult, MapRegion, POI } from '../types';
import { parseAICommand } from '../ai/commandParser';
import { voiceEngine } from '../voice/voiceGuidance';

type VoiceState = 'IDLE' | 'LISTENING' | 'PROCESSING' | 'SUCCESS' | 'ERROR';

interface VoiceAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeRegion: MapRegion;
  savedLocations: POI[];
  onExecuteCommand: (result: AICommandResult) => void;
}

const stateConfig = {
  IDLE: {
    label: 'Tap to speak',
    description: 'Give NavX a navigation command',
    icon: MicOff,
  },
  LISTENING: {
    label: 'Listening',
    description: 'Speak a destination or navigation command',
    icon: Mic,
  },
  PROCESSING: {
    label: 'Understanding',
    description: 'NavX is processing your command',
    icon: Radio,
  },
  SUCCESS: {
    label: 'Command confirmed',
    description: 'Your navigation command is ready',
    icon: CheckCircle2,
  },
  ERROR: {
    label: 'Command not recognized',
    description: 'Try another navigation command',
    icon: AlertCircle,
  },
};

export const VoiceAIPanel: React.FC<VoiceAIPanelProps> = ({
  isOpen,
  onClose,
  activeRegion,
  savedLocations,
  onExecuteCommand,
}) => {
  const [inputText, setInputText] = useState('');
  const [voiceState, setVoiceState] = useState<VoiceState>('IDLE');
  const [lastResult, setLastResult] = useState<AICommandResult | null>(null);

  if (!isOpen) return null;

  const demoCommands = [
    'Navigate to College',
    'Take me Home',
    'Start Navigation',
    'Cancel Navigation',
    "What's my ETA?",
    'Show saved places',
  ];

  const handleProcessInput = (text: string) => {
    if (!text.trim()) return;

    setVoiceState('PROCESSING');

    setTimeout(() => {
      const result = parseAICommand(text, activeRegion, savedLocations);
      setLastResult(result);

      if (result.intent === 'UNKNOWN') {
        setVoiceState('ERROR');
        voiceEngine.speak(
          "Couldn't understand that. Try saying: Navigate to College.",
          true
        );
      } else {
        setVoiceState('SUCCESS');
        voiceEngine.speak(result.responseVoiceText, true);

        setTimeout(() => {
          onExecuteCommand(result);
        }, 900);
      }
    }, 450);
  };

  const handleToggleVoice = () => {
    if (voiceState === 'LISTENING') {
      voiceEngine.stopListening();
      setVoiceState('IDLE');
    } else {
      setVoiceState('LISTENING');

      const started = voiceEngine.startListening(
        (transcript) => {
          setInputText(transcript);
          handleProcessInput(transcript);
        },
        () => setVoiceState('IDLE')
      );

      if (!started) {
        setTimeout(() => {
          const sample = 'Navigate to College';
          setInputText(sample);
          handleProcessInput(sample);
        }, 1500);
      }
    }
  };

  const StateIcon = stateConfig[voiceState].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4">
      <div className="w-full max-w-md overflow-hidden rounded-t-[28px] border border-[#2B2F33] bg-[#111315] shadow-2xl sm:rounded-[28px]">
        <div className="flex justify-center pt-2 sm:hidden">
          <div className="h-1 w-10 rounded-full bg-[#2B2F33]" />
        </div>

        <div className="flex items-center justify-between border-b border-[#2B2F33] px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#FFD400]/20 bg-[#FFD400]/10 text-[#FFD400]">
              <Compass size={19} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight text-[#F5F7F8]">
                  Voice Navigation
                </h2>

                <span className="rounded-md bg-[#FFD400] px-1.5 py-0.5 text-[8px] font-black tracking-wider text-black">
                  AI
                </span>
              </div>

              <p className="mt-0.5 text-[10px] text-[#6F757B]">
                Hands-free NavX commands
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close voice navigation"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#2B2F33] bg-[#191C1F] text-[#A4A9AE] transition-all hover:bg-[#22262A] hover:text-[#F5F7F8] focus:outline-none focus:ring-2 focus:ring-[#FFD400]/50 active:scale-95"
          >
            <X size={17} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="relative overflow-hidden rounded-3xl border border-[#2B2F33] bg-[#191C1F] px-4 py-7">
            <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-[#FFD400]/50" />

            <div className="relative flex flex-col items-center">
              <button
                type="button"
                onClick={handleToggleVoice}
                aria-label={
                  voiceState === 'LISTENING'
                    ? 'Stop listening'
                    : 'Start voice navigation'
                }
                className={`relative flex h-20 w-20 items-center justify-center rounded-full border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFD400]/60 focus:ring-offset-4 focus:ring-offset-[#191C1F] active:scale-95 ${
                  voiceState === 'LISTENING'
                    ? 'border-[#FFD400] bg-[#FFD400] text-black shadow-[0_0_0_8px_rgba(255,212,0,0.08)]'
                    : voiceState === 'PROCESSING'
                      ? 'border-[#F59E0B]/50 bg-[#F59E0B]/15 text-[#F59E0B]'
                      : voiceState === 'SUCCESS'
                        ? 'border-[#22C55E]/40 bg-[#22C55E]/15 text-[#22C55E]'
                        : voiceState === 'ERROR'
                          ? 'border-[#EF4444]/40 bg-[#EF4444]/15 text-[#EF4444]'
                          : 'border-[#2B2F33] bg-[#22262A] text-[#F5F7F8] hover:border-[#FFD400]/50 hover:text-[#FFD400]'
                }`}
              >
                <StateIcon
                  size={30}
                  className={
                    voiceState === 'PROCESSING'
                      ? 'animate-pulse'
                      : ''
                  }
                />

                {voiceState === 'LISTENING' && (
                  <span className="absolute inset-[-7px] rounded-full border border-[#FFD400]/30 animate-ping" />
                )}
              </button>

              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-sm font-bold text-[#F5F7F8]">
                    {voiceState === 'SUCCESS' &&
                    lastResult?.destinationName
                      ? `Navigating to ${lastResult.destinationName}`
                      : stateConfig[voiceState].label}
                  </span>

                  {voiceState === 'SUCCESS' && (
                    <Sparkles size={13} className="text-[#FFD400]" />
                  )}
                </div>

                <p className="mt-1 text-[11px] text-[#A4A9AE]">
                  {stateConfig[voiceState].description}
                </p>
              </div>

              {voiceState === 'LISTENING' && (
                <div className="mt-4 flex h-6 items-center gap-1">
                  {[8, 15, 22, 13, 19, 10, 17, 12, 20].map(
                    (height, index) => (
                      <span
                        key={index}
                        className="w-1 rounded-full bg-[#FFD400] animate-pulse"
                        style={{
                          height: `${height}px`,
                          animationDelay: `${index * 70}ms`,
                        }}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6F757B]">
                Type a command
              </span>

              <span className="text-[9px] text-[#4F5459]">
                Press Enter to send
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Navigate to College"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleProcessInput(inputText);
                  }
                }}
                aria-label="Navigation command"
                className="min-w-0 flex-1 rounded-2xl border border-[#2B2F33] bg-[#191C1F] px-4 py-3 text-xs text-[#F5F7F8] placeholder-[#6F757B] outline-none transition-colors focus:border-[#FFD400] focus:ring-1 focus:ring-[#FFD400]/30"
              />

              <button
                type="button"
                onClick={() => handleProcessInput(inputText)}
                disabled={!inputText.trim() || voiceState === 'PROCESSING'}
                aria-label="Send navigation command"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FFD400] text-black transition-all hover:bg-[#e6bf00] focus:outline-none focus:ring-2 focus:ring-[#FFD400]/50 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95"
              >
                <Send size={15} />
              </button>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#6F757B]">
                Try saying
              </span>

              <div className="h-px flex-1 bg-[#2B2F33]" />
            </div>

            <div className="flex flex-wrap gap-2">
              {demoCommands.map((prompt) => (
                <button
                  type="button"
                  key={prompt}
                  onClick={() => {
                    setInputText(prompt);
                    handleProcessInput(prompt);
                  }}
                  className="rounded-full border border-[#2B2F33] bg-[#191C1F] px-3 py-2 text-[10px] font-medium text-[#A4A9AE] transition-all hover:border-[#FFD400]/40 hover:bg-[#FFD400]/10 hover:text-[#FFD400] focus:outline-none focus:ring-2 focus:ring-[#FFD400]/40 active:scale-95"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {lastResult && voiceState === 'SUCCESS' && (
            <div className="rounded-2xl border border-[#22C55E]/25 bg-[#22C55E]/5 p-3.5 animate-in fade-in duration-200">
              <div className="mb-2 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#22C55E]" />

                <span className="text-[10px] font-bold uppercase tracking-wider text-[#22C55E]">
                  Command Ready
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-[#6F757B]">Intent</span>

                  <span className="rounded-lg border border-[#2B2F33] bg-[#191C1F] px-2 py-1 font-mono text-[10px] font-bold text-[#FFD400]">
                    {lastResult.intent}
                  </span>
                </div>

                {lastResult.destinationName && (
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-[#6F757B]">Destination</span>

                    <span className="max-w-[210px] truncate font-semibold text-[#F5F7F8]">
                      {lastResult.destinationName}
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-2 border-t border-[#2B2F33] pt-2">
                  <Volume2
                    size={13}
                    className="mt-0.5 shrink-0 text-[#FFD400]"
                  />

                  <span className="text-[11px] leading-4 text-[#A4A9AE]">
                    {lastResult.responseVoiceText}
                  </span>
                </div>
              </div>
            </div>
          )}

          {voiceState === 'ERROR' && (
            <div className="flex items-start gap-2 rounded-2xl border border-[#EF4444]/20 bg-[#EF4444]/5 p-3 text-[11px] text-[#A4A9AE]">
              <AlertCircle
                size={14}
                className="mt-0.5 shrink-0 text-[#EF4444]"
              />

              <span>
                Try a simple command such as{' '}
                <span className="font-semibold text-[#F5F7F8]">
                  “Navigate to College”
                </span>
                .
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
