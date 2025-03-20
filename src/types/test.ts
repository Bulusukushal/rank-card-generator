
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

export type TestContextType = {
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
