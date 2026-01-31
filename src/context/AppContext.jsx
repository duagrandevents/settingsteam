import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Load initial state from localStorage or default to empty
  const [sites, setSites] = useState(() => {
    try {
      const saved = localStorage.getItem('stock_app_sites');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Error loading sites:', e);
      return [];
    }
  });

  // Save to localStorage whenever sites change
  useEffect(() => {
    localStorage.setItem('stock_app_sites', JSON.stringify(sites));
  }, [sites]);

  const addSite = React.useCallback((newSite) => {
    const site = {
      ...newSite,
      id: Date.now().toString(),
      status: 'assigned',
      products: newSite.products || [],
      history: []
    };
    setSites(prev => [...prev, site]);
  }, []);

  const updateSite = React.useCallback((siteId, updatedData) => {
    setSites(prev => prev.map(site =>
      site.id === siteId ? { ...site, ...updatedData } : site
    ));
  }, []);

  const getSite = React.useCallback((siteId) => {
    return sites.find(s => s.id === siteId);
  }, [sites]);

  const deleteSite = React.useCallback((siteId) => {
    setSites(prev => prev.filter(s => s.id !== siteId));
  }, []);

  return (
    <AppContext.Provider value={{ sites, addSite, updateSite, getSite, deleteSite }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
