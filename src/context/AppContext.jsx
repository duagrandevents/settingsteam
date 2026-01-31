import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial Fetch & Real-time Subscription
  useEffect(() => {
    const fetchSites = async () => {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase Setup Error:', error);
        if (error.code === 'PGRST116' || error.message.includes('relation "sites" does not exist')) {
          alert('SYSTEM ERROR: The "sites" table is missing in your Supabase database. Please run the SQL script provided in the sync plan.');
        }
      } else {
        setSites(data || []);
      }
      setLoading(false);
    };

    fetchSites();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('sites_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sites' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setSites(prev => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setSites(prev => prev.map(site => site.id === payload.new.id ? payload.new : site));
        } else if (payload.eventType === 'DELETE') {
          setSites(prev => prev.filter(site => site.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const addSite = React.useCallback(async (newSite) => {
    const site = {
      ...newSite,
      status: 'assigned',
      products: newSite.products || [],
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('sites').insert([site]);
    if (error) console.error('Error adding site:', error);
  }, []);

  const updateSite = React.useCallback(async (siteId, updatedData) => {
    // Optimistic update
    setSites(prev => prev.map(site =>
      site.id === siteId ? { ...site, ...updatedData } : site
    ));

    const { error } = await supabase
      .from('sites')
      .update(updatedData)
      .eq('id', siteId);

    if (error) console.error('Error updating site:', error);
  }, []);

  const getSite = React.useCallback((siteId) => {
    return sites.find(s => String(s.id) === String(siteId));
  }, [sites]);

  const deleteSite = React.useCallback(async (siteId) => {
    const { error } = await supabase
      .from('sites')
      .delete()
      .eq('id', siteId);

    if (error) console.error('Error deleting site:', error);
  }, []);

  return (
    <AppContext.Provider value={{ sites, addSite, updateSite, getSite, deleteSite, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
