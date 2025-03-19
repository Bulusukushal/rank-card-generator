
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import FileUploader from '@/components/FileUploader';
import { useTest } from '@/contexts/TestContext';
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
import { useToast } from '@/hooks/use-toast';

// Mock function to parse test documents
// In a real application, this would use a library to parse .docx files
const parseTestDocument = (file: File): Promise<any> => {
  return new Promise((resolve) => {
    // This is a mock implementation
    setTimeout(() => {
      // Generate mock questions for each category
      const categories = ['coding', 'math', 'aptitude', 'communication'] as const;
      const questions = categories.flatMap(category => 
        Array.from({ length: 5 }, (_, i) => ({
          id: `${category}-${i + 1}`,
          text: `Sample ${category} question ${i + 1}?`,
          options: [
            `Option A for ${category} question ${i + 1}`,
            `Option B for ${category} question ${i + 1}`,
            `Option C for ${category} question ${i + 1}`,
            `Option D for ${category} question ${i + 1}`,
          ],
          answer: `Option A for ${category} question ${i + 1}`,
          category,
        }))
      );
      
      resolve({
        fileName: file.name,
        questions,
      });
    }, 1500);
  });
};

const CreateTest: React.FC = () => {
  const navigate = useNavigate();
  const { createTest } = useTest();
  const { toast } = useToast();
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState<any[] | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    
    try {
      const parsedData = await parseTestDocument(file);
      setParsedQuestions(parsedData.questions);
      setFileUploaded(true);
      
      toast({
        title: "File processed",
        description: `${parsedData.questions.length} questions extracted successfully`,
      });
    } catch (error) {
      console.error("Error parsing file:", error);
      toast({
        title: "Error",
        description: "Failed to process the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleCreateTest = () => {
    if (!year || !semester || !parsedQuestions) {
      toast({
        title: "Validation error",
        description: "Please fill all fields and upload a valid question file",
        variant: "destructive",
      });
      return;
    }
    
    const testName = `${year}-${semester}`;
    
    createTest({
      name: testName,
      year,
      semester,
      questions: parsedQuestions,
    });
    
    navigate('/admin/dashboard');
  };
  
  return (
    <AdminLayout title="Create Test">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Exam</CardTitle>
          <CardDescription>
            Enter exam details and upload a document containing questions
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
          
          <div className="space-y-2">
            <Label>Upload Question Document</Label>
            {!fileUploaded ? (
              <FileUploader onFileUpload={handleFileUpload} accept=".docx,.txt" />
            ) : (
              <div className="rounded-lg border p-4 bg-secondary/30">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Document Uploaded Successfully</p>
                    <p className="text-sm text-muted-foreground">
                      {parsedQuestions?.length} questions extracted
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setFileUploaded(false);
                      setParsedQuestions(null);
                    }}
                  >
                    Change File
                  </Button>
                </div>
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
            onClick={handleCreateTest}
            disabled={!fileUploaded || !year || !semester || isProcessing}
          >
            Create Test
          </Button>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default CreateTest;
