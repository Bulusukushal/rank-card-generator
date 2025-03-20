
import React, { useState, useEffect } from 'react';
import { useTest } from '@/contexts/TestContext';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Trophy, Medal, User, Users } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const { tests, getStudentResults } = useTest();
  const [selectedTest, setSelectedTest] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('total');
  const [searchRollNo, setSearchRollNo] = useState<string>('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [uniqueYears, setUniqueYears] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [yearlyToppers, setYearlyToppers] = useState<any[]>([]);
  
  // Extract unique years from tests
  useEffect(() => {
    if (tests.length > 0) {
      const years = [...new Set(tests.map(test => test.year))];
      setUniqueYears(years);
      if (years.length > 0 && !selectedYear) {
        setSelectedYear(years[0]);
      }
    }
  }, [tests]);
  
  // Update yearly toppers when year changes
  useEffect(() => {
    if (selectedYear) {
      const yearTests = tests.filter(test => test.year === selectedYear);
      const allResults: any[] = [];
      
      yearTests.forEach(test => {
        const testResults = getStudentResults(test.id);
        testResults.forEach(result => {
          allResults.push({
            ...result,
            testName: test.name,
            testId: test.id,
          });
        });
      });
      
      // Sort by total score (descending)
      allResults.sort((a, b) => b.scores.total - a.scores.total);
      
      setYearlyToppers(allResults.slice(0, 10)); // Top 10 performers
    }
  }, [selectedYear, tests, getStudentResults]);
  
  // Handle test selection
  const handleTestChange = (testId: string) => {
    setSelectedTest(testId);
  };
  
  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  // Handle roll number search
  const handleSearch = () => {
    if (!searchRollNo.trim()) {
      setSearchResults([]);
      return;
    }
    
    const results: any[] = [];
    
    tests.forEach(test => {
      const testResults = getStudentResults(test.id);
      const studentResult = testResults.find(result => 
        result.rollNo.toLowerCase() === searchRollNo.toLowerCase()
      );
      
      if (studentResult) {
        results.push({
          ...studentResult,
          testName: test.name,
          testId: test.id,
        });
      }
    });
    
    setSearchResults(results);
  };
  
  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchRollNo(e.target.value);
    if (!e.target.value.trim()) {
      setSearchResults([]);
    }
  };
  
  // Get rank for a student in a particular test
  const getStudentRank = (testId: string, rollNo: string) => {
    const testResults = getStudentResults(testId);
    
    // Sort by total score (descending)
    const sortedResults = [...testResults].sort((a, b) => 
      b.scores.total - a.scores.total
    );
    
    const rank = sortedResults.findIndex(result => result.rollNo === rollNo) + 1;
    return rank > 0 ? rank : 'N/A';
  };
  
  // Get test results sorted by the selected category
  const getSortedResults = () => {
    if (!selectedTest) return [];
    
    const results = getStudentResults(selectedTest);
    
    return [...results].sort((a, b) => {
      if (selectedCategory === 'total') {
        return b.scores.total - a.scores.total;
      }
      return b.scores[selectedCategory as keyof typeof b.scores] - 
             a.scores[selectedCategory as keyof typeof a.scores];
    });
  };
  
  return (
    <AdminLayout title="Exam Leaderboard">
      <div className="space-y-8">
        <Tabs defaultValue="results" className="w-full">
          <TabsList>
            <TabsTrigger value="results">Test Results</TabsTrigger>
            <TabsTrigger value="yearly">Yearly Toppers</TabsTrigger>
            <TabsTrigger value="search">Student Search</TabsTrigger>
          </TabsList>
          
          {/* Test Results Tab */}
          <TabsContent value="results" className="space-y-6">
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
                      onValueChange={handleTestChange}
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
                      onValueChange={handleCategoryChange}
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
          </TabsContent>
          
          {/* Yearly Toppers Tab */}
          <TabsContent value="yearly" className="space-y-6">
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
                    onValueChange={setSelectedYear}
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
          </TabsContent>
          
          {/* Student Search Tab */}
          <TabsContent value="search" className="space-y-6">
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
                      onChange={handleSearchInputChange}
                    />
                  </div>
                  <div>
                    <button
                      className="flex items-center gap-2 h-10 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      onClick={handleSearch}
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
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Leaderboard;
