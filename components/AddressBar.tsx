import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, RotateCwIcon, HomeIcon, SearchIcon, ShieldIcon } from './Icons';

interface AddressBarProps {
  url: string;
  onNavigate: (url: string) => void;
  onRefresh: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onBack: () => void;
  onForward: () => void;
  isLoading: boolean;
}

const AddressBar: React.FC<AddressBarProps> = ({
  url,
  onNavigate,
  onRefresh,
  canGoBack,
  canGoForward,
  onBack,
  onForward,
  isLoading
}) => {
  // Helper to make display URL look nice
  const getInputValue = (rawUrl: string) => {
    if (rawUrl === 'browser://newtab') return '';
    if (rawUrl.startsWith('browser://search')) {
        const params = new URLSearchParams(rawUrl.split('?')[1]);
        return params.get('q') || rawUrl;
    }
    return rawUrl;
  };

  const [inputVal, setInputVal] = useState(getInputValue(url));

  // Sync internal state with prop changes
  useEffect(() => {
    setInputVal(getInputValue(url));
  }, [url]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onNavigate(inputVal);
    }
  };

  return (
    <div className="flex items-center gap-2 h-[38px] bg-[#f2f2f2] border-b border-[#bababa] px-2 shadow-sm z-20">
      <div className="flex gap-1">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="p-1 rounded-full text-[#5F6368] hover:bg-[#dcdcdc] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ArrowLeftIcon />
        </button>
        <button
          onClick={onForward}
          disabled={!canGoForward}
          className="p-1 rounded-full text-[#5F6368] hover:bg-[#dcdcdc] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
        >
          <ArrowRightIcon />
        </button>
        <button
          onClick={onRefresh}
          className={`p-1 rounded-full text-[#5F6368] hover:bg-[#dcdcdc] transition-colors ${isLoading ? 'animate-spin' : ''}`}
        >
          <RotateCwIcon />
        </button>
      </div>

      <button 
        onClick={() => onNavigate("browser://newtab")}
        className="p-1 rounded-full text-[#5F6368] hover:bg-[#dcdcdc] transition-colors hidden sm:block"
      >
        <HomeIcon />
      </button>

      {/* URL Bar Container */}
      <div className="flex-1 flex items-center relative group h-[28px]">
        {/* Chrome Old Style Omnibox */}
        <div className="absolute inset-0 bg-white rounded-[14px] border border-[#dadce0] group-focus-within:border-blue-400/50 group-focus-within:shadow-[0_1px_6px_rgba(32,33,36,0.28)] transition-all pointer-events-none"></div>
        
        <div className="absolute left-3 z-10 text-slate-500 pointer-events-none group-focus-within:hidden flex items-center h-full">
            {url.startsWith('https://') ? <ShieldIcon className="text-[#1a73e8] w-3 h-3"/> : null}
            {!url.startsWith('http') && !url.startsWith('browser') && <SearchIcon className="w-3 h-3"/>}
        </div>
        
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={(e) => e.target.select()}
          placeholder="Search Google or type a URL"
          className={`
            relative w-full bg-transparent text-[#202124] rounded-full py-0 pl-9 pr-4 text-[14px] focus:outline-none placeholder:text-slate-500 z-1 h-full
            ${inputVal === '' ? 'pl-9' : 'pl-9'}
          `}
        />
        
        {/* Star Icon (Simulation) */}
        <div className="absolute right-3 top-0 bottom-0 flex items-center">
            <svg className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
        </div>
      </div>
      
      <div className="w-8 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-[#dcdcdc] flex items-center justify-center text-white cursor-pointer overflow-hidden hover:opacity-80">
             <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#5F6368]">
                 <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
             </svg>
        </div>
      </div>
    </div>
  );
};

export default AddressBar;