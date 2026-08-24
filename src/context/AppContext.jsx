import React, { createContext, useState, useEffect } from 'react';
import { initialVillages, initialDestinations, travelEstimatesData } from '../data/mockData';

export const AppContext = createContext();

const DATA_VERSION = '2.1.0_trawas_auth_and_maps';

// Initial real-like reviews for destinations
const initialReviews = [
  {
    id: 'rev-1',
    destinationId: 1, // Air Terjun Dlundung
    userId: 'google-user-sample-1',
    userName: 'Dimas Pratama',
    userEmail: 'dimas.pratama@gmail.com',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Pemandangan air terjun sangat asri dan sejuk. Fasilitas camping ground sangat bersih dan luas. Sangat cocok untuk liburan keluarga di akhir pekan!',
    createdAt: '2026-02-14T10:30:00.000Z'
  },
  {
    id: 'rev-2',
    destinationId: 13, // Sumber Gempong
    userId: 'google-user-sample-2',
    userName: 'Rina Salsabila',
    userEmail: 'rina.salsabila@gmail.com',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    comment: 'Suasana sawah terasering dengan latar Gunung Penanggungan magis banget. Kereta sawah dan bebek airnya sangat disukai anak-anak. Air mata airnya super jernih!',
    createdAt: '2026-02-18T14:15:00.000Z'
  },
  {
    id: 'rev-3',
    destinationId: 14, // Rustic Market Trawas
    userId: 'google-user-sample-3',
    userName: 'Fajar Nugraha',
    userEmail: 'fajar.nugraha@gmail.com',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    rating: 4.8,
    comment: 'Konsep bangunan kayu ala pedesaan Eropa di tengah lembah Trawas sangat instagramable. Makanan dan kopinya enak, suasana sore hari sangat syahdu.',
    createdAt: '2026-02-20T16:40:00.000Z'
  }
];

export const AppProvider = ({ children }) => {
  // Current Logged-in Google User
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('explore_trawas_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing current user from localStorage', e);
      }
    }
    return null;
  });

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

  // User Favorites
  const [favorites, setFavorites] = useState(() => {
    const userSaved = localStorage.getItem('explore_trawas_current_user');
    if (userSaved) {
      try {
        const u = JSON.parse(userSaved);
        const userFavs = localStorage.getItem(`explore_trawas_fav_${u.id}`);
        if (userFavs) return JSON.parse(userFavs);
      } catch (e) {
        console.error(e);
      }
    }
    const saved = localStorage.getItem('explore_trawas_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  // User Visited Destinations
  const [visitedDestinations, setVisitedDestinations] = useState(() => {
    const userSaved = localStorage.getItem('explore_trawas_current_user');
    if (userSaved) {
      try {
        const u = JSON.parse(userSaved);
        const userVis = localStorage.getItem(`explore_trawas_vis_${u.id}`);
        if (userVis) return JSON.parse(userVis);
      } catch (e) {
        console.error(e);
      }
    }
    const saved = localStorage.getItem('explore_trawas_visited');
    return saved ? JSON.parse(saved) : [];
  });

  // User Reviews & Community Reviews
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem('explore_trawas_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing reviews from localStorage', e);
      }
    }
    return initialReviews;
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
    if (currentUser) {
      localStorage.setItem(`explore_trawas_fav_${currentUser.id}`, JSON.stringify(favorites));
    }
  }, [favorites, currentUser]);

  useEffect(() => {
    localStorage.setItem('explore_trawas_visited', JSON.stringify(visitedDestinations));
    if (currentUser) {
      localStorage.setItem(`explore_trawas_vis_${currentUser.id}`, JSON.stringify(visitedDestinations));
    }
  }, [visitedDestinations, currentUser]);

  useEffect(() => {
    localStorage.setItem('explore_trawas_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Google Login actions
  const loginWithGoogle = (userData) => {
    const user = {
      id: userData.id || `google-${Date.now()}`,
      name: userData.name || 'Pengguna Google',
      email: userData.email || 'user@gmail.com',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name || 'User')}`,
      provider: 'google',
      joinedAt: userData.joinedAt || new Date().toISOString()
    };
    setCurrentUser(user);
    localStorage.setItem('explore_trawas_current_user', JSON.stringify(user));

    const userFavs = localStorage.getItem(`explore_trawas_fav_${user.id}`);
    if (userFavs) {
      try { setFavorites(JSON.parse(userFavs)); } catch (e) { console.error(e); }
    }
    const userVis = localStorage.getItem(`explore_trawas_vis_${user.id}`);
    if (userVis) {
      try { setVisitedDestinations(JSON.parse(userVis)); } catch (e) { console.error(e); }
    }

    return user;
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('explore_trawas_current_user');
  };

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
    setVisitedDestinations(visitedDestinations.filter(visId => visId !== id));
  };

  // Reset to default data
  const resetToDefaultData = () => {
    localStorage.setItem('explore_trawas_data_version', DATA_VERSION);
    setVillages(initialVillages);
    setDestinations(initialDestinations);
    setReviews(initialReviews);
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

  // Visited actions
  const toggleVisited = (id) => {
    if (visitedDestinations.includes(id)) {
      setVisitedDestinations(visitedDestinations.filter(visId => visId !== id));
    } else {
      setVisitedDestinations([...visitedDestinations, id]);
    }
  };

  const isVisited = (id) => visitedDestinations.includes(id);

  // Review actions
  const addReview = (reviewData) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      destinationId: parseInt(reviewData.destinationId),
      userId: currentUser?.id || 'guest-user',
      userName: currentUser?.name || 'Pengunjung Trawas',
      userEmail: currentUser?.email || '',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: parseFloat(reviewData.rating) || 5,
      comment: reviewData.comment,
      createdAt: new Date().toISOString()
    };
    setReviews([newReview, ...reviews]);
    return newReview;
  };

  const deleteReview = (reviewId) => {
    setReviews(reviews.filter(r => r.id !== reviewId));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      loginWithGoogle,
      logoutUser,
      villages,
      destinations,
      favorites,
      visitedDestinations,
      reviews,
      travelEstimatesData,
      addVillage,
      updateVillage,
      deleteVillage,
      addDestination,
      updateDestination,
      deleteDestination,
      resetToDefaultData,
      toggleFavorite,
      isFavorite,
      toggleVisited,
      isVisited,
      addReview,
      deleteReview
    }}>
      {children}
    </AppContext.Provider>
  );
};
