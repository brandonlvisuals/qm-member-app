'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MembershipTier } from './data';

export interface User {
  id: string;
  name: string;
  email: string;
  membership: MembershipTier | null;
  bookedClasses: string[];
  joinedDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateMembership: (tier: MembershipTier) => void;
  bookClass: (classId: string) => void;
  cancelClass: (classId: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Mock user database stored in localStorage
const STORAGE_KEY = 'qm_users';
const SESSION_KEY = 'qm_session';

function getUsers(): Record<string, { password: string; user: User }> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, { password: string; user: User }>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const users = getUsers();
        const sessionData = JSON.parse(session);
        const record = users[sessionData.email];
        if (record) setUser(record.user);
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const record = users[email.toLowerCase()];
    if (!record || record.password !== password) return false;
    setUser(record.user);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: email.toLowerCase() }));
    return true;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const key = email.toLowerCase();
    if (users[key]) return false;
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email: key,
      membership: null,
      bookedClasses: [],
      joinedDate: new Date().toISOString(),
    };
    users[key] = { password, user: newUser };
    saveUsers(users);
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: key }));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateMembership = (tier: MembershipTier) => {
    if (!user) return;
    const updated = { ...user, membership: tier };
    setUser(updated);
    const users = getUsers();
    if (users[user.email]) {
      users[user.email].user = updated;
      saveUsers(users);
    }
  };

  const bookClass = (classId: string) => {
    if (!user) return;
    const updated = {
      ...user,
      bookedClasses: [...user.bookedClasses, classId],
    };
    setUser(updated);
    const users = getUsers();
    if (users[user.email]) {
      users[user.email].user = updated;
      saveUsers(users);
    }
  };

  const cancelClass = (classId: string) => {
    if (!user) return;
    const updated = {
      ...user,
      bookedClasses: user.bookedClasses.filter((id) => id !== classId),
    };
    setUser(updated);
    const users = getUsers();
    if (users[user.email]) {
      users[user.email].user = updated;
      saveUsers(users);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateMembership, bookClass, cancelClass, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
