import React from 'react';
import { Map, Bookmark, DownloadCloud, Settings } from 'lucide-react';

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
  // During active turn-by-turn navigation, keep bottom interface clean and map-focused
  if (isNavigating) {
    return null;
  }

  const navItems = [
    { id: 'map' as TabType, label: 'Map', icon: Map },
    { id: 'saved' as TabType, label: 'Saved Places', icon: Bookmark },
    { id: 'regions' as TabType, label: 'Download Region', icon: DownloadCloud },
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-full bg-[#111315]/95 backdrop-blur-xl border-t border-[#2B2F33] px-4 py-2 flex items-center justify-around z-30 select-none">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChangeTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all ${
              isActive
                ? 'text-[#FFD400] bg-[#FFD400]/10 font-bold'
                : 'text-[#A4A9AE] hover:text-[#F5F7F8] font-medium'
            }`}
          >
            <Icon size={18} className={isActive ? 'text-[#FFD400]' : 'text-[#A4A9AE]'} />
            <span className="text-[10px] tracking-wide font-display">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
