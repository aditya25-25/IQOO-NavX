import React from 'react';
import { Map, Bookmark, HardDrive, Settings } from 'lucide-react';

export type TabType = 'map' | 'saved' | 'regions' | 'settings';

interface BottomNavBarProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  isNavigating: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  isNavigating,
}) => {
  // During active turn-by-turn navigation, keep bottom interface minimal and navigation-focused
  if (isNavigating) {
    return null;
  }

  const navItems = [
    { id: 'map' as TabType, label: 'Map', icon: Map },
    { id: 'saved' as TabType, label: 'Saved Places', icon: Bookmark },
    { id: 'regions' as TabType, label: 'Offline Maps', icon: HardDrive },
    { id: 'settings' as TabType, label: 'Sensors & Info', icon: Settings },
  ];

  return (
    <div className="w-full bg-[#0b0e17]/95 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex items-center justify-around z-30 select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChangeTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all ${
              isActive
                ? 'text-[#ff4800] bg-[#ff4800]/10 font-bold'
                : 'text-neutral-400 hover:text-white font-medium'
            }`}
          >
            <Icon size={18} className={isActive ? 'text-[#ff4800]' : 'text-neutral-400'} />
            <span className="text-[10px] tracking-wide font-display">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
