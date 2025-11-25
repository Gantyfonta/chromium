import React, { useState } from 'react';
import { Tab } from '../types';
import { SearchIcon, GlobeIcon } from './Icons';

interface ContentAreaProps {
  tab: Tab;
  onNavigate: (url: string) => void;
}

// A list of sites known to allow iframing (X-Frame-Options not set to DENY)
const getSimulatedResults = (query: string) => [
  {
    title: `${query} - Wikipedia`,
    url: `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`,
    desc: `Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikipedia Foundation.`,
    displayUrl: `en.wikipedia.org › wiki › ${query}`
  },
  {
    title: `Bing Search: ${query}`,
    url: `https://www.bing.com/search?q=${encodeURIComponent(query)}`,
    desc: `Bing helps you turn information into action, making it faster and easier to go from searching to doing.`,
    displayUrl: `www.bing.com › search`
  },
  {
    title: `${query} Definition & Meaning - Dictionary.com`,
    url: `https://www.dictionary.com/browse/${encodeURIComponent(query)}`,
    desc: `The world's leading online dictionary: English definitions, synonyms, word origins, example sentences, word games, and more.`,
    displayUrl: `www.dictionary.com › browse › ${query}`
  },
  {
    title: `OpenStreetMap - ${query}`,
    url: `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`,
    desc: `OpenStreetMap is a map of the world, created by people like you and free to use under an open license.`,
    displayUrl: `www.openstreetmap.org`
  },
  {
    title: `Internet Archive: ${query}`,
    url: `https://archive.org/search.php?query=${encodeURIComponent(query)}`,
    desc: `Digital library of free & borrowable books, movies, music & Wayback Machine.`,
    displayUrl: `archive.org › details`
  }
];

const ContentArea: React.FC<ContentAreaProps> = ({ tab, onNavigate }) => {
  const [iframeError, setIframeError] = useState(false);

  // --- Internal Page: New Tab ---
  if (!tab.url || tab.url === 'browser://newtab') {
    return (
      <div className="flex-1 w-full bg-white flex flex-col items-center justify-center p-4">
         <div className="max-w-xl w-full flex flex-col items-center gap-8 mb-32">
            {/* Retro Google Logo */}
            <div className="text-[5rem] font-bold tracking-tighter select-none mb-2 drop-shadow-sm" style={{ fontFamily: 'serif' }}>
                <span className="text-[#4285f4]">G</span>
                <span className="text-[#ea4335]">o</span>
                <span className="text-[#fbbc05]">o</span>
                <span className="text-[#4285f4]">g</span>
                <span className="text-[#34a853]">l</span>
                <span className="text-[#ea4335]">e</span>
            </div>
            
            <div className="w-full relative max-w-lg group">
                <input
                    type="text"
                    autoFocus
                    placeholder=""
                    className="w-full bg-white text-slate-800 rounded-md py-2 px-4 text-base focus:outline-none border border-slate-300 shadow-inner focus:border-blue-400"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onNavigate(e.currentTarget.value);
                        }
                    }}
                />
                <div className="flex justify-center gap-2 mt-4">
                    <button className="bg-[#f2f2f2] border border-[#f2f2f2] hover:border-[#c6c6c6] hover:shadow-sm text-slate-600 text-sm font-bold py-2 px-4 rounded text-[#5F6368]">
                        Google Search
                    </button>
                    <button className="bg-[#f2f2f2] border border-[#f2f2f2] hover:border-[#c6c6c6] hover:shadow-sm text-slate-600 text-sm font-bold py-2 px-4 rounded text-[#5F6368]">
                        I'm Feeling Lucky
                    </button>
                </div>
            </div>

            <div className="text-center text-xs text-slate-400 mt-8">
                <p>Note: This is a simulation. Real Google sites block embedding.</p>
                <p>Search results will prioritize iframe-compatible sites (Wikipedia, etc).</p>
            </div>
         </div>
      </div>
    );
  }

  // --- Internal Page: Search Results ---
  if (tab.url.startsWith('browser://search')) {
    const params = new URLSearchParams(tab.url.split('?')[1]);
    const query = params.get('q') || '';
    const results = getSimulatedResults(query);

    return (
        <div className="flex-1 w-full bg-white overflow-y-auto">
            {/* Retro Search Header */}
            <div className="bg-[#f1f1f1] border-b border-[#e4e4e4] p-4 flex items-center gap-4 sticky top-0 z-10">
                <div className="text-2xl font-bold cursor-pointer" onClick={() => onNavigate('browser://newtab')} style={{ fontFamily: 'serif' }}>
                    <span className="text-[#4285f4]">G</span>
                    <span className="text-[#ea4335]">o</span>
                    <span className="text-[#fbbc05]">o</span>
                    <span className="text-[#4285f4]">g</span>
                    <span className="text-[#34a853]">l</span>
                    <span className="text-[#ea4335]">e</span>
                </div>
                <div className="flex-1 max-w-2xl">
                    <input 
                        defaultValue={query}
                        className="w-full border border-[#d9d9d9] p-2 px-3 shadow-inner font-sans text-base"
                        onKeyDown={(e) => e.key === 'Enter' && onNavigate(e.currentTarget.value)}
                    />
                </div>
            </div>

            {/* Results Container */}
            <div className="max-w-3xl ml-4 sm:ml-36 pt-6 pb-12 pr-4">
                <div className="text-xs text-slate-500 mb-4">
                    About {Math.floor(Math.random() * 1000000)} results ({(Math.random() * 0.5).toFixed(2)} seconds)
                </div>

                {results.map((res, i) => (
                    <div key={i} className="mb-8 font-sans">
                        <div className="group cursor-pointer" onClick={() => onNavigate(res.url)}>
                            <div className="text-sm text-[#006621] mb-1">{res.displayUrl}</div>
                            <div className="text-xl text-[#1a0dab] hover:underline font-medium visited:text-[#609]">
                                {res.title}
                            </div>
                        </div>
                        <div className="text-sm text-[#545454] leading-normal mt-1 max-w-xl">
                            <span className="text-slate-400 text-xs mr-2">{new Date().toDateString()} —</span>
                            {res.desc}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
  }

  // --- External Page (Iframe) ---
  return (
    <div className="flex-1 w-full relative bg-white h-full">
      <iframe
        key={tab.url}
        src={tab.url}
        className="w-full h-full border-none bg-white"
        title={`Browser View - ${tab.title}`}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-presentation"
        referrerPolicy="no-referrer"
        onError={() => setIframeError(true)}
      />
      
      {/* Floating Action Button for sites that refuse to connect */}
      <div className="absolute bottom-4 right-4 z-50">
        <a 
            href={tab.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-2 rounded shadow-lg text-sm font-bold transition-all"
        >
            <GlobeIcon className="w-4 h-4"/>
            <span>Open in Real Tab</span>
        </a>
      </div>
    </div>
  );
};

export default ContentArea;