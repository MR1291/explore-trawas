import React, { createContext, useState, useEffect } from 'react';
import { initialVillages, initialDestinations, travelEstimatesData } from '../data/mockData';

export const AppContext = createContext();

const DATA_VERSION = '2.0.0_trawas_complete';

export const AppProvider = ({ children }) => {
  const [villages, setVillages] = useState(() => {
    const savedVersion = localStorage.getItem('explore_trawas_data_version');
    const saved = localStorage.getItem('explore_trawas_villages');
    if (savedVersion === DATA_VERSION && saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing villages from localStorage', e);
      }
    }
    return initialVillages;
  });

  const [destinations, setDestinations] = useState(() => {
    const savedVersion = localStorage.getItem('explore_trawas_data_version');
    const saved = localStorage.getItem('explore_trawas_destinations');
    if (savedVersion === DATA_VERSION && saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing destinations from localStorage', e);
      }
    }
    return initialDestinations;
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('explore_trawas_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist to local storage & track version
  useEffect(() => {
    localStorage.setItem('explore_trawas_data_version', DATA_VERSION);
    localStorage.setItem('explore_trawas_villages', JSON.stringify(villages));
  }, [villages]);

  useEffect(() => {
    localStorage.setItem('explore_trawas_data_version', DATA_VERSION);
    localStorage.setItem('explore_trawas_destinations', JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem('explore_trawas_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Village actions
  const addVillage = (village) => {
    const newVillage = {
      ...village,
      id: villages.length > 0 ? Math.max(...villages.map(v => v.id)) + 1 : 1,
      slug: village.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    };
    setVillages([...villages, newVillage]);
    return newVillage;
  };

  const updateVillage = (updatedVillage) => {
    setVillages(villages.map(v => v.id === updatedVillage.id ? {
      ...updatedVillage,
      slug: updatedVillage.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    } : v));
  };

  const deleteVillage = (id) => {
    setVillages(villages.filter(v => v.id !== id));
    setDestinations(destinations.filter(d => d.village_id !== id));
  };

  // Destination actions
  const addDestination = (destination) => {
    const newDest = {
      ...destination,
      id: destinations.length > 0 ? Math.max(...destinations.map(d => d.id)) + 1 : 1,
      slug: destination.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: parseFloat(destination.rating) || 5.0,
      price: parseFloat(destination.price) || 0
    };
    setDestinations([...destinations, newDest]);
    return newDest;
  };

  const updateDestination = (updatedDest) => {
    setDestinations(destinations.map(d => d.id === updatedDest.id ? {
      ...updatedDest,
      slug: updatedDest.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: parseFloat(updatedDest.rating) || d.rating,
      price: parseFloat(updatedDest.price) || 0
    } : d));
  };

  const deleteDestination = (id) => {
    setDestinations(destinations.filter(d => d.id !== id));
    setFavorites(favorites.filter(favId => favId !== id));
  };

  // Reset to default data
  const resetToDefaultData = () => {
    localStorage.setItem('explore_trawas_data_version', DATA_VERSION);
    setVillages(initialVillages);
    setDestinations(initialDestinations);
  };

  // Favorite actions
  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(favId => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const isFavorite = (id) => favorites.includes(id);

  return (
    <AppContext.Provider value={{
      villages,
      destinations,
      favorites,
      travelEstimatesData,
      addVillage,
      updateVillage,
      deleteVillage,
      addDestination,
      updateDestination,
      deleteDestination,
      resetToDefaultData,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </AppContext.Provider>
  );
};
