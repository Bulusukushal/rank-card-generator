
import React, { useState, useEffect } from 'react';
import { useTest } from '@/contexts/TestContext';
import AdminLayout from '@/components/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Import our new components
import TestResultsTab from '@/components/leaderboard/TestResultsTab';
import YearlyToppersTab from '@/components/leaderboard/YearlyToppersTab';
import StudentSearchTab from '@/components/leaderboard/StudentSearchTab';

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
            <TestResultsTab
              tests={tests}
              selectedTest={selectedTest}
              selectedCategory={selectedCategory}
              onTestChange={handleTestChange}
              onCategoryChange={handleCategoryChange}
              getSortedResults={getSortedResults}
            />
          </TabsContent>
          
          {/* Yearly Toppers Tab */}
          <TabsContent value="yearly" className="space-y-6">
            <YearlyToppersTab
              uniqueYears={uniqueYears}
              selectedYear={selectedYear}
              yearlyToppers={yearlyToppers}
              onYearChange={setSelectedYear}
            />
          </TabsContent>
          
          {/* Student Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <StudentSearchTab
              searchRollNo={searchRollNo}
              searchResults={searchResults}
              onSearchInputChange={handleSearchInputChange}
              onSearch={handleSearch}
              getStudentRank={getStudentRank}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Leaderboard;
