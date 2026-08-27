import React, { createContext, useState, useEffect } from 'react';
import { initialVillages, initialDestinations, travelEstimatesData } from '../data/mockData';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  setDoc, 
  query 
} from 'firebase/firestore';

export const AppContext = createContext();

const DATA_VERSION = '2.4.0_trawas_real_users_live';

// Device and Browser detection helper
export const getDeviceInfo = () => {
  if (typeof window === 'undefined' || !window.navigator) {
    return { browser: 'Web Browser', os: 'Desktop', deviceType: 'Desktop', summary: 'Web Browser • Desktop' };
  }
  const ua = window.navigator.userAgent;
  let browser = 'Chrome';
  let os = 'Windows';
  let deviceType = 'Desktop';

  if (/mobile/i.test(ua)) deviceType = 'Mobile';
  else if (/tablet|ipad/i.test(ua)) deviceType = 'Tablet';

  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  if (/edg/i.test(ua)) browser = 'Microsoft Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Google Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Mozilla Firefox';
  else if (/safari/i.test(ua)) browser = 'Apple Safari';
  else if (/opr\//i.test(ua)) browser = 'Opera';

  return { browser, os, deviceType, summary: `${browser} • ${os}` };
};

// Initial reviews for destinations
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
  // Current Logged-in User
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

  // Real registered users only (empty initially, populated on actual logins)
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const savedVersion = localStorage.getItem('explore_trawas_data_version');
    const saved = localStorage.getItem('explore_trawas_registered_users');
    if (savedVersion === DATA_VERSION && saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing registered users from localStorage', e);
      }
    }
    return [];
  });

  // Real login audit logs only (empty initially, recorded on actual login attempts)
  const [loginLogs, setLoginLogs] = useState(() => {
    const savedVersion = localStorage.getItem('explore_trawas_data_version');
    const saved = localStorage.getItem('explore_trawas_login_history');
    if (savedVersion === DATA_VERSION && saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing login history from localStorage', e);
      }
    }
    return [];
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

  // ----------------------------------------------------
  // RECORD LOGIN LOG & AUDIT FUNCTION (REAL ATTEMPTS)
  // ----------------------------------------------------
  const recordLoginLog = (entry) => {
    const dev = getDeviceInfo();
    const newLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: entry.type || 'user_web', // 'admin_portal' | 'user_web'
      role: entry.role || (entry.type === 'admin_portal' ? 'Super Administrator' : 'Pengunjung Web'),
      userName: entry.userName || 'Pengguna',
      userEmail: entry.userEmail || 'user@exploretrawas.id',
      status: entry.status || 'success', // 'success' | 'failed'
      reason: entry.reason || (entry.status === 'failed' ? 'Gagal autentikasi' : 'Berhasil masuk sistem'),
      device: entry.device || dev.summary,
      ip: entry.ip || (typeof window !== 'undefined' ? `${window.location.hostname} (Lokal/Web)` : 'Web Client'),
      timestamp: entry.timestamp || new Date().toISOString()
    };

    setLoginLogs(prev => [newLog, ...prev]);

    // Also sync to Firestore if configured
    if (isFirebaseConfigured && db) {
      try {
        addDoc(collection(db, 'login_history'), newLog).catch(console.warn);
      } catch (e) {
        console.warn('Firestore login log error:', e);
      }
    }

    return newLog;
  };

  const clearLoginHistory = () => {
    setLoginLogs([]);
    localStorage.removeItem('explore_trawas_login_history');
  };

  const deleteLoginLog = (logId) => {
    setLoginLogs(prev => prev.filter(item => item.id !== logId));
  };

  // ----------------------------------------------------
  // REAL-TIME CLOUD DATABASE SYNCHRONIZATION (FIREBASE)
  // ----------------------------------------------------
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    // Listen to reviews
    try {
      const reviewsCol = collection(db, 'reviews');
      const q = query(reviewsCol);

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const cloudReviews = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          cloudReviews.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          setReviews(cloudReviews);
        }
      }, (error) => {
        console.warn('Firestore reviews listener error:', error);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Error setting up Firestore listener:', err);
    }
  }, []);

  // Listen to users collection in Firestore
  useEffect(() => {
    if (!isFirebaseConfigured || !db) return;

    try {
      const usersCol = collection(db, 'users');
      const unsubscribe = onSnapshot(usersCol, (snapshot) => {
        if (!snapshot.empty) {
          const cloudUsers = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setRegisteredUsers(cloudUsers);
        }
      }, (err) => console.warn('Firestore users listener error:', err));

      return () => unsubscribe();
    } catch (err) {
      console.warn(err);
    }
  }, []);

  // Sync user profile favorites & visited state with Firestore
  useEffect(() => {
    if (!isFirebaseConfigured || !db || !currentUser?.id) return;

    try {
      const userDocRef = doc(db, 'users', currentUser.id);
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data.favorites)) {
            setFavorites(data.favorites);
          }
          if (Array.isArray(data.visitedDestinations)) {
            setVisitedDestinations(data.visitedDestinations);
          }
        }
      }, (err) => {
        console.warn('Firestore user profile listener error:', err);
      });

      return () => unsubscribe();
    } catch (err) {
      console.warn('Error listening to user doc:', err);
    }
  }, [currentUser?.id]);

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

  useEffect(() => {
    localStorage.setItem('explore_trawas_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  useEffect(() => {
    localStorage.setItem('explore_trawas_login_history', JSON.stringify(loginLogs));
  }, [loginLogs]);

  // Google / Web User Login action (Actual Real Account)
  const loginWithGoogle = (userData) => {
    const nowISO = new Date().toISOString();
    const user = {
      id: userData.id || `user-${Date.now()}`,
      name: userData.name || 'Pengguna Trawas',
      email: userData.email || 'user@gmail.com',
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name || 'User')}`,
      provider: userData.provider || 'google',
      joinedAt: userData.joinedAt || nowISO,
      lastActiveAt: nowISO,
      role: 'Pengunjung Web'
    };

    setCurrentUser(user);
    localStorage.setItem('explore_trawas_current_user', JSON.stringify(user));

    // Update or add in real registered users list
    setRegisteredUsers(prev => {
      const existingIdx = prev.findIndex(u => u.email === user.email || u.id === user.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          name: user.name,
          avatar: user.avatar,
          lastActiveAt: nowISO,
          totalFavorites: favorites.length
        };
        return updated;
      } else {
        return [
          {
            ...user,
            totalFavorites: favorites.length,
            totalReviews: 0
          },
          ...prev
        ];
      }
    });

    // Record in Security Audit / Login Log
    recordLoginLog({
      type: 'user_web',
      role: 'Pengunjung Web',
      userName: user.name,
      userEmail: user.email,
      status: 'success',
      reason: user.provider === 'google' ? 'Login Akun Google Berhasil' : 'Login Email Manual Berhasil'
    });

    const userFavs = localStorage.getItem(`explore_trawas_fav_${user.id}`);
    if (userFavs) {
      try { setFavorites(JSON.parse(userFavs)); } catch (e) { console.error(e); }
    }
    const userVis = localStorage.getItem(`explore_trawas_vis_${user.id}`);
    if (userVis) {
      try { setVisitedDestinations(JSON.parse(userVis)); } catch (e) { console.error(e); }
    }

    // Also sync real user info to Firestore if available
    if (isFirebaseConfigured && db) {
      try {
        setDoc(doc(db, 'users', user.id), {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          provider: user.provider,
          lastLogin: nowISO
        }, { merge: true }).catch(console.error);
      } catch (err) {
        console.error(err);
      }
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
    setRegisteredUsers([]);
    setLoginLogs([]);
  };

  // Favorite actions
  const toggleFavorite = (id) => {
    let nextFavorites;
    if (favorites.includes(id)) {
      nextFavorites = favorites.filter(favId => favId !== id);
    } else {
      nextFavorites = [...favorites, id];
    }
    setFavorites(nextFavorites);

    if (isFirebaseConfigured && db && currentUser?.id) {
      setDoc(doc(db, 'users', currentUser.id), { favorites: nextFavorites }, { merge: true }).catch(console.error);
    }
  };

  const isFavorite = (id) => favorites.includes(id);

  // Visited actions
  const toggleVisited = (id) => {
    let nextVisited;
    if (visitedDestinations.includes(id)) {
      nextVisited = visitedDestinations.filter(visId => visId !== id);
    } else {
      nextVisited = [...visitedDestinations, id];
    }
    setVisitedDestinations(nextVisited);

    if (isFirebaseConfigured && db && currentUser?.id) {
      setDoc(doc(db, 'users', currentUser.id), { visitedDestinations: nextVisited }, { merge: true }).catch(console.error);
    }
  };

  const isVisited = (id) => visitedDestinations.includes(id);

  // Review actions (Connected to Firestore Real-time)
  const addReview = async (reviewData) => {
    const newReview = {
      destinationId: parseInt(reviewData.destinationId),
      userId: currentUser?.id || 'guest-user',
      userName: currentUser?.name || 'Pengunjung Trawas',
      userEmail: currentUser?.email || '',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating: parseFloat(reviewData.rating) || 5,
      comment: reviewData.comment,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, 'reviews'), newReview);
        return { id: docRef.id, ...newReview };
      } catch (error) {
        console.error('Error saving review to Firestore:', error);
      }
    }

    // Fallback if Firebase not configured
    const localReview = { id: `rev-${Date.now()}`, ...newReview };
    setReviews([localReview, ...reviews]);
    return localReview;
  };

  const deleteReview = async (reviewId) => {
    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'reviews', reviewId));
      } catch (error) {
        console.error('Error deleting review from Firestore:', error);
      }
    }
    setReviews(reviews.filter(r => r.id !== reviewId));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      registeredUsers,
      loginLogs,
      recordLoginLog,
      clearLoginHistory,
      deleteLoginLog,
      loginWithGoogle,
      logoutUser,
      villages,
      destinations,
      favorites,
      visitedDestinations,
      reviews,
      travelEstimatesData,
      isFirebaseConnected: isFirebaseConfigured,
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
