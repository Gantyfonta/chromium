export interface Tab {
  id: string;
  url: string;     // The actual URL being displayed
  displayUrl: string; // What shows in the bar (might differ slightly)
  title: string;
  loading: boolean;
  history: string[]; // Back stack of URLs
  historyIndex: number;
}

export enum BrowserAction {
  NEW_TAB,
  CLOSE_TAB,
  SWITCH_TAB,
  NAVIGATE,
  BACK,
  FORWARD,
  RELOAD
}