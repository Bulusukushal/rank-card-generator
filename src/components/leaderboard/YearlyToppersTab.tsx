
import React from 'react';
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

interface YearlyToppersTabProps {
  uniqueYears: string[];
  selectedYear: string;
  yearlyToppers: any[];
  onYearChange: (year: string) => void;
}

const YearlyToppersTab: React.FC<YearlyToppersTabProps> = ({
  uniqueYears,
  selectedYear,
  yearlyToppers,
  onYearChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Yearly Toppers</CardTitle>
        <CardDescription>
          View top performers for a specific academic year
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="w-full md:w-1/3">
          <Label htmlFor="year-select">Select Year</Label>
          <Select
            value={selectedYear}
            onValueChange={onYearChange}
          >
            <SelectTrigger id="year-select">
              <SelectValue placeholder="Select a year" />
            </SelectTrigger>
            <SelectContent>
              {uniqueYears.map(year => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Roll No</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Test</TableHead>
                <TableHead className="text-right">Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yearlyToppers.map((result, index) => (
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
                  <TableCell>{result.testName}</TableCell>
                  <TableCell className="text-right font-mono">
                    {result.scores.total}
                  </TableCell>
                </TableRow>
              ))}
              
              {yearlyToppers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No results found for this year
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default YearlyToppersTab;
