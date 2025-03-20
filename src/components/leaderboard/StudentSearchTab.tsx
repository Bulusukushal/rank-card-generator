
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Search, User } from 'lucide-react';

interface StudentSearchTabProps {
  searchRollNo: string;
  searchResults: any[];
  onSearchInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
  getStudentRank: (testId: string, rollNo: string) => number | string;
}

const StudentSearchTab: React.FC<StudentSearchTabProps> = ({
  searchRollNo,
  searchResults,
  onSearchInputChange,
  onSearch,
  getStudentRank
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Search</CardTitle>
        <CardDescription>
          Search for a student by roll number to view their exam results
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-2">
            <Label htmlFor="roll-search">Student Roll Number</Label>
            <Input
              id="roll-search"
              placeholder="Enter roll number"
              value={searchRollNo}
              onChange={onSearchInputChange}
            />
          </div>
          <div>
            <button
              className="flex items-center gap-2 h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              onClick={onSearch}
            >
              <Search size={16} />
              <span>Search</span>
            </button>
          </div>
        </div>
        
        {searchResults.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-secondary/30 rounded-md">
              <User className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium">{searchResults[0].name}</div>
                <div className="text-sm text-muted-foreground">
                  {searchResults[0].rollNo} • {searchResults[0].branch} - {searchResults[0].section}
                </div>
              </div>
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead>Coding</TableHead>
                    <TableHead>Math</TableHead>
                    <TableHead>Aptitude</TableHead>
                    <TableHead>Communication</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map(result => (
                    <TableRow key={`${result.testId}-${result.studentId}`}>
                      <TableCell>{result.testName}</TableCell>
                      <TableCell>
                        {getStudentRank(result.testId, result.rollNo)}
                      </TableCell>
                      <TableCell>{result.scores.coding}</TableCell>
                      <TableCell>{result.scores.math}</TableCell>
                      <TableCell>{result.scores.aptitude}</TableCell>
                      <TableCell>{result.scores.communication}</TableCell>
                      <TableCell className="text-right font-mono font-medium">
                        {result.scores.total}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : searchRollNo ? (
          <div className="text-center py-8 text-muted-foreground">
            No results found for roll number: {searchRollNo}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Enter a roll number to search
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentSearchTab;
