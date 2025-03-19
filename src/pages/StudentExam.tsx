
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

// Mock questions for demonstration
const mockQuestions = {
  coding: Array.from({ length: 5 }, (_, i) => ({
    id: `coding-${i + 1}`,
    text: `Sample coding question ${i + 1}?`,
    options: [
      `Option A for coding question ${i + 1}`,
      `Option B for coding question ${i + 1}`,
      `Option C for coding question ${i + 1}`,
      `Option D for coding question ${i + 1}`,
    ],
    answer: `Option A for coding question ${i + 1}`,
  })),
  math: Array.from({ length: 5 }, (_, i) => ({
    id: `math-${i + 1}`,
    text: `Sample math question ${i + 1}?`,
    options: [
      `Option A for math question ${i + 1}`,
      `Option B for math question ${i + 1}`,
      `Option C for math question ${i + 1}`,
      `Option D for math question ${i + 1}`,
    ],
    answer: `Option A for math question ${i + 1}`,
  })),
  aptitude: Array.from({ length: 5 }, (_, i) => ({
    id: `aptitude-${i + 1}`,
    text: `Sample aptitude question ${i + 1}?`,
    options: [
      `Option A for aptitude question ${i + 1}`,
      `Option B for aptitude question ${i + 1}`,
      `Option C for aptitude question ${i + 1}`,
      `Option D for aptitude question ${i + 1}`,
    ],
    answer: `Option A for aptitude question ${i + 1}`,
  })),
  communication: Array.from({ length: 5 }, (_, i) => ({
    id: `communication-${i + 1}`,
    text: `Sample communication question ${i + 1}?`,
    options: [
      `Option A for communication question ${i + 1}`,
      `Option B for communication question ${i + 1}`,
      `Option C for communication question ${i + 1}`,
      `Option D for communication question ${i + 1}`,
    ],
    answer: `Option A for communication question ${i + 1}`,
  })),
};

type Category = 'coding' | 'math' | 'aptitude' | 'communication';

const StudentExam: React.FC = () => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const { toast } = useToast();
  
  const [activeCategory, setActiveCategory] = useState<Category>('coding');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [remainingTime, setRemainingTime] = useState(60 * 60); // 1 hour in seconds
  const [showTimeWarning, setShowTimeWarning] = useState(false);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [results, setResults] = useState<{
    totalMarks: number;
    categoryMarks: Record<Category, number>;
  } | null>(null);
  
  // Load student data
  const [studentData, setStudentData] = useState<any>(null);
  
  useEffect(() => {
    const storedData = localStorage.getItem('examStudentData');
    if (storedData) {
      try {
        setStudentData(JSON.parse(storedData));
      } catch (error) {
        console.error('Failed to parse stored student data', error);
        navigate(`/student/details/${testId}`);
      }
    } else {
      // Redirect if no student data
      navigate(`/student/details/${testId}`);
    }
  }, [navigate, testId]);
  
  // Timer effect
  useEffect(() => {
    if (examSubmitted) return;
    
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        
        // Show warning at 5 minutes remaining
        if (prev === 5 * 60) {
          setShowTimeWarning(true);
          toast({
            title: "Time Warning",
            description: "You have 5 minutes remaining!",
            variant: "destructive",
          });
        }
        
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [examSubmitted]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };
  
  const getProgressForCategory = (category: Category) => {
    const categoryQuestions = mockQuestions[category];
    const answeredCount = categoryQuestions.filter(q => answers[q.id]).length;
    return (answeredCount / categoryQuestions.length) * 100;
  };
  
  const calculateResults = () => {
    let totalCorrect = 0;
    const categoryCorrect: Record<Category, number> = {
      coding: 0,
      math: 0,
      aptitude: 0,
      communication: 0,
    };
    
    // Calculate scores per category
    Object.entries(mockQuestions).forEach(([category, questions]) => {
      questions.forEach(question => {
        const userAnswer = answers[question.id];
        if (userAnswer === question.answer) {
          totalCorrect++;
          categoryCorrect[category as Category]++;
        }
      });
    });
    
    // Calculate total marks (each question is worth 1 mark)
    const totalMarks = totalCorrect;
    
    return {
      totalMarks,
      categoryMarks: categoryCorrect,
    };
  };
  
  const handleSubmitExam = () => {
    if (examSubmitted) return;
    
    const results = calculateResults();
    setResults(results);
    setExamSubmitted(true);
    
    // In a real app, this is where you'd send the data to your backend
    const submissionData = {
      testId,
      studentData,
      answers,
      results,
      submittedAt: new Date().toISOString(),
    };
    
    console.log('Exam submitted:', submissionData);
    
    toast({
      title: "Exam Submitted",
      description: "Your answers have been recorded successfully",
    });
  };
  
  if (examSubmitted && results) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-3xl mx-auto pt-8 pb-16">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Exam Results</CardTitle>
              <CardDescription>
                Thank you for completing the exam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-primary/10 p-6 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">Total Score</p>
                <p className="text-4xl font-bold mt-2">
                  {results.totalMarks} / 20
                </p>
              </div>
              
              <div className="space-y-4">
                <p className="font-semibold">Score by Category</p>
                <div className="grid gap-4">
                  {Object.entries(results.categoryMarks).map(([category, marks]) => (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="capitalize">{category}</p>
                        <p className="font-medium">{marks}/5</p>
                      </div>
                      <Progress value={(marks / 5) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-secondary/30 p-4 rounded-lg">
                <p className="font-medium mb-2">Student Information</p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{studentData?.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Roll Number</p>
                    <p className="font-medium">{studentData?.rollNo}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Year</p>
                    <p className="font-medium">{studentData?.year}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Branch & Section</p>
                    <p className="font-medium">{studentData?.branch} - {studentData?.section}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => navigate('/')}>
                Return to Login
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold">Exam Portal</h1>
            <div className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
              {studentData?.name}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`text-sm px-3 py-1 rounded-full font-medium ${
              remainingTime < 5 * 60 ? 'bg-destructive/10 text-destructive animate-pulse' : 'bg-secondary'
            }`}>
              Time Remaining: {formatTime(remainingTime)}
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Submit Exam
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Your exam will be submitted and you won't be able to change your answers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmitExam}>
                    Submit Exam
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="coding" value={activeCategory} onValueChange={(value) => setActiveCategory(value as Category)}>
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid grid-cols-4 w-full max-w-lg">
              <TabsTrigger value="coding">Coding</TabsTrigger>
              <TabsTrigger value="math">Math</TabsTrigger>
              <TabsTrigger value="aptitude">Aptitude</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
            </TabsList>
          </div>
          
          {(['coding', 'math', 'aptitude', 'communication'] as const).map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold capitalize">{category} Questions</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Progress: {Math.round(getProgressForCategory(category))}%
                  </span>
                  <Progress value={getProgressForCategory(category)} className="w-32 h-2" />
                </div>
              </div>
              
              <div className="space-y-6">
                {mockQuestions[category].map((question, index) => (
                  <Card key={question.id} className="overflow-hidden">
                    <CardHeader className="bg-secondary/30">
                      <CardTitle className="text-base">
                        Question {index + 1}
                      </CardTitle>
                      <CardDescription className="text-base font-medium text-foreground">
                        {question.text}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <RadioGroup
                        value={answers[question.id] || ""}
                        onValueChange={(value) => handleAnswerChange(question.id, value)}
                      >
                        <div className="space-y-3">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center space-x-2">
                              <RadioGroupItem value={option} id={`${question.id}-${optIndex}`} />
                              <Label htmlFor={`${question.id}-${optIndex}`} className="text-base font-normal cursor-pointer">
                                {option}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline"
                  onClick={() => {
                    const categories: Category[] = ['coding', 'math', 'aptitude', 'communication'];
                    const currentIndex = categories.indexOf(activeCategory);
                    const prevIndex = (currentIndex - 1 + categories.length) % categories.length;
                    setActiveCategory(categories[prevIndex]);
                  }}
                  disabled={activeCategory === 'coding'}
                >
                  Previous Section
                </Button>
                <Button 
                  onClick={() => {
                    const categories: Category[] = ['coding', 'math', 'aptitude', 'communication'];
                    const currentIndex = categories.indexOf(activeCategory);
                    const nextIndex = (currentIndex + 1) % categories.length;
                    setActiveCategory(categories[nextIndex]);
                  }}
                  disabled={activeCategory === 'communication'}
                >
                  Next Section
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      
      {/* Time Warning Dialog */}
      <AlertDialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Time Warning</AlertDialogTitle>
            <AlertDialogDescription>
              You have only 5 minutes remaining to complete the exam!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Continue Exam</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StudentExam;
