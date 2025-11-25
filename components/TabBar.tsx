import React from 'react';
import { Tab } from '../types';
import { XIcon, PlusIcon, GlobeIcon } from './Icons';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string;
  onSwitch: (id: string) => void;
  onClose: (id: string, e: React.MouseEvent) => void;
  onNew: () => void;
}

const TabBar: React.FC<TabBarProps> = ({ tabs, activeTabId, onSwitch, onClose, onNew }) => {
  return (
    <div className="flex items-end h-[42px] bg-[#dfe1e5] w-full px-2 pt-2 gap-0 overflow-x-auto no-scrollbar select-none">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            onClick={() => onSwitch(tab.id)}
            className={`
              group relative flex items-center min-w-[160px] max-w-[240px] h-[34px] px-3 rounded-t-lg cursor-pointer transition-all duration-100 border-x border-t
              ${isActive 
                ? 'bg-white text-slate-800 border-transparent shadow-sm z-10' 
                : 'bg-transparent text-slate-600 border-transparent hover:bg-white/40'
              }
            `}
            style={{
                // Simulate the slightly angled tab look of older browsers with border radius
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
            }}
          >
            <div className="mr-2 opacity-70">
                {tab.loading ? (
                    <div className="animate-spin h-3 w-3 border-2 border-slate-400 border-t-blue-500 rounded-full"></div>
                ) : (
                    <GlobeIcon className="w-4 h-4" />
                )}
            </div>
            
            <span className="text-xs truncate flex-1 font-normal select-none">
              {tab.title || "New Tab"}
            </span>

            <button
              onClick={(e) => onClose(tab.id, e)}
              className={`ml-2 p-0.5 rounded-full hover:bg-slate-200 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}
            >
              <XIcon className="w-3 h-3" />
            </button>

            {/* Separator for inactive tabs - simulated by right border in older designs, here we use a pseudo element if needed, but the gap-0 handles it mostly */}
            {!isActive && <div className="absolute right-0 top-1.5 bottom-1.5 w-[1px] bg-slate-400/30 group-hover:hidden" />}
          </div>
        );
      })}

      <button
        onClick={onNew}
        className="flex items-center justify-center w-7 h-7 ml-1 text-slate-600 hover:bg-slate-300/50 rounded-full transition-colors"
        title="New Tab"
      >
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TabBar;