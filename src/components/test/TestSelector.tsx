
import React from 'react';
import { Test } from '@/contexts/TestContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface TestSelectorProps {
  tests: Test[];
  selectedTestId: string;
  onSelectTest: (testId: string) => void;
}

const TestSelector: React.FC<TestSelectorProps> = ({
  tests,
  selectedTestId,
  onSelectTest
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Test to Update</CardTitle>
        <CardDescription>
          Choose an existing test to modify its questions and details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Select 
          value={selectedTestId}
          onValueChange={onSelectTest}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a test" />
          </SelectTrigger>
          <SelectContent>
            {tests.length > 0 ? (
              tests.map((test) => (
                <SelectItem key={test.id} value={test.id}>
                  {test.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="no-tests" disabled>
                No tests available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default TestSelector;
