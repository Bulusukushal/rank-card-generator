
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/AdminLayout';
import { useTest, Test } from '@/contexts/TestContext';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ClipboardCopy, Play, Square, Calendar, Clock, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ManageTest: React.FC = () => {
  const navigate = useNavigate();
  const { tests, activeTest, startTest, endTest, getExamLink } = useTest();
  const { toast } = useToast();
  
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [examLink, setExamLink] = useState<string>('');
  
  const handleSelectTest = (testId: string) => {
    setSelectedTestId(testId);
    const link = getExamLink(testId);
    setExamLink(link);
  };
  
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
  };
  
  const handleEndTest = () => {
    if (activeTest) {
      endTest(activeTest.id);
    }
  };
  
  const copyLinkToClipboard = () => {
    if (examLink) {
      navigator.clipboard.writeText(window.location.origin + examLink);
      toast({
        title: "Link copied",
        description: "Exam link copied to clipboard"
      });
    }
  };
  
  return (
    <AdminLayout title="Manage Tests">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Start/Stop Exam</CardTitle>
              <CardDescription>
                Select a test to activate for students
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Select Test</p>
                {tests.length > 0 ? (
                  <Select onValueChange={handleSelectTest} value={selectedTestId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a test" />
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
              </div>
              
              {selectedTestId && (
                <div className="space-y-4">
                  <Separator />
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selected Test Information</p>
                    {(() => {
                      const test = tests.find(t => t.id === selectedTestId);
                      return test ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-secondary/40 flex items-center space-x-2">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Year & Semester</p>
                              <p className="font-medium">{test.year} - {test.semester}</p>
                            </div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-secondary/40 flex items-center space-x-2">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Date Created</p>
                              <p className="font-medium">
                                {new Date(test.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-secondary/40 flex items-center space-x-2">
                            <Users className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm text-muted-foreground">Questions</p>
                              <p className="font-medium">{test.questions.length} total</p>
                            </div>
                          </div>
                          
                          <div className="p-4 rounded-lg bg-secondary/40">
                            <p className="text-sm text-muted-foreground">Status</p>
                            <div className="flex items-center mt-1">
                              {test.isActive ? (
                                <Badge variant="default" className="bg-green-500">Active</Badge>
                              ) : (
                                <Badge variant="outline">Inactive</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    {activeTest?.id === selectedTestId ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" className="flex-1">
                            <Square className="h-4 w-4 mr-2" />
                            End Exam
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>End this exam?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will prevent students from accessing the exam. Any student currently taking the test will have their progress saved.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleEndTest}>
                              End Exam
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : (
                      <Button 
                        className="flex-1"
                        onClick={handleStartTest}
                        disabled={activeTest !== null}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Exam
                      </Button>
                    )}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          disabled={!selectedTestId}
                        >
                          <ClipboardCopy className="h-4 w-4 mr-2" />
                          Get Exam Link
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Exam Link</DialogTitle>
                          <DialogDescription>
                            Share this link with students to access the exam
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="p-4 bg-secondary/30 rounded-lg break-all">
                            {window.location.origin}{examLink}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Note: The exam link will only work if the exam is active.
                          </p>
                        </div>
                        <DialogFooter>
                          <Button onClick={copyLinkToClipboard} className="w-full">
                            <ClipboardCopy className="h-4 w-4 mr-2" />
                            Copy Link
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Active Exam</CardTitle>
              <CardDescription>
                Currently running exam details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeTest ? (
                <div className="space-y-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Active Test</p>
                    <p className="text-xl font-bold">{activeTest.name}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Year & Semester</p>
                      <p className="text-sm font-medium">{activeTest.year} - {activeTest.semester}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Questions</p>
                      <p className="text-sm font-medium">{activeTest.questions.length}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="text-sm font-medium">1 hour</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No active exam</p>
                  <p className="text-sm mt-1">
                    Start an exam to allow students to take it
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              {activeTest && (
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const link = getExamLink(activeTest.id);
                    navigator.clipboard.writeText(window.location.origin + link);
                    toast({
                      title: "Link copied",
                      description: "Exam link copied to clipboard"
                    });
                  }}
                >
                  <ClipboardCopy className="h-4 w-4 mr-2" />
                  Copy Exam Link
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <Button variant="ghost" onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </AdminLayout>
  );
};

export default ManageTest;
