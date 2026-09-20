```tsx
import React, { useState } from 'react';
import {
  ArrowLeft,
  DownloadCloud,
  RefreshCw,
  ShieldCheck,
  MapPinned,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { MapRegion } from '../types';
import { REGIONS } from '../data/regions';

interface DownloadRegionScreenProps {
  isOpen: boolean;
  onClose: () => void;
  activeRegion: MapRegion;
  onSelectRegion: (region: MapRegion) => void;
}

export const DownloadRegionScreen: React.FC<DownloadRegionScreenProps> = ({
  isOpen,
  onClose,
  activeRegion,
  onSelectRegion,
}) => {
  const [regionsList, setRegionsList] = useState<MapRegion[]>(REGIONS);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  if (!isOpen) return null;

  const handleStartDownload = (regId: string) => {
    setDownloadingId(regId);
    setDownloadProgress(10);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingId(null);

          setRegionsList((list) =>
            list.map((r) =>
              r.id === regId ? { ...r, isDownloaded: true } : r
            )
          );

          return 100;
        }

        return prev + 25;
      });
    }, 300);
  };

  const handleToggleRemove = (regId: string) => {
    setRegionsList((list) =>
      list.map((r) =>
        r.id === regId ? { ...r, isDownloaded: false } : r
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#08090A] text-[#F5F7F8] flex flex-col select-none animate-in fade-in duration-200">

      {/* Header */}
      <header className="px-4 pt-4 pb-3 border-b border-[#2B2F33] bg-[#08090A]">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            aria-label="Back"
            className="
              w-10 h-10 flex items-center justify-center
              rounded-xl bg-[#191C1F] border border-[#2B2F33]
              text-[#A4A9AE]
              hover:text-[#F5F7F8] hover:bg-[#22262A]
              active:scale-95 transition-all
            "
          >
            <ArrowLeft size={19} />
          </button>

          <div className="min-w-0">
            <h1 className="text-base font-bold text-[#F5F7F8] font-display tracking-tight">
              Offline Maps
            </h1>
            <p className="text-[10px] text-[#6F757B] mt-0.5">
              Download regions for zero-data navigation
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 pt-4 pb-6">

        {/* Offline Information Card */}
        <section className="
          rounded-2xl
          bg-[#111315]
          border border-[#2B2F33]
          p-4
          mb-4
        ">
          <div className="flex items-start gap-3">
            <div className="
              w-10 h-10 shrink-0
              rounded-xl
              bg-[#22C55E]/10
              border border-[#22C55E]/20
              flex items-center justify-center
              text-[#22C55E]
            ">
              <ShieldCheck size={19} />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xs font-bold text-[#F5F7F8]">
                  Offline Navigation Ready
                </h2>

                <span className="
                  text-[8px] font-black uppercase
                  px-1.5 py-0.5 rounded-md
                  bg-[#22C55E]/10
                  text-[#22C55E]
                  border border-[#22C55E]/20
                ">
                  Secure
                </span>
              </div>

              <p className="text-[11px] leading-relaxed
```
