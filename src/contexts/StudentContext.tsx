
import React, { createContext, useContext, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Test, Question } from '@/contexts/TestContext';

export type StudentAnswer = {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
};

export type StudentData = {
  name: string;
  rollNo: string;
  year: string;
  branch: string;
  section: string;
  testId: string;
  answers: StudentAnswer[];
  scores: {
    coding: number;
    math: number;
    aptitude: number;
    communication: number;
    total: number;
  };
  completedAt: Date | null;
};

type StudentContextType = {
  studentData: StudentData | null;
  setStudentInfo: (data: Omit<StudentData, 'answers' | 'scores' | 'completedAt'>) => void;
  saveAnswer: (questionId: string, selectedOption: string, isCorrect: boolean) => void;
  calculateScores: (test: Test) => void;
  clearStudentData: () => void;
  isExamCompleted: boolean;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};

const emptyScores = {
  coding: 0,
  math: 0,
  aptitude: 0,
  communication: 0,
  total: 0,
};

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const { toast } = useToast();

  const setStudentInfo = (data: Omit<StudentData, 'answers' | 'scores' | 'completedAt'>) => {
    setStudentData({
      ...data,
      answers: [],
      scores: { ...emptyScores },
      completedAt: null,
    });
  };

  const saveAnswer = (questionId: string, selectedOption: string, isCorrect: boolean) => {
    if (!studentData) return;

    setStudentData(prevData => {
      if (!prevData) return null;

      const existingAnswerIndex = prevData.answers.findIndex(
        answer => answer.questionId === questionId
      );

      let newAnswers = [...prevData.answers];

      if (existingAnswerIndex >= 0) {
        // Update existing answer
        newAnswers[existingAnswerIndex] = {
          questionId,
          selectedOption,
          isCorrect,
        };
      } else {
        // Add new answer
        newAnswers.push({
          questionId,
          selectedOption,
          isCorrect,
        });
      }

      return {
        ...prevData,
        answers: newAnswers,
      };
    });
  };

  const calculateScores = (test: Test) => {
    if (!studentData) return;

    const categoryScores = {
      coding: 0,
      math: 0,
      aptitude: 0,
      communication: 0,
      total: 0,
    };

    // Group questions by category for score calculation
    const questionsByCategory = test.questions.reduce<Record<string, Question[]>>(
      (acc, question) => {
        const category = question.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(question);
        return acc;
      },
      {}
    );

    // Calculate score per category
    studentData.answers.forEach((answer) => {
      if (answer.isCorrect) {
        const question = test.questions.find(q => q.id === answer.questionId);
        if (question) {
          categoryScores[question.category] += 1;
          categoryScores.total += 1;
        }
      }
    });

    // Calculate percentages based on maximum possible scores
    for (const category of ['coding', 'math', 'aptitude', 'communication'] as const) {
      const questionsInCategory = questionsByCategory[category]?.length || 0;
      if (questionsInCategory > 0) {
        // Store raw scores (correct answers count)
        categoryScores[category] = categoryScores[category];
      }
    }

    setStudentData(prevData => {
      if (!prevData) return null;
      return {
        ...prevData,
        scores: categoryScores,
        completedAt: new Date(),
      };
    });

    setIsExamCompleted(true);

    toast({
      title: "Exam completed",
      description: `Your total score is ${categoryScores.total} out of ${test.questions.length}`,
    });
  };

  const clearStudentData = () => {
    setStudentData(null);
    setIsExamCompleted(false);
  };

  return (
    <StudentContext.Provider
      value={{
        studentData,
        setStudentInfo,
        saveAnswer,
        calculateScores,
        clearStudentData,
        isExamCompleted,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};
