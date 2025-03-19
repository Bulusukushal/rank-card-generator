
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { useTest } from '@/contexts/TestContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Save } from 'lucide-react';

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
        <Card>
          <CardHeader>
            <CardTitle>Select Test to Update</CardTitle>
            <CardDescription>
              Choose an existing test to modify its questions and details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select 
              value={selectedTestId}
              onValueChange={setSelectedTestId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a test" />
              </SelectTrigger>
              <SelectContent>
                {tests.length > 0 ? (
                  tests.map((test) => (
                    <SelectItem key={test.id} value={test.id}>
                      {test.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-tests" disabled>
                    No tests available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        {selectedTestId && (
          <Card>
            <CardHeader>
              <CardTitle>Test Details</CardTitle>
              <CardDescription>
                Update the basic information for this test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    placeholder="e.g., 2023"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Semester</Label>
                  <Input
                    id="semester"
                    placeholder="e.g., Spring"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Update Questions</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Question Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Coding:</span>
                          <span className="font-medium">
                            {questions.filter(q => q.category === 'coding').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mathematics:</span>
                          <span className="font-medium">
                            {questions.filter(q => q.category === 'math').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Aptitude:</span>
                          <span className="font-medium">
                            {questions.filter(q => q.category === 'aptitude').length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Communication:</span>
                          <span className="font-medium">
                            {questions.filter(q => q.category === 'communication').length}
                          </span>
                        </div>
                        <div className="border-t my-2 pt-2 flex justify-between font-medium">
                          <span>Total Questions:</span>
                          <span>{questions.length}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Add New Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddQuestion('coding')}
                          className="justify-start"
                        >
                          <Plus size={16} className="mr-1" /> Coding
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddQuestion('math')}
                          className="justify-start"
                        >
                          <Plus size={16} className="mr-1" /> Mathematics
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddQuestion('aptitude')}
                          className="justify-start"
                        >
                          <Plus size={16} className="mr-1" /> Aptitude
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleAddQuestion('communication')}
                          className="justify-start"
                        >
                          <Plus size={16} className="mr-1" /> Communication
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Accordion 
                  type="multiple" 
                  value={expandedQuestions}
                  onValueChange={setExpandedQuestions}
                  className="space-y-4"
                >
                  {questions.map((question, index) => (
                    <AccordionItem
                      key={question.id}
                      value={question.id}
                      className="border rounded-lg shadow-sm"
                    >
                      <AccordionTrigger className="px-4 hover:no-underline">
                        <div className="flex items-center justify-between w-full text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Q{index + 1}:</span>
                            <span className="truncate max-w-sm">
                              {question.text || "(No question text)"}
                            </span>
                          </div>
                          <span className="badge bg-primary/10 text-primary px-2 py-1 rounded-full text-xs capitalize">
                            {question.category}
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor={`question-${question.id}`}>Question</Label>
                            <Textarea
                              id={`question-${question.id}`}
                              placeholder="Enter question text"
                              value={question.text}
                              onChange={(e) => handleQuestionChange(question.id, 'text', e.target.value)}
                              rows={2}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Options</Label>
                            {question.options.map((option: string, optIndex: number) => (
                              <div key={optIndex} className="flex gap-2 items-center">
                                <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full shrink-0">
                                  {String.fromCharCode(65 + optIndex)}
                                </div>
                                <Input
                                  placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                  value={option}
                                  onChange={(e) => handleOptionChange(question.id, optIndex, e.target.value)}
                                />
                              </div>
                            ))}
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`answer-${question.id}`}>Correct Answer</Label>
                            <Select
                              value={question.answer}
                              onValueChange={(value) => handleQuestionChange(question.id, 'answer', value)}
                            >
                              <SelectTrigger id={`answer-${question.id}`}>
                                <SelectValue placeholder="Select correct answer" />
                              </SelectTrigger>
                              <SelectContent>
                                {question.options.map((option: string, optIndex: number) => (
                                  <SelectItem 
                                    key={optIndex} 
                                    value={option}
                                    disabled={!option}
                                  >
                                    {option || `Option ${String.fromCharCode(65 + optIndex)} (empty)`}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="flex items-center gap-1"
                            >
                              <Trash2 size={16} />
                              Delete Question
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                
                {questions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No questions found. Add questions using the buttons above.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/dashboard')}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveTest}
                disabled={saving}
                className="flex items-center gap-2"
              >
                {saving ? 'Saving...' : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default UpdateTest;
