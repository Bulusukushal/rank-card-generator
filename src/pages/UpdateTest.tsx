
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { useTest, Question, Test } from '@/contexts/TestContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, PenSquare, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const UpdateTest: React.FC = () => {
  const navigate = useNavigate();
  const { tests, updateTest } = useTest();
  const { toast } = useToast();
  
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState<'coding' | 'math' | 'aptitude' | 'communication'>('coding');
  
  const handleSelectTest = (testId: string) => {
    const test = tests.find(t => t.id === testId);
    if (test) {
      setSelectedTest(test);
    }
  };
  
  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionText(question.text);
    setOptions([...question.options]);
    setAnswer(question.answer);
    setCategory(question.category);
  };
  
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };
  
  const handleSaveQuestion = () => {
    if (!selectedTest || !editingQuestion) return;
    
    const updatedQuestion: Question = {
      ...editingQuestion,
      text: questionText,
      options: options,
      answer: answer,
      category: category,
    };
    
    const updatedQuestions = selectedTest.questions.map(q => 
      q.id === editingQuestion.id ? updatedQuestion : q
    );
    
    updateTest(selectedTest.id, { questions: updatedQuestions });
    
    setEditingQuestion(null);
    toast({
      title: "Question updated",
      description: "The question has been updated successfully",
    });
  };
  
  const handleCancelEdit = () => {
    setEditingQuestion(null);
  };
  
  return (
    <AdminLayout title="Update Test">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Select Test to Update</CardTitle>
          <CardDescription>
            Choose a test to view and modify its questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tests.length > 0 ? (
            <Select onValueChange={handleSelectTest}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Select a test" />
              </SelectTrigger>
              <SelectContent>
                {tests.map((test) => (
                  <SelectItem key={test.id} value={test.id}>
                    {test.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No tests available. Please create a test first.</p>
              <Button
                variant="link"
                onClick={() => navigate('/admin/create-test')}
                className="mt-2"
              >
                Go to Create Test
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {selectedTest && (
        <Card>
          <CardHeader>
            <CardTitle>Questions for {selectedTest.name}</CardTitle>
            <CardDescription>
              {selectedTest.questions.length} questions found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead className="w-[150px]">Category</TableHead>
                  <TableHead className="w-[100px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedTest.questions.map((question, index) => (
                  <TableRow key={question.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium truncate max-w-[400px]">
                      {question.text}
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{question.category}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleEditQuestion(question)}
                          >
                            <PenSquare className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit Question</DialogTitle>
                            <DialogDescription>
                              Make changes to the question and its options
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label htmlFor="question-text">Question</Label>
                              <Input
                                id="question-text"
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="category">Category</Label>
                              <Select
                                value={category}
                                onValueChange={(value: any) => setCategory(value)}
                              >
                                <SelectTrigger id="category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="coding">Coding</SelectItem>
                                  <SelectItem value="math">Math</SelectItem>
                                  <SelectItem value="aptitude">Aptitude</SelectItem>
                                  <SelectItem value="communication">Communication</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Options</Label>
                              {options.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    type="button"
                                    onClick={() => setAnswer(option)}
                                    className={answer === option ? "border-2 border-primary" : ""}
                                  >
                                    {answer === option ? (
                                      <Check className="h-4 w-4 text-primary" />
                                    ) : (
                                      <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                                    )}
                                  </Button>
                                </div>
                              ))}
                              <p className="text-sm text-muted-foreground mt-1">
                                Click the circle button to mark the correct answer
                              </p>
                            </div>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveQuestion}>
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={() => navigate('/admin/dashboard')}>
              Back to Dashboard
            </Button>
          </CardFooter>
        </Card>
      )}
    </AdminLayout>
  );
};

export default UpdateTest;
