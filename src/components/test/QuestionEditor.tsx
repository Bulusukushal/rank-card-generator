
import React from 'react';
import { Question } from '@/contexts/TestContext';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface QuestionEditorProps {
  questions: Question[];
  expandedQuestions: string[];
  onExpandedQuestionsChange: (value: string[]) => void;
  onQuestionChange: (questionId: string, field: string, value: any) => void;
  onOptionChange: (questionId: string, optionIndex: number, value: string) => void;
  onDeleteQuestion: (questionId: string) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  questions,
  expandedQuestions,
  onExpandedQuestionsChange,
  onQuestionChange,
  onOptionChange,
  onDeleteQuestion
}) => {
  return (
    <Accordion 
      type="multiple" 
      value={expandedQuestions}
      onValueChange={onExpandedQuestionsChange}
      className="space-y-4"
    >
      {questions.map((question, index) => (
        <AccordionItem
          key={question.id}
          value={question.id}
          className="border rounded-lg shadow-sm"
        >
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center justify-between w-full text-left">
              <div className="flex items-center gap-2">
                <span className="font-medium">Q{index + 1}:</span>
                <span className="truncate max-w-sm">
                  {question.text || "(No question text)"}
                </span>
              </div>
              <span className="badge bg-primary/10 text-primary px-2 py-1 rounded-full text-xs capitalize">
                {question.category}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`question-${question.id}`}>Question</Label>
                <Textarea
                  id={`question-${question.id}`}
                  placeholder="Enter question text"
                  value={question.text}
                  onChange={(e) => onQuestionChange(question.id, 'text', e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Options</Label>
                {question.options.map((option: string, optIndex: number) => (
                  <div key={optIndex} className="flex gap-2 items-center">
                    <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full shrink-0">
                      {String.fromCharCode(65 + optIndex)}
                    </div>
                    <Input
                      placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                      value={option}
                      onChange={(e) => onOptionChange(question.id, optIndex, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`answer-${question.id}`}>Correct Answer</Label>
                <Select
                  value={question.answer}
                  onValueChange={(value) => onQuestionChange(question.id, 'answer', value)}
                >
                  <SelectTrigger id={`answer-${question.id}`}>
                    <SelectValue placeholder="Select correct answer" />
                  </SelectTrigger>
                  <SelectContent>
                    {question.options.map((option: string, optIndex: number) => (
                      <SelectItem 
                        key={optIndex} 
                        value={option}
                        disabled={!option}
                      >
                        {option || `Option ${String.fromCharCode(65 + optIndex)} (empty)`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteQuestion(question.id)}
                  className="flex items-center gap-1"
                >
                  <Trash2 size={16} />
                  Delete Question
                </Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default QuestionEditor;
