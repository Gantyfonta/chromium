import React, { useState, useCallback } from 'react';
import TabBar from './components/TabBar';
import AddressBar from './components/AddressBar';
import ContentArea from './components/ContentArea';
import { Tab, BrowserAction } from './types';
import { formatUrl, getDisplayTitle } from './services/geminiService';

// Utility to generate unique IDs
const uuid = () => Math.random().toString(36).substr(2, 9);

const INITIAL_TAB: Tab = {
  id: 'tab-init',
  url: '',
  displayUrl: '',
  title: 'New Tab',
  loading: false,
  history: [],
  historyIndex: -1,
};

const App: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([INITIAL_TAB]);
  const [activeTabId, setActiveTabId] = useState<string>(INITIAL_TAB.id);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const updateTab = useCallback((tabId: string, updates: Partial<Tab>) => {
    setTabs((prev) =>
      prev.map((t) => (t.id === tabId ? { ...t, ...updates } : t))
    );
  }, []);

  const handleNavigate = useCallback((input: string, tabId: string) => {
    if (!input.trim()) {
        updateTab(tabId, { 
            url: '',
            displayUrl: '', 
            title: 'New Tab',
            loading: false
        });
        return;
    }

    const formattedUrl = formatUrl(input);
    const title = getDisplayTitle(formattedUrl);

    setTabs(prev => {
        return prev.map(t => {
            if (t.id !== tabId) return t;
            
            // Push to history
            const newHistory = t.history.slice(0, t.historyIndex + 1);
            newHistory.push(formattedUrl);
            
            return {
                ...t,
                url: formattedUrl,
                displayUrl: formattedUrl,
                title: title,
                loading: false, // Iframe loading state is hard to track, assume loaded
                history: newHistory,
                historyIndex: newHistory.length - 1
            }
        })
    });
  }, [updateTab]);

  const handleBrowserAction = (action: BrowserAction, payload?: any) => {
    switch (action) {
      case BrowserAction.NEW_TAB: {
        const newTab: Tab = { ...INITIAL_TAB, id: uuid(), history: [], historyIndex: -1 };
        setTabs((prev) => [...prev, newTab]);
        setActiveTabId(newTab.id);
        break;
      }
      case BrowserAction.CLOSE_TAB: {
        const tabIdToClose = payload;
        const index = tabs.findIndex((t) => t.id === tabIdToClose);
        if (tabs.length === 1) {
           updateTab(tabIdToClose, { ...INITIAL_TAB, id: tabIdToClose });
           return;
        }

        const newTabs = tabs.filter((t) => t.id !== tabIdToClose);
        setTabs(newTabs);
        
        if (activeTabId === tabIdToClose) {
          const newIndex = index > 0 ? index - 1 : 0;
          setActiveTabId(newTabs[newIndex].id);
        }
        break;
      }
      case BrowserAction.SWITCH_TAB:
        setActiveTabId(payload);
        break;
      case BrowserAction.NAVIGATE:
        handleNavigate(payload, activeTabId);
        break;
      case BrowserAction.RELOAD:
        // Force iframe reload by re-setting URL (React key will handle it in ContentArea)
        if (activeTab.url) {
            const current = activeTab.url;
            updateTab(activeTabId, { url: '' }); // Flicker
            setTimeout(() => updateTab(activeTabId, { url: current }), 10);
        }
        break;
      case BrowserAction.BACK: {
        if (activeTab.historyIndex > 0) {
            const newIndex = activeTab.historyIndex - 1;
            const prevUrl = activeTab.history[newIndex];
            updateTab(activeTabId, { 
                historyIndex: newIndex, 
                url: prevUrl, 
                displayUrl: prevUrl,
                title: getDisplayTitle(prevUrl)
            });
        }
        break;
      }
      case BrowserAction.FORWARD: {
         if (activeTab.historyIndex < activeTab.history.length - 1) {
            const newIndex = activeTab.historyIndex + 1;
            const nextUrl = activeTab.history[newIndex];
            updateTab(activeTabId, { 
                historyIndex: newIndex, 
                url: nextUrl,
                displayUrl: nextUrl,
                title: getDisplayTitle(nextUrl)
            });
         }
         break;
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#dfe1e5]">
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSwitch={(id) => handleBrowserAction(BrowserAction.SWITCH_TAB, id)}
        onClose={(id, e) => {
          e.stopPropagation();
          handleBrowserAction(BrowserAction.CLOSE_TAB, id);
        }}
        onNew={() => handleBrowserAction(BrowserAction.NEW_TAB)}
      />

      <AddressBar
        url={activeTab.displayUrl}
        onNavigate={(url) => handleBrowserAction(BrowserAction.NAVIGATE, url)}
        onRefresh={() => handleBrowserAction(BrowserAction.RELOAD)}
        canGoBack={activeTab.historyIndex > 0}
        canGoForward={activeTab.historyIndex < activeTab.history.length - 1}
        onBack={() => handleBrowserAction(BrowserAction.BACK)}
        onForward={() => handleBrowserAction(BrowserAction.FORWARD)}
        isLoading={activeTab.loading}
      />

      <ContentArea
        tab={activeTab}
        onNavigate={(url) => handleBrowserAction(BrowserAction.NAVIGATE, url)}
      />
    </div>
  );
};

export default App;