```tsx id="f0m3qk"
import React from 'react';
import {
  Map,
  Bookmark,
  DownloadCloud,
  Settings,
} from 'lucide-react';

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
  // Keep active turn-by-turn navigation map-focused.
  if (isNavigating) {
    return null;
  }

  const navItems = [
    {
      id: 'map' as TabType,
      label: 'Map',
      icon: Map,
    },
    {
      id: 'saved' as TabType,
      label: 'Saved',
      icon: Bookmark,
    },
    {
      id: 'regions' as TabType,
      label: 'Offline',
      icon: DownloadCloud,
    },
    {
      id: 'settings' as TabType,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className="relative z-30 w-full border-t border-[#2B2F33] bg-[#08090A] px-2 pb-[max(6px,env(safe-area-inset-bottom))] pt-2 select-none"
    >
      <div className="mx-auto flex w-full max-w-lg items-center justify-around gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChangeTab(item.id)}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              className={[
                'group relative flex min-h-[52px] min-w-[68px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5',
                'transition-all duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD400]/60',
                'active:scale-[0.96]',
                isActive
                  ? 'bg-[#FFD400]/10 text-[#FFD400]'
                  : 'text-[#6F757B] hover:bg-[#191C1F] hover:text-[#F5F7F8]',
              ].join(' ')}
            >
              {/* Active indicator */}
              <span
                aria-hidden="true"
                className={[
                  'absolute top-0 h-0.5 rounded-full transition-all duration-200',
                  isActive
                    ? 'w-7 bg-[#FFD400]'
                    : 'w-0 bg-transparent',
                ].join(' ')}
              />

              <Icon
                size={19}
                strokeWidth={isActive ? 2.5 : 2}
                className={[
                  'transition-transform duration-200',
                  isActive
                    ? 'text-[#FFD400]'
                    : 'text-[#6F757B] group-hover:text-[#F5F7F8]',
                ].join(' ')}
              />

              <span
                className={[
                  'text-[10px] tracking-wide',
                  isActive
                    ? 'font-black text-[#F5F7F8]'
                    : 'font-semibold text-[#6F757B] group-hover:text-[#A4A9AE]',
                ].join(' ')}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
```
