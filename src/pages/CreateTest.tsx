
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
import { generateDefaultQuestions } from '@/utils/questionGenerator';

const CreateTest: React.FC = () => {
  const navigate = useNavigate();
  const { createTest } = useTest();
  const { toast } = useToast();
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  
  const handleCreateTest = () => {
    if (!year || !semester) {
      toast({
        title: "Validation error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsCreating(true);
    const testName = `${year}-${semester}`;
    
    // Generate default questions for each category
    const questions = generateDefaultQuestions();
    
    createTest({
      name: testName,
      year,
      semester,
      questions,
    });
    
    toast({
      title: "Test created",
      description: `Test "${testName}" has been created with default questions`,
    });
    
    setIsCreating(false);
    navigate('/admin/dashboard');
  };
  
  return (
    <AdminLayout title="Create Test">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Create a New Exam</CardTitle>
          <CardDescription>
            Enter exam details to create a test with default questions
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
          
          <div className="rounded-lg border p-4 bg-secondary/30">
            <div className="space-y-2">
              <h3 className="font-medium">Default Questions Will Be Generated</h3>
              <p className="text-sm text-muted-foreground">
                The test will be created with a set of default questions covering:
              </p>
              <ul className="text-sm list-disc pl-5 text-muted-foreground">
                <li>Coding (5 questions)</li>
                <li>Math (5 questions)</li>
                <li>Aptitude (5 questions)</li>
                <li>Communication (5 questions)</li>
              </ul>
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
            disabled={!year || !semester || isCreating}
          >
            {isCreating ? 'Creating...' : 'Create Test'}
          </Button>
        </CardFooter>
      </Card>
    </AdminLayout>
  );
};

export default CreateTest;
