import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTest } from '@/contexts/TestContext';
import { useStudent } from '@/contexts/StudentContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

const StudentExam: React.FC = () => {
  const navigate = useNavigate();
  const { testId } = useParams<{ testId: string }>();
  const { tests } = useTest();
  const { studentData, saveAnswer, calculateScores, isExamCompleted } = useStudent();
  const { toast } = useToast();
  
  const [test, setTest] = useState<any>(null);
  const [currentCategory, setCurrentCategory] = useState<string>('coding');
  const [timeRemaining, setTimeRemaining] = useState<number>(60 * 60); // 1 hour in seconds
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  
  // Find the test by ID
  useEffect(() => {
    if (tests.length && testId) {
      const foundTest = tests.find(t => t.id === testId);
      
      if (foundTest) {
        setTest(foundTest);
      } else {
        toast({
          title: "Test not found",
          description: "The requested exam could not be found",
          variant: "destructive",
        });
        navigate('/');
      }
    }
    setLoading(false);
  }, [tests, testId, navigate, toast]);
  
  // Check if student data exists in localStorage or context
  useEffect(() => {
    if (!studentData && !loading) {
      const storedData = localStorage.getItem('examStudentData');
      
      if (!storedData) {
        toast({
          title: "Student information required",
          description: "Please enter your details before starting the exam",
          variant: "destructive",
        });
        navigate(`/student/details/${testId}`);
      }
    }
  }, [studentData, loading, navigate, testId, toast]);
  
  // Timer countdown
  useEffect(() => {
    if (!test || isExamCompleted) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit when time is up
          handleSubmit();
          return 0;
        }
        
        // Show warning when 5 minutes remaining
        if (prev === 300) { // 5 minutes = 300 seconds
          toast({
            title: "Time running out",
            description: "Only 5 minutes remaining for the exam",
            variant: "destructive",
          });
        }
        
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [test, isExamCompleted]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getQuestionsForCategory = (category: string) => {
    if (!test) return [];
    return test.questions.filter((q: any) => q.category === category);
  };
  
  const handleAnswerSelect = (questionId: string, option: string, correctAnswer: string) => {
    const isCorrect = option === correctAnswer;
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
    
    saveAnswer(questionId, option, isCorrect);
  };
  
  const handleSubmit = () => {
    if (!test) return;
    
    calculateScores(test);
    
    toast({
      title: "Exam submitted",
      description: "Your answers have been recorded",
    });
  };
  
  if (loading || !test) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (isExamCompleted && studentData) {
    const { scores } = studentData;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50 p-4">
        <div className="max-w-4xl mx-auto pt-8 animate-fade-in">
          <Card className="border-none shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Exam Completed</CardTitle>
              <CardDescription>
                Thank you for completing the exam. Here are your results:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-primary/5">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">Coding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{scores.coding}</div>
                    <p className="text-xs text-muted-foreground">points</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">Mathematics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{scores.math}</div>
                    <p className="text-xs text-muted-foreground">points</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">Aptitude</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{scores.aptitude}</div>
                    <p className="text-xs text-muted-foreground">points</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5">
                  <CardHeader className="py-3">
                    <CardTitle className="text-sm font-medium">Communication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{scores.communication}</div>
                    <p className="text-xs text-muted-foreground">points</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-primary/10 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      <h3 className="text-lg font-semibold">Total Score</h3>
                      <p className="text-muted-foreground">All categories combined</p>
                    </div>
                    <div className="text-4xl font-bold">{scores.total} / {test.questions.length}</div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center text-muted-foreground text-sm">
                <p>Your exam results have been recorded. You may close this window.</p>
              </div>
            </CardContent>
            <CardFooter className="justify-center pb-6">
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
              >
                Return to Home
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50 p-4">
      <div className="max-w-4xl mx-auto pt-4 pb-16 space-y-6 animate-fade-in">
        <Card className="shadow-md">
          <CardHeader>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-xl">{test.name} Exam</CardTitle>
                <CardDescription>
                  Select a category to answer those questions
                </CardDescription>
              </div>
              <div className="flex items-center gap-2 text-lg font-mono bg-background p-2 rounded-md border">
                <Clock className="text-primary" size={20} />
                <span className={timeRemaining <= 300 ? "text-destructive animate-pulse" : ""}>
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <Tabs defaultValue="coding" value={currentCategory} onValueChange={setCurrentCategory}>
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="coding">Coding</TabsTrigger>
            <TabsTrigger value="math">Mathematics</TabsTrigger>
            <TabsTrigger value="aptitude">Aptitude</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
          </TabsList>
          
          {['coding', 'math', 'aptitude', 'communication'].map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {getQuestionsForCategory(category).map((question: any, index: number) => (
                <Card key={question.id} className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      {index + 1}. {question.text}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2">
                      {question.options.map((option: string, optIndex: number) => (
                        <div 
                          key={optIndex} 
                          className={`
                            p-3 rounded-md border cursor-pointer hover:bg-secondary transition-colors
                            ${answers[question.id] === option ? 'bg-primary/10 border-primary/50' : ''}
                          `}
                          onClick={() => handleAnswerSelect(question.id, option, question.answer)}
                        >
                          <div className="flex items-start gap-2">
                            <div className={`
                              h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5
                              ${answers[question.id] === option ? 'border-primary bg-primary/20' : ''}
                            `}>
                              {answers[question.id] === option && (
                                <CheckCircle className="h-3 w-3 text-primary" />
                              )}
                            </div>
                            <span>{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-10 p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle size={16} />
              <span>Your answers are automatically saved</span>
            </div>
            <Button
              onClick={handleSubmit}
              size="lg"
            >
              Submit Exam
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentExam;
