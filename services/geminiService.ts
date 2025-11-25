/**
 * Utility to format user input into a valid URL or Search Query.
 */
export const formatUrl = (input: string): string => {
  const trimmed = input.trim();
  
  if (!trimmed) return "browser://newtab";

  // Handle internal pages
  if (trimmed.startsWith('browser://')) {
    return trimmed;
  }

  // Regex to check if input looks like a domain or URL
  const hasProtocol = /^http(s)?:\/\//i.test(trimmed);
  const hasDomain = /\.[a-z]{2,}($|\/)/i.test(trimmed);
  
  // If it has a protocol, return as is
  if (hasProtocol) {
    return trimmed;
  }

  // If it looks like a domain (e.g., google.com), prepend https://
  if (hasDomain && !trimmed.includes(' ')) {
    return `https://${trimmed}`;
  }

  // Otherwise, route to internal simulated search engine
  return `browser://search?q=${encodeURIComponent(trimmed)}`;
};

export const getDisplayTitle = (url: string): string => {
  if (!url || url === 'browser://newtab') return "New Tab";
  
  try {
    // Handle internal URLs
    if (url.startsWith('browser://')) {
      const urlObj = new URL(url.replace('browser://', 'http://browser/'));
      if (urlObj.pathname === '/search') {
        const query = new URLSearchParams(urlObj.search).get('q');
        return query ? `${query} - Google Search` : "Search";
      }
      return "System Page";
    }

    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url;
  }
};