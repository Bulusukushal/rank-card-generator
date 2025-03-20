
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface QuestionCreatorProps {
  onAddQuestion: (category: 'coding' | 'math' | 'aptitude' | 'communication') => void;
}

const QuestionCreator: React.FC<QuestionCreatorProps> = ({ onAddQuestion }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Add New Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAddQuestion('coding')}
            className="justify-start"
          >
            <Plus size={16} className="mr-1" /> Coding
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAddQuestion('math')}
            className="justify-start"
          >
            <Plus size={16} className="mr-1" /> Mathematics
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAddQuestion('aptitude')}
            className="justify-start"
          >
            <Plus size={16} className="mr-1" /> Aptitude
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onAddQuestion('communication')}
            className="justify-start"
          >
            <Plus size={16} className="mr-1" /> Communication
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCreator;
