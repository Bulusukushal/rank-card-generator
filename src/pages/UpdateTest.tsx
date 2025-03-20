
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { useTest } from '@/contexts/TestContext';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

// Import our new components
import TestSelector from '@/components/test/TestSelector';
import TestDetailsForm from '@/components/test/TestDetailsForm';
import QuestionOverview from '@/components/test/QuestionOverview';
import QuestionCreator from '@/components/test/QuestionCreator';
import QuestionEditor from '@/components/test/QuestionEditor';
import TestActionButtons from '@/components/test/TestActionButtons';

const UpdateTest: React.FC = () => {
  const navigate = useNavigate();
  const { tests, updateTest } = useTest();
  const { toast } = useToast();
  
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [testName, setTestName] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [semester, setSemester] = useState<string>('');
  const [questions, setQuestions] = useState<any[]>([]);
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([]);
  const [saving, setSaving] = useState<boolean>(false);
  
  // Load test data when test is selected
  useEffect(() => {
    if (selectedTestId) {
      const test = tests.find(t => t.id === selectedTestId);
      if (test) {
        setTestName(test.name);
        setYear(test.year);
        setSemester(test.semester);
        setQuestions([...test.questions]);
        // Expand first question by default if there are questions
        if (test.questions.length > 0) {
          setExpandedQuestions([test.questions[0].id]);
        }
      }
    } else {
      resetForm();
    }
  }, [selectedTestId, tests]);
  
  const resetForm = () => {
    setTestName('');
    setYear('');
    setSemester('');
    setQuestions([]);
    setExpandedQuestions([]);
  };
  
  const handleQuestionChange = (questionId: string, field: string, value: any) => {
    setQuestions(prev => 
      prev.map(q => 
        q.id === questionId 
          ? { ...q, [field]: value } 
          : q
      )
    );
  };
  
  const handleOptionChange = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(prev => 
      prev.map(q => {
        if (q.id === questionId) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };
  
  const handleAddQuestion = (category: 'coding' | 'math' | 'aptitude' | 'communication') => {
    const newQuestion = {
      id: Date.now().toString(),
      text: '',
      options: ['', '', '', ''],
      answer: '',
      category,
    };
    
    setQuestions(prev => [...prev, newQuestion]);
    setExpandedQuestions(prev => [...prev, newQuestion.id]);
  };
  
  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
    setExpandedQuestions(prev => prev.filter(id => id !== questionId));
  };
  
  const handleSaveTest = async () => {
    if (!selectedTestId) {
      toast({
        title: "Error",
        description: "Please select a test to update",
        variant: "destructive",
      });
      return;
    }
    
    // Validate form
    if (!year || !semester) {
      toast({
        title: "Incomplete form",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Validate all questions have text, options, and answer
    const invalidQuestions = questions.filter(
      q => !q.text || q.options.some((opt: string) => !opt) || !q.answer
    );
    
    if (invalidQuestions.length > 0) {
      toast({
        title: "Invalid questions",
        description: `${invalidQuestions.length} questions are incomplete`,
        variant: "destructive",
      });
      
      // Expand all invalid questions
      setExpandedQuestions(invalidQuestions.map(q => q.id));
      return;
    }
    
    setSaving(true);
    
    try {
      const updatedName = `${year}-${semester}`;
      
      updateTest(selectedTestId, {
        name: updatedName,
        year,
        semester,
        questions,
      });
      
      toast({
        title: "Test updated",
        description: "The exam has been successfully updated",
      });
      
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1500);
    } catch (error) {
      console.error("Error updating test:", error);
      toast({
        title: "Update failed",
        description: "An error occurred while updating the test",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <AdminLayout title="Update Test">
      <div className="space-y-8">
        <TestSelector
          tests={tests}
          selectedTestId={selectedTestId}
          onSelectTest={setSelectedTestId}
        />
        
        {selectedTestId && (
          <Card>
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
              <CardDescription>
                Update the basic information for this test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <TestDetailsForm
                year={year}
                semester={semester}
                onYearChange={setYear}
                onSemesterChange={setSemester}
              />
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Update Questions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <QuestionOverview questions={questions} />
                  <QuestionCreator onAddQuestion={handleAddQuestion} />
                </div>
                
                <QuestionEditor
                  questions={questions}
                  expandedQuestions={expandedQuestions}
                  onExpandedQuestionsChange={setExpandedQuestions}
                  onQuestionChange={handleQuestionChange}
                  onOptionChange={handleOptionChange}
                  onDeleteQuestion={handleDeleteQuestion}
                />
                
                {questions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No questions found. Add questions using the buttons above.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <TestActionButtons
                onCancel={() => navigate('/admin/dashboard')}
                onSave={handleSaveTest}
                isSaving={saving}
              />
            </CardFooter>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default UpdateTest;
