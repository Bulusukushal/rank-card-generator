
import React, { createContext, useContext, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export type Question = {
  id: string;
  text: string;
  options: string[];
  answer: string;
  category: 'coding' | 'math' | 'aptitude' | 'communication';
};

export type Test = {
  id: string;
  name: string;
  year: string;
  semester: string;
  questions: Question[];
  isActive: boolean;
  createdAt: Date;
};

type TestContextType = {
  tests: Test[];
  activeTest: Test | null;
  createTest: (testData: Omit<Test, 'id' | 'createdAt' | 'isActive'>) => void;
  updateTest: (id: string, testData: Partial<Omit<Test, 'id'>>) => void;
  startTest: (id: string) => void;
  endTest: (id: string) => void;
  getExamLink: (testId: string) => string;
};

const TestContext = createContext<TestContextType | undefined>(undefined);

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within a TestProvider');
  }
  return context;
};

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tests, setTests] = useState<Test[]>([]);
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const { toast } = useToast();

  const createTest = (testData: Omit<Test, 'id' | 'createdAt' | 'isActive'>) => {
    const newTest = {
      ...testData,
      id: Date.now().toString(),
      createdAt: new Date(),
      isActive: false,
    };
    
    setTests((prevTests) => [...prevTests, newTest]);
    toast({
      title: "Test created",
      description: `Test "${newTest.name}" has been created successfully`,
    });
  };

  const updateTest = (id: string, testData: Partial<Omit<Test, 'id'>>) => {
    setTests((prevTests) => 
      prevTests.map((test) => 
        test.id === id ? { ...test, ...testData } : test
      )
    );
    
    // If we're updating the active test, update that as well
    if (activeTest?.id === id) {
      setActiveTest((prev) => prev ? { ...prev, ...testData } : prev);
    }
    
    toast({
      title: "Test updated",
      description: "The test has been updated successfully",
    });
  };

  const startTest = (id: string) => {
    const testToStart = tests.find(test => test.id === id);
    if (!testToStart) {
      toast({
        title: "Error",
        description: "Test not found",
        variant: "destructive",
      });
      return;
    }
    
    // End any currently active test
    if (activeTest) {
      endTest(activeTest.id);
    }
    
    setTests((prevTests) => 
      prevTests.map((test) => 
        test.id === id ? { ...test, isActive: true } : test
      )
    );
    
    setActiveTest(testToStart);
    
    toast({
      title: "Test started",
      description: `Test "${testToStart.name}" is now active`,
    });
  };

  const endTest = (id: string) => {
    setTests((prevTests) => 
      prevTests.map((test) => 
        test.id === id ? { ...test, isActive: false } : test
      )
    );
    
    if (activeTest?.id === id) {
      setActiveTest(null);
    }
    
    toast({
      title: "Test ended",
      description: "The test has been deactivated",
    });
  };

  const getExamLink = (testId: string) => {
    // This would be a real URL in production
    return `/student/exam/${testId}`;
  };

  return (
    <TestContext.Provider 
      value={{ 
        tests, 
        activeTest, 
        createTest, 
        updateTest, 
        startTest, 
        endTest,
        getExamLink
      }}
    >
      {children}
    </TestContext.Provider>
  );
};
