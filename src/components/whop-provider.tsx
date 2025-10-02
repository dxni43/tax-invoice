'use client';

import { createContext, useContext } from 'react';
import type { WhopContext } from '@/src/lib/whop-auth';

interface WhopProviderProps {
  children: React.ReactNode;
  whopContext: WhopContext;
}

const WhopAuthContext = createContext<WhopContext | null>(null);

export function WhopProvider({ children, whopContext }: WhopProviderProps) {
  return (
    <WhopAuthContext.Provider value={whopContext}>
      {children}
    </WhopAuthContext.Provider>
  );
}

export function useWhopContext(): WhopContext {
  const context = useContext(WhopAuthContext);
  if (!context) {
    throw new Error('useWhopContext must be used within a WhopProvider');
  }
  return context;
}
