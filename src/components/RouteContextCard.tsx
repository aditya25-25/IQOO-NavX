```tsx
import React from 'react';
import { RouteContextInfo } from '../types';
import {
  ShieldAlert,
  AlertTriangle,
  Milestone,
  CreditCard,
  RadioTower,
} from 'lucide-react';

interface RouteContextCardProps {
  context: RouteContextInfo;
}

export const RouteContextCard: React.FC<RouteContextCardProps> = ({
  context,
}) => {
  if (!context || context.details.length === 0) return null;

  return (
    <div className="w-full px-3 sm:px-4 select-none">
      <div className="overflow-hidden rounded-2xl border border-[#2B2F33] bg-[#111315]/98 shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2B2F33] px-3.5 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FFD400]/10">
              <Milestone
                size={14}
                className="text-[#FFD400]"
                strokeWidth={2.5}
              />
            </div>

            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-[#F5F7F8]">
                Route Context
              </p>

              <p className="mt-0.5 text-[8px] font-medium uppercase tracking-wider text-[#6F757B]">
                Upcoming road conditions
              </p>
            </div>
          </div>

          <span className="shrink-0 rounded-full border border-[#2B2F33] bg-[#191C1F] px-2 py-1 text-[8px] font-bold uppercase tracking-wide text-[#6F757B]">
            Live
          </span>
        </div>

        {/* Context badges */}
        <div className="flex flex-wrap gap-1.5 px-3.5 pt-3">
          {context.isHighway && (
            <div className="flex items-center gap-1.5 rounded-lg border border-[#3B82F6]/25 bg-[#3B82F6]/10 px-2.5 py-1.5 text-[10px] font-bold text-[#93C5FD]">
              <Milestone
                size={12}
                className="text-[#3B82F6]"
                strokeWidth={2.5}
              />
              <span>NH-44 Highway</span>
            </div>
          )}

          {context.isToll && (
            <div className="flex items-center gap-1.5 rounded-lg border border-[#A78BFA]/25 bg-[#A78BFA]/10 px-2.5 py-1.5 text-[10px] font-bold text-[#C4B5FD]">
              <CreditCard
                size={12}
                className="text-[#A78BFA]"
                strokeWidth={2.5}
              />
              <span>Toll Road</span>
            </div>
          )}

          {context.isPoorConnectivityZone && (
            <div className="flex items-center gap-1.5 rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-2.5 py-1.5 text-[10px] font-bold text-[#FCD34D]">
              <RadioTower
                size={12}
                className="text-[#F59E0B]"
                strokeWidth={2.5}
              />
              <span>Poor Connectivity</span>
            </div>
          )}

          {context.isUnpaved && (
            <div className="flex items-center gap-1.5 rounded-lg border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-2.5 py-1.5 text-[10px] font-bold text-[#FCD34D]">
              <AlertTriangle
                size={12}
                className="text-[#F59E0B]"
                strokeWidth={2.5}
              />
              <span>Unpaved Road</span>
            </div>
          )}

          {context.hasRoadClosure && (
            <div className="flex items-center gap-1.5 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-2.5 py-1.5 text-[10px] font-bold text-[#FCA5A5]">
              <ShieldAlert
                size={12}
                className="text-[#EF4444]"
                strokeWidth={2.5}
              />
              <span>Road Closure Ahead</span>
            </div>
          )}
        </div>

        {/* Factual details */}
        <div className="space-y-1.5 px-3.5 pb-3.5 pt-3">
          {context.details.map((detail, idx) => (
            <div
              key={`${detail}-${idx}`}
              className="flex items-start gap-2 rounded-lg bg-[#191C1F] px-2.5 py-2"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FFD400]" />

              <p className="text-[10px] font-medium leading-relaxed text-[#A4A9AE]">
                {detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
```
