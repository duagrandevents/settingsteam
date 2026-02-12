import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [sites, setSites] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null); // 'missing_table', 'connection_error', or null

  const [appSettings, setAppSettings] = useState({});

  // Fetch App Settings (PIN)
  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase.from('app_settings').select('*');
      if (data) {
        const settingsMap = data.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
        setAppSettings(settingsMap);
      }
    };
    fetchSettings();
  }, []);

  const updateSetting = async (key, value) => {
    const { error } = await supabase
      .from('app_settings')
      .upsert({ key, value });

    if (!error) {
      setAppSettings(prev => ({ ...prev, [key]: value }));
    } else {
      console.error('Error updating setting:', error);
    }
    return { error };
  };

  // Initial Fetch & Real-time Subscription
  useEffect(() => {
    const fetchSites = async () => {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase Connection Error:', error);
        setDbError(error);
      } else {
        setSites(data || []);
        setDbError(null);
      }
      setLoading(false);
    };

    fetchSites();
    fetchContacts(); // Call fetchContacts here

    // Subscribe to real-time changes for sites
    const sitesChannel = supabase
      .channel('sites_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sites' }, (payload) => {
        setSites(prev => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'sites' }, (payload) => {
        setSites(prev => prev.map(site => site.id === payload.new.id ? payload.new : site));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'sites' }, (payload) => {
        setSites(prev => prev.filter(site => site.id !== payload.old.id));
      })
      .subscribe();

    // Contacts subscription
    const contactsChannel = supabase.channel('contacts_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'contacts' }, payload => {
        setContacts(prev => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'contacts' }, payload => {
        setContacts(prev => prev.map(c => c.id === payload.new.id ? payload.new : c));
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'contacts' }, payload => {
        setContacts(prev => prev.filter(c => c.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sitesChannel);
      supabase.removeChannel(contactsChannel);
    };
  }, []);

  // Fetch Contacts
  const fetchContacts = async () => {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('category', { ascending: true });

    if (error) {
      console.error('Error fetching contacts:', error);
    } else {
      setContacts(data || []);
    }
  };

  const addContact = React.useCallback(async (newContact) => {
    const { error } = await supabase.from('contacts').insert([newContact]);
    if (error) {
      console.error('Error adding contact:', error);
      return { error };
    }
    return { error: null };
  }, []);

  const updateContact = React.useCallback(async (contactId, updatedData) => {
    const { error } = await supabase
      .from('contacts')
      .update(updatedData)
      .eq('id', contactId);

    if (error) console.error('Error updating contact:', error);
    return { error };
  }, []);

  const deleteContact = React.useCallback(async (contactId) => {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactId);

    if (error) console.error('Error deleting contact:', error);
    return { error };
  }, []);

  const addSite = React.useCallback(async (newSite) => {
    const site = {
      ...newSite,
      status: 'assigned',
      products: newSite.products || [],
      created_at: new Date().toISOString()
    };

    const { error } = await supabase.from('sites').insert([site]);
    if (error) {
      console.error('Error adding site:', error);
      return { error };
    }
    return { error: null };
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

  const completeSiteWithTeam = React.useCallback(async (siteId, teamMembers) => {
    const updatedData = {
      team_members: teamMembers,
      completed_at: new Date().toISOString()
    };

    // Optimistic update
    setSites(prev => prev.map(site =>
      site.id === siteId ? { ...site, ...updatedData } : site
    ));

    const { error } = await supabase
      .from('sites')
      .update(updatedData)
      .eq('id', siteId);

    if (error) {
      console.error('Error completing site with team:', error);
      return { error };
    }
    return { error: null };
  }, []);

  const markSiteAsPaid = React.useCallback(async (siteId, paymentAmounts) => {
    // paymentAmounts is an array: [{ name: "Ravi", amount: 5000 }, ...]
    const updatedData = {
      payment_status: 'paid',
      payment_amounts: paymentAmounts,
      paid_at: new Date().toISOString()
    };

    // Optimistic update
    setSites(prev => prev.map(site =>
      site.id === siteId ? { ...site, ...updatedData } : site
    ));

    const { error } = await supabase
      .from('sites')
      .update(updatedData)
      .eq('id', siteId);

    if (error) {
      console.error('Error marking site as paid:', error);
      return { error };
    }
    return { error: null };
  }, []);

  return (
    <AppContext.Provider value={{ sites, addSite, updateSite, getSite, deleteSite, completeSiteWithTeam, markSiteAsPaid, contacts, addContact, updateContact, deleteContact, loading, dbError, appSettings, updateSetting }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
