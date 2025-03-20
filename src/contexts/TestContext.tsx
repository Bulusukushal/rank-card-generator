
import React, { createContext, useContext } from 'react';
import { TestContextType } from '../types/test';
import { useTestActions } from '../hooks/useTestActions';

const TestContext = createContext<TestContextType | undefined>(undefined);

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const testActions = useTestActions();
  
  return (
    <TestContext.Provider value={testActions}>
      {children}
    </TestContext.Provider>
  );
};

// Re-export types for convenience
export type { Question, Test, StudentResult } from '../types/test';
