
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { useTest } from '@/contexts/TestContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { PlayCircle, StopCircle, Copy, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ManageTest: React.FC = () => {
  const { tests, activeTest, startTest, endTest, getExamLink } = useTest();
  const { toast } = useToast();
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [examLink, setExamLink] = useState<string>('');

  const handleStartTest = () => {
    if (!selectedTestId) {
      toast({
        title: "Error",
        description: "Please select a test to start",
        variant: "destructive",
      });
      return;
    }

    startTest(selectedTestId);
    const link = getExamLink(selectedTestId);
    setExamLink(`${window.location.origin}${link}`);
    toast({
      title: "Test started",
      description: "Students can now access the exam",
    });
  };

  const handleEndTest = () => {
    if (!activeTest) {
      toast({
        title: "Error",
        description: "No active test to end",
        variant: "destructive",
      });
      return;
    }

    endTest(activeTest.id);
    setExamLink('');
    toast({
      title: "Test ended",
      description: "The exam has been deactivated",
    });
  };

  const copyLinkToClipboard = () => {
    if (!examLink) return;
    
    navigator.clipboard.writeText(examLink)
      .then(() => {
        toast({
          title: "Link copied",
          description: "Exam link copied to clipboard",
        });
      })
      .catch((error) => {
        console.error('Failed to copy: ', error);
        toast({
          title: "Copy failed",
          description: "Could not copy link to clipboard",
          variant: "destructive",
        });
      });
  };

  return (
    <AdminLayout title="Manage Tests">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Start or Stop Exam</CardTitle>
            <CardDescription>
              Select a test to activate or deactivate for students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Select 
                value={selectedTestId}
                onValueChange={setSelectedTestId}
                disabled={!!activeTest}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a test" />
                </SelectTrigger>
                <SelectContent>
                  {tests.length > 0 ? (
                    tests.map((test) => (
                      <SelectItem key={test.id} value={test.id}>
                        {test.name} ({test.isActive ? 'Active' : 'Inactive'})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-tests" disabled>
                      No tests available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <Button
                onClick={handleStartTest}
                disabled={!!activeTest || !selectedTestId}
                className="flex items-center gap-2"
              >
                <PlayCircle size={18} />
                Start Exam
              </Button>
              <Button
                onClick={handleEndTest}
                disabled={!activeTest}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <StopCircle size={18} />
                End Exam
              </Button>
            </div>
          </CardContent>
        </Card>

        {activeTest && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle>Active Exam: {activeTest.name}</CardTitle>
              <CardDescription>
                Share this link with students to allow them to take the exam
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  value={examLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  onClick={copyLinkToClipboard}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <Copy size={16} />
                </Button>
              </div>
              
              <div className="rounded-md bg-secondary p-4">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Share size={16} className="text-primary" />
                  <span>Student Access Information</span>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• Share this link with students via email or your course platform</li>
                  <li>• Students will need to enter their details before starting</li>
                  <li>• Results will be available after the exam ends</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageTest;
