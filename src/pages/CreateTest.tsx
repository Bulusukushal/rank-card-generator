
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
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
import FileUploader from '@/components/FileUploader';
import { AlertCircle, FileIcon } from 'lucide-react';

const CreateTest: React.FC = () => {
  const navigate = useNavigate();
  const { createTest, parseDocFile } = useTest();
  const { toast } = useToast();
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  
  const handleFileUpload = (uploadedFile: File) => {
    setFile(uploadedFile);
    setFileError(null);
  };
  
  const handleCreateTest = async () => {
    if (!year || !semester) {
      toast({
        title: "Validation error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!file) {
      toast({
        title: "File required",
        description: "Please upload a questions document",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreating(true);
    setFileError(null);
    
    try {
      const questions = await parseDocFile(file);
      const testName = `${year}-${semester}`;
      
      createTest({
        name: testName,
        year,
        semester,
        questions,
      });
      
      toast({
        title: "Test created",
        description: `Test "${testName}" has been created with ${questions.length} questions`,
      });
      
      navigate('/admin/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setFileError(error.message);
      } else {
        setFileError('An unknown error occurred. Please try again.');
      }
      
      toast({
        title: "Error creating test",
        description: "There was a problem parsing the question file",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <AdminLayout title="Create Test">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Exam</CardTitle>
          <CardDescription>
            Enter exam details and upload a question document
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
            <Label>Upload Questions Document</Label>
            <FileUploader 
              onFileUpload={handleFileUpload} 
              accept=".txt,.docx,.doc"
            />
            
            {file && !fileError && (
              <div className="flex items-center gap-2 text-sm p-2 bg-primary/5 rounded-md border border-primary/20">
                <FileIcon size={16} className="text-primary" />
                <span className="font-medium">{file.name}</span>
                <span className="text-muted-foreground">({Math.round(file.size/1024)} KB)</span>
              </div>
            )}
            
            {fileError && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-sm space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-destructive mt-0.5" />
                  <span className="font-medium text-destructive">{fileError}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="rounded-lg border p-4 bg-secondary/30">
            <div className="space-y-2">
              <h3 className="font-medium">Document Format Instructions</h3>
              <p className="text-sm text-muted-foreground">
                The uploaded document should follow this format:
              </p>
              <div className="text-sm p-3 bg-background rounded text-muted-foreground font-mono">
                <pre>
{`Category: aptitude
Question: What is the capital of France?
A) London B) Paris C) Berlin D) Madrid
Answer: Paris

Question: What does HTML stand for?
A) Hyper Text Markup Language B) High Tech Multi Language C) Hyper Transfer Markup Language D) None of the above
Answer: Hyper Text Markup Language

Category: coding
Question: What is the main use of CSS?
A) Styling B) Logic C) Database D) Authentication
Answer: Styling`}
                </pre>
              </div>
              <p className="text-sm text-muted-foreground">
                Categories must be one of: coding, math, aptitude, or communication.
              </p>
            </div>
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
            disabled={!year || !semester || !file || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Test'}
          </Button>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default CreateTest;
