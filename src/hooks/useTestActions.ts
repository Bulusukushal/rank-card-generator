
import { useState } from 'react';
import { Test, StudentResult, Question } from '../types/test';
import { useToast } from './use-toast';
import { parseDocFile } from '../utils/documentParser';

export const useTestActions = () => {
  const [tests, setTests] = useState<Test[]>([]);
  const [activeTest, setActiveTest] = useState<Test | null>(null);
  const [studentResults, setStudentResults] = useState<Record<string, StudentResult[]>>({});
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
    return `/student/exam/${testId}`;
  };

  const addStudentResult = (testId: string, result: StudentResult) => {
    setStudentResults(prev => {
      const testResults = [...(prev[testId] || [])];
      const existingResultIndex = testResults.findIndex(r => r.rollNo === result.rollNo);
      
      if (existingResultIndex >= 0) {
        testResults[existingResultIndex] = result;
      } else {
        testResults.push(result);
      }
      
      return {
        ...prev,
        [testId]: testResults
      };
    });
  };

  const getStudentResults = (testId: string) => {
    return studentResults[testId] || [];
  };

  return {
    tests,
    activeTest,
    studentResults,
    createTest,
    updateTest,
    startTest,
    endTest,
    getExamLink,
    addStudentResult,
    getStudentResults,
    parseDocFile
  };
};
