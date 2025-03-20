
import React from 'react';
import { Test } from '@/contexts/TestContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Trophy, Medal } from 'lucide-react';

interface TestResultsTabProps {
  tests: Test[];
  selectedTest: string;
  selectedCategory: string;
  onTestChange: (testId: string) => void;
  onCategoryChange: (category: string) => void;
  getSortedResults: () => any[];
}

const TestResultsTab: React.FC<TestResultsTabProps> = ({
  tests,
  selectedTest,
  selectedCategory,
  onTestChange,
  onCategoryChange,
  getSortedResults
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Leaderboard</CardTitle>
        <CardDescription>
          View student rankings for a specific test and category
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="test-select">Select Test</Label>
            <Select
              value={selectedTest}
              onValueChange={onTestChange}
            >
              <SelectTrigger id="test-select">
                <SelectValue placeholder="Select a test" />
              </SelectTrigger>
              <SelectContent>
                {tests.map(test => (
                  <SelectItem key={test.id} value={test.id}>
                    {test.name} ({test.questions.length} questions)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category-select">Select Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={onCategoryChange}
            >
              <SelectTrigger id="category-select">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="total">Total Score</SelectItem>
                <SelectItem value="coding">Coding</SelectItem>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="aptitude">Aptitude</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {selectedTest ? (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Rank</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getSortedResults().map((result, index) => (
                  <TableRow key={result.studentId}>
                    <TableCell className="font-medium">
                      {index === 0 && (
                        <Trophy className="h-5 w-5 text-yellow-500 inline mr-1" />
                      )}
                      {index === 1 && (
                        <Medal className="h-5 w-5 text-gray-400 inline mr-1" />
                      )}
                      {index === 2 && (
                        <Medal className="h-5 w-5 text-amber-600 inline mr-1" />
                      )}
                      {index + 1}
                    </TableCell>
                    <TableCell>{result.name}</TableCell>
                    <TableCell>{result.rollNo}</TableCell>
                    <TableCell>{result.branch} - {result.section}</TableCell>
                    <TableCell className="text-right font-mono">
                      {selectedCategory === 'total' 
                        ? result.scores.total 
                        : result.scores[selectedCategory as keyof typeof result.scores]}
                    </TableCell>
                  </TableRow>
                ))}
                
                {getSortedResults().length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No results found for this test
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Select a test to view results
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestResultsTab;
