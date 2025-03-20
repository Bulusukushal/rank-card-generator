
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TestDetailsFormProps {
  year: string;
  semester: string;
  onYearChange: (value: string) => void;
  onSemesterChange: (value: string) => void;
}

const TestDetailsForm: React.FC<TestDetailsFormProps> = ({
  year,
  semester,
  onYearChange,
  onSemesterChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          placeholder="e.g., 2023"
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="semester">Semester</Label>
        <Input
          id="semester"
          placeholder="e.g., Spring"
          value={semester}
          onChange={(e) => onSemesterChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TestDetailsForm;
