
import React from 'react';
import { Question } from '@/contexts/TestContext';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface QuestionOverviewProps {
  questions: Question[];
}

const QuestionOverview: React.FC<QuestionOverviewProps> = ({ questions }) => {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Question Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Coding:</span>
            <span className="font-medium">
              {questions.filter(q => q.category === 'coding').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Mathematics:</span>
            <span className="font-medium">
              {questions.filter(q => q.category === 'math').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Aptitude:</span>
            <span className="font-medium">
              {questions.filter(q => q.category === 'aptitude').length}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Communication:</span>
            <span className="font-medium">
              {questions.filter(q => q.category === 'communication').length}
            </span>
          </div>
          <div className="border-t my-2 pt-2 flex justify-between font-medium">
            <span>Total Questions:</span>
            <span>{questions.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionOverview;
