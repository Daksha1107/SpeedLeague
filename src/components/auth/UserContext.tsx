'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  userId: string | null;
  username: string | null;
  isVerified: boolean;
  isLoading: boolean;
  signIn: (userId: string, username: string, isVerified: boolean) => void;
  signOut: () => void;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize user from localStorage
  useEffect(() => {
    const initUser = () => {
      try {
        // Check if localStorage is available
        if (typeof window === 'undefined' || !window.localStorage) {
          setIsLoading(false);
          return;
        }

        const storedUserId = localStorage.getItem('speedleague_userId');
        const storedIsVerified = localStorage.getItem('speedleague_isVerified') === 'true';
        const storedUsername = localStorage.getItem('speedleague_username');

        if (storedUserId) {
          setUserId(storedUserId);
          setUsername(storedUsername);
          setIsVerified(storedIsVerified);
        }
      } catch (error) {
        console.error('Error initializing user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initUser();
  }, []);

  const signIn = (newUserId: string, newUsername: string, newIsVerified: boolean) => {
    setUserId(newUserId);
    setUsername(newUsername);
    setIsVerified(newIsVerified);
    
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('speedleague_userId', newUserId);
        localStorage.setItem('speedleague_username', newUsername);
        localStorage.setItem('speedleague_isVerified', String(newIsVerified));
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const signOut = () => {
    setUserId(null);
    setUsername(null);
    setIsVerified(false);
    
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('speedleague_userId');
        localStorage.removeItem('speedleague_username');
        localStorage.removeItem('speedleague_isVerified');
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  };

  const refreshUserData = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`/api/stats/${userId}`);
      const data = await response.json();
      
      // Update username if it changed
      if (data.user?.username) {
        setUsername(data.user.username);
        localStorage.setItem('speedleague_username', data.user.username);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        username,
        isVerified,
        isLoading,
        signIn,
        signOut,
        refreshUserData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
