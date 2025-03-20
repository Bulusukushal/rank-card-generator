
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

export type StudentResult = {
  studentId: string;
  name: string;
  rollNo: string;
  year: string;
  branch: string;
  section: string;
  scores: {
    coding: number;
    math: number;
    aptitude: number;
    communication: number;
    total: number;
  };
  completedAt: Date;
}

type TestContextType = {
  tests: Test[];
  activeTest: Test | null;
  studentResults: Record<string, StudentResult[]>; // testId -> results
  createTest: (testData: Omit<Test, 'id' | 'createdAt' | 'isActive'>) => void;
  updateTest: (id: string, testData: Partial<Omit<Test, 'id'>>) => void;
  startTest: (id: string) => void;
  endTest: (id: string) => void;
  getExamLink: (testId: string) => string;
  addStudentResult: (testId: string, result: StudentResult) => void;
  getStudentResults: (testId: string) => StudentResult[];
  parseDocFile: (file: File) => Promise<Question[]>;
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

  const addStudentResult = (testId: string, result: StudentResult) => {
    setStudentResults(prev => {
      const testResults = [...(prev[testId] || [])];
      // Check if student already has a result for this test
      const existingResultIndex = testResults.findIndex(r => r.rollNo === result.rollNo);
      
      if (existingResultIndex >= 0) {
        // Update existing result
        testResults[existingResultIndex] = result;
      } else {
        // Add new result
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

  // Function to parse the docx file and extract questions
  const parseDocFile = async (file: File): Promise<Question[]> => {
    try {
      // This is a placeholder for actual docx parsing logic
      // In a real application, you would use a library to parse the docx file
      // For demonstration, we'll simulate reading the file as text
      
      const text = await file.text();
      
      // This is a simple parser that expects a specific format:
      // Question: [question text]
      // Option 1: [option]
      // Option 2: [option]
      // Option 3: [option]
      // Option 4: [option]
      // Answer: [option text]
      // Category: [coding|math|aptitude|communication]
      
      const questions: Question[] = [];
      const lines = text.split('\n');
      
      let currentQuestion: Partial<Question> = {};
      let options: string[] = [];
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('Question:')) {
          // Save previous question if exists
          if (currentQuestion.text && options.length && currentQuestion.answer) {
            questions.push({
              id: `q-${questions.length + 1}`,
              text: currentQuestion.text,
              options: [...options],
              answer: currentQuestion.answer,
              category: currentQuestion.category as 'coding' | 'math' | 'aptitude' | 'communication',
            });
          }
          
          // Start new question
          currentQuestion = {
            text: line.substring(9).trim(),
          };
          options = [];
        } else if (line.startsWith('Option')) {
          const option = line.substring(line.indexOf(':') + 1).trim();
          options.push(option);
        } else if (line.startsWith('Answer:')) {
          currentQuestion.answer = line.substring(7).trim();
        } else if (line.startsWith('Category:')) {
          const category = line.substring(9).trim().toLowerCase();
          if (['coding', 'math', 'aptitude', 'communication'].includes(category)) {
            currentQuestion.category = category as 'coding' | 'math' | 'aptitude' | 'communication';
          } else {
            currentQuestion.category = 'coding'; // Default category
          }
        }
      }
      
      // Add the last question if it exists
      if (currentQuestion.text && options.length && currentQuestion.answer && currentQuestion.category) {
        questions.push({
          id: `q-${questions.length + 1}`,
          text: currentQuestion.text,
          options: [...options],
          answer: currentQuestion.answer,
          category: currentQuestion.category as 'coding' | 'math' | 'aptitude' | 'communication',
        });
      }
      
      if (questions.length === 0) {
        throw new Error('No valid questions found in the file. Please check the format.');
      }
      
      return questions;
    } catch (error) {
      console.error('Error parsing file:', error);
      throw new Error('Failed to parse the document. Please check the format and try again.');
    }
  };

  return (
    <TestContext.Provider 
      value={{ 
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
      }}
    >
      {children}
    </TestContext.Provider>
  );
};
