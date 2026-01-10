'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import type { User } from '@/lib/types';
import { USERS } from '@/lib/data';
import { useRouter } from 'next/navigation';

interface UserContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = useCallback((user: User) => {
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    router.push('/');
  }, [router]);

  return (
    <UserContext.Provider value={{ user, login, logout }}>
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
